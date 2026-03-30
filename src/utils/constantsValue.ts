import { CommonStatusEnum } from './constants'
import { ProSchemaValueEnumType } from '@ant-design/pro-components'

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

export const COMMON_STATUS_VALUE_ENUM: Record<string | number, ProSchemaValueEnumType> = {
  [CommonStatusEnum.ENABLE.status]: {
    text: CommonStatusEnum.ENABLE.name,
    status: 'Success'
  },
  [CommonStatusEnum.DISABLE.status]: {
    text: CommonStatusEnum.DISABLE.name,
    status: 'Error'
  }
}
