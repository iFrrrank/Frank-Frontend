import { request } from '@umijs/max'

// 获取待清理候选人 Id GET /hrm/recruit/candidate/clean-ids
export async function getCleanRecruitCandidateIdList(
  params: API.getCleanRecruitCandidateIdListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListLong>('/hrm/recruit/candidate/clean-ids', {
    method: 'GET',
    params: {
      ...params,
      reqVO: undefined,
      ...params['reqVO']
    },
    ...(options || {})
  })
}

// 候选人转员工档案 POST /hrm/recruit/candidate/convert-employee
export async function convertRecruitCandidateToEmployee(
  body: API.HrmRecruitCandidateEntryReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/recruit/candidate/convert-employee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 创建招聘候选人 POST /hrm/recruit/candidate/create
export async function createRecruitCandidate(
  body: API.HrmRecruitCandidateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/recruit/candidate/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除招聘候选人 DELETE /hrm/recruit/candidate/delete
export async function deleteRecruitCandidate(
  params: API.deleteRecruitCandidateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/candidate/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 淘汰招聘候选人 PUT /hrm/recruit/candidate/eliminate
export async function eliminateRecruitCandidate(
  body: API.HrmRecruitCandidateUpdateEliminateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/candidate/eliminate', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取招聘候选人 GET /hrm/recruit/candidate/get
export async function getRecruitCandidate(
  params: API.getRecruitCandidateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmRecruitCandidateRespVO>('/hrm/recruit/candidate/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取招聘候选人分页列表 GET /hrm/recruit/candidate/page
export async function getRecruitCandidatePage(
  params: API.getRecruitCandidatePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmRecruitCandidateRespVO>(
    '/hrm/recruit/candidate/page',
    {
      method: 'GET',
      params: {
        ...params,
        pageReqVO: undefined,
        ...params['pageReqVO']
      },
      ...(options || {})
    }
  )
}

// 获取候选人状态数量 GET /hrm/recruit/candidate/status-count
export async function getRecruitCandidateStatusCount(
  params: API.getRecruitCandidateStatusCountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmRecruitStatusCountRespVO>(
    '/hrm/recruit/candidate/status-count',
    {
      method: 'GET',
      params: {
        ...params,
        pageReqVO: undefined,
        ...params['pageReqVO']
      },
      ...(options || {})
    }
  )
}

// 更新招聘候选人 PUT /hrm/recruit/candidate/update
export async function updateRecruitCandidate(
  body: API.HrmRecruitCandidateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/candidate/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新招聘候选人渠道 PUT /hrm/recruit/candidate/update-channel
export async function updateRecruitCandidateChannel(
  body: API.HrmRecruitCandidateUpdateChannelReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/candidate/update-channel', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新招聘候选人应聘职位 PUT /hrm/recruit/candidate/update-post
export async function updateRecruitCandidatePost(
  body: API.HrmRecruitCandidateUpdatePostReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/candidate/update-post', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新招聘候选人状态 PUT /hrm/recruit/candidate/update-status
export async function updateRecruitCandidateStatus(
  body: API.HrmRecruitCandidateUpdateStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/candidate/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
