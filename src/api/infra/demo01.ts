import { request } from '@umijs/max'

// 查询示例联系人分页 GET /infra/demo01-contact/page
export async function getDemo01ContactPage(
  params: { pageNo: number; pageSize: number; name?: string; sex?: number; createTime?: string[] },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultDemo01ContactVO>('/infra/demo01-contact/page', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 查询示例联系人详情 GET /infra/demo01-contact/get
export async function getDemo01Contact(
  params: API.getDemo01ContactParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultDemo01ContactVO>('/infra/demo01-contact/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 新增示例联系人 POST /infra/demo01-contact/create
export async function createDemo01Contact(
  body: API.Demo01ContactVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/infra/demo01-contact/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 修改示例联系人 PUT /infra/demo01-contact/update
export async function updateDemo01Contact(
  body: API.Demo01ContactVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/demo01-contact/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除示例联系人 DELETE /infra/demo01-contact/delete
export async function deleteDemo01Contact(
  params: API.deleteDemo01ContactParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/demo01-contact/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 批量删除示例联系人 DELETE /infra/demo01-contact/delete-list
export async function deleteDemo01ContactList(
  params: API.deleteDemo01ContactListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/demo01-contact/delete-list', {
    method: 'DELETE',
    params: {
      ids: params.ids.join(',')
    },
    ...(options || {})
  })
}

// 导出示例联系人 Excel GET /infra/demo01-contact/export-excel
export async function exportDemo01Contact(
  params: { name?: string; sex?: number; createTime?: string[] },
  options?: { [key: string]: any }
) {
  return request('/infra/demo01-contact/export-excel', {
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'blob',
    ...(options || {})
  })
}
