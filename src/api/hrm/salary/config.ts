import { request } from '@umijs/max'

// 创建薪资配置 POST /hrm/salary/config/create
export async function createSalaryConfig(body: API.HrmSalaryConfigCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/salary/config/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取薪资配置 GET /hrm/salary/config/get
export async function getSalaryConfig(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryConfigRespVO>('/hrm/salary/config/get', {
    method: 'GET',
    ...(options || {}),
  });
}

// 更新薪资配置 PUT /hrm/salary/config/update
export async function updateSalaryConfig(body: API.HrmSalaryConfigUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/config/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
