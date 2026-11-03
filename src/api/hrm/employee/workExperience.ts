import { request } from '@umijs/max'

// 创建员工工作经历 POST /hrm/employee/work-experience/create
export async function createWorkExperience(
  body: API.HrmEmployeeWorkExperienceSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/employee/work-experience/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除员工工作经历 DELETE /hrm/employee/work-experience/delete
export async function deleteWorkExperience(
  params: API.deleteWorkExperienceParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/work-experience/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取员工工作经历列表 GET /hrm/employee/work-experience/list
export async function getWorkExperienceList(
  params: API.getWorkExperienceListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeWorkExperienceRespVO>(
    '/hrm/employee/work-experience/list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 更新员工工作经历 PUT /hrm/employee/work-experience/update
export async function updateWorkExperience(
  body: API.HrmEmployeeWorkExperienceSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/work-experience/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
