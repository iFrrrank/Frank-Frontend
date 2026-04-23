import { request } from '@umijs/max'

// 导出 API 访问日志 Excel GET /infra/api-access-log/export-excel
export async function exportApiAccessLogExcel(
  params: API.exportApiAccessLogExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/infra/api-access-log/export-excel', {
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

// 获取 API 访问日志分页列表 GET /infra/api-access-log/page
export async function getApiAccessLogPage(
  params: API.getApiAccessLogPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultInfraApiAccessLogRespVO>('/infra/api-access-log/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}
