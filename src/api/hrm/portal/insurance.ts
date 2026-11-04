import type { CommonResult } from './types'
import { request } from '@umijs/max'

// 员工端社保项目 VO
export interface InsuranceSchemeProjectVO {
  schemeProjectId?: number
  type?: number
  name: string
  baseAmount?: number
  corporateRate?: number
  personalRate?: number
  corporateAmount?: number
  personalAmount?: number
}

// 员工端社保记录 VO
export interface InsuranceRecordVO {
  id: number
  monthRecordId?: number
  employeeId: number
  schemeId?: number
  schemeName?: string
  schemeType?: number
  schemeCity?: string
  year: number
  month: number
  personalInsuranceAmount?: number
  personalProvidentFundAmount?: number
  corporateInsuranceAmount?: number
  corporateProvidentFundAmount?: number
  status?: number
  createTime?: string | Date
  projects?: InsuranceSchemeProjectVO[]
}

// 员工端社保记录列表 Request VO
export interface InsuranceRecordListReqVO {
  year?: number
}

// 获得我的社保记录列表 GET /hrm/portal/insurance/record/list
export async function getInsuranceRecordList(params?: InsuranceRecordListReqVO) {
  return request<CommonResult<InsuranceRecordVO[]>>('/hrm/portal/insurance/record/list', {
    method: 'GET',
    params
  })
}

// 获得我的社保记录详情 GET /hrm/portal/insurance/record/get
export async function getInsuranceRecord(id: number) {
  return request<CommonResult<InsuranceRecordVO>>('/hrm/portal/insurance/record/get', {
    method: 'GET',
    params: { id }
  })
}
