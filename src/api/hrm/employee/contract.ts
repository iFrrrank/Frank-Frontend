import { request } from '@umijs/max'

// 创建员工合同 POST /hrm/employee/contract/create
export async function createContract(
  body: API.HrmEmployeeContractSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/employee/contract/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除员工合同 DELETE /hrm/employee/contract/delete
export async function deleteContract(
  params: API.deleteContractParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/contract/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取员工合同列表 GET /hrm/employee/contract/list
export async function getContractList(
  params: API.getContractListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeContractRespVO>('/hrm/employee/contract/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 更新员工合同 PUT /hrm/employee/contract/update
export async function updateContract(
  body: API.HrmEmployeeContractSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/contract/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
