import { request } from '@umijs/max'

// 创建辅助核算项目 POST /fms/config/auxiliary-item/create
export async function fmsAuxiliaryItemCreateAuxiliaryItem(body: API.FmsAuxiliaryItemSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/auxiliary-item/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除辅助核算项目 DELETE /fms/config/auxiliary-item/delete-list
export async function fmsAuxiliaryItemDeleteAuxiliaryItemList(
  params: API.FmsAuxiliaryItemDeleteAuxiliaryItemListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/auxiliary-item/delete-list', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出辅助核算项目 GET /fms/config/auxiliary-item/export-excel
export async function fmsAuxiliaryItemExportAuxiliaryItemExcel(
  params: API.FmsAuxiliaryItemExportAuxiliaryItemExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/config/auxiliary-item/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取辅助核算项目 GET /fms/config/auxiliary-item/get
export async function fmsAuxiliaryItemGetAuxiliaryItem(
  params: API.FmsAuxiliaryItemGetAuxiliaryItemParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsAuxiliaryItemRespVO>('/fms/config/auxiliary-item/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取辅助核算项目导入模板 GET /fms/config/auxiliary-item/get-import-template
export async function fmsAuxiliaryItemGetAuxiliaryItemImportTemplate(
  params: API.FmsAuxiliaryItemGetAuxiliaryItemImportTemplateParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/config/auxiliary-item/get-import-template', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导入辅助核算项目 POST /fms/config/auxiliary-item/import
export async function fmsAuxiliaryItemImportAuxiliaryItem(
  params: API.FmsAuxiliaryItemImportAuxiliaryItemParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsAuxiliaryItemImportRespVO>('/fms/config/auxiliary-item/import', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取辅助核算项目分页 GET /fms/config/auxiliary-item/page
export async function fmsAuxiliaryItemGetAuxiliaryItemPage(
  params: API.FmsAuxiliaryItemGetAuxiliaryItemPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultFmsAuxiliaryItemRespVO>('/fms/config/auxiliary-item/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取辅助核算项目精简列表 只包含启用的项目，主要用于前端下拉选项 GET /fms/config/auxiliary-item/simple-list
export async function fmsAuxiliaryItemGetAuxiliaryItemSimpleList(
  params: API.FmsAuxiliaryItemGetAuxiliaryItemSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsAuxiliaryItemRespVO>('/fms/config/auxiliary-item/simple-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新辅助核算项目 PUT /fms/config/auxiliary-item/update
export async function fmsAuxiliaryItemUpdateAuxiliaryItem(body: API.FmsAuxiliaryItemSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/auxiliary-item/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新辅助核算项目状态 PUT /fms/config/auxiliary-item/update-status
export async function fmsAuxiliaryItemUpdateAuxiliaryItemStatus(body: API.FmsAuxiliaryItemStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/auxiliary-item/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
