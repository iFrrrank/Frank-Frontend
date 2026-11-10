import { useSyncExternalStore } from 'react'
import { fmsClosingPeriodGetCurrentMonth } from '@/api/fms/closing/period'
import { fmsAccountSetGetAccountSetList } from '@/api/fms/config/accountSet'
import { useCache } from '@/hooks/useCache'
import { FMS_ACCOUNT_USER_LEVEL } from '../utils/constants'

/** 账套简要信息 */
export interface FmsAccountSetInfo {
  id: number
  companyName: string
  level?: number
}

interface FmsStoreState {
  accountSet: FmsAccountSetInfo | null
  currentMonth: string
  accountSetList: API.FmsAccountSetRespVO[]
  accountSetListLoaded: boolean
}

const { wsCache } = useCache()
const FMS_ACCOUNT_SET_KEY = 'FMS_ACCOUNT_SET'

// 模块级状态，支持跨组件/跨页面同步响应
let state: FmsStoreState = {
  accountSet: wsCache.get(FMS_ACCOUNT_SET_KEY) || null,
  currentMonth: '',
  accountSetList: [],
  accountSetListLoaded: false
}

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

function toAccountSetInfo(accountSet: API.FmsAccountSetRespVO): FmsAccountSetInfo {
  return {
    id: accountSet.id,
    companyName: accountSet.companyName,
    level: accountSet.level
  }
}

/** 设置当前账套 */
export function setAccountSet(accountSet: FmsAccountSetInfo) {
  const changed = state.accountSet?.id !== accountSet.id
  state = {
    ...state,
    accountSet,
    currentMonth: changed ? '' : state.currentMonth
  }
  wsCache.set(FMS_ACCOUNT_SET_KEY, accountSet)
  emitChange()
}

/** 清空当前账套 */
export function clearAccountSet() {
  state = {
    ...state,
    accountSet: null,
    currentMonth: ''
  }
  wsCache.delete(FMS_ACCOUNT_SET_KEY)
  emitChange()
}

/** 加载并缓存当前账套的当前会计期间 */
export async function loadCurrentMonth(force = false): Promise<string> {
  const accountSetId = state.accountSet?.id
  if (!accountSetId) {
    if (state.currentMonth !== '') {
      state = { ...state, currentMonth: '' }
      emitChange()
    }
    return ''
  }
  if (!force && state.currentMonth) {
    return state.currentMonth
  }
  try {
    const resp = await fmsClosingPeriodGetCurrentMonth({ accountSetId })
    const month = resp?.data || ''
    if (state.accountSet?.id === accountSetId) {
      state = { ...state, currentMonth: month }
      emitChange()
    }
    return state.currentMonth
  } catch {
    return state.currentMonth
  }
}

/** 加载当前用户可访问的账套列表，并校准当前账套 */
export async function loadAccountSetList(): Promise<API.FmsAccountSetRespVO[]> {
  try {
    const resp = await fmsAccountSetGetAccountSetList()
    const list = resp?.data || []
    let nextAccountSet = state.accountSet
    let nextCurrentMonth = state.currentMonth

    if (!list.length) {
      nextAccountSet = null
      nextCurrentMonth = ''
      wsCache.delete(FMS_ACCOUNT_SET_KEY)
    } else {
      const matched =
        list.find((item) => item.id === state.accountSet?.id && item.initialized) ||
        list.find((item) => item.defaultStatus && item.initialized) ||
        list.find((item) => item.initialized)
      if (matched) {
        if (state.accountSet?.id !== matched.id) {
          nextCurrentMonth = ''
        }
        nextAccountSet = toAccountSetInfo(matched)
        wsCache.set(FMS_ACCOUNT_SET_KEY, nextAccountSet)
      } else {
        nextAccountSet = null
        nextCurrentMonth = ''
        wsCache.delete(FMS_ACCOUNT_SET_KEY)
      }
    }

    state = {
      accountSet: nextAccountSet,
      currentMonth: nextCurrentMonth,
      accountSetList: list,
      accountSetListLoaded: true
    }
    emitChange()
    return list
  } catch {
    state = { ...state, accountSetListLoaded: true }
    emitChange()
    return state.accountSetList
  }
}

/**
 * FMS 全局状态 Hook（管理当前账套、会计期间、可访问账套列表与读写权限）
 */
export function useFmsStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot)
  const accountSetId = snap.accountSet?.id
  const accountSetLevel = snap.accountSet?.level
  const isAccountSetWritable =
    Boolean(snap.accountSet) &&
    (snap.accountSet?.level === FMS_ACCOUNT_USER_LEVEL.OWNER ||
      snap.accountSet?.level === FMS_ACCOUNT_USER_LEVEL.WRITE)

  return {
    accountSet: snap.accountSet,
    accountSetId,
    accountSetLevel,
    isAccountSetWritable,
    currentMonth: snap.currentMonth,
    accountSetList: snap.accountSetList,
    accountSetListLoaded: snap.accountSetListLoaded,
    setAccountSet,
    clearAccountSet,
    loadCurrentMonth,
    loadAccountSetList
  }
}
