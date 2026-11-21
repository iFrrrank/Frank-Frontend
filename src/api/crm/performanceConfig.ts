import { request } from '@umijs/max'

// 创建业绩目标配置 POST /crm/performance-config/create
export async function createPerformanceConfig(
  body: API.CrmPerformanceConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/performance-config/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除业绩目标配置 DELETE /crm/performance-config/delete
export async function deletePerformanceConfig(
  params: API.deletePerformanceConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/performance-config/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获得业绩目标配置 GET /crm/performance-config/get
export async function getPerformanceConfig(
  params: API.getPerformanceConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultCrmPerformanceConfigRespVO>('/crm/performance-config/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获得业绩目标配置分页 GET /crm/performance-config/page
export async function getPerformanceConfigPage(
  params: API.getPerformanceConfigPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmPerformanceConfigRespVO>(
    '/crm/performance-config/page',
    {
      method: 'GET',
      params: {
        ...params,
        pageVO: undefined,
        ...params['pageVO']
      },
      ...(options || {})
    }
  )
}

// 更新业绩目标配置 PUT /crm/performance-config/update
export async function updatePerformanceConfig(
  body: API.CrmPerformanceConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/performance-config/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
