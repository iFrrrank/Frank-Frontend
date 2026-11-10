import { request } from '@umijs/max'

// 反结账 DELETE /fms/closing/period/cancel
export async function fmsClosingPeriodCancelClosePeriod(
  params: API.FmsClosingPeriodCancelClosePeriodParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/closing/period/cancel', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 结账 PUT /fms/closing/period/close
export async function fmsClosingPeriodClosePeriod(body: API.FmsClosingQueryReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/closing/period/close', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取当前会计期间 GET /fms/closing/period/current-month
export async function fmsClosingPeriodGetCurrentMonth(
  params: API.FmsClosingPeriodGetCurrentMonthParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultString>('/fms/closing/period/current-month', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取结账概况 GET /fms/closing/period/overview
export async function fmsClosingPeriodGetClosingOverview(
  params: API.FmsClosingPeriodGetClosingOverviewParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsClosingOverviewRespVO>('/fms/closing/period/overview', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
