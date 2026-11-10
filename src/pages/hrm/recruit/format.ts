import { RECRUIT_AGE_UNLIMITED_VALUE, RECRUIT_SALARY_NEGOTIABLE_VALUE } from '@/utils/constants'
import { RECRUIT_SALARY_UNIT } from '@/utils/constantsValue'
import dayjs from 'dayjs'

/** 格式化时间：兼容毫秒时间戳（数字或数字字符串）和日期字符串，空值显示“-” */
export function formatDateTime(value?: string | number | null, format = 'YYYY-MM-DD HH:mm:ss') {
  if (value === undefined || value === null || value === '') {
    return '-'
  }
  const time = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
  const date = dayjs(time)
  return date.isValid() ? date.format(format) : String(value)
}

// 招聘模块通用的展示格式化方法（对应 Vue 版 views/hrm/utils/format.ts 中的招聘部分）

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
