import { request } from '@umijs/max'

// 获取拼团记录的概要信息 用于拼团记录页面展示 GET /promotion/combination-record/get-summary
export async function getCombinationRecordSummary(options?: { [key: string]: any }) {
  return request<API.CommonResultPromotionCombinationRecordSummaryVO>(
    '/promotion/combination-record/get-summary',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获取拼团记录分页列表 GET /promotion/combination-record/page
export async function getCombinationRecordPage(
  params: API.getCombinationRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionCombinationRecordPageItemRespVO>(
    '/promotion/combination-record/page',
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
