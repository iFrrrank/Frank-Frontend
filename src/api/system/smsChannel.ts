import { request } from '@umijs/max'

/** 创建短信渠道 POST /system/sms-channel/create */
export async function createSmsChannel(
  body: API.SystemSmsChannelSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/sms-channel/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除短信渠道 DELETE /system/sms-channel/delete */
export async function deleteSmsChannel(
  params: API.deleteSmsChannelParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/sms-channel/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取短信渠道 GET /system/sms-channel/get */
export async function getSmsChannel(
  params: API.getSmsChannelParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemSmsChannelRespVO>('/system/sms-channel/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取短信渠道精简列表 包含被禁用的短信渠道 GET /system/sms-channel/list-all-simple */
export async function getSimpleSmsChannelList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemSmsChannelSimpleRespVO>(
    '/system/sms-channel/list-all-simple',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

/** 获取短信渠道分页列表 GET /system/sms-channel/page */
export async function getSmsChannelPage(
  params: API.getSmsChannelPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemSmsChannelRespVO>('/system/sms-channel/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 获取短信渠道精简列表 包含被禁用的短信渠道 GET /system/sms-channel/simple-list */
export async function getSimpleSmsChannelList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemSmsChannelSimpleRespVO>(
    '/system/sms-channel/simple-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

/** 更新短信渠道 PUT /system/sms-channel/update */
export async function updateSmsChannel(
  body: API.SystemSmsChannelSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/sms-channel/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
