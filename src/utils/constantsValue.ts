import { CommonStatusEnum } from './constants'

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

export const STATUS_VALUE_ENUM = {
  [CommonStatusEnum.ENABLE]: {
    text: '开启',
    status: 'Success'
  },
  [CommonStatusEnum.DISABLE]: {
    text: '关闭',
    status: 'Error'
  }
}
