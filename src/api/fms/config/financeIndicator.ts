import { request } from '@umijs/max'

// 创建首页财务指标 POST /fms/config/finance-indicator/create
export async function fmsFinanceIndicatorCreate(body: API.FmsFinanceIndicatorSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/finance-indicator/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除首页财务指标 DELETE /fms/config/finance-indicator/delete
export async function fmsFinanceIndicatorDelete(
  params: API.FmsFinanceIndicatorDeleteParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/finance-indicator/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取首页财务指标 GET /fms/config/finance-indicator/get
export async function fmsFinanceIndicatorGet(
  params: API.FmsFinanceIndicatorGetParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsFinanceIndicatorRespVO>('/fms/config/finance-indicator/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取首页财务指标列表 GET /fms/config/finance-indicator/list
export async function fmsFinanceIndicatorGetList(
  params: API.FmsFinanceIndicatorGetListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsFinanceIndicatorRespVO>('/fms/config/finance-indicator/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 修改首页财务指标 PUT /fms/config/finance-indicator/update
export async function fmsFinanceIndicatorUpdate(body: API.FmsFinanceIndicatorSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/finance-indicator/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
