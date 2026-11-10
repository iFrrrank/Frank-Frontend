import { request } from '@umijs/max'

// 获取财务参数 GET /fms/config/finance-parameter/get
export async function fmsFinanceParameterGetFinanceParameter(
  params: API.FmsFinanceParameterGetFinanceParameterParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsFinanceParameterRespVO>('/fms/config/finance-parameter/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新财务参数 PUT /fms/config/finance-parameter/update
export async function fmsFinanceParameterUpdateFinanceParameter(body: API.FmsFinanceParameterUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/finance-parameter/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
