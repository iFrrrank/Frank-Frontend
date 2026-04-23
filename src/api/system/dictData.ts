import { request } from '@umijs/max'

// 创建字典数据 POST /system/dict-data/create
export async function createDictData(
  body: API.SystemDictDataSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/dict-data/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除字典数据 DELETE /system/dict-data/delete
export async function deleteDictData(
  params: API.deleteDictDataParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/dict-data/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出字典数据 GET /system/dict-data/export
export async function export3(params: API.export3Params, options?: { [key: string]: any }) {
  return request<any>('/system/dict-data/export', {
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

// 获取字典数据详情 GET /system/dict-data/get
export async function getDictData(params: API.getDictDataParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemDictDataRespVO>('/system/dict-data/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取全部字典数据列表 一般用于管理后台缓存字典数据在本地 GET /system/dict-data/list-all-simple
export async function getSimpleDictDataList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemDictDataSimpleRespVO>(
    '/system/dict-data/list-all-simple',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获取字典数据分页列表 GET /system/dict-data/page
export async function getDictTypePage(
  params: API.getDictTypePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemDictDataRespVO>('/system/dict-data/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取全部字典数据列表 一般用于管理后台缓存字典数据在本地 GET /system/dict-data/simple-list
export async function getSimpleDictDataList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemDictDataSimpleRespVO>('/system/dict-data/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 修改字典数据 PUT /system/dict-data/update
export async function updateDictData(
  body: API.SystemDictDataSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/dict-data/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
