import { request } from '@umijs/max'

// 导出产品库存明细 Excel GET /erp/stock-record/export-excel
export async function exportStockRecordExcel(
  params: API.exportStockRecordExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/stock-record/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取产品库存明细 GET /erp/stock-record/get
export async function getStockRecord(
  params: API.getStockRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpStockRecordRespVO>('/erp/stock-record/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取产品库存明细分页列表 GET /erp/stock-record/page
export async function getStockRecordPage(
  params: API.getStockRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpStockRecordRespVO>('/erp/stock-record/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

