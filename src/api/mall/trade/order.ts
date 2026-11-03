import { request } from '@umijs/max'

// 订单发货 PUT /trade/order/delivery
export async function deliveryOrder(
  body: API.TradeOrderDeliveryReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/order/delivery', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 查询核销码对应的订单 GET /trade/order/get-by-pick-up-verify-code
export async function getByPickUpVerifyCode(
  params: API.getByPickUpVerifyCodeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultTradeOrderDetailRespVO>(
    '/trade/order/get-by-pick-up-verify-code',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取交易订单详情 GET /trade/order/get-detail
export async function getOrderDetail(
  params: API.getOrderDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultTradeOrderDetailRespVO>('/trade/order/get-detail', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取交易订单的物流轨迹 GET /trade/order/get-express-track-list
export async function getOrderExpressTrackList(
  params: API.getOrderExpressTrackListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListObject>('/trade/order/get-express-track-list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取交易订单分页列表 GET /trade/order/page
export async function getOrderPage(
  params: API.getOrderPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultTradeOrderPageItemRespVO>('/trade/order/page', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 订单核销 PUT /trade/order/pick-up-by-id
export async function pickUpOrderById(
  params: API.pickUpOrderByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/order/pick-up-by-id', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 订单核销 PUT /trade/order/pick-up-by-verify-code
export async function pickUpOrderByVerifyCode(
  params: API.pickUpOrderByVerifyCodeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/order/pick-up-by-verify-code', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取交易订单统计 GET /trade/order/summary
export async function getOrderSummary(
  params: API.getOrderSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultTradeOrderSummaryRespVO>('/trade/order/summary', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 修改订单收货地址 PUT /trade/order/update-address
export async function updateOrderAddress(
  body: API.TradeOrderUpdateAddressReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/order/update-address', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 订单调价 PUT /trade/order/update-price
export async function updateOrderPrice(
  body: API.TradeOrderUpdatePriceReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/order/update-price', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 订单备注 PUT /trade/order/update-remark
export async function updateOrderRemark(
  body: API.TradeOrderRemarkReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/order/update-remark', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
