import { request } from '@umijs/max'

// 关闭砍价活动 PUT /promotion/bargain-activity/close
export async function closeSeckillActivity1(
  params: API.closeSeckillActivity1Params,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/bargain-activity/close', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 创建砍价活动 POST /promotion/bargain-activity/create
export async function createBargainActivity(
  body: API.PromotionBargainActivityCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/bargain-activity/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除砍价活动 DELETE /promotion/bargain-activity/delete
export async function deleteBargainActivity(
  params: API.deleteBargainActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/bargain-activity/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取砍价活动 GET /promotion/bargain-activity/get
export async function getBargainActivity(
  params: API.getBargainActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionBargainActivityRespVO>(
    '/promotion/bargain-activity/get',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取砍价活动分页列表 GET /promotion/bargain-activity/page
export async function getBargainActivityPage(
  params: API.getBargainActivityPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionBargainActivityPageItemRespVO>(
    '/promotion/bargain-activity/page',
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

// 更新砍价活动 PUT /promotion/bargain-activity/update
export async function updateBargainActivity(
  body: API.PromotionBargainActivityUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/bargain-activity/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

