import { request } from '@umijs/max'

// 获取商品收藏分页列表 GET /product/favorite/page
export async function getFavoritePage(
  params: API.getFavoritePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultProductFavoriteRespVO>('/product/favorite/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

