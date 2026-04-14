import { request } from '@umijs/max'

// 创建 Banner POST /promotion/banner/create
export async function createBanner(
  body: API.PromotionBannerCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/banner/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除 Banner DELETE /promotion/banner/delete
export async function deleteBanner(
  params: API.deleteBannerParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/banner/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取 Banner GET /promotion/banner/get
export async function getBanner(params: API.getBannerParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPromotionBannerRespVO>('/promotion/banner/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取 Banner 分页列表 GET /promotion/banner/page
export async function getBannerPage(
  params: API.getBannerPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionBannerRespVO>('/promotion/banner/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新 Banner PUT /promotion/banner/update
export async function updateBanner(
  body: API.PromotionBannerUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/banner/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

