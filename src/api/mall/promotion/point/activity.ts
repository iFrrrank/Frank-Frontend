import { request } from '@umijs/max'

// 关闭积分商城活动 PUT /promotion/point-activity/close
export async function closePointActivity(
  params: API.closePointActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/point-activity/close', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 创建积分商城活动 POST /promotion/point-activity/create
export async function createPointActivity(
  body: API.PointActivitySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/point-activity/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除积分商城活动 DELETE /promotion/point-activity/delete
export async function deletePointActivity(
  params: API.deletePointActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/point-activity/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取积分商城活动 GET /promotion/point-activity/get
export async function getPointActivity(
  params: API.getPointActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPointActivityRespVO>('/promotion/point-activity/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 通过积分商城活动编号数组获取活动列表 GET /promotion/point-activity/list-by-ids
export async function getPointActivityListByIds(
  params: { ids: number[] },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListPointActivityRespVO>('/promotion/point-activity/list-by-ids', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取积分商城活动分页 GET /promotion/point-activity/page
export async function getPointActivityPage(
  params: API.getPointActivityPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPointActivityRespVO>('/promotion/point-activity/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新积分商城活动 PUT /promotion/point-activity/update
export async function updatePointActivity(
  body: API.PointActivitySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/point-activity/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
