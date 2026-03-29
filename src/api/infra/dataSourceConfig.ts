import { request } from '@umijs/max'

/** 创建数据源配置 POST /infra/data-source-config/create */
export async function createDataSourceConfig(
  body: API.InfraDataSourceConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/infra/data-source-config/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除数据源配置 DELETE /infra/data-source-config/delete */
export async function deleteDataSourceConfig(
  params: API.deleteDataSourceConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/data-source-config/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 批量删除数据源配置 DELETE /infra/data-source-config/delete-list */
export async function deleteDataSourceConfigList(
  params: API.deleteDataSourceConfigListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/data-source-config/delete-list', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取数据源配置 GET /infra/data-source-config/get */
export async function getDataSourceConfig(
  params: API.getDataSourceConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultInfraDataSourceConfigRespVO>('/infra/data-source-config/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取数据源配置列表 GET /infra/data-source-config/list */
export async function getDataSourceConfigList(options?: { [key: string]: any }) {
  return request<API.CommonResultListInfraDataSourceConfigRespVO>(
    '/infra/data-source-config/list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

/** 更新数据源配置 PUT /infra/data-source-config/update */
export async function updateDataSourceConfig(
  body: API.InfraDataSourceConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/data-source-config/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
