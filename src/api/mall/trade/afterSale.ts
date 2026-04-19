import { request } from '@umijs/max'

// 是否同意售后 PUT /trade/after-sale/agree
export async function agreeAfterSale(
  params: API.agreeAfterSaleParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/after-sale/agree', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 拒绝售后 PUT /trade/after-sale/disagree
export async function disagreeAfterSale(
  body: API.AfterSaleDisagreeReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/after-sale/disagree', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取售后订单详情 GET /trade/after-sale/get-detail
export async function getOrderDetail1(
  params: API.getOrderDetail1Params,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultAfterSaleDetailRespVO>('/trade/after-sale/get-detail', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取售后订单分页列表 GET /trade/after-sale/page
export async function getAfterSalePage(
  params: API.getAfterSalePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultAfterSaleRespPageItemVO>('/trade/after-sale/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 确认收货 PUT /trade/after-sale/receive
export async function receiveAfterSale(
  params: API.receiveAfterSaleParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/after-sale/receive', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 是否确认退款 PUT /trade/after-sale/refund
export async function refundAfterSale(
  params: API.refundAfterSaleParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/after-sale/refund', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 拒绝收货 PUT /trade/after-sale/refuse
export async function refuseAfterSale(
  params: API.refuseAfterSaleParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/after-sale/refuse', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 更新售后订单为已退款 POST /trade/after-sale/update-refunded
export async function updateAfterSaleRefunded(
  body: API.PayRefundNotifyReqDTO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/after-sale/update-refunded', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

