import { request } from '@umijs/max'

// 创建员工个人备忘 POST /hrm/employee/personal-note/create
export async function createPersonalNote(
  body: API.HrmEmployeePersonalNoteCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/employee/personal-note/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除员工个人备忘 DELETE /hrm/employee/personal-note/delete
export async function deletePersonalNote(
  params: API.deletePersonalNoteParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/personal-note/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}
