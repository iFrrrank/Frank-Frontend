import { request } from '@umijs/max'

// 导出支付订单 Excel GET /pay/order/export-excel
export async function exportOrderExcel(
  params: API.exportOrderExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/pay/order/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    ...(options || {})
  })
}

// 获取支付订单 GET /pay/order/get
export async function getOrder1(params: API.getOrder1Params, options?: { [key: string]: any }) {
  return request<API.CommonResultPayOrderRespVO>('/pay/order/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取支付订单详情 GET /pay/order/get-detail
export async function getOrderDetail(
  params: API.getOrderDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPayOrderDetailsRespVO>('/pay/order/get-detail', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取支付订单分页列表 GET /pay/order/page
export async function getOrderPage(
  params: API.getOrderPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPayOrderPageItemRespVO>('/pay/order/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined
    },
    ...(options || {})
  })
}

// 提交支付订单 POST /pay/order/submit
export async function submitPayOrder(
  body: API.PayOrderSubmitReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPayOrderSubmitRespVO>('/pay/order/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

