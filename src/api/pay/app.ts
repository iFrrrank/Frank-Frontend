import { request } from '@umijs/max'

// 创建支付应用信息 POST /pay/app/create
export async function createApp(body: API.PayAppCreateReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/pay/app/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除支付应用信息 DELETE /pay/app/delete
export async function deleteApp(params: API.deleteAppParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/pay/app/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取支付应用信息 GET /pay/app/get
export async function getApp(params: API.getAppParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPayAppRespVO>('/pay/app/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取支付应用列表 GET /pay/app/list
export async function getAppList(options?: { [key: string]: any }) {
  return request<API.CommonResultListPayAppRespVO>('/pay/app/list', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取支付应用信息分页 GET /pay/app/page
export async function getAppPage(params: API.getAppPageParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPageResultPayAppPageItemRespVO>('/pay/app/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新支付应用信息 PUT /pay/app/update
export async function updateApp(body: API.PayAppUpdateReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/pay/app/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新支付应用状态 PUT /pay/app/update-status
export async function updateAppStatus(
  body: API.PayAppUpdateStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/app/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

