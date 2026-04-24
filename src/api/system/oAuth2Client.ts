import { request } from '@umijs/max'

// 创建 OAuth2 客户端 POST /system/oauth2-client/create
export async function createOAuth2Client(
  body: API.SystemOAuth2ClientSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/oauth2-client/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除 OAuth2 客户端 DELETE /system/oauth2-client/delete
export async function deleteOAuth2Client(
  params: API.deleteOAuth2ClientParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/oauth2-client/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取 OAuth2 客户端 GET /system/oauth2-client/get
export async function getOAuth2Client(
  params: API.getOAuth2ClientParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemOAuth2ClientRespVO>('/system/oauth2-client/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取 OAuth2 客户端分页列表 GET /system/oauth2-client/page
export async function getOAuth2ClientPage(
  params: API.getOAuth2ClientPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemOAuth2ClientRespVO>('/system/oauth2-client/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新 OAuth2 客户端 PUT /system/oauth2-client/update
export async function updateOAuth2Client(
  body: API.SystemOAuth2ClientSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/oauth2-client/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
