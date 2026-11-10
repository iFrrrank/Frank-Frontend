declare namespace API {

  type AssistBalance = {
    // 期初金额
    openingAmount?: number
    // 期初数量
    openingQuantity?: number
    // 本年累计借方金额
    yearDebitAmount?: number
    // 本年累计借方数量
    yearDebitQuantity?: number
    // 本年累计贷方金额
    yearCreditAmount?: number
    // 本年累计贷方数量
    yearCreditQuantity?: number
    // 年初金额
    yearOpeningAmount?: number
    // 年初数量
    yearOpeningQuantity?: number
    // 实际损益发生额
    profitLossAmount?: number
    // 实际损益发生数量
    profitLossQuantity?: number
    // 辅助核算项目编号数组
    auxiliaryItemIds: number[]
  }

  type AuxiliaryConfig = {
    // 辅助核算类别 Id
    auxiliaryTypeId: number
    // 辅助核算类型
    type: number
    // 辅助核算类别名称
    name: string
  }

  type AuxiliaryItem = {
    // 辅助核算类别 Id
    typeId: number
    // 辅助核算项目编号
    itemId: number
  }

  type AuxiliaryMapping = {
    // 辅助核算类别 Id
    typeId: number
    // 辅助核算项目编号
    itemId: number
  }

  type Balance = {
    // 期初金额
    openingAmount?: number
    // 期初数量
    openingQuantity?: number
    // 本年累计借方金额
    yearDebitAmount?: number
    // 本年累计借方数量
    yearDebitQuantity?: number
    // 本年累计贷方金额
    yearCreditAmount?: number
    // 本年累计贷方数量
    yearCreditQuantity?: number
    // 年初金额
    yearOpeningAmount?: number
    // 年初数量
    yearOpeningQuantity?: number
    // 实际损益发生额
    profitLossAmount?: number
    // 实际损益发生数量
    profitLossQuantity?: number
    // 科目 Id
    subjectId: number
    // 辅助核算余额数组
    assistBalances?: AssistBalance[]
  }

  type Column = {
    // 科目 Id
    subjectId?: number
    // 科目编码
    subjectCode?: string
    // 科目名称
    subjectName?: string
    // 余额方向
    balanceDirection?: number
  }

  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultFmsAccountSetRespVO = {
    code?: number
    data?: FmsAccountSetRespVO
    msg?: string
  }

  type CommonResultFmsAuxiliaryItemImportRespVO = {
    code?: number
    data?: FmsAuxiliaryItemImportRespVO
    msg?: string
  }

  type CommonResultFmsAuxiliaryItemRespVO = {
    code?: number
    data?: FmsAuxiliaryItemRespVO
    msg?: string
  }

  type CommonResultFmsBalanceSheetCheckRespVO = {
    code?: number
    data?: FmsBalanceSheetCheckRespVO
    msg?: string
  }

  type CommonResultFmsCashFlowCheckRespVO = {
    code?: number
    data?: FmsCashFlowCheckRespVO
    msg?: string
  }

  type CommonResultFmsClosingOverviewRespVO = {
    code?: number
    data?: FmsClosingOverviewRespVO
    msg?: string
  }

  type CommonResultFmsFinanceIndicatorRespVO = {
    code?: number
    data?: FmsFinanceIndicatorRespVO
    msg?: string
  }

  type CommonResultFmsFinanceParameterRespVO = {
    code?: number
    data?: FmsFinanceParameterRespVO
    msg?: string
  }

  type CommonResultFmsHomeMetricDetailRespVO = {
    code?: number
    data?: FmsHomeMetricDetailRespVO
    msg?: string
  }

  type CommonResultFmsHomeRespVO = {
    code?: number
    data?: FmsHomeRespVO
    msg?: string
  }

  type CommonResultFmsIncomeStatementCheckRespVO = {
    code?: number
    data?: FmsIncomeStatementCheckRespVO
    msg?: string
  }

  type CommonResultFmsLedgerMultiColumnRespVO = {
    code?: number
    data?: FmsLedgerMultiColumnRespVO
    msg?: string
  }

  type CommonResultFmsSubjectImportRespVO = {
    code?: number
    data?: FmsSubjectImportRespVO
    msg?: string
  }

  type CommonResultFmsSubjectRespVO = {
    code?: number
    data?: FmsSubjectRespVO
    msg?: string
  }

  type CommonResultFmsSubjectUsageRespVO = {
    code?: number
    data?: FmsSubjectUsageRespVO
    msg?: string
  }

  type CommonResultFmsTrialBalanceRespVO = {
    code?: number
    data?: FmsTrialBalanceRespVO
    msg?: string
  }

  type CommonResultFmsVoucherImportRespVO = {
    code?: number
    data?: FmsVoucherImportRespVO
    msg?: string
  }

  type CommonResultFmsVoucherRespVO = {
    code?: number
    data?: FmsVoucherRespVO
    msg?: string
  }

  type CommonResultFmsVoucherSubjectBalanceRespVO = {
    code?: number
    data?: FmsVoucherSubjectBalanceRespVO
    msg?: string
  }

  type CommonResultInteger = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultListFmsAccountSetRespVO = {
    code?: number
    data?: FmsAccountSetRespVO[]
    msg?: string
  }

  type CommonResultListFmsAccountUserRespVO = {
    code?: number
    data?: FmsAccountUserRespVO[]
    msg?: string
  }

  type CommonResultListFmsAuxiliaryItemRespVO = {
    code?: number
    data?: FmsAuxiliaryItemRespVO[]
    msg?: string
  }

  type CommonResultListFmsAuxiliaryTypeRespVO = {
    code?: number
    data?: FmsAuxiliaryTypeRespVO[]
    msg?: string
  }

  type CommonResultListFmsBalanceSheetRowRespVO = {
    code?: number
    data?: FmsBalanceSheetRowRespVO[]
    msg?: string
  }

  type CommonResultListFmsCashFlowAdjustmentRespVO = {
    code?: number
    data?: FmsCashFlowAdjustmentRespVO[]
    msg?: string
  }

  type CommonResultListFmsClosingSchemeRespVO = {
    code?: number
    data?: FmsClosingSchemeRespVO[]
    msg?: string
  }

  type CommonResultListFmsClosingTemplateRespVO = {
    code?: number
    data?: FmsClosingTemplateRespVO[]
    msg?: string
  }

  type CommonResultListFmsCurrencyRespVO = {
    code?: number
    data?: FmsCurrencyRespVO[]
    msg?: string
  }

  type CommonResultListFmsDigestRespVO = {
    code?: number
    data?: FmsDigestRespVO[]
    msg?: string
  }

  type CommonResultListFmsFinanceIndicatorRespVO = {
    code?: number
    data?: FmsFinanceIndicatorRespVO[]
    msg?: string
  }

  type CommonResultListFmsInitialBalanceRespVO = {
    code?: number
    data?: FmsInitialBalanceRespVO[]
    msg?: string
  }

  type CommonResultListFmsLedgerAuxiliaryBalanceRespVO = {
    code?: number
    data?: FmsLedgerAuxiliaryBalanceRespVO[]
    msg?: string
  }

  type CommonResultListFmsLedgerAuxiliaryDetailRespVO = {
    code?: number
    data?: FmsLedgerAuxiliaryDetailRespVO[]
    msg?: string
  }

  type CommonResultListFmsLedgerDetailRespVO = {
    code?: number
    data?: FmsLedgerDetailRespVO[]
    msg?: string
  }

  type CommonResultListFmsLedgerGeneralRespVO = {
    code?: number
    data?: FmsLedgerGeneralRespVO[]
    msg?: string
  }

  type CommonResultListFmsLedgerQuantityDetailRespVO = {
    code?: number
    data?: FmsLedgerQuantityDetailRespVO[]
    msg?: string
  }

  type CommonResultListFmsLedgerQuantityGeneralRespVO = {
    code?: number
    data?: FmsLedgerQuantityGeneralRespVO[]
    msg?: string
  }

  type CommonResultListFmsLedgerSubjectBalanceRespVO = {
    code?: number
    data?: FmsLedgerSubjectBalanceRespVO[]
    msg?: string
  }

  type CommonResultListFmsReportItemRespVO = {
    code?: number
    data?: FmsReportItemRespVO[]
    msg?: string
  }

  type CommonResultListFmsSubjectRespVO = {
    code?: number
    data?: FmsSubjectRespVO[]
    msg?: string
  }

  type CommonResultListFmsVoucherRespVO = {
    code?: number
    data?: FmsVoucherRespVO[]
    msg?: string
  }

  type CommonResultListFmsVoucherStatisticsRespVO = {
    code?: number
    data?: FmsVoucherStatisticsRespVO[]
    msg?: string
  }

  type CommonResultListFmsVoucherSubjectBalanceRespVO = {
    code?: number
    data?: FmsVoucherSubjectBalanceRespVO[]
    msg?: string
  }

  type CommonResultListFmsVoucherTemplateCategoryRespVO = {
    code?: number
    data?: FmsVoucherTemplateCategoryRespVO[]
    msg?: string
  }

  type CommonResultListFmsVoucherTemplateRespVO = {
    code?: number
    data?: FmsVoucherTemplateRespVO[]
    msg?: string
  }

  type CommonResultListFmsVoucherWordRespVO = {
    code?: number
    data?: FmsVoucherWordRespVO[]
    msg?: string
  }

  type CommonResultListLong = {
    code?: number
    data?: number[]
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultPageResultFmsAuxiliaryItemRespVO = {
    code?: number
    data?: PageResultFmsAuxiliaryItemRespVO
    msg?: string
  }

  type CommonResultPageResultFmsVoucherRespVO = {
    code?: number
    data?: PageResultFmsVoucherRespVO
    msg?: string
  }

  type CommonResultString = {
    code?: number
    data?: string
    msg?: string
  }

  type Entry = {
    // 分录编号
    id: number
    // 摘要内容
    digest: string
    // 科目 Id
    subjectId: number
    // 科目编码
    subjectCode: string
    // 科目名称
    subjectName: string
    // 数量
    quantity?: number
    // 单价
    unitPrice?: number
    // 借方金额
    debitAmount: number
    // 贷方金额
    creditAmount: number
    // 显示顺序
    sort: number
    // 辅助核算组合编号
    assistCombinationId?: number
    // 辅助核算项目数组
    auxiliaries?: AuxiliaryItem[]
  }

  type FindByIdsQueryPayload = {
    ids?: string[]
    uniqueField?: string
    targetFields?: string[]
  }

  type FmsAccountSetGetAccountSetParams = {
    // 账套 Id
    id: number
  }

  type FmsAccountSetInitializeReqVO = {
    // 账套 Id
    accountSetId: number
    // 本位币编码
    currencyCode: string
    // 启用期间
    startTime: string
    // 会计制度
    standard: number
    // 科目层级
    level: number
    // 科目编码规则
    subjectCodeRule: string
    // 账簿余额方向模式
    ledgerBalanceMode: number
  }

  type FmsAccountSetRespVO = {
    // 账套 Id
    id: number
    // 公司编码
    companyCode: string
    // 公司名称
    companyName: string
    // 公司简介
    companyProfile?: string
    // 所在行业
    industry?: string
    // 所在地
    location?: string
    // 法人代表
    legalRepresentative?: string
    // 法人身份证号
    legalRepresentativeIdNumber?: string
    // 营业执照号
    businessLicenseNumber?: string
    // 组织机构代码
    organizationCode?: string
    // 备注
    remark?: string
    // 联系人
    contactName?: string
    // 办公电话
    officeTelephone?: string
    // 手机号码
    mobile?: string
    // 传真号码
    faxNumber?: string
    // QQ 号码
    qqNumber?: string
    // 邮箱
    email?: string
    // 其他联系方式
    otherContact?: string
    // 详细地址
    address?: string
    // 币种编号
    currencyId?: number
    // 启用期间
    startTime?: string
    // 会计制度
    standard?: number
    // 是否已初始化
    initialized: boolean
    // 创建时间
    createTime: string
    // 是否默认账套
    defaultStatus: boolean
    // 是否账套创建人
    founder: boolean
    // 当前用户的成员权限级别
    level: number
  }

  type FmsAccountSetSaveReqVO = {
    // 账套 Id
    id?: number
    // 公司编码
    companyCode: string
    // 公司名称
    companyName: string
    // 公司简介
    companyProfile?: string
    // 所在行业
    industry?: string
    // 所在地
    location?: string
    // 法人代表
    legalRepresentative?: string
    // 法人身份证号
    legalRepresentativeIdNumber?: string
    // 营业执照号
    businessLicenseNumber?: string
    // 组织机构代码
    organizationCode?: string
    // 备注
    remark?: string
    // 联系人
    contactName?: string
    // 办公电话
    officeTelephone?: string
    // 手机号码
    mobile?: string
    // 传真号码
    faxNumber?: string
    // QQ 号码
    qqNumber?: string
    // 邮箱
    email?: string
    // 其他联系方式
    otherContact?: string
    // 详细地址
    address?: string
  }

  type FmsAccountUserGetAccountUserListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsAccountUserRespVO = {
    // 后台用户 Id
    userId: number
    // 用户昵称
    nickname?: string
    // 部门名称
    deptName?: string
    // 手机号码
    mobile?: string
    // 用户邮箱
    email?: string
    // 用户状态
    status?: number
    // 是否默认账套
    defaultStatus: boolean
    // 是否账套创建人
    founder: boolean
    // 成员权限级别
    level: number
  }

  type FmsAccountUserUpdateAccountSetDefaultStatusParams = {
    accountSetId: number
  }

  type FmsAccountUserUpdateReqVO = {
    // 账套 Id
    accountSetId: number
    // 账套成员数组
    members: Member[]
  }

  type FmsAuxiliaryItemDeleteAuxiliaryItemListParams = {
    // 账套 Id
    accountSetId: number
    // 辅助核算项目 Ids
    ids: number[]
  }

  type FmsAuxiliaryItemExportAuxiliaryItemExcelParams = {
    // 账套 Id
    accountSetId: string
    // 辅助核算类别 Id
    auxiliaryTypeId: string
    // 关键词，匹配编码或名称
    search?: string
    // 页码，从 1 开始
    pageNo: string
    // 每页条数，最大值为 100
    pageSize: string
  }

  type FmsAuxiliaryItemGetAuxiliaryItemImportTemplateParams = {
    // 辅助核算类别类型
    type: number
  }

  type FmsAuxiliaryItemGetAuxiliaryItemPageParams = {
    // 账套 Id
    accountSetId: string
    // 辅助核算类别 Id
    auxiliaryTypeId: string
    // 关键词，匹配编码或名称
    search?: string
    // 页码，从 1 开始
    pageNo: string
    // 每页条数，最大值为 100
    pageSize: string
  }

  type FmsAuxiliaryItemGetAuxiliaryItemParams = {
    // 账套 Id
    accountSetId: number
    // 辅助核算项目 Id
    id: number
  }

  type FmsAuxiliaryItemGetAuxiliaryItemSimpleListParams = {
    // 账套 Id
    accountSetId: number
    // 辅助核算类别 Id
    auxiliaryTypeId: number
  }

  type FmsAuxiliaryItemImportAuxiliaryItemParams = {
    // 账套 Id
    accountSetId: number
    // 辅助核算类别 Id
    auxiliaryTypeId: number
    // Excel 文件
    file: any
  }

  type FmsAuxiliaryItemImportRespVO = {
    // 总数量
    totalCount: number
    // 成功编码数组
    successItemCodes: string[]
    // 失败原因 Map
    failureReasons: Record<string, any>
  }

  type FmsAuxiliaryItemRespVO = {
    // 编号
    id: number
    // 账套 Id
    accountSetId: number
    // 辅助核算类别 Id
    auxiliaryTypeId: number
    // 编码
    code: string
    // 名称
    name: string
    // 备注
    remark?: string
    // 规格
    specification?: string
    // 单位
    unit?: string
    // 状态
    status: number
    // 创建时间
    createTime: string
  }

  type FmsAuxiliaryItemSaveReqVO = {
    // 编号
    id?: number
    // 账套 Id
    accountSetId: number
    // 辅助核算类别 Id
    auxiliaryTypeId: number
    // 编码
    code: string
    // 名称
    name: string
    // 备注
    remark?: string
    // 规格
    specification?: string
    // 单位
    unit?: string
  }

  type FmsAuxiliaryItemStatusReqVO = {
    // 账套 Id
    accountSetId: number
    // 编号
    id: number
    // 状态
    status: number
  }

  type FmsAuxiliaryTypeDeleteAuxiliaryTypeParams = {
    // 账套 Id
    accountSetId: number
    // 辅助核算类别 Id
    id: number
  }

  type FmsAuxiliaryTypeGetAuxiliaryTypeListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsAuxiliaryTypeGetAuxiliaryTypeSimpleListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsAuxiliaryTypeRespVO = {
    // 编号
    id: number
    // 名称
    name: string
    // 是否系统预置
    systemPreset: boolean
    // 账套 Id
    accountSetId: number
    // 类型
    type: number
  }

  type FmsAuxiliaryTypeSaveReqVO = {
    // 编号
    id?: number
    // 账套 Id
    accountSetId: number
    // 名称
    name: string
  }

  type FmsBalanceSheetCheckBalanceSheetParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsBalanceSheetCheckRespVO = {
    // 报表是否平衡
    balanced?: boolean
    // 初始余额是否平衡
    initialBalanceBalanced?: boolean
    // 损益是否已结转
    profitLossTransferred?: boolean
    // 年初余额差额
    openingDifferenceAmount?: number
    // 期末余额差额
    closingDifferenceAmount?: number
    // 未纳入报表公式的科目
    unmappedSubjects?: UnmappedSubject[]
  }

  type FmsBalanceSheetExportBalanceSheetParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsBalanceSheetGetBalanceSheetParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsBalanceSheetRowRespVO = {
    // 行编号
    rowId?: number
    // 资产项目配置编号
    assetId?: number
    // 资产项目名称
    assetName?: string
    // 资产项目行次
    assetRowNo?: number
    // 资产项目期末余额
    assetClosingAmount?: number
    // 资产项目年初余额
    assetOpeningAmount?: number
    // 资产项目层级
    assetLevel?: number
    // 资产项目是否可编辑
    assetEditable?: boolean
    // 资产项目公式
    assetFormula?: string
    // 负债和所有者权益项目配置编号
    liabilityId?: number
    // 负债和所有者权益项目名称
    liabilityName?: string
    // 负债和所有者权益项目行次
    liabilityRowNo?: number
    // 负债和所有者权益项目期末余额
    liabilityClosingAmount?: number
    // 负债和所有者权益项目年初余额
    liabilityOpeningAmount?: number
    // 负债和所有者权益项目层级
    liabilityLevel?: number
    // 负债和所有者权益项目是否可编辑
    liabilityEditable?: boolean
    // 负债和所有者权益项目公式
    liabilityFormula?: string
  }

  type FmsCashFlowAdjustmentRespVO = {
    // 数据编号
    id?: number
    // 项目名称
    name?: string
    // 行次
    rowNo?: number
    // 公式
    formula?: string
    // 说明
    remark?: string
    // 是否可编辑
    editable?: boolean
    // 本期金额
    currentAmount?: number
    // 本年累计金额
    yearAmount?: number
    // 层级
    level?: number
  }

  type FmsCashFlowAdjustmentUpdateReqVO = {
    // 账套 Id
    accountSetId: number
    // 辅助数据项
    items: Item[]
  }

  type FmsCashFlowCheckRespVO = {
    // 报表是否平衡
    balanced?: boolean
    // 初始余额是否平衡
    initialBalanceBalanced?: boolean
    // 损益是否已结转
    profitLossTransferred?: boolean
    // 年初余额差额
    openingDifferenceAmount?: number
    // 期末余额差额
    closingDifferenceAmount?: number
    // 未纳入报表公式的科目
    unmappedSubjects?: UnmappedSubject[]
    // 资产负债表是否满足现金流量表取数条件
    balanceSheetReady?: boolean
  }

  type FmsCashFlowStatementCheckCashFlowStatementParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsCashFlowStatementExportCashFlowStatementParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsCashFlowStatementGetCashFlowAdjustmentListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsCashFlowStatementGetCashFlowStatementParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsCashFlowStatementUpdateReqVO = {
    // 账套 Id
    accountSetId: number
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 现金流量表项目
    items: Item[]
  }

  type FmsClosingOverviewRespVO = {
    // 会计期间
    month?: string
    // 是否已结账
    closed?: boolean
    // 是否要求凭证审核
    voucherReviewRequired?: boolean
    // 未审核凭证数量
    pendingVoucherCount?: number
    // 凭证数量
    voucherCount?: number
    // 损益类科目余额
    profitLossBalance?: number
    // 资产负债表差额
    balanceSheetDifference?: number
    // 结转损益凭证 Id
    profitLossVoucherId?: number
    // 初始余额是否试算平衡
    initialBalanceBalanced?: boolean
    // 凭证 Id是否连续
    voucherNumberContinuous?: boolean
    // 需要结转损益时是否已生成凭证
    profitLossVoucherGenerated?: boolean
    // 利润表勾稽是否平衡
    incomeStatementBalanced?: boolean
    // 利润表未纳入公式的科目数量
    incomeStatementUnmappedSubjectCount?: number
    // 资产负债表损益是否已结转
    balanceSheetProfitLossTransferred?: boolean
    // 资产负债表是否平衡
    balanceSheetBalanced?: boolean
    // 资产负债表未纳入公式的科目数量
    balanceSheetUnmappedSubjectCount?: number
    // 是否满足全部结账条件
    canClose?: boolean
  }

  type FmsClosingPeriodCancelClosePeriodParams = {
    // 账套 Id
    accountSetId: string
    // 目标会计期间
    month: string
  }

  type FmsClosingPeriodGetClosingOverviewParams = {
    // 账套 Id
    accountSetId: string
    // 目标会计期间
    month: string
  }

  type FmsClosingPeriodGetCurrentMonthParams = {
    accountSetId: number
  }

  type FmsClosingQueryReqVO = {
    // 账套 Id
    accountSetId: number
    // 目标会计期间
    month: string
  }

  type FmsClosingSchemeDeleteClosingSchemeParams = {
    accountSetId: number
    id: number
  }

  type FmsClosingSchemeGenerateReqVO = {
    // 账套 Id
    accountSetId: number
    // 方案编号
    id: number
    // 会计期间
    month: string
  }

  type FmsClosingSchemeGetClosingSchemeListParams = {
    // 账套 Id
    accountSetId: string
    // 目标会计期间
    month: string
  }

  type FmsClosingSchemeRespVO = {
    // 方案编号
    id?: number
    // 账套 Id
    accountSetId?: number
    // 方案名称
    name?: string
    // 是否期末结转
    periodEnd?: boolean
    // 来源科目 Id
    subjectId?: number
    // 取数规则
    formulaRule?: number
    // 取数时间类型
    timeType?: number
    // 凭证字编号
    voucherWordId?: number
    // 凭证摘要
    digest?: string
    // 结转凭证类型
    voucherType?: number
    // 以前年度损益调整科目 Id
    priorYearAdjustmentSubjectId?: number
    // 以前年度损益调整结转科目 Id
    adjustmentClosingSubjectId?: number
    // 其他损益结转科目 Id
    otherClosingSubjectId?: number
    // 是否按余额反向结转
    reverseBalance?: boolean
    // 结转日期
    closingDay?: number
    // 类型
    type?: number
    // 结转科目规则数组
    subjects?: SubjectRule[]
    // 待结转金额
    balance?: number
    // 当前期间已生成凭证 Id数组
    voucherIds?: number[]
  }

  type FmsClosingSchemeSaveReqVO = {
    // 方案编号
    id?: number
    // 账套 Id
    accountSetId: number
    // 方案名称
    name: string
    // 是否期末结转
    periodEnd: boolean
    // 来源科目 Id
    subjectId: number
    // 取数规则
    formulaRule: number
    // 取数时间类型
    timeType: number
    // 凭证字编号
    voucherWordId: number
    // 结转科目规则数组
    subjects: SubjectRule[]
  }

  type FmsClosingTemplateDeleteClosingTemplateParams = {
    // 账套 Id
    accountSetId: number
    // 结账模板 Id
    id: number
  }

  type FmsClosingTemplateGetClosingTemplateListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsClosingTemplateRespVO = {
    // 模板 Id
    id: number
    // 账套 Id
    accountSetId: number
    // 系统预置编码
    presetCode?: string
    // 模板名称
    name: string
    // 模板分类
    category: number
    // 是否期末结转
    periodEnd: boolean
    // 来源科目 Id
    subjectId?: number
    // 取数规则
    formulaRule?: number
    // 取数时间类型
    timeType?: number
    // 结转科目规则数组
    subjects: SubjectRule[]
    // 显示顺序
    sort: number
    // 创建时间
    createTime: string
  }

  type FmsClosingTemplateSaveReqVO = {
    // 模板 Id
    id?: number
    // 账套 Id
    accountSetId: number
    // 模板名称
    name: string
    // 模板分类
    category: number
    // 是否期末结转
    periodEnd: boolean
    // 来源科目 Id
    subjectId?: number
    // 取数规则
    formulaRule?: number
    // 取数时间类型
    timeType?: number
    // 结转科目规则数组
    subjects: SubjectRule[]
    // 显示顺序
    sort: number
  }

  type FmsClosingVoucherGenerateReqVO = {
    // 账套 Id
    accountSetId: number
    // 方案编号数组
    ids: number[]
    // 会计期间
    month: string
  }

  type FmsCurrencyDeleteCurrencyParams = {
    // 账套 Id
    accountSetId: number
    // 币别 Id
    id: number
  }

  type FmsCurrencyGetCurrencyListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsCurrencyGetCurrencySimpleListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsCurrencyRespVO = {
    // 币别 Id
    id: number
    // 账套 Id
    accountSetId: number
    // 币别编码
    code: string
    // 币别名称
    name: string
    // 汇率
    exchangeRate: number
    // 是否本位币
    standard: boolean
    // 创建时间
    createTime: string
  }

  type FmsCurrencySaveReqVO = {
    // 币别 Id
    id?: number
    // 账套 Id
    accountSetId: number
    // 币别编码
    code: string
    // 币别名称
    name: string
    // 汇率
    exchangeRate: number
  }

  type FmsDigestDeleteDigestParams = {
    accountSetId: number
    // 常用摘要Id
    id: number
  }

  type FmsDigestGetDigestListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsDigestGetDigestSimpleListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsDigestRespVO = {
    // 常用摘要编号
    id: number
    // 账套 Id
    accountSetId: number
    // 摘要内容
    content: string
    // 创建时间
    createTime: string
  }

  type FmsDigestSaveReqVO = {
    // 常用摘要编号
    id?: number
    // 账套 Id
    accountSetId: number
    // 摘要内容
    content: string
  }

  type FmsFinanceIndicatorDeleteParams = {
    // 账套 Id
    accountSetId: number
    // 指标Id
    id: number
  }

  type FmsFinanceIndicatorGetListParams = {
    accountSetId: number
  }

  type FmsFinanceIndicatorGetParams = {
    // 账套 Id
    accountSetId: number
    // 指标Id
    id: number
  }

  type FmsFinanceIndicatorRespVO = {
    // 指标编号
    id?: number
    // 账套 Id
    accountSetId?: number
    // 指标名称
    name?: string
    // 指标编码
    code?: string
    // 取数报表类型
    type?: number
    // 指标公式
    formula?: string
    // 展示顺序
    sort?: number
    // 状态
    status: number
    // 创建时间
    createTime?: string
  }

  type FmsFinanceIndicatorSaveReqVO = {
    // 指标编号
    id?: number
    // 账套 Id
    accountSetId: number
    // 指标名称
    name: string
    // 指标编码
    code: string
    // 取数报表类型
    type: number
    // 指标公式，支持 L1+L2 或科目公式 JSON
    formula: string
    // 展示顺序
    sort: number
    // 状态
    status: number
  }

  type FmsFinanceParameterGetFinanceParameterParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsFinanceParameterRespVO = {
    // 账套 Id
    accountSetId: number
    // 科目层级
    level: number
    // 科目编码规则
    subjectCodeRule: string
    // 账簿余额方向模式
    ledgerBalanceMode: number
    // 结账前是否要求凭证审核
    voucherReviewRequired: boolean
  }

  type FmsFinanceParameterUpdateReqVO = {
    // 账套 Id
    accountSetId: number
    // 会计制度
    standard: number
    // 科目层级
    level: number
    // 科目编码规则
    subjectCodeRule: string
    // 账簿余额方向模式
    ledgerBalanceMode: number
    // 结账前是否要求凭证审核
    voucherReviewRequired: boolean
  }

  type FmsHomeGetHomeParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsHomeGetMetricDetailParams = {
    // 账套 Id
    accountSetId: number
    // 财务指标标识
    metricKey: string
  }

  type FmsHomeMetricDetailRespVO = {
    // 指标标识
    key: string
    // 指标名称
    name: string
    // 财务指标趋势数组
    trends: Trend[]
    // 当期科目构成数组
    structure: Structure[]
  }

  type FmsHomeRespVO = {
    // 当前会计期间
    currentMonth: string
    // 当期财务指标数组
    metrics: Metric[]
    // 财务指标趋势数组
    trends: Trend[]
  }

  type FmsIncomeStatementCheckIncomeStatementParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsIncomeStatementCheckRespVO = {
    // 净利润与未分配利润变动是否一致
    balanced?: boolean
    // 利润表与资产负债表勾稽差额
    differenceAmount?: number
    // 未纳入报表公式的科目
    unmappedSubjects?: UnmappedSubject[]
  }

  type FmsIncomeStatementExportIncomeStatementParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsIncomeStatementGetIncomeStatementParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
  }

  type FmsInitialBalanceExportInitialBalanceParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsInitialBalanceGetInitialBalanceImportTemplateParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsInitialBalanceGetInitialBalanceListParams = {
    // 账套 Id
    accountSetId: number
    // 科目类型
    subjectType: number
  }

  type FmsInitialBalanceGetTrialBalanceParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsInitialBalanceImportInitialBalanceParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsInitialBalanceRespVO = {
    // 初始余额编号
    id?: number
    // 科目 Id
    subjectId: number
    // 科目编码
    subjectCode: string
    // 科目名称
    subjectName: string
    // 上级科目 Id
    parentId?: number
    // 科目类型
    type: number
    // 余额方向
    balanceDirection: number
    // 是否启用数量核算
    quantityAccounting: boolean
    // 数量单位
    quantityUnit?: string
    // 是否启用辅助核算
    auxiliaryAccounting: boolean
    // 期初金额
    openingAmount: number
    // 期初数量
    openingQuantity: number
    // 本年累计借方金额
    yearDebitAmount: number
    // 本年累计借方数量
    yearDebitQuantity: number
    // 本年累计贷方金额
    yearCreditAmount: number
    // 本年累计贷方数量
    yearCreditQuantity: number
    // 年初金额
    yearOpeningAmount: number
    // 年初数量
    yearOpeningQuantity: number
    // 实际损益发生额
    profitLossAmount: number
    // 实际损益发生数量
    profitLossQuantity: number
    // 辅助核算配置数组
    auxiliaryConfigs?: AuxiliaryConfig[]
    // 辅助核算余额数组
    assistBalances?: AssistBalance[]
  }

  type FmsInitialBalanceSaveReqVO = {
    // 账套 Id
    accountSetId: number
    // 科目余额数组
    balances: Balance[]
  }

  type FmsLedgerAuxiliaryBalanceRespVO = {
    // 辅助核算项目编号
    auxiliaryItemId: number
    // 编码
    code: string
    // 项目名称
    name: string
    // 期初借方余额
    openingDebitAmount: number
    // 期初贷方余额
    openingCreditAmount: number
    // 本期借方发生额
    periodDebitAmount: number
    // 本期贷方发生额
    periodCreditAmount: number
    // 本年累计借方发生额
    yearDebitAmount: number
    // 本年累计贷方发生额
    yearCreditAmount: number
    // 期末借方余额
    endingDebitAmount: number
    // 期末贷方余额
    endingCreditAmount: number
  }

  type FmsLedgerAuxiliaryDetailRespVO = {
    // 行类型
    rowType?: number
    // 分录编号
    entryId?: number
    // 科目 Id
    subjectId?: number
    // 科目编码
    subjectCode?: string
    // 科目名称
    subjectName?: string
    // 会计期间
    period?: string
    // 日期
    accountDate?: string
    // 凭证 Id
    voucherId?: number
    // 凭证字号
    voucherNumber?: string
    // 摘要
    digest?: string
    // 借方金额
    debitAmount?: number
    // 贷方金额
    creditAmount?: number
    // 余额方向
    balanceDirection?: string
    // 余额
    balance?: number
  }

  type FmsLedgerDetailRespVO = {
    // 行类型
    rowType?: number
    // 分录编号
    entryId?: number
    // 分录科目 Id
    entrySubjectId?: number
    // 科目 Id
    subjectId?: number
    // 科目编码
    subjectCode?: string
    // 科目名称
    subjectName?: string
    // 会计期间
    period?: string
    // 日期
    accountDate?: string
    // 凭证 Id
    voucherId?: number
    // 凭证字号
    voucherNumber?: string
    // 摘要
    digest?: string
    // 借方金额
    debitAmount?: number
    // 贷方金额
    creditAmount?: number
    // 余额方向
    balanceDirection?: string
    // 余额
    balance?: number
    // 借方数量
    debitQuantity?: number
    // 贷方数量
    creditQuantity?: number
    // 结存数量
    balanceQuantity?: number
    // 单价
    unitPrice?: number
    // 计量单位
    quantityUnit?: string
    // 多栏账科目金额
    columnAmounts?: Record<string, any>
  }

  type FmsLedgerExportAuxiliaryBalanceParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 辅助核算类别 Id
    auxiliaryTypeId: string
    // 科目 Id
    subjectId?: string
    // 辅助核算项目编号
    auxiliaryItemId?: string
  }

  type FmsLedgerExportAuxiliaryDetailParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 辅助核算类别 Id
    auxiliaryTypeId: string
    // 科目 Id
    subjectId?: string
    // 辅助核算项目编号
    auxiliaryItemId?: string
  }

  type FmsLedgerExportDetailParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerExportGeneralParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerExportMultiColumnParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerExportQuantityDetailParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerExportQuantityGeneralParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerExportSubjectBalanceParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerGeneralRespVO = {
    // 行类型
    rowType?: number
    // 科目 Id
    subjectId?: number
    // 科目编码
    subjectCode?: string
    // 科目名称
    subjectName?: string
    // 会计期间
    period?: string
    // 摘要
    digest?: string
    // 借方金额
    debitAmount?: number
    // 贷方金额
    creditAmount?: number
    // 余额方向
    balanceDirection?: string
    // 余额
    balance?: number
  }

  type FmsLedgerGetAuxiliaryBalanceListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 辅助核算类别 Id
    auxiliaryTypeId: string
    // 科目 Id
    subjectId?: string
    // 辅助核算项目编号
    auxiliaryItemId?: string
  }

  type FmsLedgerGetAuxiliaryDetailListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 辅助核算类别 Id
    auxiliaryTypeId: string
    // 科目 Id
    subjectId?: string
    // 辅助核算项目编号
    auxiliaryItemId?: string
  }

  type FmsLedgerGetDetailListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerGetDetailSubjectListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerGetGeneralListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerGetMultiColumnParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerGetQuantityDetailListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerGetQuantityGeneralListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerGetSubjectBalanceListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 科目 Id
    subjectId?: string
    // 起始科目 Id
    startSubjectId?: string
    // 结束科目 Id
    endSubjectId?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsLedgerMultiColumnRespVO = {
    // 动态科目列
    columns?: Column[]
    // 账簿行
    rows?: FmsLedgerDetailRespVO[]
  }

  type FmsLedgerQuantityDetailRespVO = {
    // 行类型
    rowType?: number
    // 分录编号
    entryId?: number
    // 科目 Id
    subjectId?: number
    // 科目编码
    subjectCode?: string
    // 科目名称
    subjectName?: string
    // 会计期间
    period?: string
    // 日期
    accountDate?: string
    // 凭证 Id
    voucherId?: number
    // 凭证字号
    voucherNumber?: string
    // 摘要
    digest?: string
    // 借方金额
    debitAmount?: number
    // 贷方金额
    creditAmount?: number
    // 余额方向
    balanceDirection?: string
    // 余额
    balance?: number
    // 借方数量
    debitQuantity?: number
    // 贷方数量
    creditQuantity?: number
    // 结存数量
    balanceQuantity?: number
    // 单价
    unitPrice?: number
    openingUnitPrice?: number
    periodUnitPrice?: number
    yearUnitPrice?: number
    endingUnitPrice?: number
    // 计量单位
    quantityUnit?: string
  }

  type FmsLedgerQuantityGeneralRespVO = {
    // 科目 Id
    subjectId?: number
    // 科目编码
    subjectCode?: string
    // 科目名称
    subjectName?: string
    // 科目级次
    level?: number
    // 是否启用数量核算
    quantityAccounting?: boolean
    // 计量单位
    quantityUnit?: string
    // 期初余额方向
    openingBalanceDirection?: string
    // 期初数量
    openingQuantity?: number
    // 期初单价
    openingUnitPrice?: number
    // 期初借方余额
    openingDebitAmount?: number
    // 期初贷方余额
    openingCreditAmount?: number
    openingAmount?: number
    // 本期借方数量
    periodDebitQuantity?: number
    // 本期借方发生额
    periodDebitAmount?: number
    // 本期贷方数量
    periodCreditQuantity?: number
    // 本期贷方发生额
    periodCreditAmount?: number
    // 本年累计借方数量
    yearDebitQuantity?: number
    // 本年累计借方发生额
    yearDebitAmount?: number
    // 本年累计贷方数量
    yearCreditQuantity?: number
    // 本年累计贷方发生额
    yearCreditAmount?: number
    // 期末余额方向
    endingBalanceDirection?: string
    // 期末数量
    endingQuantity?: number
    // 期末单价
    endingUnitPrice?: number
    // 期末借方余额
    endingDebitAmount?: number
    // 期末贷方余额
    endingCreditAmount?: number
    endingAmount?: number
    // 下级科目
    children?: FmsLedgerQuantityGeneralRespVO[]
  }

  type FmsLedgerSubjectBalanceRespVO = {
    // 节点唯一键
    nodeKey?: string
    // 节点类型
    nodeType?: number
    // 科目 Id
    subjectId?: number
    // 辅助核算组合编号
    assistCombinationId?: number
    // 科目编码
    subjectCode?: string
    // 科目名称
    subjectName?: string
    // 科目级次
    level?: number
    // 是否启用数量核算
    quantityAccounting?: boolean
    // 计量单位
    quantityUnit?: string
    // 期初借方余额
    openingDebitAmount?: number
    // 期初贷方余额
    openingCreditAmount?: number
    // 期初余额方向
    openingBalanceDirection?: string
    // 期初数量
    openingQuantity?: number
    // 期初单价
    openingUnitPrice?: number
    // 本期借方发生额
    periodDebitAmount?: number
    // 本期贷方发生额
    periodCreditAmount?: number
    // 本期借方数量
    periodDebitQuantity?: number
    // 本期贷方数量
    periodCreditQuantity?: number
    // 本年累计借方发生额
    yearDebitAmount?: number
    // 本年累计贷方发生额
    yearCreditAmount?: number
    // 本年累计借方数量
    yearDebitQuantity?: number
    // 本年累计贷方数量
    yearCreditQuantity?: number
    // 期末借方余额
    endingDebitAmount?: number
    // 期末贷方余额
    endingCreditAmount?: number
    // 期末余额方向
    endingBalanceDirection?: string
    // 期末数量
    endingQuantity?: number
    // 期末单价
    endingUnitPrice?: number
    // 下级科目
    children?: FmsLedgerSubjectBalanceRespVO[]
  }

  type FmsProfitLossGenerateReqVO = {
    // 账套 Id
    accountSetId: number
    // 会计期间
    month: string
  }

  type FmsProfitLossSettingsSaveReqVO = {
    // 账套 Id
    accountSetId: number
    // 凭证字编号
    voucherWordId: number
    // 凭证摘要
    digest: string
    // 结转凭证类型
    voucherType: number
    // 以前年度损益调整科目 Id
    priorYearAdjustmentSubjectId: number
    // 以前年度损益调整结转科目 Id
    adjustmentClosingSubjectId: number
    // 其他损益结转科目 Id
    otherClosingSubjectId: number
    // 是否按余额反向结转
    reverseBalance: boolean
    // 结转日期
    closingDay: number
  }

  type FmsReportFormulaUpdateReqVO = {
    // 账套 Id
    accountSetId: number
    // 配置编号
    id: number
    // 公式项数组
    formulas: Formula[]
  }

  type FmsReportItemRespVO = {
    // 配置编号
    id?: number
    // 项目名称
    name?: string
    // 行次
    rowNo?: number
    // 层级
    level?: number
    // 是否可编辑
    editable?: boolean
    // 公式
    formula?: string
    // 期初金额
    openingAmount?: number
    // 期末金额
    closingAmount?: number
    // 本年累计金额
    yearAmount?: number
    // 本期金额
    currentAmount?: number
  }

  type FmsSpecialClosingSettingsSaveReqVO = {
    // 方案编号
    id: number
    // 账套 Id
    accountSetId: number
    // 凭证字编号
    voucherWordId: number
    // 结转科目规则数组
    subjects: SubjectRule[]
  }

  type FmsSubjectDeleteReqVO = {
    // 账套 Id
    accountSetId: number
    // 科目 Id数组
    ids: number[]
  }

  type FmsSubjectExportSubjectParams = {
    // 账套 Id
    accountSetId: string
    // 科目类型
    type?: string
  }

  type FmsSubjectGetSubjectListParams = {
    // 账套 Id
    accountSetId: string
    // 科目类型
    type?: string
  }

  type FmsSubjectGetSubjectParams = {
    // 账套 Id
    accountSetId: number
    // 科目 Id
    id: number
  }

  type FmsSubjectGetSubjectSimpleListParams = {
    // 账套 Id
    accountSetId: string
    // 科目类型
    type?: string
  }

  type FmsSubjectGetSubjectUsageParams = {
    // 账套 Id
    accountSetId: number
    // 科目 Id
    id: number
  }

  type FmsSubjectImportRespVO = {
    // 总数量
    totalCount: number
    // 成功科目编码数组
    successSubjectCodes: string[]
    // 失败原因 Map
    failureReasons: Record<string, any>
  }

  type FmsSubjectImportSubjectParams = {
    // 账套 Id
    accountSetId: number
    // Excel 文件
    file: any
  }

  type FmsSubjectRespVO = {
    // 科目 Id
    id: number
    // 账套 Id
    accountSetId: number
    // 科目编码
    code: string
    // 科目名称
    name: string
    // 上级科目 Id
    parentId?: number
    // 科目类型
    type: number
    // 科目类别
    category: number
    // 余额方向
    balanceDirection: number
    // 辅助核算类别 Id数组
    auxiliaryTypeIds?: number[]
    // 外币核算币别 Id数组
    currencyIds?: number[]
    // 是否启用数量核算
    quantityAccounting: boolean
    // 数量单位
    quantityUnit?: string
    // 是否现金及现金等价物
    cash: boolean
    // 状态
    status: number
    // 层级
    level: number
    // 辅助核算类别名称数组
    auxiliaryTypeNames?: string[]
    // 创建时间
    createTime: string
  }

  type FmsSubjectSaveReqVO = {
    // 科目 Id
    id?: number
    // 账套 Id
    accountSetId: number
    // 科目编码
    code: string
    // 科目名称
    name: string
    // 上级科目 Id
    parentId: number
    // 科目类型
    type: number
    // 科目类别
    category: number
    // 余额方向
    balanceDirection: number
    // 辅助核算类别 Id数组
    auxiliaryTypeIds: number[]
    // 外币核算币别 Id数组
    currencyIds: number[]
    // 是否启用数量核算
    quantityAccounting: boolean
    // 数量单位
    quantityUnit?: string
    // 是否现金及现金等价物
    cash: boolean
    // 是否迁移上级科目历史数据
    migrateParentData?: boolean
    // 辅助核算历史数据迁移项目数组
    auxiliaryMappings?: AuxiliaryMapping[]
    quantityUnitValid?: boolean
    categoryValid?: boolean
  }

  type FmsSubjectStatusReqVO = {
    // 账套 Id
    accountSetId: number
    // 科目 Id数组
    ids: number[]
    // 状态
    status: number
  }

  type FmsSubjectUsageRespVO = {
    // 下级科目数量
    childCount: number
    // 凭证分录数量
    voucherEntryCount: number
    // 初始余额数量
    initialBalanceCount: number
    // 辅助核算组合数量
    auxiliaryCombinationCount: number
    // 包含数量数据的记录数量
    quantityDataCount: number
    // 是否已被业务使用
    used: boolean
  }

  type FmsTrialBalanceRespVO = {
    // 期初借方金额
    openingDebitAmount: number
    // 期初贷方金额
    openingCreditAmount: number
    // 期初差额
    openingDifferenceAmount: number
    // 本年累计借方金额
    yearDebitAmount: number
    // 本年累计贷方金额
    yearCreditAmount: number
    // 本年累计差额
    yearDifferenceAmount: number
    // 是否平衡
    balanced: boolean
  }

  type FmsVoucherAttachmentUpdateReqVO = {
    // 凭证 Id
    id: number
    // 账套 Id
    accountSetId: number
    // 附件地址数组
    attachmentUrls?: string[]
  }

  type FmsVoucherDeleteVoucherListParams = {
    accountSetId: number
    ids: number[]
  }

  type FmsVoucherEntrySaveReqVO = {
    // 凭证分录编号
    id?: number
    // 摘要内容
    digest: string
    // 科目 Id
    subjectId: number
    // 数量
    quantity?: number
    // 单价
    unitPrice?: number
    // 借方金额
    debitAmount?: number
    // 贷方金额
    creditAmount?: number
    // 辅助核算项目数组
    auxiliaries?: AuxiliaryItem[]
  }

  type FmsVoucherExportVoucherExcelParams = {
    // 账套 Id
    accountSetId: string
    // 凭证 Id数组
    ids?: string
    // 凭证日期范围
    voucherTime?: string
    // 凭证字编号
    voucherWordId?: string
    // 凭证号
    voucherNumber?: string
    // 摘要关键词
    digest?: string
    // 科目 Id
    subjectId?: string
    // 最小金额
    minAmount?: string
    // 最大金额
    maxAmount?: string
    // 制单人后台用户 Id
    creatorUserId?: string
    // 审核状态
    status?: string
    // 页码，从 1 开始
    pageNo: string
    // 每页条数，最大值为 100
    pageSize: string
  }

  type FmsVoucherExportVoucherStatisticsExcelParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 凭证字编号
    voucherWordId?: string
    // 最小凭证号
    minVoucherNumber?: string
    // 最大凭证号
    maxVoucherNumber?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsVoucherGetNextVoucherNumberParams = {
    // 账套 Id
    accountSetId: number
    // 凭证字 Id
    voucherWordId: number
    // 凭证日期
    voucherTime: string
  }

  type FmsVoucherGetVoucherAuxiliaryBalanceParams = {
    accountSetId: number
    month: string
    subjectId: number
    auxiliaryItemIds: number[]
  }

  type FmsVoucherGetVoucherImportTemplateParams = {
    accountSetId: number
  }

  type FmsVoucherGetVoucherPageParams = {
    // 账套 Id
    accountSetId: string
    // 凭证 Id数组
    ids?: string
    // 凭证日期范围
    voucherTime?: string
    // 凭证字编号
    voucherWordId?: string
    // 凭证号
    voucherNumber?: string
    // 摘要关键词
    digest?: string
    // 科目 Id
    subjectId?: string
    // 最小金额
    minAmount?: string
    // 最大金额
    maxAmount?: string
    // 制单人后台用户 Id
    creatorUserId?: string
    // 审核状态
    status?: string
    // 页码，从 1 开始
    pageNo: string
    // 每页条数，最大值为 100
    pageSize: string
  }

  type FmsVoucherGetVoucherParams = {
    accountSetId: number
    id: number
  }

  type FmsVoucherGetVoucherPrintListParams = {
    // 账套 Id
    accountSetId: string
    // 凭证 Id数组
    ids?: string
    // 凭证日期范围
    voucherTime?: string
    // 凭证字编号
    voucherWordId?: string
    // 凭证号
    voucherNumber?: string
    // 摘要关键词
    digest?: string
    // 科目 Id
    subjectId?: string
    // 最小金额
    minAmount?: string
    // 最大金额
    maxAmount?: string
    // 制单人后台用户 Id
    creatorUserId?: string
    // 审核状态
    status?: string
    // 页码，从 1 开始
    pageNo: string
    // 每页条数，最大值为 100
    pageSize: string
  }

  type FmsVoucherGetVoucherStatisticsListParams = {
    // 账套 Id
    accountSetId: string
    // 开始会计期间
    startMonth: string
    // 结束会计期间
    endMonth: string
    // 凭证字编号
    voucherWordId?: string
    // 最小凭证号
    minVoucherNumber?: string
    // 最大凭证号
    maxVoucherNumber?: string
    // 最小科目级次
    minLevel?: string
    // 最大科目级次
    maxLevel?: string
  }

  type FmsVoucherGetVoucherSubjectBalanceListParams = {
    accountSetId: number
    month: string
  }

  type FmsVoucherImportRespVO = {
    // 总分录数
    totalRowCount: number
    // 成功分录数
    successRowCount: number
    // 失败分录数
    failureRowCount: number
    // 总凭证数
    totalVoucherCount: number
    // 成功凭证数
    successVoucherCount: number
    // 失败凭证数
    failureVoucherCount: number
    // 错误数据文件地址
    errorFileUrl?: string
  }

  type FmsVoucherImportVoucherParams = {
    // 账套 Id
    accountSetId: number
    // Excel 文件
    file: any
  }

  type FmsVoucherMoveReqVO = {
    // 账套 Id
    accountSetId: number
    // 凭证月份
    month: string
    // 凭证字编号
    voucherWordId: number
    // 原凭证号
    sourceNumber: number
    // 移动到的凭证号
    targetNumber: number
  }

  type FmsVoucherRespVO = {
    // 凭证 Id
    id: number
    // 账套 Id
    accountSetId: number
    // 凭证字编号
    voucherWordId: number
    // 凭证字
    voucherWordName: string
    // 凭证号
    voucherNumber: number
    // 凭证日期
    voucherTime: string
    // 附件地址数组
    attachmentUrls?: string[]
    // 附件数
    attachmentCount: number
    // 借方金额
    debitAmount: number
    // 贷方金额
    creditAmount: number
    // 合计金额
    total: number
    // 审核状态
    status: number
    // 是否为结账生成凭证
    closingGenerated: boolean
    // 制单人后台用户 Id
    creatorUserId?: number
    // 制单人名称
    creatorUserName?: string
    // 审核人后台用户 Id
    reviewerUserId?: number
    // 审核人名称
    reviewerUserName?: string
    // 创建时间
    createTime: string
    // 凭证分录数组
    entries: Entry[]
  }

  type FmsVoucherReviewReqVO = {
    // 账套 Id
    accountSetId: number
    // 凭证 Id数组
    ids: number[]
    // 审核状态
    status: number
  }

  type FmsVoucherSaveReqVO = {
    // 凭证 Id
    id?: number
    // 账套 Id
    accountSetId: number
    // 凭证字编号
    voucherWordId: number
    // 凭证号
    voucherNumber: number
    // 凭证日期
    voucherTime: string
    // 附单据张数
    attachmentCount: number
    // 凭证分录数组
    entries: FmsVoucherEntrySaveReqVO[]
  }

  type FmsVoucherStatisticsRespVO = {
    // 科目 Id
    subjectId: number
    // 科目编码
    subjectCode: string
    // 科目名称
    subjectName: string
    // 科目级次
    level: number
    // 借方金额
    debitAmount: number
    // 贷方金额
    creditAmount: number
  }

  type FmsVoucherSubjectBalanceRespVO = {
    // 科目 Id
    subjectId: number
    // 余额方向
    balanceDirection?: string
    // 余额
    balance: number
  }

  type FmsVoucherTemplateCategoryDeleteTemplateCategoryParams = {
    accountSetId: number
    id: number
  }

  type FmsVoucherTemplateCategoryGetTemplateCategoryListParams = {
    accountSetId: number
  }

  type FmsVoucherTemplateCategoryGetTemplateCategorySimpleListParams = {
    accountSetId: number
  }

  type FmsVoucherTemplateCategoryRespVO = {
    // 分类编号
    id: number
    // 账套 Id
    accountSetId: number
    // 分类名称
    name: string
  }

  type FmsVoucherTemplateCategorySaveReqVO = {
    // 分类编号
    id?: number
    // 账套 Id
    accountSetId: number
    // 分类名称
    name: string
  }

  type FmsVoucherTemplateDeleteVoucherTemplateParams = {
    accountSetId: number
    id: number
  }

  type FmsVoucherTemplateEntryVO = {
    // 摘要内容
    digest: string
    // 科目 Id
    subjectId: number
    // 数量
    quantity?: number
    // 单价
    unitPrice?: number
    // 借方金额
    debitAmount?: number
    // 贷方金额
    creditAmount?: number
    // 辅助核算项目数组
    auxiliaries?: AuxiliaryItem[]
  }

  type FmsVoucherTemplateGetVoucherTemplateListParams = {
    accountSetId: number
  }

  type FmsVoucherTemplateGetVoucherTemplateSimpleListParams = {
    accountSetId: number
  }

  type FmsVoucherTemplateRespVO = {
    // 模板 Id
    id: number
    // 账套 Id
    accountSetId: number
    // 模板名称
    name: string
    // 分类编号
    categoryId: number
    // 分类名称
    categoryName: string
    // 凭证模板分录数组
    entries: FmsVoucherTemplateEntryVO[]
  }

  type FmsVoucherTemplateSaveReqVO = {
    // 模板 Id
    id?: number
    // 账套 Id
    accountSetId: number
    // 模板名称
    name: string
    // 分类编号
    categoryId: number
    // 凭证模板分录数组
    entries: FmsVoucherTemplateEntryVO[]
  }

  type FmsVoucherTidyReqVO = {
    // 账套 Id
    accountSetId: number
    // 整理月份
    month: string
    // 凭证字编号，为空时整理全部凭证字
    voucherWordId?: number
    // 起始编号
    startNumber: number
    // 整理方式
    type: number
  }

  type FmsVoucherWordDeleteVoucherWordParams = {
    accountSetId: number
    // 凭证字 Id
    id: number
  }

  type FmsVoucherWordGetVoucherWordListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsVoucherWordGetVoucherWordSimpleListParams = {
    // 账套 Id
    accountSetId: number
  }

  type FmsVoucherWordRespVO = {
    // 凭证字编号
    id: number
    // 凭证字
    name: string
    // 打印标题
    printTitle?: string
    // 是否默认凭证字
    defaultStatus: boolean
    // 显示顺序
    sort: number
    // 账套 Id
    accountSetId: number
    // 创建时间
    createTime: string
  }

  type FmsVoucherWordSaveReqVO = {
    // 凭证字编号
    id?: number
    // 账套 Id
    accountSetId: number
    // 凭证字
    name: string
    // 打印标题
    printTitle?: string
    // 是否默认凭证字
    defaultStatus: boolean
  }

  type Formula = {
    // 科目 Id
    subjectId: number
    // 运算符
    operator: string
    // 取数规则
    rules: number
  }

  type Item = {
    // 报表项目编号
    id: number
    // 本期金额
    currentAmount: number
    // 本年累计金额
    yearAmount: number
  }

  type Member = {
    // 后台用户 Id
    userId: number
    // 成员权限级别
    level: number
  }

  type Metric = {
    // 指标标识
    key: string
    // 指标名称
    name: string
    // 指标金额
    amount: number
  }

  type PageResultFmsAuxiliaryItemRespVO = {
    // 数据
    list: FmsAuxiliaryItemRespVO[]
    // 总量
    total: number
  }

  type PageResultFmsVoucherRespVO = {
    // 数据
    list: FmsVoucherRespVO[]
    // 总量
    total: number
  }

  type Structure = {
    // 科目 Id
    subjectId: number
    // 科目编码
    subjectCode: string
    // 科目名称
    subjectName: string
    // 科目金额
    amount: number
  }

  type SubjectRule = {
    // 科目 Id
    subjectId: number
    // 摘要
    digest: string
    // 借贷方向
    direction: number
    // 金额比例
    amountRatio: number
  }

  type TransProxyFindByIdParams = {
    targetClass: string
    id: string
    uniqueField: string
    targetFields: string
  }

  type TransProxyFindByIdsParams = {
    targetClass: string
  }

  type Trend = {
    // 会计期间
    month: string
    // 指标金额
    amount: number
  }

  type UnmappedSubject = {
    // 科目 Id
    id: number
    // 科目编码
    code: string
    // 科目名称
    name: string
  }

}
