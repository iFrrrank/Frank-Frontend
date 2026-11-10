import { request } from '@umijs/max'

// 创建币别 POST /fms/config/currency/create
export async function fmsCurrencyCreateCurrency(body: API.FmsCurrencySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/currency/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除币别 DELETE /fms/config/currency/delete
export async function fmsCurrencyDeleteCurrency(
  params: API.FmsCurrencyDeleteCurrencyParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/currency/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取币别列表 GET /fms/config/currency/list
export async function fmsCurrencyGetCurrencyList(
  params: API.FmsCurrencyGetCurrencyListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsCurrencyRespVO>('/fms/config/currency/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取币别精简列表 主要用于前端的下拉选项 GET /fms/config/currency/simple-list
export async function fmsCurrencyGetCurrencySimpleList(
  params: API.FmsCurrencyGetCurrencySimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsCurrencyRespVO>('/fms/config/currency/simple-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新币别 PUT /fms/config/currency/update
export async function fmsCurrencyUpdateCurrency(body: API.FmsCurrencySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/currency/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
