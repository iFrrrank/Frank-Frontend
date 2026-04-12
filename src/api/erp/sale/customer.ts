import { request } from '@umijs/max'

// 创建客户 POST /erp/customer/create
export async function createCustomer(
  body: API.ErpCustomerSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/customer/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除客户 DELETE /erp/customer/delete
export async function deleteCustomer(
  params: API.deleteCustomerParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/customer/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出客户 Excel GET /erp/customer/export-excel
export async function exportCustomerExcel(
  params: API.exportCustomerExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/customer/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 获取客户 GET /erp/customer/get
export async function getCustomer(params: API.getCustomerParams, options?: { [key: string]: any }) {
  return request<API.CommonResultErpCustomerRespVO>('/erp/customer/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取客户分页列表 GET /erp/customer/page
export async function getCustomerPage(
  params: API.getCustomerPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpCustomerRespVO>('/erp/customer/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 获取客户精简列表 只包含被开启的客户，主要用于前端的下拉选项 GET /erp/customer/simple-list
export async function getCustomerSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListErpCustomerRespVO>('/erp/customer/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 更新客户 PUT /erp/customer/update
export async function updateCustomer(
  body: API.ErpCustomerSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/customer/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

