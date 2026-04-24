import { request } from '@umijs/max'

// 获取客户的首次合同、回款信息列表 用于【客户转化率】页面 GET /crm/statistics-customer/get-contract-summary
export async function getContractSummary(
  params: API.getContractSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsCustomerContractSummaryRespVO>(
    '/crm/statistics-customer/get-contract-summary',
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

// 获取客户成交周期（按地区） GET /crm/statistics-customer/get-customer-deal-cycle-by-area
export async function getCustomerDealCycleByArea(
  params: API.getCustomerDealCycleByAreaParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsCustomerDealCycleByAreaRespVO>(
    '/crm/statistics-customer/get-customer-deal-cycle-by-area',
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

// 获取客户成交周期（按日期） GET /crm/statistics-customer/get-customer-deal-cycle-by-date
export async function getCustomerDealCycleByDate(
  params: API.getCustomerDealCycleByDateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsCustomerDealCycleByDateRespVO>(
    '/crm/statistics-customer/get-customer-deal-cycle-by-date',
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

// 获取客户成交周期（按产品） GET /crm/statistics-customer/get-customer-deal-cycle-by-product
export async function getCustomerDealCycleByProduct(
  params: API.getCustomerDealCycleByProductParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsCustomerDealCycleByProductRespVO>(
    '/crm/statistics-customer/get-customer-deal-cycle-by-product',
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

// 获取客户成交周期（按用户） GET /crm/statistics-customer/get-customer-deal-cycle-by-user
export async function getCustomerDealCycleByUser(
  params: API.getCustomerDealCycleByUserParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsCustomerDealCycleByUserRespVO>(
    '/crm/statistics-customer/get-customer-deal-cycle-by-user',
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

// 获取客户总量分析（按日期） GET /crm/statistics-customer/get-customer-summary-by-date
export async function getCustomerSummaryByDate(
  params: API.getCustomerSummaryByDateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsCustomerSummaryByDateRespVO>(
    '/crm/statistics-customer/get-customer-summary-by-date',
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

// 获取客户总量分析（按用户） GET /crm/statistics-customer/get-customer-summary-by-user
export async function getCustomerSummaryByUser(
  params: API.getCustomerSummaryByUserParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsCustomerSummaryByUserRespVO>(
    '/crm/statistics-customer/get-customer-summary-by-user',
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

// 获取客户跟进次数分析（按日期） GET /crm/statistics-customer/get-follow-up-summary-by-date
export async function getFollowupSummaryByDate(
  params: API.getFollowupSummaryByDateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsFollowUpSummaryByDateRespVO>(
    '/crm/statistics-customer/get-follow-up-summary-by-date',
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

// 获取客户跟进次数分析（按类型） GET /crm/statistics-customer/get-follow-up-summary-by-type
export async function getFollowUpSummaryByType(
  params: API.getFollowUpSummaryByTypeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsFollowUpSummaryByTypeRespVO>(
    '/crm/statistics-customer/get-follow-up-summary-by-type',
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

// 获取客户跟进次数分析（按用户） GET /crm/statistics-customer/get-follow-up-summary-by-user
export async function getFollowUpSummaryByUser(
  params: API.getFollowUpSummaryByUserParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsFollowUpSummaryByUserRespVO>(
    '/crm/statistics-customer/get-follow-up-summary-by-user',
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

// 获取公海客户分析（按日期） GET /crm/statistics-customer/get-pool-summary-by-date
export async function getPoolSummaryByDate(
  params: API.getPoolSummaryByDateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsPoolSummaryByDateRespVO>(
    '/crm/statistics-customer/get-pool-summary-by-date',
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

// 获取公海客户分析（按用户） GET /crm/statistics-customer/get-pool-summary-by-user
export async function getPoolSummaryByUser(
  params: API.getPoolSummaryByUserParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsPoolSummaryByUserRespVO>(
    '/crm/statistics-customer/get-pool-summary-by-user',
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
