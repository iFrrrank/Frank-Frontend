import { HrmEmployeeStatusEnum } from '@/utils/constants'

// 非正式员工可选状态：实习 / 兼职 / 劳务 / 顾问 / 返聘 / 外包
// （正式员工状态由后端按试用期自动计算，不支持手动选择）
export const HRM_EMPLOYEE_NON_FORMAL_STATUS_VALUES: number[] = [
  HrmEmployeeStatusEnum.INTERN.status,
  HrmEmployeeStatusEnum.PART_TIME.status,
  HrmEmployeeStatusEnum.LABOR.status,
  HrmEmployeeStatusEnum.CONSULTANT.status,
  HrmEmployeeStatusEnum.REHIRE.status,
  HrmEmployeeStatusEnum.OUTSOURCE.status
]

// 员工档案明细页签 Key（对应 detail 目录下的子组件）
export const EMPLOYEE_DETAIL_TAB_KEYS = {
  BASE: 'base',
  CHANGE_RECORD: 'changeRecord',
  CONTACT: 'contact',
  CONTRACT: 'contract',
  EDUCATION: 'education',
  WORK: 'work',
  TRAINING: 'training',
  CERTIFICATE: 'certificate',
  FILE: 'file',
  PERSONAL_NOTE: 'personalNote',
  SALARY_CARD: 'salaryCard',
  INSURANCE: 'insurance'
} as const
