import { request } from '@umijs/max'

// 获取员工离职信息 GET /hrm/employee/quit-info/get
export async function getQuitInfo(
  params: API.getQuitInfoParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmEmployeeQuitInfoRespVO>('/hrm/employee/quit-info/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
