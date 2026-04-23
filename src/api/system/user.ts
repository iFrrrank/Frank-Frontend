import { request } from '@umijs/max'

// 创建用户 POST /system/user/create
export async function createUser(body: API.SystemUserSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/system/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除用户 DELETE /system/user/delete
export async function deleteUser(params: API.deleteUserParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/user/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出用户 GET /system/user/export
export async function exportUserList(
  params: API.exportUserListParams,
  options?: { [key: string]: any }
) {
  return request<any>('/system/user/export', {
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

// 获取用户详情 GET /system/user/get
export async function getUser(params: API.getUserParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemUserRespVO>('/system/user/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取导入用户模板 GET /system/user/get-import-template
export async function importTemplate(options?: { [key: string]: any }) {
  return request<any>('/system/user/get-import-template', {
    method: 'GET',
    ...(options || {})
  })
}

// 导入用户 POST /system/user/import
export async function importExcel(
  params: API.importExcelParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemUserImportRespVO>('/system/user/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      ...params
    },
    data: body,
    ...(options || {})
  })
}

// 获取用户精简信息列表 只包含被开启的用户，主要用于前端的下拉选项 GET /system/user/list-all-simple
export async function getSimpleUserList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemUserSimpleRespVO>('/system/user/list-all-simple', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取用户分页列表 GET /system/user/page
export async function getUserPage(params: API.getUserPageParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPageResultSystemUserRespVO>('/system/user/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取用户精简信息列表 只包含被开启的用户，主要用于前端的下拉选项 GET /system/user/simple-list
export async function getSimpleUserList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemUserSimpleRespVO>('/system/user/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 修改用户 PUT /system/user/update
export async function updateUser(body: API.SystemUserSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 重置用户密码 PUT /system/user/update-password
export async function updateUserPassword(
  body: API.SystemUserUpdatePasswordReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/user/update-password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 修改用户状态 PUT /system/user/update-status
export async function updateUserStatus(
  body: API.SystemUserUpdateStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/user/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
