import { request } from '@umijs/max'

// 获取操作日志 GET /hrm/operate-log/page
export async function getOperateLogPage(
  params: API.getOperateLogPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmOperateLogRespVO>('/hrm/operate-log/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}
