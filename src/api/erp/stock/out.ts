import { request } from '@umijs/max'

// 创建其它出库单 POST /erp/stock-out/create
export async function createStockOut(
  body: API.ErpStockOutSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/stock-out/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除其它出库单 DELETE /erp/stock-out/delete
export async function deleteStockOut(
  params: API.deleteStockOutParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-out/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出其它出库单 Excel GET /erp/stock-out/export-excel
export async function exportStockOutExcel(
  params: API.exportStockOutExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/stock-out/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取其它出库单 GET /erp/stock-out/get
export async function getStockOut(params: API.getStockOutParams, options?: { [key: string]: any }) {
  return request<API.CommonResultErpStockOutRespVO>('/erp/stock-out/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取其它出库单分页列表 GET /erp/stock-out/page
export async function getStockOutPage(
  params: API.getStockOutPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpStockOutRespVO>('/erp/stock-out/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新其它出库单 PUT /erp/stock-out/update
export async function updateStockOut(
  body: API.ErpStockOutSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-out/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新其它出库单状态 PUT /erp/stock-out/update-status
export async function updateStockOutStatus(
  params: API.updateStockOutStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-out/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

