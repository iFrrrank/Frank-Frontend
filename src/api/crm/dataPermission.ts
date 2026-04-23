import { request } from '@umijs/max'

// 创建数据权限 POST /crm/permission/create
export async function createPermission(
  body: API.CrmPermissionSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/permission/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除数据权限 DELETE /crm/permission/delete
export async function deletePermission(
  params: API.deletePermissionParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/permission/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 删除自己的数据权限 DELETE /crm/permission/delete-self
export async function deleteSelfPermission(
  params: API.deleteSelfPermissionParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/permission/delete-self', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取数据权限列表 GET /crm/permission/list
export async function getPermissionList(
  params: API.getPermissionListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmPermissionRespVO>('/crm/permission/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 更新数据权限 PUT /crm/permission/update
export async function updatePermission(
  body: API.CrmPermissionUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/permission/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
