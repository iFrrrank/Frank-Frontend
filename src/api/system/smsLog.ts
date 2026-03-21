import { request } from '@umijs/max'

/** 导出短信日志 GET /system/sms-log/export-excel */
export async function exportSmsLogExcel(
  params: API.exportSmsLogExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/system/sms-log/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    ...(options || {})
  })
}

/** 获取短信日志分页列表 GET /system/sms-log/page */
export async function getSmsLogPage(
  params: API.getSmsLogPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemSmsLogRespVO>('/system/sms-log/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}
