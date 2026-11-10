// HRM 工作台（home / portal）本地常量，对齐 Vue 版 views/hrm/utils/constants.ts 中相关部分

/** 首页日历事项类型 */
export const HrmHomeCalendarItemType = {
  NOTE: 1, // 备忘
  BIRTHDAY: 2, // 生日
  ENTRY: 3, // 入职
  REGULAR: 4, // 转正
  LEAVE: 5, // 离职
  RECRUIT: 6, // 招聘面试
  ATTENDANCE: 7 // 考勤打卡
} as const

/** 招聘候选人状态（对齐后端 HrmRecruitCandidateStatusEnum，仅工作台用到的部分） */
export const HrmRecruitCandidateStatus = {
  PENDING_ENTRY: 6, // 待入职
  JOINED: 8 // 已入职
} as const

/** 员工状态页签枚举（对齐后端 HrmEmployeeStatusTabEnum） */
export const HrmEmployeeStatusTab = {
  ACTIVE: 11, // 在职
  FULL_TIME: 12, // 全职
  PENDING_ENTRY: 13, // 待入职
  PENDING_LEAVE: 14, // 待离职
  LEFT: 15 // 已离职
} as const

/** 员工首页待办筛选类型（对齐后端 HrmEmployeeTodoTypeEnum） */
export const HrmEmployeeTodoType = {
  PENDING_LEAVE: 2, // 待离职
  CONTRACT_EXPIRE: 3, // 合同到期
  REGULAR: 4, // 待转正
  PENDING_ENTRY: 5, // 待入职
  BIRTHDAY: 6 // 生日
} as const

/** 员工首页人事概况筛选类型（对齐后端 HrmEmployeeSurveyTypeEnum） */
export const HrmEmployeeSurveyType = {
  ENTRY: 1, // 入职
  LEAVE: 2, // 离职
  REGULAR: 3, // 转正
  TRANSFER: 4, // 调岗
  PENDING_ENTRY: 5, // 待入职
  PENDING_LEAVE: 6 // 待离职
} as const

/** 团队工作台年龄区间类型（对齐后端 HrmHomeAgeRangeEnum） */
export const HrmTeamHomeAgeRangeType = {
  UNDER_18: 1,
  AGE_18_TO_25: 2,
  AGE_26_TO_35: 3,
  AGE_36_TO_45: 4,
  AGE_46_TO_55: 5,
  AGE_56_AND_ABOVE: 6
} as const

/** 团队工作台司龄区间类型（对齐后端 HrmHomeCompanyAgeRangeEnum） */
export const HrmTeamHomeCompanyAgeRangeType = {
  WITHIN_3_MONTHS: 1,
  MONTHS_3_TO_6: 2,
  MONTHS_6_TO_1_YEAR: 3,
  YEARS_1_TO_3: 4,
  YEARS_3_TO_5: 5,
  YEARS_5_TO_10: 6,
  YEARS_10_AND_ABOVE: 7
} as const

/**
 * 工作台跳转目标路径。
 * Vue 版使用路由 name 跳转，React 版统一使用 path；详情页 id 通过 query 参数 ?id= 传递。
 */
export const HRM_HOME_ROUTES = {
  EMPLOYEE: '/hrm/employee',
  EMPLOYEE_DETAIL: '/hrm/employee/detail',
  RECRUIT_POST: '/hrm/recruit/post',
  RECRUIT_CANDIDATE: '/hrm/recruit/candidate',
  RECRUIT_CANDIDATE_DETAIL: '/hrm/recruit/candidate/detail',
  SALARY_MONTH_RECORD: '/hrm/salary/month-record',
  SALARY_HISTORY_DETAIL: '/hrm/salary/history/detail'
} as const

/** 工作台涉及的权限标识 */
export const HRM_HOME_PERMISSIONS = {
  EMPLOYEE_QUERY: 'hrm:employee:query',
  SALARY_MONTH_RECORD_QUERY: 'hrm:salary:month-record:query',
  RECRUIT_POST_QUERY: 'hrm:recruit:post:query',
  RECRUIT_CANDIDATE_QUERY: 'hrm:recruit:candidate:query',
  PERSONAL_NOTE_CREATE: 'hrm:employee:personal-note:create',
  PERSONAL_NOTE_DELETE: 'hrm:employee:personal-note:delete'
} as const

/** 团队概况年龄区间名称 */
export const TEAM_AGE_RANGE_NAMES: Record<number, string> = {
  [HrmTeamHomeAgeRangeType.UNDER_18]: '17以下',
  [HrmTeamHomeAgeRangeType.AGE_18_TO_25]: '18-25',
  [HrmTeamHomeAgeRangeType.AGE_26_TO_35]: '26-35',
  [HrmTeamHomeAgeRangeType.AGE_36_TO_45]: '36-45',
  [HrmTeamHomeAgeRangeType.AGE_46_TO_55]: '46-55',
  [HrmTeamHomeAgeRangeType.AGE_56_AND_ABOVE]: '56以上'
}

/** 团队概况司龄区间名称 */
export const TEAM_COMPANY_AGE_RANGE_NAMES: Record<number, string> = {
  [HrmTeamHomeCompanyAgeRangeType.WITHIN_3_MONTHS]: '3个月内',
  [HrmTeamHomeCompanyAgeRangeType.MONTHS_3_TO_6]: '3-6个月',
  [HrmTeamHomeCompanyAgeRangeType.MONTHS_6_TO_1_YEAR]: '6个月-1年',
  [HrmTeamHomeCompanyAgeRangeType.YEARS_1_TO_3]: '1-3年',
  [HrmTeamHomeCompanyAgeRangeType.YEARS_3_TO_5]: '3-5年',
  [HrmTeamHomeCompanyAgeRangeType.YEARS_5_TO_10]: '5-10年',
  [HrmTeamHomeCompanyAgeRangeType.YEARS_10_AND_ABOVE]: '10年以上'
}
