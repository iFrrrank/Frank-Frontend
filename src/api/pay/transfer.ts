import { request } from '@umijs/max'

// 导出转账订单 Excel GET /pay/transfer/export-excel
export async function exportTransfer(
  params: API.exportTransferParams,
  options?: { [key: string]: any }
) {
  return request<any>('/pay/transfer/export-excel', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取转账订单 GET /pay/transfer/get
export async function getTransfer1(
  params: API.getTransfer1Params,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPayTransferRespVO>('/pay/transfer/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取转账订单分页列表 GET /pay/transfer/page
export async function getTransferPage(
  params: API.getTransferPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPayTransferRespVO>('/pay/transfer/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

