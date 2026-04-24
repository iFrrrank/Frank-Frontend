import { request } from '@umijs/max'

// 创建岗位 POST /system/post/create
export async function createPost(body: API.SystemPostSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/system/post/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除岗位 DELETE /system/post/delete
export async function deletePost(params: API.deletePostParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/post/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出岗位 GET /system/post/export
export async function exportPostExcel(params: API.export1Params, options?: { [key: string]: any }) {
  return request<any>('/system/post/export', {
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

// 获取岗位信息 GET /system/post/get
export async function getPost(params: API.getPostParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemPostRespVO>('/system/post/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取岗位列表 只包含被开启的岗位，主要用于前端的下拉选项 GET /system/post/list-all-simple
export async function getSimplePostList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemPostSimpleRespVO>('/system/post/list-all-simple', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取岗位分页列表 GET /system/post/page
export async function getPostPage(params: API.getPostPageParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPageResultSystemPostRespVO>('/system/post/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取岗位列表 只包含被开启的岗位，主要用于前端的下拉选项 GET /system/post/simple-list
export async function getSimplePostList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemPostSimpleRespVO>('/system/post/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 修改岗位 PUT /system/post/update
export async function updatePost(body: API.SystemPostSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/post/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
