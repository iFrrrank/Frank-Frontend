import { request } from '@umijs/max'

// 创建库存调拨单 POST /erp/stock-move/create
export async function createStockMove(
  body: API.ErpStockMoveSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/stock-move/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除库存调拨单 DELETE /erp/stock-move/delete
export async function deleteStockMove(
  params: API.deleteStockMoveParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-move/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出库存调拨单 Excel GET /erp/stock-move/export-excel
export async function exportStockMoveExcel(
  params: API.exportStockMoveExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/stock-move/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取库存调拨单 GET /erp/stock-move/get
export async function getStockMove(
  params: API.getStockMoveParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpStockMoveRespVO>('/erp/stock-move/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取库存调拨单分页列表 GET /erp/stock-move/page
export async function getStockMovePage(
  params: API.getStockMovePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpStockMoveRespVO>('/erp/stock-move/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新库存调拨单 PUT /erp/stock-move/update
export async function updateStockMove(
  body: API.ErpStockMoveSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-move/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新库存调拨单状态 PUT /erp/stock-move/update-status
export async function updateStockMoveStatus(
  params: API.updateStockMoveStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-move/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
