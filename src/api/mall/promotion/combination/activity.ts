import { request } from '@umijs/max'

// 关闭拼团活动 PUT /promotion/combination-activity/close
export async function closeCombinationActivity(
  params: API.closeCombinationActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/combination-activity/close', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 创建拼团活动 POST /promotion/combination-activity/create
export async function createCombinationActivity(
  body: API.PromotionCombinationActivityCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/combination-activity/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除拼团活动 DELETE /promotion/combination-activity/delete
export async function deleteCombinationActivity(
  params: API.deleteCombinationActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/combination-activity/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取拼团活动 GET /promotion/combination-activity/get
export async function getCombinationActivity(
  params: API.getCombinationActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionCombinationActivityRespVO>(
    '/promotion/combination-activity/get',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取拼团活动列表，基于拼团活动 Ids GET /promotion/combination-activity/list-by-ids
export async function getCombinationActivityListByIds(
  params: API.getCombinationActivityListByIdsParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListPromotionCombinationActivityRespVO>(
    '/promotion/combination-activity/list-by-ids',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获得拼团活动分页列表 GET /promotion/combination-activity/page
export async function getCombinationActivityPage(
  params: API.getCombinationActivityPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionCombinationActivityPageItemRespVO>(
    '/promotion/combination-activity/page',
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

// 更新拼团活动 PUT /promotion/combination-activity/update
export async function updateCombinationActivity(
  body: API.PromotionCombinationActivityUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/combination-activity/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
