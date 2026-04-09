import { request } from '@umijs/max'

// 创建仓库 POST /erp/warehouse/create
export async function createWarehouse(
  body: API.ErpWarehouseSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/warehouse/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除仓库 DELETE /erp/warehouse/delete
export async function deleteWarehouse(
  params: API.deleteWarehouseParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/warehouse/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出仓库 Excel GET /erp/warehouse/export-excel
export async function exportWarehouseExcel(
  params: API.exportWarehouseExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/warehouse/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取仓库 GET /erp/warehouse/get
export async function getWarehouse(
  params: API.getWarehouseParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultErpWarehouseRespVO>('/erp/warehouse/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取仓库分页列表 GET /erp/warehouse/page
export async function getWarehousePage(
  params: API.getWarehousePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpWarehouseRespVO>('/erp/warehouse/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取仓库精简列表 只包含被开启的仓库，主要用于前端的下拉选项 GET /erp/warehouse/simple-list
export async function getWarehouseSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListErpWarehouseRespVO>('/erp/warehouse/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 更新仓库 PUT /erp/warehouse/update
export async function updateWarehouse(
  body: API.ErpWarehouseSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/warehouse/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新仓库默认状态 PUT /erp/warehouse/update-default-status
export async function updateWarehouseDefaultStatus(
  params: API.updateWarehouseDefaultStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/warehouse/update-default-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

