import { request } from '@umijs/max'

// 获取钱包充值金额 GET /statistics/pay/summary
export async function getWalletRechargePrice(options?: { [key: string]: any }) {
  return request<API.CommonResultPaySummaryRespVO>('/statistics/pay/summary', {
    method: 'GET',
    ...(options || {})
  })
}
