import { request } from '@umijs/max'

// 获取商品浏览记录分页列表 GET /product/browse-history/page
export async function getBrowseHistoryPage(
  params: API.getBrowseHistoryPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultProductBrowseHistoryRespVO>(
    '/product/browse-history/page',
    {
      method: 'GET',
      params: {
        ...params,
        pageReqVO: undefined,
        ...params['pageReqVO']
      },
      ...(options || {})
    }
  )
}

