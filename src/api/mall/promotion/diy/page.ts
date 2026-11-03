import { request } from '@umijs/max'

// 创建装修页面 POST /promotion/diy-page/create
export async function createDiyPage(
  body: API.PromotionDiyPageCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/diy-page/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除装修页面 DELETE /promotion/diy-page/delete
export async function deleteDiyPage(
  params: API.deleteDiyPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/diy-page/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取装修页面 GET /promotion/diy-page/get
export async function getDiyPage(params: API.getDiyPageParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPromotionDiyPageRespVO>('/promotion/diy-page/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取装修页面属性 GET /promotion/diy-page/get-property
export async function getDiyPageProperty(
  params: API.getDiyPagePropertyParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionDiyPagePropertyRespVO>(
    '/promotion/diy-page/get-property',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取装修页面列表 GET /promotion/diy-page/list
export async function getDiyPageList(
  params: API.getDiyPageListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListPromotionDiyPageRespVO>('/promotion/diy-page/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取装修页面分页列表 GET /promotion/diy-page/page
export async function getDiyPagePage(
  params: API.getDiyPagePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionDiyPageRespVO>('/promotion/diy-page/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新装修页面 PUT /promotion/diy-page/update
export async function updateDiyPage(
  body: API.PromotionDiyPageUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/diy-page/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新装修页面属性 PUT /promotion/diy-page/update-property
export async function updateDiyPageProperty(
  body: API.PromotionDiyPagePropertyUpdateRequestVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/diy-page/update-property', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
