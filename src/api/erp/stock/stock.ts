import { request } from '@umijs/max'

// 导出产品库存 Excel GET /erp/stock/export-excel
export async function exportStockExcel(
  params: API.exportStockExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/stock/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取产品库存 GET /erp/stock/get
export async function getStock(params: API.getStockParams, options?: { [key: string]: any }) {
  return request<API.CommonResultErpStockRespVO>('/erp/stock/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取产品库存数量 GET /erp/stock/get-count
export async function getStockCount(
  params: API.getStockCountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBigDecimal>('/erp/stock/get-count', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取产品库存分页列表 GET /erp/stock/page
export async function getStockPage(
  params: API.getStockPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpStockRespVO>('/erp/stock/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

