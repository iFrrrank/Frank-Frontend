import { request } from '@umijs/max'

// 创建员工教育经历 POST /hrm/employee/education-experience/create
export async function createEducationExperience(
  body: API.HrmEmployeeEducationExperienceSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/employee/education-experience/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除员工教育经历 DELETE /hrm/employee/education-experience/delete
export async function deleteEducationExperience(
  params: API.deleteEducationExperienceParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/education-experience/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取员工教育经历列表 GET /hrm/employee/education-experience/list
export async function getEducationExperienceList(
  params: API.getEducationExperienceListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeEducationExperienceRespVO>(
    '/hrm/employee/education-experience/list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 更新员工教育经历 PUT /hrm/employee/education-experience/update
export async function updateEducationExperience(
  body: API.HrmEmployeeEducationExperienceSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/education-experience/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
