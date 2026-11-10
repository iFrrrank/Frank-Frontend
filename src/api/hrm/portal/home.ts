import type { CommonResult } from './types'
import { request } from '@umijs/max'
import type { HrmHomeCalendarItemVO } from '@/pages/hrm/home/api'

// 获得员工端首页日历 GET /hrm/portal/home/calendar
export async function getEmployeeHomeCalendar(params: { startDate: string; endDate: string }) {
  const resp = await request<CommonResult<HrmHomeCalendarItemVO[]>>('/hrm/portal/home/calendar', {
    method: 'GET',
    params
  })
  return resp.data || []
}
