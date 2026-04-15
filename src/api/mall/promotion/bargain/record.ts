import { request } from '@umijs/max'

// 获取砍价记录分页列表 GET /promotion/bargain-record/page
export async function getBargainRecordPage(
  params: API.getBargainRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionBargainRecordPageItemRespVO>(
    '/promotion/bargain-record/page',
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

