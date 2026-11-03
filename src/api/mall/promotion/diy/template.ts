import { request } from '@umijs/max'

// 创建装修模板 POST /promotion/diy-template/create
export async function createDiyTemplate(
  body: API.PromotionDiyTemplateCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/diy-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除装修模板 DELETE /promotion/diy-template/delete
export async function deleteDiyTemplate(
  params: API.deleteDiyTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/diy-template/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取装修模板 GET /promotion/diy-template/get
export async function getDiyTemplate(
  params: API.getDiyTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionDiyTemplateRespVO>('/promotion/diy-template/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取装修模板属性 GET /promotion/diy-template/get-property
export async function getDiyTemplateProperty(
  params: API.getDiyTemplatePropertyParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionDiyTemplatePropertyRespVO>(
    '/promotion/diy-template/get-property',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取装修模板分页列表 GET /promotion/diy-template/page
export async function getDiyTemplatePage(
  params: API.getDiyTemplatePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionDiyTemplateRespVO>(
    '/promotion/diy-template/page',
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

// 更新装修模板 PUT /promotion/diy-template/update
export async function updateDiyTemplate(
  body: API.PromotionDiyTemplateUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/diy-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新装修模板属性 PUT /promotion/diy-template/update-property
export async function updateDiyTemplateProperty(
  body: API.PromotionDiyTemplatePropertyUpdateRequestVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/diy-template/update-property', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 使用装修模板 PUT /promotion/diy-template/use
export async function useDiyTemplate(
  params: API.useDiyTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/diy-template/use', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
