import { request } from '@umijs/max'

/** 创建通知公告 POST /system/notice/create */
export async function createNotice(
  body: API.SystemNoticeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/notice/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除通知公告 DELETE /system/notice/delete */
export async function deleteNotice(
  params: API.deleteNoticeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/notice/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取通知公告 GET /system/notice/get */
export async function getNotice(params: API.getNoticeParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemNoticeRespVO>('/system/notice/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取通知公告分页列表 GET /system/notice/page */
export async function getNoticePage(
  params: API.getNoticePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemNoticeRespVO>('/system/notice/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

/** 推送通知公告 只发送给 websocket 连接在线的用户 POST /system/notice/push */
export async function push(params: API.pushParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/notice/push', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 修改通知公告 PUT /system/notice/update */
export async function updateNotice(
  body: API.SystemNoticeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/notice/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
