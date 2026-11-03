import { request } from '@umijs/max'

// 检查日期是否为考勤节假日 GET /hrm/attendance/holiday/check
export async function checkAttendanceHoliday(
  params: API.checkAttendanceHolidayParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmAttendanceHolidayRespVO>('/hrm/attendance/holiday/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 创建考勤节假日 POST /hrm/attendance/holiday/create
export async function createAttendanceHoliday(body: API.HrmAttendanceHolidaySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/attendance/holiday/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除考勤节假日 DELETE /hrm/attendance/holiday/delete
export async function deleteAttendanceHoliday(
  params: API.deleteAttendanceHolidayParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/attendance/holiday/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取考勤节假日 GET /hrm/attendance/holiday/get
export async function getAttendanceHoliday(
  params: API.getAttendanceHolidayParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmAttendanceHolidayRespVO>('/hrm/attendance/holiday/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取考勤节假日分页列表 GET /hrm/attendance/holiday/page
export async function getAttendanceHolidayPage(
  params: API.getAttendanceHolidayPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmAttendanceHolidayRespVO>('/hrm/attendance/holiday/page', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 修改考勤节假日 PUT /hrm/attendance/holiday/update
export async function updateAttendanceHoliday(body: API.HrmAttendanceHolidaySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/attendance/holiday/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
