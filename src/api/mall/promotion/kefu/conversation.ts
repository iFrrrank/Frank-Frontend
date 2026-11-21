import { request } from '@umijs/max'

// 获得客服会话列表 GET /promotion/kefu-conversation/list
export async function getKeFuConversationList(options?: { [key: string]: any }) {
  return request<API.CommonResultListKeFuConversationRespVO>('/promotion/kefu-conversation/list', {
    method: 'GET',
    ...(options || {})
  })
}

// 获得客服会话 GET /promotion/kefu-conversation/get
export async function getKeFuConversation(
  params: API.getKeFuConversationParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultKeFuConversationRespVO>('/promotion/kefu-conversation/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 客服会话置顶 PUT /promotion/kefu-conversation/update-conversation-pinned
export async function updateKeFuConversationPinned(
  body: { id: number; pinned: boolean },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>(
    '/promotion/kefu-conversation/update-conversation-pinned',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body,
      ...(options || {})
    }
  )
}

// 删除客服会话 DELETE /promotion/kefu-conversation/delete
export async function deleteKeFuConversation(
  params: API.deleteKeFuConversationParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/kefu-conversation/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}
