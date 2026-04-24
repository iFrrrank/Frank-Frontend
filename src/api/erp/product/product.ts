import { request } from '@umijs/max'

// 创建产品 POST /erp/product/create
export async function createProduct(body: API.ProductSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/erp/product/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除产品 DELETE /erp/product/delete
export async function deleteProduct(
  params: API.deleteProductParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/product/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出产品 Excel GET /erp/product/export-excel
export async function exportProductExcel(
  params: API.exportProductExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/product/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['exportReqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// 获取产品 GET /erp/product/get
export async function getProduct(params: API.getProductParams, options?: { [key: string]: any }) {
  return request<API.CommonResultErpProductRespVO>('/erp/product/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取产品分页列表 GET /erp/product/page
export async function getProductPage(
  params: API.getProductPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpProductRespVO>('/erp/product/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 获取产品精简列表 只包含被开启的产品，主要用于前端的下拉选项 GET /erp/product/simple-list
export async function getProductSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListErpProductRespVO>('/erp/product/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 更新产品 PUT /erp/product/update
export async function updateProduct(body: API.ProductSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/erp/product/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
