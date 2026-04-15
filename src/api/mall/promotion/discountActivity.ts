import { request } from '@umijs/max'

// 关闭限时折扣活动 PUT /promotion/discount-activity/close
export async function closeRewardActivity1(
  params: API.closeRewardActivity1Params,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/discount-activity/close', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 创建限时折扣活动 POST /promotion/discount-activity/create
export async function createDiscountActivity(
  body: API.PromotionDiscountActivityCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/discount-activity/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除限时折扣活动 DELETE /promotion/discount-activity/delete
export async function deleteDiscountActivity(
  params: API.deleteDiscountActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/discount-activity/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取限时折扣活动 GET /promotion/discount-activity/get
export async function getDiscountActivity(
  params: API.getDiscountActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionDiscountActivityRespVO>(
    '/promotion/discount-activity/get',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取限时折扣活动分页列表 GET /promotion/discount-activity/page
export async function getDiscountActivityPage(
  params: API.getDiscountActivityPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionDiscountActivityRespVO>(
    '/promotion/discount-activity/page',
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

// 更新限时折扣活动 PUT /promotion/discount-activity/update
export async function updateDiscountActivity(
  body: API.PromotionDiscountActivityUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/discount-activity/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

