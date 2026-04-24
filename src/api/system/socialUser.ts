import { request } from '@umijs/max'

// 社交绑定，使用 code 授权码 POST /system/social-user/bind
export async function socialBind(
  body: API.SystemSocialUserBindReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/social-user/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取社交用户 GET /system/social-user/get
export async function getSocialUser(
  params: API.getSocialUserParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemSocialUserRespVO>('/system/social-user/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取社交用户分页列表 GET /system/social-user/page
export async function getSocialUserPage(
  params: API.getSocialUserPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemSocialUserRespVO>('/system/social-user/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 取消社交绑定 DELETE /system/social-user/unbind
export async function socialUnbind(
  body: API.SystemSocialUserUnbindReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/social-user/unbind', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
