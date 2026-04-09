import { request } from '@umijs/max'

// 创建结算账户 POST /erp/account/create
export async function createAccount(
  body: API.ErpAccountSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/account/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除结算账户 DELETE /erp/account/delete
export async function deleteAccount(
  params: API.deleteAccountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/account/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出结算账户 Excel GET /erp/account/export-excel
export async function exportAccountExcel(
  params: API.exportAccountExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/account/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取结算账户 GET /erp/account/get
export async function getAccount(params: API.getAccountParams, options?: { [key: string]: any }) {
  return request<API.CommonResultErpAccountRespVO>('/erp/account/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取结算账户分页列表 GET /erp/account/page
export async function getAccountPage(
  params: API.getAccountPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpAccountRespVO>('/erp/account/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取结算账户精简列表 只包含被开启的结算账户，主要用于前端的下拉选项 GET /erp/account/simple-list
export async function getAccountSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListErpAccountRespVO>('/erp/account/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 更新结算账户 PUT /erp/account/update
export async function updateAccount(
  body: API.ErpAccountSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/account/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新结算账户默认状态 PUT /erp/account/update-default-status
export async function updateAccountDefaultStatus(
  params: API.updateAccountDefaultStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/account/update-default-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

