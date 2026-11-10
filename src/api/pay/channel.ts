import { request } from '@umijs/max'

// 创建支付渠道 POST /pay/channel/create
export async function createChannel(
  body: API.PayChannelCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/pay/channel/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除支付渠道 DELETE /pay/channel/delete
export async function deleteChannel(
  params: API.deleteChannelParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/channel/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取支付渠道 GET /pay/channel/get
export async function getChannel(params: API.getChannelParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPayChannelRespVO>('/pay/channel/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取指定应用的开启的支付渠道编码列表 GET /pay/channel/get-enable-code-list
export async function getEnableChannelCodeList(
  params: API.getEnableChannelCodeListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSetString>('/pay/channel/get-enable-code-list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 更新支付渠道 PUT /pay/channel/update
export async function updateChannel(
  body: API.PayChannelUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/channel/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
