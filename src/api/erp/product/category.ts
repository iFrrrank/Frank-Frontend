import { request } from '@umijs/max'

// 创建产品分类 POST /erp/product-category/create
export async function createProductCategory(
  body: API.ErpProductCategorySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/product-category/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除产品分类 DELETE /erp/product-category/delete
export async function deleteProductCategory(
  params: API.deleteProductCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/product-category/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出产品分类 Excel GET /erp/product-category/export-excel
export async function exportProductCategoryExcel(
  params: API.exportProductCategoryExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/product-category/export-excel', {
    method: 'GET',
    params: {
      ...params,
      listReqVO: undefined,
      ...params['listReqVO']
    },
    ...(options || {})
  })
}

// 获取产品分类 GET /erp/product-category/get
export async function getProductCategory(
  params: API.getProductCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpProductCategoryRespVO>('/erp/product-category/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取产品分类列表 GET /erp/product-category/list
export async function getProductCategoryList(
  params: API.getProductCategoryListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListErpProductCategoryRespVO>('/erp/product-category/list', {
    method: 'GET',
    params: {
      ...params,
      listReqVO: undefined,
      ...params['listReqVO']
    },
    ...(options || {})
  })
}

// 获取产品分类精简列表 只包含被开启的分类，主要用于前端的下拉选项 GET /erp/product-category/simple-list
export async function getProductCategorySimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListErpProductCategoryRespVO>(
    '/erp/product-category/simple-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 更新产品分类 PUT /erp/product-category/update
export async function updateProductCategory(
  body: API.ErpProductCategorySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/product-category/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

