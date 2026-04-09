import { request } from '@umijs/max'

/** 获取客户公海规则设置 GET /crm/customer-pool-config/get */
export async function getCustomerPoolConfig(options?: { [key: string]: any }) {
  return request<API.CommonResultCrmCustomerPoolConfigRespVO>('/crm/customer-pool-config/get', {
    method: 'GET',
    ...(options || {})
  })
}

/** 更新客户公海规则设置 PUT /crm/customer-pool-config/save */
export async function updateCustomerPoolConfig(
  body: API.CrmCustomerPoolConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer-pool-config/save', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
