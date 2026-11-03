import { request } from '@umijs/max'

// 创建调薪模板 POST /hrm/salary/change-template/create
export async function createSalaryChangeTemplate(body: API.HrmSalaryChangeTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/salary/change-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除调薪模板 DELETE /hrm/salary/change-template/delete
export async function deleteSalaryChangeTemplate(
  params: API.deleteSalaryChangeTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/change-template/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取调薪模板 GET /hrm/salary/change-template/get
export async function getSalaryChangeTemplate(
  params: API.getSalaryChangeTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryChangeTemplateRespVO>('/hrm/salary/change-template/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取调薪模板列表 GET /hrm/salary/change-template/list
export async function getSalaryChangeTemplateList(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmSalaryChangeTemplateRespVO>('/hrm/salary/change-template/list', {
    method: 'GET',
    ...(options || {}),
  });
}

// 更新调薪模板 PUT /hrm/salary/change-template/update
export async function updateSalaryChangeTemplate(body: API.HrmSalaryChangeTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/change-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
