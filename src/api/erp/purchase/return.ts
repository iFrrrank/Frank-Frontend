import { request } from '@umijs/max'

// 创建采购退货 POST /erp/purchase-return/create
export async function createPurchaseReturn(
  body: API.ErpPurchaseReturnSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/purchase-return/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除采购退货 DELETE /erp/purchase-return/delete
export async function deletePurchaseReturn(
  params: API.deletePurchaseReturnParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/purchase-return/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出采购退货 Excel GET /erp/purchase-return/export-excel
export async function exportPurchaseReturnExcel(
  params: API.exportPurchaseReturnExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/purchase-return/export-excel', {
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

// 获取采购退货 GET /erp/purchase-return/get
export async function getPurchaseReturn(
  params: API.getPurchaseReturnParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpPurchaseReturnRespVO>('/erp/purchase-return/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取采购退货分页列表 GET /erp/purchase-return/page
export async function getPurchaseReturnPage(
  params: API.getPurchaseReturnPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpPurchaseReturnRespVO>('/erp/purchase-return/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新采购退货 PUT /erp/purchase-return/update
export async function updatePurchaseReturn(
  body: API.ErpPurchaseReturnSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/purchase-return/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新采购退货状态 PUT /erp/purchase-return/update-status
export async function updatePurchaseReturnStatus(
  params: API.updatePurchaseReturnStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/purchase-return/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
