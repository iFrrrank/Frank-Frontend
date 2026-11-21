import { request } from '@umijs/max'

// 获得业绩目标完成情况 GET /crm/statistics-performance-target/get-performance-target-summary
export async function getPerformanceTargetSummary(
  params: API.getPerformanceTargetSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsPerformanceTargetRespVO>(
    '/crm/statistics-performance-target/get-performance-target-summary',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}
