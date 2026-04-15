import { request } from '@umijs/max'

// 创建优惠劵模板 POST /promotion/coupon-template/create
export async function createCouponTemplate(
  body: API.PromotionCouponTemplateCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/coupon-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除优惠劵模板 DELETE /promotion/coupon-template/delete
export async function deleteCouponTemplate(
  params: API.deleteCouponTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/coupon-template/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取优惠劵模板 GET /promotion/coupon-template/get
export async function getCouponTemplate(
  params: API.getCouponTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionCouponTemplateRespVO>('/promotion/coupon-template/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取优惠劵模板列表 GET /promotion/coupon-template/list
export async function getCouponTemplateList(
  params: API.getCouponTemplateListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListPromotionCouponTemplateRespVO>(
    '/promotion/coupon-template/list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取优惠劵模板分页列表 GET /promotion/coupon-template/page
export async function getCouponTemplatePage(
  params: API.getCouponTemplatePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionCouponTemplateRespVO>(
    '/promotion/coupon-template/page',
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

// 更新优惠劵模板 PUT /promotion/coupon-template/update
export async function updateCouponTemplate(
  body: API.PromotionCouponTemplateUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/coupon-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新优惠劵模板状态 PUT /promotion/coupon-template/update-status
export async function updateCouponTemplateStatus(
  body: API.PromotionCouponTemplateUpdateStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/coupon-template/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

