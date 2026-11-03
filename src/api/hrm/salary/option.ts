import { request } from '@umijs/max'

// 创建薪资项 POST /hrm/salary/option/create
export async function createSalaryOption(
  body: API.HrmSalaryOptionSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/salary/option/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除薪资项 DELETE /hrm/salary/option/delete
export async function deleteSalaryOption(
  params: API.deleteSalaryOptionParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/option/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取薪资项列表 GET /hrm/salary/option/list
export async function getSalaryOptionList(options?: { [key: string]: any }) {
  return request<API.CommonResultListHrmSalaryOptionRespVO>('/hrm/salary/option/list', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取薪资项精简列表 只包含已启用的薪资项 GET /hrm/salary/option/simple-list
export async function getSalaryOptionSimpleList(
  params: API.getSalaryOptionSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmSalaryOptionRespVO>('/hrm/salary/option/simple-list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 同步标准薪资项 PUT /hrm/salary/option/sync
export async function syncSalaryOption(options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/hrm/salary/option/sync', {
    method: 'PUT',
    ...(options || {})
  })
}

// 更新薪资项启用状态 PUT /hrm/salary/option/update-enabled
export async function updateSalaryOptionEnabled(
  body: API.HrmSalaryOptionUpdateEnabledReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/option/update-enabled', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新薪资项显示状态 PUT /hrm/salary/option/update-visible
export async function updateSalaryOptionVisible(
  body: API.HrmSalaryOptionUpdateVisibleReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/option/update-visible', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
