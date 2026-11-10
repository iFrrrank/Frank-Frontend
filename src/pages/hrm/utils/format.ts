import dayjs from 'dayjs'
import { RECRUIT_AGE_UNLIMITED_VALUE, RECRUIT_SALARY_NEGOTIABLE_VALUE } from '@/utils/constants'
import {
  EMPLOYEE_CONTRACT_STATUS,
  EMPLOYEE_CONTRACT_TYPE_OPTIONS,
  EMPLOYEE_ID_TYPE_OPTIONS,
  EMPLOYEE_QUIT_REASON_OPTIONS,
  EMPLOYEE_QUIT_TYPE_OPTIONS,
  EMPLOYEE_TEACHING_METHOD_OPTIONS,
  WEEK_OPTIONS
} from '@/utils/constantsValue'
import { RECRUIT_SALARY_UNIT } from '@/utils/constantsValue'
import { HrmAttendanceHolidayTypeEnum } from '@/utils/constants'
import {
  HrmPerformanceAppealTimeoutAction,
  HrmPerformanceCycleTypeOptions,
  HrmPerformanceQuotaSettingType,
  HrmPerformanceRaterType
} from '@/pages/hrm/performance/constants'

// HRM 通用展示格式化方法（对应 Vue 版 views/hrm/utils/format.ts）

/** 格式化 HRM 金额：保留两位小数 */
export function formatHrmMoney(value?: number | null): string {
  return Number(value || 0).toFixed(2)
}

/** 格式化带千分位的 HRM 金额 */
export function formatHrmMoneyWithThousands(value?: number | null): string {
  return Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/** 格式化 HRM 比例：保留两位小数并追加 % */
export function formatHrmRate(value?: number | null): string {
  return value === undefined || value === null ? '-' : `${Number(value).toFixed(2)}%`
}

/** 格式化 HRM 绩效分数 */
export function formatHrmScore(value?: number | null): string {
  return value === undefined || value === null ? '-' : Number(value).toFixed(2)
}

/** 格式化 HRM 天数：最多保留两位小数并去掉多余的 0 */
export function formatHrmDays(value?: number | null): string {
  return Number(value || 0)
    .toFixed(2)
    .replace(/\.00$/, '')
    .replace(/(\.\d)0$/, '$1')
}

/** 格式化 HRM 年月 */
export function formatHrmYearMonth(year?: number | null, month?: number | null): string {
  if (!year || !month) {
    return '-'
  }
  return `${year}-${String(month).padStart(2, '0')}`
}

/** 格式化 HRM 月份：YYYY-MM */
export function formatHrmMonth(value?: dayjs.ConfigType): string {
  if (!value) {
    return '-'
  }
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM') : '-'
}

/** 格式化 HRM 系数 */
export function formatHrmCoefficient(value?: number | null): string {
  return value === undefined || value === null ? '-' : Number(value).toFixed(2)
}

/** 格式化考勤星期：[1,2] => 周一、周二 */
export function formatHrmAttendanceWeeks(weeks?: number[]): string {
  return (
    weeks
      ?.map((week) => WEEK_OPTIONS.find((item) => item.value === week)?.label)
      .filter(Boolean)
      .join('、') || '-'
  )
}

/** 格式化 HRM 日期 */
export function formatHrmDate(value?: dayjs.ConfigType): string {
  if (!value) {
    return '-'
  }
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : '-'
}

/** 格式化 HRM 日期时间 */
export function formatHrmDateTime(value?: dayjs.ConfigType): string {
  if (!value) {
    return '-'
  }
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}

/** 格式化 HRM 日期范围 */
export function formatHrmDateRange(
  startDate?: dayjs.ConfigType,
  endDate?: dayjs.ConfigType
): string {
  if (!startDate && !endDate) {
    return '-'
  }
  return `${formatHrmDate(startDate)} 至 ${formatHrmDate(endDate)}`
}

/** 格式化绩效评分人层级 */
export function formatHrmPerformanceRaterLevel(
  raterType: number | undefined,
  level: number
): string {
  if (raterType === HrmPerformanceRaterType.SUPERIOR) {
    return level === 1 ? '直属上级' : `第 ${level} 级上级`
  }
  return level === 1 ? '直属部门负责人' : `第 ${level} 级部门负责人`
}

/** 格式化绩效计划周期 */
export function formatHrmPerformancePlanCycle(plan: API.HrmPerformancePlanRespVO): string {
  return (
    [plan.cycle, plan.quarter ? `第 ${plan.quarter} 季度` : ''].filter(Boolean).join(' / ') || '-'
  )
}

/** 格式化绩效考核周期类型 */
export function formatHrmPerformanceCycleType(type?: number): string {
  return HrmPerformanceCycleTypeOptions.find((item) => item.value === type)?.label || '-'
}

/** 格式化绩效指标制定方式 */
export function formatHrmPerformanceQuotaSettingType(type?: number): string {
  if (type === HrmPerformanceQuotaSettingType.SYSTEM) {
    return '系统制定'
  }
  return type === HrmPerformanceQuotaSettingType.EMPLOYEE ? '员工制定' : '-'
}

/** 格式化绩效申诉超期处理方式 */
export function formatHrmPerformanceAppealTimeout(plan: API.HrmPerformancePlanRespVO): string {
  if (!plan.resultConfirmation || !plan.appealTimeoutDays) {
    return '-'
  }
  const action = {
    [HrmPerformanceAppealTimeoutAction.REJECT]: '自动拒绝',
    [HrmPerformanceAppealTimeoutAction.APPROVE]: '自动通过'
  }[plan.appealTimeoutAction || 0]
  return action ? `超过 ${plan.appealTimeoutDays} 天未处理，${action}` : '-'
}

/** 格式化绩效评分人类型 */
export function formatHrmPerformanceRaterType(type?: number): string {
  return (
    {
      [HrmPerformanceRaterType.SUPERIOR]: '上级',
      [HrmPerformanceRaterType.DEPT_LEADER]: '部门负责人',
      [HrmPerformanceRaterType.SPECIFIED]: '指定评分人',
      [HrmPerformanceRaterType.SELF]: '被考核人'
    }[type || 0] || '-'
  )
}

/** 格式化员工证件类型 */
export function formatEmployeeIdType(value?: number): string {
  return EMPLOYEE_ID_TYPE_OPTIONS.find((item) => item.value === value)?.label || '-'
}

/** 格式化员工异动类型 */
export function formatEmployeeChangeType(value?: number): string {
  return (
    {
      4: '转正',
      5: '调岗',
      6: '晋升',
      7: '降级',
      8: '转为全职',
      9: '再入职'
    }[value || 0] || '-'
  )
}

/** 格式化员工教学方式 */
export function formatEmployeeTeachingMethod(value?: number): string {
  return EMPLOYEE_TEACHING_METHOD_OPTIONS.find((item) => item.value === value)?.label || '-'
}

/** 格式化员工合同类型 */
export function formatEmployeeContractType(value?: number): string {
  return EMPLOYEE_CONTRACT_TYPE_OPTIONS.find((item) => item.value === value)?.label || '-'
}

/** 格式化员工合同状态 */
export function formatEmployeeContractStatus(value?: number): string {
  return (EMPLOYEE_CONTRACT_STATUS[value || 0]?.text as string) || '-'
}

/** 格式化员工离职类型 */
export function formatEmployeeQuitType(value?: number): string {
  return EMPLOYEE_QUIT_TYPE_OPTIONS.find((item) => item.value === value)?.label || '-'
}

/** 格式化员工离职原因 */
export function formatEmployeeQuitReason(value?: number): string {
  return EMPLOYEE_QUIT_REASON_OPTIONS.find((item) => item.value === value)?.label || '-'
}

/** 格式化 HRM 是否值 */
export function formatHrmYesNo(value?: boolean | null): string {
  if (value === undefined || value === null) {
    return '-'
  }
  return value ? '是' : '否'
}

/** 格式化招聘职位薪资范围：面议 / 最低-最高 单位 */
export function formatRecruitPostSalary(post: API.HrmRecruitPostRespVO): string {
  if (
    post.minSalary === RECRUIT_SALARY_NEGOTIABLE_VALUE &&
    post.maxSalary === RECRUIT_SALARY_NEGOTIABLE_VALUE
  ) {
    return '面议'
  }
  const salaryRange = [post.minSalary, post.maxSalary]
    .filter((salary) => salary !== undefined && salary !== null)
    .join('-')
  if (!salaryRange) {
    return '-'
  }
  const salaryUnit =
    post.salaryUnit !== undefined && post.salaryUnit !== null
      ? (RECRUIT_SALARY_UNIT[post.salaryUnit]?.text as string) || ''
      : ''
  return [salaryRange, salaryUnit].filter(Boolean).join(' ')
}

/** 格式化招聘职位年龄要求：最小、最大都为不限值时显示“不限” */
export function formatRecruitPostAge(post: API.HrmRecruitPostRespVO): string {
  if (post.minAge === RECRUIT_AGE_UNLIMITED_VALUE && post.maxAge === RECRUIT_AGE_UNLIMITED_VALUE) {
    return '不限'
  }
  const hasMinAge = post.minAge !== undefined && post.minAge !== null
  const hasMaxAge = post.maxAge !== undefined && post.maxAge !== null
  if (hasMinAge && hasMaxAge) {
    return `${post.minAge}-${post.maxAge}`
  }
  if (hasMinAge) {
    return `${post.minAge} 岁以上`
  }
  if (hasMaxAge) {
    return `${post.maxAge} 岁以下`
  }
  return '-'
}

/** 格式化招聘职位进度百分比 */
export function formatRecruitPostSchedule(post: API.HrmRecruitPostRespVO): string {
  return post.recruitSchedule === undefined || post.recruitSchedule === null
    ? '-'
    : `${post.recruitSchedule}%`
}

/** 格式化招聘职位进度：已入职 / 招聘人数（百分比） */
export function formatRecruitPostProgress(post: API.HrmRecruitPostRespVO): string {
  const joinedCount = post.hasEntryNum ?? 0
  const recruitCount = post.recruitNum ?? 0
  if (!recruitCount) {
    return `${joinedCount} / ${recruitCount}`
  }
  return `${joinedCount} / ${recruitCount}（${post.recruitSchedule ?? 0}%）`
}

/** 将 LocalTime 或字符串转换为 "HH:mm" 字符串 */
function toTimeString(time?: API.LocalTime | string): string | undefined {
  if (!time) return undefined
  if (typeof time === 'string') return time
  if (typeof time === 'object' && time.hour !== undefined && time.minute !== undefined) {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(time.hour)}:${pad(time.minute)}`
  }
  return undefined
}

/** 计算时间范围的分钟数 */
function getTimeRangeMinutes(
  startTime?: API.LocalTime | string,
  endTime?: API.LocalTime | string
): number {
  const startStr = toTimeString(startTime)
  const endStr = toTimeString(endTime)
  if (!startStr || !endStr) {
    return 0
  }
  const [startHour, startMinute] = startStr.split(':').map(Number)
  const [endHour, endMinute] = endStr.split(':').map(Number)
  const start = startHour * 60 + startMinute
  let end = endHour * 60 + endMinute
  if (end <= start) {
    end += 24 * 60
  }
  return end - start
}

/** 格式化考勤班次工作时长 */
export function formatHrmAttendanceShiftDuration(shift: API.Shift): string {
  let duration = getTimeRangeMinutes(shift.startTime, shift.endTime)
  if (shift.excludeRestTime) {
    duration -= getTimeRangeMinutes(shift.restStartTime, shift.restEndTime)
  }
  duration = Math.max(duration, 0)
  return `${Math.floor(duration / 60)} 小时 ${duration % 60} 分钟`
}

/** 格式化考勤特殊日期：休息显示“休息”，上班取当天星期对应班次 */
export function formatHrmAttendanceSpecialDate(
  specialDate: API.SpecialDate,
  shifts?: API.Shift[]
): string {
  if (specialDate.type === HrmAttendanceHolidayTypeEnum.REST.type) {
    return '休息'
  }
  const week = specialDate.date ? dayjs(specialDate.date).day() || 7 : undefined
  const shift = shifts?.find((item) => week && item.weeks.includes(week)) || shifts?.[0]
  return shift ? `${shift.startTime} - ${shift.endTime}` : '上班'
}

/** 格式化薪资组适用范围 */
export function formatSalaryGroupScope(salaryGroup: API.HrmSalaryGroupRespVO): string {
  return [...(salaryGroup.deptNames || []), ...(salaryGroup.employeeNames || [])].join('、') || '-'
}
