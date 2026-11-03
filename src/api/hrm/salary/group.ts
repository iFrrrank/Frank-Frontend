import { request } from '@umijs/max'

// 创建薪资组 POST /hrm/salary/group/create
export async function createSalaryGroup(body: API.HrmSalaryGroupSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/salary/group/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除薪资组 DELETE /hrm/salary/group/delete
export async function deleteSalaryGroup(
  params: API.deleteSalaryGroupParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/group/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取薪资组 GET /hrm/salary/group/get
export async function getSalaryGroup(
  params: API.getSalaryGroupParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryGroupRespVO>('/hrm/salary/group/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取薪资组分页列表 GET /hrm/salary/group/page
export async function getSalaryGroupPage(
  params: API.getSalaryGroupPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmSalaryGroupRespVO>('/hrm/salary/group/page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取薪资组精简列表 GET /hrm/salary/group/simple-list
export async function getSalaryGroupSimpleList(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmSalaryGroupRespVO>('/hrm/salary/group/simple-list', {
    method: 'GET',
    ...(options || {}),
  });
}

// 修改薪资组 PUT /hrm/salary/group/update
export async function updateSalaryGroup(body: API.HrmSalaryGroupSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/group/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
