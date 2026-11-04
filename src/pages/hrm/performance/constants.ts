// 绩效模块本地枚举与选项（共享的 constants.ts / constantsValue.ts 中没有绩效相关定义）

/** 字典标签颜色（对应后端字典的 color_type，映射为 antd Tag 的 color） */
export type DictColor = 'default' | 'blue' | 'green' | 'orange' | 'red'

export interface DictItem {
  label: string
  color: DictColor
}

/** 绩效计划状态（对齐后端 HrmPerformancePlanStatusEnum） */
export const HrmPerformancePlanStatus = {
  DRAFT: 1, // 草稿
  NOT_STARTED: 2, // 未开始
  RUNNING: 3, // 进行中
  ARCHIVED: 4, // 已归档
  TERMINATED: 5 // 已终止
} as const

/** 绩效申诉超期处理动作（对齐后端 HrmPerformanceAppealTimeoutActionEnum） */
export const HrmPerformanceAppealTimeoutAction = {
  REJECT: 1, // 自动拒绝
  APPROVE: 2 // 自动通过
} as const

/** 绩效考核周期类型（对齐后端 HrmPerformanceCycleTypeEnum） */
export const HrmPerformanceCycleType = {
  MONTH: 1, // 月度
  QUARTER: 2, // 季度
  FIRST_HALF_YEAR: 3, // 上半年
  SECOND_HALF_YEAR: 4, // 下半年
  YEAR: 5, // 全年
  OTHER: 6 // 其他
} as const

/** 绩效考核周期类型选项 */
export const HrmPerformanceCycleTypeOptions = [
  { label: '月度', value: HrmPerformanceCycleType.MONTH },
  { label: '季度', value: HrmPerformanceCycleType.QUARTER },
  { label: '上半年', value: HrmPerformanceCycleType.FIRST_HALF_YEAR },
  { label: '下半年', value: HrmPerformanceCycleType.SECOND_HALF_YEAR },
  { label: '全年', value: HrmPerformanceCycleType.YEAR },
  { label: '其他', value: HrmPerformanceCycleType.OTHER }
]

/** 绩效考核范围类型（对齐后端 HrmPerformancePlanScopeTypeEnum） */
export const HrmPerformancePlanScopeType = {
  EMPLOYEE_DEPT: 1, // 员工部门
  EMPLOYMENT: 2 // 聘用形式
} as const

/** 绩效指标制定类型（对齐后端 HrmPerformanceQuotaSettingTypeEnum） */
export const HrmPerformanceQuotaSettingType = {
  SYSTEM: 1, // 系统制定
  EMPLOYEE: 2 // 员工制定
} as const

/** 绩效总分计算方式（对齐后端 HrmPerformanceScoreCalculationEnum） */
export const HrmPerformanceScoreCalculation = {
  WEIGHTED: 1 // 加权计算
} as const

/** 绩效评分上限类型（对齐后端 HrmPerformanceUpperLimitTypeEnum） */
export const HrmPerformanceUpperLimitType = {
  UNIFIED: 1 // 统一上限
} as const

/** 绩效评分人类型（对齐后端 HrmPerformanceRaterTypeEnum） */
export const HrmPerformanceRaterType = {
  SUPERIOR: 1, // 上级
  DEPT_LEADER: 2, // 部门负责人
  SPECIFIED: 3, // 指定员工
  SELF: 4 // 被考核人
} as const

/** 绩效流程处理人类型选项 */
export const HrmPerformanceHandlerTypeOptions = [
  { label: '上级', value: HrmPerformanceRaterType.SUPERIOR },
  { label: '部门负责人', value: HrmPerformanceRaterType.DEPT_LEADER },
  { label: '指定员工', value: HrmPerformanceRaterType.SPECIFIED }
]

/** 绩效评分人类型选项 */
export const HrmPerformanceRaterTypeOptions = [
  ...HrmPerformanceHandlerTypeOptions,
  { label: '被考核人', value: HrmPerformanceRaterType.SELF }
]

/** 绩效评分人最大层级 */
export const HRM_PERFORMANCE_RATER_MAX_LEVEL = 10

/** 绩效评分方式（对齐后端 HrmPerformanceReviewScoringTypeEnum） */
export const HrmPerformanceReviewScoringType = {
  QUOTA: 1, // 按指标评分
  TOTAL: 2 // 按总分评分
} as const

/** 绩效评分内容可见范围（对齐后端 HrmPerformanceReviewVisibleContentEnum） */
export const HrmPerformanceReviewVisibleContent = {
  SELF: 1, // 仅自己
  ALL: 2 // 全部评分
} as const

/** 绩效指标类型（对齐后端 HrmPerformanceQuotaTypeEnum） */
export const HrmPerformanceQuotaType = {
  PERFORMANCE: 1, // 业绩指标
  BEHAVIOR: 2 // 行为态度指标
} as const

/** 绩效指标评分类型 */
export const HrmPerformanceQuotaScoreType = {
  DIRECT_INPUT: 1 // 直接输入
} as const

/** 员工绩效考核阶段状态（对齐后端 HrmPerformanceAssessmentStageStatusEnum） */
export const HrmPerformanceAssessmentStageStatus = {
  NOT_PROCESSED: 0, // 未处理
  PROCESSED: 1, // 已处理
  PENDING: 2, // 待处理
  REJECTED: 3, // 已驳回
  PROCESSING: 4, // 处理中
  APPEALED: 5 // 已申诉
} as const

/** 绩效业务阶段类型（对齐后端 HrmPerformanceStageTypeEnum） */
export const HrmPerformanceStageType = {
  NOT_STARTED: 0, // 未开始
  FILL_QUOTA: 1, // 员工填写
  TARGET_CONFIRM: 2, // 目标确认
  SELF_SCORE: 3, // 自评
  OTHER_SCORE: 4, // 他人评分
  RESULT_AUDIT: 5, // 结果审核
  RESULT_CONFIRM: 6, // 结果确认
  APPEAL_CONFIRM: 7, // 申诉确认
  ARCHIVED: 8, // 归档
  EXECUTING: 9, // 执行中
  END: 10 // 结束
} as const

/** 业务对象类型（对齐后端 HrmBizType，用于查询操作日志） */
export const HrmBizType = {
  PERFORMANCE_ASSESSMENT: 4, // 绩效考核
  PERFORMANCE_PLAN: 5 // 绩效计划
} as const

// ========== 字典（对应后端 hrm_performance_* 字典数据） ==========

/** 绩效计划状态字典 hrm_performance_plan_status */
export const PERFORMANCE_PLAN_STATUS: Record<number, DictItem> = {
  1: { label: '草稿', color: 'default' },
  2: { label: '未开始', color: 'default' },
  3: { label: '进行中', color: 'blue' },
  4: { label: '已归档', color: 'green' },
  5: { label: '终止', color: 'red' }
}

/** 绩效阶段状态字典 hrm_performance_stage_status */
export const PERFORMANCE_STAGE_STATUS: Record<number, DictItem> = {
  0: { label: '未开始', color: 'default' },
  1: { label: '员工填写', color: 'blue' },
  2: { label: '目标确认', color: 'orange' },
  3: { label: '自评', color: 'blue' },
  4: { label: '他人评分', color: 'blue' },
  5: { label: '结果审核', color: 'orange' },
  6: { label: '结果确认', color: 'orange' },
  7: { label: '申诉确认', color: 'red' },
  8: { label: '归档', color: 'green' },
  9: { label: '执行中', color: 'blue' },
  10: { label: '结束', color: 'green' }
}

/** 绩效考核阶段处理状态字典 hrm_performance_assessment_stage_status */
export const PERFORMANCE_ASSESSMENT_STAGE_STATUS: Record<number, DictItem> = {
  0: { label: '未处理', color: 'default' },
  1: { label: '已处理', color: 'green' },
  2: { label: '待处理', color: 'orange' },
  3: { label: '已驳回', color: 'red' },
  4: { label: '处理中', color: 'blue' },
  5: { label: '已申诉', color: 'orange' }
}

/** 绩效申诉状态字典 hrm_performance_appeal_status */
export const PERFORMANCE_APPEAL_STATUS: Record<number, DictItem> = {
  0: { label: '无申诉', color: 'default' },
  1: { label: '待处理', color: 'orange' },
  2: { label: '已通过', color: 'green' },
  3: { label: '已驳回', color: 'red' },
  4: { label: '已取消', color: 'default' }
}

/** 绩效计分方式字典 hrm_performance_score_calculation */
export const PERFORMANCE_SCORE_CALCULATION_OPTIONS = [
  { label: '加权计算', value: HrmPerformanceScoreCalculation.WEIGHTED }
]

/** 将字典映射转换为 Select 选项 */
export const dictToOptions = (dict: Record<number, DictItem>) =>
  Object.entries(dict).map(([value, item]) => ({ label: item.label, value: Number(value) }))

/** 评分阶段筛选等 Select 使用的阶段状态选项 */
export const PERFORMANCE_STAGE_STATUS_OPTIONS = dictToOptions(PERFORMANCE_STAGE_STATUS)

/** 非正式员工支持的员工状态（对齐 HRM_EMPLOYEE_NON_FORMAL_STATUSES） */
export const HRM_EMPLOYEE_NON_FORMAL_STATUS_OPTIONS = [
  { label: '实习', value: 3 },
  { label: '兼职', value: 4 },
  { label: '劳务', value: 5 },
  { label: '顾问', value: 6 },
  { label: '返聘', value: 7 },
  { label: '外包', value: 8 }
]

/** 正式员工支持的员工状态 */
export const HRM_EMPLOYEE_FORMAL_STATUS_OPTIONS = [
  { label: '正式', value: 1 },
  { label: '试用', value: 2 }
]

/** 员工聘用形式（对齐后端 HrmEmployeeTypeEnum） */
export const HrmEmployeeType = {
  FORMAL: 1, // 正式
  INFORMAL: 2 // 非正式
} as const

/** 绩效申诉状态（对齐后端 HrmPerformanceAppealStatusEnum） */
export const HrmPerformanceAppealStatus = {
  NONE: 0, // 无
  PENDING: 1, // 申诉中
  PASS: 2, // 申诉通过
  REJECT: 3, // 申诉驳回
  CANCEL: 4 // 申诉取消
} as const

/** 绩效确认结果（对齐后端 HrmPerformanceConfirmationResultEnum） */
export const HrmPerformanceConfirmationResult = {
  REJECT: 0, // 驳回
  PASS: 1 // 通过
} as const
