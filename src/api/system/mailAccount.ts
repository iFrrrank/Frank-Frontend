import { request } from '@umijs/max'

// 创建邮箱账号 POST /system/mail-account/create
export async function createMailAccount(
  body: API.SystemMailAccountSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/mail-account/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除邮箱账号 DELETE /system/mail-account/delete
export async function deleteMailAccount(
  params: API.deleteMailAccountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/mail-account/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取邮箱账号 GET /system/mail-account/get
export async function getMailAccount(
  params: API.getMailAccountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemMailAccountRespVO>('/system/mail-account/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取邮箱账号精简列表 GET /system/mail-account/list-all-simple
export async function getSimpleMailAccountList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemMailAccountSimpleRespVO>(
    '/system/mail-account/list-all-simple',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获取邮箱账号分页列表 GET /system/mail-account/page
export async function getMailAccountPage(
  params: API.getMailAccountPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemMailAccountRespVO>('/system/mail-account/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取邮箱账号精简列表 GET /system/mail-account/simple-list
export async function getSimpleMailAccountList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemMailAccountSimpleRespVO>(
    '/system/mail-account/simple-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 修改邮箱账号 PUT /system/mail-account/update
export async function updateMailAccount(
  body: API.SystemMailAccountSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/mail-account/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
