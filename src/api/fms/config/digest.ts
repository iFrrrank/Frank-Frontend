import { request } from '@umijs/max'

// 创建常用摘要 POST /fms/config/digest/create
export async function fmsDigestCreateDigest(body: API.FmsDigestSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/digest/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除常用摘要 DELETE /fms/config/digest/delete
export async function fmsDigestDeleteDigest(
  params: API.FmsDigestDeleteDigestParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/digest/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取常用摘要管理列表 GET /fms/config/digest/list
export async function fmsDigestGetDigestList(
  params: API.FmsDigestGetDigestListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsDigestRespVO>('/fms/config/digest/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取常用摘要精简列表 GET /fms/config/digest/simple-list
export async function fmsDigestGetDigestSimpleList(
  params: API.FmsDigestGetDigestSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsDigestRespVO>('/fms/config/digest/simple-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 修改常用摘要 PUT /fms/config/digest/update
export async function fmsDigestUpdateDigest(body: API.FmsDigestSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/digest/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
