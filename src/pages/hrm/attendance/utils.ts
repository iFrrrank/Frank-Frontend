import dayjs from 'dayjs'
import { getSimpleDictDataList } from '@/api/system/dictData'
import { BpmProcessInstanceStatusEnum, HrmAttendanceHolidayTypeEnum } from '@/utils/constants'
import { WEEK_OPTIONS } from '@/utils/constantsValue'

// ========== 本模块使用的本地类型（后端 LocalTime 在接口中为 "HH:mm" 字符串） ==========

/** 考勤班次 */
export interface AttendanceShift {
  weeks: number[]
  startTime: string
  endTime: string
  clockInStartTime: string
  clockInEndTime: string
  clockOutStartTime: string
  clockOutEndTime: string
  restStartTime: string
  restEndTime: string
  excludeRestTime: boolean
}

/** 特殊日期（date 为时间戳） */
export interface AttendanceSpecialDate {
  type?: number
  date?: number
}

/** 打卡地点 */
export interface AttendancePoint {
  name: string
  address: string
  latitude?: number
  longitude?: number
  radius?: number
}

/** 打卡 WiFi */
export interface AttendanceWifi {
  ssid: string
  mac: string
}

/** WiFi MAC 地址格式：支持 : 或 - 分隔 */
export const MAC_PATTERN = /^((([0-9a-f]{2}:){5})|(([0-9a-f]{2}-){5}))[0-9a-f]{2}$/i

/** 创建默认班次：周一至周五 09:00-18:00 */
export const createDefaultShift = (): AttendanceShift => ({
  weeks: [1, 2, 3, 4, 5],
  startTime: '09:00',
  endTime: '18:00',
  clockInStartTime: '05:00',
  clockInEndTime: '17:59',
  clockOutStartTime: '09:01',
  clockOutEndTime: '04:59',
  restStartTime: '12:00',
  restEndTime: '13:00',
  excludeRestTime: false
})

// ========== 日期格式化 ==========

/** 接口里的时间可能是时间戳或字符串，统一转为 dayjs */
const toDayjs = (value?: any) => {
  if (value === undefined || value === null || value === '') return undefined
  const result = dayjs(value)
  return result.isValid() ? result : undefined
}

/** 格式化日期时间，空值返回 '-' */
export const formatDateTime = (value?: any, format = 'YYYY-MM-DD HH:mm:ss') =>
  toDayjs(value)?.format(format) || '-'

/** 格式化日期，空值返回 '-' */
export const formatDateText = (value?: any) => formatDateTime(value, 'YYYY-MM-DD')

/** 指定日期的 00:00:00 ~ 23:59:59 范围 */
export const getDateRange = (begin: dayjs.ConfigType, end: dayjs.ConfigType): [string, string] => [
  dayjs(begin).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
  dayjs(end).endOf('d').format('YYYY-MM-DD HH:mm:ss')
]

/** 整月范围 */
export const getMonthRange = (month: dayjs.ConfigType): [string, string] => {
  const date = dayjs(month)
  return getDateRange(date.startOf('M'), date.endOf('M'))
}

/** 将日期选择器的起止日期转换为左右闭合的日期时间范围；范围无效时返回 undefined */
export const getDateRangeFromArray = (range?: any[] | null): [string, string] | undefined => {
  if (!range || range.length !== 2 || !range[0] || !range[1]) return undefined
  return getDateRange(range[0], range[1])
}

// ========== 数值格式化 ==========

/** 格式化天数：最多保留两位小数并去掉多余的 0 */
export const formatDays = (value?: number | null): string =>
  Number(value || 0)
    .toFixed(2)
    .replace(/\.00$/, '')
    .replace(/(\.\d)0$/, '$1')

/** 格式化金额 */
export const formatMoney = (value?: number | null): string => Number(value || 0).toFixed(2)

// ========== 考勤组相关格式化 ==========

/** 格式化星期：[1,2] => 周一、周二 */
export const formatWeeks = (weeks?: number[]): string =>
  weeks
    ?.map((week) => WEEK_OPTIONS.find((item) => item.value === week)?.label)
    .filter(Boolean)
    .join('、') || '-'

/** 格式化特殊日期的上下班时间：休息显示“休息”，上班取当天星期对应班次 */
export const formatSpecialDate = (
  specialDate: AttendanceSpecialDate,
  shifts?: AttendanceShift[]
): string => {
  if (specialDate.type === HrmAttendanceHolidayTypeEnum.REST.type) {
    return '休息'
  }
  const week = specialDate.date ? dayjs(specialDate.date).day() || 7 : undefined
  const shift = shifts?.find((item) => week && item.weeks.includes(week)) || shifts?.[0]
  return shift ? `${shift.startTime} - ${shift.endTime}` : '上班'
}

/** 迟到早退扣款单位：按分钟 / 按次数 / 每月固定 */
export const formatDeductUnit = (method?: number): string => {
  if (method === 2) return '分钟'
  if (method === 3) return '次'
  return '月'
}

/** 计算起止时间（HH:mm）之间的分钟数；结束不晚于开始视为跨日 */
const getTimeRangeMinutes = (startTime?: string, endTime?: string): number => {
  if (!startTime || !endTime) return 0
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  const start = startHour * 60 + startMinute
  let end = endHour * 60 + endMinute
  if (end <= start) {
    end += 24 * 60
  }
  return end - start
}

/** 班次合计工作时长，休息时间选择“不计入工作时长”时需要扣除 */
export const formatShiftDuration = (shift: AttendanceShift): string => {
  let duration = getTimeRangeMinutes(shift.startTime, shift.endTime)
  if (shift.excludeRestTime) {
    duration -= getTimeRangeMinutes(shift.restStartTime, shift.restEndTime)
  }
  duration = Math.max(duration, 0)
  return `${Math.floor(duration / 60)} 小时 ${duration % 60} 分钟`
}

// ========== 标签颜色 ==========

/** 打卡状态颜色：正常绿色、迟到/早退橙色、旷工/缺卡红色 */
export const CLOCK_STATUS_COLOR: Record<number, string> = {
  1: 'success',
  2: 'warning',
  3: 'warning',
  4: 'error',
  5: 'error'
}

/** 审批状态（BPM 流程实例状态）文案与颜色 */
export const BPM_STATUS_MAP: Record<number, { text: string; color: string }> = Object.values(
  BpmProcessInstanceStatusEnum
).reduce(
  (acc, item) => {
    const colorMap: Record<number, string> = {
      [-1]: 'default',
      1: 'processing',
      2: 'success',
      3: 'error',
      4: 'default'
    }
    acc[item.status] = { text: item.desc, color: colorMap[item.status] || 'default' }
    return acc
  },
  {} as Record<number, { text: string; color: string }>
)

/** 审批状态下拉选项 */
export const BPM_STATUS_OPTIONS = Object.values(BpmProcessInstanceStatusEnum).map((item) => ({
  label: item.desc,
  value: item.status
}))

// ========== 请假类型字典（hrm_attendance_leave_type，值为字符串） ==========

export interface LeaveTypeOption {
  label: string
  value: string
  colorType?: string
}

const LEAVE_TYPE_DICT = 'hrm_attendance_leave_type'
let leaveTypePromise: Promise<LeaveTypeOption[]> | undefined

/** 获取请假类型字典，结果缓存，失败时清缓存以便重试 */
export const getLeaveTypeOptions = (): Promise<LeaveTypeOption[]> => {
  if (!leaveTypePromise) {
    leaveTypePromise = getSimpleDictDataList()
      .then((resp) =>
        (resp.data || [])
          .filter((item) => item.dictType === LEAVE_TYPE_DICT)
          .map((item) => ({
            label: item.label,
            value: String(item.value),
            colorType: item.colorType
          }))
      )
      .catch(() => {
        leaveTypePromise = undefined
        return []
      })
  }
  return leaveTypePromise
}

/** 字典 colorType 转 antd Tag 颜色 */
export const dictColorToTagColor = (colorType?: string): string | undefined => {
  switch (colorType) {
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'danger':
      return 'error'
    case 'primary':
      return 'processing'
    default:
      return undefined
  }
}
