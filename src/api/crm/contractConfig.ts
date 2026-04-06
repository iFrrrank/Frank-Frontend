import { request } from '@umijs/max'

/** 获取合同配置 GET /crm/contract-config/get */
export async function getCustomerPoolConfig1(options?: { [key: string]: any }) {
  return request<API.CommonResultCrmContractConfigRespVO>('/crm/contract-config/get', {
    method: 'GET',
    ...(options || {})
  })
}

/** 更新合同配置 PUT /crm/contract-config/save */
export async function saveCustomerPoolConfig(
  body: API.CrmContractConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contract-config/save', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
