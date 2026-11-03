import { request } from '@umijs/max'

// 获取采购统计 GET /erp/purchase-statistics/summary
export async function getPurchaseSummary(options?: { [key: string]: any }) {
  return request<API.CommonResultErpPurchaseSummaryRespVO>('/erp/purchase-statistics/summary', {
    method: 'GET',
    ...(options || {})
  })
}

// 统计采购时间段 GET /erp/purchase-statistics/time-summary
export async function getPurchaseTimeSummary(
  params: API.getPurchaseTimeSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListErpPurchaseTimeSummaryRespVO>(
    '/erp/purchase-statistics/time-summary',
    {
      method: 'GET',
      params: {
        // count has a default value: 6
        count: '6',
        ...params
      },
      ...(options || {})
    }
  )
}
