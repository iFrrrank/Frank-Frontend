import { request } from '@umijs/max'

// 创建示例订单 POST /pay/demo-order/create
export async function createDemoOrder(
  body: API.PayDemoOrderCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/pay/demo-order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取示例订单分页 GET /pay/demo-order/page
export async function getDemoOrderPage(
  params: API.getDemoOrderPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPayDemoOrderRespVO>('/pay/demo-order/page', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 退款示例订单 PUT /pay/demo-order/refund
export async function refundDemoOrder(
  params: API.refundDemoOrderParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/demo-order/refund', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
