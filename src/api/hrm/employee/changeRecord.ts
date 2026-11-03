import { request } from '@umijs/max'

// 获取员工异动记录列表 GET /hrm/employee/change-record/list
export async function getEmployeeChangeRecordList(
  params: API.getEmployeeChangeRecordListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeChangeRecordRespVO>('/hrm/employee/change-record/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
