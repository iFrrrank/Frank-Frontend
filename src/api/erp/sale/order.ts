import { request } from '@umijs/max'

// 创建销售订单 POST /erp/sale-order/create
export async function createSaleOrder(
  body: API.ErpSaleOrderSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/sale-order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除销售订单 DELETE /erp/sale-order/delete
export async function deleteSaleOrder(
  params: API.deleteSaleOrderParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/sale-order/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出销售订单 Excel GET /erp/sale-order/export-excel
export async function exportSaleOrderExcel(
  params: API.exportSaleOrderExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/sale-order/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取销售订单 GET /erp/sale-order/get
export async function getSaleOrder(
  params: API.getSaleOrderParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpSaleOrderRespVO>('/erp/sale-order/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取销售订单分页列表 GET /erp/sale-order/page
export async function getSaleOrderPage(
  params: API.getSaleOrderPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpSaleOrderRespVO>('/erp/sale-order/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新销售订单 PUT /erp/sale-order/update
export async function updateSaleOrder(
  body: API.ErpSaleOrderSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/sale-order/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新销售订单状态 PUT /erp/sale-order/update-status
export async function updateSaleOrderStatus(
  params: API.updateSaleOrderStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/sale-order/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

