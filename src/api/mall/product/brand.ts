import { request } from '@umijs/max'

// 创建品牌 POST /product/brand/create
export async function createBrand(
  body: API.ProductBrandCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/product/brand/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除品牌 DELETE /product/brand/delete
export async function deleteBrand(params: API.deleteBrandParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/product/brand/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取品牌 GET /product/brand/get
export async function getBrand(params: API.getBrandParams, options?: { [key: string]: any }) {
  return request<API.CommonResultProductBrandRespVO>('/product/brand/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取品牌列表 GET /product/brand/list
export async function getBrandList(
  params: API.getBrandListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListProductBrandRespVO>('/product/brand/list', {
    method: 'GET',
    params: {
      ...params,
      listVO: undefined,
      ...params['listVO']
    },
    ...(options || {})
  })
}

// 获取品牌精简信息列表 主要用于前端的下拉选项 GET /product/brand/list-all-simple
export async function getSimpleBrandList(options?: { [key: string]: any }) {
  return request<API.CommonResultListProductBrandSimpleRespVO>('/product/brand/list-all-simple', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取品牌分页列表 GET /product/brand/page
export async function getBrandPage(
  params: API.getBrandPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultProductBrandRespVO>('/product/brand/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新品牌 PUT /product/brand/update
export async function updateBrand(
  body: API.ProductBrandUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/brand/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
