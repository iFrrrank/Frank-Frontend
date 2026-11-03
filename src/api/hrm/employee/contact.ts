import { request } from '@umijs/max'

// 创建员工联系人 POST /hrm/employee/contact/create
export async function createContact(body: API.HrmEmployeeContactSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/employee/contact/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除员工联系人 DELETE /hrm/employee/contact/delete
export async function deleteContact(
  params: API.deleteContactParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/contact/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工联系人列表 GET /hrm/employee/contact/list
export async function getContactList(
  params: API.getContactListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeContactRespVO>('/hrm/employee/contact/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新员工联系人 PUT /hrm/employee/contact/update
export async function updateContact(body: API.HrmEmployeeContactSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/contact/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
