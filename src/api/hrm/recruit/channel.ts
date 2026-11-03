import { request } from '@umijs/max'

// 创建招聘渠道 POST /hrm/recruit/channel/create
export async function createRecruitChannel(body: API.HrmRecruitChannelSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/recruit/channel/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除招聘渠道 DELETE /hrm/recruit/channel/delete
export async function deleteRecruitChannel(body: API.HrmRecruitChannelDeleteReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/channel/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取招聘渠道 GET /hrm/recruit/channel/get
export async function getRecruitChannel(
  params: API.getRecruitChannelParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmRecruitChannelRespVO>('/hrm/recruit/channel/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取招聘渠道分页列表 GET /hrm/recruit/channel/page
export async function getRecruitChannelPage(
  params: API.getRecruitChannelPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmRecruitChannelRespVO>('/hrm/recruit/channel/page', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 获取招聘渠道精简列表 用于招聘职位、候选人等表单的下拉选项 GET /hrm/recruit/channel/simple-list
export async function getRecruitChannelSimpleList(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmRecruitChannelRespVO>('/hrm/recruit/channel/simple-list', {
    method: 'GET',
    ...(options || {}),
  });
}

// 更新招聘渠道 PUT /hrm/recruit/channel/update
export async function updateRecruitChannel(body: API.HrmRecruitChannelSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/channel/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新招聘渠道状态 PUT /hrm/recruit/channel/update-status
export async function updateRecruitChannelStatus(body: API.HrmRecruitChannelStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/channel/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
