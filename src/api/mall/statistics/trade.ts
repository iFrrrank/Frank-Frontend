import { request } from '@umijs/max'

// 查询交易统计 GET /statistics/trade/summary
export async function getTradeStatisticsSummary(options?: { [key: string]: any }) {
  return request<API.CommonResultTradeSummaryComparisonRespVO>('/statistics/trade/summary', {
    method: 'GET',
    ...(options || {})
  })
}

// 获得交易状况统计 GET /statistics/trade/analyse
export async function getTradeStatisticsAnalyse(
  params: API.StatisticsTimesParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultTradeTrendComparisonRespVO>('/statistics/trade/analyse', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获得交易状况明细 GET /statistics/trade/list
export async function getTradeStatisticsList(
  params: API.StatisticsTimesParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListTradeTrendSummaryRespVO>('/statistics/trade/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获得交易订单数量 GET /statistics/trade/order-count
export async function getOrderCount(options?: { [key: string]: any }) {
  return request<API.CommonResultTradeOrderCountRespVO>('/statistics/trade/order-count', {
    method: 'GET',
    ...(options || {})
  })
}

// 获得交易订单数量对照 GET /statistics/trade/order-comparison
export async function getOrderComparison(options?: { [key: string]: any }) {
  return request<API.CommonResultTradeOrderComparisonRespVO>('/statistics/trade/order-comparison', {
    method: 'GET',
    ...(options || {})
  })
}

// 获得订单量趋势统计 GET /statistics/trade/order-count-trend
export async function getOrderCountTrendComparison(
  params: { type: number; beginTime: string; endTime: string },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListTradeOrderTrendComparisonRespVO>(
    '/statistics/trade/order-count-trend',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}
