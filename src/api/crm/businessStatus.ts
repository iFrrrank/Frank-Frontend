import { request } from '@umijs/max'

// 创建商机状态 POST /crm/business-status/create
export async function createBusinessStatus(
  body: API.CrmBusinessStatusSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/business-status/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除商机状态 DELETE /crm/business-status/delete
export async function deleteBusinessStatusType(
  params: API.deleteBusinessStatusTypeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/business-status/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取商机状态 GET /crm/business-status/get
export async function getBusinessStatusType(
  params: API.getBusinessStatusTypeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultCrmBusinessStatusRespVO>('/crm/business-status/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取商机状态分页列表 GET /crm/business-status/page
export async function getBusinessStatusPage(
  params: API.getBusinessStatusPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmBusinessStatusRespVO>('/crm/business-status/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取商机状态列表 GET /crm/business-status/status-simple-list
export async function getBusinessStatusSimpleList(
  params: API.getBusinessStatusSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListStatus>('/crm/business-status/status-simple-list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取商机状态组列表 GET /crm/business-status/type-simple-list
export async function getBusinessStatusTypeSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListCrmBusinessStatusRespVO>(
    '/crm/business-status/type-simple-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 更新商机状态 PUT /crm/business-status/update
export async function updateBusinessStatus(
  body: API.CrmBusinessStatusSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/business-status/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
