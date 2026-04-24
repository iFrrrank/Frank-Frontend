import { request } from '@umijs/max'

// 校验验证码 POST /system/captcha/check
export async function check(body: API.CaptchaVO, options?: { [key: string]: any }) {
  return request<API.ResponseModel>('/system/captcha/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取验证码 POST /system/captcha/get
export async function get(body: API.CaptchaVO, options?: { [key: string]: any }) {
  return request<API.ResponseModel>('/system/captcha/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
