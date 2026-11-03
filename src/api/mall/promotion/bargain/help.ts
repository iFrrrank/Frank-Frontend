import { request } from '@umijs/max'

// 获取砍价助力分页列表 GET /promotion/bargain-help/page
export async function getBargainHelpPage(
  params: API.getBargainHelpPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionBargainHelpRespVO>(
    '/promotion/bargain-help/page',
    {
      method: 'GET',
      params: {
        ...params,
        pageVO: undefined,
        ...params['pageVO']
      },
      ...(options || {})
    }
  )
}
