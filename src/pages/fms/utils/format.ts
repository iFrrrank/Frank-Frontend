import dayjs from 'dayjs'
import { FMS_DEBIT_CREDIT_DIRECTION } from './constants'

/**
 * 格式化汇率，最多保留 4 位小数并去除末尾无意义的 0
 */
export function formatExchangeRate(rate?: number) {
  if (rate === undefined || rate === null) return '-'
  const numericRate = Number(rate)
  if (!Number.isFinite(numericRate)) return '-'
  return numericRate.toFixed(4).replace(/\.?0+$/, '')
}

/**
 * 格式化金额，0 或空值默认返回空字符串
 */
export function formatMoney(value?: number, emptyText = '') {
  if (value === undefined || value === null) return emptyText
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || numericValue === 0) return emptyText
  return numericValue.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * 格式化金额，0 显示为 0.00
 */
export function formatAmount(value?: number) {
  const numericValue = Number(value || 0)
  if (!Number.isFinite(numericValue)) return '0.00'
  return numericValue.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * 格式化数量，0 或空值默认返回空字符串，最多保留 4 位小数
 */
export function formatQuantity(value?: number, emptyOrShowZero: string | boolean = '') {
  const emptyText =
    typeof emptyOrShowZero === 'boolean' ? (emptyOrShowZero ? '0' : '') : emptyOrShowZero
  if (value === undefined || value === null) return emptyText
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || numericValue === 0) return emptyText
  return numericValue.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  })
}

/**
 * 格式化借贷方向文本
 */
export function formatDebitCreditDirection(direction?: number | string) {
  if (direction === '借' || direction === '贷' || direction === '平') return direction
  const numDir = direction !== undefined ? Number(direction) : undefined
  if (numDir === FMS_DEBIT_CREDIT_DIRECTION.DEBIT) return '借'
  if (numDir === FMS_DEBIT_CREDIT_DIRECTION.CREDIT) return '贷'
  return '平'
}

/**
 * 格式化科目及辅助核算展示文本
 */
export function formatSubjectDisplay(
  subjectCode?: string,
  subjectName?: string,
  auxiliaryNames?: Array<string | undefined>
) {
  const subjectText = [subjectCode, subjectName].filter(Boolean).join(' ')
  const auxiliaryText = (auxiliaryNames || []).filter(Boolean).join(' / ')
  return auxiliaryText ? `${subjectText} / ${auxiliaryText}` : subjectText
}

/**
 * 格式化科目实时余额文本
 */
export function formatSubjectBalanceText(balance?: number, direction?: number | string) {
  const directionText = formatDebitCreditDirection(direction)
  return directionText === '平' ? '0.00' : `${directionText} ${formatAmount(balance)}`
}

/**
 * 转换人民币大写金额
 */
export function toChineseMoney(amount: number) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]
  const head = amount < 0 ? '负' : ''
  let value = Math.abs(amount)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(value * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  value = Math.floor(value)
  for (let i = 0; i < unit[0].length && value > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && value > 0; j++) {
      p = digit[value % 10] + unit[1][j] + p
      value = Math.floor(value / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  )
}

/**
 * 格式化会计期间展示文本
 */
export function formatPeriodLabel(startMonth: string, endMonth: string) {
  if (!startMonth || !endMonth) return ''
  return startMonth === endMonth ? startMonth : `${startMonth}至${endMonth}`
}

/**
 * 构建带会计期间的导出文件名
 */
export function buildPeriodFilename(title: string, startMonth: string, endMonth: string) {
  const periodLabel = formatPeriodLabel(startMonth, endMonth)
  return `${title}${periodLabel ? `-${periodLabel}` : ''}.xls`
}

/**
 * 获取月份首尾时间范围字符串 ['YYYY-MM-01 00:00:00', 'YYYY-MM-DD 23:59:59']
 */
export function getMonthRange(month: string): [string, string] {
  const d = dayjs(`${month}-01`)
  return [
    d.startOf('month').format('YYYY-MM-DD 00:00:00'),
    d.endOf('month').format('YYYY-MM-DD 23:59:59')
  ]
}
