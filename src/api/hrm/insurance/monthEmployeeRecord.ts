import { request } from '@umijs/max'

// 添加参保人员 POST /hrm/insurance/month-employee-record/create-list
export async function createMonthEmployeeRecordList(body: API.HrmInsuranceMonthEmployeeRecordCreateListReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/insurance/month-employee-record/create-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取员工月度社保详情 GET /hrm/insurance/month-employee-record/get
export async function getMonthEmployeeRecord(
  params: API.getMonthEmployeeRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmInsuranceMonthEmployeeRecordRespVO>('/hrm/insurance/month-employee-record/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工月度社保分页列表 GET /hrm/insurance/month-employee-record/page
export async function getMonthEmployeeRecordPage1(
  params: API.getMonthEmployeeRecordPage1Params,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmInsuranceMonthEmployeeRecordRespVO>('/hrm/insurance/month-employee-record/page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 批量停止员工参保 PUT /hrm/insurance/month-employee-record/stop-list
export async function stopMonthEmployeeRecordList(body: API.HrmInsuranceMonthEmployeeRecordStopListReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/insurance/month-employee-record/stop-list', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取本月未参保员工 GET /hrm/insurance/month-employee-record/uninsured-employee-list
export async function getUninsuredEmployeeList(
  params: API.getUninsuredEmployeeListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeRespVO>('/hrm/insurance/month-employee-record/uninsured-employee-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 修改员工月度参保项目 PUT /hrm/insurance/month-employee-record/update
export async function updateMonthEmployeeRecord(body: API.HrmInsuranceMonthEmployeeRecordUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/insurance/month-employee-record/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
