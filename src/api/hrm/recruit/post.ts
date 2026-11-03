import { request } from '@umijs/max'

// 创建招聘职位 POST /hrm/recruit/post/create
export async function createRecruitPost(body: API.HrmRecruitPostSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/recruit/post/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取招聘职位 GET /hrm/recruit/post/get
export async function getRecruitPost(
  params: API.getRecruitPostParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmRecruitPostRespVO>('/hrm/recruit/post/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取招聘职位分页列表 GET /hrm/recruit/post/page
export async function getRecruitPostPage(
  params: API.getRecruitPostPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmRecruitPostRespVO>('/hrm/recruit/post/page', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 获取招聘职位精简列表 GET /hrm/recruit/post/simple-list
export async function getRecruitPostSimpleList(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmRecruitPostRespVO>('/hrm/recruit/post/simple-list', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取招聘职位状态数量 GET /hrm/recruit/post/status-count
export async function getRecruitPostStatusCount(
  params: API.getRecruitPostStatusCountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmRecruitStatusCountRespVO>('/hrm/recruit/post/status-count', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 更新招聘职位 PUT /hrm/recruit/post/update
export async function updateRecruitPost(body: API.HrmRecruitPostSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/post/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新招聘职位状态 PUT /hrm/recruit/post/update-status
export async function updateRecruitPostStatus(body: API.HrmRecruitPostStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/post/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
