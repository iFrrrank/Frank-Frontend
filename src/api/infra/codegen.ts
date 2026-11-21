import { request } from '@umijs/max'

// 查询代码生成表列表 GET /infra/codegen/table/list
export async function getCodegenTableList(
  params: API.getCodegenTableListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListInfraCodegenTableVO>('/infra/codegen/table/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 查询代码生成表分页 GET /infra/codegen/table/page
export async function getCodegenTablePage(
  params: {
    pageNo: number
    pageSize: number
    tableName?: string
    tableComment?: string
    className?: string
    createTime?: string[]
  },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultInfraCodegenTableVO>('/infra/codegen/table/page', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 查询代码生成详情（表 + 字段） GET /infra/codegen/detail
export async function getCodegenTable(
  params: API.tableIdParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultInfraCodegenUpdateReqVO>('/infra/codegen/detail', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 更新代码生成表定义 PUT /infra/codegen/update
export async function updateCodegenTable(
  body: API.InfraCodegenUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/codegen/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 同步代码生成表结构 PUT /infra/codegen/sync-from-db
export async function syncCodegenFromDB(
  params: API.tableIdParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/codegen/sync-from-db', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 预览代码生成结果 GET /infra/codegen/preview
export async function previewCodegen(
  params: API.tableIdParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListInfraCodegenPreviewVO>('/infra/codegen/preview', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 下载代码生成结果 GET /infra/codegen/download
export async function downloadCodegen(
  params: API.tableIdParams,
  options?: { [key: string]: any }
) {
  return request('/infra/codegen/download', {
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// 查询数据库表列表 GET /infra/codegen/db/table/list
export async function getSchemaTableList(
  params: { dataSourceConfigId: number; name?: string; comment?: string },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListInfraDatabaseTableVO>('/infra/codegen/db/table/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导入代码生成表定义 POST /infra/codegen/create-list
export async function createCodegenList(
  body: { dataSourceConfigId: number; tableNames: string[] },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/codegen/create-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除代码生成表定义 DELETE /infra/codegen/delete
export async function deleteCodegenTable(
  params: API.tableIdParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/codegen/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 批量删除代码生成表定义 DELETE /infra/codegen/delete-list
export async function deleteCodegenTableList(
  params: API.deleteCodegenTableListByTableIdsParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/codegen/delete-list', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}
