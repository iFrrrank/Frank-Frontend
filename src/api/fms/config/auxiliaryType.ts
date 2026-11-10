import { request } from '@umijs/max'

// 创建辅助核算类别 POST /fms/config/auxiliary-type/create
export async function fmsAuxiliaryTypeCreateAuxiliaryType(body: API.FmsAuxiliaryTypeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/auxiliary-type/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除辅助核算类别 DELETE /fms/config/auxiliary-type/delete
export async function fmsAuxiliaryTypeDeleteAuxiliaryType(
  params: API.FmsAuxiliaryTypeDeleteAuxiliaryTypeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/auxiliary-type/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取辅助核算类别列表 GET /fms/config/auxiliary-type/list
export async function fmsAuxiliaryTypeGetAuxiliaryTypeList(
  params: API.FmsAuxiliaryTypeGetAuxiliaryTypeListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsAuxiliaryTypeRespVO>('/fms/config/auxiliary-type/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取辅助核算类别精简列表 主要用于前端的下拉选项 GET /fms/config/auxiliary-type/simple-list
export async function fmsAuxiliaryTypeGetAuxiliaryTypeSimpleList(
  params: API.FmsAuxiliaryTypeGetAuxiliaryTypeSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsAuxiliaryTypeRespVO>('/fms/config/auxiliary-type/simple-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新辅助核算类别 PUT /fms/config/auxiliary-type/update
export async function fmsAuxiliaryTypeUpdateAuxiliaryType(body: API.FmsAuxiliaryTypeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/auxiliary-type/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
