import { request } from '@umijs/max'

// 获取首页 GET /fms/home/get
export async function fmsHomeGetHome(
  params: API.FmsHomeGetHomeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsHomeRespVO>('/fms/home/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取财务指标明细 GET /fms/home/metric-detail
export async function fmsHomeGetMetricDetail(
  params: API.FmsHomeGetMetricDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsHomeMetricDetailRespVO>('/fms/home/metric-detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
