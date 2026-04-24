import { request } from '@umijs/max'

// 创建产品分类 POST /crm/product-category/create
export async function createProductCategory(
  body: API.CrmProductCategoryCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/product-category/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除产品分类 DELETE /crm/product-category/delete
export async function deleteProductCategory(
  params: API.deleteProductCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/product-category/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取产品分类 GET /crm/product-category/get
export async function getProductCategory(
  params: API.getProductCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultCrmProductCategoryRespVO>('/crm/product-category/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取产品分类列表 GET /crm/product-category/list
export async function getProductCategoryList(
  params: API.getProductCategoryListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmProductCategoryRespVO>('/crm/product-category/list', {
    method: 'GET',
    params: {
      ...params,
      listReqVO: undefined,
      ...params['listReqVO']
    },
    ...(options || {})
  })
}

// 更新产品分类 PUT /crm/product-category/update
export async function updateProductCategory(
  body: API.CrmProductCategoryCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/product-category/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
