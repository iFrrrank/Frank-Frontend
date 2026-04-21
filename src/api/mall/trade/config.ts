import { request } from '@umijs/max'

// 获取交易中心配置 GET /trade/config/get
export async function getConfig(options?: { [key: string]: any }) {
  return request<API.CommonResultTradeConfigRespVO>('/trade/config/get', {
    method: 'GET',
    ...(options || {})
  })
}

// 更新交易中心配置 PUT /trade/config/save
export async function updateConfig(
  body: API.TradeConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/config/save', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

