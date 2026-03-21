import { request } from '@umijs/max'

/** 删除访问令牌 DELETE /system/oauth2-token/delete */
export async function deleteAccessToken(
  params: API.deleteAccessTokenParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/oauth2-token/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取访问令牌分页列表 只返回有效期内的 GET /system/oauth2-token/page */
export async function getAccessTokenPage(
  params: API.getAccessTokenPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemOAuth2AccessTokenRespVO>(
    '/system/oauth2-token/page',
    {
      method: 'GET',
      params: {
        ...params,
        reqVO: undefined,
        ...params['reqVO']
      },
      ...(options || {})
    }
  )
}
