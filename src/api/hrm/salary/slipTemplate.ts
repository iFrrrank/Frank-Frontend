import { request } from '@umijs/max'

// 创建工资条模板 POST /hrm/salary/slip-template/create
export async function createSalarySlipTemplate(body: API.HrmSalarySlipTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/salary/slip-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除工资条模板 DELETE /hrm/salary/slip-template/delete
export async function deleteSalarySlipTemplate(
  params: API.deleteSalarySlipTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/slip-template/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取工资条模板 GET /hrm/salary/slip-template/get
export async function getSalarySlipTemplate(
  params: API.getSalarySlipTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalarySlipTemplateRespVO>('/hrm/salary/slip-template/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取工资条模板列表 GET /hrm/salary/slip-template/list
export async function getSalarySlipTemplateList(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmSalarySlipTemplateRespVO>('/hrm/salary/slip-template/list', {
    method: 'GET',
    ...(options || {}),
  });
}

// 更新工资条模板 PUT /hrm/salary/slip-template/update
export async function updateSalarySlipTemplate(body: API.HrmSalarySlipTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/slip-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
