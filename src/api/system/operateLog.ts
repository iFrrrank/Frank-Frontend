import { request } from '@umijs/max'

/** 导出操作日志 GET /system/operate-log/export */
export async function exportOperateLog(
  params: API.exportOperateLogParams,
  options?: { [key: string]: any }
) {
  return request<any>('/system/operate-log/export', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    ...(options || {})
  })
}

/** 获取操作日志分页列表 GET /system/operate-log/page */
export async function pageOperateLog(
  params: API.pageOperateLogParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemOperateLogRespVO>('/system/operate-log/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}
