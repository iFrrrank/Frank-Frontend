import { request } from '@umijs/max'

// 创建员工培训经历 POST /hrm/employee/training-experience/create
export async function createTrainingExperience(
  body: API.HrmEmployeeTrainingExperienceSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/employee/training-experience/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除员工培训经历 DELETE /hrm/employee/training-experience/delete
export async function deleteTrainingExperience(
  params: API.deleteTrainingExperienceParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/training-experience/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取员工培训经历列表 GET /hrm/employee/training-experience/list
export async function getTrainingExperienceList(
  params: API.getTrainingExperienceListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeTrainingExperienceRespVO>(
    '/hrm/employee/training-experience/list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 更新员工培训经历 PUT /hrm/employee/training-experience/update
export async function updateTrainingExperience(
  body: API.HrmEmployeeTrainingExperienceSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/training-experience/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
