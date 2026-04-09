import { request } from '@umijs/max'

// 创建供应商 POST /erp/supplier/create
export async function createSupplier(
  body: API.ErpSupplierSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/supplier/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除供应商 DELETE /erp/supplier/delete
export async function deleteSupplier(
  params: API.deleteSupplierParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/supplier/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出供应商 Excel GET /erp/supplier/export-excel
export async function exportSupplierExcel(
  params: API.exportSupplierExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/supplier/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取供应商 GET /erp/supplier/get
export async function getSupplier(params: API.getSupplierParams, options?: { [key: string]: any }) {
  return request<API.CommonResultErpSupplierRespVO>('/erp/supplier/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取供应商分页列表 GET /erp/supplier/page
export async function getSupplierPage(
  params: API.getSupplierPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpSupplierRespVO>('/erp/supplier/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取供应商精简列表 只包含被开启的供应商，主要用于前端的下拉选项 GET /erp/supplier/simple-list
export async function getSupplierSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListErpSupplierRespVO>('/erp/supplier/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 更新供应商 PUT /erp/supplier/update
export async function updateSupplier(
  body: API.ErpSupplierSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/supplier/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

