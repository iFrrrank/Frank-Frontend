import { request } from '@umijs/max'

// 获取员工档案字段配置 GET /hrm/employee/config/archive-field/list
export async function getEmployeeArchiveFieldConfigList(options?: { [key: string]: any }) {
  return request<API.CommonResultListHrmEmployeeFieldConfigRespVO>(
    '/hrm/employee/config/archive-field/list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 保存员工档案字段配置 PUT /hrm/employee/config/archive-field/save
export async function saveEmployeeArchiveFieldConfig(
  body: API.HrmEmployeeArchiveFieldConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/config/archive-field/save', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取新建员工字段配置列表 GET /hrm/employee/config/create-field/list
export async function getEmployeeCreateFieldConfigList(
  params: API.getEmployeeCreateFieldConfigListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeFieldConfigRespVO>(
    '/hrm/employee/config/create-field/list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 保存新建员工字段配置 PUT /hrm/employee/config/create-field/save
export async function saveEmployeeCreateFieldConfig(
  body: API.HrmEmployeeCreateFieldConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/config/create-field/save', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
