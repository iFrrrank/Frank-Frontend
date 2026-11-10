import { request } from '@umijs/max'
import type { CommonResult } from './types'

export type { CommonResult }

// 员工端考勤打卡记录 VO
export interface AttendanceRecordVO {
  id: number
  employeeId: number
  clockTime: string | Date
  type?: number
  attendanceTime?: string | Date
  sourceType?: number
  status?: number
  stage?: number
  address?: string
  longitude?: number
  latitude?: number
  ssid?: string
  mac?: string
  remark?: string
}

// 员工请假申请创建 VO
export interface HrmAttendanceLeaveCreateVO {
  type?: string
  startTime?: number | string
  endTime?: number | string
  day?: number
  reason?: string
  remark?: string
}

// 员工请假申请 VO
export interface HrmAttendanceLeaveVO {
  id?: number
  type?: string
  startTime?: string | Date
  endTime?: string | Date
  day?: number
  reason?: string
  approvalStatus?: number
  processInstanceId?: string
  status?: number
  remark?: string
  createTime?: string | Date
}

// 考勤打卡项 VO
export interface AttendanceClockVO {
  id?: number
  type?: number
  clockTime?: string | Date | number
  status?: number
}

// 每日考勤明细 VO
export interface HrmAttendanceDailyDetailVO {
  attendanceTime: string | Date | number
  shiftName?: string
  scheduled?: boolean
  requiredClockCount?: number
  scheduledMinutes?: number
  misscardCount?: number
  absenteeism?: boolean
  absenteeismMinutes?: number
  absenteeismDays?: number
  leaveStatus?: boolean
  leaveMinutes?: number
  leaveDays?: number
  attendanceResult?: string
  lateCount?: number
  lateMinutes?: number
  earlyCount?: number
  earlyMinutes?: number
  clockList?: AttendanceClockVO[]
}

// 月度考勤汇总 VO
export interface HrmAttendanceMonthRecordVO {
  attendDays?: number
  actualDays?: number
  lateMinute?: number
  lateCount?: number
  earlyMinute?: number
  earlyCount?: number
  misscardCount?: number
  absenteeismDays?: number
  absenteeismMinutes?: number
  leaveDays?: number
  leaveMinutes?: number
}

// 月度考勤详情 VO
export interface AttendanceMonthDetailVO {
  summary?: HrmAttendanceMonthRecordVO
  dailyDetails?: HrmAttendanceDailyDetailVO[]
  leaves?: HrmAttendanceLeaveVO[]
}

// 获得我的考勤打卡记录列表 GET /hrm/portal/attendance/clock/list
export async function getAttendanceRecordList(year?: number, month?: number) {
  return request<CommonResult<AttendanceRecordVO[]>>(
    '/hrm/portal/attendance/clock/list',
    {
      method: 'GET',
      params: { year, month }
    }
  )
}

// 获得我的请假申请列表 GET /hrm/portal/attendance/leave/list
export async function getMyAttendanceLeaveList() {
  return request<CommonResult<HrmAttendanceLeaveVO[]>>(
    '/hrm/portal/attendance/leave/list',
    {
      method: 'GET'
    }
  )
}

// 创建我的请假申请 POST /hrm/portal/attendance/leave/create
export async function createMyAttendanceLeave(data: HrmAttendanceLeaveCreateVO) {
  return request<API.CommonResultLong>('/hrm/portal/attendance/leave/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 取消我的请假申请 PUT /hrm/portal/attendance/leave/cancel
export async function cancelMyAttendanceLeave(id: number, reason: string) {
  return request<API.CommonResultBoolean>(
    '/hrm/portal/attendance/leave/cancel',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data: { id, reason }
    }
  )
}

// 获得我的月度考勤详情 GET /hrm/portal/attendance/statistics/month-detail
export async function getAttendanceMonthDetail(year?: number, month?: number) {
  return request<CommonResult<AttendanceMonthDetailVO>>(
    '/hrm/portal/attendance/statistics/month-detail',
    {
      method: 'GET',
      params: { year, month }
    }
  )
}

// 导出我的月度考勤 GET /hrm/portal/attendance/statistics/export-excel
export async function exportAttendanceMonthDetail(year: number, month: number) {
  return request<any>('/hrm/portal/attendance/statistics/export-excel', {
    method: 'GET',
    params: { year, month },
    responseType: 'blob'
  })
}
