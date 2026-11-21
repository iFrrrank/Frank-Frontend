declare namespace API {
  // 数据对照：value 为本期数据，reference 为对照期数据
  type StatisticsComparison<T> = {
    value: T
    reference: T
  }

  type MemberAnalyseComparisonRespVO = {
    // 注册用户数
    registerUserCount: number
    // 访问用户数
    visitUserCount: number
    // 充值用户数
    rechargeUserCount: number
  }

  type MemberAnalyseRespVO = {
    // 访问用户数
    visitUserCount: number
    // 下单用户数
    orderUserCount: number
    // 支付用户数
    payUserCount: number
    // 客单价，单位：分
    atv: number
    // 对照数据
    comparison: StatisticsComparison<MemberAnalyseComparisonRespVO>
  }

  type MemberAreaStatisticsRespVO = {
    // 地区编号
    areaId: number
    // 地区名称
    areaName: string
    // 用户数
    userCount: number
    // 下单用户数
    orderCreateUserCount: number
    // 支付用户数
    orderPayUserCount: number
    // 支付金额，单位：分
    orderPayPrice: number
  }

  type MemberSexStatisticsRespVO = {
    // 性别
    sex: number
    // 用户数
    userCount: number
  }

  type MemberSummaryRespVO = {
    // 用户数
    userCount: number
    // 充值用户数
    rechargeUserCount: number
    // 充值金额，单位：分
    rechargePrice: number
    // 消费金额，单位：分
    expensePrice: number
  }

  type MemberTerminalStatisticsRespVO = {
    // 终端
    terminal: number
    // 用户数
    userCount: number
  }

  type MemberCountRespVO = {
    // 访问用户数
    visitUserCount: string
    // 注册用户数
    registerUserCount: number
  }

  type MemberRegisterCountRespVO = {
    // 日期
    date: string
    // 注册数量
    count: number
  }

  type TradeSummaryRespVO = {
    // 昨日订单量
    yesterdayOrderCount: number
    // 本月订单量
    monthOrderCount: number
    // 昨日支付金额，单位：分
    yesterdayPayPrice: number
    // 本月支付金额，单位：分
    monthPayPrice: number
  }

  type TradeTrendSummaryRespVO = {
    // 时间
    time: string
    // 营业额，单位：分
    turnoverPrice: number
    // 订单支付金额，单位：分
    orderPayPrice: number
    // 充值金额，单位：分
    rechargePrice: number
    // 支出金额，单位：分
    expensePrice: number
    // 钱包支付金额，单位：分
    walletPayPrice: number
    // 佣金结算金额，单位：分
    brokerageSettlementPrice: number
    // 售后退款金额，单位：分
    afterSaleRefundPrice: number
  }

  type TradeOrderCountRespVO = {
    // 待发货订单数
    undelivered?: number
    // 待核销订单数
    pickUp?: number
    // 退款中售后数
    afterSaleApply?: number
    // 提现待审核数
    auditingWithdraw?: number
  }

  type TradeOrderSummaryRespVO = {
    // 支付订单数
    orderPayCount?: number
    // 支付金额，单位：分
    orderPayPrice?: number
  }

  type TradeOrderTrendRespVO = {
    // 日期
    date: string
    // 订单数量
    orderPayCount: number
    // 订单支付金额，单位：分
    orderPayPrice: number
  }

  type ProductStatisticsRespVO = {
    // 编号
    id: number
    // 日期
    day: string
    // 商品 SPU 编号
    spuId: number
    // 商品名称
    spuName: string
    // 商品图片
    spuPicUrl: string
    // 浏览量
    browseCount: number
    // 浏览用户数
    browseUserCount: number
    // 收藏数
    favoriteCount: number
    // 加购数
    cartCount: number
    // 下单数
    orderCount: number
    // 支付数
    orderPayCount: number
    // 支付金额，单位：分
    orderPayPrice: number
    // 售后数
    afterSaleCount: number
    // 售后退款金额，单位：分
    afterSaleRefundPrice: number
    // 浏览转化率
    browseConvertPercent: number
  }

  type PageResultProductStatisticsRespVO = {
    // 数据
    list: ProductStatisticsRespVO[]
    // 总量
    total: number
  }

  type PaySummaryRespVO = {
    // 钱包充值金额，单位：分
    rechargePrice: number
  }

  type CommonResultMemberSummaryRespVO = {
    code?: number
    data?: MemberSummaryRespVO
    msg?: string
  }

  type CommonResultMemberAnalyseRespVO = {
    code?: number
    data?: MemberAnalyseRespVO
    msg?: string
  }

  type CommonResultListMemberAreaStatisticsRespVO = {
    code?: number
    data?: MemberAreaStatisticsRespVO[]
    msg?: string
  }

  type CommonResultListMemberSexStatisticsRespVO = {
    code?: number
    data?: MemberSexStatisticsRespVO[]
    msg?: string
  }

  type CommonResultListMemberTerminalStatisticsRespVO = {
    code?: number
    data?: MemberTerminalStatisticsRespVO[]
    msg?: string
  }

  type CommonResultMemberCountComparisonRespVO = {
    code?: number
    data?: StatisticsComparison<MemberCountRespVO>
    msg?: string
  }

  type CommonResultListMemberRegisterCountRespVO = {
    code?: number
    data?: MemberRegisterCountRespVO[]
    msg?: string
  }

  type CommonResultTradeSummaryComparisonRespVO = {
    code?: number
    data?: StatisticsComparison<TradeSummaryRespVO>
    msg?: string
  }

  type CommonResultTradeTrendComparisonRespVO = {
    code?: number
    data?: StatisticsComparison<TradeTrendSummaryRespVO>
    msg?: string
  }

  type CommonResultListTradeTrendSummaryRespVO = {
    code?: number
    data?: TradeTrendSummaryRespVO[]
    msg?: string
  }

  type CommonResultTradeOrderCountRespVO = {
    code?: number
    data?: TradeOrderCountRespVO
    msg?: string
  }

  type CommonResultTradeOrderComparisonRespVO = {
    code?: number
    data?: StatisticsComparison<TradeOrderSummaryRespVO>
    msg?: string
  }

  type CommonResultListTradeOrderTrendComparisonRespVO = {
    code?: number
    data?: StatisticsComparison<TradeOrderTrendRespVO>[]
    msg?: string
  }

  type CommonResultProductStatisticsComparisonRespVO = {
    code?: number
    data?: StatisticsComparison<ProductStatisticsRespVO>
    msg?: string
  }

  type CommonResultListProductStatisticsRespVO = {
    code?: number
    data?: ProductStatisticsRespVO[]
    msg?: string
  }

  type CommonResultPageResultProductStatisticsRespVO = {
    code?: number
    data?: PageResultProductStatisticsRespVO
    msg?: string
  }

  type CommonResultPaySummaryRespVO = {
    code?: number
    data?: PaySummaryRespVO
    msg?: string
  }

  // 统计接口的 times 参数：[开始时间, 结束时间]，格式 yyyy-MM-dd HH:mm:ss
  type StatisticsTimesParams = {
    times: string[]
  }

  type getProductStatisticsRankPageParams = {
    pageReqVO: PageParam & {
      times?: string[]
    }
  }
}
