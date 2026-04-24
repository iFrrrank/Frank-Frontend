import { request } from '@umijs/max'

// 导出退款订单 Excel GET /pay/refund/export-excel
export async function exportRefundExcel(
  params: API.exportRefundExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/pay/refund/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// 获取退款订单 GET /pay/refund/get
export async function getRefund1(params: API.getRefund1Params, options?: { [key: string]: any }) {
  return request<API.CommonResultPayRefundDetailsRespVO>('/pay/refund/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取退款订单分页列表 GET /pay/refund/page
export async function getRefundPage(
  params: API.getRefundPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPayRefundPageItemRespVO>('/pay/refund/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}
