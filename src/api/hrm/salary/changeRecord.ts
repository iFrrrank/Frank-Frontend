import { request } from '@umijs/max'

// 取消定薪/调薪记录 PUT /hrm/salary/change-record/cancel
export async function cancelSalaryChangeRecord(
  params: API.cancelSalaryChangeRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/change-record/cancel', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 删除定薪/调薪记录 DELETE /hrm/salary/change-record/delete
export async function deleteSalaryChangeRecord(
  params: API.deleteSalaryChangeRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/change-record/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取定薪/调薪记录 GET /hrm/salary/change-record/get
export async function getSalaryChangeRecord(
  params: API.getSalaryChangeRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryChangeRecordRespVO>('/hrm/salary/change-record/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取定薪/调薪记录列表 GET /hrm/salary/change-record/list
export async function getSalaryChangeRecordList(
  params: API.getSalaryChangeRecordListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmSalaryChangeRecordRespVO>(
    '/hrm/salary/change-record/list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}
