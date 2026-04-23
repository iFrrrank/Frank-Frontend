import { request } from '@umijs/max'

// 创建付款单 POST /erp/finance-payment/create
export async function createFinancePayment(
  body: API.ErpFinancePaymentSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/finance-payment/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除付款单 DELETE /erp/finance-payment/delete
export async function deleteFinancePayment(
  params: API.deleteFinancePaymentParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/finance-payment/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出付款单 Excel GET /erp/finance-payment/export-excel
export async function exportFinancePaymentExcel(
  params: API.exportFinancePaymentExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/finance-payment/export-excel', {
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

// 获取付款单 GET /erp/finance-payment/get
export async function getFinancePayment(
  params: API.getFinancePaymentParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpFinancePaymentRespVO>('/erp/finance-payment/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取付款单分页列表 GET /erp/finance-payment/page
export async function getFinancePaymentPage(
  params: API.getFinancePaymentPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpFinancePaymentRespVO>('/erp/finance-payment/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新付款单 PUT /erp/finance-payment/update
export async function updateFinancePayment(
  body: API.ErpFinancePaymentSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/finance-payment/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新付款单状态 PUT /erp/finance-payment/update-status
export async function updateFinancePaymentStatus(
  params: API.updateFinancePaymentStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/finance-payment/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
