import { request } from '@umijs/max'

// 通过申请 PUT /trade/brokerage-withdraw/approve
export async function approveBrokerageWithdraw(
  params: API.approveBrokerageWithdrawParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/brokerage-withdraw/approve', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取佣金提现 GET /trade/brokerage-withdraw/get
export async function getBrokerageWithdraw(
  params: API.getBrokerageWithdrawParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBrokerageWithdrawRespVO>('/trade/brokerage-withdraw/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取佣金提现分页列表 GET /trade/brokerage-withdraw/page
export async function getBrokerageWithdrawPage(
  params: API.getBrokerageWithdrawPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultBrokerageWithdrawRespVO>(
    '/trade/brokerage-withdraw/page',
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

// 驳回申请 PUT /trade/brokerage-withdraw/reject
export async function rejectBrokerageWithdraw(
  body: API.BrokerageWithdrawRejectReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/brokerage-withdraw/reject', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新佣金提现的转账结果 POST /trade/brokerage-withdraw/update-transferred
export async function updateBrokerageWithdrawTransferred(
  body: API.PayTransferNotifyReqDTO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/brokerage-withdraw/update-transferred', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
