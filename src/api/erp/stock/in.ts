import { request } from '@umijs/max'

// 创建其它入库单 POST /erp/stock-in/create
export async function createStockIn(
  body: API.ErpStockInSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/stock-in/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除其它入库单 DELETE /erp/stock-in/delete
export async function deleteStockIn(
  params: API.deleteStockInParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-in/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出其它入库单 Excel GET /erp/stock-in/export-excel
export async function exportStockInExcel(
  params: API.exportStockInExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/stock-in/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取其它入库单 GET /erp/stock-in/get
export async function getStockIn(params: API.getStockInParams, options?: { [key: string]: any }) {
  return request<API.CommonResultErpStockInRespVO>('/erp/stock-in/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取其它入库单分页列表 GET /erp/stock-in/page
export async function getStockInPage(
  params: API.getStockInPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpStockInRespVO>('/erp/stock-in/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新其它入库单 PUT /erp/stock-in/update
export async function updateStockIn(
  body: API.ErpStockInSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-in/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新其它入库单状态 PUT /erp/stock-in/update-status
export async function updateStockInStatus(
  params: API.updateStockInStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/stock-in/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

