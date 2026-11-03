import { request } from '@umijs/max'

// 创建社保方案 POST /hrm/insurance/scheme/create
export async function createScheme(
  body: API.HrmInsuranceSchemeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/insurance/scheme/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除社保方案 DELETE /hrm/insurance/scheme/delete
export async function deleteScheme(
  params: API.deleteSchemeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/insurance/scheme/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取社保方案 GET /hrm/insurance/scheme/get
export async function getScheme(params: API.getSchemeParams, options?: { [key: string]: any }) {
  return request<API.CommonResultHrmInsuranceSchemeRespVO>('/hrm/insurance/scheme/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取社保方案列表 GET /hrm/insurance/scheme/list
export async function getSchemeList(options?: { [key: string]: any }) {
  return request<API.CommonResultListHrmInsuranceSchemeRespVO>('/hrm/insurance/scheme/list', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取社保方案精简列表 GET /hrm/insurance/scheme/simple-list
export async function getSchemeSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListHrmInsuranceSchemeRespVO>(
    '/hrm/insurance/scheme/simple-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 更新社保方案 PUT /hrm/insurance/scheme/update
export async function updateScheme(
  body: API.HrmInsuranceSchemeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/insurance/scheme/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
