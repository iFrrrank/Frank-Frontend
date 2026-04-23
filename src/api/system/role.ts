import { request } from '@umijs/max'

// 创建角色 POST /system/role/create
export async function createRole(body: API.SystemRoleSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/system/role/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除角色 DELETE /system/role/delete
export async function deleteRole(params: API.deleteRoleParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/role/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出角色 GET /system/role/export-excel
export async function exportRoleExcel(
  params: API.exportUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<any>('/system/role/export-excel', {
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

// 获取角色信息 GET /system/role/get
export async function getRole(params: API.getRoleParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemRoleRespVO>('/system/role/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取角色精简信息列表 只包含被开启的角色，主要用于前端的下拉选项 GET /system/role/list-all-simple
export async function getSimpleRoleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemRoleRespVO>('/system/role/list-all-simple', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取角色分页列表 GET /system/role/page
export async function getRolePage(params: API.getRolePageParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPageResultSystemRoleRespVO>('/system/role/page', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取角色精简信息列表 只包含被开启的角色，主要用于前端的下拉选项 GET /system/role/simple-list
export async function getSimpleRoleList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemRoleRespVO>('/system/role/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 修改角色 PUT /system/role/update
export async function updateRole(body: API.SystemRoleSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/role/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
