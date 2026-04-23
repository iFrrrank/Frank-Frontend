import { request } from '@umijs/max'

// 导出 API 错误日志 Excel GET /infra/api-error-log/export-excel
export async function exportApiErrorLogExcel(
  params: API.exportApiErrorLogExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/infra/api-error-log/export-excel', {
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

// 获取 API 错误日志分页列表 GET /infra/api-error-log/page
export async function getApiErrorLogPage(
  params: API.getApiErrorLogPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultInfraApiErrorLogRespVO>('/infra/api-error-log/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新 API 错误日志的状态 PUT /infra/api-error-log/update-status
export async function updateApiErrorLogProcess(
  params: API.updateApiErrorLogProcessParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/api-error-log/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
