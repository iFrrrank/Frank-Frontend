import { request } from '@umijs/max'

// 创建参数配置 POST /infra/config/create
export async function createConfig(
  body: API.InfraConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/infra/config/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除参数配置 DELETE /infra/config/delete
export async function deleteConfig(
  params: API.deleteConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/config/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 批量删除参数配置 DELETE /infra/config/delete-list
export async function deleteConfigList(
  params: API.deleteConfigListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/config/delete-list', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出参数配置 GET /infra/config/export-excel
export async function exportConfig(
  params: API.exportConfigParams,
  options?: { [key: string]: any }
) {
  return request<any>('/infra/config/export-excel', {
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// 获取参数配置 GET /infra/config/get
export async function getConfig(params: API.getConfigParams, options?: { [key: string]: any }) {
  return request<API.CommonResultInfraConfigRespVO>('/infra/config/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 根据参数键名查询参数值 不可见的配置，不允许返回给前端 GET /infra/config/get-value-by-key
export async function getConfigKey(
  params: API.getConfigKeyParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultString>('/infra/config/get-value-by-key', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取参数配置分页列表 GET /infra/config/page
export async function getConfigPage(
  params: API.getConfigPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultInfraConfigRespVO>('/infra/config/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 修改参数配置 PUT /infra/config/update
export async function updateConfig(
  body: API.InfraConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/config/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
