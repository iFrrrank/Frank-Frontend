import { request } from '@umijs/max'

// 创建库存调拨单 POST /erp/stock-check/create
export async function createStockCheck(
  body: API.ErpStockCheckSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/stock-check/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除库存调拨单 DELETE /erp/stock-check/delete
export async function deleteStockCheck(
  params: API.deleteStockCheckParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-check/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出库存调拨单 Excel GET /erp/stock-check/export-excel
export async function exportStockCheckExcel(
  params: API.exportStockCheckExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/stock-check/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取库存调拨单 GET /erp/stock-check/get
export async function getStockCheck(
  params: API.getStockCheckParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpStockCheckRespVO>('/erp/stock-check/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取库存调拨单分页列表 GET /erp/stock-check/page
export async function getStockCheckPage(
  params: API.getStockCheckPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpStockCheckRespVO>('/erp/stock-check/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新库存调拨单 PUT /erp/stock-check/update
export async function updateStockCheck(
  body: API.ErpStockCheckSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-check/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新库存调拨单状态 PUT /erp/stock-check/update-status
export async function updateStockCheckStatus(
  params: API.updateStockCheckStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-check/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

