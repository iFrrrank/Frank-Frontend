import { request } from '@umijs/max'

// 创建首月社保表 POST /hrm/insurance/month-record/create-first
export async function createFirstMonthRecord(body: API.HrmInsuranceMonthRecordCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/insurance/month-record/create-first', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 创建下月社保表 POST /hrm/insurance/month-record/create-next
export async function createNextMonthRecord1(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/insurance/month-record/create-next', {
    method: 'POST',
    ...(options || {}),
  });
}

// 删除月度社保表 DELETE /hrm/insurance/month-record/delete
export async function deleteMonthRecord1(
  params: API.deleteMonthRecord1Params,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/insurance/month-record/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取月度社保表 GET /hrm/insurance/month-record/get
export async function getMonthRecord1(
  params: API.getMonthRecord1Params,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmInsuranceMonthRecordRespVO>('/hrm/insurance/month-record/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取最近月度社保表 GET /hrm/insurance/month-record/last
export async function getLastMonthRecord1(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmInsuranceMonthRecordRespVO>('/hrm/insurance/month-record/last', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取月度社保表列表 GET /hrm/insurance/month-record/list
export async function getMonthRecordList(
  params: API.getMonthRecordListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmInsuranceMonthRecordRespVO>('/hrm/insurance/month-record/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
