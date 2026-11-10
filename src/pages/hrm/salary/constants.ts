/**
 * 薪资模块相关常量
 */

/** 薪资计税类型 */
export const HrmSalaryTaxType = {
  SALARY: 1, // 工资薪金所得
  LABOR: 2 // 劳务报酬所得
} as const

/** 薪资计税周期类型 */
export const HrmSalaryTaxCycleType = {
  DECEMBER_TO_NOVEMBER: 1, // 12月到次年11月
  JANUARY_TO_DECEMBER: 2 // 1月到12月
} as const

/** 薪资对应社保月份类型 */
export const HrmSalarySocialSecurityMonthType = {
  PREVIOUS_MONTH: 1, // 上月
  CURRENT_MONTH: 2, // 当月
  NEXT_MONTH: 3 // 次月
} as const

/** 薪资表员工异动分类 */
export const HrmSalaryEmployeeChangeType = {
  ALL: 0, // 计薪人数
  ENTRY: 1, // 新入职
  LEAVE: 2, // 离职
  REGULAR: 3, // 转正
  TRANSFER: 4 // 调岗
} as const

/** 工资表状态 */
export const HrmSalaryMonthStatus = {
  DRAFT: 1, // 草稿
  COMPUTED: 2, // 已核算
  HISTORY: 3 // 已归档（历史）
} as const

/** 定薪/调薪原因 */
export const HrmSalaryChangeReason = {
  ENTRY_FIX: 1, // 入职定薪
  REGULAR_ADJUST: 2, // 转正调薪
  REGULAR_TIME_ADJUST: 3, // 定期调薪
  TRANSFER_ADJUST: 4, // 调岗调薪
  PROMOTION_ADJUST: 5, // 晋升调薪
  DEMOTION_ADJUST: 6, // 降级调薪
  OTHER: 7 // 其他
} as const

/** 工资条排序方式 */
export const HrmSalarySlipSort = {
  RECENT_SEND: 1, // 按最新发放时间排序
  EARLIEST_SEND: 2, // 按最早发放时间排序
  REAL_PAY_ASC: 3, // 实发工资升序
  REAL_PAY_DESC: 4 // 实发工资降序
} as const

/** 预设薪资项编码 */
export const HrmSalaryOptionCode = {
  BASIC_SALARY: 100101, // 基本工资
  POST_SALARY: 100102, // 岗位工资
  PERFORMANCE_SALARY: 100103, // 绩效工资
  TRAFFIC_SUBSIDY: 120101, // 交通补贴
  MEAL_SUBSIDY: 120102, // 餐饮补贴
  COMMUNICATION_SUBSIDY: 120103, // 通讯补贴
  HOUSING_SUBSIDY: 120104, // 住房补贴
  FULL_ATTENDANCE_AWARD: 140101, // 全勤奖
  OVERTIME_SALARY: 150101, // 加班费
  COMMISSION_SALARY: 160101, // 提成工资
  YEAR_END_BONUS: 170101, // 年终奖
  OTHER_AWARD: 180101, // 其他奖金
  LATE_DEDUCTION: 190101, // 迟到扣款
  EARLY_DEDUCTION: 190102, // 早退扣款
  ABSENTEEISM_DEDUCTION: 190103, // 旷工扣款
  LEAVE_DEDUCTION: 190104, // 假期扣款
  MISSING_CARD_DEDUCTION: 190105, // 缺卡扣款
  COMPREHENSIVE_DEDUCTION: 190106, // 综合扣款
  ATTENDANCE_DEDUCTION_TOTAL: 200101, // 考勤扣款合计
  PERSONAL_INSURANCE: 100101, // 个人社保
  PERSONAL_PROVIDENT_FUND: 100102, // 个人公积金
  CORPORATE_INSURANCE: 110101, // 公司社保
  CORPORATE_PROVIDENT_FUND: 120101, // 公司公积金
  EXPECTED_PAY: 210101, // 应发工资
  TAXABLE: 220101, // 应税工资
  PERSONAL_TAX: 230101, // 个人所得税
  REAL_PAY: 240101, // 实发工资
  LAST_MONTH_CUMULATIVE_INCOME: 250101, // 累计收入额（截至上月）
  LAST_MONTH_CUMULATIVE_DEDUCT_EXPENSE: 250102, // 累计减除费用（截至上月）
  LAST_MONTH_CUMULATIVE_SPECIAL_DEDUCTION: 250103, // 累计专项扣除（截至上月）
  LAST_MONTH_PREPAID_TAX: 250105, // 累计已预缴税额
  CHILD_EDUCATION_DEDUCTION: 260101, // 累计子女教育
  HOUSE_RENT_DEDUCTION: 260102, // 累计住房租金
  HOUSE_LOAN_DEDUCTION: 260103, // 累计住房贷款利息
  ELDERLY_SUPPORT_DEDUCTION: 260104, // 累计赡养老人
  CONTINUING_EDUCATION_DEDUCTION: 260105, // 累计继续教育
  CURRENT_CUMULATIVE_INCOME: 270101, // 累计收入额
  CURRENT_CUMULATIVE_DEDUCT_EXPENSE: 270102, // 累计减除费用
  CURRENT_CUMULATIVE_SPECIAL_DEDUCTION: 270103, // 累计专项扣除
  CURRENT_CUMULATIVE_ADDITIONAL_DEDUCTION: 270104, // 累计专项附加扣除
  CURRENT_CUMULATIVE_TAXABLE: 270105, // 累计应纳税所得额
  CURRENT_CUMULATIVE_TAX: 270106 // 累计应纳税额
} as const

/** 薪资项分类编码 */
export const HrmSalaryOptionCategoryCode = {
  ROOT: 0, // 根分类
  BASIC_SALARY: 10 // 基本工资
} as const

/** 薪资项类型 */
export const HrmSalaryOptionType = {
  MINUS: 0, // 减项
  ADD: 1, // 加项
  CALCULATED: 2 // 计算项
} as const

/** 工资表系统计算项编码 */
export const HRM_SALARY_COMPUTED_OPTION_CODES = new Set<number>([
  HrmSalaryOptionCode.EXPECTED_PAY,
  HrmSalaryOptionCode.TAXABLE,
  HrmSalaryOptionCode.PERSONAL_TAX,
  HrmSalaryOptionCode.REAL_PAY,
  HrmSalaryOptionCode.CURRENT_CUMULATIVE_INCOME,
  HrmSalaryOptionCode.CURRENT_CUMULATIVE_DEDUCT_EXPENSE,
  HrmSalaryOptionCode.CURRENT_CUMULATIVE_SPECIAL_DEDUCTION,
  HrmSalaryOptionCode.CURRENT_CUMULATIVE_ADDITIONAL_DEDUCTION,
  HrmSalaryOptionCode.CURRENT_CUMULATIVE_TAXABLE,
  HrmSalaryOptionCode.CURRENT_CUMULATIVE_TAX
])

/** 工资条模板明细类型 */
export const HrmSalarySlipTemplateOptionType = {
  CATEGORY: 1, // 分类
  ITEM: 2 // 工资项
} as const

