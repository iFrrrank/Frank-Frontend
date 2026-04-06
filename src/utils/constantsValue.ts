import { CommonStatusEnum, CrmAuditStatusEnum, CrmSceneTypeEnum } from './constants'
import { ProSchemaValueEnumType } from '@ant-design/pro-components'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]
type SelectValueItem = Record<string | number, ProSchemaValueEnumType>

export interface OptionItem {
  label: string
  value: string
}

export const AUTO_APPROVE_SCOPES: OptionItem[] = [
  { label: '读取', value: 'read' },
  { label: '写入', value: 'write' },
  { label: '删除', value: 'delete' },
  { label: '全部', value: 'all' }
]

// ========== Common ==========
export const COMMON_STATUS: SelectValueItem = {
  [CommonStatusEnum.ENABLE.status]: {
    text: CommonStatusEnum.ENABLE.name,
    status: 'Success'
  },
  [CommonStatusEnum.DISABLE.status]: {
    text: CommonStatusEnum.DISABLE.name,
    status: 'Error'
  }
}

// ========== CRM 系统 ==========
export const BACKLOG_MENU_LIST: MenuItem[] = [
  { key: 'todayCustomer', label: '今日需联系客户' },
  { key: 'followClue', label: '分配给我的线索' },
  { key: 'followCustomer', label: '分配给我的客户' },
  { key: 'poolCustomer', label: '待进入公海的客户' },
  { key: 'auditContract', label: '待审核合同' },
  { key: 'auditReceivable', label: '待审核回款' },
  { key: 'remindReceivablePlan', label: '待回款提醒' },
  { key: 'expiringContract', label: '即将到期的合同' }
]

export const AUDIT_STATUS: SelectValueItem = {
  [CrmAuditStatusEnum.DRAFT.status]: {
    text: CrmAuditStatusEnum.DRAFT.name,
    status: 'Default'
  },
  [CrmAuditStatusEnum.PROCESS.status]: {
    text: CrmAuditStatusEnum.PROCESS.name,
    status: 'Processing'
  },
  [CrmAuditStatusEnum.APPROVE.status]: {
    text: CrmAuditStatusEnum.APPROVE.name,
    status: 'Success'
  },
  [CrmAuditStatusEnum.REJECT.status]: {
    text: CrmAuditStatusEnum.REJECT.name,
    status: 'Error'
  },
  [CrmAuditStatusEnum.CANCEL.status]: {
    text: CrmAuditStatusEnum.CANCEL.name,
    status: 'Error'
  }
}

export const CONTACT_STATUS: SelectValueItem = {
  1: { text: '今日需联系' },
  2: { text: '已逾期' },
  3: { text: '已联系' }
}

export const CONTRACT_EXPIRY_STATUS: SelectValueItem = {
  1: { text: '即将过期' },
  2: { text: '已过期' }
}

export const FOLLOW_STATUS: SelectValueItem = {
  10: { text: '待跟进' },
  20: { text: '已跟进' }
}

export const SCENE_TYPE: SelectValueItem = {
  [CrmSceneTypeEnum.OWNER.type]: {
    text: CrmSceneTypeEnum.OWNER.name
  },
  [CrmSceneTypeEnum.INVOLVED.type]: {
    text: CrmSceneTypeEnum.INVOLVED.name
  },
  [CrmSceneTypeEnum.SUBORDINATE.type]: {
    text: CrmSceneTypeEnum.SUBORDINATE.name
  }
}

export const RECEIVABLE_STATUS: SelectValueItem = {
  1: { text: '待回款' },
  2: { text: '已逾期' },
  3: { text: '已回款' }
}