import { request } from '@umijs/max'

// 查询员工每日打卡明细 GET /hrm/attendance/statistics/daily-detail
export async function getAttendanceDailyDetail(
  params: API.getAttendanceDailyDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmAttendanceDailyDetailRespVO>('/hrm/attendance/statistics/daily-detail', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 导出员工月度打卡概况 GET /hrm/attendance/statistics/month-daily-export-excel
export async function exportAttendanceMonthDailyOverview(
  params: API.exportAttendanceMonthDailyOverviewParams,
  options?: { [key: string]: any }
) {
  return request<any>('/hrm/attendance/statistics/month-daily-export-excel', {
    method: 'GET',
    params: {
      ...params,
      'exportReqVO': undefined,
      ...params['exportReqVO'],
    },
    ...(options || {}),
  });
}

// 查询员工月度打卡概况 GET /hrm/attendance/statistics/month-daily-page
export async function getAttendanceMonthDailyOverviewPage(
  params: API.getAttendanceMonthDailyOverviewPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmAttendanceMonthDailyOverviewRespVO>('/hrm/attendance/statistics/month-daily-page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 查询员工月度考勤详情 GET /hrm/attendance/statistics/month-detail
export async function getAttendanceMonthDetail(
  params: API.getAttendanceMonthDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmAttendanceMonthDetailRespVO>('/hrm/attendance/statistics/month-detail', {
    method: 'GET',
    params: {


      ...params,
    },
    ...(options || {}),
  });
}

// 导出员工月度考勤汇总 GET /hrm/attendance/statistics/month-record-export-excel
export async function exportAttendanceMonthRecord(
  params: API.exportAttendanceMonthRecordParams,
  options?: { [key: string]: any }
) {
  return request<any>('/hrm/attendance/statistics/month-record-export-excel', {
    method: 'GET',
    params: {
      ...params,
      'exportReqVO': undefined,
      ...params['exportReqVO'],
    },
    ...(options || {}),
  });
}

// 查询员工月度考勤汇总 GET /hrm/attendance/statistics/month-record-page
export async function getAttendanceMonthRecordPage(
  params: API.getAttendanceMonthRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmAttendanceMonthRecordRespVO>('/hrm/attendance/statistics/month-record-page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}
