import { request } from '@umijs/max'

// 获取用户详情 GET /system/user/get
export async function getUser(params: API.getUserParams, options?: { [key: string]: any }) {
  return request<API.CommonResultUserRespVO>('/system/user/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}
