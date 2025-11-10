import { request } from '@umijs/max'

// 使用账号密码登录 POST /system/auth/login
export async function login(body: API.AuthLoginReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultAuthLoginRespVO>('/system/auth/login', {
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

// 发送验证码 POST /api/login/captcha
export async function getFakeCaptcha(
  params: {
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
