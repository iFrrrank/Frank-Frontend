import { request } from '@umijs/max'

// 导出请假 GET /hrm/attendance/leave/export-excel
export async function exportAttendanceLeave(
  params: API.exportAttendanceLeaveParams,
  options?: { [key: string]: any }
) {
  return request<any>('/hrm/attendance/leave/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    ...(options || {})
  })
}

// 申请请假 GET /hrm/attendance/leave/get
export async function getAttendanceLeave(
  params: API.getAttendanceLeaveParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmAttendanceLeaveRespVO>('/hrm/attendance/leave/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取请假分页列表 GET /hrm/attendance/leave/page
export async function getAttendanceLeavePage(
  params: API.getAttendanceLeavePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmAttendanceLeaveRespVO>('/hrm/attendance/leave/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}
