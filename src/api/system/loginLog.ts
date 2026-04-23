import { request } from '@umijs/max'

// 导出登录日志 GET /system/login-log/export
export async function exportLoginLog(
  params: API.exportLoginLogParams,
  options?: { [key: string]: any }
) {
  return request<any>('/system/login-log/export', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// 获取登录日志分页列表 GET /system/login-log/page
export async function getLoginLogPage(
  params: API.getLoginLogPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemLoginLogRespVO>('/system/login-log/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}
