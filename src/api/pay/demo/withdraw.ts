import { request } from '@umijs/max'

// 创建示例提现单 POST /pay/demo-withdraw/create
export async function createDemoWithdraw(
  body: API.PayDemoWithdrawCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/pay/demo-withdraw/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取示例提现单分页 GET /pay/demo-withdraw/page
export async function getDemoWithdrawPage(
  params: API.getDemoWithdrawPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPayDemoWithdrawRespVO>('/pay/demo-withdraw/page', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 发起示例提现单转账 POST /pay/demo-withdraw/transfer
export async function transferDemoWithdraw(
  params: API.transferDemoWithdrawParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/demo-withdraw/transfer', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}
