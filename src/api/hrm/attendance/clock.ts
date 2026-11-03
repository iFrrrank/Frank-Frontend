import { request } from '@umijs/max'

// 创建打卡记录 POST /hrm/attendance/clock/create
export async function createAttendanceClock(body: API.HrmAttendanceClockSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/attendance/clock/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除打卡记录 DELETE /hrm/attendance/clock/delete
export async function deleteAttendanceClock(
  params: API.deleteAttendanceClockParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/attendance/clock/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 批量删除打卡记录 DELETE /hrm/attendance/clock/delete-list
export async function deleteAttendanceClockList(
  params: API.deleteAttendanceClockListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/attendance/clock/delete-list', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出打卡记录 GET /hrm/attendance/clock/export-excel
export async function exportAttendanceClock(
  params: API.exportAttendanceClockParams,
  options?: { [key: string]: any }
) {
  return request<any>('/hrm/attendance/clock/export-excel', {
    method: 'GET',
    params: {
      ...params,
      'exportReqVO': undefined,
      ...params['exportReqVO'],
    },
    ...(options || {}),
  });
}

// 获取打卡记录 GET /hrm/attendance/clock/get
export async function getAttendanceClock(
  params: API.getAttendanceClockParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmAttendanceClockRespVO>('/hrm/attendance/clock/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工实际班次和允许打卡时间 GET /hrm/attendance/clock/get-shift
export async function getAttendanceClockShift(
  params: API.getAttendanceClockShiftParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmAttendanceClockShiftRespVO>('/hrm/attendance/clock/get-shift', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取打卡记录分页列表 GET /hrm/attendance/clock/page
export async function getAttendanceClockPage(
  params: API.getAttendanceClockPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmAttendanceClockRespVO>('/hrm/attendance/clock/page', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 修改打卡记录 PUT /hrm/attendance/clock/update
export async function updateAttendanceClock(body: API.HrmAttendanceClockSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/attendance/clock/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
