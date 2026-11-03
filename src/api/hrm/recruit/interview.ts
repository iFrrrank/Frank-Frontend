import { request } from '@umijs/max'

// 创建招聘面试 POST /hrm/recruit/interview/create
export async function createRecruitInterview(body: API.HrmRecruitInterviewSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/recruit/interview/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除招聘面试 DELETE /hrm/recruit/interview/delete
export async function deleteRecruitInterview(
  params: API.deleteRecruitInterviewParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/interview/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取招聘面试 GET /hrm/recruit/interview/get
export async function getRecruitInterview(
  params: API.getRecruitInterviewParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmRecruitInterviewRespVO>('/hrm/recruit/interview/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取候选人的招聘面试列表 GET /hrm/recruit/interview/list-by-candidate
export async function getRecruitInterviewListByCandidate(
  params: API.getRecruitInterviewListByCandidateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmRecruitInterviewRespVO>('/hrm/recruit/interview/list-by-candidate', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新招聘面试 PUT /hrm/recruit/interview/update
export async function updateRecruitInterview(body: API.HrmRecruitInterviewSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/interview/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新招聘面试结果 PUT /hrm/recruit/interview/update-result
export async function updateRecruitInterviewResult(body: API.HrmRecruitInterviewResultReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/interview/update-result', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
