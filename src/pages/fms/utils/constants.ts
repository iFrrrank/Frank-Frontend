// ========== FMS - 财务管理模块：常量与字典选项定义 ==========

/** FMS 账套用户权限级别枚举 */
export const FMS_ACCOUNT_USER_LEVEL = {
  OWNER: 1, // 主管
  READ: 2, // 查看者
  WRITE: 3 // 会计
} as const

export const FMS_ACCOUNT_USER_LEVEL_OPTIONS = [
  { label: '主管', value: FMS_ACCOUNT_USER_LEVEL.OWNER },
  { label: '查看者', value: FMS_ACCOUNT_USER_LEVEL.READ },
  { label: '会计', value: FMS_ACCOUNT_USER_LEVEL.WRITE }
]

/** FMS 财务指标取数报表类型枚举 */
export const FMS_FINANCE_INDICATOR_TYPE = {
  BALANCE_SHEET: 1, // 资产负债表
  INCOME_STATEMENT: 2 // 利润表
} as const

export const FMS_FINANCE_INDICATOR_TYPE_OPTIONS = [
  { label: '资产负债表', value: FMS_FINANCE_INDICATOR_TYPE.BALANCE_SHEET },
  { label: '利润表', value: FMS_FINANCE_INDICATOR_TYPE.INCOME_STATEMENT }
]

/** FMS 会计科目状态枚举 */
export const FMS_SUBJECT_STATUS = {
  ENABLED: 0, // 启用
  DISABLED: 1 // 停用
} as const

/** 根科目编号 */
export const FMS_SUBJECT_PARENT_ID_ROOT = 0

/** FMS 会计科目级次与编码规则默认值 */
export const FMS_DEFAULT_SUBJECT_LEVEL = 4
export const FMS_DEFAULT_SUBJECT_CODE_RULE = '4-2-2-2'
export const FMS_SUBJECT_LEVEL_MIN = 1
export const FMS_SUBJECT_LEVEL_MAX = 8
export const FMS_SUBJECT_CODE_LENGTH_MIN = 2
export const FMS_SUBJECT_CODE_LENGTH_MAX = 5

/** FMS 科目类型枚举 */
export const FMS_SUBJECT_TYPE = {
  ASSET: 1, // 资产
  LIABILITY: 2, // 负债
  EQUITY: 3, // 权益
  COST: 4, // 成本
  PROFIT_LOSS: 5, // 损益
  COMMON: 6 // 共同
} as const

export const FMS_SUBJECT_TYPE_OPTIONS = [
  { label: '资产', value: FMS_SUBJECT_TYPE.ASSET },
  { label: '负债', value: FMS_SUBJECT_TYPE.LIABILITY },
  { label: '权益', value: FMS_SUBJECT_TYPE.EQUITY },
  { label: '成本', value: FMS_SUBJECT_TYPE.COST },
  { label: '损益', value: FMS_SUBJECT_TYPE.PROFIT_LOSS }
]

/** FMS 科目类别选项 */
export const FMS_SUBJECT_CATEGORY_OPTIONS = [
  { label: '流动资产', value: 101 },
  { label: '非流动资产', value: 102 },
  { label: '流动负债', value: 201 },
  { label: '非流动负债', value: 202 },
  { label: '所有者权益', value: 301 },
  { label: '成本', value: 401 },
  { label: '营业收入', value: 501 },
  { label: '其他收益', value: 502 },
  { label: '期间费用', value: 503 },
  { label: '其他损失', value: 504 },
  { label: '营业成本及税金', value: 505 },
  { label: '以前年度损益调整', value: 506 },
  { label: '所得税', value: 507 }
]

/** FMS 借贷方向枚举 */
export const FMS_DEBIT_CREDIT_DIRECTION = {
  DEBIT: 1, // 借
  CREDIT: 2 // 贷
} as const

export const FMS_DEBIT_CREDIT_DIRECTION_OPTIONS = [
  { label: '借', value: FMS_DEBIT_CREDIT_DIRECTION.DEBIT },
  { label: '贷', value: FMS_DEBIT_CREDIT_DIRECTION.CREDIT }
]

/** FMS 辅助核算类别枚举 */
export const FMS_AUXILIARY_TYPE = {
  CUSTOMER: 1, // 客户
  SUPPLIER: 2, // 供应商
  EMPLOYEE: 3, // 职员
  PROJECT: 4, // 项目
  DEPARTMENT: 5, // 部门
  INVENTORY: 6, // 存货
  CUSTOM: 7 // 自定义
} as const

export const FMS_AUXILIARY_TYPE_OPTIONS = [
  { label: '客户', value: FMS_AUXILIARY_TYPE.CUSTOMER },
  { label: '供应商', value: FMS_AUXILIARY_TYPE.SUPPLIER },
  { label: '职员', value: FMS_AUXILIARY_TYPE.EMPLOYEE },
  { label: '项目', value: FMS_AUXILIARY_TYPE.PROJECT },
  { label: '部门', value: FMS_AUXILIARY_TYPE.DEPARTMENT },
  { label: '存货', value: FMS_AUXILIARY_TYPE.INVENTORY },
  { label: '自定义', value: FMS_AUXILIARY_TYPE.CUSTOM }
]

/** FMS 凭证状态枚举 */
export const FMS_VOUCHER_STATUS = {
  PENDING_REVIEW: 0, // 待审核
  APPROVED: 1 // 已审核
} as const

export const FMS_VOUCHER_STATUS_OPTIONS = [
  { label: '待审核', value: FMS_VOUCHER_STATUS.PENDING_REVIEW },
  { label: '已审核', value: FMS_VOUCHER_STATUS.APPROVED }
]

/** 凭证金额位数 */
export const FMS_VOUCHER_MONEY_UNITS = [
  '亿',
  '千',
  '百',
  '十',
  '万',
  '千',
  '百',
  '十',
  '元',
  '角',
  '分'
] as const

/** FMS 凭证整理方式枚举 */
export const FMS_VOUCHER_TIDY_TYPE = {
  FILL_GAPS: 1, // 按凭证号顺次前移补齐断号
  REORDER_BY_TIME: 2 // 按凭证日期重新顺次编号
} as const

/** FMS 凭证打印版式枚举 */
export const FMS_VOUCHER_PRINT_LAYOUT = {
  SINGLE_PORTRAIT: 'single-portrait', // 单张纵向
  DOUBLE_PORTRAIT: 'double-portrait', // 双张纵向
  A4_TWO_PER_PAGE: 'a4-two-per-page', // A4一页两张
  SINGLE_LANDSCAPE: 'single-landscape', // 单张横向
  GENERAL_PAPER: 'general-paper' // 通用打印纸
} as const

export type FmsVoucherPrintLayoutType =
  (typeof FMS_VOUCHER_PRINT_LAYOUT)[keyof typeof FMS_VOUCHER_PRINT_LAYOUT]

/** FMS 凭证允许上传的附件扩展名列表 */
export const FMS_VOUCHER_ATTACHMENT_FILE_TYPES: string[] = ['jpg', 'jpeg', 'png', 'bmp']

/** FMS 报表公式取数规则枚举 */
export const FMS_FORMULA_RULE = {
  BALANCE: 0, // 余额
  DEBIT_BALANCE: 1, // 借方余额
  CREDIT_BALANCE: 2, // 贷方余额
  SUBJECT_DEBIT_BALANCE: 3, // 科目借方余额
  SUBJECT_CREDIT_BALANCE: 4, // 科目贷方余额
  DEBIT_AMOUNT: 5, // 借方发生额
  CREDIT_AMOUNT: 6, // 贷方发生额
  PROFIT_LOSS_AMOUNT: 7 // 损益发生额
} as const

export const FMS_FORMULA_RULE_OPTIONS = [
  { label: '余额', value: FMS_FORMULA_RULE.BALANCE },
  { label: '借方余额', value: FMS_FORMULA_RULE.DEBIT_BALANCE },
  { label: '贷方余额', value: FMS_FORMULA_RULE.CREDIT_BALANCE },
  { label: '科目借方余额', value: FMS_FORMULA_RULE.SUBJECT_DEBIT_BALANCE },
  { label: '科目贷方余额', value: FMS_FORMULA_RULE.SUBJECT_CREDIT_BALANCE },
  { label: '借方发生额', value: FMS_FORMULA_RULE.DEBIT_AMOUNT },
  { label: '贷方发生额', value: FMS_FORMULA_RULE.CREDIT_AMOUNT },
  { label: '损益发生额', value: FMS_FORMULA_RULE.PROFIT_LOSS_AMOUNT }
]

export const FMS_BALANCE_FORMULA_RULE_OPTIONS = [
  { label: '余额', value: FMS_FORMULA_RULE.BALANCE },
  { label: '借方余额', value: FMS_FORMULA_RULE.DEBIT_BALANCE },
  { label: '贷方余额', value: FMS_FORMULA_RULE.CREDIT_BALANCE },
  { label: '科目借方余额', value: FMS_FORMULA_RULE.SUBJECT_DEBIT_BALANCE },
  { label: '科目贷方余额', value: FMS_FORMULA_RULE.SUBJECT_CREDIT_BALANCE }
]

export const FMS_INCOME_FORMULA_RULE_OPTIONS = [
  { label: '借方发生额', value: FMS_FORMULA_RULE.DEBIT_AMOUNT },
  { label: '贷方发生额', value: FMS_FORMULA_RULE.CREDIT_AMOUNT },
  { label: '损益发生额', value: FMS_FORMULA_RULE.PROFIT_LOSS_AMOUNT }
]

/** FMS 财务报表类型枚举 */
export const FMS_REPORT_TYPE = {
  BALANCE_SHEET: 1, // 资产负债表
  INCOME_STATEMENT: 2, // 利润表
  CASH_FLOW_STATEMENT: 3 // 现金流量表
} as const

/** FMS 科目余额表节点类型枚举 */
export const FMS_SUBJECT_BALANCE_NODE_TYPE = {
  SUBJECT: 1, // 科目行
  AUXILIARY_COMBINATION: 2, // 辅助核算组合行
  AUXILIARY_ITEM: 2, // 辅助核算明细行
  SUMMARY: 3 // 合计行
} as const

/** FMS 账簿余额方向模式 */
export const FMS_LEDGER_BALANCE_MODE = {
  SAME_AS_SUBJECT: 1,
  OPPOSITE_TO_SUBJECT: 2
} as const

export const FMS_LEDGER_BALANCE_MODE_OPTIONS = [
  { label: '与科目方向相同', value: FMS_LEDGER_BALANCE_MODE.SAME_AS_SUBJECT },
  { label: '与科目方向相反', value: FMS_LEDGER_BALANCE_MODE.OPPOSITE_TO_SUBJECT }
]

/** FMS 会计制度枚举 */
export const FMS_ACCOUNTING_STANDARD = {
  SMALL_ENTERPRISE_2013: 1 // 小企业会计准则（2013年颁）
} as const

export const FMS_ACCOUNTING_STANDARD_OPTIONS = [
  { label: '小企业会计准则（2013 年颁）', value: FMS_ACCOUNTING_STANDARD.SMALL_ENTERPRISE_2013 }
]

export const FMS_CURRENCY_CODE = {
  RMB: 'RMB'
} as const

export const FMS_CURRENCY_OPTIONS = [
  { label: '人民币（RMB）', value: FMS_CURRENCY_CODE.RMB }
]

/** FMS 结账方案类型枚举 */
export const FMS_CLOSING_TYPE = {
  REGULAR: 1, // 常规结转
  PROFIT_LOSS: 2, // 结转损益
  UNPAID_VAT: 3, // 转出未交增值税
  LOCAL_TAX: 4, // 计提地税/附加税
  ADDITIONAL_TAX: 4, // 计提附加税
  INCOME_TAX: 5 // 计提企业所得税
} as const

/** FMS 结账取数期间枚举 */
export const FMS_CLOSING_TIME_TYPE = {
  PERIOD_END: 1, // 期末
  PERIOD_BEGIN: 2, // 期初
  PERIOD_START: 2, // 期初
  YEAR_BEGIN: 3, // 年初
  CURRENT_PERIOD: 3,
  CURRENT_YEAR: 4
} as const

export const FMS_CLOSING_TIME_TYPE_OPTIONS = [
  { label: '期末', value: FMS_CLOSING_TIME_TYPE.PERIOD_END },
  { label: '期初', value: FMS_CLOSING_TIME_TYPE.PERIOD_BEGIN },
  { label: '年初', value: FMS_CLOSING_TIME_TYPE.YEAR_BEGIN }
]

/** FMS 结账凭证类型枚举 */
export const FMS_CLOSING_VOUCHER_TYPE = {
  SEPARATE_GAIN_AND_LOSS: 1,
  COMBINED_GAIN_AND_LOSS: 2,
  GAIN_FIRST_THEN_LOSS: 1,
  GAIN_ONLY: 3,
  LOSS_ONLY: 4
} as const

export const FMS_CLOSING_VOUCHER_TYPE_OPTIONS = [
  {
    label: '收益和损失分开结转（分别生成收益凭证和损失凭证）',
    value: FMS_CLOSING_VOUCHER_TYPE.SEPARATE_GAIN_AND_LOSS
  },
  {
    label: '收益和损失同时结转',
    value: FMS_CLOSING_VOUCHER_TYPE.COMBINED_GAIN_AND_LOSS
  }
]

/** FMS 结账模板分类枚举 */
export const FMS_CLOSING_TEMPLATE_CATEGORY = {
  DAILY_EXPENSE: 1, // 日常开支
  PURCHASE_SALE: 2, // 采购销售
  CURRENT_ACCOUNT: 3, // 往来款
  TRANSFER_BUSINESS: 4 // 转账业务
} as const

export const FMS_CLOSING_TEMPLATE_CATEGORY_OPTIONS = [
  { label: '日常开支', value: FMS_CLOSING_TEMPLATE_CATEGORY.DAILY_EXPENSE },
  { label: '采购销售', value: FMS_CLOSING_TEMPLATE_CATEGORY.PURCHASE_SALE },
  { label: '往来款', value: FMS_CLOSING_TEMPLATE_CATEGORY.CURRENT_ACCOUNT },
  { label: '转账业务', value: FMS_CLOSING_TEMPLATE_CATEGORY.TRANSFER_BUSINESS }
]

/** 首页指标颜色 */
export const FMS_HOME_METRIC_COLORS = ['#4e80ee', '#f6bd16', '#5ad8a6', '#e8684a', '#9270ca']
