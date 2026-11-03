import { request } from '@umijs/max'

// 获取佣金记录 GET /trade/brokerage-record/get
export async function getBrokerageRecord(
  params: API.getBrokerageRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBrokerageRecordRespVO>('/trade/brokerage-record/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取佣金记录分页列表 GET /trade/brokerage-record/page
export async function getBrokerageRecordPage(
  params: API.getBrokerageRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultBrokerageRecordRespVO>('/trade/brokerage-record/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}
