declare namespace API {
  type AdminUserRespDTO = {
    // 用户 ID
    id: number
    // 用户昵称
    nickname: string
    // 帐号状态，参见 CommonStatusEnum 枚举
    status: number
    // 部门 Id
    deptId: number
    // 岗位编号数组
    postIds: number[]
    // 手机号码
    mobile: string
    // 用户头像
    avatar: string
    transMap?: Record<string, any>
  }

  type BusinessProduct = {
    // 产品 Id
    productId: number
    // 产品单价
    productPrice: number
    // 商机价格
    businessPrice: number
    // 产品数量
    count: number
  }

  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultCrmBusinessRespVO = {
    code?: number
    data?: CrmBusinessRespVO
    msg?: string
  }

  type CommonResultCrmBusinessStatusRespVO = {
    code?: number
    data?: CrmBusinessStatusRespVO
    msg?: string
  }

  type CommonResultCrmClueRespVO = {
    code?: number
    data?: CrmClueRespVO
    msg?: string
  }

  type CommonResultCrmContactRespVO = {
    code?: number
    data?: CrmContactRespVO
    msg?: string
  }

  type CommonResultCrmContractConfigRespVO = {
    code?: number
    data?: CrmContractConfigRespVO
    msg?: string
  }

  type CommonResultCrmContractRespVO = {
    code?: number
    data?: CrmContractRespVO
    msg?: string
  }

  type CommonResultCrmCustomerImportRespVO = {
    code?: number
    data?: CrmCustomerImportRespVO
    msg?: string
  }

  type CommonResultCrmCustomerLimitConfigRespVO = {
    code?: number
    data?: CrmCustomerLimitConfigRespVO
    msg?: string
  }

  type CommonResultCrmCustomerPoolConfigRespVO = {
    code?: number
    data?: CrmCustomerPoolConfigRespVO
    msg?: string
  }

  type CommonResultCrmCustomerRespVO = {
    code?: number
    data?: CrmCustomerRespVO
    msg?: string
  }

  type CommonResultCrmFollowUpRecordRespVO = {
    code?: number
    data?: CrmFollowUpRecordRespVO
    msg?: string
  }

  type CommonResultCrmProductCategoryRespVO = {
    code?: number
    data?: CrmProductCategoryRespVO
    msg?: string
  }

  type CommonResultCrmProductRespVO = {
    code?: number
    data?: CrmProductRespVO
    msg?: string
  }

  type CommonResultCrmReceivablePlanRespVO = {
    code?: number
    data?: CrmReceivablePlanRespVO
    msg?: string
  }

  type CommonResultCrmReceivableRespVO = {
    code?: number
    data?: CrmReceivableRespVO
    msg?: string
  }

  type CommonResultCrmStatisticFunnelSummaryRespVO = {
    code?: number
    data?: CrmStatisticFunnelSummaryRespVO
    msg?: string
  }

  type CommonResultListCrmBusinessRespVO = {
    code?: number
    data?: CrmBusinessRespVO[]
    msg?: string
  }

  type CommonResultListCrmBusinessStatusRespVO = {
    code?: number
    data?: CrmBusinessStatusRespVO[]
    msg?: string
  }

  type CommonResultListCrmContactRespVO = {
    code?: number
    data?: CrmContactRespVO[]
    msg?: string
  }

  type CommonResultListCrmContractRespVO = {
    code?: number
    data?: CrmContractRespVO[]
    msg?: string
  }

  type CommonResultListCrmCustomerRespVO = {
    code?: number
    data?: CrmCustomerRespVO[]
    msg?: string
  }

  type CommonResultListCrmPermissionRespVO = {
    code?: number
    data?: CrmPermissionRespVO[]
    msg?: string
  }

  type CommonResultListCrmProductCategoryRespVO = {
    code?: number
    data?: CrmProductCategoryRespVO[]
    msg?: string
  }

  type CommonResultListCrmProductRespVO = {
    code?: number
    data?: CrmProductRespVO[]
    msg?: string
  }

  type CommonResultListCrmReceivablePlanRespVO = {
    code?: number
    data?: CrmReceivablePlanRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticCustomerAreaRespVO = {
    code?: number
    data?: CrmStatisticCustomerAreaRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticCustomerIndustryRespVO = {
    code?: number
    data?: CrmStatisticCustomerIndustryRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticCustomerLevelRespVO = {
    code?: number
    data?: CrmStatisticCustomerLevelRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticCustomerSourceRespVO = {
    code?: number
    data?: CrmStatisticCustomerSourceRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsBusinessInversionRateSummaryByDateRespVO = {
    code?: number
    data?: CrmStatisticsBusinessInversionRateSummaryByDateRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsBusinessSummaryByDateRespVO = {
    code?: number
    data?: CrmStatisticsBusinessSummaryByDateRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsBusinessSummaryByEndStatusRespVO = {
    code?: number
    data?: CrmStatisticsBusinessSummaryByEndStatusRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsCustomerContractSummaryRespVO = {
    code?: number
    data?: CrmStatisticsCustomerContractSummaryRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsCustomerDealCycleByAreaRespVO = {
    code?: number
    data?: CrmStatisticsCustomerDealCycleByAreaRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsCustomerDealCycleByDateRespVO = {
    code?: number
    data?: CrmStatisticsCustomerDealCycleByDateRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsCustomerDealCycleByProductRespVO = {
    code?: number
    data?: CrmStatisticsCustomerDealCycleByProductRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsCustomerDealCycleByUserRespVO = {
    code?: number
    data?: CrmStatisticsCustomerDealCycleByUserRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsCustomerSummaryByDateRespVO = {
    code?: number
    data?: CrmStatisticsCustomerSummaryByDateRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsCustomerSummaryByUserRespVO = {
    code?: number
    data?: CrmStatisticsCustomerSummaryByUserRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsFollowUpSummaryByDateRespVO = {
    code?: number
    data?: CrmStatisticsFollowUpSummaryByDateRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsFollowUpSummaryByTypeRespVO = {
    code?: number
    data?: CrmStatisticsFollowUpSummaryByTypeRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsFollowUpSummaryByUserRespVO = {
    code?: number
    data?: CrmStatisticsFollowUpSummaryByUserRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsPerformanceRespVO = {
    code?: number
    data?: CrmStatisticsPerformanceRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsPoolSummaryByDateRespVO = {
    code?: number
    data?: CrmStatisticsPoolSummaryByDateRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsPoolSummaryByUserRespVO = {
    code?: number
    data?: CrmStatisticsPoolSummaryByUserRespVO[]
    msg?: string
  }

  type CommonResultListCrmStatisticsRankRespVO = {
    code?: number
    data?: CrmStatisticsRankRespVO[]
    msg?: string
  }

  type CommonResultListStatus = {
    code?: number
    data?: Status[]
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultPageResultCrmBusinessRespVO = {
    code?: number
    data?: PageResultCrmBusinessRespVO
    msg?: string
  }

  type CommonResultPageResultCrmBusinessStatusRespVO = {
    code?: number
    data?: PageResultCrmBusinessStatusRespVO
    msg?: string
  }

  type CommonResultPageResultCrmClueRespVO = {
    code?: number
    data?: PageResultCrmClueRespVO
    msg?: string
  }

  type CommonResultPageResultCrmContactRespVO = {
    code?: number
    data?: PageResultCrmContactRespVO
    msg?: string
  }

  type CommonResultPageResultCrmContractRespVO = {
    code?: number
    data?: PageResultCrmContractRespVO
    msg?: string
  }

  type CommonResultPageResultCrmCustomerLimitConfigRespVO = {
    code?: number
    data?: PageResultCrmCustomerLimitConfigRespVO
    msg?: string
  }

  type CommonResultPageResultCrmCustomerRespVO = {
    code?: number
    data?: PageResultCrmCustomerRespVO
    msg?: string
  }

  type CommonResultPageResultCrmFollowUpRecordRespVO = {
    code?: number
    data?: PageResultCrmFollowUpRecordRespVO
    msg?: string
  }

  type CommonResultPageResultCrmOperateLogRespVO = {
    code?: number
    data?: PageResultCrmOperateLogRespVO
    msg?: string
  }

  type CommonResultPageResultCrmProductRespVO = {
    code?: number
    data?: PageResultCrmProductRespVO
    msg?: string
  }

  type CommonResultPageResultCrmReceivablePlanRespVO = {
    code?: number
    data?: PageResultCrmReceivablePlanRespVO
    msg?: string
  }

  type CommonResultPageResultCrmReceivableRespVO = {
    code?: number
    data?: PageResultCrmReceivableRespVO
    msg?: string
  }

  type CrmBusinessPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 商机名称
    name?: string
    // 客户 Id
    customerId?: number
    // 联系人 Id
    contactId?: number
    // 场景类型，为 null 时则表示全部
    sceneType?: number
  }

  type CrmBusinessRespVO = {
    // 商机 Id
    id: number
    // 商机名称
    name: string
    // 客户 Id
    customerId: number
    // 客户名称
    customerName: string
    // 跟进状态
    followUpStatus: boolean
    // 最后跟进时间
    contactLastTime?: string
    // 下次联系时间
    contactNextTime?: string
    // 负责人的用户 Id
    ownerUserId?: number
    // 负责人名字
    ownerUserName?: string
    // 负责人部门
    ownerUserDeptName?: string
    // 商机状态组 Id
    statusTypeId: number
    // 商机状组名字
    statusTypeName: string
    // 商机状态 Id
    statusId: number
    // 状态名称
    statusName: string
    endStatus?: number
    endRemark?: string
    // 预计成交日期
    dealTime?: string
    // 产品总金额
    totalProductPrice?: number
    // 整单折扣
    discountPercent?: number
    // 商机总金额
    totalPrice?: number
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名字
    creatorName?: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
    // 产品列表
    products?: Product[]
  }

  type CrmBusinessSaveReqVO = {
    // 商机 Id
    id: number
    // 商机名称
    name: string
    // 客户 Id
    customerId: number
    // 下次联系时间
    contactNextTime?: string
    // 负责人用户 Id
    ownerUserId: number
    // 商机状态组 Id
    statusTypeId: number
    // 预计成交日期
    dealTime?: string
    // 整单折扣
    discountPercent: number
    // 备注
    remark?: string
    // 联系人 Id
    contactId?: number
    // 产品列表
    products?: BusinessProduct[]
  }

  type CrmBusinessStatusRespVO = {
    // 状态组 Id
    id: number
    // 状态组名字
    name: string
    // 使用的部门 Id
    deptIds: number[]
    // 使用的部门名称
    deptNames: string[]
    // 创建人
    creator: string
    // 创建时间
    createTime: string
    // 状态集合
    statuses: Status[]
  }

  type CrmBusinessStatusSaveReqVO = {
    // 商机状态 Id
    id: number
    // 状态类型名
    name: string
    // 使用的部门 Id
    deptIds?: number[]
    // 商机状态集合
    statuses: Status[]
  }

  type CrmBusinessTransferReqVO = {
    // 商机 Id
    id: number
    // 新负责人的用户 Id
    newOwnerUserId: number
    // 老负责人加入团队后的权限级别
    oldOwnerPermissionLevel: number
  }

  type CrmBusinessUpdateStatusReqVO = {
    // 商机 Id
    id: number
    // 商机状态 Id
    statusId?: number
    // 结束状态
    endStatus?: number
    statusValid?: boolean
  }

  type CrmCluePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 线索名称
    name?: string
    // 转化状态
    transformStatus?: boolean
    // 电话
    telephone?: string
    // 手机号
    mobile?: string
    // 场景类型，为 null 时则表示全部
    sceneType?: number
    // 所属行业
    industryId?: number
    // 客户等级
    level?: number
    // 客户来源
    source?: number
    // 跟进状态
    followUpStatus?: boolean
    // 创建时间
    createTime?: string[]
  }

  type CrmClueRespVO = {
    // 线索 Id
    id: number
    // 线索名称
    name: string
    // 跟进状态
    followUpStatus: boolean
    // 最后跟进时间
    contactLastTime?: string
    // 最后跟进内容
    contactLastContent?: string
    // 下次联系时间
    contactNextTime?: string
    // 负责人 Id
    ownerUserId?: number
    // 负责人名字
    ownerUserName?: string
    // 负责人部门
    ownerUserDeptName?: string
    // 转化状态
    transformStatus: boolean
    // 客户 Id
    customerId: number
    // 客户名称
    customerName: string
    // 手机号
    mobile?: string
    // 电话
    telephone?: string
    // QQ
    qq?: string
    // 微信
    wechat?: string
    // email
    email?: string
    // 地区 Id
    areaId?: number
    // 地区名称
    areaName?: string
    // 详细地址
    detailAddress?: string
    // 所属行业
    industryId: number
    // 客户等级
    level: number
    // 客户来源
    source: number
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名字
    creatorName?: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
  }

  type CrmClueSaveReqVO = {
    // 线索 Id
    id?: number
    // 线索名称
    name: string
    // 最后跟进时间
    contactLastTime?: string
    // 下次联系时间
    contactNextTime?: string
    // 负责人 Id
    ownerUserId: number
    // 手机号
    mobile?: string
    // 电话
    telephone?: string
    // QQ
    qq?: string
    // 微信
    wechat?: string
    // 邮箱
    email?: string
    // 地区 Id
    areaId?: number
    // 详细地址
    detailAddress?: string
    // 所属行业
    industryId?: number
    // 客户等级
    level?: number
    // 客户来源
    source?: number
    // 客户描述
    description?: string
    // 备注
    remark?: string
  }

  type CrmClueTransferReqVO = {
    // 线索 Id
    id: number
    // 新负责人的用户 Id
    newOwnerUserId: number
    // 老负责人加入团队后的权限级别，如果 null 说明移除
    oldOwnerPermissionLevel: number
  }

  type CrmContactBusiness2ReqVO = {
    // 商机 Id
    businessId: number
    // 联系人 Id 数组
    contactIds: number[]
  }

  type CrmContactBusinessReqVO = {
    // 联系人 Id
    contactId: number
    // 商机 Id 数组
    businessIds: number[]
  }

  type CrmContactPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 姓名
    name?: string
    // 客户 Id
    customerId?: number
    // 手机号
    mobile?: string
    // 电话
    telephone?: string
    // 电子邮箱
    email?: string
    // QQ
    qq?: number
    // 微信
    wechat?: string
    // 场景类型，为 null 时则表示全部
    sceneType?: number
    // 商机 Id
    businessId?: number
  }

  type CrmContactRespVO = {
    // 联系人 Id
    id: number
    // 联系人姓名
    name?: string
    // 客户 Id
    customerId?: number
    // 客户名字
    customerName?: string
    // 最后跟进时间
    contactLastTime?: string
    // 最后跟进内容
    contactLastContent?: string
    // 下次联系时间
    contactNextTime?: string
    // 负责人 Id
    ownerUserId?: number
    // 负责人名字
    ownerUserName?: string
    // 负责人部门
    ownerUserDeptName?: string
    // 手机号
    mobile?: string
    // 电话
    telephone?: string
    // 电子邮箱
    email?: string
    // QQ
    qq?: number
    // 微信
    wechat?: string
    // 地区 Id
    areaId?: number
    // 地区名
    areaName?: string
    // 地址
    detailAddress?: string
    // 性别
    sex?: number
    // 是否关键决策人
    master?: boolean
    // 职位
    post?: string
    // 直属上级
    parentId?: number
    // 直属上级名
    parentName?: string
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名字
    creatorName?: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
  }

  type CrmContactSaveReqVO = {
    // 联系人 Id
    id?: number
    // 姓名
    name: string
    // 客户 Id
    customerId: number
    // 下次联系时间
    contactNextTime?: string
    // 负责人用户 Id
    ownerUserId: number
    // 手机号
    mobile?: string
    // 电话
    telephone?: string
    // QQ
    qq?: number
    // 微信
    wechat?: string
    // 电子邮箱
    email?: string
    // 地区 Id
    areaId?: number
    // 地址
    detailAddress?: string
    // 性别
    sex?: number
    // 是否关键决策人
    master?: boolean
    // 职位
    post?: string
    // 直属上级
    parentId?: number
    // 备注
    remark?: string
    // 关联商机 Id
    businessId?: number
  }

  type CrmContactTransferReqVO = {
    // 联系人 Id
    id: number
    // 新负责人的用户 Id
    newOwnerUserId: number
    // 老负责人加入团队后的权限级别
    oldOwnerPermissionLevel: number
  }

  type CrmContractConfigRespVO = {
    // 是否开启提前提醒
    notifyEnabled?: boolean
    // 提前提醒天数
    notifyDays?: number
  }

  type CrmContractConfigSaveReqVO = {
    // 是否开启提前提醒
    notifyEnabled?: boolean
    // 提前提醒天数
    notifyDays?: number
  }

  type CrmContractPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 合同 Id
    no?: string
    // 合同名称
    name?: string
    // 客户 Id
    customerId?: number
    // 商机 Id
    businessId?: number
    // 场景类型，为 null 时则表示全部
    sceneType?: number
    // 审批状态
    auditStatus?: number
    // 过期类型，为 null 时则表示全部
    expiryType?: number
  }

  type CrmContractRespVO = {
    // 合同 Id
    id: number
    // 合同名称
    name: string
    // 合同 Id
    no: string
    // 客户 Id
    customerId: number
    // 客户名称
    customerName: string
    // 商机 Id
    businessId?: number
    // 商机名称
    businessName?: string
    // 最后跟进时间
    contactLastTime?: string
    // 负责人的用户 Id
    ownerUserId?: number
    // 负责人名字
    ownerUserName?: string
    // 负责人部门
    ownerUserDeptName?: string
    // 工作流 Id
    processInstanceId?: string
    // 审批状态
    auditStatus: number
    // 下单日期
    orderDate: string
    // 开始时间
    startTime?: string
    // 结束时间
    endTime?: string
    // 产品总金额
    totalProductPrice?: number
    // 整单折扣
    discountPercent?: number
    // 合同金额
    totalPrice?: number
    // 已回款金额
    totalReceivablePrice?: number
    // 客户签约人 Id
    signContactId?: number
    // 客户签约人
    signContactName?: string
    // 公司签约人 Id
    signUserId?: number
    // 公司签约人
    signUserName?: string
    // 备注
    remark?: string
    // 创建时间
    createTime: string
    // 创建人
    creator?: string
    // 创建人名字
    creatorName?: string
    // 更新时间
    updateTime: string
    // 产品列表
    products?: Product[]
  }

  type CrmContractSaveReqVO = {
    // 合同 Id
    id: number
    // 合同名称
    name: string
    // 客户 Id
    customerId: number
    // 商机 Id
    businessId?: number
    // 负责人的用户 Id
    ownerUserId: number
    // 下单日期
    orderDate: string
    // 开始时间
    startTime?: string
    // 结束时间
    endTime?: string
    // 整单折扣
    discountPercent: number
    // 合同金额
    totalPrice?: number
    // 客户签约人 Id
    signContactId?: number
    // 公司签约人 Id
    signUserId?: number
    // 备注
    remark?: string
    // 产品列表
    products?: Product[]
  }

  type CrmContractTransferReqVO = {
    // 合同 Id
    id: number
    // 新负责人的用户 Id
    newOwnerUserId: number
    // 老负责人加入团队后的权限级别
    oldOwnerPermissionLevel: number
  }

  type CrmCustomerDistributeReqVO = {
    // 客户 Id
    ids: number[]
    // 负责人 Id
    ownerUserId: number
  }

  type CrmCustomerImportReqVO = {
    file: string
    // 是否支持更新
    updateSupport: boolean
    // 负责人，为 null 则客户进入公海
    ownerUserId?: number
  }

  type CrmCustomerImportRespVO = {
    // 创建成功的客户名数组
    createCustomerNames: string[]
    // 更新成功的客户名数组
    updateCustomerNames: string[]
    // 导入失败的客户集合，key 为客户名，value 为失败原因
    failureCustomerNames: Record<string, any>
  }

  type CrmCustomerLimitConfigPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 规则类型
    type?: number
  }

  type CrmCustomerLimitConfigRespVO = {
    // 客户限制配置 Id
    id: number
    // 规则类型
    type: number
    // 规则适用人群
    userIds?: number[]
    // 规则适用部门
    deptIds?: number[]
    // 数量上限
    maxCount: number
    // 成交客户是否占有拥有客户数
    dealCountEnabled?: boolean
    // 规则适用人群名称
    users?: AdminUserRespDTO[]
    // 规则适用部门名称
    depts?: DeptRespDTO[]
    // 创建时间
    createTime: string
  }

  type CrmCustomerLimitConfigSaveReqVO = {
    // 客户限制配置 Id
    id: number
    // 规则类型
    type: number
    // 规则适用人群
    userIds?: number[]
    // 规则适用部门
    deptIds?: number[]
    // 数量上限
    maxCount: number
    // 成交客户是否占有拥有客户数(当 type = 1 时)
    dealCountEnabled?: boolean
  }

  type CrmCustomerLockReqVO = {
    // 客户 Id
    id: number
    // 客户锁定状态
    lockStatus: boolean
  }

  type CrmCustomerPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 客户名称
    name?: string
    // 手机
    mobile?: string
    // 所属行业
    industryId?: number
    // 客户等级
    level?: number
    // 客户来源
    source?: number
    // 场景类型，为 null 时则表示全部
    sceneType?: number
    // 是否为公海数据，null 则表示为不是公海数据
    pool: boolean
    // 联系状态
    contactStatus?: number
    // 跟进状态
    followUpStatus?: boolean
  }

  type CrmCustomerPoolConfigRespVO = {
    // 是否启用客户公海
    enabled: boolean
    // 未跟进放入公海天数
    contactExpireDays?: number
    // 未成交放入公海天数
    dealExpireDays?: number
    // 是否开启提前提醒
    notifyEnabled?: boolean
    // 提前提醒天数
    notifyDays?: number
  }

  type CrmCustomerPoolConfigSaveReqVO = {
    // 是否启用客户公海
    enabled: boolean
    // 未跟进放入公海天数
    contactExpireDays?: number
    // 未成交放入公海天数
    dealExpireDays?: number
    // 是否开启提前提醒
    notifyEnabled?: boolean
    // 提前提醒天数
    notifyDays?: number
  }

  type CrmCustomerRespVO = {
    // 客户 Id
    id: number
    // 客户名称
    name: string
    // 跟进状态
    followUpStatus: boolean
    // 最后跟进时间
    contactLastTime?: string
    // 最后跟进内容
    contactLastContent?: string
    // 下次联系时间
    contactNextTime?: string
    // 负责人的用户 Id
    ownerUserId?: number
    // 负责人名字
    ownerUserName?: string
    // 负责人部门
    ownerUserDeptName?: string
    // 锁定状态
    lockStatus: boolean
    // 成交状态
    dealStatus: boolean
    // 手机
    mobile?: string
    // 电话
    telephone?: string
    // QQ
    qq?: string
    // 微信
    wechat?: string
    // email
    email?: string
    // 地区 Id
    areaId?: number
    // 地区名称
    areaName?: string
    // 详细地址
    detailAddress?: string
    // 所属行业
    industryId: number
    // 客户等级
    level: number
    // 客户来源
    source: number
    // 负责人的用户 Id
    remark?: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
    // 创建人
    creator?: string
    // 创建人名字
    creatorName?: string
    // 距离加入公海时间
    poolDay?: number
  }

  type CrmCustomerSaveReqVO = {
    // 客户 Id
    id: number
    // 客户名称
    name: string
    // 下次联系时间
    contactNextTime?: string
    // 负责人的用户 Id
    ownerUserId: number
    // 手机
    mobile?: string
    // 电话
    telephone?: string
    // QQ
    qq?: string
    // 微信
    wechat?: string
    // 邮箱
    email?: string
    // 地区 Id
    areaId?: number
    // 详细地址
    detailAddress?: string
    // 所属行业
    industryId?: number
    // 客户等级
    level?: number
    // 客户来源
    source?: number
    // 备注
    remark?: string
  }

  type CrmCustomerTransferReqVO = {
    // 客户 Id
    id: number
    // 新负责人的用户 Id
    newOwnerUserId: number
    // 老负责人加入团队后的权限级别，如果 null 说明移除
    oldOwnerPermissionLevel: number
    // 同时转移
    toBizTypes: number[]
  }

  type CrmFollowUpRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 数据类型
    bizType?: number
    // 数据 Id
    bizId?: number
  }

  type CrmFollowUpRecordRespVO = {
    // 跟进记录 Id
    id: number
    // 数据类型
    bizType: number
    // 数据 Id
    bizId: number
    // 跟进类型
    type: number
    // 跟进内容
    content: string
    // 下次联系时间
    nextTime: string
    // 关联的商机 Id 数组
    businessIds?: number[]
    // 关联的商机数组
    businesses?: CrmBusinessRespVO[]
    // 关联的联系人 Id 数组
    contactIds?: number[]
    // 关联的联系人名称数组
    contacts?: CrmBusinessRespVO[]
    // 图片
    picUrls?: string[]
    // 附件
    fileUrls?: string[]
    // 创建人
    creator?: string
    // 创建人名字
    creatorName?: string
    // 创建时间
    createTime: string
  }

  type CrmFollowUpRecordSaveReqVO = {
    // 跟进记录 Id
    id: number
    // 数据类型
    bizType: number
    // 数据 Id
    bizId: number
    // 跟进类型
    type: number
    // 跟进内容
    content: string
    // 下次联系时间
    nextTime: string
    // 关联的商机 Id 数组
    businessIds?: number[]
    // 关联的联系人 Id 数组
    contactIds?: number[]
    // 图片
    picUrls?: string[]
    // 附件
    fileUrls?: string[]
  }

  type CrmOperateLogPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 数据类型
    bizType: number
    // 数据 Id
    bizId: number
  }

  type CrmOperateLogRespVO = {
    // 操作日志 Id
    id: number
    // 用户 Id
    userId: number
    // 用户名
    userName: string
    // 用户类型
    userType: number
    // 操作日志类型
    type: string
    // 操作日志子类型
    subType: string
    // 数据类型 Id
    bizId: number
    // 操作行为
    action: string
    // 其他参数
    extra?: string
    // 创建时间
    createTime: string
  }

  type CrmPermissionRespVO = {
    // 数据权限 Id
    id: number
    // 用户 Id
    userId: number
    // CRM 类型
    bizType: number
    // CRM 类型数据 Id
    bizId: number
    // 权限级别
    level: number
    // 用户昵称
    nickname: string
    // 部门名称
    deptName: string
    // 岗位名称数组
    postNames: string[]
    // 创建时间
    createTime: string
  }

  type CrmPermissionSaveReqVO = {
    // 用户 Id
    userId: number
    // CRM 类型
    bizType: number
    // CRM 类型数据 Id
    bizId: number
    // 权限级别
    level: number
    // 同时添加
    toBizTypes: number[]
  }

  type CrmPermissionUpdateReqVO = {
    // 数据权限 Id 列表
    ids: number[]
    // Crm 类型
    bizType: number
    // Crm 类型数据 Id
    bizId: number
    // 权限级别
    level: number
  }

  type CrmProductCategoryCreateReqVO = {
    // 产品分类 Id
    id?: number
    // 产品分类名称
    name: string
    // 父级 Id
    parentId: number
  }

  type CrmProductCategoryListReqVO = {
    name?: string
    parentId?: number
    createTime?: string
  }

  type CrmProductCategoryRespVO = {
    // 分类 Id
    id: number
    // 分类名称
    name: string
    // 父级 Id
    parentId: number
    // 创建时间
    createTime: string
  }

  type CrmProductPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 产品名称
    name?: string
    // 状态
    status?: number
  }

  type CrmProductRespVO = {
    // 产品 Id
    id?: number
    // 产品名称
    name: string
    // 产品编码
    no: string
    // 单位
    unit?: number
    // 价格, 单位：分
    price: number
    // 状态
    status: number
    // 产品分类 Id
    categoryId: number
    // 产品分类名字
    categoryName: string
    // 产品描述
    description?: string
    // 负责人的用户 Id
    ownerUserId: number
    // 负责人的用户昵称
    ownerUserName: string
    // 创建人 Id
    creator: string
    // 创建人名字
    creatorName: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
    transMap?: Record<string, any>
  }

  type CrmProductSaveReqVO = {
    // 产品 Id
    id?: number
    // 产品名称
    name: string
    // 产品编码
    no: string
    // 单位
    unit?: number
    // 价格
    price: number
    // 状态
    status: number
    // 产品分类 Id
    categoryId: number
    // 产品描述
    description?: string
    // 负责人的用户 Id
    ownerUserId: number
  }

  type CrmReceivablePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 回款 Id
    no?: string
    // 回款计划 Id
    planId?: number
    // 客户 Id
    customerId?: number
    // 合同 Id
    contractId?: number
    // 场景类型，为 null 时则表示全部
    sceneType?: number
    // 审批状态
    auditStatus?: number
  }

  type CrmReceivablePlanPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 客户 Id
    customerId?: number
    // 合同 Id
    contractNo?: string
    // 合同 Id
    contractId?: number
    // 场景类型，为 null 时则表示全部
    sceneType?: number
    // 提醒类型，为 null 时则表示全部
    remindType?: number
  }

  type CrmReceivablePlanRespVO = {
    // 回款计划 Id
    id: number
    // 期数
    period: number
    // 客户 Id
    customerId: number
    // 客户名字
    customerName: string
    // 合同 Id
    contractId: number
    // 合同 Id
    contractNo?: string
    // 负责人 Id
    ownerUserId: number
    // 负责人
    ownerUserName?: string
    // 计划回款日期
    returnTime: string
    // 计划回款方式
    returnType?: number
    // 计划回款金额
    price: number
    // 回款 Id
    receivableId?: number
    receivable?: CrmReceivableRespVO
    // 提前几天提醒
    remindDays: number
    // 提醒日期
    remindTime: string
    // 备注
    remark?: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
    // 创建人
    creator?: string
    // 创建人名字
    creatorName?: string
  }

  type CrmReceivablePlanSaveReqVO = {
    // 回款计划 Id
    id: number
    // 合同 Id
    contractId: number
    // 负责人 Id
    ownerUserId: number
    // 计划回款日期
    returnTime: string
    // 回款方式
    returnType?: number
    // 计划回款金额
    price: number
    // 提前几天提醒
    remindDays?: number
    // 备注
    remark?: string
  }

  type CrmReceivableRespVO = {
    // Id
    id?: number
    // 回款 Id
    no?: string
    // 回款计划 Id
    planId?: number
    // 回款方式
    returnType?: number
    // 回款金额
    price: number
    // 计划回款日期
    returnTime: string
    // 客户 Id
    customerId: number
    // 客户名字
    customerName: string
    // 合同 Id
    contractId: number
    contract?: CrmContractRespVO
    // 负责人的用户 Id
    ownerUserId?: number
    // 负责人名字
    ownerUserName?: string
    // 负责人部门
    ownerUserDeptName?: string
    // 工作流 Id
    processInstanceId?: string
    // 审批状态
    auditStatus: number
    // 工作流 Id
    remark?: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
    // 创建人
    creator?: string
    // 创建人名字
    creatorName?: string
  }

  type CrmReceivableSaveReqVO = {
    // 回款 Id
    id?: number
    // 负责人 Id
    ownerUserId: number
    // 客户 Id
    customerId?: number
    // 合同 Id
    contractId: number
    // 回款计划 Id
    planId: number
    // 回款方式
    returnType?: number
    // 回款金额
    price: number
    // 回款日期
    returnTime: string
    // 备注
    remark?: string
  }

  type CrmStatisticCustomerAreaRespVO = {
    // 省份 Id
    areaId: number
    // 省份名称
    areaName: string
    // 客户个数
    customerCount: number
    // 成交个数
    dealCount: number
  }

  type CrmStatisticCustomerIndustryRespVO = {
    // 客户行业 Id
    industryId: number
    // 客户个数
    customerCount: number
    // 成交个数
    dealCount: number
  }

  type CrmStatisticCustomerLevelRespVO = {
    // 客户级别 Id
    level: number
    // 客户个数
    customerCount: number
    // 成交个数
    dealCount: number
  }

  type CrmStatisticCustomerSourceRespVO = {
    // 客户来源 Id
    source: number
    // 客户个数
    customerCount: number
    // 成交个数
    dealCount: number
  }

  type CrmStatisticFunnelSummaryRespVO = {
    // 客户数
    customerCount: number
    // 商机数
    businessCount: number
    // 赢单数
    businessWinCount: number
  }

  type CrmStatisticsBusinessInversionRateSummaryByDateRespVO = {
    // 时间轴
    time: string
    // 商机数量
    businessCount: number
    // 赢单商机数
    businessWinCount: number
  }

  type CrmStatisticsBusinessSummaryByDateRespVO = {
    // 时间轴
    time: string
    // 新增商机数量
    businessCreateCount: number
    // 新增商机金额
    totalPrice: number
  }

  type CrmStatisticsBusinessSummaryByEndStatusRespVO = {
    // 结束状态
    endStatus: number
    // 商机数
    businessCount: number
    // 商机总金额，单位：元
    totalPrice: number
  }

  type CrmStatisticsCustomerContractSummaryRespVO = {
    // 客户名称
    customerName: string
    // 合同名称
    contractName: string
    // 合同总金额
    totalPrice: number
    // 回款金额
    receivablePrice: number
    // 客户行业 Id
    industryId: number
    // 客户来源 Id
    source: number
    // 负责人 Id
    ownerUserId: number
    // 负责人
    ownerUserName: string
    // 创建人 Id
    creator: string
    // 创建人
    creatorUserName: string
    // 创建时间
    createTime: string
    // 下单日期
    orderDate: string
  }

  type CrmStatisticsCustomerDealCycleByAreaRespVO = {
    // 省份名称
    areaName: string
    // 成交周期
    customerDealCycle: number
    // 成交客户数
    customerDealCount: number
  }

  type CrmStatisticsCustomerDealCycleByDateRespVO = {
    // 时间轴
    time: string
    // 成交周期
    customerDealCycle: number
  }

  type CrmStatisticsCustomerDealCycleByProductRespVO = {
    // 产品名称
    productName: string
    // 成交周期
    customerDealCycle: number
    // 成交客户数
    customerDealCount: number
  }

  type CrmStatisticsCustomerDealCycleByUserRespVO = {
    // 负责人 Id
    ownerUserId: number
    // 负责人
    ownerUserName: string
    // 成交周期
    customerDealCycle: number
    // 成交客户数
    customerDealCount: number
  }

  type CrmStatisticsCustomerReqVO = {
    // 部门 Id
    deptId: number
    // 负责人用户 Id，当用户为空, 则计算部门下用户
    userId?: number
    // 时间间隔类型
    interval: number
    // 时间范围
    times?: string[]
  }

  type CrmStatisticsCustomerSummaryByDateRespVO = {
    // 时间轴
    time: string
    // 新建客户数
    customerCreateCount: number
    // 成交客户数
    customerDealCount: number
  }

  type CrmStatisticsCustomerSummaryByUserRespVO = {
    // 负责人 Id
    ownerUserId: number
    // 负责人
    ownerUserName: string
    // 新建客户数
    customerCreateCount: number
    // 成交客户数
    customerDealCount: number
    // 合同总金额
    contractPrice: number
    // 回款金额
    receivablePrice: number
  }

  type CrmStatisticsFollowUpSummaryByDateRespVO = {
    // 时间轴
    time: string
    // 跟进次数
    followUpRecordCount: number
    // 跟进客户数
    followUpCustomerCount: number
  }

  type CrmStatisticsFollowUpSummaryByTypeRespVO = {
    // 跟进类型
    followUpType: number
    // 跟进次数
    followUpRecordCount: number
  }

  type CrmStatisticsFollowUpSummaryByUserRespVO = {
    // 负责人 Id
    ownerUserId: number
    // 负责人
    ownerUserName: string
    // 跟进次数
    followUpRecordCount: number
    // 跟进客户数
    followUpCustomerCount: number
  }

  type CrmStatisticsFunnelReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 部门 Id
    deptId: number
    // 负责人用户 Id，当用户为空, 则计算部门下用户
    userId?: number
    // 时间间隔类型
    interval: number
    // 时间范围
    times?: string[]
  }

  type CrmStatisticsPerformanceReqVO = {
    // 部门 Id
    deptId: number
    // 负责人用户 Id，当用户为空，则计算部门下用户
    userId?: number
    // 负责人用户 Id 集合
    userIds?: number[]
    // 时间范围
    times: string[]
  }

  type CrmStatisticsPerformanceRespVO = {
    // 时间轴
    time: string
    // 当月统计结果
    currentMonthCount: number
    // 上月统计结果
    lastMonthCount: number
    // 去年同期统计结果
    lastYearCount: number
  }

  type CrmStatisticsPoolSummaryByDateRespVO = {
    // 时间轴
    time: string
    // 进入公海客户数
    customerPutCount: number
    // 公海领取客户数
    customerTakeCount: number
  }

  type CrmStatisticsPoolSummaryByUserRespVO = {
    // 负责人 Id
    ownerUserId: number
    // 负责人
    ownerUserName: string
    // 进入公海客户数
    customerPutCount: number
    // 公海领取客户数
    customerTakeCount: number
  }

  type CrmStatisticsPortraitReqVO = {
    // 部门 Id
    deptId: number
    // 负责人用户 Id，当用户为空，则计算部门下用户
    userId?: number
    // 时间范围
    times?: string[]
  }

  type CrmStatisticsRankReqVO = {
    // 部门 Id
    deptId: number
    // 负责人用户 Id 集合
    userIds?: number[]
    // 时间范围
    times: string[]
  }

  type CrmStatisticsRankRespVO = {
    // 负责人 Id
    ownerUserId: number
    // 姓名
    nickname: string
    // 部门名称
    deptName: string
    // 数量
    count: number
  }

  type deleteBusinessParams = {
    // 商机 Id
    id: number
  }

  type deleteBusinessStatusTypeParams = {
    // 商机状态 Id
    id: number
  }

  type deleteClueParams = {
    // 线索 Id
    id: number
  }

  type deleteContactParams = {
    // 联系人 Id
    id: number
  }

  type deleteContractParams = {
    // 合同 Id
    id: number
  }

  type deleteCustomerLimitConfigParams = {
    // 客户限制配置 Id
    id: number
  }

  type deleteCustomerParams = {
    // 客户 Id
    id: number
  }

  type deleteFollowUpRecordParams = {
    // 跟进记录 Id
    id: number
  }

  type deletePermissionParams = {
    // 数据权限 Ids
    ids: number[]
  }

  type deleteProductCategoryParams = {
    // 产品分类 Id
    id: number
  }

  type deleteProductParams = {
    // 产品 Id
    id: number
  }

  type deleteReceivableParams = {
    // 回款 Id
    id: number
  }

  type deleteReceivablePlanParams = {
    // 回款计划 Id
    id: number
  }

  type deleteSelfPermissionParams = {
    // 数据权限 Id
    id: number
  }

  type DeptRespDTO = {
    // 部门 Id
    id: number
    // 部门名称
    name: string
    // 父部门 Id
    parentId: number
    // 负责人用户 Id
    leaderUserId: number
    // 部门状态，参见 CommonStatusEnum 枚举
    status: number
  }

  type exportBusinessExcelParams = {
    exportReqVO: CrmBusinessPageReqVO
  }

  type exportClueExcelParams = {
    pageReqVO: CrmCluePageReqVO
  }

  type exportContactExcelParams = {
    exportReqVO: CrmContactPageReqVO
  }

  type exportContractExcelParams = {
    exportReqVO: CrmContractPageReqVO
  }

  type exportCustomerExcelParams = {
    pageVO: CrmCustomerPageReqVO
  }

  type exportProductExcelParams = {
    exportReqVO: CrmProductPageReqVO
  }

  type exportReceivableExcelParams = {
    exportReqVO: CrmReceivablePageReqVO
  }

  type exportReceivablePlanExcelParams = {
    exportReqVO: CrmReceivablePlanPageReqVO
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

  type getBusinessContactPageParams = {
    pageReqVO: CrmBusinessPageReqVO
  }

  type getBusinessInversionRateSummaryByDateParams = {
    reqVO: CrmStatisticsFunnelReqVO
  }

  type getBusinessPageByCustomerParams = {
    pageReqVO: CrmBusinessPageReqVO
  }

  type getBusinessPageByDateParams = {
    pageVO: CrmStatisticsFunnelReqVO
  }

  type getBusinessPageParams = {
    pageVO: CrmBusinessPageReqVO
  }

  type getBusinessParams = {
    // 商机 Id
    id: number
  }

  type getBusinessStatusPageParams = {
    pageReqVO: PageParam
  }

  type getBusinessStatusSimpleListParams = {
    // 商机状态类型 Id
    typeId: number
  }

  type getBusinessStatusTypeParams = {
    // 商机状态 Id
    id: number
  }

  type getBusinessSummaryByDateParams = {
    reqVO: CrmStatisticsFunnelReqVO
  }

  type getBusinessSummaryByEndStatusParams = {
    reqVO: CrmStatisticsFunnelReqVO
  }

  type getCluePageParams = {
    pageVO: CrmCluePageReqVO
  }

  type getClueParams = {
    // 线索 Id
    id: number
  }

  type getContactPageByBusinessParams = {
    pageVO: CrmContactPageReqVO
  }

  type getContactPageByCustomerParams = {
    pageVO: CrmContactPageReqVO
  }

  type getContactPageParams = {
    pageVO: CrmContactPageReqVO
  }

  type getContactParams = {
    // 联系人 Id
    id: number
  }

  type getContactsCountRankParams = {
    rankingReqVO: CrmStatisticsRankReqVO
  }

  type getContractCountPerformanceParams = {
    performanceReqVO: CrmStatisticsPerformanceReqVO
  }

  type getContractCountRankParams = {
    rankingReqVO: CrmStatisticsRankReqVO
  }

  type getContractPageByBusinessParams = {
    pageVO: CrmContractPageReqVO
  }

  type getContractPageByCustomerParams = {
    pageVO: CrmContractPageReqVO
  }

  type getContractPageParams = {
    pageVO: CrmContractPageReqVO
  }

  type getContractParams = {
    // 合同 Id
    id: number
  }

  type getContractPriceRankParams = {
    rankingReqVO: CrmStatisticsRankReqVO
  }

  type getContractPriceStaffPerformanceParams = {
    performanceReqVO: CrmStatisticsPerformanceReqVO
  }

  type getContractSimpleListParams = {
    // 客户 Id
    customerId: number
  }

  type getContractSummaryParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getCustomerAreaSummaryParams = {
    reqVO: CrmStatisticsPortraitReqVO
  }

  type getCustomerCountRankParams = {
    rankingReqVO: CrmStatisticsRankReqVO
  }

  type getCustomerDealCycleByAreaParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getCustomerDealCycleByDateParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getCustomerDealCycleByProductParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getCustomerDealCycleByUserParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getCustomerIndustrySummaryParams = {
    reqVO: CrmStatisticsPortraitReqVO
  }

  type getCustomerLevelSummaryParams = {
    reqVO: CrmStatisticsPortraitReqVO
  }

  type getCustomerLimitConfigPageParams = {
    pageVO: CrmCustomerLimitConfigPageReqVO
  }

  type getCustomerLimitConfigParams = {
    // 客户限制配置 Id
    id: number
  }

  type getCustomerOperateLogParams = {
    pageReqVO: CrmOperateLogPageReqVO
  }

  type getCustomerPageParams = {
    pageVO: CrmCustomerPageReqVO
  }

  type getCustomerParams = {
    // 客户 Id
    id: number
  }

  type getCustomerSourceSummaryParams = {
    reqVO: CrmStatisticsPortraitReqVO
  }

  type getCustomerSummaryByDateParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getCustomerSummaryByUserParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getFollowCountRankParams = {
    rankingReqVO: CrmStatisticsRankReqVO
  }

  type getFollowCustomerCountRankParams = {
    rankingReqVO: CrmStatisticsRankReqVO
  }

  type getFollowUpRecordPageParams = {
    pageReqVO: CrmFollowUpRecordPageReqVO
  }

  type getFollowUpRecordParams = {
    // 跟进记录 Id
    id: number
  }

  type getFollowupSummaryByDateParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getFollowUpSummaryByTypeParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getFollowUpSummaryByUserParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getFunnelSummaryParams = {
    reqVO: CrmStatisticsFunnelReqVO
  }

  type getPermissionListParams = {
    // CRM 类型
    bizType: number
    // CRM 类型数据 Id
    bizId: number
  }

  type getPoolSummaryByDateParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getPoolSummaryByUserParams = {
    reqVO: CrmStatisticsCustomerReqVO
  }

  type getProductCategoryListParams = {
    listReqVO: CrmProductCategoryListReqVO
  }

  type getProductCategoryParams = {
    // 产品分类 Id
    id: number
  }

  type getProductPageParams = {
    pageVO: CrmProductPageReqVO
  }

  type getProductParams = {
    // 产品 Id
    id: number
  }

  type getProductSalesRankParams = {
    rankingReqVO: CrmStatisticsRankReqVO
  }

  type getPutPoolRemindCustomerPageParams = {
    pageVO: CrmCustomerPageReqVO
  }

  type getReceivablePageByCustomerParams = {
    pageReqVO: CrmReceivablePageReqVO
  }

  type getReceivablePageParams = {
    pageReqVO: CrmReceivablePageReqVO
  }

  type getReceivableParams = {
    // 回款 Id
    id: number
  }

  type getReceivablePlanPageByCustomerParams = {
    pageReqVO: CrmReceivablePlanPageReqVO
  }

  type getReceivablePlanPageParams = {
    pageReqVO: CrmReceivablePlanPageReqVO
  }

  type getReceivablePlanParams = {
    // 回款计划 Id
    id: number
  }

  type getReceivablePlanSimpleListParams = {
    // 客户 Id
    customerId: number
    // 合同 Id
    contractId: number
  }

  type getReceivablePriceRankParams = {
    rankingReqVO: CrmStatisticsRankReqVO
  }

  type getReceivablePriceStaffPerformanceParams = {
    performanceReqVO: CrmStatisticsPerformanceReqVO
  }

  type PageParam = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
  }

  type PageResultCrmBusinessRespVO = {
    // 数据
    list: CrmBusinessRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmBusinessStatusRespVO = {
    // 数据
    list: CrmBusinessStatusRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmClueRespVO = {
    // 数据
    list: CrmClueRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmContactRespVO = {
    // 数据
    list: CrmContactRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmContractRespVO = {
    // 数据
    list: CrmContractRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmCustomerLimitConfigRespVO = {
    // 数据
    list: CrmCustomerLimitConfigRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmCustomerRespVO = {
    // 数据
    list: CrmCustomerRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmFollowUpRecordRespVO = {
    // 数据
    list: CrmFollowUpRecordRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmOperateLogRespVO = {
    // 数据
    list: CrmOperateLogRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmProductRespVO = {
    // 数据
    list: CrmProductRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmReceivablePlanRespVO = {
    // 数据
    list: CrmReceivablePlanRespVO[]
    // 总量
    total: number
  }

  type PageResultCrmReceivableRespVO = {
    // 数据
    list: CrmReceivableRespVO[]
    // 总量
    total: number
  }

  type Product = {
    // 产品 Id
    productId: number
    // 产品单价
    productPrice: number
    // 合同价格
    contractPrice: number
    // 产品数量
    count: number
  }

  type putCustomerPoolParams = {
    // 客户 Id
    id: number
  }

  type receiveCustomerParams = {
    // 客户 Ids
    ids: number[]
  }

  type Status = {
    // 状态 Id
    id?: number
    // 状态名
    name: string
    // 赢单率
    percent: number
  }

  type submitContract1Params = {
    id: number
  }

  type submitContractParams = {
    id: number
  }

  type transformClueParams = {
    // 线索 Id
    id: number
  }

  type updateCustomerDealStatusParams = {
    // 客户 Id
    id: number
    // 成交状态
    dealStatus: boolean
  }
}
