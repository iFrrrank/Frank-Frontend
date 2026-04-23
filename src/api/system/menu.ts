import { request } from '@umijs/max'

// 创建菜单 POST /system/menu/create
export async function createMenu(body: API.SystemMenuSaveVO, options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/system/menu/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除菜单 DELETE /system/menu/delete
export async function deleteMenu(params: API.deleteMenuParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/menu/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取菜单信息 GET /system/menu/get
export async function getMenu(params: API.getMenuParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemMenuRespVO>('/system/menu/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取菜单列表 用于【菜单管理】界面 GET /system/menu/list
export async function getMenuList(params: API.getMenuListParams, options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemMenuRespVO>('/system/menu/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取菜单精简信息列表 只包含被开启的菜单，用于【角色分配菜单】功能的选项 GET /system/menu/list-all-simple
export async function getSimpleMenuList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemMenuSimpleRespVO>('/system/menu/list-all-simple', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取菜单精简信息列表 只包含被开启的菜单，用于【角色分配菜单】功能的选项 GET /system/menu/simple-list
export async function getSimpleMenuList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemMenuSimpleRespVO>('/system/menu/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 修改菜单 PUT /system/menu/update
export async function updateMenu(body: API.SystemMenuSaveVO, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/menu/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
