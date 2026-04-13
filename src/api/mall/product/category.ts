import { request } from '@umijs/max'

// 创建商品分类 POST /product/category/create
export async function createCategory(
  body: API.ProductCategorySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/product/category/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除商品分类 DELETE /product/category/delete
export async function deleteCategory(
  params: API.deleteCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/category/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取商品分类 GET /product/category/get
export async function getCategory(params: API.getCategoryParams, options?: { [key: string]: any }) {
  return request<API.CommonResultProductCategoryRespVO>('/product/category/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取商品分类列表 GET /product/category/list
export async function getCategoryList(
  params: API.getCategoryListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListProductCategoryRespVO>('/product/category/list', {
    method: 'GET',
    params: {
      ...params,
      listReqVO: undefined,
      ...params['listReqVO']
    },
    ...(options || {})
  })
}

// 更新商品分类 PUT /product/category/update
export async function updateCategory(
  body: API.ProductCategorySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/category/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

