import { request } from '@umijs/max'

// 创建社交客户端 POST /system/social-client/create
export async function createSocialClient(
  body: API.SystemSocialClientSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/social-client/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除社交客户端 DELETE /system/social-client/delete
export async function deleteSocialClient(
  params: API.deleteSocialClientParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/social-client/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取社交客户端 GET /system/social-client/get
export async function getSocialClient(
  params: API.getSocialClientParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemSocialClientRespVO>('/system/social-client/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取社交客户端分页列表 GET /system/social-client/page
export async function getSocialClientPage(
  params: API.getSocialClientPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemSocialClientRespVO>('/system/social-client/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新社交客户端 PUT /system/social-client/update
export async function updateSocialClient(
  body: API.SystemSocialClientSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/social-client/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
