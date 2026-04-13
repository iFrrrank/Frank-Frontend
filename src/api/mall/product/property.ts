import { request } from '@umijs/max'

// 创建属性 POST /product/property/create
export async function createProperty(
  body: API.ProductPropertySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/product/property/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除属性 DELETE /product/property/delete
export async function deleteProperty(
  params: API.deletePropertyParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/property/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取属性 GET /product/property/get
export async function getProperty(params: API.getPropertyParams, options?: { [key: string]: any }) {
  return request<API.CommonResultProductPropertyRespVO>('/product/property/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取属性分页列表 GET /product/property/page
export async function getPropertyPage(
  params: API.getPropertyPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultProductPropertyRespVO>('/product/property/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 获取属性项精简列表 GET /product/property/simple-list
export async function getPropertySimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListProductPropertyRespVO>('/product/property/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 更新属性 PUT /product/property/update
export async function updateProperty(
  body: API.ProductPropertySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/property/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// ================属性值================
// 创建属性值 POST /product/property/value/create
export async function createPropertyValue(
  body: API.ProductPropertyValueSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/product/property/value/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除属性值 DELETE /product/property/value/delete
export async function deletePropertyValue(
  params: API.deletePropertyValueParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/property/value/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取属性值 GET /product/property/value/get
export async function getPropertyValue(
  params: API.getPropertyValueParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultProductPropertyValueRespVO>('/product/property/value/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取属性值分页列表 GET /product/property/value/page
export async function getPropertyValuePage(
  params: API.getPropertyValuePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultProductPropertyValueRespVO>(
    '/product/property/value/page',
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

// 获取属性值精简列表 GET /product/property/value/simple-list
export async function getPropertyValueSimpleList(
  params: API.getPropertyValueSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListProductPropertyValueRespVO>(
    '/product/property/value/simple-list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 更新属性值 PUT /product/property/value/update
export async function updatePropertyValue(
  body: API.ProductPropertyValueSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/property/value/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

