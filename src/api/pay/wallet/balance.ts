import { request } from '@umijs/max'

// 获取用户钱包明细 GET /pay/wallet/get
export async function getWallet(params: API.getWalletParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPayWalletRespVO>('/pay/wallet/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取会员钱包分页列表 GET /pay/wallet/page
export async function getWalletPage(
  params: API.getWalletPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPayWalletRespVO>('/pay/wallet/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新会员用户余额 PUT /pay/wallet/update-balance
export async function updateWalletBalance(
  body: API.PayWalletUpdateBalanceReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/wallet/update-balance', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

