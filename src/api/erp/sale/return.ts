import { request } from '@umijs/max'

// 创建销售退货 POST /erp/sale-return/create
export async function createSaleReturn(
  body: API.ErpSaleReturnSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/sale-return/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除销售退货 DELETE /erp/sale-return/delete
export async function deleteSaleReturn(
  params: API.deleteSaleReturnParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/sale-return/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出销售退货 Excel GET /erp/sale-return/export-excel
export async function exportSaleReturnExcel(
  params: API.exportSaleReturnExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/sale-return/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取销售退货 GET /erp/sale-return/get
export async function getSaleReturn(
  params: API.getSaleReturnParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpSaleReturnRespVO>('/erp/sale-return/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取销售退货分页列表 GET /erp/sale-return/page
export async function getSaleReturnPage(
  params: API.getSaleReturnPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpSaleReturnRespVO>('/erp/sale-return/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新销售退货 PUT /erp/sale-return/update
export async function updateSaleReturn(
  body: API.ErpSaleReturnSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/sale-return/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新销售退货状态 PUT /erp/sale-return/update-status
export async function updateSaleReturnStatus(
  params: API.updateSaleReturnStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/sale-return/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

