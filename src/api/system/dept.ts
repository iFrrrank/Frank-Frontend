import { request } from '@umijs/max'

// 创建部门 POST /system/dept/create
export async function createDept(body: API.SystemDeptSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/system/dept/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除部门 DELETE /system/dept/delete
export async function deleteDept(params: API.deleteDeptParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/dept/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取部门信息 GET /system/dept/get
export async function getDept(params: API.getDeptParams, options?: { [key: string]: any }) {
  return request<API.CommonResultSystemDeptRespVO>('/system/dept/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取部门列表 GET /system/dept/list
export async function getDeptList(params: API.getDeptListParams, options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemDeptRespVO>('/system/dept/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取部门精简信息列表 只包含被开启的部门，主要用于前端的下拉选项 GET /system/dept/simple-list
export async function getSimpleDeptList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemDeptSimpleRespVO>('/system/dept/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

// 更新部门 PUT /system/dept/update
export async function updateDept(body: API.SystemDeptSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/dept/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
