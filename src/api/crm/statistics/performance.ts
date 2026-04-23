import { request } from '@umijs/max'

// 合同数量统计 用于【合同数量分析】页面 GET /crm/statistics-performance/get-contract-count-performance
export async function getContractCountPerformance(
  params: API.getContractCountPerformanceParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsPerformanceRespVO>(
    '/crm/statistics-performance/get-contract-count-performance',
    {
      method: 'GET',
      params: {
        ...params,
        performanceReqVO: undefined,
        ...params['performanceReqVO']
      },
      ...(options || {})
    }
  )
}

// 合同金额统计 GET /crm/statistics-performance/get-contract-price-performance
export async function getContractPriceStaffPerformance(
  params: API.getContractPriceStaffPerformanceParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsPerformanceRespVO>(
    '/crm/statistics-performance/get-contract-price-performance',
    {
      method: 'GET',
      params: {
        ...params,
        performanceReqVO: undefined,
        ...params['performanceReqVO']
      },
      ...(options || {})
    }
  )
}

// 回款金额统计 GET /crm/statistics-performance/get-receivable-price-performance
export async function getReceivablePriceStaffPerformance(
  params: API.getReceivablePriceStaffPerformanceParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsPerformanceRespVO>(
    '/crm/statistics-performance/get-receivable-price-performance',
    {
      method: 'GET',
      params: {
        ...params,
        performanceReqVO: undefined,
        ...params['performanceReqVO']
      },
      ...(options || {})
    }
  )
}
