import { request } from '@umijs/max'

/** 创建文件配置 POST /infra/file-config/create */
export async function createFileConfig(
  body: API.InfraFileConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/infra/file-config/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除文件配置 DELETE /infra/file-config/delete */
export async function deleteFileConfig(
  params: API.deleteFileConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/file-config/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 批量删除文件配置 DELETE /infra/file-config/delete-list */
export async function deleteFileConfigList(
  params: API.deleteFileConfigListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/file-config/delete-list', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取文件配置 GET /infra/file-config/get */
export async function getFileConfig(
  params: API.getFileConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultInfraFileConfigRespVO>('/infra/file-config/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取文件配置分页列表 GET /infra/file-config/page */
export async function getFileConfigPage(
  params: API.getFileConfigPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultInfraFileConfigRespVO>('/infra/file-config/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

/** 测试文件配置是否正确 GET /infra/file-config/test */
export async function testFileConfig(
  params: API.testFileConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultString>('/infra/file-config/test', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 更新文件配置 PUT /infra/file-config/update */
export async function updateFileConfig(
  body: API.InfraFileConfigSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/file-config/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 更新文件配置为 Master PUT /infra/file-config/update-master */
export async function updateFileConfigMaster(
  params: API.updateFileConfigMasterParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/file-config/update-master', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
