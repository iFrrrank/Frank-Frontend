import { request } from '@umijs/max'

// 获取销售统计 GET /erp/sale-statistics/summary
export async function getSaleSummary(options?: { [key: string]: any }) {
  return request<API.CommonResultErpSaleSummaryRespVO>('/erp/sale-statistics/summary', {
    method: 'GET',
    ...(options || {})
  })
}

// 统计销售时间段 GET /erp/sale-statistics/time-summary
export async function getSaleTimeSummary(
  params: API.getSaleTimeSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListErpSaleTimeSummaryRespVO>(
    '/erp/sale-statistics/time-summary',
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

