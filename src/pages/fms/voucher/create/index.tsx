import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  Button,
  Card,
  DatePicker,
  Dropdown,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  Tabs,
  Tag,
  message
} from 'antd'
import {
  BookOutlined,
  CheckOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  PlusOutlined,
  PrinterOutlined,
  RightOutlined,
  SaveOutlined,
  UndoOutlined
} from '@ant-design/icons'
import { history, useSearchParams } from '@umijs/max'
import dayjs from 'dayjs'
import { fmsAuxiliaryItemGetAuxiliaryItemSimpleList } from '@/api/fms/config/auxiliaryItem'
import { fmsAuxiliaryTypeGetAuxiliaryTypeSimpleList } from '@/api/fms/config/auxiliaryType'
import { fmsSubjectGetSubjectSimpleList } from '@/api/fms/config/subject'
import { fmsVoucherWordGetVoucherWordSimpleList } from '@/api/fms/config/voucherWord'
import {
  fmsVoucherCreateVoucher,
  fmsVoucherDeleteVoucherList,
  fmsVoucherGetNextVoucherNumber,
  fmsVoucherGetVoucher,
  fmsVoucherGetVoucherAuxiliaryBalance,
  fmsVoucherGetVoucherSubjectBalanceList,
  fmsVoucherUpdateVoucher,
  fmsVoucherUpdateVoucherReviewStatus
} from '@/api/fms/voucher'
import { useHasPermi } from '@/directives/permission/HasPermi'
import { handleTree, treeToList } from '@/utils/tree'
import FmsAuxiliaryItemForm from '../../config/auxiliary/item/FmsAuxiliaryItemForm'
import FmsDigestLibrary, {
  type FmsDigestLibraryRef
} from '../../config/digest/components/FmsDigestLibrary'
import FmsSubjectForm from '../../config/subject/FmsSubjectForm'
import FmsVoucherTemplateSaveForm, {
  type FmsVoucherTemplateSaveFormRef
} from '../../config/voucher-template/components/FmsVoucherTemplateSaveForm'
import FmsVoucherTemplateSelect, {
  type FmsVoucherTemplateSelectRef
} from '../../config/voucher-template/components/FmsVoucherTemplateSelect'
import FmsVoucherWordSelect from '../../config/voucher-word/components/FmsVoucherWordSelect'
import { useFmsStore } from '../../store/fms'
import {
  FMS_AUXILIARY_TYPE,
  FMS_DEBIT_CREDIT_DIRECTION,
  FMS_SUBJECT_STATUS,
  FMS_SUBJECT_TYPE,
  FMS_SUBJECT_TYPE_OPTIONS,
  FMS_VOUCHER_STATUS
} from '../../utils/constants'
import {
  formatMoney,
  formatSubjectBalanceText,
  formatSubjectDisplay,
  toChineseMoney
} from '../../utils/format'
import FmsVoucherPrintForm, {
  type FmsVoucherPrintFormRef
} from '../components/FmsVoucherPrintForm'
import FmsVoucherShortcutHelp from './FmsVoucherShortcutHelp'

const MONEY_UNITS = ['亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分']

interface VoucherEntryAuxiliaryForm {
  type?: number
  typeId: number
  itemId?: number
  code?: string
  name?: string
}

interface VoucherEntryForm {
  rowKey: string
  id?: number
  digest: string
  subjectId?: number
  subjectCode?: string
  subjectName?: string
  quantity?: number
  unitPrice?: number
  debitAmount?: number
  creditAmount?: number
  auxiliaries: VoucherEntryAuxiliaryForm[]
}

let entryRowSeed = 1
function createEmptyEntry(): VoucherEntryForm {
  return {
    rowKey: `entry-${entryRowSeed++}`,
    digest: '',
    auxiliaries: []
  }
}

function padDefaultEntries(list: VoucherEntryForm[]): VoucherEntryForm[] {
  const next = [...list]
  while (next.length < 4) {
    next.push(createEmptyEntry())
  }
  return next
}

/**
 * 记账凭证录入/编辑/查看页面
 */
const VoucherCreatePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const queryVoucherId = Number(searchParams.get('id') || 0) || undefined
  const copyFromId = Number(searchParams.get('copyFrom') || 0) || undefined
  const navIdsStr = searchParams.get('ids') || ''

  const [loading, setLoading] = useState(false)
  const [voucherWords, setVoucherWords] = useState<API.FmsVoucherWordRespVO[]>([])
  const [subjectTree, setSubjectTree] = useState<API.FmsSubjectRespVO[]>([])
  const [auxiliaryTypes, setAuxiliaryTypes] = useState<
    API.FmsAuxiliaryTypeRespVO[]
  >([])
  const [auxiliaryOptions, setAuxiliaryOptions] = useState<
    Record<number, API.FmsAuxiliaryItemRespVO[]>
  >({})
  const [subjectBalances, setSubjectBalances] = useState<
    API.FmsVoucherSubjectBalanceRespVO[]
  >([])
  const [auxiliaryBalances, setAuxiliaryBalances] = useState<
    Record<string, API.FmsVoucherSubjectBalanceRespVO>
  >({})

  const [detail, setDetail] = useState<API.FmsVoucherRespVO | undefined>()
  const [voucherId, setVoucherId] = useState<number | undefined>()
  const [voucherWordId, setVoucherWordId] = useState<number | undefined>()
  const [voucherNumber, setVoucherNumber] = useState<number | undefined>(1)
  const [voucherTime, setVoucherTime] = useState<number>(
    dayjs().startOf('day').valueOf()
  )
  const [attachmentCount, setAttachmentCount] = useState<number>(0)
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([])
  const [entries, setEntries] = useState<VoucherEntryForm[]>(() =>
    padDefaultEntries([])
  )

  const [subjectFilterType, setSubjectFilterType] = useState<number>(
    FMS_SUBJECT_TYPE.ASSET
  )
  const [focusedEntryKey, setFocusedEntryKey] = useState<string>('')
  const [focusedDirection, setFocusedDirection] = useState<
    'debit' | 'credit' | undefined
  >()

  // 弹窗状态与引用
  const [subjectFormVisible, setSubjectFormVisible] = useState(false)
  const [creatingSubjectType, setCreatingSubjectType] = useState<number>(
    FMS_SUBJECT_TYPE.ASSET
  )
  const [auxItemFormVisible, setAuxItemFormVisible] = useState(false)
  const [creatingAuxType, setCreatingAuxType] = useState<
    API.FmsAuxiliaryTypeRespVO | undefined
  >()

  const entryTableWrapRef = useRef<HTMLDivElement>(null)
  const digestLibraryRef = useRef<FmsDigestLibraryRef>(null)
  const digestTargetIndexRef = useRef<number | undefined>(undefined)
  const templateSaveFormRef = useRef<FmsVoucherTemplateSaveFormRef>(null)
  const templateSelectRef = useRef<FmsVoucherTemplateSelectRef>(null)
  const printFormRef = useRef<FmsVoucherPrintFormRef>(null)

  const flatSubjects = useMemo(
    () => treeToList<API.FmsSubjectRespVO[]>([...subjectTree]),
    [subjectTree]
  )

  const leafSubjects = useMemo(
    () =>
      flatSubjects.filter(
        (s: API.FmsSubjectRespVO) =>
          s.status === FMS_SUBJECT_STATUS.ENABLED &&
          !(s as any).children?.length
      ),
    [flatSubjects]
  )

  const auxiliaryTypeMap = useMemo(
    () => new Map(auxiliaryTypes.map((t) => [t.id, t])),
    [auxiliaryTypes]
  )

  const departmentTypeId = useMemo(
    () =>
      auxiliaryTypes.find((t) => t.type === FMS_AUXILIARY_TYPE.DEPARTMENT)?.id,
    [auxiliaryTypes]
  )

  const subjectBalanceMap = useMemo(
    () => new Map(subjectBalances.map((item) => [item.subjectId, item])),
    [subjectBalances]
  )

  const getSubject = useCallback(
    (id?: number) => flatSubjects.find((s: API.FmsSubjectRespVO) => s.id === id),
    [flatSubjects]
  )

  const currentAccountWritable = fmsStore.isAccountSetWritable

  /** 是否只读模式 */
  const readOnly = useMemo(() => {
    if (!currentAccountWritable) return true
    if (voucherId) {
      if (!hasPermi('fms:voucher:update')) return true
      if (detail?.closingGenerated) return true
      if (detail?.status === FMS_VOUCHER_STATUS.APPROVED) return true
      return false
    }
    return !hasPermi('fms:voucher:create')
  }, [currentAccountWritable, voucherId, detail, hasPermi])

  const canSave = !readOnly
  const canSaveAndCreate = !readOnly && hasPermi('fms:voucher:create')
  const canReview =
    currentAccountWritable &&
    Boolean(voucherId) &&
    !detail?.closingGenerated &&
    detail?.status === FMS_VOUCHER_STATUS.PENDING_REVIEW &&
    hasPermi('fms:voucher:review')
  const canUnreview =
    currentAccountWritable &&
    Boolean(voucherId) &&
    !detail?.closingGenerated &&
    detail?.status === FMS_VOUCHER_STATUS.APPROVED &&
    hasPermi('fms:voucher:review')
  const canDelete =
    currentAccountWritable &&
    Boolean(voucherId) &&
    !detail?.closingGenerated &&
    detail?.status !== FMS_VOUCHER_STATUS.APPROVED &&
    hasPermi('fms:voucher:delete')

  /** 是否展示数量/单价列 */
  const showQuantityColumn = useMemo(
    () =>
      entries.some((entry) => {
        const subj = getSubject(entry.subjectId)
        return Boolean(subj?.quantityAccounting || entry.quantity || entry.unitPrice)
      }),
    [entries, getSubject]
  )

  const debitTotal = useMemo(
    () =>
      Number(
        entries
          .reduce((sum, item) => sum + Number(item.debitAmount || 0), 0)
          .toFixed(2)
      ),
    [entries]
  )

  const creditTotal = useMemo(
    () =>
      Number(
        entries
          .reduce((sum, item) => sum + Number(item.creditAmount || 0), 0)
          .toFixed(2)
      ),
    [entries]
  )

  const balanced = debitTotal > 0 && debitTotal === creditTotal

  /** 相邻凭证导航 ID */
  const voucherNavIds = useMemo(
    () =>
      navIdsStr
        .split(',')
        .map((val) => Number(val))
        .filter((val) => Number.isInteger(val) && val > 0),
    [navIdsStr]
  )

  const currentNavIndex = voucherId
    ? voucherNavIds.indexOf(voucherId)
    : -1
  const prevVoucherId =
    currentNavIndex > 0 ? voucherNavIds[currentNavIndex - 1] : undefined
  const nextVoucherId =
    currentNavIndex >= 0 && currentNavIndex < voucherNavIds.length - 1
      ? voucherNavIds[currentNavIndex + 1]
      : undefined

  /** 加载当前凭证日期所在月份的科目实时余额 */
  const loadSubjectBalances = useCallback(
    async (accId: number, vTime: number) => {
      if (!accId || !vTime) return
      const month = dayjs(vTime).format('YYYY-MM')
      const resp = await fmsVoucherGetVoucherSubjectBalanceList({
        accountSetId: accId,
        month
      })
      if (resp.code === 0) {
        setSubjectBalances(resp.data || [])
      }
    },
    []
  )

  /** 加载单条分录的辅助核算项目选项与组合余额 */
  const loadEntryAuxiliaryData = useCallback(
    async (
      accId: number,
      vTime: number,
      entry: VoucherEntryForm,
      subjList: API.FmsSubjectRespVO[]
    ) => {
      const subj = subjList.find((s) => s.id === entry.subjectId)
      const typeIds = subj?.auxiliaryTypeIds || []
      if (!accId || !subj || !typeIds.length) return

      // 1. 加载各辅助核算类别的选项
      await Promise.all(
        typeIds.map(async (tId: number) => {
          const resp = await fmsAuxiliaryItemGetAuxiliaryItemSimpleList({
            accountSetId: accId,
            auxiliaryTypeId: tId
          })
          if (resp.code === 0) {
            setAuxiliaryOptions((prev) => ({
              ...prev,
              [tId]: resp.data || []
            }))
          }
        })
      )

      // 2. 若已选齐所有辅助核算项，加载辅助核算组合余额
      const itemIds = typeIds.map(
        (tId: number) => entry.auxiliaries.find((a) => a.typeId === tId)?.itemId
      )
      if (itemIds.every((id: number | undefined) => Boolean(id))) {
        const month = dayjs(vTime).format('YYYY-MM')
        const resp = await fmsVoucherGetVoucherAuxiliaryBalance({
          accountSetId: accId,
          month,
          subjectId: subj.id,
          auxiliaryItemIds: itemIds as number[]
        })
        if (resp.code === 0 && resp.data) {
          setAuxiliaryBalances((prev) => ({
            ...prev,
            [entry.rowKey]: resp.data!
          }))
        }
      }
    },
    []
  )

  /** 获取下一可用凭证号 */
  const fetchNextVoucherNumber = useCallback(
    async (accId: number, wordId?: number, vTime?: number) => {
      if (!accId || !wordId || !vTime) return
      const resp = await fmsVoucherGetNextVoucherNumber({
        accountSetId: accId,
        voucherWordId: wordId,
        voucherTime: dayjs(vTime).format('YYYY-MM-DD')
      })
      if (resp.code === 0 && resp.data) {
        setVoucherNumber(resp.data)
      }
    },
    []
  )

  /** 获取默认凭证日期 */
  const getDefaultVoucherTime = (curMonth?: string) => {
    const today = dayjs().startOf('day')
    if (!curMonth) return today.valueOf()
    const currentPeriodEnd = dayjs(`${curMonth}-01`).endOf('month').startOf('day')
    return today.isBefore(currentPeriodEnd, 'day')
      ? today.valueOf()
      : currentPeriodEnd.valueOf()
  }

  /** 初始化页面数据 */
  const initPage = useCallback(async () => {
    if (!fmsStore.accountSetId) return
    const accId = fmsStore.accountSetId
    setLoading(true)
    try {
      const [wordResp, subjResp, auxTypeResp, curMonth] = await Promise.all([
        fmsVoucherWordGetVoucherWordSimpleList({ accountSetId: accId }),
        fmsSubjectGetSubjectSimpleList({ accountSetId: String(accId) }),
        fmsAuxiliaryTypeGetAuxiliaryTypeSimpleList({ accountSetId: accId }),
        fmsStore.loadCurrentMonth()
      ])
      const words = wordResp.data || []
      const rawSubjs = subjResp.data || []
      const auxTypes = auxTypeResp.data || []
      setVoucherWords(words)
      setSubjectTree(handleTree(rawSubjs))
      setAuxiliaryTypes(auxTypes)

      if (queryVoucherId) {
        // 加载详情
        const detailResp = await fmsVoucherGetVoucher({
          accountSetId: accId,
          id: queryVoucherId
        })
        if (detailResp.code === 0 && detailResp.data) {
          const v = detailResp.data
          const vTimeMs = dayjs(v.voucherTime).valueOf()
          setDetail(v)
          setVoucherId(v.id)
          setVoucherWordId(v.voucherWordId)
          setVoucherNumber(v.voucherNumber)
          setVoucherTime(vTimeMs)
          setAttachmentCount(v.attachmentCount || 0)
          setAttachmentUrls([...(v.attachmentUrls || [])])
          const mappedEntries = padDefaultEntries(
            (v.entries || []).map((e) => ({
              ...e,
              rowKey: `entry-${entryRowSeed++}`,
              auxiliaries: (e.auxiliaries || []).map((a) => ({ ...a }))
            }))
          )
          setEntries(mappedEntries)
          await Promise.all([
            loadSubjectBalances(accId, vTimeMs),
            ...mappedEntries.map((entry) =>
              loadEntryAuxiliaryData(accId, vTimeMs, entry, rawSubjs)
            )
          ])
        }
      } else if (copyFromId) {
        // 复制模式
        const srcResp = await fmsVoucherGetVoucher({
          accountSetId: accId,
          id: copyFromId
        })
        const defaultTime = getDefaultVoucherTime(curMonth)
        const src = srcResp.data
        const defaultWordId =
          src?.voucherWordId ||
          words.find((w) => w.defaultStatus)?.id ||
          words[0]?.id
        setDetail(undefined)
        setVoucherId(undefined)
        setVoucherWordId(defaultWordId)
        setVoucherTime(defaultTime)
        setAttachmentCount(0)
        setAttachmentUrls([])
        const mappedEntries = padDefaultEntries(
          (src?.entries || []).map((e) => ({
            ...e,
            id: undefined,
            rowKey: `entry-${entryRowSeed++}`,
            auxiliaries: (e.auxiliaries || []).map((a) => ({ ...a }))
          }))
        )
        setEntries(mappedEntries)
        await Promise.all([
          fetchNextVoucherNumber(accId, defaultWordId, defaultTime),
          loadSubjectBalances(accId, defaultTime),
          ...mappedEntries.map((entry) =>
            loadEntryAuxiliaryData(accId, defaultTime, entry, rawSubjs)
          )
        ])
      } else {
        // 新增空白凭证
        const defaultWordId =
          words.find((w) => w.defaultStatus)?.id || words[0]?.id
        const defaultTime = getDefaultVoucherTime(curMonth)
        setDetail(undefined)
        setVoucherId(undefined)
        setVoucherWordId(defaultWordId)
        setVoucherTime(defaultTime)
        setAttachmentCount(0)
        setAttachmentUrls([])
        setEntries(padDefaultEntries([]))
        setAuxiliaryBalances({})
        await Promise.all([
          fetchNextVoucherNumber(accId, defaultWordId, defaultTime),
          loadSubjectBalances(accId, defaultTime)
        ])
      }
    } finally {
      setLoading(false)
    }
  }, [
    fmsStore.accountSetId,
    queryVoucherId,
    copyFromId,
    fetchNextVoucherNumber,
    loadSubjectBalances,
    loadEntryAuxiliaryData
  ])

  useEffect(() => {
    initPage()
  }, [initPage])

  /** 重置为空白凭证 */
  const resetToNewVoucher = async () => {
    if (queryVoucherId || copyFromId) {
      history.replace('/fms/voucher/create')
      return
    }
    await initPage()
  }

  /** 将金额转为 11 位金额格数字数组 */
  const getMoneyDigits = (value?: number, showZero = false) => {
    if (!showZero && !value) return []
    const digits = String(Math.round(Math.abs(Number(value) || 0) * 100)).split('')
    const padded = Array(Math.max(0, 11 - digits.length))
      .fill('')
      .concat(digits.slice(-11))
    return padded
  }

  /** 更新指定分录行 */
  const updateEntryAt = (
    index: number,
    updater: (prev: VoucherEntryForm) => VoucherEntryForm
  ) => {
    setEntries((prev) => prev.map((item, i) => (i === index ? updater(item) : item)))
  }

  /** 空摘要聚焦时自动沿用上一行摘要 */
  const handleDigestFocus = (index: number) => {
    if (index > 0 && !entries[index]?.digest?.trim() && entries[index - 1]?.digest) {
      const prevDigest = entries[index - 1].digest
      updateEntryAt(index, (item) => ({ ...item, digest: prevDigest }))
    }
  }

  /** 处理分录科目切换 */
  const handleSubjectChange = async (index: number, nextSubjectId?: number) => {
    const subj = getSubject(nextSubjectId)
    const nextAuxiliaries: VoucherEntryAuxiliaryForm[] = (
      subj?.auxiliaryTypeIds || []
    ).map((tId: number) => ({
      type: auxiliaryTypeMap.get(tId)?.type,
      typeId: tId
    }))
    const updatedEntry: VoucherEntryForm = {
      ...entries[index],
      subjectId: nextSubjectId,
      subjectCode: subj?.code,
      subjectName: subj?.name,
      quantity: undefined,
      unitPrice: undefined,
      auxiliaries: nextAuxiliaries
    }
    updateEntryAt(index, () => updatedEntry)
    if (fmsStore.accountSetId) {
      await loadEntryAuxiliaryData(
        fmsStore.accountSetId,
        voucherTime,
        updatedEntry,
        flatSubjects
      )
    }
  }

  /** 处理辅助核算项选择变更 */
  const handleAuxiliaryItemChange = async (
    index: number,
    typeId: number,
    itemId?: number
  ) => {
    const opt = (auxiliaryOptions[typeId] || []).find((o) => o.id === itemId)
    const currentEntry = entries[index]
    const nextAuxiliaries = currentEntry.auxiliaries.some((a) => a.typeId === typeId)
      ? currentEntry.auxiliaries.map((a) =>
          a.typeId === typeId
            ? { ...a, itemId, code: opt?.code, name: opt?.name }
            : a
        )
      : [
          ...currentEntry.auxiliaries,
          {
            type: auxiliaryTypeMap.get(typeId)?.type,
            typeId,
            itemId,
            code: opt?.code,
            name: opt?.name
          }
        ]
    const updatedEntry: VoucherEntryForm = {
      ...currentEntry,
      auxiliaries: nextAuxiliaries
    }
    updateEntryAt(index, () => updatedEntry)
    if (fmsStore.accountSetId) {
      await loadEntryAuxiliaryData(
        fmsStore.accountSetId,
        voucherTime,
        updatedEntry,
        flatSubjects
      )
    }
  }

  /** 根据数量与单价自动计算金额 */
  const handleQtyOrPriceChange = (
    index: number,
    field: 'quantity' | 'unitPrice',
    val: number | null
  ) => {
    updateEntryAt(index, (prev) => {
      const next = { ...prev, [field]: val ?? undefined }
      if (next.quantity && next.unitPrice) {
        const amount = Math.floor(next.quantity * next.unitPrice * 100) / 100
        const subj = getSubject(next.subjectId)
        if (subj?.balanceDirection === FMS_DEBIT_CREDIT_DIRECTION.CREDIT) {
          next.creditAmount = amount
          next.debitAmount = undefined
        } else {
          next.debitAmount = amount
          next.creditAmount = undefined
        }
      }
      return next
    })
  }

  /** 借贷金额互斥更新 */
  const handleAmountChange = (
    index: number,
    direction: 'debit' | 'credit',
    val: number | null
  ) => {
    updateEntryAt(index, (prev) => {
      if (direction === 'debit') {
        return {
          ...prev,
          debitAmount: val ?? undefined,
          creditAmount: val !== null && val !== undefined ? undefined : prev.creditAmount
        }
      }
      return {
        ...prev,
        creditAmount: val ?? undefined,
        debitAmount: val !== null && val !== undefined ? undefined : prev.debitAmount
      }
    })
  }

  /** 自动找平指定分录差额（快捷键 =） */
  const balanceEntryAt = (index: number, direction: 'debit' | 'credit') => {
    const entry = entries[index]
    if (!entry) return
    const curDebit = Number(entry.debitAmount || 0)
    const curCredit = Number(entry.creditAmount || 0)
    const debitWithout = Number((debitTotal - curDebit).toFixed(2))
    const creditWithout = Number((creditTotal - curCredit).toFixed(2))
    const diff = creditWithout - debitWithout
    if (!diff) return
    updateEntryAt(index, (prev) =>
      direction === 'credit'
        ? {
            ...prev,
            creditAmount: Number((-diff).toFixed(2)),
            debitAmount: undefined
          }
        : {
            ...prev,
            debitAmount: Number(diff.toFixed(2)),
            creditAmount: undefined
          }
    )
  }

  /** 格式化分录科目实时余额 */
  const formatEntryBalance = (entry: VoucherEntryForm) => {
    const subj = getSubject(entry.subjectId)
    const balanceObj = subj?.auxiliaryTypeIds?.length
      ? auxiliaryBalances[entry.rowKey]
      : entry.subjectId
        ? subjectBalanceMap.get(entry.subjectId)
        : undefined
    return formatSubjectBalanceText(
      balanceObj?.balance,
      balanceObj?.balanceDirection
    )
  }

  /** 判断分录是否完全空白 */
  const isEntryEmpty = (entry: VoucherEntryForm) =>
    !(
      entry.digest?.trim() ||
      entry.subjectId ||
      entry.quantity ||
      entry.unitPrice ||
      entry.debitAmount ||
      entry.creditAmount ||
      entry.auxiliaries.some((a) => a.itemId)
    )

  /** 校验并构建有效分录列表 */
  const validateAndBuildEntries = (isTemplate = false): API.FmsVoucherEntrySaveReqVO[] | undefined => {
    const filled = entries
      .filter((e) => !isEntryEmpty(e))
      .map((e) => ({ ...e }))

    if (filled.length < 2) {
      message.warning(
        isTemplate ? '凭证模板至少需要两条有效分录' : '凭证至少需要两条有效分录'
      )
      return undefined
    }

    // 依次补齐空摘要
    filled.forEach((entry, idx) => {
      if (idx > 0 && !entry.digest?.trim()) {
        entry.digest = filled[idx - 1].digest
      }
    })

    for (const entry of filled) {
      const subj = getSubject(entry.subjectId)
      if (!subj) {
        message.warning('请选择每条分录的会计科目')
        return undefined
      }
      if (
        subj.status !== FMS_SUBJECT_STATUS.ENABLED ||
        (subj as any).children?.length
      ) {
        message.warning(`会计科目“${subj.name}”已停用或不是末级科目，请重新选择`)
        return undefined
      }
      if (!entry.digest?.trim()) {
        message.warning('请填写每条分录的摘要')
        return undefined
      }
      const d = Number(entry.debitAmount || 0)
      const c = Number(entry.creditAmount || 0)
      if (d !== 0 && c !== 0) {
        message.warning('同一条分录不能同时填写借方和贷方金额')
        return undefined
      }
      if (d === 0 && c === 0) {
        message.warning('请填写每条分录的借方或贷方金额')
        return undefined
      }
      const reqTypeIds = subj.auxiliaryTypeIds || []
      if (
        reqTypeIds.some(
          (tId: number) => !entry.auxiliaries.find((a) => a.typeId === tId)?.itemId
        )
      ) {
        message.warning(`请完整选择“${subj.name}”的辅助核算项目`)
        return undefined
      }
    }

    if (!balanced) {
      message.warning(
        isTemplate ? '凭证模板借贷金额不平衡' : '凭证借贷金额不平衡'
      )
      return undefined
    }

    return filled.map((entry) => {
      const subj = getSubject(entry.subjectId)!
      return {
        id: entry.id,
        digest: entry.digest.trim(),
        subjectId: entry.subjectId!,
        subjectCode: subj.code,
        subjectName: subj.name,
        quantity: entry.quantity,
        unitPrice: entry.unitPrice,
        debitAmount: entry.debitAmount,
        creditAmount: entry.creditAmount,
        auxiliaries: (subj.auxiliaryTypeIds || []).map((tId: number) => ({
          typeId: tId,
          itemId: entry.auxiliaries.find((a) => a.typeId === tId)!.itemId!
        }))
      }
    })
  }

  /** 提交保存凭证 */
  const handleSave = async (saveAndCreate: boolean) => {
    if (!fmsStore.accountSetId) return
    if (!voucherWordId || voucherNumber === undefined || !voucherTime) {
      message.warning('请完整填写凭证字、凭证号和凭证日期')
      return
    }
    if (!Number.isInteger(voucherNumber) || voucherNumber <= 0) {
      message.warning('凭证号必须为正整数')
      return
    }
    if (!Number.isInteger(attachmentCount) || attachmentCount < 0) {
      message.warning('附单据张数必须为非负整数')
      return
    }
    const validEntries = validateAndBuildEntries(false)
    if (!validEntries) return

    setLoading(true)
    try {
      const payload: API.FmsVoucherSaveReqVO = {
        id: voucherId,
        accountSetId: fmsStore.accountSetId,
        voucherWordId,
        voucherNumber,
        voucherTime: dayjs(voucherTime).format('YYYY-MM-DD'),
        attachmentCount,
        ...(attachmentUrls?.length ? { attachmentUrls } : {}),
        entries: validEntries
      } as API.FmsVoucherSaveReqVO
      let savedId = voucherId
      if (voucherId) {
        const resp = await fmsVoucherUpdateVoucher(payload)
        if (resp.code !== 0) return
      } else {
        const resp = await fmsVoucherCreateVoucher(payload)
        if (resp.code !== 0) return
        savedId = resp.data
      }
      message.success('保存成功')
      if (saveAndCreate) {
        await resetToNewVoucher()
      } else if (savedId && queryVoucherId === savedId) {
        await initPage()
      } else if (savedId) {
        history.replace(`/fms/voucher/create?id=${savedId}`)
      }
    } finally {
      setLoading(false)
    }
  }

  /** 审核或反审核当前凭证 */
  const handleReview = (targetStatus: number) => {
    if (!fmsStore.accountSetId || !voucherId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content:
        targetStatus === FMS_VOUCHER_STATUS.APPROVED
          ? '确认审核该凭证吗？'
          : '确认反审核该凭证吗？',
      onOk: async () => {
        const resp = await fmsVoucherUpdateVoucherReviewStatus({
          accountSetId: fmsStore.accountSetId!,
          ids: [voucherId],
          status: targetStatus
        })
        if (resp.code === 0) {
          message.success('操作成功')
          await initPage()
        }
      }
    })
  }

  /** 删除当前凭证 */
  const handleDelete = () => {
    if (!fmsStore.accountSetId || !voucherId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除该凭证吗？删除后会产生凭证断号',
      onOk: async () => {
        const resp = await fmsVoucherDeleteVoucherList({
          accountSetId: fmsStore.accountSetId!,
          ids: [voucherId]
        })
        if (resp.code === 0) {
          message.success('删除成功')
          await resetToNewVoucher()
        }
      }
    })
  }

  /** 套用凭证模板 */
  const handleApplyTemplate = async (template: API.FmsVoucherTemplateRespVO) => {
    const unavailable = (template.entries || []).find((entry) => {
      const subj = getSubject(entry.subjectId)
      return (
        !subj ||
        subj.status !== FMS_SUBJECT_STATUS.ENABLED ||
        (subj as any).children?.length
      )
    })
    if (unavailable) {
      message.error('模板包含当前账套不可用的会计科目，暂不能套用')
      return
    }
    const mapped = padDefaultEntries(
      (template.entries || []).map((entry) => ({
        ...entry,
        rowKey: `entry-${entryRowSeed++}`,
        auxiliaries: (entry.auxiliaries || []).map((a) => ({ ...a }))
      }))
    )
    setEntries(mapped)
    if (fmsStore.accountSetId) {
      await Promise.all(
        mapped.map((e) =>
          loadEntryAuxiliaryData(
            fmsStore.accountSetId!,
            voucherTime,
            e,
            flatSubjects
          )
        )
      )
    }
    message.success(`已套用凭证模板“${template.name}”`)
  }

  /** 注册全局快捷键（Ctrl+S / F12 / Alt+N） */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || event.repeat || loading) return
      const key = event.key.toLowerCase()
      if ((event.ctrlKey || event.metaKey) && key === 's') {
        event.preventDefault()
        if (canSave) handleSave(false)
      } else if (event.key === 'F12') {
        event.preventDefault()
        if (canSaveAndCreate) handleSave(true)
      } else if (event.altKey && key === 'n') {
        event.preventDefault()
        if (currentAccountWritable && hasPermi('fms:voucher:create')) {
          resetToNewVoucher()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  /** 表格内键盘事件（= 自动找平、Enter 跳格/自动加行） */
  const handleTableKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly || loading || event.nativeEvent.isComposing) return
    const target = event.target as HTMLElement
    if (!(target instanceof HTMLInputElement)) return
    const tr = target.closest<HTMLTableRowElement>('tr[data-entry-index]')
    if (!tr) return
    const idx = Number(tr.dataset.entryIndex)

    if (event.key === '=' && target.closest('[data-entry-money]')) {
      event.preventDefault()
      const dir = target.closest<HTMLElement>('[data-entry-direction]')?.dataset
        .entryDirection as 'debit' | 'credit' | undefined
      balanceEntryAt(idx, dir || 'debit')
      return
    }

    if (event.key === 'Enter' && target.getAttribute('aria-expanded') !== 'true') {
      event.preventDefault()
      const inputs = Array.from(
        entryTableWrapRef.current?.querySelectorAll<HTMLInputElement>(
          'tbody input:not([disabled])'
        ) || []
      )
      const currentIdx = inputs.indexOf(target)
      if (currentIdx >= 0 && currentIdx < inputs.length - 1) {
        inputs[currentIdx + 1]?.focus()
      } else if (currentIdx === inputs.length - 1) {
        setEntries((prev) => [...prev, createEmptyEntry()])
      }
    }
  }

  /** 渲染 11 位金额格背景样式 */
  const moneyGridBgStyle: React.CSSProperties = {
    backgroundImage: [
      'linear-gradient(to right, transparent calc(36.36% - 1px), #91caff calc(36.36% - 1px), #91caff 36.36%, transparent 36.36%)',
      'linear-gradient(to right, transparent calc(72.73% - 1px), #91caff calc(72.73% - 1px), #91caff 72.73%, transparent 72.73%)',
      'linear-gradient(to right, transparent calc(81.82% - 1px), #ffa39e calc(81.82% - 1px), #ffa39e 81.82%, transparent 81.82%)',
      'repeating-linear-gradient(to right, transparent 0, transparent calc(100% / 11 - 1px), #f0f0f0 calc(100% / 11 - 1px), #f0f0f0 calc(100% / 11))'
    ].join(',')
  }

  const renderMoneyDigitsCell = (value?: number, showZero = false) => {
    const digits = getMoneyDigits(value, showZero)
    if (!digits.length) return null
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 56,
          width: '100%',
          color: Number(value || 0) < 0 ? '#ff4d4f' : 'rgba(0,0,0,0.88)'
        }}
      >
        {digits.map((d, i) => (
          <span
            key={i}
            style={{
              flex: '0 0 calc(100% / 11)',
              textAlign: 'center',
              fontFamily: 'Tahoma, Arial, sans-serif',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {d}
          </span>
        ))}
      </div>
    )
  }

  return (
    <Card variant="borderless">
      <Spin spinning={loading}>
        {/* 顶部操作栏 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            paddingBottom: 14,
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Space wrap>
            {canSaveAndCreate && (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => handleSave(true)}
              >
                保存并新增
              </Button>
            )}
            {canSave && (
              <Button onClick={() => handleSave(false)}>保存</Button>
            )}
            {!readOnly && hasPermi('fms:config:voucher-template:query') && (
              <Button
                onClick={() => {
                  if (fmsStore.accountSetId) {
                    templateSelectRef.current?.open(fmsStore.accountSetId)
                  }
                }}
              >
                来自模板
              </Button>
            )}
            {currentAccountWritable &&
              Boolean(voucherId) &&
              hasPermi('fms:voucher:create') && (
                <Button icon={<PlusOutlined />} onClick={resetToNewVoucher}>
                  新增
                </Button>
              )}
            {canReview && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleReview(FMS_VOUCHER_STATUS.APPROVED)}
              >
                审核
              </Button>
            )}
            {canUnreview && (
              <Button
                icon={<UndoOutlined />}
                onClick={() => handleReview(FMS_VOUCHER_STATUS.PENDING_REVIEW)}
              >
                反审核
              </Button>
            )}
            {currentAccountWritable &&
              Boolean(voucherId) &&
              hasPermi('fms:voucher:create') && (
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => {
                    if (detail?.id) {
                      history.replace(`/fms/voucher/create?copyFrom=${detail.id}`)
                    }
                  }}
                >
                  复制
                </Button>
              )}
            {Boolean(voucherId) && hasPermi('fms:voucher:print') && (
              <Button
                icon={<PrinterOutlined />}
                onClick={() => {
                  if (fmsStore.accountSetId && detail) {
                    printFormRef.current?.open(
                      fmsStore.accountSetId,
                      fmsStore.accountSet?.companyName || '',
                      [detail]
                    )
                  }
                }}
              >
                打印
              </Button>
            )}
            {canDelete && (
              <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                删除
              </Button>
            )}
            {(!readOnly || Boolean(voucherId)) &&
              hasPermi([
                'fms:config:voucher-template:create',
                'fms:config:voucher-template:query'
              ]) && (
                <Dropdown
                  menu={{
                    items: [
                      ...(hasPermi('fms:config:voucher-template:create')
                        ? [{ key: 'saveTemplate', label: '存为模板' }]
                        : []),
                      ...(!readOnly && hasPermi('fms:config:voucher-template:query')
                        ? [{ key: 'applyTemplate', label: '套用模板' }]
                        : [])
                    ],
                    onClick: ({ key }) => {
                      if (!fmsStore.accountSetId) return
                      if (key === 'applyTemplate') {
                        templateSelectRef.current?.open(fmsStore.accountSetId)
                      } else if (key === 'saveTemplate') {
                        const templateEntries = validateAndBuildEntries(true)
                        if (templateEntries) {
                          templateSaveFormRef.current?.open(
                            fmsStore.accountSetId,
                            templateEntries
                          )
                        }
                      }
                    }
                  }}
                >
                  <Button>
                    更多 <DownOutlined />
                  </Button>
                </Dropdown>
              )}
          </Space>

          <Space>
            <FmsVoucherShortcutHelp />
            {voucherNavIds.length > 0 && (
              <Space.Compact>
                <Button
                  size="small"
                  icon={<LeftOutlined />}
                  disabled={!prevVoucherId}
                  title="上一张"
                  onClick={() => {
                    if (prevVoucherId) {
                      history.push(
                        `/fms/voucher/create?id=${prevVoucherId}&ids=${navIdsStr}`
                      )
                    }
                  }}
                />
                <Button
                  size="small"
                  icon={<RightOutlined />}
                  disabled={!nextVoucherId}
                  title="下一张"
                  onClick={() => {
                    if (nextVoucherId) {
                      history.push(
                        `/fms/voucher/create?id=${nextVoucherId}&ids=${navIdsStr}`
                      )
                    }
                  }}
                />
              </Space.Compact>
            )}
          </Space>
        </div>

        {/* 凭证头部信息 */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            padding: '18px 0'
          }}
        >
          <Space wrap size={12}>
            <span>凭证字</span>
            <FmsVoucherWordSelect
              value={voucherWordId}
              options={voucherWords}
              disabled={readOnly}
              style={{ width: 92 }}
              onChange={(val) => {
                setVoucherWordId(val)
                if (!voucherId && fmsStore.accountSetId) {
                  fetchNextVoucherNumber(fmsStore.accountSetId, val, voucherTime)
                }
              }}
            />
            <InputNumber
              value={voucherNumber}
              disabled={readOnly}
              min={1}
              precision={0}
              controls={false}
              style={{ width: 76 }}
              onChange={(val) => setVoucherNumber(val ?? undefined)}
            />
            <span>号</span>
            <span style={{ marginLeft: 8 }}>日期</span>
            <DatePicker
              value={dayjs(voucherTime)}
              disabled={readOnly}
              allowClear={false}
              disabledDate={(d) =>
                Boolean(
                  fmsStore.currentMonth &&
                    d.isBefore(`${fmsStore.currentMonth}-01`, 'day')
                )
              }
              onChange={async (d) => {
                if (!d || !fmsStore.accountSetId) return
                const nextTime = d.startOf('day').valueOf()
                const prevMonth = dayjs(voucherTime).format('YYYY-MM')
                const nextMonth = d.format('YYYY-MM')
                setVoucherTime(nextTime)
                if (!voucherId) {
                  await fetchNextVoucherNumber(
                    fmsStore.accountSetId,
                    voucherWordId,
                    nextTime
                  )
                }
                if (prevMonth !== nextMonth) {
                  await loadSubjectBalances(fmsStore.accountSetId, nextTime)
                }
              }}
            />
          </Space>

          <Space>
            <span>附单据</span>
            <InputNumber
              value={attachmentCount}
              disabled={readOnly}
              min={0}
              precision={0}
              controls={false}
              style={{ width: 68 }}
              onChange={(val) => setAttachmentCount(Number(val || 0))}
            />
            <span>张</span>
          </Space>

          {voucherId && detail?.status === FMS_VOUCHER_STATUS.APPROVED && (
            <Tag
              color="error"
              style={{
                padding: '4px 12px',
                fontSize: 14,
                fontWeight: 600,
                transform: 'rotate(-8deg)'
              }}
            >
              已审核
            </Tag>
          )}
        </div>

        {/* 凭证分录表格 */}
        <div
          ref={entryTableWrapRef}
          onKeyDown={handleTableKeyDown}
          style={{ overflowX: 'auto' }}
        >
          <table
            style={{
              width: '100%',
              minWidth: 960,
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              border: '1px solid #d9d9d9'
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                {!readOnly && (
                  <th
                    rowSpan={2}
                    style={{ width: 56, border: '1px solid #d9d9d9' }}
                  />
                )}
                <th
                  rowSpan={2}
                  style={{
                    width: 240,
                    height: 52,
                    border: '1px solid #d9d9d9',
                    fontWeight: 600
                  }}
                >
                  摘要
                </th>
                <th
                  rowSpan={2}
                  style={{
                    height: 52,
                    border: '1px solid #d9d9d9',
                    fontWeight: 600
                  }}
                >
                  会计科目
                </th>
                {showQuantityColumn && (
                  <th
                    rowSpan={2}
                    style={{
                      width: 170,
                      height: 52,
                      border: '1px solid #d9d9d9',
                      fontWeight: 600
                    }}
                  >
                    数量 / 单价
                  </th>
                )}
                <th
                  style={{
                    width: 228,
                    height: 28,
                    border: '1px solid #d9d9d9',
                    fontWeight: 600
                  }}
                >
                  借方金额
                </th>
                <th
                  style={{
                    width: 228,
                    height: 28,
                    border: '1px solid #d9d9d9',
                    fontWeight: 600
                  }}
                >
                  贷方金额
                </th>
              </tr>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ padding: 0, border: '1px solid #d9d9d9' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
                      fontSize: 12,
                      lineHeight: '22px',
                      color: 'rgba(0,0,0,0.45)'
                    }}
                  >
                    {MONEY_UNITS.map((u, idx) => (
                      <span
                        key={idx}
                        style={{
                          textAlign: 'center',
                          borderRight: idx < 10 ? '1px solid #f0f0f0' : 'none'
                        }}
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </th>
                <th style={{ padding: 0, border: '1px solid #d9d9d9' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
                      fontSize: 12,
                      lineHeight: '22px',
                      color: 'rgba(0,0,0,0.45)'
                    }}
                  >
                    {MONEY_UNITS.map((u, idx) => (
                      <span
                        key={idx}
                        style={{
                          textAlign: 'center',
                          borderRight: idx < 10 ? '1px solid #f0f0f0' : 'none'
                        }}
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry, index) => {
                const subj = getSubject(entry.subjectId)
                const isDebitFocused =
                  focusedEntryKey === entry.rowKey &&
                  focusedDirection === 'debit'
                const isCreditFocused =
                  focusedEntryKey === entry.rowKey &&
                  focusedDirection === 'credit'

                return (
                  <tr key={entry.rowKey} data-entry-index={index}>
                    {/* 行操作列 */}
                    {!readOnly && (
                      <td
                        style={{
                          border: '1px solid #d9d9d9',
                          textAlign: 'center',
                          padding: 4
                        }}
                      >
                        <Space direction="vertical" size={2}>
                          <Dropdown
                            menu={{
                              items: [
                                { key: 'before', label: '在上方插入行' },
                                { key: 'after', label: '在下方插入行' }
                              ],
                              onClick: ({ key }) => {
                                const insertAt =
                                  key === 'before' ? index : index + 1
                                setEntries((prev) => {
                                  const next = [...prev]
                                  next.splice(insertAt, 0, createEmptyEntry())
                                  return next
                                })
                              }
                            }}
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<PlusOutlined style={{ color: '#1677ff' }} />}
                              onClick={() =>
                                setEntries((prev) => {
                                  const next = [...prev]
                                  next.splice(index + 1, 0, createEmptyEntry())
                                  return next
                                })
                              }
                            />
                          </Dropdown>
                          {entries.length > 2 && (
                            <Button
                              type="text"
                              size="small"
                              icon={
                                <DeleteOutlined style={{ color: '#ff4d4f' }} />
                              }
                              onClick={() =>
                                setEntries((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                            />
                          )}
                        </Space>
                      </td>
                    )}

                    {/* 摘要列 */}
                    <td
                      style={{
                        border: '1px solid #d9d9d9',
                        padding: '4px 8px',
                        verticalAlign: 'top',
                        height: 60
                      }}
                    >
                      {readOnly ? (
                        <div style={{ paddingTop: 6 }}>{entry.digest}</div>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            height: '100%'
                          }}
                        >
                          <Input
                            value={entry.digest}
                            variant="borderless"
                            placeholder="请输入摘要"
                            onFocus={() => handleDigestFocus(index)}
                            onChange={(e) =>
                              updateEntryAt(index, (prev) => ({
                                ...prev,
                                digest: e.target.value
                              }))
                            }
                          />
                          {hasPermi('fms:config:digest:query') && (
                            <Button
                              type="link"
                              size="small"
                              icon={<BookOutlined />}
                              title="常用摘要"
                              onClick={() => {
                                if (fmsStore.accountSetId) {
                                  digestTargetIndexRef.current = index
                                  digestLibraryRef.current?.open(
                                    fmsStore.accountSetId
                                  )
                                }
                              }}
                            />
                          )}
                        </div>
                      )}
                    </td>

                    {/* 会计科目及辅助核算列 */}
                    <td
                      style={{
                        border: '1px solid #d9d9d9',
                        padding: '4px 8px',
                        verticalAlign: 'top',
                        height: 60
                      }}
                    >
                      {readOnly ? (
                        <div style={{ paddingTop: 6 }}>
                          {formatSubjectDisplay(
                            entry.subjectCode || subj?.code,
                            entry.subjectName || subj?.name,
                            entry.auxiliaries.map((a) => a.name)
                          )}
                        </div>
                      ) : (
                        <div>
                          <Select
                            value={entry.subjectId}
                            allowClear
                            showSearch
                            variant="borderless"
                            placeholder="请选择末级会计科目"
                            style={{ width: '100%' }}
                            optionFilterProp="label"
                            options={leafSubjects
                              .filter(
                                (s: API.FmsSubjectRespVO) =>
                                  s.type === subjectFilterType ||
                                  s.id === entry.subjectId
                              )
                              .map((s: API.FmsSubjectRespVO) => ({
                                label: `${s.code} ${s.name}`,
                                value: s.id,
                                directionText:
                                  s.balanceDirection ===
                                  FMS_DEBIT_CREDIT_DIRECTION.DEBIT
                                    ? '借'
                                    : '贷'
                              }))}
                            optionRender={(option) => (
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <span>{option.label}</span>
                                <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>
                                  {option.data.directionText}
                                </span>
                              </div>
                            )}
                            popupRender={(menu) => (
                              <div>
                                <div style={{ padding: '4px 12px 0' }}>
                                  <Tabs
                                    size="small"
                                    activeKey={String(subjectFilterType)}
                                    items={FMS_SUBJECT_TYPE_OPTIONS.map((t) => ({
                                      key: String(t.value),
                                      label: t.label
                                    }))}
                                    onChange={(k) =>
                                      setSubjectFilterType(Number(k))
                                    }
                                    style={{ marginBottom: 4 }}
                                  />
                                </div>
                                {menu}
                                {hasPermi('fms:config:subject:create') && (
                                  <div
                                    style={{
                                      borderTop: '1px solid #f0f0f0',
                                      padding: '6px 12px',
                                      textAlign: 'center'
                                    }}
                                  >
                                    <Button
                                      type="link"
                                      size="small"
                                      icon={<PlusOutlined />}
                                      onClick={() => {
                                        setCreatingSubjectType(subjectFilterType)
                                        setSubjectFormVisible(true)
                                      }}
                                    >
                                      新增科目
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                            onChange={(val) => handleSubjectChange(index, val)}
                          />

                          {/* 辅助核算项选择 */}
                          {Boolean(subj?.auxiliaryTypeIds?.length) && (
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns:
                                  'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: 6,
                                marginTop: 4
                              }}
                            >
                              {(subj?.auxiliaryTypeIds || []).map((tId: number) => {
                                const auxType = auxiliaryTypeMap.get(tId)
                                const curAux = entry.auxiliaries.find(
                                  (a) => a.typeId === tId
                                )
                                return (
                                  <Select
                                    key={tId}
                                    size="small"
                                    value={curAux?.itemId}
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                    placeholder={
                                      auxType?.name
                                        ? `请选择${auxType.name}`
                                        : '请选择辅助核算'
                                    }
                                    options={(auxiliaryOptions[tId] || []).map(
                                      (opt) => ({
                                        label: `${opt.code} ${opt.name}`,
                                        value: opt.id
                                      })
                                    )}
                                    popupRender={(menu) => (
                                      <div>
                                        {menu}
                                        {hasPermi(
                                          'fms:config:auxiliary:create'
                                        ) && (
                                          <div
                                            style={{
                                              borderTop: '1px solid #f0f0f0',
                                              padding: '4px 8px',
                                              textAlign: 'center'
                                            }}
                                          >
                                            <Button
                                              type="link"
                                              size="small"
                                              icon={<PlusOutlined />}
                                              onClick={() => {
                                                setCreatingAuxType(auxType)
                                                setAuxItemFormVisible(true)
                                              }}
                                            >
                                              新增{auxType?.name || '项目'}
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    onChange={(val) =>
                                      handleAuxiliaryItemChange(index, tId, val)
                                    }
                                  />
                                )
                              })}
                            </div>
                          )}

                          {/* 实时科目余额提示 */}
                          {entry.subjectId && (
                            <div
                              style={{
                                fontSize: 12,
                                color: 'rgba(0,0,0,0.45)',
                                paddingLeft: 10,
                                marginTop: 2
                              }}
                            >
                              余额：{formatEntryBalance(entry)}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* 数量/单价列 */}
                    {showQuantityColumn && (
                      <td
                        style={{
                          border: '1px solid #d9d9d9',
                          padding: 6,
                          verticalAlign: 'top'
                        }}
                      >
                        {subj?.quantityAccounting ||
                        entry.quantity ||
                        entry.unitPrice ? (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 4
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 12
                              }}
                            >
                              <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                                数量
                              </span>
                              <InputNumber
                                size="small"
                                value={entry.quantity}
                                disabled={readOnly}
                                precision={4}
                                controls={false}
                                style={{ flex: 1 }}
                                onChange={(val) =>
                                  handleQtyOrPriceChange(index, 'quantity', val)
                                }
                              />
                              <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                                {subj?.quantityUnit || ''}
                              </span>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 12
                              }}
                            >
                              <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                                单价
                              </span>
                              <InputNumber
                                size="small"
                                value={entry.unitPrice}
                                disabled={readOnly}
                                precision={4}
                                controls={false}
                                style={{ flex: 1 }}
                                onChange={(val) =>
                                  handleQtyOrPriceChange(index, 'unitPrice', val)
                                }
                              />
                            </div>
                          </div>
                        ) : null}
                      </td>
                    )}

                    {/* 借方金额列 */}
                    <td
                      data-entry-money
                      data-entry-direction="debit"
                      style={{
                        border: '1px solid #d9d9d9',
                        padding: 0,
                        position: 'relative',
                        height: 60,
                        ...moneyGridBgStyle
                      }}
                    >
                      {readOnly ? (
                        renderMoneyDigitsCell(entry.debitAmount)
                      ) : isDebitFocused ? (
                        <InputNumber
                          autoFocus
                          value={entry.debitAmount}
                          precision={2}
                          controls={false}
                          variant="borderless"
                          style={{
                            width: '100%',
                            height: 56,
                            lineHeight: '56px',
                            backgroundColor: '#fff',
                            fontWeight: 600,
                            fontSize: 15
                          }}
                          onBlur={() => {
                            setFocusedEntryKey('')
                            setFocusedDirection(undefined)
                          }}
                          onChange={(val) =>
                            handleAmountChange(index, 'debit', val)
                          }
                        />
                      ) : (
                        <div
                          tabIndex={0}
                          onFocus={() => {
                            setFocusedEntryKey(entry.rowKey)
                            setFocusedDirection('debit')
                          }}
                          onClick={() => {
                            setFocusedEntryKey(entry.rowKey)
                            setFocusedDirection('debit')
                          }}
                          style={{
                            width: '100%',
                            height: 56,
                            cursor: 'text'
                          }}
                        >
                          {renderMoneyDigitsCell(entry.debitAmount)}
                        </div>
                      )}
                    </td>

                    {/* 贷方金额列 */}
                    <td
                      data-entry-money
                      data-entry-direction="credit"
                      style={{
                        border: '1px solid #d9d9d9',
                        padding: 0,
                        position: 'relative',
                        height: 60,
                        ...moneyGridBgStyle
                      }}
                    >
                      {readOnly ? (
                        renderMoneyDigitsCell(entry.creditAmount)
                      ) : isCreditFocused ? (
                        <InputNumber
                          autoFocus
                          value={entry.creditAmount}
                          precision={2}
                          controls={false}
                          variant="borderless"
                          style={{
                            width: '100%',
                            height: 56,
                            lineHeight: '56px',
                            backgroundColor: '#fff',
                            fontWeight: 600,
                            fontSize: 15
                          }}
                          onBlur={() => {
                            setFocusedEntryKey('')
                            setFocusedDirection(undefined)
                          }}
                          onChange={(val) =>
                            handleAmountChange(index, 'credit', val)
                          }
                        />
                      ) : (
                        <div
                          tabIndex={0}
                          onFocus={() => {
                            setFocusedEntryKey(entry.rowKey)
                            setFocusedDirection('credit')
                          }}
                          onClick={() => {
                            setFocusedEntryKey(entry.rowKey)
                            setFocusedDirection('credit')
                          }}
                          style={{
                            width: '100%',
                            height: 56,
                            cursor: 'text'
                          }}
                        >
                          {renderMoneyDigitsCell(entry.creditAmount)}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>

            <tfoot>
              <tr>
                <td
                  colSpan={(readOnly ? 2 : 3) + (showQuantityColumn ? 1 : 0)}
                  style={{
                    border: '1px solid #d9d9d9',
                    padding: '0 14px',
                    height: 56,
                    fontWeight: 600
                  }}
                >
                  合计：{balanced ? toChineseMoney(debitTotal) : ''}
                </td>
                <td
                  style={{
                    border: '1px solid #d9d9d9',
                    padding: 0,
                    height: 56,
                    ...moneyGridBgStyle
                  }}
                >
                  {renderMoneyDigitsCell(debitTotal, true)}
                </td>
                <td
                  style={{
                    border: '1px solid #d9d9d9',
                    padding: 0,
                    height: 56,
                    ...moneyGridBgStyle
                  }}
                >
                  {renderMoneyDigitsCell(creditTotal, true)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 凭证底部制单人/审核人 */}
        <div
          style={{
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 48,
            color: 'rgba(0,0,0,0.45)',
            fontSize: 13
          }}
        >
          <span>制单人：{detail?.creatorUserName || '-'}</span>
          <span>审核人：{detail?.reviewerUserName || '-'}</span>
        </div>
      </Spin>

      {/* 常用摘要库弹窗 */}
      <FmsDigestLibrary
        ref={digestLibraryRef}
        onSelect={(digestText) => {
          const idx = digestTargetIndexRef.current
          if (idx !== undefined) {
            updateEntryAt(idx, (prev) => ({ ...prev, digest: digestText }))
            digestTargetIndexRef.current = undefined
          }
        }}
      />

      {/* 凭证模板保存与选择弹窗 */}
      <FmsVoucherTemplateSaveForm ref={templateSaveFormRef} />
      <FmsVoucherTemplateSelect
        ref={templateSelectRef}
        onSelect={handleApplyTemplate}
      />

      {/* 打印设置弹窗 */}
      <FmsVoucherPrintForm ref={printFormRef} />

      {/* 快捷新增科目与辅助核算项弹窗 */}
      {fmsStore.accountSetId && (
        <>
          <FmsSubjectForm
            visible={subjectFormVisible}
            setVisible={setSubjectFormVisible}
            accountSetId={fmsStore.accountSetId}
            defaultType={creatingSubjectType}
            onSuccess={async () => {
              if (!fmsStore.accountSetId) return
              const resp = await fmsSubjectGetSubjectSimpleList({
                accountSetId: String(fmsStore.accountSetId)
              })
              if (resp.code === 0) {
                setSubjectTree(handleTree(resp.data || []))
              }
            }}
          />

          <FmsAuxiliaryItemForm
            visible={auxItemFormVisible}
            setVisible={setAuxItemFormVisible}
            accountSetId={fmsStore.accountSetId}
            auxiliaryType={creatingAuxType}
            departmentTypeId={departmentTypeId}
            onSuccess={async () => {
              if (!fmsStore.accountSetId || !creatingAuxType) return
              const resp = await fmsAuxiliaryItemGetAuxiliaryItemSimpleList({
                accountSetId: fmsStore.accountSetId,
                auxiliaryTypeId: creatingAuxType.id
              })
              if (resp.code === 0) {
                setAuxiliaryOptions((prev) => ({
                  ...prev,
                  [creatingAuxType.id]: resp.data || []
                }))
              }
            }}
          />
        </>
      )}
    </Card>
  )
}

export default VoucherCreatePage
