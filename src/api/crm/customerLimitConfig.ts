import { request } from '@umijs/max'

/** 创建客户限制配置 POST /crm/customer-limit-config/create */
export async function createCustomerLimitConfig(
  body: API.CrmCustomerLimitConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/customer-limit-config/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除客户限制配置 DELETE /crm/customer-limit-config/delete */
export async function deleteCustomerLimitConfig(
  params: API.deleteCustomerLimitConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer-limit-config/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取客户限制配置 GET /crm/customer-limit-config/get */
export async function getCustomerLimitConfig(
  params: API.getCustomerLimitConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultCrmCustomerLimitConfigRespVO>('/crm/customer-limit-config/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取客户限制配置分页列表 GET /crm/customer-limit-config/page */
export async function getCustomerLimitConfigPage(
  params: API.getCustomerLimitConfigPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmCustomerLimitConfigRespVO>(
    '/crm/customer-limit-config/page',
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

/** 更新客户限制配置 PUT /crm/customer-limit-config/update */
export async function updateCustomerLimitConfig(
  body: API.CrmCustomerLimitConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer-limit-config/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
