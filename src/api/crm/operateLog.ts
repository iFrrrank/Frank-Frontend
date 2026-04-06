import {request} from '@umijs/max'

/** 获取操作日志分页列表 GET /crm/operate-log/page */
export async function getCustomerOperateLog(
  params: API.getCustomerOperateLogParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmOperateLogRespVO>('/crm/operate-log/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}
