import { request } from '@umijs/max'

// 关闭满减送活动 PUT /promotion/reward-activity/close
export async function closeRewardActivity(
  params: API.closeRewardActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/reward-activity/close', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 创建满减送活动 POST /promotion/reward-activity/create
export async function createRewardActivity(
  body: API.PromotionRewardActivityCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/reward-activity/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除满减送活动 DELETE /promotion/reward-activity/delete
export async function deleteRewardActivity(
  params: API.deleteRewardActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/reward-activity/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取满减送活动 GET /promotion/reward-activity/get
export async function getRewardActivity(
  params: API.getRewardActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionRewardActivityRespVO>('/promotion/reward-activity/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取满减送活动分页列表 GET /promotion/reward-activity/page
export async function getRewardActivityPage(
  params: API.getRewardActivityPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionRewardActivityRespVO>(
    '/promotion/reward-activity/page',
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

// 更新满减送活动 PUT /promotion/reward-activity/update
export async function updateRewardActivity(
  body: API.PromotionRewardActivityUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/reward-activity/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

