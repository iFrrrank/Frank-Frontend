import dayjs from 'dayjs'
import {
  HRM_INSURANCE_PROJECT_TYPE_LABELS,
  HrmInsuranceProjectType
} from './constants'

/** 格式化 HRM 金额 */
export const formatHrmMoney = (value?: number | null): string => Number(value || 0).toFixed(2)

/** 格式化 HRM 比例 */
export const formatHrmRate = (value?: number | null): string =>
  value === undefined || value === null ? '-' : `${Number(value).toFixed(2)}%`

/** 格式化 HRM 日期 */
export const formatHrmDate = (value?: dayjs.ConfigType): string => {
  if (!value) {
    return '-'
  }
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : '-'
}

/** 获得社保项目类型名称 */
export const getInsuranceProjectTypeName = (type?: number): string =>
  type === undefined ? '' : HRM_INSURANCE_PROJECT_TYPE_LABELS[type] || ''

/** 是否为自定义社保项目 */
export const isCustomInsuranceProject = (type?: number): boolean =>
  type === HrmInsuranceProjectType.CUSTOM_SOCIAL_SECURITY ||
  type === HrmInsuranceProjectType.CUSTOM_PROVIDENT_FUND

/** 格式化参保项目名称：自定义项目展示用户填写的名称，标准项目展示类型名称 */
export const formatHrmInsuranceProjectName = (project: {
  type?: number
  name?: string
}): string => {
  if (isCustomInsuranceProject(project.type)) {
    return project.name || '-'
  }
  return getInsuranceProjectTypeName(project.type) || '-'
}
