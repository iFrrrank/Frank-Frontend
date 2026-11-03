import { request } from '@umijs/max'

// 获得回调通知的明细 GET /pay/notify/get-detail
export async function getNotifyTaskDetail(
  params: API.getNotifyTaskDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPayNotifyTaskDetailRespVO>('/pay/notify/get-detail', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 支付渠道的统一【支付】回调 POST /pay/notify/order/${param0}
export async function notifyOrder(
  params: API.notifyOrderParams,
  body: string,
  options?: { [key: string]: any }
) {
  const { channelId: param0, ...queryParams } = params
  return request<string>(`/pay/notify/order/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    params: { ...queryParams },
    data: body,
    ...(options || {})
  })
}

// 获取回调通知分页 GET /pay/notify/page
export async function getNotifyTaskPage(
  params: API.getNotifyTaskPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPayNotifyTaskRespVO>('/pay/notify/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 支付渠道的统一【退款】回调 POST /pay/notify/refund/${param0}
export async function notifyRefund(
  params: API.notifyRefundParams,
  body: string,
  options?: { [key: string]: any }
) {
  const { channelId: param0, ...queryParams } = params
  return request<string>(`/pay/notify/refund/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    params: { ...queryParams },
    data: body,
    ...(options || {})
  })
}

// 支付渠道的统一【转账】回调 POST /pay/notify/transfer/${param0}
export async function notifyTransfer(
  params: API.notifyTransferParams,
  body: string,
  options?: { [key: string]: any }
) {
  const { channelId: param0, ...queryParams } = params
  return request<string>(`/pay/notify/transfer/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    params: { ...queryParams },
    data: body,
    ...(options || {})
  })
}
