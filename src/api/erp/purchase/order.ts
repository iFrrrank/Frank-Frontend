import { request } from '@umijs/max'

// 创建采购订单 POST /erp/purchase-order/create
export async function createPurchaseOrder(
  body: API.ErpPurchaseOrderSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/purchase-order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除采购订单 DELETE /erp/purchase-order/delete
export async function deletePurchaseOrder(
  params: API.deletePurchaseOrderParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/purchase-order/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出采购订单 Excel GET /erp/purchase-order/export-excel
export async function exportPurchaseOrderExcel(
  params: API.exportPurchaseOrderExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/purchase-order/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// 获取采购订单 GET /erp/purchase-order/get
export async function getPurchaseOrder(
  params: API.getPurchaseOrderParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpPurchaseOrderRespVO>('/erp/purchase-order/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取采购订单分页列表 GET /erp/purchase-order/page
export async function getPurchaseOrderPage(
  params: API.getPurchaseOrderPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpPurchaseOrderRespVO>('/erp/purchase-order/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新采购订单 PUT /erp/purchase-order/update
export async function updatePurchaseOrder(
  body: API.ErpPurchaseOrderSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/purchase-order/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新采购订单状态 PUT /erp/purchase-order/update-status
export async function updatePurchaseOrderStatus(
  params: API.updatePurchaseOrderStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/purchase-order/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
