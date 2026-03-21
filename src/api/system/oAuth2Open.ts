import { request } from '@umijs/max'

/** 获取授权信息 适合 code 授权码模式，或者 implicit 简化模式；在 sso.vue 单点登录界面被【获取】调用 GET /system/oauth2/authorize */
export async function authorize(params: API.authorizeParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemOAuth2OpenAuthorizeInfoRespVO>('/system/oauth2/authorize', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 申请授权 适合 code 授权码模式，或者 implicit 简化模式；在 sso.vue 单点登录界面被【提交】调用 POST /system/oauth2/authorize */
export async function approveOrDeny(
  params: API.approveOrDenyParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultString>('/system/oauth2/authorize', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 校验访问令牌 POST /system/oauth2/check-token */
export async function checkToken(params: API.checkTokenParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemOAuth2OpenCheckTokenRespVO>('/system/oauth2/check-token', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取访问令牌 适合 code 授权码模式，或者 implicit 简化模式；在 sso.vue 单点登录界面被【获取】调用 POST /system/oauth2/token */
export async function postAccessToken(
  params: API.postAccessTokenParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemOAuth2OpenAccessTokenRespVO>('/system/oauth2/token', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 删除访问令牌 DELETE /system/oauth2/token */
export async function revokeToken(params: API.revokeTokenParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/oauth2/token', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}
