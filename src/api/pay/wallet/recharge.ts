import { request } from '@umijs/max'

// 发起钱包充值退款 POST /pay/wallet-recharge/refund
export async function refundWalletRecharge(
  params: API.refundWalletRechargeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/wallet-recharge/refund', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 更新钱包充值为已充值 POST /pay/wallet-recharge/update-paid
export async function updateWalletRechargerPaid(
  body: API.PayOrderNotifyReqDTO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/wallet-recharge/update-paid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新钱包充值为已退款 POST /pay/wallet-recharge/update-refunded
export async function updateWalletRechargeRefunded(
  body: API.PayRefundNotifyReqDTO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/wallet-recharge/update-refunded', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
