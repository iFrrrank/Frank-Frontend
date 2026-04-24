import { request } from '@umijs/max'

// 获取新增联系人数排行榜 GET /crm/statistics-rank/get-contacts-count-rank
export async function getContactsCountRank(
  params: API.getContactsCountRankParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsRankRespVO>(
    '/crm/statistics-rank/get-contacts-count-rank',
    {
      method: 'GET',
      params: {
        ...params,
        rankingReqVO: undefined,
        ...params['rankingReqVO']
      },
      ...(options || {})
    }
  )
}

// 获取签约合同数量排行榜 GET /crm/statistics-rank/get-contract-count-rank
export async function getContractCountRank(
  params: API.getContractCountRankParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsRankRespVO>(
    '/crm/statistics-rank/get-contract-count-rank',
    {
      method: 'GET',
      params: {
        ...params,
        rankingReqVO: undefined,
        ...params['rankingReqVO']
      },
      ...(options || {})
    }
  )
}

// 获取合同金额排行榜 GET /crm/statistics-rank/get-contract-price-rank
export async function getContractPriceRank(
  params: API.getContractPriceRankParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsRankRespVO>(
    '/crm/statistics-rank/get-contract-price-rank',
    {
      method: 'GET',
      params: {
        ...params,
        rankingReqVO: undefined,
        ...params['rankingReqVO']
      },
      ...(options || {})
    }
  )
}

// 获取新增客户数排行榜 GET /crm/statistics-rank/get-customer-count-rank
export async function getCustomerCountRank(
  params: API.getCustomerCountRankParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsRankRespVO>(
    '/crm/statistics-rank/get-customer-count-rank',
    {
      method: 'GET',
      params: {
        ...params,
        rankingReqVO: undefined,
        ...params['rankingReqVO']
      },
      ...(options || {})
    }
  )
}

// 获取跟进次数排行榜 GET /crm/statistics-rank/get-follow-count-rank
export async function getFollowCountRank(
  params: API.getFollowCountRankParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsRankRespVO>(
    '/crm/statistics-rank/get-follow-count-rank',
    {
      method: 'GET',
      params: {
        ...params,
        rankingReqVO: undefined,
        ...params['rankingReqVO']
      },
      ...(options || {})
    }
  )
}

// 获取跟进客户数排行榜 GET /crm/statistics-rank/get-follow-customer-count-rank
export async function getFollowCustomerCountRank(
  params: API.getFollowCustomerCountRankParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsRankRespVO>(
    '/crm/statistics-rank/get-follow-customer-count-rank',
    {
      method: 'GET',
      params: {
        ...params,
        rankingReqVO: undefined,
        ...params['rankingReqVO']
      },
      ...(options || {})
    }
  )
}

// 获取产品销量排行榜 GET /crm/statistics-rank/get-product-sales-rank
export async function getProductSalesRank(
  params: API.getProductSalesRankParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsRankRespVO>(
    '/crm/statistics-rank/get-product-sales-rank',
    {
      method: 'GET',
      params: {
        ...params,
        rankingReqVO: undefined,
        ...params['rankingReqVO']
      },
      ...(options || {})
    }
  )
}

// 获取回款金额排行榜 GET /crm/statistics-rank/get-receivable-price-rank
export async function getReceivablePriceRank(
  params: API.getReceivablePriceRankParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsRankRespVO>(
    '/crm/statistics-rank/get-receivable-price-rank',
    {
      method: 'GET',
      params: {
        ...params,
        rankingReqVO: undefined,
        ...params['rankingReqVO']
      },
      ...(options || {})
    }
  )
}
