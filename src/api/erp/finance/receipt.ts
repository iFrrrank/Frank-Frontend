import { request } from '@umijs/max'

// 创建收款单 POST /erp/finance-receipt/create
export async function createFinanceReceipt(
  body: API.ErpFinanceReceiptSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/finance-receipt/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除收款单 DELETE /erp/finance-receipt/delete
export async function deleteFinanceReceipt(
  params: API.deleteFinanceReceiptParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/finance-receipt/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出收款单 Excel GET /erp/finance-receipt/export-excel
export async function exportFinanceReceiptExcel(
  params: API.exportFinanceReceiptExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/finance-receipt/export-excel', {
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

// 获取收款单 GET /erp/finance-receipt/get
export async function getFinanceReceipt(
  params: API.getFinanceReceiptParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpFinanceReceiptRespVO>('/erp/finance-receipt/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取收款单分页列表 GET /erp/finance-receipt/page
export async function getFinanceReceiptPage(
  params: API.getFinanceReceiptPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpFinanceReceiptRespVO>('/erp/finance-receipt/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新收款单 PUT /erp/finance-receipt/update
export async function updateFinanceReceipt(
  body: API.ErpFinanceReceiptSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/finance-receipt/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新收款单状态 PUT /erp/finance-receipt/update-status
export async function updateFinanceReceiptStatus(
  params: API.updateFinanceReceiptStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/finance-receipt/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
