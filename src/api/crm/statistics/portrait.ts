import { request } from '@umijs/max'

/** 获取客户地区统计数据 用于【城市分布分析】页面 GET /crm/statistics-portrait/get-customer-area-summary */
export async function getCustomerAreaSummary(
  params: API.getCustomerAreaSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticCustomerAreaRespVO>(
    '/crm/statistics-portrait/get-customer-area-summary',
    {
      method: 'GET',
      params: {
        ...params,
        reqVO: undefined,
        ...params['reqVO']
      },
      ...(options || {})
    }
  )
}

/** 获取客户行业统计数据 用于【客户行业分析】页面 GET /crm/statistics-portrait/get-customer-industry-summary */
export async function getCustomerIndustrySummary(
  params: API.getCustomerIndustrySummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticCustomerIndustryRespVO>(
    '/crm/statistics-portrait/get-customer-industry-summary',
    {
      method: 'GET',
      params: {
        ...params,
        reqVO: undefined,
        ...params['reqVO']
      },
      ...(options || {})
    }
  )
}

/** 获取客户级别统计数据 用于【客户级别分析】页面 GET /crm/statistics-portrait/get-customer-level-summary */
export async function getCustomerLevelSummary(
  params: API.getCustomerLevelSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticCustomerLevelRespVO>(
    '/crm/statistics-portrait/get-customer-level-summary',
    {
      method: 'GET',
      params: {
        ...params,
        reqVO: undefined,
        ...params['reqVO']
      },
      ...(options || {})
    }
  )
}

/** 获取客户来源统计数据 用于【客户来源分析】页面 GET /crm/statistics-portrait/get-customer-source-summary */
export async function getCustomerSourceSummary(
  params: API.getCustomerSourceSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticCustomerSourceRespVO>(
    '/crm/statistics-portrait/get-customer-source-summary',
    {
      method: 'GET',
      params: {
        ...params,
        reqVO: undefined,
        ...params['reqVO']
      },
      ...(options || {})
    }
  )
}
