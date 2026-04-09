import { request } from '@umijs/max'

/** 获取商机转化率分析（按日期） 用于【销售漏斗】页面 GET /crm/statistics-funnel/get-business-inversion-rate-summary-by-date */
export async function getBusinessInversionRateSummaryByDate(
  params: API.getBusinessInversionRateSummaryByDateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsBusinessInversionRateSummaryByDateRespVO>(
    '/crm/statistics-funnel/get-business-inversion-rate-summary-by-date',
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

/** 获取商机分页列表（按日期） 用于【销售漏斗】页面的【新增商机分析】 GET /crm/statistics-funnel/get-business-page-by-date */
export async function getBusinessPageByDate(
  params: API.getBusinessPageByDateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmBusinessRespVO>(
    '/crm/statistics-funnel/get-business-page-by-date',
    {
      method: 'GET',
      params: {
        ...params,
        pageVO: undefined,
        ...params['pageVO']
      },
      ...(options || {})
    }
  )
}

/** 获取新增商机分析（按日期） 用于【销售漏斗】页面 GET /crm/statistics-funnel/get-business-summary-by-date */
export async function getBusinessSummaryByDate(
  params: API.getBusinessSummaryByDateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsBusinessSummaryByDateRespVO>(
    '/crm/statistics-funnel/get-business-summary-by-date',
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

/** 获取商机结束状态统计 用于【销售漏斗】页面的【销售漏斗分析】 GET /crm/statistics-funnel/get-business-summary-by-end-status */
export async function getBusinessSummaryByEndStatus(
  params: API.getBusinessSummaryByEndStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsBusinessSummaryByEndStatusRespVO>(
    '/crm/statistics-funnel/get-business-summary-by-end-status',
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

/** 获取销售漏斗统计数据 用于【销售漏斗】页面的【销售漏斗分析】 GET /crm/statistics-funnel/get-funnel-summary */
export async function getFunnelSummary(
  params: API.getFunnelSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultCrmStatisticFunnelSummaryRespVO>(
    '/crm/statistics-funnel/get-funnel-summary',
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
