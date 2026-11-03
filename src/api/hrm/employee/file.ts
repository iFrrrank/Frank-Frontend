import { request } from '@umijs/max'

// 获取员工材料附件列表 GET /hrm/employee/file/list
export async function getEmployeeFileList(
  params: API.getEmployeeFileListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeFileRespVO>('/hrm/employee/file/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 保存员工材料附件 PUT /hrm/employee/file/save
export async function saveEmployeeFiles(
  body: API.HrmEmployeeFileSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/file/save', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
