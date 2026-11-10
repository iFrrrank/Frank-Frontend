declare namespace API {
  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultListPayAppRespVO = {
    code?: number
    data?: PayAppRespVO[]
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultPageResultPayAppPageItemRespVO = {
    code?: number
    data?: PageResultPayAppPageItemRespVO
    msg?: string
  }

  type CommonResultPageResultPayNotifyTaskRespVO = {
    code?: number
    data?: PageResultPayNotifyTaskRespVO
    msg?: string
  }

  type CommonResultPageResultPayOrderPageItemRespVO = {
    code?: number
    data?: PageResultPayOrderPageItemRespVO
    msg?: string
  }

  type CommonResultPageResultPayRefundPageItemRespVO = {
    code?: number
    data?: PageResultPayRefundPageItemRespVO
    msg?: string
  }

  type CommonResultPageResultPayTransferRespVO = {
    code?: number
    data?: PageResultPayTransferRespVO
    msg?: string
  }

  type CommonResultPageResultPayWalletRespVO = {
    code?: number
    data?: PageResultPayWalletRespVO
    msg?: string
  }

  type CommonResultPageResultPayWalletTransactionRespVO = {
    code?: number
    data?: PageResultPayWalletTransactionRespVO
    msg?: string
  }

  type CommonResultPageResultWalletRechargePackageRespVO = {
    code?: number
    data?: PageResultWalletRechargePackageRespVO
    msg?: string
  }

  type CommonResultPayAppRespVO = {
    code?: number
    data?: PayAppRespVO
    msg?: string
  }

  type CommonResultPayChannelRespVO = {
    code?: number
    data?: PayChannelRespVO
    msg?: string
  }

  type CommonResultPayNotifyTaskDetailRespVO = {
    code?: number
    data?: PayNotifyTaskDetailRespVO
    msg?: string
  }

  type CommonResultPayOrderDetailsRespVO = {
    code?: number
    data?: PayOrderDetailsRespVO
    msg?: string
  }

  type CommonResultPayOrderRespDTO = {
    code?: number
    data?: PayOrderRespDTO
    msg?: string
  }

  type CommonResultPayOrderRespVO = {
    code?: number
    data?: PayOrderRespVO
    msg?: string
  }

  type CommonResultPayOrderSubmitRespVO = {
    code?: number
    data?: PayOrderSubmitRespVO
    msg?: string
  }

  type CommonResultPayRefundDetailsRespVO = {
    code?: number
    data?: PayRefundDetailsRespVO
    msg?: string
  }

  type CommonResultPayRefundRespDTO = {
    code?: number
    data?: PayRefundRespDTO
    msg?: string
  }

  type CommonResultPayTransferCreateRespDTO = {
    code?: number
    data?: PayTransferCreateRespDTO
    msg?: string
  }

  type CommonResultPayTransferRespDTO = {
    code?: number
    data?: PayTransferRespDTO
    msg?: string
  }

  type CommonResultPayTransferRespVO = {
    code?: number
    data?: PayTransferRespVO
    msg?: string
  }

  type CommonResultPayWalletRespDTO = {
    code?: number
    data?: PayWalletRespDTO
    msg?: string
  }

  type CommonResultPayWalletRespVO = {
    code?: number
    data?: PayWalletRespVO
    msg?: string
  }

  type CommonResultSetString = {
    code?: number
    data?: string[]
    msg?: string
  }

  type CommonResultWalletRechargePackageRespVO = {
    code?: number
    data?: WalletRechargePackageRespVO
    msg?: string
  }

  type deleteAppParams = {
    // 支付应用 Id
    id: number
  }

  type deleteChannelParams = {
    // 支付渠道 Id
    id: number
  }

  type deleteWalletRechargePackageParams = {
    // 充值套餐 Id
    id: number
  }

  type exportOrderExcelParams = {
    exportReqVO: PayOrderExportReqVO
  }

  type exportRefundExcelParams = {
    exportReqVO: PayRefundExportReqVO
  }

  type exportTransferParams = {
    // 转账单号
    no?: string
    // 应用编号
    appId?: string
    // 渠道编码
    channelCode?: string
    // 商户转账单编号
    merchantOrderId?: string
    // 转账状态
    status?: string
    // 收款人姓名
    userName?: string
    // 收款人账号
    userAccount?: string
    // 渠道转账单号
    channelTransferNo?: string
    // 创建时间
    createTime?: string
    // 页码，从 1 开始
    pageNo: string
    // 每页条数，最大值为 100
    pageSize: string
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

  type getAppPageParams = {
    pageVO: PayAppPageReqVO
  }

  type getAppParams = {
    // 支付应用 Id
    id: number
  }

  type getChannelParams = {
    // 支付渠道 Id
    id: number
    appId?: number
    code?: string
  }

  type getEnableChannelCodeListParams = {
    // 支付应用 Id
    appId: number
  }

  type getNotifyTaskDetailParams = {
    // 通知 Id
    id: number
  }

  type getNotifyTaskPageParams = {
    pageVO: PayNotifyTaskPageReqVO
  }

  type getOrCreateWalletParams = {
    // 用户 Id
    userId: number
    // 用户类型
    userType: number
  }

  type getOrder1Params = {
    // 支付订单号
    id: number
    // 是否同步
    sync?: boolean
  }

  type getOrderDetailParams = {
    // 编号
    id: number
  }

  type getOrderPageParams = {
    pageVO: PayOrderPageReqVO
  }

  type getOrderParams = {
    // 支付单编号
    id: number
  }

  type getRefund1Params = {
    // 订单编号
    id: number
  }

  type getRefundPageParams = {
    pageVO: PayRefundPageReqVO
  }

  type getRefundParams = {
    // 退款单编号
    id: number
  }

  type getTransfer1Params = {
    id: number
  }

  type getTransferPageParams = {
    pageVO: PayTransferPageReqVO
  }

  type getTransferParams = {
    // 转账单 Id
    id: number
  }

  type getWalletPageParams = {
    pageVO: PayWalletPageReqVO
  }

  type getWalletParams = {
    // 用户 Id
    userId: string
  }

  type getWalletRechargePackagePageParams = {
    pageVO: WalletRechargePackagePageReqVO
  }

  type getWalletRechargePackageParams = {
    // 充值套餐 Id
    id: number
  }

  type getWalletTransactionPageParams = {
    pageReqVO: PayWalletTransactionPageReqVO
  }

  type Log = {
    // 日志 Id
    id: number
    // 通知状态
    status: string
    // 当前通知次数
    notifyTimes: string
    // HTTP 响应结果
    response: string
    // 创建时间
    createTime: string
  }

  type notifyOrderParams = {
    channelId: number
  }

  type notifyRefundParams = {
    channelId: number
  }

  type notifyTransferParams = {
    channelId: number
  }

  type Order = {
    // 商品标题
    subject: string
  }

  type PageResultPayAppPageItemRespVO = {
    // 数据
    list: PayAppPageItemRespVO[]
    // 总量
    total: number
  }

  type PageResultPayNotifyTaskRespVO = {
    // 数据
    list: PayNotifyTaskRespVO[]
    // 总量
    total: number
  }

  type PageResultPayOrderPageItemRespVO = {
    // 数据
    list: PayOrderPageItemRespVO[]
    // 总量
    total: number
  }

  type PageResultPayRefundPageItemRespVO = {
    // 数据
    list: PayRefundPageItemRespVO[]
    // 总量
    total: number
  }

  type PageResultPayTransferRespVO = {
    // 数据
    list: PayTransferRespVO[]
    // 总量
    total: number
  }

  type PageResultPayWalletRespVO = {
    // 数据
    list: PayWalletRespVO[]
    // 总量
    total: number
  }

  type PageResultPayWalletTransactionRespVO = {
    // 数据
    list: PayWalletTransactionRespVO[]
    // 总量
    total: number
  }

  type PageResultWalletRechargePackageRespVO = {
    // 数据
    list: WalletRechargePackageRespVO[]
    // 总量
    total: number
  }

  type PayAppCreateReqVO = {
    // 应用标识
    appKey: string
    // 应用名
    name: string
    // 开启状态
    status: number
    // 备注
    remark?: string
    // 支付结果的回调地址
    orderNotifyUrl: string
    // 退款结果的回调地址
    refundNotifyUrl: string
    // 转账结果的回调地址
    transferNotifyUrl?: string
  }

  type PayAppPageItemRespVO = {
    // 应用标识
    appKey: string
    // 应用名
    name: string
    // 开启状态
    status: number
    // 备注
    remark?: string
    // 支付结果的回调地址
    orderNotifyUrl: string
    // 退款结果的回调地址
    refundNotifyUrl: string
    // 转账结果的回调地址
    transferNotifyUrl?: string
    // 支付应用 Id
    id: number
    // 创建时间
    createTime: string
    // 已配置的支付渠道编码
    channelCodes: string[]
  }

  type PayAppPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 应用名
    name?: string
    // 应用标识
    appKey?: string
    // 开启状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type PayAppRespVO = {
    // 应用标识
    appKey: string
    // 应用名
    name: string
    // 开启状态
    status: number
    // 备注
    remark?: string
    // 支付结果的回调地址
    orderNotifyUrl: string
    // 退款结果的回调地址
    refundNotifyUrl: string
    // 转账结果的回调地址
    transferNotifyUrl?: string
    // 支付应用 Id
    id: number
    // 创建时间
    createTime: string
  }

  type PayAppUpdateReqVO = {
    // 应用标识
    appKey: string
    // 应用名
    name: string
    // 开启状态
    status: number
    // 备注
    remark?: string
    // 支付结果的回调地址
    orderNotifyUrl: string
    // 退款结果的回调地址
    refundNotifyUrl: string
    // 转账结果的回调地址
    transferNotifyUrl?: string
    // 支付应用 Id
    id: number
  }

  type PayAppUpdateStatusReqVO = {
    // 支付应用 Id
    id: number
    // 状态，见 SysCommonStatusEnum 枚举
    status: number
  }

  type PayChannelCreateReqVO = {
    // 开启状态
    status: number
    // 备注
    remark?: string
    // 渠道费率，单位：百分比
    feeRate: number
    // 应用 Id
    appId: number
    // 渠道编码
    code: string
    // 渠道配置的 json 字符串
    config: string
  }

  type PayChannelRespVO = {
    // 开启状态
    status: number
    // 备注
    remark?: string
    // 渠道费率，单位：百分比
    feeRate: number
    // 应用 Id
    appId: number
    // 商户 Id
    id: number
    // 创建时间
    createTime: string
    // 渠道编码
    code: string
    // 配置
    config: string
  }

  type PayChannelUpdateReqVO = {
    // 开启状态
    status: number
    // 备注
    remark?: string
    // 渠道费率，单位：百分比
    feeRate: number
    // 应用 Id
    appId: number
    // 商户 Id
    id: number
    // 渠道配置的 json 字符串
    config: string
  }

  type PayNotifyTaskDetailRespVO = {
    // Id
    id: number
    // 应用 Id
    appId: number
    // 应用名称
    appName?: string
    // 通知类型
    type: string
    // 数据编号
    dataId: number
    // 商户订单编号
    merchantOrderId?: string
    // 商户退款编号
    merchantRefundId?: string
    // 商户转账编号
    merchantTransferId?: string
    // 通知状态
    status: string
    // 下一次通知时间
    nextNotifyTime: string
    // 最后一次执行时间
    lastExecuteTime: string
    // 当前通知次数
    notifyTimes: string
    // 最大可通知次数
    maxNotifyTimes: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
    // 回调日志列表
    logs?: Log[]
  }

  type PayNotifyTaskPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 应用 Id
    appId?: number
    // 通知类型
    type?: number
    // 数据编号
    dataId?: number
    // 通知状态
    status?: number
    // 商户订单编号
    merchantOrderId?: string
    // 商户退款编号
    merchantRefundId?: string
    // 商户转账编号
    merchantTransferId?: string
    // 创建时间
    createTime?: string[]
  }

  type PayNotifyTaskRespVO = {
    // Id
    id: number
    // 应用 Id
    appId: number
    // 应用名称
    appName?: string
    // 通知类型
    type: string
    // 数据编号
    dataId: number
    // 商户订单编号
    merchantOrderId?: string
    // 商户退款编号
    merchantRefundId?: string
    // 商户转账编号
    merchantTransferId?: string
    // 通知状态
    status: string
    // 下一次通知时间
    nextNotifyTime: string
    // 最后一次执行时间
    lastExecuteTime: string
    // 当前通知次数
    notifyTimes: string
    // 最大可通知次数
    maxNotifyTimes: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
  }

  type PayOrderCreateReqDTO = {
    appKey: string
    userIp: string
    userId?: number
    userType?: number
    merchantOrderId: string
    subject: string
    body?: string
    price: number
    expireTime: string
  }

  type PayOrderDetailsRespVO = {
    // 应用 Id
    appId: number
    // 支付渠道 Id
    channelId?: number
    // 支付渠道编码
    channelCode?: string
    // 商户订单号
    merchantOrderId: string
    // 商品标题
    subject: string
    // 商品描述
    body: string
    // 异步通知地址
    notifyUrl: string
    // 支付金额，单位：分
    price: number
    // 渠道手续费，单位：百分比
    channelFeeRate?: number
    // 渠道手续金额，单位：分
    channelFeePrice?: number
    // 支付状态
    status: number
    // 用户 IP
    userIp: string
    // 订单失效时间
    expireTime: string
    // 订单支付成功时间
    successTime?: string
    // 支付成功的订单拓展单编号
    extensionId?: number
    // 支付订单号
    no?: string
    // 退款总金额，单位：分
    refundPrice: number
    // 渠道用户编号
    channelUserId?: string
    // 渠道订单号
    channelOrderNo?: string
    // 支付订单号
    id: number
    // 应用名称
    appName: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
    extension?: PayOrderExtension
  }

  type PayOrderExportReqVO = {
    // 应用 Id
    appId?: number
    // 支付渠道编码
    channelCode?: string
    // 商户订单编号
    merchantOrderId?: string
    // 支付渠道编号
    channelOrderNo?: string
    // 支付单号
    no?: string
    // 支付状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type PayOrderExtension = {
    // 支付订单号
    no: string
    // 支付异步通知的内容
    channelNotifyData?: string
  }

  type PayOrderNotifyReqDTO = {
    merchantOrderId: string
    payOrderId: number
  }

  type PayOrderPageItemRespVO = {
    // 应用 Id
    appId: number
    // 支付渠道 Id
    channelId?: number
    // 支付渠道编码
    channelCode?: string
    // 商户订单号
    merchantOrderId: string
    // 商品标题
    subject: string
    // 商品描述
    body: string
    // 异步通知地址
    notifyUrl: string
    // 支付金额，单位：分
    price: number
    // 渠道手续费，单位：百分比
    channelFeeRate?: number
    // 渠道手续金额，单位：分
    channelFeePrice?: number
    // 支付状态
    status: number
    // 用户 IP
    userIp: string
    // 订单失效时间
    expireTime: string
    // 订单支付成功时间
    successTime?: string
    // 支付成功的订单拓展单编号
    extensionId?: number
    // 支付订单号
    no?: string
    // 退款总金额，单位：分
    refundPrice: number
    // 渠道用户编号
    channelUserId?: string
    // 渠道订单号
    channelOrderNo?: string
    // 支付订单号
    id: number
    // 创建时间
    createTime: string
    // 应用名称
    appName?: string
  }

  type PayOrderPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 应用 Id
    appId?: number
    // 支付渠道编码
    channelCode?: string
    // 商户订单编号
    merchantOrderId?: string
    // 支付渠道 Id
    channelOrderNo?: string
    // 支付单号
    no?: string
    // 支付状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type PayOrderRespDTO = {
    id?: number
    channelCode?: string
    merchantOrderId?: string
    subject?: string
    price?: number
    status?: number
    successTime?: string
    channelUserId?: string
    channelOrderNo?: string
  }

  type PayOrderRespVO = {
    // 应用 Id
    appId: number
    // 支付渠道 Id
    channelId?: number
    // 支付渠道编码
    channelCode?: string
    // 商户订单号
    merchantOrderId: string
    // 商品标题
    subject: string
    // 商品描述
    body: string
    // 异步通知地址
    notifyUrl: string
    // 支付金额，单位：分
    price: number
    // 渠道手续费，单位：百分比
    channelFeeRate?: number
    // 渠道手续金额，单位：分
    channelFeePrice?: number
    // 支付状态
    status: number
    // 用户 IP
    userIp: string
    // 订单失效时间
    expireTime: string
    // 订单支付成功时间
    successTime?: string
    // 支付成功的订单拓展单编号
    extensionId?: number
    // 支付订单号
    no?: string
    // 退款总金额，单位：分
    refundPrice: number
    // 渠道用户编号
    channelUserId?: string
    // 渠道订单号
    channelOrderNo?: string
    // 支付订单号
    id: number
    // 创建时间
    createTime: string
  }

  type PayOrderSubmitReqVO = {
    // 支付单号
    id: number
    // 支付渠道
    channelCode: string
    // 支付渠道的额外参数，例如，微信公众号需要传递 openid 参数
    channelExtras?: Record<string, any>
    // 展示模式
    displayMode?: string
    // 回跳地址
    returnUrl?: string
  }

  type PayOrderSubmitRespVO = {
    // 支付状态，参见 PayOrderStatusEnum 枚举
    status: number
    // 展示模式，参见 PayDisplayModeEnum 枚举
    displayMode: string
    // 展示内容
    displayContent: string
  }

  type PayRefundCreateReqDTO = {
    appKey: string
    userIp: string
    userId?: number
    userType?: number
    merchantOrderId: string
    merchantRefundId: string
    reason: string
    price: number
  }

  type PayRefundDetailsRespVO = {
    // 外部退款号
    no: string
    // 应用编号
    appId: number
    // 渠道编号
    channelId: number
    // 渠道编码
    channelCode: string
    // 订单编号
    orderId: number
    // 商户订单编号
    merchantOrderId: string
    // 商户退款订单号
    merchantRefundId: string
    // 异步通知地址
    notifyUrl: string
    // 退款状态
    status: number
    // 支付金额
    payPrice: number
    // 退款金额,单位分
    refundPrice: number
    // 退款原因
    reason: string
    // 用户 IP
    userIp: string
    // 渠道订单号
    channelOrderNo: string
    // 渠道退款单号
    channelRefundNo?: string
    // 退款成功时间
    successTime?: string
    // 调用渠道的错误码
    channelErrorCode?: string
    // 调用渠道的错误提示
    channelErrorMsg?: string
    // 支付渠道的额外参数
    channelNotifyData?: string
    // 支付退款编号
    id: number
    // 应用名称
    appName: string
    order: Order
    // 创建时间
    createTime?: string
    // 更新时间
    updateTime?: string
  }

  type PayRefundExportReqVO = {
    // 应用编号
    appId?: number
    // 渠道编码
    channelCode?: string
    // 商户支付单号
    merchantOrderId?: string
    // 商户退款单号
    merchantRefundId?: string
    // 渠道支付单号
    channelOrderNo?: string
    // 渠道退款单号
    channelRefundNo?: string
    // 退款状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type PayRefundNotifyReqDTO = {
    merchantOrderId: string
    merchantRefundId: string
    payRefundId: number
  }

  type PayRefundPageItemRespVO = {
    // 外部退款号
    no: string
    // 应用编号
    appId: number
    // 渠道编号
    channelId: number
    // 渠道编码
    channelCode: string
    // 订单编号
    orderId: number
    // 商户订单编号
    merchantOrderId: string
    // 商户退款订单号
    merchantRefundId: string
    // 异步通知地址
    notifyUrl: string
    // 退款状态
    status: number
    // 支付金额
    payPrice: number
    // 退款金额,单位分
    refundPrice: number
    // 退款原因
    reason: string
    // 用户 IP
    userIp: string
    // 渠道订单号
    channelOrderNo: string
    // 渠道退款单号
    channelRefundNo?: string
    // 退款成功时间
    successTime?: string
    // 调用渠道的错误码
    channelErrorCode?: string
    // 调用渠道的错误提示
    channelErrorMsg?: string
    // 支付渠道的额外参数
    channelNotifyData?: string
    // 支付订单编号
    id: number
    // 应用名称
    appName: string
    // 创建时间
    createTime: string
  }

  type PayRefundPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 应用 Id
    appId?: number
    // 渠道编码
    channelCode?: string
    // 商户支付单号
    merchantOrderId?: string
    // 商户退款单号
    merchantRefundId?: string
    // 渠道支付单号
    channelOrderNo?: string
    // 渠道退款单号
    channelRefundNo?: string
    // 退款状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type PayRefundRespDTO = {
    id?: number
    channelCode?: string
    status?: number
    refundPrice?: number
    merchantOrderId?: string
    merchantRefundId?: string
    successTime?: string
    channelErrorCode?: string
    channelErrorMsg?: string
  }

  type PayTransferCreateReqDTO = {
    appKey: string
    userIp: string
    userId?: number
    userType?: number
    merchantTransferId: string
    price: number
    subject: string
    userAccount: string
    userName?: string
    channelCode: string
    channelExtras?: Record<string, any>
  }

  type PayTransferCreateRespDTO = {
    id?: number
    channelPackageInfo?: string
  }

  type PayTransferPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 转账单号
    no?: string
    // 应用编号
    appId?: number
    // 渠道编码
    channelCode?: string
    // 商户转账单编号
    merchantOrderId?: string
    // 转账状态
    status?: number
    // 收款人姓名
    userName?: string
    // 收款人账号
    userAccount?: string
    // 渠道转账单号
    channelTransferNo?: string
    // 创建时间
    createTime?: string[]
  }

  type PayTransferRespDTO = {
    id?: number
    no?: string
    channelCode?: string
    merchantTransferId?: string
    price?: number
    status?: number
    successTime?: string
    channelErrorCode?: string
    channelErrorMsg?: string
    channelPackageInfo?: string
    channelMchId?: string
  }

  type PayTransferRespVO = {
    // 转账单编号
    id: number
    // 转账单号
    no: string
    // 应用编号
    appId: number
    // 应用名称
    appName: string
    // 转账渠道编号
    channelId: number
    // 转账渠道编码
    channelCode: string
    // 商户转账单编号
    merchantTransferId: string
    // 转账状态
    status: number
    // 转账成功时间
    successTime?: string
    // 转账金额
    price: number
    // 转账标题
    subject: string
    // 收款人姓名
    userName?: string
    // 收款人账号
    userAccount: string
    // 异步通知商户地址
    notifyUrl: string
    // 用户 IP
    userIp: string
    // 渠道的额外参数
    channelExtras?: Record<string, any>
    // 渠道转账单号
    channelTransferNo?: string
    // 调用渠道的错误码
    channelErrorCode?: string
    // 调用渠道的错误提示
    channelErrorMsg?: string
    // 渠道的同步/异步通知的内容
    channelNotifyData?: string
    // 创建时间
    createTime: string
  }

  type PayWalletAddBalanceReqDTO = {
    userId: number
    userType: number
    bizType: number
    bizId: string
    price: number
  }

  type PayWalletPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户 Id
    userId?: number
    // 用户类型
    userType?: number
    // 创建时间
    createTime?: string[]
  }

  type PayWalletRespDTO = {
    id?: number
    userId?: number
    userType?: number
    balance?: number
    freezePrice?: number
    totalExpense?: number
    totalRecharge?: number
  }

  type PayWalletRespVO = {
    // 用户 Id
    userId: number
    // 用户类型
    userType: number
    // 余额，单位分
    balance: number
    // 累计支出，单位分
    totalExpense: number
    // 累计充值，单位分
    totalRecharge: number
    // 冻结金额，单位分
    freezePrice: number
    // 钱包 Id
    id: number
    // 创建时间
    createTime: string
  }

  type PayWalletTransactionPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 钱包 Id
    walletId?: number
    // 用户 Id
    userId?: number
    // 用户类型
    userType?: number
  }

  type PayWalletTransactionRespVO = {
    // 编号
    id: number
    // 钱包 Id
    walletId: number
    // 业务分类
    bizType: number
    // 交易金额，单位：分
    price: number
    // 流水标题
    title: string
    // 交易后的余额，单位：分
    balance: number
    // 交易时间
    createTime: string
  }

  type PayWalletUpdateBalanceReqVO = {
    // 用户 Id
    userId: number
    // 变动余额，正数为增加，负数为减少
    balance: number
  }

  type refundWalletRechargeParams = {
    // 钱包 Id
    id: number
  }

  type updatePayOrderPriceParams = {
    // 支付单编号
    id: number
    // 支付单价格
    payPrice: number
  }

  type WalletRechargePackageCreateReqVO = {
    // 套餐名
    name: string
    // 支付金额
    payPrice: number
    // 赠送金额
    bonusPrice: number
    // 状态
    status: number
  }

  type WalletRechargePackagePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 套餐名
    name?: string
    // 状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type WalletRechargePackageRespVO = {
    // 套餐名
    name: string
    // 支付金额
    payPrice: number
    // 赠送金额
    bonusPrice: number
    // 状态
    status: number
    // 充值套餐 Id
    id: number
    // 创建时间
    createTime: string
  }

  type WalletRechargePackageUpdateReqVO = {
    // 套餐名
    name: string
    // 支付金额
    payPrice: number
    // 赠送金额
    bonusPrice: number
    // 状态
    status: number
    // 充值套餐 Id
    id: number
  }
}
