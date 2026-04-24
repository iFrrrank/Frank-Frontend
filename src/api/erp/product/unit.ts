import { request } from '@umijs/max'

// 创建产品单位 POST /erp/product-unit/create
export async function createProductUnit(
  body: API.ErpProductUnitSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/product-unit/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除产品单位 DELETE /erp/product-unit/delete
export async function deleteProductUnit(
  params: API.deleteProductUnitParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/product-unit/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出产品单位 Excel GET /erp/product-unit/export-excel
export async function exportProductUnitExcel(
  params: API.exportProductUnitExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/product-unit/export-excel', {
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

// 获取产品单位 GET /erp/product-unit/get
export async function getProductUnit(
  params: API.getProductUnitParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpProductUnitRespVO>('/erp/product-unit/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取产品单位分页列表 GET /erp/product-unit/page
export async function getProductUnitPage(
  params: API.getProductUnitPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpProductUnitRespVO>('/erp/product-unit/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取产品单位精简列表 只包含被开启的单位，主要用于前端的下拉选项 GET /erp/product-unit/simple-list
export async function getProductUnitSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListErpProductUnitRespVO>('/erp/product-unit/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 更新产品单位 PUT /erp/product-unit/update
export async function updateProductUnit(
  body: API.ErpProductUnitSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/product-unit/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
