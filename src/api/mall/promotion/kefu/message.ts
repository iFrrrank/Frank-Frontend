import { request } from '@umijs/max'

// 发送客服消息 POST /promotion/kefu-message/send
export async function sendKeFuMessage(
  body: API.KeFuMessageSendReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/kefu-message/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新客服消息已读状态 PUT /promotion/kefu-message/update-read-status
export async function updateKeFuMessageReadStatus(
  params: API.updateKeFuMessageReadStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/kefu-message/update-read-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获得客服消息列表 GET /promotion/kefu-message/list
export async function getKeFuMessageList(
  params: API.getKeFuMessageListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListKeFuMessageRespVO>('/promotion/kefu-message/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}
