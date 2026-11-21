import { request } from '@umijs/max'

// 查询员工参保信息 GET /hrm/insurance/employee-info/get
export async function getInsuranceEmployeeInfo(
  params: API.getInsuranceEmployeeInfoParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmInsuranceEmployeeInfoRespVO>(
    '/hrm/insurance/employee-info/get',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 保存员工参保信息 PUT /hrm/insurance/employee-info/save
export async function saveInsuranceEmployeeInfo(
  body: API.HrmInsuranceEmployeeInfoSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/insurance/employee-info/save', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新员工参保方案 PUT /hrm/insurance/employee-info/update-scheme
export async function updateEmployeeScheme(
  body: API.updateEmployeeSchemeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/insurance/employee-info/update-scheme', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
