import { request } from '@umijs/max'

// 获得商品统计分析 GET /statistics/product/analyse
export async function getProductStatisticsAnalyse(
  params: API.StatisticsTimesParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultProductStatisticsComparisonRespVO>('/statistics/product/analyse', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获得商品状况明细 GET /statistics/product/list
export async function getProductStatisticsList(
  params: API.StatisticsTimesParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListProductStatisticsRespVO>('/statistics/product/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获得商品排行榜分页 GET /statistics/product/rank-page
export async function getProductStatisticsRankPage(
  params: API.getProductStatisticsRankPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultProductStatisticsRespVO>(
    '/statistics/product/rank-page',
    {
      method: 'GET',
      params: {
        ...params,
        pageReqVO: undefined,
        ...params['pageReqVO']
      },
      ...(options || {})
    }
  )
}
