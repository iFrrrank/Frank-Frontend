import { request } from '@umijs/max'

// 创建计税规则 POST /hrm/salary/tax-rule/create
export async function createSalaryTaxRule(
  body: API.HrmSalaryTaxRuleSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/salary/tax-rule/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除计税规则 DELETE /hrm/salary/tax-rule/delete
export async function deleteSalaryTaxRule(
  params: API.deleteSalaryTaxRuleParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/tax-rule/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取计税规则 GET /hrm/salary/tax-rule/get
export async function getSalaryTaxRule(
  params: API.getSalaryTaxRuleParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryTaxRuleRespVO>('/hrm/salary/tax-rule/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取计税规则列表 GET /hrm/salary/tax-rule/list
export async function getSalaryTaxRuleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListHrmSalaryTaxRuleRespVO>('/hrm/salary/tax-rule/list', {
    method: 'GET',
    ...(options || {})
  })
}

// 修改计税规则 PUT /hrm/salary/tax-rule/update
export async function updateSalaryTaxRule(
  body: API.HrmSalaryTaxRuleSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/tax-rule/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
