declare namespace API {
  type AfterSaleDetailRespVO = {
    // 售后流水号
    no: string
    // 售后状态
    status: number
    // 售后类型
    type: number
    // 售后方式
    way: number
    // 用户 Id
    userId: number
    // 申请原因
    applyReason: string
    // 补充描述
    applyDescription?: string
    // 补充凭证图片
    applyPicUrls?: string[]
    // 订单编号
    orderId: number
    // 订单流水号
    orderNo: string
    // 订单项编号
    orderItemId: number
    // 商品 SPU Id
    spuId: number
    // 商品 SPU 名称
    spuName: string
    // 商品 SKU 编号
    skuId: number
    // 商品图片
    picUrl?: string
    // 购买数量
    count: number
    // 审批时间
    auditTime?: string
    // 审批人
    auditUserId?: number
    // 审批备注
    auditReason?: string
    // 退款金额，单位：分
    refundPrice: number
    // 支付退款编号
    payRefundId?: number
    // 退款时间
    refundTime?: string
    // 退货物流公司编号
    logisticsId?: number
    // 退货物流单号
    logisticsNo?: string
    // 退货时间
    deliveryTime?: string
    // 收货时间
    receiveTime?: string
    // 收货备注
    receiveReason?: string
    // 售后编号
    id: number
    order?: TradeOrderBaseVO
    orderItem?: OrderItem
    user?: MemberUserRespVO
    logs?: AfterSaleLogRespVO[]
  }

  type AfterSaleDisagreeReqVO = {
    // 售后编号
    id: number
    // 审批备注
    auditReason: string
  }

  type AfterSaleLogRespVO = {
    // 售后日志 Id
    id: number
    // 用户 Id
    userId: number
    // 用户类型
    userType: number
    // 售后 Id
    afterSaleId: number
    // 售后状态（之前）
    beforeStatus?: number
    // 售后状态（之后）
    afterStatus: number
    // 操作明细
    content: string
    // 创建时间
    createTime: string
  }

  type AfterSalePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户 Id
    userId?: number
    // 售后流水号
    no?: string
    // 售后状态
    status?: number
    // 售后类型
    type?: number
    // 售后方式
    way?: number
    // 订单编号
    orderNo?: string
    // 商品 SPU 名称
    spuName?: string
    // 创建时间
    createTime?: string[]
  }

  type AfterSaleRespPageItemVO = {
    // 售后流水号
    no: string
    // 售后状态
    status: number
    // 售后类型
    type: number
    // 售后方式
    way: number
    // 用户 Id
    userId: number
    // 申请原因
    applyReason: string
    // 补充描述
    applyDescription?: string
    // 补充凭证图片
    applyPicUrls?: string[]
    // 订单编号
    orderId: number
    // 订单流水号
    orderNo: string
    // 订单项编号
    orderItemId: number
    // 商品 SPU Id
    spuId: number
    // 商品 SPU 名称
    spuName: string
    // 商品 SKU 编号
    skuId: number
    // 商品图片
    picUrl?: string
    // 购买数量
    count: number
    // 审批时间
    auditTime?: string
    // 审批人
    auditUserId?: number
    // 审批备注
    auditReason?: string
    // 退款金额，单位：分
    refundPrice: number
    // 支付退款编号
    payRefundId?: number
    // 退款时间
    refundTime?: string
    // 退货物流公司编号
    logisticsId?: number
    // 退货物流单号
    logisticsNo?: string
    // 退货时间
    deliveryTime?: string
    // 收货时间
    receiveTime?: string
    // 收货备注
    receiveReason?: string
    // 售后 Id
    id: number
    // 创建时间
    createTime: string
    properties?: ProductPropertyValueDetailRespVO[]
    user?: MemberUserRespVO
  }

  type agreeAfterSaleParams = {
    // 售后编号
    id: number
  }

  type approveBrokerageWithdrawParams = {
    id: number
  }

  type BrokerageRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户 Id
    userId?: number
    // 业务类型
    bizType?: number
    // 状态
    status?: number
    // 创建时间
    createTime?: string[]
    // 用户类型
    sourceUserLevel?: number
  }

  type BrokerageRecordRespVO = {
    // 用户 Id
    userId: number
    // 业务 Id
    bizId: string
    // 业务类型
    bizType: number
    // 标题
    title: string
    // 金额
    price: number
    // 当前总佣金
    totalPrice: number
    // 说明
    description: string
    // 状态
    status: number
    // 冻结时间（天）
    frozenDays: number
    // 解冻时间
    unfreezeTime?: string
    // 来源用户等级
    sourceUserLevel?: number
    // 来源用户 Id
    sourceUserId?: number
    // 佣金记录 Id
    id: number
    // 创建时间
    createTime: string
    // 用户头像
    userAvatar?: string
    // 用户昵称
    userNickname?: string
    // 来源用户头像
    sourceUserAvatar?: string
    // 来源用户昵称
    sourceUserNickname?: string
  }

  type BrokerageUserClearBrokerageUserReqVO = {
    // 用户 Id
    id: number
  }

  type BrokerageUserCreateReqVO = {
    // 分销用户 Id
    userId: number
    // 推广员 Id
    bindUserId: number
  }

  type BrokerageUserPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 推广员 Id
    bindUserId?: number
    // 推广资格
    brokerageEnabled?: boolean
    // 创建时间
    createTime?: string[]
    // 用户等级
    level?: number
    // 绑定时间
    bindUserTime?: string[]
  }

  type BrokerageUserRespVO = {
    // 推广员 Id
    bindUserId: number
    // 推广员绑定时间
    bindUserTime?: string
    // 推广资格
    brokerageEnabled: boolean
    // 成为分销员时间
    brokerageTime?: string
    // 可用佣金
    price: number
    // 冻结佣金
    frozenPrice: number
    // 用户 Id
    id: number
    // 创建时间
    createTime: string
    // 用户头像
    avatar: string
    // 用户昵称
    nickname: string
    // 推广用户数量
    brokerageUserCount: number
    // 推广订单数量
    brokerageOrderCount: number
    // 推广订单金额
    brokerageOrderPrice: number
    // 已提现金额
    withdrawPrice: number
    // 已提现次数
    withdrawCount: number
  }

  type BrokerageUserUpdateBrokerageEnabledReqVO = {
    // 用户 Id
    id: number
    // 推广资格
    enabled: boolean
  }

  type BrokerageUserUpdateBrokerageUserReqVO = {
    // 用户 Id
    id: number
    // 推广员 Id
    bindUserId: number
  }

  type BrokerageWithdrawPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户 Id
    userId?: number
    // 提现类型
    type?: number
    // 真实姓名
    userName?: string
    // 账号
    userAccount?: string
    // 银行名称
    bankName?: string
    // 状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type BrokerageWithdrawRejectReqVO = {
    // Id
    id: number
    // 审核驳回原因
    auditReason: string
  }

  type BrokerageWithdrawRespVO = {
    // 佣金提现 Id
    id: number
    // 用户 Id
    userId: number
    // 用户昵称
    userNickname: string
    // 提现金额
    price: number
    // 提现手续费
    feePrice: number
    // 当前总佣金
    totalPrice: number
    // 提现类型
    type: number
    // 真实姓名
    userName?: string
    // 收款账号
    userAccount?: string
    // 银行名称
    bankName?: string
    // 开户地址
    bankAddress?: string
    // 收款码
    qrCodeUrl?: string
    // 状态
    status: number
    // 审核驳回原因
    auditReason?: string
    // 审核时间
    auditTime?: string
    // 备注
    remark?: string
    // 转账单编号
    payTransferId?: number
    // 转账错误提示
    transferErrorMsg?: string
    // 创建时间
    createTime: string
  }

  type CommonResultAfterSaleDetailRespVO = {
    code?: number
    data?: AfterSaleDetailRespVO
    msg?: string
  }

  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultBrokerageRecordRespVO = {
    code?: number
    data?: BrokerageRecordRespVO
    msg?: string
  }

  type CommonResultBrokerageUserRespVO = {
    code?: number
    data?: BrokerageUserRespVO
    msg?: string
  }

  type CommonResultBrokerageWithdrawRespVO = {
    code?: number
    data?: BrokerageWithdrawRespVO
    msg?: string
  }

  type CommonResultDeliveryExpressRespVO = {
    code?: number
    data?: DeliveryExpressRespVO
    msg?: string
  }

  type CommonResultDeliveryExpressTemplateDetailRespVO = {
    code?: number
    data?: DeliveryExpressTemplateDetailRespVO
    msg?: string
  }

  type CommonResultDeliveryPickUpStoreRespVO = {
    code?: number
    data?: DeliveryPickUpStoreRespVO
    msg?: string
  }

  type CommonResultListDeliveryExpressSimpleRespVO = {
    code?: number
    data?: DeliveryExpressSimpleRespVO[]
    msg?: string
  }

  type CommonResultListDeliveryExpressTemplateRespVO = {
    code?: number
    data?: DeliveryExpressTemplateRespVO[]
    msg?: string
  }

  type CommonResultListDeliveryExpressTemplateSimpleRespVO = {
    code?: number
    data?: DeliveryExpressTemplateSimpleRespVO[]
    msg?: string
  }

  type CommonResultListDeliveryPickUpStoreRespVO = {
    code?: number
    data?: DeliveryPickUpStoreRespVO[]
    msg?: string
  }

  type CommonResultListDeliveryPickUpStoreSimpleRespVO = {
    code?: number
    data?: DeliveryPickUpStoreSimpleRespVO[]
    msg?: string
  }

  type CommonResultListObject = {
    code?: number
    data?: Record<string, any>[]
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultPageResultAfterSaleRespPageItemVO = {
    code?: number
    data?: PageResultAfterSaleRespPageItemVO
    msg?: string
  }

  type CommonResultPageResultBrokerageRecordRespVO = {
    code?: number
    data?: PageResultBrokerageRecordRespVO
    msg?: string
  }

  type CommonResultPageResultBrokerageUserRespVO = {
    code?: number
    data?: PageResultBrokerageUserRespVO
    msg?: string
  }

  type CommonResultPageResultBrokerageWithdrawRespVO = {
    code?: number
    data?: PageResultBrokerageWithdrawRespVO
    msg?: string
  }

  type CommonResultPageResultDeliveryExpressRespVO = {
    code?: number
    data?: PageResultDeliveryExpressRespVO
    msg?: string
  }

  type CommonResultPageResultDeliveryExpressTemplateRespVO = {
    code?: number
    data?: PageResultDeliveryExpressTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultDeliveryPickUpStoreRespVO = {
    code?: number
    data?: PageResultDeliveryPickUpStoreRespVO
    msg?: string
  }

  type CommonResultPageResultTradeOrderPageItemRespVO = {
    code?: number
    data?: PageResultTradeOrderPageItemRespVO
    msg?: string
  }

  type CommonResultTradeConfigRespVO = {
    code?: number
    data?: TradeConfigRespVO
    msg?: string
  }

  type CommonResultTradeOrderDetailRespVO = {
    code?: number
    data?: TradeOrderDetailRespVO
    msg?: string
  }

  type CommonResultTradeOrderSummaryRespVO = {
    code?: number
    data?: TradeOrderSummaryRespVO
    msg?: string
  }

  type deleteDeliveryExpressParams = {
    // 快递公司 Id
    id: number
  }

  type deleteDeliveryExpressTemplateParams = {
    // 快递运费模板 Id
    id: number
  }

  type deleteDeliveryPickUpStoreParams = {
    // 自提门店 Id
    id: number
  }

  type DeliveryExpressCreateReqVO = {
    // 快递公司编码
    code: string
    // 快递公司名称
    name: string
    // 快递公司 logo
    logo?: string
    // 排序
    sort: number
    // 状态
    status: number
  }

  type DeliveryExpressExportReqVO = {
    // 快递公司编码
    code?: string
    // 快递公司名称
    name?: string
    // 状态，0：正常；1：停用）
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type DeliveryExpressPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 快递公司编码
    code?: string
    // 快递公司名称
    name?: string
    // 状态，0：正常；1：停用）
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type DeliveryExpressRespVO = {
    // 快递公司编码
    code: string
    // 快递公司名称
    name: string
    // 快递公司 logo
    logo?: string
    // 排序
    sort: number
    // 状态
    status: number
    // 快递公司 Id
    id: number
    // 创建时间
    createTime: string
  }

  type DeliveryExpressSimpleRespVO = {
    // 快递公司 Id
    id: number
    // 快递公司名称
    name: string
  }

  type DeliveryExpressTemplateChargeBaseVO = {
    // 区域编号列表
    areaIds: number[]
    // 首件数量
    startCount: number
    // 起步价
    startPrice: number
    // 续件数量
    extraCount: number
    // 额外价
    extraPrice: number
  }

  type DeliveryExpressTemplateCreateReqVO = {
    // 模板名称
    name: string
    // 配送计费方式，1：按件；2：按重量；3：按体积
    chargeMode: number
    // 排序
    sort: number
    // 区域运费列表
    charges?: DeliveryExpressTemplateChargeBaseVO[]
    // 包邮区域列表
    frees?: DeliveryExpressTemplateFreeBaseVO[]
  }

  type DeliveryExpressTemplateDetailRespVO = {
    // 模板名称
    name: string
    // 配送计费方式，1：按件；2：按重量；3：按体积
    chargeMode: number
    // 排序
    sort: number
    // 快递运费模板 Id
    id: number
    // 运费模板运费设置
    charges: DeliveryExpressTemplateChargeBaseVO[]
    // 运费模板包邮区域
    frees: DeliveryExpressTemplateFreeBaseVO[]
  }

  type DeliveryExpressTemplateFreeBaseVO = {
    // 区域编号列表
    areaIds: number[]
    // 包邮金额
    freePrice: number
    // 包邮件数
    freeCount: number
  }

  type DeliveryExpressTemplatePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 模板名称
    name?: string
    // 配送计费方式，1：按件；2：按重量；3：按体积
    chargeMode?: number
    // 创建时间
    createTime?: string[]
  }

  type DeliveryExpressTemplateRespVO = {
    // 模板名称
    name: string
    // 配送计费方式，1：按件；2：按重量；3：按体积
    chargeMode: number
    // 排序
    sort: number
    // 快递运费模板 Id
    id: number
    // 创建时间
    createTime: string
  }

  type DeliveryExpressTemplateSimpleRespVO = {
    // 模版编号
    id: number
    // 模板名称
    name: string
  }

  type DeliveryExpressTemplateUpdateReqVO = {
    // 模板名称
    name: string
    // 配送计费方式，1：按件；2：按重量；3：按体积
    chargeMode: number
    // 排序
    sort: number
    // 快递运费模板 Id
    id: number
    // 区域运费列表
    charges?: DeliveryExpressTemplateChargeBaseVO[]
    // 包邮区域列表
    frees?: DeliveryExpressTemplateFreeBaseVO[]
  }

  type DeliveryExpressUpdateReqVO = {
    // 快递公司编码
    code: string
    // 快递公司名称
    name: string
    // 快递公司 logo
    logo?: string
    // 排序
    sort: number
    // 状态
    status: number
    // 快递公司 Id
    id: number
  }

  type DeliveryPickUpBindReqVO = {
    // 自提门店 Id
    id: number
    // 绑定用户 Ids
    verifyUserIds: number[]
  }

  type DeliveryPickUpStoreCreateReqVO = {
    // 门店名称
    name: string
    // 门店简介
    introduction?: string
    // 门店手机
    phone: string
    // 区域编号
    areaId: number
    // 门店详细地址
    detailAddress: string
    // 门店 logo
    logo: string
    openingTime: LocalTime
    closingTime: LocalTime
    // 纬度
    latitude: number
    // 经度
    longitude: number
    // 门店状态
    status: number
  }

  type DeliveryPickUpStorePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 门店名称
    name?: string
    // 门店手机
    phone?: string
    // 区域编号
    areaId?: number
    // 门店状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type DeliveryPickUpStoreRespVO = {
    // 门店名称
    name: string
    // 门店简介
    introduction?: string
    // 门店手机
    phone: string
    // 区域编号
    areaId: number
    // 门店详细地址
    detailAddress: string
    // 门店 logo
    logo: string
    openingTime: LocalTime
    closingTime: LocalTime
    // 纬度
    latitude: number
    // 经度
    longitude: number
    // 门店状态
    status: number
    // 自提门店 Id
    id: number
    // 创建时间
    createTime: string
    // 核销用户数组
    verifyUsers: UserSimpleBaseVO[]
  }

  type DeliveryPickUpStoreSimpleRespVO = {
    // 自提门店 Id
    id: number
    // 门店名称
    name: string
    // 门店手机
    phone: string
    // 区域编号
    areaId: number
    // 区域名称
    areaName: string
    // 门店详细地址
    detailAddress: string
    // 绑定用户 Ids
    verifyUserIds: number[]
  }

  type DeliveryPickUpStoreUpdateReqVO = {
    // 门店名称
    name: string
    // 门店简介
    introduction?: string
    // 门店手机
    phone: string
    // 区域编号
    areaId: number
    // 门店详细地址
    detailAddress: string
    // 门店 logo
    logo: string
    openingTime: LocalTime
    closingTime: LocalTime
    // 纬度
    latitude: number
    // 经度
    longitude: number
    // 门店状态
    status: number
    // 自提门店 Id
    id: number
  }

  type exportDeliveryExpressExcelParams = {
    exportReqVO: DeliveryExpressExportReqVO
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

  type getAfterSalePageParams = {
    pageVO: AfterSalePageReqVO
  }

  type getBrokerageRecordPageParams = {
    pageVO: BrokerageRecordPageReqVO
  }

  type getBrokerageRecordParams = {
    // 佣金记录 Id
    id: number
  }

  type getBrokerageUserPageParams = {
    pageVO: BrokerageUserPageReqVO
  }

  type getBrokerageUserParams = {
    // 分销用户 Id
    id: number
  }

  type getBrokerageWithdrawPageParams = {
    pageVO: BrokerageWithdrawPageReqVO
  }

  type getBrokerageWithdrawParams = {
    // Id
    id: number
  }

  type getByPickUpVerifyCodeParams = {
    // 自提核销码
    pickUpVerifyCode: string
  }

  type getDeliveryExpressPageParams = {
    pageVO: DeliveryExpressPageReqVO
  }

  type getDeliveryExpressParams = {
    // 快递公司 Id
    id: number
  }

  type getDeliveryExpressTemplateListParams = {
    // 快递运费模板 Ids
    ids: number[]
  }

  type getDeliveryExpressTemplatePageParams = {
    pageVO: DeliveryExpressTemplatePageReqVO
  }

  type getDeliveryExpressTemplateParams = {
    // 快递运费模板 Id
    id: number
  }

  type getDeliveryPickUpStoreListParams = {
    // 自提门店列表 Ids
    ids: number[]
  }

  type getDeliveryPickUpStorePageParams = {
    pageVO: DeliveryPickUpStorePageReqVO
  }

  type getDeliveryPickUpStoreParams = {
    // 自提门店 Id
    id: number
  }

  type getOrderDetail1Params = {
    // 售后编号
    id: number
  }

  type getOrderDetailParams = {
    // 订单编号
    id: number
  }

  type getOrderExpressTrackListParams = {
    // 交易订单编号
    id: number
  }

  type getOrderPageParams = {
    // 订单号
    no?: string
    // 用户 Id
    userId?: string
    // 用户昵称
    userNickname?: string
    // 用户手机号
    userMobile?: string
    // 配送方式
    deliveryType?: string
    // 发货物流公司 Id
    logisticsId?: string
    // 自提门店 Id
    pickUpStoreIds?: string
    // 自提核销码
    pickUpVerifyCode?: string
    // 订单类型
    type?: string
    // 订单状态
    status?: string
    // 支付渠道
    payChannelCode?: string
    // 创建时间
    createTime?: string
    // 订单来源
    terminal?: string
    // 页码，从 1 开始
    pageNo: string
    // 每页条数，最大值为 100
    pageSize: string
  }

  type getOrderSummaryParams = {
    // 订单号
    no?: string
    // 用户 Id
    userId?: string
    // 用户昵称
    userNickname?: string
    // 用户手机号
    userMobile?: string
    // 配送方式
    deliveryType?: string
    // 发货物流公司 Id
    logisticsId?: string
    // 自提门店 Id
    pickUpStoreIds?: string
    // 自提核销码
    pickUpVerifyCode?: string
    // 订单类型
    type?: string
    // 订单状态
    status?: string
    // 支付渠道
    payChannelCode?: string
    // 创建时间
    createTime?: string
    // 订单来源
    terminal?: string
    // 页码，从 1 开始
    pageNo: string
    // 每页条数，最大值为 100
    pageSize: string
  }

  type Item = {
    // 交易订单项 Id
    id: number
    // 用户 Id
    userId: number
    // 订单编号
    orderId: number
    // 商品 SPU Id
    spuId: number
    // 商品 SPU 名称
    spuName: string
    // 商品 SKU Id
    skuId: number
    // 商品图片
    picUrl: string
    // 购买数量
    count: number
    // 商品原价（单）
    price: number
    // 商品优惠（总）
    discountPrice: number
    // 商品实付金额（总）
    payPrice: number
    // 子订单分摊金额（总）
    orderPartPrice: number
    // 分摊后子订单实付金额（总）
    orderDividePrice: number
    // 售后状态
    afterSaleStatus: number
    // 属性列表
    properties: ProductPropertyValueDetailRespVO[]
  }

  type LocalTime = {
    hour?: number
    minute?: number
    second?: number
    nano?: number
  }

  type MemberUserRespVO = {
    // 用户 Id
    id: number
    // 用户昵称
    nickname: string
    // 用户头像
    avatar?: string
  }

  type OrderItem = {
    // 交易订单项 Id
    id: number
    // 用户 Id
    userId: number
    // 订单编号
    orderId: number
    // 商品 SPU Id
    spuId: number
    // 商品 SPU 名称
    spuName: string
    // 商品 SKU Id
    skuId: number
    // 商品图片
    picUrl: string
    // 购买数量
    count: number
    // 商品原价（单）
    price: number
    // 商品优惠（总）
    discountPrice: number
    // 商品实付金额（总）
    payPrice: number
    // 子订单分摊金额（总）
    orderPartPrice: number
    // 分摊后子订单实付金额（总）
    orderDividePrice: number
    // 售后状态
    afterSaleStatus: number
    properties?: ProductPropertyValueDetailRespVO[]
  }

  type OrderLog = {
    // 操作详情
    content: string
    // 创建时间
    createTime: string
    // 用户类型
    userType: number
  }

  type PageResultAfterSaleRespPageItemVO = {
    // 数据
    list: AfterSaleRespPageItemVO[]
    // 总量
    total: number
  }

  type PageResultBrokerageRecordRespVO = {
    // 数据
    list: BrokerageRecordRespVO[]
    // 总量
    total: number
  }

  type PageResultBrokerageUserRespVO = {
    // 数据
    list: BrokerageUserRespVO[]
    // 总量
    total: number
  }

  type PageResultBrokerageWithdrawRespVO = {
    // 数据
    list: BrokerageWithdrawRespVO[]
    // 总量
    total: number
  }

  type PageResultDeliveryExpressRespVO = {
    // 数据
    list: DeliveryExpressRespVO[]
    // 总量
    total: number
  }

  type PageResultDeliveryExpressTemplateRespVO = {
    // 数据
    list: DeliveryExpressTemplateRespVO[]
    // 总量
    total: number
  }

  type PageResultDeliveryPickUpStoreRespVO = {
    // 数据
    list: DeliveryPickUpStoreRespVO[]
    // 总量
    total: number
  }

  type PageResultTradeOrderPageItemRespVO = {
    // 数据
    list: TradeOrderPageItemRespVO[]
    // 总量
    total: number
  }

  type PayRefundNotifyReqDTO = {
    merchantOrderId: string
    merchantRefundId: string
    payRefundId: number
  }

  type PayTransferNotifyReqDTO = {
    merchantTransferId: string
    payTransferId: number
  }

  type pickUpOrderByIdParams = {
    // 交易订单编号
    id: number
  }

  type pickUpOrderByVerifyCodeParams = {
    // 自提核销码
    pickUpVerifyCode: string
  }

  type ProductPropertyValueDetailRespVO = {
    // 属性 Id
    propertyId: number
    // 属性名称
    propertyName: string
    // 属性值 Id
    valueId: number
    // 属性值名称
    valueName: string
  }

  type receiveAfterSaleParams = {
    // 售后编号
    id: number
  }

  type refundAfterSaleParams = {
    // 售后编号
    id: number
  }

  type refuseAfterSaleParams = {
    // 售后编号
    id: number
    // 收货备注
    refuseMemo: string
  }

  type TradeConfigRespVO = {
    // 售后的退款理由
    afterSaleRefundReasons: string[]
    // 售后的退货理由
    afterSaleReturnReasons: string[]
    // 是否启用全场包邮
    deliveryExpressFreeEnabled: boolean
    // 全场包邮的最小金额
    deliveryExpressFreePrice: number
    // 是否开启自提
    deliveryPickUpEnabled: boolean
    // 是否启用分佣
    brokerageEnabled: boolean
    // 分佣模式
    brokerageEnabledCondition: number
    // 分销关系绑定模式
    brokerageBindMode: number
    // 分销海报图地址数组
    brokeragePosterUrls: string[]
    // 一级返佣比例
    brokerageFirstPercent: number
    // 二级返佣比例
    brokerageSecondPercent: number
    // 用户提现最低金额
    brokerageWithdrawMinPrice: number
    // 用户提现手续费百分比
    brokerageWithdrawFeePercent: number
    // 佣金冻结时间（天）
    brokerageFrozenDays: number
    // 提现方式
    brokerageWithdrawTypes: number[]
    // Id
    id: number
    // 腾讯地图 KEY
    tencentLbsKey: string
  }

  type TradeConfigSaveReqVO = {
    // 售后的退款理由
    afterSaleRefundReasons: string[]
    // 售后的退货理由
    afterSaleReturnReasons: string[]
    // 是否启用全场包邮
    deliveryExpressFreeEnabled: boolean
    // 全场包邮的最小金额
    deliveryExpressFreePrice: number
    // 是否开启自提
    deliveryPickUpEnabled: boolean
    // 是否启用分佣
    brokerageEnabled: boolean
    // 分佣模式
    brokerageEnabledCondition: number
    // 分销关系绑定模式
    brokerageBindMode: number
    // 分销海报图地址数组
    brokeragePosterUrls: string[]
    // 一级返佣比例
    brokerageFirstPercent: number
    // 二级返佣比例
    brokerageSecondPercent: number
    // 用户提现最低金额
    brokerageWithdrawMinPrice: number
    // 用户提现手续费百分比
    brokerageWithdrawFeePercent: number
    // 佣金冻结时间（天）
    brokerageFrozenDays: number
    // 提现方式
    brokerageWithdrawTypes: number[]
  }

  type TradeOrderBaseVO = {
    // 订单编号
    id: number
    // 订单流水号
    no: string
    // 下单时间
    createTime: string
    // 订单类型
    type: number
    // 订单来源
    terminal: number
    // 用户编号
    userId: number
    // 用户 IP
    userIp: string
    // 用户备注
    userRemark: string
    // 订单状态
    status: number
    // 购买的商品数量
    productCount: number
    // 订单完成时间
    finishTime?: string
    // 订单取消时间
    cancelTime?: string
    // 取消类型
    cancelType?: number
    // 商家备注
    remark?: string
    // 支付订单编号
    payOrderId: number
    // 是否已支付
    payStatus: boolean
    // 付款时间
    payTime?: string
    // 支付渠道
    payChannelCode: string
    // 商品原价（总）
    totalPrice: number
    // 订单优惠（总）
    discountPrice: number
    // 运费金额
    deliveryPrice: number
    // 订单调价（总）
    adjustPrice: number
    // 应付金额（总）
    payPrice: number
    // 配送方式
    deliveryType?: number
    // 自提门店
    pickUpStoreId?: number
    // 自提核销码
    pickUpVerifyCode?: number
    // 配送模板编号
    deliveryTemplateId?: number
    // 发货物流公司编号
    logisticsId?: number
    // 发货物流单号
    logisticsNo?: string
    // 发货时间
    deliveryTime?: string
    // 收货时间
    receiveTime?: string
    // 收件人名称
    receiverName: string
    // 收件人手机
    receiverMobile: string
    // 收件人地区编号
    receiverAreaId: number
    // 收件人详细地址
    receiverDetailAddress: string
    // 售后状态
    afterSaleStatus?: number
    // 退款金额
    refundPrice: number
    // 优惠劵编号
    couponId?: number
    // 优惠劵减免金额
    couponPrice: number
    // 积分抵扣的金额
    pointPrice: number
    // VIP 减免金额
    vipPrice: number
    // 推广人 Id
    brokerageUserId?: number
  }

  type TradeOrderDeliveryReqVO = {
    // 订单编号
    id: number
    // 发货物流公司编号
    logisticsId: number
    // 发货物流单号
    logisticsNo?: string
  }

  type TradeOrderDetailRespVO = {
    // 订单编号
    id: number
    // 订单流水号
    no: string
    // 下单时间
    createTime: string
    // 订单类型
    type: number
    // 订单来源
    terminal: number
    // 用户编号
    userId: number
    // 用户 IP
    userIp: string
    // 用户备注
    userRemark: string
    // 订单状态
    status: number
    // 购买的商品数量
    productCount: number
    // 订单完成时间
    finishTime?: string
    // 订单取消时间
    cancelTime?: string
    // 取消类型
    cancelType?: number
    // 商家备注
    remark?: string
    // 支付订单编号
    payOrderId: number
    // 是否已支付
    payStatus: boolean
    // 付款时间
    payTime?: string
    // 支付渠道
    payChannelCode: string
    // 商品原价（总）
    totalPrice: number
    // 订单优惠（总）
    discountPrice: number
    // 运费金额
    deliveryPrice: number
    // 订单调价（总）
    adjustPrice: number
    // 应付金额（总）
    payPrice: number
    // 配送方式
    deliveryType?: number
    // 自提门店
    pickUpStoreId?: number
    // 自提核销码
    pickUpVerifyCode?: number
    // 配送模板编号
    deliveryTemplateId?: number
    // 发货物流公司编号
    logisticsId?: number
    // 发货物流单号
    logisticsNo?: string
    // 发货时间
    deliveryTime?: string
    // 收货时间
    receiveTime?: string
    // 收件人名称
    receiverName: string
    // 收件人手机
    receiverMobile: string
    // 收件人地区编号
    receiverAreaId: number
    // 收件人详细地址
    receiverDetailAddress: string
    // 售后状态
    afterSaleStatus?: number
    // 退款金额
    refundPrice: number
    // 优惠劵编号
    couponId?: number
    // 优惠劵减免金额
    couponPrice: number
    // 积分抵扣的金额
    pointPrice: number
    // VIP 减免金额
    vipPrice: number
    // 推广人 Id
    brokerageUserId?: number
    items?: Item[]
    user?: MemberUserRespVO
    brokerageUser?: MemberUserRespVO
    logs?: OrderLog[]
    // 收件人地区名字
    receiverAreaName: string
  }

  type TradeOrderPageItemRespVO = {
    // 订单编号
    id: number
    // 订单流水号
    no: string
    // 下单时间
    createTime: string
    // 订单类型
    type: number
    // 订单来源
    terminal: number
    // 用户编号
    userId: number
    // 用户 IP
    userIp: string
    // 用户备注
    userRemark: string
    // 订单状态
    status: number
    // 购买的商品数量
    productCount: number
    // 订单完成时间
    finishTime?: string
    // 订单取消时间
    cancelTime?: string
    // 取消类型
    cancelType?: number
    // 商家备注
    remark?: string
    // 支付订单编号
    payOrderId: number
    // 是否已支付
    payStatus: boolean
    // 付款时间
    payTime?: string
    // 支付渠道
    payChannelCode: string
    // 商品原价（总）
    totalPrice: number
    // 订单优惠（总）
    discountPrice: number
    // 运费金额
    deliveryPrice: number
    // 订单调价（总）
    adjustPrice: number
    // 应付金额（总）
    payPrice: number
    // 配送方式
    deliveryType?: number
    // 自提门店
    pickUpStoreId?: number
    // 自提核销码
    pickUpVerifyCode?: number
    // 配送模板编号
    deliveryTemplateId?: number
    // 发货物流公司编号
    logisticsId?: number
    // 发货物流单号
    logisticsNo?: string
    // 发货时间
    deliveryTime?: string
    // 收货时间
    receiveTime?: string
    // 收件人名称
    receiverName: string
    // 收件人手机
    receiverMobile: string
    // 收件人地区编号
    receiverAreaId: number
    // 收件人详细地址
    receiverDetailAddress: string
    // 售后状态
    afterSaleStatus?: number
    // 退款金额
    refundPrice: number
    // 优惠劵编号
    couponId?: number
    // 优惠劵减免金额
    couponPrice: number
    // 积分抵扣的金额
    pointPrice: number
    // VIP 减免金额
    vipPrice: number
    // 推广人 Id
    brokerageUserId?: number
    // 收件人地区名字
    receiverAreaName: string
    // 订单项列表
    items: Item[]
    user: MemberUserRespVO
    brokerageUser?: MemberUserRespVO
  }

  type TradeOrderRemarkReqVO = {
    // 订单 Id
    id: number
    // 商家备注
    remark: string
  }

  type TradeOrderSummaryRespVO = {
    // 订单数量
    orderCount: number
    // 订单金额
    orderPayPrice: number
    // 退款单数
    afterSaleCount: number
    // 退款金额
    afterSalePrice: number
  }

  type TradeOrderUpdateAddressReqVO = {
    // 订单编号
    id: number
    // 收件人名称
    receiverName: string
    // 收件人手机
    receiverMobile: string
    // 收件人地区编号
    receiverAreaId: number
    // 收件人详细地址
    receiverDetailAddress: string
  }

  type TradeOrderUpdatePriceReqVO = {
    // 订单 Id
    id: number
    // 订单调价，单位：分。正数，加价；负数，减价
    adjustPrice: number
  }

  type UserSimpleBaseVO = {
    // 用户 Id
    id: number
    // 用户昵称
    nickname: string
    // 用户头像
    avatar?: string
  }
}
