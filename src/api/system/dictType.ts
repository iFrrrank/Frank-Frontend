import { request } from '@umijs/max'

// 创建字典类型 POST /system/dict-type/create
export async function createDictType(
  body: API.SystemDictTypeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/dict-type/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除字典类型 DELETE /system/dict-type/delete
export async function deleteDictType(
  params: API.deleteDictTypeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/dict-type/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出字典类型 GET /system/dict-type/export
export async function exportDictTypeExcel(
  params: API.export2Params,
  options?: { [key: string]: any }
) {
  return request<any>('/system/dict-type/export', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// 获取字典类型详情况 GET /system/dict-type/get
export async function getDictType(params: API.getDictTypeParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemDictTypeRespVO>('/system/dict-type/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取全部字典类型列表 包括开启 + 禁用的字典类型，主要用于前端的下拉选项 GET /system/dict-type/list-all-simple
export async function getSimpleDictTypeList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemDictTypeSimpleRespVO>(
    '/system/dict-type/list-all-simple',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获取字典类型的分页列表 GET /system/dict-type/page
export async function pageDictTypes(
  params: API.pageDictTypesParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemDictTypeRespVO>('/system/dict-type/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取全部字典类型列表 包括开启 + 禁用的字典类型，主要用于前端的下拉选项 GET /system/dict-type/simple-list
export async function getSimpleDictTypeList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemDictTypeSimpleRespVO>('/system/dict-type/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 修改字典类型 PUT /system/dict-type/update
export async function updateDictType(
  body: API.SystemDictTypeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/dict-type/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
