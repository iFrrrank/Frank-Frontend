import { request } from '@umijs/max'

/** 获取用户基本信息 GET /system/oauth2/user/get */
export async function getUserInfo(options?: { [key: string]: any }) {
  return request<API.CommonResultSystemOAuth2UserInfoRespVO>('/system/oauth2/user/get', {
    method: 'GET',
    ...(options || {})
  })
}

/** 更新用户基本信息 PUT /system/oauth2/user/update */
export async function updateUserInfo(
  body: API.SystemOAuth2UserUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/oauth2/user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
