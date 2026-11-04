// HRM 工作台接口。
// 说明：src/api/hrm 下尚未提供 /hrm/home/* 接口，此处按 Vue 版 api/hrm/home 临时本地实现，
// 待总负责人合并后可迁移到 src/api/hrm/home。
import { request } from '@umijs/max'

// 首页员工概览
export interface HrmHrHomeEmployeeSurveyVO {
  activeCount: number
  entryThisMonthCount: number
  pendingEntryThisMonthCount: number
  leaveThisMonthCount: number
  pendingLeaveThisMonthCount: number
  regularThisMonthCount: number
  transferThisMonthCount: number
}

// 首页招聘概览
export interface HrmHrHomeRecruitSurveyVO {
  recruitingPostCount: number
  candidateInProcessCount: number
  pendingEntryCount: number
  joinedCount: number
}

// 首页部门薪资占比
export interface HrmHrHomeSalaryDeptVO {
  deptId: number
  deptName: string
  proportion: number
  totalSalary: number
}

// 首页薪资概览
export interface HrmHrHomeSalarySurveyVO {
  monthRecordId?: number
  employeeCount: number
  realPaySalary: number
  deptProportions: HrmHrHomeSalaryDeptVO[]
}

// 首页待办概览
export interface HrmHrHomeTodoSurveyVO {
  toEntryCount: number
  toLeaveCount: number
  toExpireContractCount: number
  toRegularCount: number
  toSalaryComputeCount: number
  toBirthdayCount: number
}

// HR 工作台统计
export interface HrmHrHomeStatisticsRespVO {
  employeeSurvey: HrmHrHomeEmployeeSurveyVO
  recruitSurvey: HrmHrHomeRecruitSurveyVO
  salarySurvey: HrmHrHomeSalarySurveyVO
  todoSurvey: HrmHrHomeTodoSurveyVO
}

// 团队工作台统计分析项，type 为 null 表示未填写
export interface HrmTeamHomeAnalysisItemVO {
  type: number | null
  count: number
}

export interface HrmTeamHomeOverviewVO {
  employeeCount: number
  entryThisMonthCount: number
  leaveThisMonthCount: number
  regularThisMonthCount: number
}

export interface HrmTeamHomeSurveyVO {
  statusAnalysis: HrmTeamHomeAnalysisItemVO[]
  sexAnalysis: HrmTeamHomeAnalysisItemVO[]
  ageAnalysis: HrmTeamHomeAnalysisItemVO[]
  companyAgeAnalysis: HrmTeamHomeAnalysisItemVO[]
}

export interface HrmTeamHomeStatisticsRespVO {
  leaderEmployeeId?: number
  teamOverview: HrmTeamHomeOverviewVO
  teamSurvey: HrmTeamHomeSurveyVO
}

// 日历事项
export interface HrmHomeCalendarItemVO {
  personalNoteId?: number
  type: number
  typeName: string
  content: string
  typeId?: number
  // 后端可能返回 [年, 月, 日] 数组或字符串
  date: [number, number, number] | string
  eventTime?: string | number
}

export interface HrmHomeCalendarParams {
  startDate: string
  endDate: string
}

interface CommonResult<T> {
  code?: number
  data?: T
  msg?: string
}

// 获得 HR 工作台统计汇总
export async function getHrHomeStatisticsSummary() {
  return request<CommonResult<HrmHrHomeStatisticsRespVO>>('/hrm/home/hr-statistics-summary', {
    method: 'GET'
  })
}

// 获得 HR 工作台日历
export async function getHrHomeCalendar(params: HrmHomeCalendarParams) {
  return request<CommonResult<HrmHomeCalendarItemVO[]>>('/hrm/home/hr-calendar', {
    method: 'GET',
    params
  })
}

// 获得团队工作台统计汇总
export async function getTeamHomeStatisticsSummary() {
  return request<CommonResult<HrmTeamHomeStatisticsRespVO>>(
    '/hrm/home/team-statistics-summary',
    { method: 'GET' }
  )
}

// 获得团队工作台日历
export async function getTeamHomeCalendar(params: HrmHomeCalendarParams) {
  return request<CommonResult<HrmHomeCalendarItemVO[]>>('/hrm/home/team-calendar', {
    method: 'GET',
    params
  })
}

// 获得员工端首页日历
export async function getEmployeeHomeCalendar(params: HrmHomeCalendarParams) {
  return request<CommonResult<HrmHomeCalendarItemVO[]>>('/hrm/portal/home/calendar', {
    method: 'GET',
    params
  })
}
