import { request } from '@umijs/max'

// 查询示例分类列表 GET /infra/demo02-category/list
export async function getDemo02CategoryList(
  params?: { name?: string },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListDemo02CategoryVO>('/infra/demo02-category/list', {
    method: 'GET',
    params: {
      ...(params || {})
    },
    ...(options || {})
  })
}

// 查询示例分类详情 GET /infra/demo02-category/get
export async function getDemo02Category(
  params: API.getDemo02CategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultDemo02CategoryVO>('/infra/demo02-category/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 新增示例分类 POST /infra/demo02-category/create
export async function createDemo02Category(
  body: API.Demo02CategoryVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/infra/demo02-category/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 修改示例分类 PUT /infra/demo02-category/update
export async function updateDemo02Category(
  body: API.Demo02CategoryVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/demo02-category/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除示例分类 DELETE /infra/demo02-category/delete
export async function deleteDemo02Category(
  params: API.deleteDemo02CategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/demo02-category/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出示例分类 Excel GET /infra/demo02-category/export-excel
export async function exportDemo02Category(
  params?: { name?: string },
  options?: { [key: string]: any }
) {
  return request('/infra/demo02-category/export-excel', {
    method: 'GET',
    params: {
      ...(params || {})
    },
    responseType: 'blob',
    ...(options || {})
  })
}
