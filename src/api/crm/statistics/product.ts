import { request } from '@umijs/max'

// 获得产品销售情况统计 GET /crm/statistics-product/get-product-sales-list
export async function getProductSalesList(
  params: API.getProductSalesListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsProductSalesRespVO>(
    '/crm/statistics-product/get-product-sales-list',
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

// 获得产品分类汇总统计 GET /crm/statistics-product/get-product-category-summary
export async function getProductCategorySummary(
  params: API.getProductCategorySummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmStatisticsProductCategorySummaryRespVO>(
    '/crm/statistics-product/get-product-category-summary',
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
