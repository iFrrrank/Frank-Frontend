/** 月度社保表状态 */
export const HrmInsuranceMonthStatus = {
  UNARCHIVED: 0, // 未归档
  ARCHIVED: 1 // 已归档
} as const

/** 社保方案类型 */
export const HrmInsuranceSchemeType = {
  PROPORTION: 1, // 比例
  AMOUNT: 2 // 固定金额
} as const

/** 社保项目类型 */
export const HrmInsuranceProjectType = {
  ENDOWMENT: 1, // 养老保险
  MEDICAL: 2, // 医疗保险
  UNEMPLOYMENT: 3, // 失业保险
  EMPLOYMENT_INJURY: 4, // 工伤保险
  MATERNITY: 5, // 生育保险
  SUPPLEMENTARY_MEDICAL: 6, // 补充大病医疗
  SUPPLEMENTARY_ENDOWMENT: 7, // 补充养老
  DISABILITY: 8, // 残保金
  CUSTOM_SOCIAL_SECURITY: 9, // 社保自定义
  PROVIDENT_FUND: 10, // 公积金
  CUSTOM_PROVIDENT_FUND: 11 // 公积金自定义
} as const

/** 社保项目类型名称（对应字典 hrm_insurance_project_type） */
export const HRM_INSURANCE_PROJECT_TYPE_LABELS: Record<number, string> = {
  [HrmInsuranceProjectType.ENDOWMENT]: '养老保险',
  [HrmInsuranceProjectType.MEDICAL]: '医疗保险',
  [HrmInsuranceProjectType.UNEMPLOYMENT]: '失业保险',
  [HrmInsuranceProjectType.EMPLOYMENT_INJURY]: '工伤保险',
  [HrmInsuranceProjectType.MATERNITY]: '生育保险',
  [HrmInsuranceProjectType.SUPPLEMENTARY_MEDICAL]: '补充大病医疗',
  [HrmInsuranceProjectType.SUPPLEMENTARY_ENDOWMENT]: '补充养老',
  [HrmInsuranceProjectType.DISABILITY]: '残保金',
  [HrmInsuranceProjectType.CUSTOM_SOCIAL_SECURITY]: '社保自定义',
  [HrmInsuranceProjectType.PROVIDENT_FUND]: '公积金',
  [HrmInsuranceProjectType.CUSTOM_PROVIDENT_FUND]: '公积金自定义'
}

/** 员工月度参保状态 */
export const HrmInsuranceEmployeeStatus = {
  STOPPED: 0, // 停止参保
  NORMAL: 1 // 正常参保
} as const

/** 员工月度参保状态名称（对应字典 hrm_insurance_emp_status） */
export const HRM_INSURANCE_EMP_STATUS_LABELS: Record<number, string> = {
  [HrmInsuranceEmployeeStatus.STOPPED]: '停止参保',
  [HrmInsuranceEmployeeStatus.NORMAL]: '正常参保'
}
