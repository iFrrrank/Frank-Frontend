import type { CommonResult } from './types'
import { request } from '@umijs/max'

// 员工端工资条薪资项 VO
export interface SalarySlipOptionVO {
  name: string
  type?: number
  code?: number
  value?: number
  remark?: string
  sort?: number
  children?: SalarySlipOptionVO[]
}

// 员工端工资条 VO
export interface SalarySlipVO {
  id: number
  sendRecordId?: number
  monthEmployeeRecordId?: number
  employeeId: number
  year: number
  month: number
  readStatus?: number
  realPaySalary?: number
  remark?: string
  createTime?: string | Date
  options: SalarySlipOptionVO[]
}

// 员工端工资条列表 Request VO
export interface SalarySlipListReqVO {
  startMonth?: string
  endMonth?: string
  orderType?: number
  order?: number
}

// 员工端未读工资条概况 VO
export interface SalarySlipUnreadSummaryVO {
  unreadCount: number
  reminder?: string
}

// 获得我的工资条列表 GET /hrm/portal/salary/slip/list
export async function getSalarySlipList(params?: SalarySlipListReqVO) {
  return request<CommonResult<SalarySlipVO[]>>('/hrm/portal/salary/slip/list', {
    method: 'GET',
    params
  })
}

// 获得我的未读工资条概况 GET /hrm/portal/salary/slip/unread-summary
export async function getUnreadSalarySlipSummary() {
  return request<CommonResult<SalarySlipUnreadSummaryVO>>(
    '/hrm/portal/salary/slip/unread-summary',
    {
      method: 'GET'
    }
  )
}

// 标记我的工资条为已读 PUT /hrm/portal/salary/slip/read
export async function markSalarySlipRead(ids: number[]) {
  return request<API.CommonResultBoolean>('/hrm/portal/salary/slip/read', {
    method: 'PUT',
    params: { ids: ids.join(',') }
  })
}
