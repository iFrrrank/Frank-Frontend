import { request } from '@umijs/max'

// 创建考勤组 POST /hrm/attendance/group/create
export async function createAttendanceGroup(body: API.HrmAttendanceGroupSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/attendance/group/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除考勤组 DELETE /hrm/attendance/group/delete
export async function deleteAttendanceGroup(
  params: API.deleteAttendanceGroupParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/attendance/group/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取考勤组 GET /hrm/attendance/group/get
export async function getAttendanceGroup(
  params: API.getAttendanceGroupParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmAttendanceGroupRespVO>('/hrm/attendance/group/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工所在考勤组 GET /hrm/attendance/group/my
export async function getMyAttendanceGroup(
  params: API.getMyAttendanceGroupParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmAttendanceGroupRespVO>('/hrm/attendance/group/my', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取考勤组分页列表 GET /hrm/attendance/group/page
export async function getAttendanceGroupPage(
  params: API.getAttendanceGroupPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmAttendanceGroupRespVO>('/hrm/attendance/group/page', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 获取考勤组精简列表 GET /hrm/attendance/group/simple-list
export async function getAttendanceGroupSimpleList(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmAttendanceGroupRespVO>('/hrm/attendance/group/simple-list', {
    method: 'GET',
    ...(options || {}),
  });
}

// 修改考勤组 PUT /hrm/attendance/group/update
export async function updateAttendanceGroup(body: API.HrmAttendanceGroupSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/attendance/group/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
