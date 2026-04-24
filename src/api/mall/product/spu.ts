import { request } from '@umijs/max'

// 创建商品 SPU POST /product/spu/create
export async function createProductSpu(
  body: API.ProductSpuSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/product/spu/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除商品 SPU DELETE /product/spu/delete
export async function deleteSpu(params: API.deleteSpuParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/product/spu/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出商品 SPU 列表 GET /product/spu/export-excel
export async function exportSpuList(
  params: API.exportSpuListParams,
  options?: { [key: string]: any }
) {
  return request<any>('/product/spu/export-excel', {
    method: 'GET',
    params: {
      ...params,
      reqVO: undefined,
      ...params['reqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// 获取商品 SPU 分页 tab count GET /product/spu/get-count
export async function getSpuCount(options?: { [key: string]: any }) {
  return request<API.CommonResultMapIntegerLong>('/product/spu/get-count', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取商品 SPU 详情 GET /product/spu/get-detail
export async function getSpuDetail(
  params: API.getSpuDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultProductSpuRespVO>('/product/spu/get-detail', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取商品 SPU 详情列表 GET /product/spu/list
export async function getSpuList1(params: API.getSpuList1Params, options?: { [key: string]: any }) {
  return request<API.CommonResultListProductSpuRespVO>('/product/spu/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取商品 SPU 精简列表 GET /product/spu/list-all-simple
export async function getSpuSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListProductSpuSimpleRespVO>('/product/spu/list-all-simple', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取商品 SPU 分页列表 GET /product/spu/page
export async function getSpuPage(params: API.getSpuPageParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPageResultProductSpuRespVO>('/product/spu/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新商品 SPU PUT /product/spu/update
export async function updateSpu(body: API.ProductSpuSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/product/spu/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新商品 SPU Status PUT /product/spu/update-status
export async function updateStatus(
  body: API.ProductSpuUpdateStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/spu/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
