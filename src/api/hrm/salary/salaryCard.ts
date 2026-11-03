import { request } from '@umijs/max'

// 删除员工工资卡 DELETE /hrm/employee/salary-card/delete
export async function deleteEmployeeSalaryCard(
  params: API.deleteEmployeeSalaryCardParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/salary-card/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取员工工资卡 GET /hrm/employee/salary-card/get
export async function getEmployeeSalaryCard(
  params: API.getEmployeeSalaryCardParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmEmployeeSalaryCardRespVO>('/hrm/employee/salary-card/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 保存员工工资卡 PUT /hrm/employee/salary-card/save
export async function saveEmployeeSalaryCard(
  body: API.HrmEmployeeSalaryCardSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/employee/salary-card/save', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
