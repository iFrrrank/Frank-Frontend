import { request } from '@umijs/max'

// 删除优惠劵 DELETE /promotion/coupon/delete
export async function deleteCoupon(
  params: API.deleteCouponParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/coupon/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取优惠劵分页列表 GET /promotion/coupon/page
export async function getCouponPage(
  params: API.getCouponPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionCouponPageItemRespVO>(
    '/promotion/coupon/page',
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

// 发送优惠劵 POST /promotion/coupon/send
export async function sendCoupon(
  body: API.PromotionCouponSendReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/coupon/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
