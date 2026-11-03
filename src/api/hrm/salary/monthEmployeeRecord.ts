import { request } from '@umijs/max'

// 获取工资表员工异动分类数量 GET /hrm/salary/month-employee-record/change-count
export async function getMonthEmployeeChangeCount(
  params: API.getMonthEmployeeChangeCountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultMapIntegerLong>('/hrm/salary/month-employee-record/change-count', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取指定员工的月度工资分页列表 GET /hrm/salary/month-employee-record/employee-page
export async function getEmployeeMonthRecordPage(
  params: API.getEmployeeMonthRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmSalaryMonthEmployeeRecordRespVO>('/hrm/salary/month-employee-record/employee-page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取员工月度工资列表 GET /hrm/salary/month-employee-record/list
export async function getMonthEmployeeRecordList(
  params: API.getMonthEmployeeRecordListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmSalaryMonthEmployeeRecordRespVO>('/hrm/salary/month-employee-record/list', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取员工月度工资分页列表 GET /hrm/salary/month-employee-record/page
export async function getMonthEmployeeRecordPage(
  params: API.getMonthEmployeeRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmSalaryMonthEmployeeRecordRespVO>('/hrm/salary/month-employee-record/page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取员工绩效系数 POST /hrm/salary/month-employee-record/performance-coefficients
export async function getPerformanceCoefficientMap(body: API.HrmSalaryPerformanceCoefficientReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultMapLongBigDecimal>('/hrm/salary/month-employee-record/performance-coefficients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 批量修改员工工资项 PUT /hrm/salary/month-employee-record/update-list
export async function updateMonthEmployeeRecordList(body: API.HrmSalaryMonthEmployeeRecordUpdateReqVO[],
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/month-employee-record/update-list', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
