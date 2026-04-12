import { request } from '@umijs/max'

// 创建采购入库 POST /erp/purchase-in/create
export async function createPurchaseIn(
  body: API.ErpPurchaseInSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/purchase-in/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除采购入库 DELETE /erp/purchase-in/delete
export async function deletePurchaseIn(
  params: API.deletePurchaseInParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/purchase-in/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出采购入库 Excel GET /erp/purchase-in/export-excel
export async function exportPurchaseInExcel(
  params: API.exportPurchaseInExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/purchase-in/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取采购入库 GET /erp/purchase-in/get
export async function getPurchaseIn(
  params: API.getPurchaseInParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpPurchaseInRespVO>('/erp/purchase-in/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取采购入库分页列表 GET /erp/purchase-in/page
export async function getPurchaseInPage(
  params: API.getPurchaseInPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpPurchaseInRespVO>('/erp/purchase-in/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新采购入库 PUT /erp/purchase-in/update
export async function updatePurchaseIn(
  body: API.ErpPurchaseInSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/purchase-in/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新采购入库状态 PUT /erp/purchase-in/update-status
export async function updatePurchaseInStatus(
  params: API.updatePurchaseInStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/purchase-in/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

