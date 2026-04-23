import { request } from '@umijs/max'

/** 创建产品 POST /crm/product/create */
export async function createProduct(
  body: API.CrmProductSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/product/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除产品 DELETE /crm/product/delete */
export async function deleteProduct(
  params: API.deleteProductParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/product/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 导出产品 Excel GET /crm/product/export-excel */
export async function exportProductExcel(
  params: API.exportProductExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/crm/product/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

/** 获取产品 GET /crm/product/get */
export async function getProduct(params: API.getProductParams, options?: { [key: string]: any }) {
  return request<API.CommonResultCrmProductRespVO>('/crm/product/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取产品分页列表 GET /crm/product/page */
export async function getProductPage(
  params: API.getProductPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmProductRespVO>('/crm/product/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 获取产品精简列表 只包含被开启的产品，主要用于前端的下拉选项 GET /crm/product/simple-list */
export async function getProductSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListCrmProductRespVO>('/crm/product/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

/** 更新产品 PUT /crm/product/update */
export async function updateProduct(
  body: API.CrmProductSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/product/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
