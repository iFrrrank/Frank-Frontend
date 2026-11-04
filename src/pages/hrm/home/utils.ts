import dayjs from 'dayjs'
import type { ConfigType } from 'dayjs'

/** 格式化带千分位的 HRM 金额 */
export function formatHrmMoneyWithThousands(value?: number | null): string {
  return Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/** 格式化 HRM 日期 */
export function formatHrmDate(value?: ConfigType): string {
  if (!value) return '-'
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : '-'
}

/** 格式化 HRM 日期时间 */
export function formatHrmDateTime(value?: ConfigType): string {
  if (!value) return '-'
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}

/** 格式化 HRM 分析项的字典分类：null 表示未填写 */
export function formatHrmAnalysisType(
  names: Record<string | number, string | undefined>,
  type: number | null | undefined
): string {
  return type == null ? '未填写' : names[type] || '未知'
}

export interface HrmLunarDateInfo {
  dayText: string
  monthDayText: string
}

// 公历节日（MM-DD）
const SOLAR_FESTIVALS: Record<string, string> = {
  '01-01': '元旦',
  '02-14': '情人节',
  '03-08': '妇女节',
  '03-12': '植树节',
  '05-01': '劳动节',
  '05-04': '青年节',
  '06-01': '儿童节',
  '07-01': '建党节',
  '08-01': '建军节',
  '09-10': '教师节',
  '10-01': '国庆节',
  '12-25': '圣诞节'
}

// 农历节日（月名+日名）
const LUNAR_FESTIVALS: Record<string, string> = {
  正月初一: '春节',
  正月十五: '元宵节',
  二月初二: '龙抬头',
  五月初五: '端午节',
  七月初七: '七夕节',
  八月十五: '中秋节',
  九月初九: '重阳节',
  腊月初八: '腊八节',
  十二月初八: '腊八节'
}

/**
 * 获得日历农历信息。
 * Vue 版使用 tyme4ts，项目未引入该依赖，这里改用浏览器内置的 Intl 中国农历，
 * 节日仅覆盖常见公历/农历节日。
 */
export function getHrmLunarDateInfo(value: string): HrmLunarDateInfo {
  const date = dayjs(value)
  if (!date.isValid()) return { dayText: '', monthDayText: '' }
  try {
    const parts = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
      month: 'long',
      day: 'numeric'
    }).formatToParts(date.toDate())
    const monthName = parts.find((part) => part.type === 'month')?.value || ''
    const dayName = parts.find((part) => part.type === 'day')?.value || ''
    // 部分环境只返回数字日，兜底转成中文日名
    const dayText = /^\d+$/.test(dayName) ? toLunarDayName(Number(dayName)) : dayName
    const festival =
      LUNAR_FESTIVALS[`${monthName}${dayText}`] || SOLAR_FESTIVALS[date.format('MM-DD')]
    return {
      dayText: festival || dayText,
      monthDayText: `${monthName}${dayText}`
    }
  } catch {
    return { dayText: '', monthDayText: '' }
  }
}

/** 农历日数字转中文日名 */
function toLunarDayName(day: number): string {
  const digits = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  if (day <= 10) return `初${digits[day - 1]}`
  if (day < 20) return `十${digits[day - 11]}`
  if (day === 20) return '二十'
  if (day < 30) return `廿${digits[day - 21]}`
  return '三十'
}
