import { request } from '@umijs/max'

// 获取登录用户的权限信息 GET /system/auth/get-permission-info
export async function getPermissionInfo(options?: { [key: string]: any }) {
  return request<API.CommonResultSystemAuthPermissionInfoRespVO>(
    '/system/auth/get-permission-info',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 使用账号密码登录 POST /system/auth/login
export async function login(body: API.SystemAuthLoginReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemAuthLoginRespVO>('/system/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 登出系统 POST /system/auth/logout
export async function logout(options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/auth/logout', {
    method: 'POST',
    ...(options || {})
  })
}

// 刷新令牌 POST /system/auth/refresh-token
export async function refreshToken(
  params: API.refreshTokenParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemAuthLoginRespVO>('/system/auth/refresh-token', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 使用短信验证码登录 POST /system/auth/sms-login
export async function smsLogin(
  body: API.SystemAuthSmsLoginReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemAuthLoginRespVO>('/system/auth/sms-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 社交授权的跳转 GET /system/auth/social-auth-redirect
export async function socialLogin(params: API.socialLoginParams, options?: { [key: string]: any }) {
  return request<API.CommonResultString>('/system/auth/social-auth-redirect', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 社交快捷登录，使用 code 授权码 适合未登录的用户，但是社交账号已绑定用户 POST /system/auth/social-login
export async function socialQuickLogin(
  body: API.SystemAuthSocialLoginReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemAuthLoginRespVO>('/system/auth/social-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
