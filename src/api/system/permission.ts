import { request } from '@umijs/max'

// 赋予角色数据权限 POST /system/permission/assign-role-data-scope
export async function assignRoleDataScope(
  body: API.SystemPermissionAssignRoleDataScopeReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/permission/assign-role-data-scope', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 赋予角色菜单 POST /system/permission/assign-role-menu
export async function assignRoleMenu(
  body: API.SystemPermissionAssignRoleMenuReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/permission/assign-role-menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 赋予用户角色 POST /system/permission/assign-user-role
export async function assignUserRole(
  body: API.SystemPermissionAssignUserRoleReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/permission/assign-user-role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取角色拥有的菜单编号 GET /system/permission/list-role-menus
export async function getRoleMenuList(
  params: API.getRoleMenuListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSetLong>('/system/permission/list-role-menus', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取管理员拥有的角色 Id 列表 GET /system/permission/list-user-roles
export async function listAdminRoles(
  params: API.listAdminRolesParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSetLong>('/system/permission/list-user-roles', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}
