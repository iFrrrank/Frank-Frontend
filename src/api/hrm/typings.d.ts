declare namespace API {
  type archivePerformancePlanParams = {
    // 绩效计划 Id
    id: number
  }

  type AssessmentConfig = {
    // 模板名称
    name: string
    // 计分方式
    scoreCalculation: number
    // 分数上限类型
    upperLimitType: number
    // 分数上限
    upperLimitScore: number
    // 考核维度配置
    dimensions: Dimension[]
  }

  type cancelSalaryChangeRecordParams = {
    // 定薪/调薪记录 Id
    id: number
  }

  type checkAttendanceHolidayParams = {
    // 待检查日期
    day: string
  }

  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultHrmAttendanceClockRespVO = {
    code?: number
    data?: HrmAttendanceClockRespVO
    msg?: string
  }

  type CommonResultHrmAttendanceClockShiftRespVO = {
    code?: number
    data?: HrmAttendanceClockShiftRespVO
    msg?: string
  }

  type CommonResultHrmAttendanceDailyDetailRespVO = {
    code?: number
    data?: HrmAttendanceDailyDetailRespVO
    msg?: string
  }

  type CommonResultHrmAttendanceGroupRespVO = {
    code?: number
    data?: HrmAttendanceGroupRespVO
    msg?: string
  }

  type CommonResultHrmAttendanceHolidayRespVO = {
    code?: number
    data?: HrmAttendanceHolidayRespVO
    msg?: string
  }

  type CommonResultHrmAttendanceLeaveRespVO = {
    code?: number
    data?: HrmAttendanceLeaveRespVO
    msg?: string
  }

  type CommonResultHrmAttendanceMonthDetailRespVO = {
    code?: number
    data?: HrmAttendanceMonthDetailRespVO
    msg?: string
  }

  type CommonResultHrmEmployeeImportRespVO = {
    code?: number
    data?: HrmEmployeeImportRespVO
    msg?: string
  }

  type CommonResultHrmEmployeeNotifyRespVO = {
    code?: number
    data?: HrmEmployeeNotifyRespVO
    msg?: string
  }

  type CommonResultHrmEmployeeQuitInfoRespVO = {
    code?: number
    data?: HrmEmployeeQuitInfoRespVO
    msg?: string
  }

  type CommonResultHrmEmployeeRespVO = {
    code?: number
    data?: HrmEmployeeRespVO
    msg?: string
  }

  type CommonResultHrmEmployeeSalaryCardRespVO = {
    code?: number
    data?: HrmEmployeeSalaryCardRespVO
    msg?: string
  }

  type CommonResultHrmInsuranceEmployeeInfoRespVO = {
    code?: number
    data?: HrmInsuranceEmployeeInfoRespVO
    msg?: string
  }

  type CommonResultHrmInsuranceMonthEmployeeRecordRespVO = {
    code?: number
    data?: HrmInsuranceMonthEmployeeRecordRespVO
    msg?: string
  }

  type CommonResultHrmInsuranceMonthRecordRespVO = {
    code?: number
    data?: HrmInsuranceMonthRecordRespVO
    msg?: string
  }

  type CommonResultHrmInsuranceSchemeRespVO = {
    code?: number
    data?: HrmInsuranceSchemeRespVO
    msg?: string
  }

  type CommonResultHrmPerformanceAssessmentRespVO = {
    code?: number
    data?: HrmPerformanceAssessmentRespVO
    msg?: string
  }

  type CommonResultHrmPerformanceAssessmentTemplateRespVO = {
    code?: number
    data?: HrmPerformanceAssessmentTemplateRespVO
    msg?: string
  }

  type CommonResultHrmPerformancePlanRespVO = {
    code?: number
    data?: HrmPerformancePlanRespVO
    msg?: string
  }

  type CommonResultHrmPerformanceResultTemplateRespVO = {
    code?: number
    data?: HrmPerformanceResultTemplateRespVO
    msg?: string
  }

  type CommonResultHrmRecruitCandidateRespVO = {
    code?: number
    data?: HrmRecruitCandidateRespVO
    msg?: string
  }

  type CommonResultHrmRecruitChannelRespVO = {
    code?: number
    data?: HrmRecruitChannelRespVO
    msg?: string
  }

  type CommonResultHrmRecruitInterviewRespVO = {
    code?: number
    data?: HrmRecruitInterviewRespVO
    msg?: string
  }

  type CommonResultHrmRecruitPostRespVO = {
    code?: number
    data?: HrmRecruitPostRespVO
    msg?: string
  }

  type CommonResultHrmSalaryChangeRecordRespVO = {
    code?: number
    data?: HrmSalaryChangeRecordRespVO
    msg?: string
  }

  type CommonResultHrmSalaryChangeTemplateRespVO = {
    code?: number
    data?: HrmSalaryChangeTemplateRespVO
    msg?: string
  }

  type CommonResultHrmSalaryConfigRespVO = {
    code?: number
    data?: HrmSalaryConfigRespVO
    msg?: string
  }

  type CommonResultHrmSalaryEmployeeInfoImportRespVO = {
    code?: number
    data?: HrmSalaryEmployeeInfoImportRespVO
    msg?: string
  }

  type CommonResultHrmSalaryEmployeeInfoRespVO = {
    code?: number
    data?: HrmSalaryEmployeeInfoRespVO
    msg?: string
  }

  type CommonResultHrmSalaryEmployeeInfoUpdateListRespVO = {
    code?: number
    data?: HrmSalaryEmployeeInfoUpdateListRespVO
    msg?: string
  }

  type CommonResultHrmSalaryGroupRespVO = {
    code?: number
    data?: HrmSalaryGroupRespVO
    msg?: string
  }

  type CommonResultHrmSalaryMonthRecordRespVO = {
    code?: number
    data?: HrmSalaryMonthRecordRespVO
    msg?: string
  }

  type CommonResultHrmSalaryPayrollReadinessRespVO = {
    code?: number
    data?: HrmSalaryPayrollReadinessRespVO
    msg?: string
  }

  type CommonResultHrmSalarySlipRespVO = {
    code?: number
    data?: HrmSalarySlipRespVO
    msg?: string
  }

  type CommonResultHrmSalarySlipSendRecordRespVO = {
    code?: number
    data?: HrmSalarySlipSendRecordRespVO
    msg?: string
  }

  type CommonResultHrmSalarySlipTemplateRespVO = {
    code?: number
    data?: HrmSalarySlipTemplateRespVO
    msg?: string
  }

  type CommonResultHrmSalaryTaxRuleRespVO = {
    code?: number
    data?: HrmSalaryTaxRuleRespVO
    msg?: string
  }

  type CommonResultListHrmAttendanceGroupRespVO = {
    code?: number
    data?: HrmAttendanceGroupRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeCertificateRespVO = {
    code?: number
    data?: HrmEmployeeCertificateRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeChangeRecordRespVO = {
    code?: number
    data?: HrmEmployeeChangeRecordRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeContactRespVO = {
    code?: number
    data?: HrmEmployeeContactRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeContractRespVO = {
    code?: number
    data?: HrmEmployeeContractRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeDeptStatisticsRespVO = {
    code?: number
    data?: HrmEmployeeDeptStatisticsRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeEducationExperienceRespVO = {
    code?: number
    data?: HrmEmployeeEducationExperienceRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeFieldConfigRespVO = {
    code?: number
    data?: HrmEmployeeFieldConfigRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeFileRespVO = {
    code?: number
    data?: HrmEmployeeFileRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeRespVO = {
    code?: number
    data?: HrmEmployeeRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeStatusCountRespVO = {
    code?: number
    data?: HrmEmployeeStatusCountRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeTrainingExperienceRespVO = {
    code?: number
    data?: HrmEmployeeTrainingExperienceRespVO[]
    msg?: string
  }

  type CommonResultListHrmEmployeeWorkExperienceRespVO = {
    code?: number
    data?: HrmEmployeeWorkExperienceRespVO[]
    msg?: string
  }

  type CommonResultListHrmInsuranceMonthRecordRespVO = {
    code?: number
    data?: HrmInsuranceMonthRecordRespVO[]
    msg?: string
  }

  type CommonResultListHrmInsuranceSchemeRespVO = {
    code?: number
    data?: HrmInsuranceSchemeRespVO[]
    msg?: string
  }

  type CommonResultListHrmInsuranceStandardProjectRespVO = {
    code?: number
    data?: HrmInsuranceStandardProjectRespVO[]
    msg?: string
  }

  type CommonResultListHrmInsuranceStandardTypeRespVO = {
    code?: number
    data?: HrmInsuranceStandardTypeRespVO[]
    msg?: string
  }

  type CommonResultListHrmPerformanceAssessmentTemplateRespVO = {
    code?: number
    data?: HrmPerformanceAssessmentTemplateRespVO[]
    msg?: string
  }

  type CommonResultListHrmPerformancePlanRespVO = {
    code?: number
    data?: HrmPerformancePlanRespVO[]
    msg?: string
  }

  type CommonResultListHrmPerformancePlanResultLevelCountRespVO = {
    code?: number
    data?: HrmPerformancePlanResultLevelCountRespVO[]
    msg?: string
  }

  type CommonResultListHrmPerformancePlanStageCountRespVO = {
    code?: number
    data?: HrmPerformancePlanStageCountRespVO[]
    msg?: string
  }

  type CommonResultListHrmPerformanceProcessRecordRespVO = {
    code?: number
    data?: HrmPerformanceProcessRecordRespVO[]
    msg?: string
  }

  type CommonResultListHrmPerformanceResultTemplateRespVO = {
    code?: number
    data?: HrmPerformanceResultTemplateRespVO[]
    msg?: string
  }

  type CommonResultListHrmRecruitChannelRespVO = {
    code?: number
    data?: HrmRecruitChannelRespVO[]
    msg?: string
  }

  type CommonResultListHrmRecruitInterviewRespVO = {
    code?: number
    data?: HrmRecruitInterviewRespVO[]
    msg?: string
  }

  type CommonResultListHrmRecruitPostRespVO = {
    code?: number
    data?: HrmRecruitPostRespVO[]
    msg?: string
  }

  type CommonResultListHrmRecruitPostTypeRespVO = {
    code?: number
    data?: HrmRecruitPostTypeRespVO[]
    msg?: string
  }

  type CommonResultListHrmRecruitStatusCountRespVO = {
    code?: number
    data?: HrmRecruitStatusCountRespVO[]
    msg?: string
  }

  type CommonResultListHrmSalaryChangeRecordRespVO = {
    code?: number
    data?: HrmSalaryChangeRecordRespVO[]
    msg?: string
  }

  type CommonResultListHrmSalaryChangeTemplateRespVO = {
    code?: number
    data?: HrmSalaryChangeTemplateRespVO[]
    msg?: string
  }

  type CommonResultListHrmSalaryGroupRespVO = {
    code?: number
    data?: HrmSalaryGroupRespVO[]
    msg?: string
  }

  type CommonResultListHrmSalaryMonthEmployeeRecordRespVO = {
    code?: number
    data?: HrmSalaryMonthEmployeeRecordRespVO[]
    msg?: string
  }

  type CommonResultListHrmSalaryOptionRespVO = {
    code?: number
    data?: HrmSalaryOptionRespVO[]
    msg?: string
  }

  type CommonResultListHrmSalaryOptionValueVO = {
    code?: number
    data?: HrmSalaryOptionValueVO[]
    msg?: string
  }

  type CommonResultListHrmSalarySlipTemplateRespVO = {
    code?: number
    data?: HrmSalarySlipTemplateRespVO[]
    msg?: string
  }

  type CommonResultListHrmSalaryTaxRuleRespVO = {
    code?: number
    data?: HrmSalaryTaxRuleRespVO[]
    msg?: string
  }

  type CommonResultListLong = {
    code?: number
    data?: number[]
    msg?: string
  }

  type CommonResultListString = {
    code?: number
    data?: string[]
    msg?: string
  }

  type CommonResultLocalDate = {
    code?: number
    data?: string
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultMapIntegerLong = {
    code?: number
    data?: Record<string, any>
    msg?: string
  }

  type CommonResultMapLongBigDecimal = {
    code?: number
    data?: Record<string, any>
    msg?: string
  }

  type CommonResultPageResultHrmAttendanceClockRespVO = {
    code?: number
    data?: PageResultHrmAttendanceClockRespVO
    msg?: string
  }

  type CommonResultPageResultHrmAttendanceGroupRespVO = {
    code?: number
    data?: PageResultHrmAttendanceGroupRespVO
    msg?: string
  }

  type CommonResultPageResultHrmAttendanceHolidayRespVO = {
    code?: number
    data?: PageResultHrmAttendanceHolidayRespVO
    msg?: string
  }

  type CommonResultPageResultHrmAttendanceLeaveRespVO = {
    code?: number
    data?: PageResultHrmAttendanceLeaveRespVO
    msg?: string
  }

  type CommonResultPageResultHrmAttendanceMonthDailyOverviewRespVO = {
    code?: number
    data?: PageResultHrmAttendanceMonthDailyOverviewRespVO
    msg?: string
  }

  type CommonResultPageResultHrmAttendanceMonthRecordRespVO = {
    code?: number
    data?: PageResultHrmAttendanceMonthRecordRespVO
    msg?: string
  }

  type CommonResultPageResultHrmEmployeeRespVO = {
    code?: number
    data?: PageResultHrmEmployeeRespVO
    msg?: string
  }

  type CommonResultPageResultHrmInsuranceMonthEmployeeRecordRespVO = {
    code?: number
    data?: PageResultHrmInsuranceMonthEmployeeRecordRespVO
    msg?: string
  }

  type CommonResultPageResultHrmOperateLogRespVO = {
    code?: number
    data?: PageResultHrmOperateLogRespVO
    msg?: string
  }

  type CommonResultPageResultHrmPerformanceArchiveEmployeeRespVO = {
    code?: number
    data?: PageResultHrmPerformanceArchiveEmployeeRespVO
    msg?: string
  }

  type CommonResultPageResultHrmPerformanceAssessmentRespVO = {
    code?: number
    data?: PageResultHrmPerformanceAssessmentRespVO
    msg?: string
  }

  type CommonResultPageResultHrmPerformanceAssessmentTemplateRespVO = {
    code?: number
    data?: PageResultHrmPerformanceAssessmentTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultHrmPerformancePlanRespVO = {
    code?: number
    data?: PageResultHrmPerformancePlanRespVO
    msg?: string
  }

  type CommonResultPageResultHrmPerformanceResultTemplateRespVO = {
    code?: number
    data?: PageResultHrmPerformanceResultTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultHrmRecruitCandidateRespVO = {
    code?: number
    data?: PageResultHrmRecruitCandidateRespVO
    msg?: string
  }

  type CommonResultPageResultHrmRecruitChannelRespVO = {
    code?: number
    data?: PageResultHrmRecruitChannelRespVO
    msg?: string
  }

  type CommonResultPageResultHrmRecruitPostRespVO = {
    code?: number
    data?: PageResultHrmRecruitPostRespVO
    msg?: string
  }

  type CommonResultPageResultHrmSalaryEmployeeInfoRespVO = {
    code?: number
    data?: PageResultHrmSalaryEmployeeInfoRespVO
    msg?: string
  }

  type CommonResultPageResultHrmSalaryGroupRespVO = {
    code?: number
    data?: PageResultHrmSalaryGroupRespVO
    msg?: string
  }

  type CommonResultPageResultHrmSalaryMonthEmployeeRecordRespVO = {
    code?: number
    data?: PageResultHrmSalaryMonthEmployeeRecordRespVO
    msg?: string
  }

  type CommonResultPageResultHrmSalaryMonthRecordRespVO = {
    code?: number
    data?: PageResultHrmSalaryMonthRecordRespVO
    msg?: string
  }

  type CommonResultPageResultHrmSalarySlipRespVO = {
    code?: number
    data?: PageResultHrmSalarySlipRespVO
    msg?: string
  }

  type CommonResultPageResultHrmSalarySlipSendEmployeeRespVO = {
    code?: number
    data?: PageResultHrmSalarySlipSendEmployeeRespVO
    msg?: string
  }

  type CommonResultPageResultHrmSalarySlipSendRecordRespVO = {
    code?: number
    data?: PageResultHrmSalarySlipSendRecordRespVO
    msg?: string
  }

  type computeMonthRecordParams = {
    // 工资表 Id
    id: number
  }

  type computeMonthRecordWithImportParams = {
    // 工资表编号
    id: number
    // 是否同步社保数据
    syncInsuranceData?: boolean
    // 是否同步考勤数据
    syncAttendanceData?: boolean
    // 考勤数据文件
    attendanceFile?: any
    // 专项附加扣除数据文件
    additionalDeductionFile?: any
    // 上月个税累计数据文件
    cumulativeTaxFile?: any
  }

  type DeductRule = {
    // 迟到扣款方式
    lateMethod: number
    // 迟到扣款金额
    lateDeductMoney: number
    // 早退扣款方式
    earlyMethod: number
    // 早退扣款金额
    earlyDeductMoney: number
    // 旷工扣款方式
    absenteeismMethod: number
    // 旷工扣款金额
    absenteeismDeductMoney: number
    // 缺卡扣款方式
    missCardMethod: number
    // 缺卡扣款金额
    missCardDeductMoney: number
  }

  type deleteAttendanceClockListParams = {
    // 打卡记录 Ids
    ids: number[]
  }

  type deleteAttendanceClockParams = {
    // 打卡记录 Id
    id: number
  }

  type deleteAttendanceGroupParams = {
    // 考勤组 Id
    id: number
  }

  type deleteAttendanceHolidayParams = {
    // 考勤节假日 Id
    id: number
  }

  type deleteCertificateParams = {
    // 证书 Id
    id: number
  }

  type deleteContactParams = {
    // 联系人 Id
    id: number
  }

  type deleteContractParams = {
    // 员工合同 Id
    id: number
  }

  type deleteEducationExperienceParams = {
    // 教育经历 Id
    id: number
  }

  type deleteEmployeeListParams = {
    // 员工档案 Ids
    ids: number[]
  }

  type deleteEmployeeParams = {
    // 员工档案 Id
    id: number
  }

  type deleteEmployeeSalaryCardParams = {
    // 员工 Id
    employeeId: number
  }

  type deleteMonthRecord1Params = {
    // 社保表 Id
    id: number
  }

  type deleteMonthRecordParams = {
    // 月度工资表 Id
    id: number
  }

  type deletePerformanceArchiveEmployeeRecordsParams = {
    // 员工 Ids
    employeeIds: number[]
  }

  type deletePerformanceArchiveRecordsParams = {
    // 绩效归档记录 Ids
    ids: number[]
  }

  type deletePerformanceAssessmentTemplateListParams = {
    // 绩效考核模板 Ids
    ids: number[]
  }

  type deletePerformanceAssessmentTemplateParams = {
    // 绩效考核模板 Id
    id: number
  }

  type deletePerformancePlanParams = {
    // 绩效计划 Id
    id: number
  }

  type deletePerformanceResultTemplateListParams = {
    // 绩效结果模板 Ids
    ids: number[]
  }

  type deletePerformanceResultTemplateParams = {
    // 绩效结果模板 Id
    id: number
  }

  type deletePersonalNoteParams = {
    // 员工个人备忘 Id
    id: number
  }

  type deleteRecruitCandidateParams = {
    // 候选人 Id
    id: number
  }

  type deleteRecruitInterviewParams = {
    // 面试编号
    id: number
  }

  type deleteSalaryChangeRecordParams = {
    // 定薪/调薪记录 Id
    id: number
  }

  type deleteSalaryChangeTemplateParams = {
    // 调薪模板 Id
    id: number
  }

  type deleteSalaryGroupParams = {
    // 薪资组 Id
    id: number
  }

  type deleteSalaryOptionParams = {
    // 薪资项 Id
    id: number
  }

  type deleteSalarySlipSendRecordParams = {
    // 工资条发放记录 Id
    id: number
  }

  type deleteSalarySlipTemplateParams = {
    // 工资条模板 Id
    id: number
  }

  type deleteSalaryTaxRuleParams = {
    // 计税规则 Id
    id: number
  }

  type deleteSchemeParams = {
    // 社保方案 Id
    id: number
  }

  type deleteTrainingExperienceParams = {
    // 员工培训经历 Id
    id: number
  }

  type deleteWorkExperienceParams = {
    // 工作经历 Id
    id: number
  }

  type Dimension = {
    // 维度名称
    name: string
    // 指标类型
    quotaType: number
    // 维度权重
    weight: number
    // 备注
    remark?: string
    // 是否允许员工编辑
    allowEdit: boolean
    // 考核指标列表
    quotas: Quota[]
  }

  type Employee = {
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 职位名称
    postName?: string
    // 入职状态
    entryStatus?: number
    // 员工状态
    status?: number
    // 入职时间
    entryTime?: string
  }

  type exportAttendanceClockParams = {
    exportReqVO: HrmAttendanceClockPageReqVO
  }

  type exportAttendanceLeaveParams = {
    exportReqVO: HrmAttendanceLeavePageReqVO
  }

  type exportAttendanceMonthDailyOverviewParams = {
    exportReqVO: HrmAttendanceMonthRecordPageReqVO
  }

  type exportAttendanceMonthRecordParams = {
    exportReqVO: HrmAttendanceMonthRecordPageReqVO
  }

  type exportEmployeeParams = {
    exportReqVO: HrmEmployeePageReqVO
  }

  type findByIdParams = {
    targetClass: string
    id: string
    uniqueField: string
    targetFields: string
  }

  type findByIdsParams = {
    targetClass: string
  }

  type FindByIdsQueryPayload = {
    ids?: string[]
    uniqueField?: string
    targetFields?: string[]
  }

  type getAdditionalDeductionImportTemplateParams = {
    // 月度工资表 Id
    monthRecordId?: number
  }

  type getAttendanceClockPageParams = {
    pageReqVO: HrmAttendanceClockPageReqVO
  }

  type getAttendanceClockParams = {
    // 打卡记录 Id
    id: number
  }

  type getAttendanceClockShiftParams = {
    reqVO: HrmAttendanceClockShiftReqVO
  }

  type getAttendanceDailyDetailParams = {
    reqVO: HrmAttendanceDailyDetailReqVO
  }

  type getAttendanceGroupPageParams = {
    pageReqVO: HrmAttendanceGroupPageReqVO
  }

  type getAttendanceGroupParams = {
    // 考勤组 Id
    id: number
  }

  type getAttendanceHolidayPageParams = {
    pageReqVO: HrmAttendanceHolidayPageReqVO
  }

  type getAttendanceHolidayParams = {
    // 考勤节假日 Id
    id: number
  }

  type getAttendanceImportTemplateParams = {
    // 月度工资表 Id
    monthRecordId?: number
  }

  type getAttendanceLeavePageParams = {
    pageReqVO: HrmAttendanceLeavePageReqVO
  }

  type getAttendanceLeaveParams = {
    // 请假记录 Id
    id: number
  }

  type getAttendanceMonthDailyOverviewPageParams = {
    reqVO: HrmAttendanceMonthRecordPageReqVO
  }

  type getAttendanceMonthDetailParams = {
    // 员工 Id
    employeeId: number
    // 年份
    year: number
    // 月份
    month: number
  }

  type getAttendanceMonthRecordPageParams = {
    reqVO: HrmAttendanceMonthRecordPageReqVO
  }

  type getCertificateListParams = {
    // 员工 Id
    employeeId: number
  }

  type getCleanRecruitCandidateIdListParams = {
    reqVO: HrmRecruitCandidateCleanReqVO
  }

  type getContactListParams = {
    // 员工 Id
    employeeId: number
  }

  type getContractListParams = {
    // 员工 Id
    employeeId: number
  }

  type getCumulativeTaxImportTemplateParams = {
    // 月度工资表 Id
    monthRecordId?: number
  }

  type getEducationExperienceListParams = {
    // 员工 Id
    employeeId: number
  }

  type getEmployeeChangeRecordListParams = {
    // 员工 Id
    employeeId: number
  }

  type getEmployeeCreateFieldConfigListParams = {
    // 入职状态：1 在职，2 待入职
    entryStatus: number
  }

  type getEmployeeFileListParams = {
    // 员工 Id
    employeeId: number
  }

  type getEmployeeListParams = {
    // 员工 Ids
    ids: number[]
  }

  type getEmployeeMonthRecordPageParams = {
    reqVO: HrmSalaryEmployeeMonthRecordPageReqVO
  }

  type getEmployeePageParams = {
    pageReqVO: HrmEmployeePageReqVO
  }

  type getEmployeeParams = {
    // 员工档案 Id
    id: number
  }

  type getEmployeeSalaryCardParams = {
    // 员工 Id
    employeeId: number
  }

  type getEmployeeSimplePageParams = {
    pageReqVO: HrmEmployeePageReqVO
  }

  type getEmployeeStatusCountParams = {
    pageReqVO: HrmEmployeePageReqVO
  }

  type getInsuranceEmployeeInfoParams = {
    // 员工 Id
    employeeId: number
  }

  type getMonthEmployeeChangeCountParams = {
    reqVO: HrmSalaryMonthEmployeeRecordPageReqVO
  }

  type getMonthEmployeeRecordListParams = {
    reqVO: HrmSalaryMonthEmployeeRecordListReqVO
  }

  type getMonthEmployeeRecordPage1Params = {
    reqVO: HrmInsuranceMonthEmployeeRecordPageReqVO
  }

  type getMonthEmployeeRecordPageParams = {
    reqVO: HrmSalaryMonthEmployeeRecordPageReqVO
  }

  type getMonthEmployeeRecordParams = {
    // 员工月度社保记录 Id
    id: number
  }

  type getMonthOptionSummaryParams = {
    reqVO: HrmSalaryMonthEmployeeRecordListReqVO
  }

  type getMonthRecord1Params = {
    // 月度社保表 Id
    id: number
  }

  type getMonthRecordListParams = {
    // 年份
    year?: number
  }

  type getMonthRecordPageParams = {
    reqVO: HrmSalaryMonthRecordPageReqVO
  }

  type getMonthRecordParams = {
    // 月度工资表 Id
    id: number
  }

  type getMyAttendanceGroupParams = {
    // 员工 Id
    employeeId: number
  }

  type getOperateLogPageParams = {
    pageReqVO: HrmOperateLogPageReqVO
  }

  type getPayrollReadinessParams = {
    // 月度工资表 Id
    monthRecordId?: number
  }

  type getPerformanceArchiveEmployeePageParams = {
    reqVO: HrmPerformanceArchiveEmployeePageReqVO
  }

  type getPerformanceAssessmentArchivePageParams = {
    reqVO: HrmPerformanceArchivePageReqVO
  }

  type getPerformanceAssessmentArchiveParams = {
    // 员工绩效考核 Id
    id: number
  }

  type getPerformanceAssessmentArchiveProcessRecordListParams = {
    // 员工绩效考核 Id
    id: number
  }

  type getPerformanceAssessmentPageParams = {
    reqVO: HrmPerformanceAssessmentPageReqVO
  }

  type getPerformanceAssessmentParams = {
    // 员工绩效考核 Id
    id: number
  }

  type getPerformanceAssessmentProcessRecordListParams = {
    // 员工绩效考核 Id
    id: number
  }

  type getPerformanceAssessmentTemplatePageParams = {
    pageReqVO: HrmPerformanceAssessmentTemplatePageReqVO
  }

  type getPerformanceAssessmentTemplateParams = {
    // 绩效考核模板 Id
    id: number
  }

  type getPerformancePlanLevelCountParams = {
    // 绩效计划 Id
    planId: number
  }

  type getPerformancePlanPageParams = {
    reqVO: HrmPerformancePlanPageReqVO
  }

  type getPerformancePlanParams = {
    // 绩效计划 Id
    id: number
  }

  type getPerformancePlanStageCountParams = {
    // 绩效计划 Id
    planId: number
  }

  type getPerformancePlanStatusCountParams = {
    reqVO: HrmPerformancePlanPageReqVO
  }

  type getPerformancePlanUnassignedEmployeeIdListParams = {
    // 绩效计划 Id
    planId: number
  }

  type getPerformanceResultTemplatePageParams = {
    pageReqVO: HrmPerformanceResultTemplatePageReqVO
  }

  type getPerformanceResultTemplateParams = {
    // 绩效结果模板 Id
    id: number
  }

  type getPerformanceResultTemplateSimpleListParams = {
    // 状态
    status?: number
  }

  type getQuitInfoParams = {
    // 员工 Id
    employeeId: number
  }

  type getRecruitCandidatePageParams = {
    pageReqVO: HrmRecruitCandidatePageReqVO
  }

  type getRecruitCandidateParams = {
    // 候选人 Id
    id: number
  }

  type getRecruitCandidateStatusCountParams = {
    pageReqVO: HrmRecruitCandidatePageReqVO
  }

  type getRecruitChannelPageParams = {
    pageReqVO: HrmRecruitChannelPageReqVO
  }

  type getRecruitChannelParams = {
    // 招聘渠道 Id
    id: number
  }

  type getRecruitInterviewListByCandidateParams = {
    // 候选人 Id
    candidateId: number
  }

  type getRecruitInterviewParams = {
    // 面试编号
    id: number
  }

  type getRecruitPostPageParams = {
    pageReqVO: HrmRecruitPostPageReqVO
  }

  type getRecruitPostParams = {
    // 招聘职位 Id
    id: number
  }

  type getRecruitPostStatusCountParams = {
    pageReqVO: HrmRecruitPostPageReqVO
  }

  type getRecruitPostTypeListParams = {
    // 状态
    status?: number
  }

  type getSalaryChangeRecordListParams = {
    // 员工 Id
    employeeId: number
  }

  type getSalaryChangeRecordParams = {
    // 定薪/调薪记录 Id
    id: number
  }

  type getSalaryChangeTemplateParams = {
    // 调薪模板 Id
    id: number
  }

  type getSalaryEmployeeInfoPageParams = {
    reqVO: HrmSalaryEmployeeInfoPageReqVO
  }

  type getSalaryEmployeeInfoParams = {
    // 员工 Id
    employeeId: number
  }

  type getSalaryEmployeeInfoStatusCountParams = {
    reqVO: HrmSalaryEmployeeInfoPageReqVO
  }

  type getSalaryGroupPageParams = {
    reqVO: HrmSalaryGroupPageReqVO
  }

  type getSalaryGroupParams = {
    // 薪资组 Id
    id: number
  }

  type getSalaryOptionSimpleListParams = {
    // 是否可调薪
    adjustable?: boolean
  }

  type getSalarySlipPageParams = {
    reqVO: HrmSalarySlipPageReqVO
  }

  type getSalarySlipParams = {
    // 工资条 Id
    id: number
  }

  type getSalarySlipSendEmployeePageParams = {
    reqVO: HrmSalarySlipSendEmployeeReqVO
  }

  type getSalarySlipSendRecordPageParams = {
    reqVO: HrmSalarySlipSendRecordPageReqVO
  }

  type getSalarySlipSendRecordParams = {
    // 工资条发放记录 Id
    id: number
  }

  type getSalarySlipTemplateParams = {
    // 工资条模板 Id
    id: number
  }

  type getSalaryTaxRuleParams = {
    // 计税规则 Id
    id: number
  }

  type getSchemeParams = {
    // 社保方案 Id
    id: number
  }

  type getStandardProjectListParams = {
    reqVO: HrmInsuranceStandardProjectListReqVO
  }

  type getStandardTypeListParams = {
    reqVO: HrmInsuranceStandardTypeListReqVO
  }

  type getTrainingExperienceListParams = {
    // 员工 Id
    employeeId: number
  }

  type getUninsuredEmployeeListParams = {
    // 社保表 Id
    monthRecordId: number
  }

  type getWorkExperienceListParams = {
    // 员工 Id
    employeeId: number
  }

  type HandlerStage = {
    // 处理人类型
    type: number
    // 上级或部门层级
    level?: number
    // 指定处理员工 Id
    employeeId?: number
  }

  type HrmAttendanceClockPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 员工姓名或工号，模糊匹配
    search?: string
    // 员工 Id
    employeeId?: number
    // 部门 Ids
    deptIds?: number[]
    // 考勤打卡类型
    type?: number
    // 考勤打卡状态
    status?: number
    // 来源类型数组
    sourceTypes?: number[]
    // 打卡地点，模糊匹配
    address?: string
    // 上班日期范围
    attendanceTime?: string[]
    // 实际打卡时间范围
    clockTime?: string[]
  }

  type HrmAttendanceClockRespVO = {
    // 打卡记录 Id
    id?: number
    // 打卡员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 职位名称
    postName?: string
    // 打卡时间
    clockTime?: string
    // 打卡类型
    type?: number
    // 应打卡时间
    attendanceTime?: string
    // 打卡来源
    sourceType?: number
    // 打卡状态
    status?: number
    // 打卡阶段
    stage?: number
    // 打卡地址
    address?: string
    // 经度
    longitude?: number
    // 纬度
    latitude?: number
    // WiFi 名称
    ssid?: string
    // WiFi MAC 地址
    mac?: string
    // 备注
    remark?: string
    // 创建时间
    createTime?: string
  }

  type HrmAttendanceClockSaveReqVO = {
    // 打卡记录 Id
    id?: number
    // 打卡员工 Id
    employeeId: number
    // 打卡时间
    clockTime: string
    // 打卡类型
    type: number
    // 应打卡时间
    attendanceTime: string
    // 打卡地址
    address?: string
    // 经度
    longitude?: number
    // 纬度
    latitude?: number
    // WiFi 名称
    ssid?: string
    // WiFi MAC 地址
    mac?: string
    // 备注
    remark?: string
  }

  type HrmAttendanceClockShiftReqVO = {
    // 员工 Id
    employeeId: number
    // 考勤时间
    attendanceTime: string
  }

  type HrmAttendanceClockShiftRespVO = {
    // 上班时间
    startTime?: string
    // 下班时间
    endTime?: string
    // 上班打卡开始时间
    clockInStartTime?: string
    // 上班打卡结束时间
    clockInEndTime?: string
    // 下班打卡开始时间
    clockOutStartTime?: string
    // 下班打卡结束时间
    clockOutEndTime?: string
  }

  type HrmAttendanceDailyDetailReqVO = {
    // 员工 Id
    employeeId: number
    // 考勤日期
    attendanceTime: string
  }

  type HrmAttendanceDailyDetailRespVO = {
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 职位名称
    postName?: string
    // 日期
    attendanceTime?: string
    // 班次
    shiftName?: string
    // 是否排班
    scheduled?: boolean
    // 应打卡次数
    requiredClockCount?: number
    // 排班分钟数
    scheduledMinutes?: number
    // 缺卡次数
    missCardCount?: number
    // 是否旷工
    absenteeism?: boolean
    // 旷工分钟数
    absenteeismMinutes?: number
    // 旷工天数
    absenteeismDays?: number
    // 是否请假
    leaveStatus?: boolean
    // 请假分钟数
    leaveMinutes?: number
    // 请假天数
    leaveDays?: number
    // 考勤结果
    attendanceResult?: string
    // 打卡次数
    clockCount?: number
    // 迟到次数
    lateCount?: number
    // 迟到分钟
    lateMinutes?: number
    // 早退次数
    earlyCount?: number
    // 早退分钟
    earlyMinutes?: number
    // 打卡列表
    clockList?: HrmAttendanceClockRespVO[]
  }

  type HrmAttendanceDailyOverviewRespVO = {
    // 打卡记录
    clocks?: HrmAttendanceClockRespVO[]
    // 考勤结果
    attendanceResult?: string
    // 打卡概况展示项
    overviews?: OverviewItem[]
  }

  type HrmAttendanceGroupPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 考勤组名称
    name?: string
    // 是否默认考勤组
    defaultStatus?: boolean
  }

  type HrmAttendanceGroupRespVO = {
    // 考勤组 Id
    id?: number
    // 名称
    name?: string
    // 是否启用 WiFi 打卡
    openWifiCard?: boolean
    // 是否启用定位打卡
    openPointCard?: boolean
    // 是否法定节假日休息
    rest?: boolean
    // 是否默认配置
    defaultStatus?: boolean
    // 特殊日期设置数组
    specialDates?: SpecialDate[]
    // 部门范围
    deptIds?: number[]
    // 适用部门名称
    deptNames?: string[]
    // 员工范围
    employeeIds?: number[]
    // 适用员工名称
    employeeNames?: string[]
    // 班次配置
    shifts?: Shift[]
    // 打卡地点
    points?: Point[]
    // 打卡 WiFi
    wifis?: Wifi[]
    deductRule?: DeductRule
    // 创建时间
    createTime?: string
  }

  type HrmAttendanceGroupSaveReqVO = {
    // 考勤组 Id
    id?: number
    // 名称
    name: string
    // 是否启用 WiFi 打卡
    openWifiCard: boolean
    // 是否启用定位打卡
    openPointCard: boolean
    // 是否法定节假日休息
    rest: boolean
    // 特殊日期设置数组
    specialDates: SpecialDate[]
    // 部门范围
    deptIds: number[]
    // 员工范围
    employeeIds: number[]
    // 班次配置
    shifts: Shift[]
    // 打卡地点
    points: Point[]
    // 打卡 WiFi
    wifis: Wifi[]
    deductRule: DeductRule
  }

  type HrmAttendanceHolidayPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 日期范围
    date?: string[]
    // 节假日类型
    type?: number
  }

  type HrmAttendanceHolidayRespVO = {
    // 节假日 Id
    id?: number
    // 日期
    date?: string
    // 考勤假期类型
    type?: number
    // 创建时间
    createTime?: string
  }

  type HrmAttendanceHolidaySaveReqVO = {
    // 节假日 Id
    id?: number
    // 日期
    date: string
    // 节假日类型
    type: number
  }

  type HrmAttendanceLeavePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 排序字段
    sortingFields?: SortingField[]
    // 员工 Id
    employeeId?: number
    // 部门 Id 数组
    deptIds?: number[]
    // 员工姓名或工号
    employeeKeyword?: string
    // 请假类型数组
    types?: string[]
    // 开始时间
    startTime?: string[]
    // 审批状态
    approvalStatus?: number
  }

  type HrmAttendanceLeaveRespVO = {
    // 请假记录 Id
    id: number
    // 员工 Id
    employeeId: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 职位名称
    postName?: string
    // 请假类型
    type: string
    // 开始时间
    startTime: string
    // 结束时间
    endTime: string
    // 请假天数
    day: number
    // 请假事由
    reason?: string
    // 备注
    remark?: string
    // 创建时间
    createTime: string
    // 审批状态
    approvalStatus?: number
    // 流程实例 Id
    processInstanceId?: string
    // 审批时间
    approvalTime?: string
    // 审批意见
    approvalReason?: string
  }

  type HrmAttendanceMonthDailyOverviewRespVO = {
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 职位名称
    postName?: string
    // 年份
    year?: number
    // 月份
    month?: number
    // 每日打卡概况，Key 为日期
    dailyClockMap?: Record<string, any>
  }

  type HrmAttendanceMonthDetailRespVO = {
    summary?: HrmAttendanceMonthRecordRespVO
    // 每日打卡明细
    dailyDetails?: HrmAttendanceDailyDetailRespVO[]
    // 请假记录
    leaves?: HrmAttendanceLeaveRespVO[]
  }

  type HrmAttendanceMonthRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 员工姓名或工号，模糊匹配
    search?: string
    // 员工 Id
    employeeId?: number
    // 部门 Ids
    deptIds?: number[]
    // 年份
    year: number
    // 月份
    month: number
    // 是否全勤
    fullAttendance?: boolean
  }

  type HrmAttendanceMonthRecordRespVO = {
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 职位名称
    postName?: string
    // 考勤组名称
    attendanceGroupName?: string
    // 入职时间
    entryTime?: string
    // 员工状态
    employeeStatus?: number
    // 工作城市
    workCity?: string
    // 年份
    year?: number
    // 月份
    month?: number
    // 应出勤天数
    attendDays?: number
    // 实际出勤天数
    actualDays?: number
    // 迟到时长（分钟）
    lateMinute?: number
    // 迟到次数
    lateCount?: number
    // 早退时长（分钟）
    earlyMinute?: number
    // 早退次数
    earlyCount?: number
    // 缺卡次数
    missCardCount?: number
    // 旷工天数
    absenteeismDays?: number
    // 旷工时长（分钟）
    absenteeismMinutes?: number
    // 请假天数
    leaveDays?: number
    // 请假时长（分钟）
    leaveMinutes?: number
    // 迟到扣款
    lateDeductAmount?: number
    // 早退扣款
    earlyDeductAmount?: number
    // 缺卡扣款
    missCardDeductAmount?: number
    // 旷工扣款
    absenteeismDeductAmount?: number
    // 考勤扣款合计
    attendanceDeductAmount?: number
    // 是否全勤
    fullAttendance?: boolean
  }

  type HrmEmployeeArchiveFieldConfigSaveReqVO = {
    // 字段配置列表
    fields: HrmEmployeeFieldConfigSaveReqVO[]
  }

  type HrmEmployeeCancelQuitReqVO = {
    // 员工 Id
    employeeId: number
    // 取消原因
    reason: string
  }

  type HrmEmployeeCertificateRespVO = {
    // 证书 Id
    id: number
    // 员工 Id
    employeeId: number
    // 证书名称
    name?: string
    // 证书级别
    level?: string
    // 证书 Id
    no?: string
    // 有效起始日期
    startTime?: string
    // 有效结束日期
    endTime?: string
    // 发证机构
    issuingAuthority?: string
    // 发证日期
    issuingTime?: string
    // 备注
    remark?: string
    // 排序
    sort?: number
    // 创建时间
    createTime: string
  }

  type HrmEmployeeCertificateSaveReqVO = {
    // 证书 Id
    id?: number
    // 员工 Id
    employeeId: number
    // 证书名称
    name: string
    // 证书级别
    level?: string
    // 证书 Id
    no?: string
    // 有效起始日期
    startTime?: string
    // 有效结束日期
    endTime?: string
    // 发证机构
    issuingAuthority?: string
    // 发证日期
    issuingTime?: string
    // 备注
    remark?: string
    // 排序
    sort?: number
  }

  type HrmEmployeeChangeRecordRespVO = {
    // 异动 Id
    id: number
    // 员工 Id
    employeeId: number
    // 变动类型
    type?: number
    // 异动原因
    reason?: number
    // 原部门 Id
    oldDeptId?: number
    // 原部门名称
    oldDeptName?: string
    // 新部门 Id
    newDeptId?: number
    // 新部门名称
    newDeptName?: string
    // 原岗位名称
    oldPostName?: string
    // 新岗位名称
    newPostName?: string
    // 原职级
    oldPostLevel?: string
    // 新职级
    newPostLevel?: string
    // 原工作地点
    oldWorkAddress?: string
    // 新工作地点
    newWorkAddress?: string
    // 原直属上级员工 Id
    oldLeaderEmployeeId?: number
    // 原直属上级员工姓名
    oldLeaderEmployeeName?: string
    // 新直属上级员工 Id
    newLeaderEmployeeId?: number
    // 新直属上级员工姓名
    newLeaderEmployeeName?: string
    // 试用期，单位月
    probation?: number
    // 生效日期
    effectTime?: string
    // 备注
    remark?: string
    // 创建时间
    createTime: string
  }

  type HrmEmployeeConfirmEntryReqVO = {
    // 员工档案 Id
    id?: number
    // 员工姓名
    name: string
    // 工号
    jobNumber?: string
    // 系统用户 Id
    userId?: number
    // 手机号
    mobile: string
    // 国家地区
    country?: string
    // 民族
    nation?: string
    // 证件类型
    idType?: number
    // 证件号码
    idNumber?: string
    // 性别
    sex?: number
    // 邮箱
    email?: string
    // 籍贯
    nativePlace?: string
    // 出生时间
    birthday?: string
    // 年龄
    age?: number
    // 户籍地址
    address?: string
    // 最高学历
    highestEducation?: number
    // 部门 Id
    deptId?: number
    // 直属上级员工 Id
    leaderEmployeeId?: number
    // 入职状态
    entryStatus: number
    // 员工状态
    status?: number
    // 聘用形式
    type: number
    // 入职时间
    entryTime: string
    // 试用期，单位月；0 表示无试用期
    probation?: number
    // 转正时间
    regularTime?: string
    // 离职时间
    leaveTime?: string
    // 职位名称
    postName?: string
    // 岗位职级
    postLevel?: string
    // 工作城市
    workCity?: string
    // 工作地址
    workAddress?: string
    // 工作详细地址
    workDetailAddress?: string
    // 招聘渠道 Id
    channelId?: number
    // 司龄开始时间
    companyAgeStartTime?: string
    // 司龄，单位年
    companyAge?: number
    // 关联招聘候选人 Id
    candidateId?: number
    // 备注
    remark?: string
  }

  type HrmEmployeeContactRespVO = {
    // 联系人 Id
    id: number
    // 员工 Id
    employeeId: number
    // 联系人名称
    name?: string
    // 关系
    relation?: string
    // 联系人电话
    phone?: string
    // 联系人工作单位
    workUnit?: string
    // 联系人职务
    postName?: string
    // 联系人地址
    address?: string
    // 排序
    sort?: number
    // 创建时间
    createTime: string
  }

  type HrmEmployeeContactSaveReqVO = {
    // 联系人 Id
    id?: number
    // 员工 Id
    employeeId: number
    // 联系人名称
    name: string
    // 关系
    relation?: string
    // 联系人电话
    phone?: string
    // 联系人工作单位
    workUnit?: string
    // 联系人职务
    postName?: string
    // 联系人地址
    address?: string
    // 排序
    sort?: number
  }

  type HrmEmployeeContractRespVO = {
    // 合同 Id
    id: number
    // 员工 Id
    employeeId: number
    // 合同 Id
    no?: string
    // 合同类型
    type?: number
    // 合同开始日期
    startTime?: string
    // 合同结束日期
    endTime?: string
    // 期限
    term?: number
    // 合同状态
    status?: number
    // 签约公司
    signCompany?: string
    // 合同签订日期
    signTime?: string
    // 备注
    remark?: string
    // 是否到期提醒
    expireRemind?: boolean
    // 附件地址数组
    fileUrls?: string[]
    // 排序
    sort?: number
    // 创建时间
    createTime: string
  }

  type HrmEmployeeContractSaveReqVO = {
    // 合同 Id
    id?: number
    // 员工 Id
    employeeId: number
    // 合同 Id
    no?: string
    // 合同类型
    type: number
    // 合同开始日期
    startTime: string
    // 合同结束日期
    endTime: string
    // 期限，单位：年
    term?: number
    // 合同状态
    status: number
    // 签约公司
    signCompany?: string
    // 合同签订日期
    signTime: string
    // 备注
    remark?: string
    // 是否到期提醒
    expireRemind?: boolean
    // 附件地址数组
    fileUrls?: string[]
    // 排序
    sort?: number
  }

  type HrmEmployeeConvertToFullTimeReqVO = {
    // 员工 Id
    employeeId: number
    // 异动原因
    reason: number
    // 试用期，单位：月；0 表示无试用期
    probation: number
    // 新部门 Id；未填写表示不变
    newDeptId?: number
    // 新岗位名称；未填写表示不变
    newPostName?: string
    // 新职级；未填写表示不变
    newPostLevel?: string
    // 新工作地点；未填写表示不变
    newWorkAddress?: string
    // 新直属上级员工 Id；未填写表示不变
    newLeaderEmployeeId?: number
    // 生效日期
    effectTime: string
    // 备注
    remark?: string
  }

  type HrmEmployeeCreateFieldConfigSaveReqVO = {
    // 入职状态
    entryStatus: number
    // 字段配置列表
    fields: HrmEmployeeFieldConfigSaveReqVO[]
  }

  type HrmEmployeeCreateFromUserReqVO = {
    // 后台用户 Id
    userId: number
    // 工号
    jobNumber: string
    // 员工手机号
    mobile: string
    // 部门 Id
    deptId?: number
    // 直属上级员工 Id
    leaderEmployeeId?: number
    // 聘用形式
    type: number
    // 员工状态；非正式员工必填
    status?: number
    // 入职时间
    entryTime: string
    // 试用期，单位：月；正式员工必填
    probation?: number
    // 职位名称
    postName?: string
    // 岗位职级
    postLevel?: string
    // 工作城市
    workCity?: string
    // 工作地点
    workAddress?: string
    // 备注
    remark?: string
  }

  type HrmEmployeeDemoteReqVO = {
    // 员工 Id
    employeeId: number
    // 异动原因
    reason: number
    // 新部门 Id
    newDeptId?: number
    // 新岗位名称
    newPostName?: string
    // 新职级
    newPostLevel?: string
    // 新工作地点
    newWorkAddress?: string
    // 新直属上级员工 Id
    newLeaderEmployeeId?: number
    // 生效日期
    effectTime: string
    // 备注
    remark?: string
  }

  type HrmEmployeeDeptStatisticsRespVO = {
    // 部门 Id
    deptId: number
    // 在职员工人数
    activeCount: number
    // 全职员工人数
    fullTimeCount: number
    // 非全职员工人数
    nonFullTimeCount: number
  }

  type HrmEmployeeEducationExperienceRespVO = {
    // 教育经历 Id
    id: number
    // 员工 Id
    employeeId: number
    // 学历
    education?: number
    // 毕业院校
    graduateSchool?: string
    // 专业
    major?: string
    // 入学日期
    admissionTime?: string
    // 毕业日期
    graduationTime?: string
    // 教学方式
    teachingMethods?: number
    // 是否第一学历
    firstDegree?: boolean
    // 排序
    sort?: number
    // 创建时间
    createTime: string
  }

  type HrmEmployeeEducationExperienceSaveReqVO = {
    // 教育经历 Id
    id?: number
    // 员工 Id
    employeeId: number
    // 学历
    education: number
    // 毕业院校
    graduateSchool: string
    // 专业
    major: string
    // 入学日期
    admissionTime?: string
    // 毕业日期
    graduationTime?: string
    // 教学方式
    teachingMethods?: number
    // 是否第一学历
    firstDegree?: boolean
    // 排序
    sort?: number
  }

  type HrmEmployeeFieldConfigRespVO = {
    // 字段名称
    name: string
    // 字段标题
    title: string
    // 字段分组名称
    groupName: string
    // 是否显示
    visible: boolean
    // 是否允许员工编辑
    editable?: boolean
    // 是否锁定显示
    visibleLocked: boolean
    // 是否锁定编辑
    editableLocked: boolean
  }

  type HrmEmployeeFieldConfigSaveReqVO = {
    // 字段名称
    name: string
    // 是否显示
    visible: boolean
    // 是否允许员工编辑
    editable?: boolean
  }

  type HrmEmployeeFileRespVO = {
    // 附件 Id
    id: number
    // 员工 Id
    employeeId: number
    // 附件类型
    type: number
    // 附件地址
    url: string
    // 创建时间
    createTime: string
  }

  type HrmEmployeeFileSaveReqVO = {
    // 员工 Id
    employeeId: number
    // 附件类型
    type: number
    // 附件地址数组
    fileUrls: string[]
  }

  type HrmEmployeeImportRespVO = {
    // 创建成功的工号数组
    createJobNumbers: string[]
    // 更新成功的工号数组
    updateJobNumbers: string[]
    // 因重复而跳过的工号数组
    skipJobNumbers: string[]
    // 导入失败的员工集合，key 为原始行号和员工标识，value 为失败原因
    failureJobNumbers: Record<string, any>
  }

  type HrmEmployeeNotifyRespVO = {
    // 发送成功数量
    successCount?: number
    // 无后台账号跳过数量
    skippedCount?: number
    // 发送失败数量
    failureCount?: number
  }

  type HrmEmployeePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 排序字段
    sortingFields?: SortingField[]
    // 员工 Id 列表
    ids?: number[]
    // 员工姓名、工号或手机号，模糊匹配
    search?: string
    // 员工姓名，模糊匹配
    name?: string
    // 工号，模糊匹配
    jobNumber?: string
    // 手机号，模糊匹配
    mobile?: string
    // 部门 Id
    deptId?: number
    // 部门 Id 数组
    deptIds?: number[]
    // 直属上级员工 Id
    leaderEmployeeId?: number
    // 性别
    sex?: number
    // 入职时间范围
    entryTime?: string[]
    // 职位名称，模糊匹配
    postName?: string
    // 转正时间范围
    regularTime?: string[]
    // 工作地点，模糊匹配
    workAddress?: string
    // 招聘渠道 Id
    channelId?: number
    // 聘用形式
    type?: number
    // 入职状态
    entryStatus?: number
    // 员工状态
    status?: number
    // 员工状态分类
    statusCategory?: number
    // 首页人事概况筛选类型
    surveyType?: number
    // 首页待办筛选类型
    todoType?: number
  }

  type HrmEmployeePersonalNoteCreateReqVO = {
    // 备忘内容
    content: string
    // 提醒时间
    reminderTime: string
  }

  type HrmEmployeePromoteReqVO = {
    // 员工 Id
    employeeId: number
    // 异动原因
    reason: number
    // 新部门 Id
    newDeptId?: number
    // 新岗位名称
    newPostName?: string
    // 新职级
    newPostLevel?: string
    // 新工作地点
    newWorkAddress?: string
    // 新直属上级员工 Id
    newLeaderEmployeeId?: number
    // 生效日期
    effectTime: string
    // 备注
    remark?: string
  }

  type HrmEmployeeQuitInfoRespVO = {
    // 离职信息 Id
    id: number
    // 员工 Id
    employeeId: number
    // 计划离职时间
    planQuitTime?: string
    // 申请离职时间
    applyQuitTime?: string
    // 薪资结算时间
    salarySettlementTime?: string
    // 离职类型
    type?: number
    // 离职原因
    reason?: number
    // 备注
    remark?: string
    // 离职前员工状态
    oldEmployeeStatus?: number
    // 创建时间
    createTime: string
  }

  type HrmEmployeeQuitReqVO = {
    // 员工 Id
    employeeId: number
    // 计划离职时间
    planQuitTime: string
    // 申请离职时间
    applyQuitTime: string
    // 薪资结算时间
    salarySettlementTime: string
    // 离职类型
    type: number
    // 离职原因
    reason?: number
    // 备注
    remark?: string
  }

  type HrmEmployeeRegularReqVO = {
    // 员工 Id
    employeeId: number
    // 异动原因
    reason: number
    // 新部门 Id；未填写表示不变
    newDeptId?: number
    // 新岗位名称；未填写表示不变
    newPostName?: string
    // 新职级；未填写表示不变
    newPostLevel?: string
    // 新工作地点；未填写表示不变
    newWorkAddress?: string
    // 新直属上级员工 Id；未填写表示不变
    newLeaderEmployeeId?: number
    // 生效日期
    effectTime: string
    // 备注
    remark?: string
  }

  type HrmEmployeeRehireReqVO = {
    // 员工档案 Id
    id?: number
    // 员工姓名
    name: string
    // 工号
    jobNumber?: string
    // 系统用户 Id
    userId?: number
    // 手机号
    mobile: string
    // 国家地区
    country?: string
    // 民族
    nation?: string
    // 证件类型
    idType?: number
    // 证件号码
    idNumber?: string
    // 性别
    sex?: number
    // 邮箱
    email?: string
    // 籍贯
    nativePlace?: string
    // 出生时间
    birthday?: string
    // 年龄
    age?: number
    // 户籍地址
    address?: string
    // 最高学历
    highestEducation?: number
    // 部门 Id
    deptId?: number
    // 直属上级员工 Id
    leaderEmployeeId?: number
    // 入职状态
    entryStatus: number
    // 员工状态
    status?: number
    // 聘用形式
    type: number
    // 入职时间
    entryTime: string
    // 试用期，单位月；0 表示无试用期
    probation?: number
    // 转正时间
    regularTime?: string
    // 离职时间
    leaveTime?: string
    // 职位名称
    postName?: string
    // 岗位职级
    postLevel?: string
    // 工作城市
    workCity?: string
    // 工作地址
    workAddress?: string
    // 工作详细地址
    workDetailAddress?: string
    // 招聘渠道 Id
    channelId?: number
    // 司龄开始时间
    companyAgeStartTime?: string
    // 司龄，单位年
    companyAge?: number
    // 关联招聘候选人 Id
    candidateId?: number
    // 备注
    remark?: string
    // 员工 Id
    employeeId: number
  }

  type HrmEmployeeRespVO = {
    // 员工档案 Id
    id: number
    // 员工姓名
    name: string
    // 工号
    jobNumber?: string
    // 系统用户 Id
    userId?: number
    // 后台用户昵称
    userNickname?: string
    // 手机号
    mobile?: string
    // 国家地区
    country?: string
    // 民族
    nation?: string
    // 证件类型
    idType?: number
    // 证件号码
    idNumber?: string
    // 性别
    sex?: number
    // 邮箱
    email?: string
    // 籍贯
    nativePlace?: string
    // 出生时间
    birthday?: string
    // 年龄
    age?: number
    // 户籍地址
    address?: string
    // 最高学历
    highestEducation?: number
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 直属上级员工 Id
    leaderEmployeeId?: number
    // 直属上级员工姓名
    leaderEmployeeName?: string
    // 入职状态
    entryStatus?: number
    // 员工状态
    status?: number
    // 聘用形式
    type?: number
    // 入职时间
    entryTime?: string
    // 试用期，单位月；0 表示无试用期
    probation?: number
    // 转正时间
    regularTime?: string
    // 离职时间
    leaveTime?: string
    // 职位名称
    postName?: string
    // 岗位职级
    postLevel?: string
    // 工作城市
    workCity?: string
    // 工作地址
    workAddress?: string
    // 工作详细地址
    workDetailAddress?: string
    // 招聘渠道 Id
    channelId?: number
    // 招聘渠道名称
    channelName?: string
    // 司龄开始时间
    companyAgeStartTime?: string
    // 司龄，单位：年
    companyAge?: number
    // 关联招聘候选人 Id
    candidateId?: number
    // 银行卡号
    salaryCardNumber?: string
    // 开户地区 Id
    salaryCardAreaId?: number
    // 开户地区名称
    salaryCardAreaName?: string
    // 银行名称
    salaryCardBankName?: string
    // 开户支行名称
    salaryCardBankBranchName?: string
    // 个人社保账号
    socialSecurityNumber?: string
    // 个人公积金账号
    accumulationFundNumber?: string
    // 备注
    remark?: string
    // 创建时间
    createTime: string
  }

  type HrmEmployeeSalaryCardRespVO = {
    // 工资卡 Id
    id: number
    // 员工 Id
    employeeId: number
    // 银行卡号
    bankCardNumber?: string
    // 开户地区 Id
    bankAreaId?: number
    // 开户地区名称
    bankAreaName?: string
    // 银行名称
    bankName?: string
    // 开户支行名称
    bankBranchName?: string
    // 创建时间
    createTime: string
  }

  type HrmEmployeeSalaryCardSaveReqVO = {
    // 工资卡 Id
    id?: number
    // 员工 Id
    employeeId: number
    // 银行卡号
    bankCardNumber: string
    // 开户地区 Id
    bankAreaId?: number
    // 银行名称
    bankName?: string
    // 开户支行名称
    bankBranchName?: string
  }

  type HrmEmployeeSaveReqVO = {
    // 员工档案 Id
    id?: number
    // 员工姓名
    name: string
    // 工号
    jobNumber?: string
    // 系统用户 Id
    userId?: number
    // 手机号
    mobile: string
    // 国家地区
    country?: string
    // 民族
    nation?: string
    // 证件类型
    idType?: number
    // 证件号码
    idNumber?: string
    // 性别
    sex?: number
    // 邮箱
    email?: string
    // 籍贯
    nativePlace?: string
    // 出生时间
    birthday?: string
    // 年龄
    age?: number
    // 户籍地址
    address?: string
    // 最高学历
    highestEducation?: number
    // 部门 Id
    deptId?: number
    // 直属上级员工 Id
    leaderEmployeeId?: number
    // 入职状态
    entryStatus: number
    // 员工状态
    status?: number
    // 聘用形式
    type: number
    // 入职时间
    entryTime: string
    // 试用期，单位月；0 表示无试用期
    probation?: number
    // 转正时间
    regularTime?: string
    // 离职时间
    leaveTime?: string
    // 职位名称
    postName?: string
    // 岗位职级
    postLevel?: string
    // 工作城市
    workCity?: string
    // 工作地址
    workAddress?: string
    // 工作详细地址
    workDetailAddress?: string
    // 招聘渠道 Id
    channelId?: number
    // 司龄开始时间
    companyAgeStartTime?: string
    // 司龄，单位年
    companyAge?: number
    // 关联招聘候选人 Id
    candidateId?: number
    // 备注
    remark?: string
  }

  type HrmEmployeeStatusCountRespVO = {
    // 状态页签
    status: number
    // 数量
    count: number
  }

  type HrmEmployeeTrainingExperienceRespVO = {
    // 培训经历 Id
    id: number
    // 员工 Id
    employeeId: number
    // 培训课程
    course?: string
    // 培训机构名称
    organizationName?: string
    // 培训开始日期
    startTime?: string
    // 培训结束日期
    endTime?: string
    // 培训时长
    duration?: string
    // 培训成绩
    result?: string
    // 培训证书名称
    certificateName?: string
    // 备注
    remark?: string
    // 排序
    sort?: number
    // 创建时间
    createTime: string
  }

  type HrmEmployeeTrainingExperienceSaveReqVO = {
    // 培训经历 Id
    id?: number
    // 员工 Id
    employeeId: number
    // 培训课程
    course: string
    // 培训机构名称
    organizationName?: string
    // 培训开始日期
    startTime?: string
    // 培训结束日期
    endTime?: string
    // 培训时长
    duration?: string
    // 培训成绩
    result?: string
    // 培训证书名称
    certificateName?: string
    // 备注
    remark?: string
    // 排序
    sort?: number
  }

  type HrmEmployeeTransferReqVO = {
    // 员工 Id
    employeeId: number
    // 异动原因
    reason: number
    // 新部门 Id
    newDeptId?: number
    // 新岗位名称
    newPostName?: string
    // 新职级
    newPostLevel?: string
    // 新工作地点
    newWorkAddress?: string
    // 新直属上级员工 Id
    newLeaderEmployeeId?: number
    // 生效日期
    effectTime: string
    // 备注
    remark?: string
  }

  type HrmEmployeeWorkExperienceRespVO = {
    // 工作经历 Id
    id: number
    // 员工 Id
    employeeId: number
    // 工作单位
    workUnit?: string
    // 职务
    postName?: string
    // 工作开始日期
    startTime?: string
    // 工作结束日期
    endTime?: string
    // 离职原因
    reason?: string
    // 证明人
    witnessName?: string
    // 证明人手机号
    witnessPhone?: string
    // 工作备注
    remark?: string
    // 排序
    sort?: number
    // 创建时间
    createTime: string
  }

  type HrmEmployeeWorkExperienceSaveReqVO = {
    // 工作经历 Id
    id?: number
    // 员工 Id
    employeeId: number
    // 工作单位
    workUnit: string
    // 职务
    postName: string
    // 工作开始日期
    startTime?: string
    // 工作结束日期
    endTime?: string
    // 离职原因
    reason?: string
    // 证明人
    witnessName?: string
    // 证明人手机号
    witnessPhone?: string
    // 工作备注
    remark?: string
    // 排序
    sort?: number
  }

  type HrmInsuranceEmployeeInfoRespVO = {
    // 员工参保信息 Id
    id: number
    // 员工 Id
    employeeId: number
    // 是否本地首次缴纳社保
    firstSocialSecurity?: boolean
    // 是否本地首次缴纳公积金
    firstAccumulationFund?: boolean
    // 社保账号
    socialSecurityNumber?: string
    // 公积金账号
    accumulationFundNumber?: string
    // 社保起缴月份
    socialSecurityStartMonth?: string
    // 社保方案 Id
    schemeId?: number
    // 社保方案名称
    schemeName?: string
    // 创建时间
    createTime: string
  }

  type HrmInsuranceEmployeeInfoSaveReqVO = {
    // 员工参保信息 Id
    id?: number
    // 员工 Id
    employeeId: number
    // 是否本地首次缴纳社保
    firstSocialSecurity: boolean
    // 是否本地首次缴纳公积金
    firstAccumulationFund: boolean
    // 社保账号
    socialSecurityNumber?: string
    // 公积金账号
    accumulationFundNumber?: string
    // 社保起缴月份
    socialSecurityStartMonth?: string
    // 社保方案 Id
    schemeId?: number
  }

  type HrmInsuranceEmployeeInfoUpdateSchemeReqVO = {
    // 员工 Id
    employeeId: number
    // 社保方案 Id
    schemeId: number
  }

  type HrmInsuranceMonthEmployeeProjectRespVO = {
    // 来源社保方案项目 Id
    schemeProjectId?: number
    // 项目类型
    type: number
    // 项目名称
    name: string
    // 缴纳基数
    baseAmount?: number
    // 公司缴纳比例
    corporateRate?: number
    // 个人缴纳比例
    personalRate?: number
    // 公司缴纳金额
    corporateAmount?: number
    // 个人缴纳金额
    personalAmount?: number
  }

  type HrmInsuranceMonthEmployeeProjectUpdateReqVO = {
    // 社保方案项目 Id
    schemeProjectId: number
    // 缴纳基数
    baseAmount?: number
    // 公司缴纳金额
    corporateAmount?: number
    // 个人缴纳金额
    personalAmount?: number
  }

  type HrmInsuranceMonthEmployeeRecordCreateListReqVO = {
    // 月度社保表 Id
    monthRecordId: number
    // 员工 Id 列表
    employeeIds: number[]
  }

  type HrmInsuranceMonthEmployeeRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 月度社保表 Id
    monthRecordId: number
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 社保方案 Id
    schemeId?: number
    // 参保地区 Id
    areaId?: number
    // 参保状态
    status?: number
  }

  type HrmInsuranceMonthEmployeeRecordRespVO = {
    // 记录 Id
    id?: number
    // 社保表 Id
    monthRecordId?: number
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 手机号
    mobile?: string
    // 身份证号
    idNumber?: string
    // 性别
    sex?: number
    // 年龄
    age?: number
    // 部门 Id
    deptId?: number
    // 部门
    deptName?: string
    // 职位名称
    postName?: string
    // 入职状态
    entryStatus?: number
    // 员工状态
    employeeStatus?: number
    // 入职时间
    entryTime?: string
    // 社保方案 Id
    schemeId?: number
    // 社保方案
    schemeName?: string
    // 参保地区
    areaName?: string
    // 参保地区 Id
    areaId?: number
    // 户籍类型
    houseType?: string
    // 社保方案类型
    schemeType?: number
    // 个人社保号
    socialSecurityNumber?: string
    // 个人公积金号
    accumulationFundNumber?: string
    // 年份
    year?: number
    // 月份
    month?: number
    // 个人社保
    personalInsuranceAmount?: number
    // 个人公积金
    personalProvidentFundAmount?: number
    // 公司社保
    corporateInsuranceAmount?: number
    // 公司公积金
    corporateProvidentFundAmount?: number
    // 参保状态
    status?: number
    // 社保项目列表
    socialSecurityProjectList?: HrmInsuranceMonthEmployeeProjectRespVO[]
    // 公积金项目列表
    providentFundProjectList?: HrmInsuranceMonthEmployeeProjectRespVO[]
    // 创建时间
    createTime?: string
  }

  type HrmInsuranceMonthEmployeeRecordStopListReqVO = {
    // 员工月度社保记录 Id 列表
    ids: number[]
  }

  type HrmInsuranceMonthEmployeeRecordUpdateReqVO = {
    // 员工月度社保记录 Id
    id: number
    // 社保方案 Id
    schemeId: number
    // 社保项目列表
    projects: HrmInsuranceMonthEmployeeProjectUpdateReqVO[]
  }

  type HrmInsuranceMonthRecordCreateReqVO = {
    // 年份
    year: number
    // 月份
    month: number
  }

  type HrmInsuranceMonthRecordRespVO = {
    // 月度社保表 Id
    id: number
    // 年份
    year: number
    // 月份
    month: number
    // 标题
    title?: string
    // 参保人数
    insuredEmployeeCount: number
    // 停保人数
    stoppedEmployeeCount: number
    // 状态
    status: number
    // 个人社保金额
    personalInsuranceAmount: number
    // 个人公积金金额
    personalProvidentFundAmount: number
    // 企业社保金额
    corporateInsuranceAmount: number
    // 企业公积金金额
    corporateProvidentFundAmount: number
    // 创建时间
    createTime: string
  }

  type HrmInsuranceSchemeProjectRespVO = {
    // 社保方案项目 Id
    id: number
    // 社保方案 Id
    schemeId?: number
    // 项目类型
    type: number
    // 项目名称
    name: string
    // 缴纳基数
    baseAmount?: number
    // 公司缴纳比例
    corporateRate?: number
    // 个人缴纳比例
    personalRate?: number
    // 公司缴纳金额
    corporateAmount?: number
    // 个人缴纳金额
    personalAmount?: number
    // 创建时间
    createTime: string
  }

  type HrmInsuranceSchemeProjectSaveReqVO = {
    // 社保方案项目 Id
    id?: number
    // 项目类型
    type: number
    // 项目名称
    name: string
    // 缴纳基数
    baseAmount?: number
    // 公司缴纳比例
    corporateRate?: number
    // 个人缴纳比例
    personalRate?: number
    // 公司缴纳金额
    corporateAmount?: number
    // 个人缴纳金额
    personalAmount?: number
  }

  type HrmInsuranceSchemeRespVO = {
    // 社保方案 Id
    id: number
    // 方案名称
    name: string
    // 参保地区 Id
    areaId?: number
    // 参保地区
    areaName?: string
    // 户籍类型
    householdType?: string
    // 方案类型
    type: number
    // 全部社保项目
    projectList?: HrmInsuranceSchemeProjectRespVO[]
    // 社保项目
    socialSecurityProjectList?: HrmInsuranceSchemeProjectRespVO[]
    // 公积金项目
    providentFundProjectList?: HrmInsuranceSchemeProjectRespVO[]
    // 个人社保金额
    personalInsuranceAmount?: number
    // 公司社保金额
    corporateInsuranceAmount?: number
    // 个人公积金金额
    personalProvidentFundAmount?: number
    // 公司公积金金额
    corporateProvidentFundAmount?: number
    // 使用人数
    useCount?: number
    // 历史月记录数
    monthRecordCount?: number
    // 创建时间
    createTime: string
  }

  type HrmInsuranceSchemeSaveReqVO = {
    // 社保方案 Id
    id?: number
    // 方案名称
    name: string
    // 参保地区 Id
    areaId: number
    // 户籍类型
    householdType?: string
    // 方案类型
    type: number
    // 社保项目列表
    projectList: HrmInsuranceSchemeProjectSaveReqVO[]
  }

  type HrmInsuranceStandardProjectListReqVO = {
    // 参保地区 Id
    areaId: number
    // 参保方案编码
    typeCode: string
  }

  type HrmInsuranceStandardProjectRespVO = {
    // 项目类型
    type: number
    // 项目名称
    name: string
    // 缴纳基数
    baseAmount?: number
    // 公司缴纳比例
    corporateRate?: number
    // 个人缴纳比例
    personalRate?: number
    // 公司缴纳金额
    corporateAmount?: number
    // 个人缴纳金额
    personalAmount?: number
  }

  type HrmInsuranceStandardTypeListReqVO = {
    // 参保地区 Id
    areaId: number
  }

  type HrmInsuranceStandardTypeRespVO = {
    // 参保方案编码
    code: string
    // 参保方案名称
    name: string
  }

  type HrmOperateLogPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 业务类型
    bizType: number
    // 业务编号
    bizId: number
  }

  type HrmOperateLogRespVO = {
    // 日志 Id
    id: number
    // 操作用户 Id
    userId: number
    // 操作用户名称
    userName: string
    // 操作用户类型
    userType: number
    // 日志类型
    type: string
    // 日志子类型
    subType: string
    // 业务 Id
    bizId: number
    // 操作内容
    action: string
    // 拓展字段
    extra?: string
    // 操作时间
    createTime: string
  }

  type HrmPerformanceArchiveEmployeePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 员工姓名或工号，模糊匹配
    search?: string
  }

  type HrmPerformanceArchiveEmployeeRespVO = {
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 职位名称
    postName?: string
    // 手机号码
    mobile?: string
    // 员工状态
    employeeStatus?: number
    // 聘用形式
    employeeType?: number
    // 最近考核 Id
    latestAssessmentId?: number
    // 最近考核计划
    latestPlanName?: string
    // 最近绩效评分
    latestScore?: number
    // 最近绩效等级
    latestResultLevel?: string
    // 考核次数
    assessmentCount?: number
  }

  type HrmPerformanceArchivePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 绩效计划 Id
    planId?: number
    // 员工 Id
    employeeId?: number
    // 员工 Ids
    employeeIds?: number[]
  }

  type HrmPerformanceAssessmentBatchReqVO = {
    // 绩效计划 Id
    planId: number
    // 员工 Ids
    employeeIds: number[]
  }

  type HrmPerformanceAssessmentDimensionRespVO = {
    // 维度 Id
    id?: number
    // 员工绩效考核 Id
    assessmentId?: number
    // 维度名称
    name?: string
    // 指标类型
    quotaType?: number
    // 维度权重
    weight?: number
    // 备注
    remark?: string
    // 是否允许编辑
    allowEdit?: boolean
    // 排序
    sort?: number
  }

  type HrmPerformanceAssessmentPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 绩效计划 Id
    planId?: number
    // 员工 Id
    employeeId?: number
    // 员工编号列表
    employeeIds?: number[]
    // 员工姓名或工号
    search?: string
    // 部门 Id
    deptId?: number
    // 聘用形式
    employeeType?: number
    // 员工状态
    employeeStatus?: number
    // 考核状态
    status?: number
    // 阶段状态
    stageType?: number
    // 申诉状态
    appealStatus?: number
    // 结果等级
    resultLevel?: string
    // 结果等级是否为空
    resultLevelEmpty?: boolean
  }

  type HrmPerformanceAssessmentQuotaRespVO = {
    // Id
    id?: number
    // 员工绩效考核 Id
    assessmentId?: number
    // 员工绩效维度 Id
    dimensionId?: number
    // 是否允许编辑
    allowEdit?: boolean
    // 预设值
    preset?: boolean
    // 维度名称
    dimensionName?: string
    // 指标名称
    name?: string
    // 指标说明
    description?: string
    // 标准值
    standard?: string
    // 维度权重
    dimensionWeight?: number
    // 指标权重
    weight?: number
    // 分数类型
    scoreType?: number
    // 目标值
    targetValue?: string
    // 实际值
    actualValue?: string
    // 自评分数
    selfScore?: number
    // 评分人得分
    reviewerScore?: number
    // 最终得分
    finalScore?: number
    // 说明
    comment?: string
    // 排序
    sort?: number
  }

  type HrmPerformanceAssessmentQuotaScoreRespVO = {
    // Id
    id?: number
    // 员工评分阶段 Id
    assessmentStageId?: number
    // 员工绩效指标 Id
    assessmentQuotaId?: number
    // 得分
    score?: number
    // 说明
    comment?: string
  }

  type HrmPerformanceAssessmentRespVO = {
    // Id
    id?: number
    // 绩效计划 Id
    planId?: number
    // 绩效计划名称
    name?: string
    // 考核周期类型
    cycleType?: number
    // 考核周期
    cycle?: string
    // 开始日期
    startTime?: string
    // 结束日期
    endTime?: string
    // 单项评分上限
    upperLimitScore?: number
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 手机号
    mobile?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 职位名称
    postName?: string
    // 聘用形式
    employeeType?: number
    // 员工状态
    employeeStatus?: number
    // 当前处理人
    currentHandlerName?: string
    // 考核状态
    status?: number
    // 激活状态
    processStatus?: number
    // 阶段状态
    stageType?: number
    // 阶段排序
    stageSort?: number
    // 得分
    score?: number
    // 结果等级
    resultLevel?: string
    // 绩效系数
    coefficient?: number
    // 目标确认员工姓名
    targetConfirmationEmployeeName?: string
    // 目标确认结果
    targetConfirmationResult?: number
    // 目标确认意见
    targetConfirmationComment?: string
    // 目标确认时间
    targetConfirmationTime?: string
    // 是否可确认目标
    canConfirmTarget?: boolean
    // 自评说明
    selfComment?: string
    // 评分人说明
    reviewerComment?: string
    // 结果说明
    resultComment?: string
    // 结果确认时间
    resultConfirmationTime?: string
    // 结果审核状态
    resultAuditStatus?: number
    // 结果审核时间
    resultAuditTime?: string
    // 结果审核意见
    resultAuditReason?: string
    // 申诉原因
    appealReason?: string
    // 申诉附件地址列表
    appealFileUrls?: string[]
    // 申诉退回评分阶段编号列表
    appealReviewStageIds?: number[]
    // 申诉提交时间
    appealSubmitTime?: string
    // 申诉状态
    appealStatus?: number
    // 申诉处理时间
    appealTime?: string
    // 申诉处理意见
    appealComment?: string
    // 归档时间
    archiveTime?: string
    // 创建时间
    createTime?: string
    // 指标维度列表
    dimensions?: HrmPerformanceAssessmentDimensionRespVO[]
    // 指标列表
    quotas?: HrmPerformanceAssessmentQuotaRespVO[]
    // 评分阶段列表
    reviewStages?: HrmPerformanceAssessmentStageRespVO[]
    currentReviewStage?: HrmPerformanceAssessmentStageRespVO
    // 运行阶段列表
    stages?: HrmPerformanceAssessmentStageRespVO[]
    currentStage?: HrmPerformanceAssessmentStageRespVO
  }

  type HrmPerformanceAssessmentStageRespVO = {
    // Id
    id?: number
    // 员工绩效考核 Id
    assessmentId?: number
    // 阶段类型
    type?: number
    // 处理员工 Id
    handlerEmployeeId?: number
    // 处理人姓名
    handlerName?: string
    // 阶段名称
    name?: string
    // 评分人类型
    raterType?: number
    // 权重
    weight?: number
    // 评分类型
    scoringType?: number
    // 可见内容
    visibleContent?: number
    // 是否必填
    requiredSetting?: boolean
    // 驳回权限
    rejectAuthority?: boolean
    // 排序
    sort?: number
    // 绩效员工评审阶段状态
    status?: number
    // 得分
    score?: number
    // 结果等级
    resultLevel?: string
    // 说明
    comment?: string
    // 驳回原因
    rejectReason?: string
    // 提交时间
    submitTime?: string
    // 截止时间
    deadlineTime?: string
    // 是否可处理
    canHandle?: boolean
    // 是否可评分
    canScore?: boolean
    // 指标评分列表
    quotaScoreList?: HrmPerformanceAssessmentQuotaScoreRespVO[]
  }

  type HrmPerformanceAssessmentTemplatePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 模板名称，模糊匹配
    name?: string
  }

  type HrmPerformanceAssessmentTemplateRespVO = {
    // 模板 Id
    id?: number
    // 模板名称
    name?: string
    // 模板说明
    illustrate?: string
    // 计分方式
    scoreCalculation?: number
    // 分数上限类型
    upperLimitType?: number
    // 分数上限
    upperLimitScore?: number
    // 维度数量
    dimensionCount?: number
    // 指标数量
    quotaCount?: number
    // 状态
    status?: number
    // 考核维度列表
    dimensions?: Dimension[]
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime?: string
    // 更新时间
    updateTime?: string
  }

  type HrmPerformanceAssessmentTemplateSaveReqVO = {
    // 模板 Id
    id?: number
    // 模板名称
    name: string
    // 模板说明
    illustrate?: string
    // 计分方式
    scoreCalculation: number
    // 分数上限类型
    upperLimitType: number
    // 分数上限
    upperLimitScore: number
    // 考核维度列表
    dimensions: Dimension[]
  }

  type HrmPerformancePlanPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 绩效计划名称
    name?: string
    // 绩效计划状态
    status?: number
    // 阶段状态
    stageType?: number
  }

  type HrmPerformancePlanRespVO = {
    // 编号
    id?: number
    // 绩效计划名称
    name?: string
    // 考核周期类型
    cycleType?: number
    // 考核周期
    cycle?: string
    // 季度
    quarter?: number
    // 开始日期
    startTime?: string
    // 结束日期
    endTime?: string
    // 考核说明
    description?: string
    // 考评范围列表
    scopes?: Scope[]
    // 考核模板编号
    assessmentTemplateId?: number
    assessmentConfig?: AssessmentConfig
    // 结果模板编号
    resultTemplateId?: number
    resultConfig?: ResultConfig
    // 指标设置类型
    quotaSettingType?: number
    // 是否需要目标确认
    targetConfirmation?: boolean
    targetConfirmationStage?: HandlerStage
    // 评分阶段列表
    reviewStages?: ReviewStage[]
    // 是否需要结果审核
    resultAudit?: boolean
    // 结果审核节点列表
    resultAuditStages?: HandlerStage[]
    // 是否需要结果确认
    resultConfirmation?: boolean
    // 申诉处理节点列表
    appealStages?: HandlerStage[]
    // 申诉超期天数
    appealTimeoutDays?: number
    // 申诉超期处理方式
    appealTimeoutAction?: number
    // 是否同步薪资
    syncToSalary?: boolean
    // 计薪月份
    paidForMonth?: string
    // 各阶段员工数量
    stageCountMap?: Record<string, any>
    // 阶段状态
    stageType?: number
    // 绩效计划状态
    status?: number
    // 当前操作阶段
    operationType?: number
    // 终止时间
    terminateTime?: string
    // 考核模板名称
    assessmentTemplateName?: string
    // 结果模板名称
    resultTemplateName?: string
    // 员工数量
    employeeCount?: number
    // 已完成数量
    finishedCount?: number
    // 是否可开始评分
    scoringReady?: boolean
    // 是否可开始面谈
    interviewReady?: boolean
    // 是否可归档
    archiveReady?: boolean
    // 创建时间
    createTime?: string
  }

  type HrmPerformancePlanResultLevelCountRespVO = {
    // 等级名称
    levelName?: string
    // 数量
    count?: number
  }

  type HrmPerformancePlanSaveReqVO = {
    // Id
    id?: number
    // 绩效计划名称
    name: string
    // 考核周期类型
    cycleType: number
    // 考核周期
    cycle?: string
    // 季度
    quarter?: number
    // 开始日期
    startTime?: string
    // 结束日期
    endTime?: string
    // 考核说明
    description?: string
    // 考评范围列表
    scopes: Scope[]
    // 考核模板 Id
    assessmentTemplateId: number
    assessmentConfig: AssessmentConfig
    // 指标设置类型
    quotaSettingType: number
    // 是否需要目标确认
    targetConfirmation: boolean
    targetConfirmationStage?: HandlerStage
    // 评分阶段列表
    reviewStages: ReviewStage[]
    // 是否需要结果审核
    resultAudit: boolean
    // 结果审核节点列表
    resultAuditStages?: HandlerStage[]
    // 是否需要结果确认
    resultConfirmation: boolean
    // 申诉处理节点列表
    appealStages?: HandlerStage[]
    // 申诉超期天数
    appealTimeoutDays: number
    // 申诉超期处理方式
    appealTimeoutAction: number
    // 结果模板 Id
    resultTemplateId: number
    resultConfig: ResultConfig
    // 是否同步薪资
    syncToSalary: boolean
    // 计薪月份
    paidForMonth?: string
  }

  type HrmPerformancePlanStageCountRespVO = {
    // 阶段状态
    stageType?: number
    // 数量
    count?: number
  }

  type HrmPerformanceProcessRecordRespVO = {
    // 标题
    title?: string
    // 内容
    content?: string
    // 来源
    source?: string
    // 绩效流程记录状态
    status?: number
    // 操作人姓名
    operatorName?: string
    // 操作时间
    operateTime?: string
    // 附件地址列表
    fileUrls?: string[]
  }

  type HrmPerformanceResultTemplatePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 结果模板名称，模糊匹配
    name?: string
  }

  type HrmPerformanceResultTemplateRespVO = {
    // 结果模板 Id
    id?: number
    // 结果模板名称
    name?: string
    // 状态
    status?: number
    // 结果等级列表
    levels?: Level[]
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime?: string
    // 更新时间
    updateTime?: string
  }

  type HrmPerformanceResultTemplateSaveReqVO = {
    // 结果模板 Id
    id?: number
    // 结果模板名称
    name: string
    // 结果等级列表
    levels: Level[]
  }

  type HrmRecruitCandidateCleanReqVO = {
    // 候选人状态数组
    statuses: number[]
    // 状态持续天数
    days: number
  }

  type HrmRecruitCandidateEntryReqVO = {
    // 员工档案 Id
    id?: number
    // 员工姓名
    name: string
    // 工号
    jobNumber?: string
    // 系统用户 Id
    userId?: number
    // 手机号
    mobile: string
    // 国家地区
    country?: string
    // 民族
    nation?: string
    // 证件类型
    idType?: number
    // 证件号码
    idNumber?: string
    // 性别
    sex?: number
    // 邮箱
    email?: string
    // 籍贯
    nativePlace?: string
    // 出生时间
    birthday?: string
    // 年龄
    age?: number
    // 户籍地址
    address?: string
    // 最高学历
    highestEducation?: number
    // 部门 Id
    deptId?: number
    // 直属上级员工 Id
    leaderEmployeeId?: number
    // 入职状态
    entryStatus: number
    // 员工状态
    status?: number
    // 聘用形式
    type: number
    // 入职时间
    entryTime: string
    // 试用期，单位月；0 表示无试用期
    probation?: number
    // 转正时间
    regularTime?: string
    // 离职时间
    leaveTime?: string
    // 职位名称
    postName?: string
    // 岗位职级
    postLevel?: string
    // 工作城市
    workCity?: string
    // 工作地址
    workAddress?: string
    // 工作详细地址
    workDetailAddress?: string
    // 招聘渠道 Id
    channelId?: number
    // 司龄开始时间
    companyAgeStartTime?: string
    // 司龄，单位年
    companyAge?: number
    // 关联招聘候选人 Id
    candidateId?: number
    // 备注
    remark?: string
  }

  type HrmRecruitCandidatePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 姓名、手机号码或邮箱，模糊匹配
    search?: string
    // 职位编号
    postId?: number
    // 招聘负责人员工 Id
    ownerEmployeeId?: number
    // 性别
    sex?: number
    // 最小年龄
    minAge?: number
    // 最大年龄
    maxAge?: number
    // 最小工作年限
    minWorkTime?: number
    // 最大工作年限
    maxWorkTime?: number
    // 学历
    education?: number
    // 毕业院校，模糊匹配
    graduateSchool?: string
    // 最近工作单位，模糊匹配
    latestWorkPlace?: string
    // 渠道编号
    channelId?: number
    // 面试官员工 Id
    interviewEmployeeId?: number
    // 面试时间
    interviewTime?: string[]
    // 创建人用户 Id
    creator?: number
    // 候选人状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type HrmRecruitCandidateRespVO = {
    // 候选人 Id
    id?: number
    // 候选人姓名
    name?: string
    // 手机号码
    mobile?: string
    // 性别
    sex?: number
    // 年龄
    age?: number
    // 邮箱
    email?: string
    // 应聘职位 Id
    postId?: number
    // 应聘职位名称
    postName?: string
    // 应聘职位状态
    postStatus?: number
    // 用人部门 Id
    deptId?: number
    // 用人部门名称
    deptName?: string
    // 招聘负责人员工 Id
    ownerEmployeeId?: number
    // 招聘负责人姓名
    ownerEmployeeName?: string
    // 面试轮次
    stageNumber?: number
    // 工作年限
    workTime?: number
    // 学历
    education?: number
    // 毕业院校
    graduateSchool?: string
    // 最近工作单位
    latestWorkPlace?: string
    // 招聘渠道编号
    channelId?: number
    // 招聘渠道名称
    channelName?: string
    // 备注
    remark?: string
    // 候选人状态
    status?: number
    // 淘汰原因
    eliminate?: string
    // 状态更新时间
    statusUpdateTime?: string
    // 入职时间
    entryTime?: string
    // 简历附件地址数组
    resumeUrls?: string[]
    // 当前面试编号
    interviewId?: number
    // 面试方式
    interviewType?: number
    // 主面试官员工编号
    interviewEmployeeId?: number
    // 主面试官姓名
    interviewEmployeeName?: string
    // 其他面试官员工编号数组
    otherInterviewEmployeeIds?: number[]
    // 其他面试官姓名数组
    otherInterviewEmployeeNames?: string[]
    // 面试时间
    interviewTime?: string
    // 面试地址
    interviewAddress?: string
    // 面试结果
    interviewResult?: number
    // 转入的员工编号
    employeeId?: number
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime?: string
    // 更新时间
    updateTime?: string
  }

  type HrmRecruitCandidateSaveReqVO = {
    // 候选人 Id
    id?: number
    // 候选人姓名
    name: string
    // 手机号码
    mobile: string
    // 性别
    sex: number
    // 年龄
    age?: number
    // 邮箱
    email?: string
    // 应聘职位 Id
    postId: number
    // 工作年限
    workTime?: number
    // 学历
    education: number
    // 毕业院校
    graduateSchool?: string
    // 最近工作单位
    latestWorkPlace?: string
    // 招聘渠道 Id
    channelId?: number
    // 备注
    remark?: string
    // 简历附件地址数组
    resumeUrls?: string[]
  }

  type HrmRecruitCandidateUpdateChannelReqVO = {
    // 候选人 Id
    id: number
    // 招聘渠道编号
    channelId: number
  }

  type HrmRecruitCandidateUpdateEliminateReqVO = {
    // 候选人 Id
    id: number
    // 淘汰原因
    eliminate: string
    // 备注
    remark?: string
  }

  type HrmRecruitCandidateUpdatePostReqVO = {
    // 候选人 Id
    id: number
    // 职位编号
    postId: number
  }

  type HrmRecruitCandidateUpdateStatusReqVO = {
    // 候选人 Id
    id: number
    // 候选人状态
    status: number
  }

  type HrmRecruitChannelDeleteReqVO = {
    // 待删除招聘渠道编号
    id: number
    // 承接招聘渠道编号
    transferChannelId: number
  }

  type HrmRecruitChannelPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 渠道名称，模糊匹配
    name?: string
    // 状态
    status?: number
  }

  type HrmRecruitChannelRespVO = {
    // 招聘渠道编号
    id: number
    // 是否系统内置
    systemFlag: boolean
    // 状态
    status: number
    // 渠道名称
    name: string
    // 显示顺序
    sort: number
    // 备注
    remark?: string
    // 创建时间
    createTime?: string
  }

  type HrmRecruitChannelSaveReqVO = {
    // 招聘渠道编号
    id?: number
    // 渠道名称
    name: string
    // 显示顺序
    sort: number
    // 备注
    remark?: string
  }

  type HrmRecruitChannelStatusReqVO = {
    // 招聘渠道编号
    id: number
    // 状态
    status: number
  }

  type HrmRecruitEliminateReasonSaveReqVO = {
    // 淘汰原因列表
    reasons: string[]
  }

  type HrmRecruitInterviewRespVO = {
    // 面试编号
    id?: number
    // 候选人编号
    candidateId?: number
    // 面试方式
    type?: number
    // 面试轮次
    stageNumber?: number
    // 主面试官员工编号
    interviewEmployeeId?: number
    // 主面试官姓名
    interviewEmployeeName?: string
    // 其他面试官员工编号数组
    otherInterviewEmployeeIds?: number[]
    // 其他面试官姓名数组
    otherInterviewEmployeeNames?: string[]
    // 面试时间
    interviewTime?: string
    // 面试地址
    address?: string
    // 备注
    remark?: string
    // 面试结果
    result?: number
    // 评价
    evaluate?: string
    // 取消原因
    cancelReason?: string
    // 创建时间
    createTime?: string
  }

  type HrmRecruitInterviewResultReqVO = {
    // 面试编号
    id: number
    // 面试结果
    result: number
    // 评价
    evaluate?: string
    // 取消原因
    cancelReason?: string
  }

  type HrmRecruitInterviewSaveReqVO = {
    // 面试编号
    id?: number
    // 候选人编号
    candidateId: number
    // 面试方式
    type: number
    // 面试轮次
    stageNumber?: number
    // 主面试官员工编号
    interviewEmployeeId: number
    // 其他面试官员工编号数组
    otherInterviewEmployeeIds?: number[]
    // 面试时间
    interviewTime: string
    // 面试地址
    address?: string
    // 备注
    remark?: string
  }

  type HrmRecruitPostPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 职位名称，模糊匹配
    postName?: string
    // 工作性质
    jobNature?: number
    // 工作城市地区编号
    areaId?: number
    // 部门编号
    deptId?: number
    // 招聘负责人员工编号
    ownerEmployeeId?: number
    // 职位类型编号
    postTypeId?: number
    // 职位状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type HrmRecruitPostRespVO = {
    // 招聘职位编号
    id?: number
    // 职位名称
    postName?: string
    // 部门编号
    deptId?: number
    // 用人部门名称
    deptName?: string
    // 工作性质
    jobNature?: number
    // 工作城市地区编号
    areaId?: number
    // 工作城市地区名称
    areaName?: string
    // 招聘人数
    recruitNum?: number
    // 招聘原因
    reason?: string
    // 工作经验
    workTime?: number
    // 学历要求
    educationRequire?: number
    // 最低薪资
    minSalary?: number
    // 最高薪资
    maxSalary?: number
    // 薪资单位
    salaryUnit?: number
    // 最小年龄
    minAge?: number
    // 最大年龄
    maxAge?: number
    // 最迟到岗时间
    latestEntryTime?: string
    // 招聘负责人员工编号
    ownerEmployeeId?: number
    // 招聘负责人姓名
    ownerEmployeeName?: string
    // 面试官员工编号数组
    interviewEmployeeIds?: number[]
    // 面试官姓名数组
    interviewEmployeeNames?: string[]
    // 职位描述
    description?: string
    // 紧急程度
    emergencyLevel?: number
    // 职位类型编号
    postTypeId?: number
    // 职位类型名称
    postTypeName?: string
    // 职位状态
    status?: number
    // 停止原因
    stopReason?: string
    // 已入职人数
    hasEntryNum?: number
    // 招聘进度百分比
    recruitSchedule?: number
    // 创建时间
    createTime?: string
  }

  type HrmRecruitPostSaveReqVO = {
    // 招聘职位编号
    id?: number
    // 职位名称
    postName: string
    // 部门编号
    deptId?: number
    // 工作性质
    jobNature: number
    // 工作城市地区编号
    areaId?: number
    // 招聘人数
    recruitNum?: number
    // 招聘原因
    reason?: string
    // 工作经验
    workTime?: number
    // 学历要求
    educationRequire?: number
    // 最低薪资
    minSalary?: number
    // 最高薪资
    maxSalary?: number
    // 薪资单位
    salaryUnit?: number
    // 最小年龄
    minAge?: number
    // 最大年龄
    maxAge?: number
    // 最迟到岗时间
    latestEntryTime?: string
    // 负责人员工编号
    ownerEmployeeId?: number
    // 面试官员工编号数组
    interviewEmployeeIds?: number[]
    // 职位描述
    description?: string
    // 紧急程度
    emergencyLevel?: number
    // 职位类型编号
    postTypeId?: number
  }

  type HrmRecruitPostStatusReqVO = {
    // 招聘职位编号
    id: number
    // 职位状态
    status: number
    // 停止原因
    stopReason?: string
  }

  type HrmRecruitPostTypeRespVO = {
    // 职位类型编号
    id?: number
    // 类型名称
    name?: string
    // 父类型编号
    parentId?: number
    // 排序
    sort?: number
    // 状态，参见 common_status
    status?: number
    // 创建时间
    createTime?: string
  }

  type HrmRecruitStatusCountRespVO = {
    // 状态
    status?: number
    // 数量
    count?: number
  }

  type HrmSalaryChangeOptionVO = {
    // 薪资项名称
    name?: string
    // 薪资项编码
    code: number
  }

  type HrmSalaryChangeRecordRespVO = {
    // 记录编号
    id?: number
    // 员工编号
    employeeId?: number
    // 记录类型
    recordType?: number
    // 记录类型
    recordTypeName?: string
    // 调整原因
    changeReason?: number
    // 生效日期
    effectTime?: string
    // 调整前正式工资
    beforeTotal?: number
    // 调整后正式工资
    afterTotal?: number
    // 调整前试用期工资
    probationBeforeTotal?: number
    // 调整后试用期工资
    probationAfterTotal?: number
    // 状态
    status?: number
    // 备注
    remark?: string
    // 薪资项列表
    salaryOptions?: HrmSalaryOptionValueVO[]
    // 试用期薪资项列表
    probationSalaryOptions?: HrmSalaryOptionValueVO[]
    // 创建时间
    createTime?: string
  }

  type HrmSalaryChangeTemplateRespVO = {
    // 调薪模板编号
    id: number
    // 模板名称
    name: string
    // 是否默认模板
    defaultStatus: boolean
    // 调薪项配置
    options?: HrmSalaryChangeOptionVO[]
    // 创建时间
    createTime: string
  }

  type HrmSalaryChangeTemplateSaveReqVO = {
    // 调薪模板编号
    id?: number
    // 模板名称
    name: string
    // 是否默认模板
    defaultStatus: boolean
    // 调薪项配置
    options: HrmSalaryChangeOptionVO[]
  }

  type HrmSalaryConfigCreateReqVO = {
    // 计薪周期开始日
    cycleStartDay: number
    // 社保对应月份类型
    socialSecurityMonthType: number
    // 工资开始年份
    startYear: number
    // 工资开始月份
    startMonth: number
  }

  type HrmSalaryConfigRespVO = {
    // 配置编号
    id: number
    // 计薪周期开始日
    cycleStartDay: number
    // 计薪周期结束日
    cycleEndDay: number
    // 社保对应月份类型
    socialSecurityMonthType: number
    // 工资开始年份
    startYear: number
    // 工资开始月份
    startMonth: number
    // 创建时间
    createTime: string
  }

  type HrmSalaryConfigUpdateReqVO = {
    // 社保对应月份类型
    socialSecurityMonthType: number
  }

  type HrmSalaryEmployeeInfoImportRespVO = {
    // 导入成功的工号数组
    successJobNumbers: string[]
    // 导入失败的员工集合，key 为工号或行号，value 为失败原因
    failureJobNumbers: Record<string, any>
  }

  type HrmSalaryEmployeeInfoPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 员工 Id
    employeeId?: number
    // 员工 Ids
    employeeIds?: number[]
    // 调整类型
    changeType?: number
    // 员工姓名或工号
    search?: string
    // 部门编号
    deptId?: number
    // 岗位名称
    postName?: string
    // 员工状态
    status?: number
    // 入职状态
    entryStatus?: number
    // 员工状态页签
    statusCategory?: number
  }

  type HrmSalaryEmployeeInfoRespVO = {
    // 员工薪资编号
    id?: number
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 手机号
    mobile?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 岗位名称
    postName?: string
    // 入职状态
    entryStatus?: number
    // 员工状态
    status?: number
    // 入职时间
    entryTime?: string
    // 转正时间
    regularTime?: string
    // 调整原因
    changeReason?: number
    // 生效日期
    effectTime?: string
    // 薪资状态
    changeType?: number
    // 试用期工资
    probationSalary?: number
    // 正式工资
    regularSalary?: number
    // 备注
    remark?: string
    // 薪资项列表
    salaryOptions?: HrmSalaryOptionValueVO[]
    // 试用期薪资项列表
    probationSalaryOptions?: HrmSalaryOptionValueVO[]
    // 创建时间
    createTime?: string
  }

  type HrmSalaryEmployeeInfoUpdateListReqVO = {
    // 员工 Ids
    employeeIds?: number[]
    // 部门 Ids
    deptIds?: number[]
    // 调薪方式
    type: number
    // 调整原因
    changeReason: number
    // 生效日期
    effectTime: string
    // 备注
    remark?: string
    // 薪资项列表
    salaryOptions: HrmSalaryOptionValueVO[]
  }

  type HrmSalaryEmployeeInfoUpdateListRespVO = {
    // 成功员工 Ids
    successEmployeeIds?: number[]
    // 失败员工及原因
    failureEmployeeReasons?: Record<string, any>
  }

  type HrmSalaryEmployeeInfoUpdateReqVO = {
    // 定薪/调薪记录编号；编辑待生效或已取消记录时传入
    id?: number
    // 员工 Id
    employeeId: number
    // 记录类型
    recordType: number
    // 调整原因
    changeReason: number
    // 生效日期
    effectTime?: string
    // 备注
    remark?: string
    // 薪资项列表
    salaryOptions?: HrmSalaryOptionValueVO[]
    // 试用期薪资项列表
    probationSalaryOptions?: HrmSalaryOptionValueVO[]
  }

  type HrmSalaryEmployeeMonthRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 员工 Id
    employeeId: number
    // 月度工资表状态
    monthRecordStatus?: number
  }

  type HrmSalaryGroupPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 薪资组名称
    name?: string
    // 计税规则编号
    taxRuleId?: number
  }

  type HrmSalaryGroupRespVO = {
    // 薪资组编号
    id: number
    // 薪资组名称
    name: string
    // 月计薪标准
    salaryStandard?: number
    // 转正、调薪月规则
    changeRule?: string
    // 计税规则编号
    taxRuleId?: number
    // 计税规则名称
    taxRuleName?: string
    // 适用部门编号列表
    deptIds?: number[]
    // 适用部门名称列表
    deptNames?: string[]
    // 适用员工编号列表
    employeeIds?: number[]
    // 适用员工名称列表
    employeeNames?: string[]
    // 创建时间
    createTime: string
  }

  type HrmSalaryGroupSaveReqVO = {
    // 薪资组编号
    id?: number
    // 薪资组名称
    name: string
    // 计税规则编号
    taxRuleId: number
    // 适用部门编号列表
    deptIds?: number[]
    // 适用员工编号列表
    employeeIds?: number[]
  }

  type HrmSalaryMonthEmployeeRecordListReqVO = {
    // 工资表编号
    monthRecordId: number
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门 Id
    deptId?: number
    // 员工异动类型
    employeeChangeType?: number
  }

  type HrmSalaryMonthEmployeeRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 工资表编号
    monthRecordId: number
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门 Id
    deptId?: number
    // 员工异动类型
    employeeChangeType?: number
    // 员工编号列表
    employeeIds?: number[]
  }

  type HrmSalaryMonthEmployeeRecordRespVO = {
    // 编号
    id?: number
    // 工资表编号
    monthRecordId?: number
    // 员工 Id
    employeeId?: number
    // 年份
    year?: number
    // 月份
    month?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 部门编号
    deptId?: number
    // 部门
    deptName?: string
    // 职位名称
    postName?: string
    // 计薪出勤天数
    actualWorkDay?: number
    // 应出勤天数
    needWorkDay?: number
    // 应发工资
    expectedPaySalary?: number
    // 应税工资
    taxableSalary?: number
    // 个人所得税
    personalTax?: number
    // 实发工资
    realPaySalary?: number
    // 绩效系数
    performanceCoefficient?: number
    // 薪资项值列表
    optionValues?: HrmSalaryOptionValueVO[]
  }

  type HrmSalaryMonthEmployeeRecordUpdateReqVO = {
    // 员工月度工资记录编号
    id: number
    // 薪资项值列表
    optionValues?: HrmSalaryOptionValueVO[]
  }

  type HrmSalaryMonthRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 年份
    year?: number
    // 月份
    month?: number
    // 核算状态
    status?: number
  }

  type HrmSalaryMonthRecordRespVO = {
    // 编号
    id: number
    // 年份
    year: number
    // 月份
    month: number
    // 标题
    title: string
    // 开始日期
    startTime?: string
    // 结束日期
    endTime?: string
    // 员工数量
    employeeCount?: number
    // 应发工资
    expectedPaySalary?: number
    // 个人社保金额
    personalInsuranceAmount?: number
    // 个人公积金金额
    personalProvidentFundAmount?: number
    // 个人所得税
    personalTax?: number
    // 实发工资
    realPaySalary?: number
    // 公司社保金额
    corporateInsuranceAmount?: number
    // 公司公积金金额
    corporateProvidentFundAmount?: number
    // 核算状态
    status?: number
    // 薪资项表头
    optionHeaders?: HrmSalaryOptionNodeRespVO[]
    // 创建时间
    createTime?: string
  }

  type HrmSalaryOptionNodeRespVO = {
    // 薪资项编号
    id: number
    // 薪资项编码
    code: number
    // 父薪资项编码
    parentCode?: number
    // 薪资项名称
    name: string
    // 备注
    remark?: string
    // 是否系统默认项
    systemFlag: boolean
    // 薪资项类型
    type: number
    // 是否计税
    taxEnabled: boolean
    // 是否显示
    visible: boolean
    // 是否参与计算
    calculateEnabled: boolean
    // 是否启用
    enabled: boolean
    // 标准薪资项目录编号
    templateId?: number
    // 创建时间
    createTime: string
    // 子薪资项
    children?: HrmSalaryOptionNodeRespVO[]
  }

  type HrmSalaryOptionRespVO = {
    // 薪资项编号
    id: number
    // 薪资项编码
    code: number
    // 父薪资项编码
    parentCode?: number
    // 薪资项名称
    name: string
    // 备注
    remark?: string
    // 是否系统默认项
    systemFlag: boolean
    // 薪资项类型
    type: number
    // 是否计税
    taxEnabled: boolean
    // 是否显示
    visible: boolean
    // 是否参与计算
    calculateEnabled: boolean
    // 是否启用
    enabled: boolean
    // 标准薪资项目录编号
    templateId?: number
    // 创建时间
    createTime: string
  }

  type HrmSalaryOptionSaveReqVO = {
    // 父薪资项编码
    parentCode: number
    // 薪资项名称
    name: string
    // 备注
    remark?: string
  }

  type HrmSalaryOptionUpdateEnabledReqVO = {
    // 薪资项编号
    id: number
    // 是否启用
    enabled: boolean
  }

  type HrmSalaryOptionUpdateVisibleReqVO = {
    // 薪资项编号
    id: number
    // 是否显示
    visible: boolean
  }

  type HrmSalaryOptionValueVO = {
    // 编码
    code: number
    // 薪资选项值名称
    name?: string
    // 值
    value: number
  }

  type HrmSalaryPayrollReadinessRespVO = {
    // 工资表编号
    monthRecordId?: number
    // 标题
    title?: string
    // 年份
    year?: number
    // 月份
    month?: number
    // 开始日期
    startTime?: string
    // 结束日期
    endTime?: string
    // 社保年月
    socialSecurityYearMonth?: string
    // 计薪员工人数
    payrollEmployeeCount?: number
    // 已定薪员工人数
    salaryEmployeeCount?: number
    // 未定薪员工人数
    noSalaryEmployeeCount?: number
    // 未分配薪资组员工人数
    noSalaryGroupEmployeeCount?: number
    // 异动员工人数
    changeEmployeeCount?: number
    // 变更类型数量映射
    changeTypeCountMap?: Record<string, any>
    // 未定薪员工列表
    noSalaryEmployees?: Employee[]
    // 未分配薪资组员工列表
    noSalaryGroupEmployees?: Employee[]
  }

  type HrmSalaryPerformanceCoefficientReqVO = {
    // 年份
    year: number
    // 月份
    month: number
    // 员工编号列表
    employeeIds?: number[]
  }

  type HrmSalarySlipOptionRespVO = {
    // 薪资工资条选项名称
    name?: string
    // 薪资工资条选项类型
    type?: number
    // 编码
    code?: number
    // 值
    value?: number
    // 备注
    remark?: string
    // 排序
    sort?: number
    // 子工资条项
    children?: HrmSalarySlipOptionRespVO[]
  }

  type HrmSalarySlipPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 工资条记录编号
    sendRecordId?: number
    // 员工 Id
    employeeId?: number
    // 员工编号列表
    employeeIds?: number[]
    // 搜索关键字
    search?: string
    // 部门 Id
    deptId?: number
    // 已读状态
    readStatus?: number
    // 备注
    remark?: string
  }

  type HrmSalarySlipRemarkReqVO = {
    // 工资条编号
    id: number
    // 备注
    remark?: string
  }

  type HrmSalarySlipRespVO = {
    // 编号
    id?: number
    // 工资条记录编号
    sendRecordId?: number
    // 员工工资记录编号
    monthEmployeeRecordId?: number
    // 员工 Id
    employeeId?: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 手机号码
    mobile?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 岗位名称
    postName?: string
    // 年份
    year?: number
    // 月份
    month?: number
    // 已读状态
    readStatus?: number
    // 实际工资
    realPaySalary?: number
    // 备注
    remark?: string
    // 选项列表
    options?: HrmSalarySlipOptionRespVO[]
    // 创建时间
    createTime?: string
  }

  type HrmSalarySlipSendEmployeeReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 月度工资表编号
    monthRecordId: number
    // 员工姓名、工号或手机号
    search?: string
    // 部门编号
    deptId?: number
    // 是否已发送
    sent?: boolean
  }

  type HrmSalarySlipSendEmployeeRespVO = {
    // 员工月度工资记录编号
    monthEmployeeRecordId: number
    // 员工 Id
    employeeId: number
    // 员工姓名
    employeeName?: string
    // 工号
    jobNumber?: string
    // 手机号码
    mobile?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 岗位名称
    postName?: string
    // 应发工资
    expectedPaySalary?: number
    // 实发工资
    realPaySalary?: number
    // 是否已发送
    sent?: boolean
  }

  type HrmSalarySlipSendRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 年份
    year?: number
    // 月份
    month?: number
  }

  type HrmSalarySlipSendRecordRespVO = {
    // 编号
    id?: number
    // 工资表编号
    monthRecordId?: number
    // 计薪人数
    employeeCount?: number
    // 发薪人数
    sendEmployeeCount?: number
    // 已读人数
    readCount?: number
    // 年份
    year?: number
    // 月份
    month?: number
    // 创建人编号
    creator?: string
    // 创建人姓名
    creatorName?: string
    // 创建时间
    createTime?: string
  }

  type HrmSalarySlipSendReqVO = {
    // 工资表编号
    monthRecordId: number
    // 是否隐藏空值项
    hideEmpty: boolean
    // 工资条模板项列表
    options?: HrmSalarySlipTemplateOptionVO[]
    // 是否发放全部筛选结果
    all: boolean
    // 员工编号列表
    employeeIds?: number[]
    // 员工姓名、工号或手机号
    search?: string
    // 部门编号
    deptId?: number
    // 是否已发送
    sent?: boolean
  }

  type HrmSalarySlipTemplateOptionVO = {
    // 薪资工资条模板选项名称
    name: string
    // 薪资工资条模板选项类型
    type?: number
    // 编码
    code?: number
    // 备注
    remark?: string
    // 父级编码
    parentCode?: number
    // 是否隐藏
    hidden?: boolean
    // 排序
    sort?: number
  }

  type HrmSalarySlipTemplateRespVO = {
    // 编号
    id?: number
    // 模板名称
    name?: string
    // 是否隐藏空值项
    hideEmpty?: boolean
    // 是否默认选项
    defaultStatus?: boolean
    // 选项列表
    options?: HrmSalarySlipTemplateOptionVO[]
    // 创建时间
    createTime?: string
  }

  type HrmSalarySlipTemplateSaveReqVO = {
    // 编号
    id?: number
    // 模板名称
    name: string
    // 是否隐藏空值项
    hideEmpty?: boolean
    // 选项列表
    options?: HrmSalarySlipTemplateOptionVO[]
  }

  type HrmSalaryTaxRuleRespVO = {
    // 计税规则编号
    id: number
    // 计税规则名称
    name: string
    // 计税类型
    type?: number
    // 是否计税
    taxEnabled?: boolean
    // 起征阈值
    threshold?: number
    // 小数位数
    decimalScale?: number
    // 计税周期类型
    cycleType?: number
    // 使用该规则的薪资组数量
    usedGroupCount?: number
    // 创建时间
    createTime: string
  }

  type HrmSalaryTaxRuleSaveReqVO = {
    // 计税规则编号
    id?: number
    // 计税规则名称
    name: string
    // 计税类型
    type: number
    // 是否计税
    taxEnabled: boolean
    // 起征阈值
    threshold?: number
    // 小数位数
    decimalScale?: number
    // 计税周期类型
    cycleType?: number
  }

  type importChangeExcelParams = {
    // Excel 文件
    file: any
  }

  type importExcelParams = {
    // 重复员工处理策略：1 跳过，2 覆盖，3 判失败
    duplicateStrategy?: number
    // Excel 文件
    file: any
  }

  type importFixExcelParams = {
    // Excel 文件
    file: any
  }

  type Level = {
    // 等级名称
    name: string
    // 最低分数
    minScore: number
    // 最高分数
    maxScore: number
    // 绩效系数
    coefficient: number
  }

  type LocalTime = {
    hour?: number
    minute?: number
    second?: number
    nano?: number
  }

  type openPerformancePlanScoringParams = {
    // 绩效计划 Id
    id: number
  }

  type OverviewItem = {
    // 打卡类型
    type?: string
    // 打卡时间
    time?: string
    // 打卡状态
    status?: string
    // 考勤结果
    text?: string
  }

  type PageResultHrmAttendanceClockRespVO = {
    // 数据
    list: HrmAttendanceClockRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmAttendanceGroupRespVO = {
    // 数据
    list: HrmAttendanceGroupRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmAttendanceHolidayRespVO = {
    // 数据
    list: HrmAttendanceHolidayRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmAttendanceLeaveRespVO = {
    // 数据
    list: HrmAttendanceLeaveRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmAttendanceMonthDailyOverviewRespVO = {
    // 数据
    list: HrmAttendanceMonthDailyOverviewRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmAttendanceMonthRecordRespVO = {
    // 数据
    list: HrmAttendanceMonthRecordRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmEmployeeRespVO = {
    // 数据
    list: HrmEmployeeRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmInsuranceMonthEmployeeRecordRespVO = {
    // 数据
    list: HrmInsuranceMonthEmployeeRecordRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmOperateLogRespVO = {
    // 数据
    list: HrmOperateLogRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmPerformanceArchiveEmployeeRespVO = {
    // 数据
    list: HrmPerformanceArchiveEmployeeRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmPerformanceAssessmentRespVO = {
    // 数据
    list: HrmPerformanceAssessmentRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmPerformanceAssessmentTemplateRespVO = {
    // 数据
    list: HrmPerformanceAssessmentTemplateRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmPerformancePlanRespVO = {
    // 数据
    list: HrmPerformancePlanRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmPerformanceResultTemplateRespVO = {
    // 数据
    list: HrmPerformanceResultTemplateRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmRecruitCandidateRespVO = {
    // 数据
    list: HrmRecruitCandidateRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmRecruitChannelRespVO = {
    // 数据
    list: HrmRecruitChannelRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmRecruitPostRespVO = {
    // 数据
    list: HrmRecruitPostRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmSalaryEmployeeInfoRespVO = {
    // 数据
    list: HrmSalaryEmployeeInfoRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmSalaryGroupRespVO = {
    // 数据
    list: HrmSalaryGroupRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmSalaryMonthEmployeeRecordRespVO = {
    // 数据
    list: HrmSalaryMonthEmployeeRecordRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmSalaryMonthRecordRespVO = {
    // 数据
    list: HrmSalaryMonthRecordRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmSalarySlipRespVO = {
    // 数据
    list: HrmSalarySlipRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmSalarySlipSendEmployeeRespVO = {
    // 数据
    list: HrmSalarySlipSendEmployeeRespVO[]
    // 总量
    total: number
  }

  type PageResultHrmSalarySlipSendRecordRespVO = {
    // 数据
    list: HrmSalarySlipSendRecordRespVO[]
    // 总量
    total: number
  }

  type Point = {
    // 地点名称
    name: string
    // 定位地址
    address: string
    // 纬度
    latitude: number
    // 经度
    longitude: number
    // 有效打卡半径，单位：米
    radius: number
  }

  type Quota = {
    // 指标名称
    name: string
    // 指标说明
    illustrate?: string
    // 评分标准
    standard: string
    // 指标权重
    weight: number
    // 评分类型
    scoreType: number
  }

  type ResultConfig = {
    // 模板名称
    name: string
    // 结果等级配置
    levels: Level[]
  }

  type ReviewStage = {
    // 评分阶段名称
    name: string
    rater: HandlerStage
    // 评分权重
    weight: number
    // 评分方式
    scoringType: number
    // 评分内容可见范围
    visibleContent: number
    // 评语是否必填
    requiredSetting: boolean
    // 是否允许驳回
    rejectAuthority: boolean
  }

  type Scope = {
    // 范围类型
    type: number
    // 员工 Ids
    employeeIds?: number[]
    // 部门 Ids
    deptIds?: number[]
    // 聘用形式
    employeeType?: number
    // 员工状态列表
    employeeStatuses?: number[]
  }

  type sendEmployeeProfileFillMessageParams = {
    // 员工 Ids
    ids: number[]
  }

  type Shift = {
    // 工作日数组
    weeks: number[]
    startTime: LocalTime
    endTime: LocalTime
    clockInStartTime: LocalTime
    clockInEndTime: LocalTime
    clockOutStartTime: LocalTime
    clockOutEndTime: LocalTime
    restStartTime: LocalTime
    restEndTime: LocalTime
    // 休息时间是否不计入工作时长
    excludeRestTime: boolean
  }

  type SortingField = {
    field?: string
    order?: string
  }

  type SpecialDate = {
    // 日期类型
    type: number
    // 特殊日期
    date: string
  }

  type startPerformancePlanInterviewParams = {
    // 绩效计划 Id
    id: number
  }

  type startPerformancePlanParams = {
    // 绩效计划 Id
    id: number
  }

  type terminatePerformancePlanParams = {
    // 绩效计划 Id
    id: number
  }

  type Wifi = {
    // WiFi 名称
    ssid: string
    // MAC 地址
    mac: string
  }
}
