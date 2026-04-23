import { request } from '@umijs/max'

// 获取登录用户信息 GET /system/user/profile/get
export async function getUserProfile(options?: { [key: string]: any }) {
  return request<API.CommonResultSystemUserProfileRespVO>('/system/user/profile/get', {
    method: 'GET',
    ...(options || {})
  })
}

// 修改用户个人信息 PUT /system/user/profile/update
export async function updateUserProfile(
  body: API.SystemUserProfileUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/user/profile/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 上传用户个人头像 PUT /system/user/profile/update-avatar
export async function updateUserAvatar1(body: {}, options?: { [key: string]: any }) {
  return request<API.CommonResultString>('/system/user/profile/update-avatar', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 上传用户个人头像 POST /system/user/profile/update-avatar
export async function updateUserAvatar(body: {}, options?: { [key: string]: any }) {
  return request<API.CommonResultString>('/system/user/profile/update-avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 修改用户个人密码 PUT /system/user/profile/update-password
export async function updateUserProfilePassword(
  body: API.SystemUserProfileUpdatePasswordReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/user/profile/update-password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
