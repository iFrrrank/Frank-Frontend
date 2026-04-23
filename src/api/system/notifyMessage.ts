import { request } from '@umijs/max'

// 获取站内信 GET /system/notify-message/get
export async function getNotifyMessage(
  params: API.getNotifyMessageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemNotifyMessageRespVO>('/system/notify-message/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取当前用户的未读站内信数量 GET /system/notify-message/get-unread-count
export async function getUnreadNotifyMessageCount(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/system/notify-message/get-unread-count', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取当前用户的最新站内信列表，默认 10 条 GET /system/notify-message/get-unread-list
export async function getUnreadNotifyMessageList(
  params: API.getUnreadNotifyMessageListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListSystemNotifyMessageRespVO>(
    '/system/notify-message/get-unread-list',
    {
      method: 'GET',
      params: {
        // size has a default value: 10
        size: '10',
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取我的站内信分页列表 GET /system/notify-message/my-page
export async function getMyMyNotifyMessagePage(
  params: API.getMyMyNotifyMessagePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemNotifyMessageRespVO>(
    '/system/notify-message/my-page',
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

// 获取站内信分页列表 GET /system/notify-message/page
export async function getNotifyMessagePage(
  params: API.getNotifyMessagePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemNotifyMessageRespVO>(
    '/system/notify-message/page',
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

// 标记所有站内信为已读 PUT /system/notify-message/update-all-read
export async function updateAllNotifyMessageRead(options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/notify-message/update-all-read', {
    method: 'PUT',
    ...(options || {})
  })
}

// 标记站内信为已读 PUT /system/notify-message/update-read
export async function updateNotifyMessageRead(
  params: API.updateNotifyMessageReadParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/notify-message/update-read', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
