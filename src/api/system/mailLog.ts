import { request } from '@umijs/max'

// 获取邮箱日志 GET /system/mail-log/get
export async function getMailLog(params: API.getMailLogParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemMailLogRespVO>('/system/mail-log/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取邮箱日志分页列表 GET /system/mail-log/page
export async function getMailLogPage(
  params: API.getMailLogPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemMailLogRespVO>('/system/mail-log/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}
