declare namespace API {
  type BargainValidateJoinRespDTO = {
    activityId?: number
    name?: string
    bargainPrice?: number
  }

  type closeCombinationActivityParams = {
    // 拼团活动 Id
    id: number
  }

  type closeRewardActivity1Params = {
    // 限时折扣活动 Id
    id: number
  }

  type closeRewardActivityParams = {
    // 满减送活动 Id
    id: number
  }

  type closeSeckillActivity1Params = {
    // 砍价活动 Id
    id: number
  }

  type closeSeckillActivityParams = {
    // 秒杀活动 Id
    id: number
  }

  type CombinationRecordCreateReqDTO = {
    activityId: number
    spuId: number
    skuId: number
    count: number
    orderId: number
    userId: number
    headId?: number
    combinationPrice: number
  }

  type CombinationRecordCreateRespDTO = {
    combinationActivityId?: number
    combinationHeadId?: number
    combinationRecordId?: number
  }

  type CombinationRecordRespDTO = {
    id?: number
    activityId?: number
    combinationPrice?: number
    spuId?: number
    spuName?: string
    picUrl?: string
    skuId?: number
    count?: number
    userId?: number
    nickname?: string
    avatar?: string
    headId?: number
    status?: number
    orderId?: number
    userSize?: number
    userCount?: number
    virtualGroup?: boolean
    expireTime?: string
    startTime?: string
    endTime?: string
  }

  type CombinationValidateJoinRespDTO = {
    activityId?: number
    name?: string
    combinationPrice?: number
  }

  type CommonResultBargainValidateJoinRespDTO = {
    code?: number
    data?: BargainValidateJoinRespDTO
    msg?: string
  }

  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultCombinationRecordCreateRespDTO = {
    code?: number
    data?: CombinationRecordCreateRespDTO
    msg?: string
  }

  type CommonResultCombinationRecordRespDTO = {
    code?: number
    data?: CombinationRecordRespDTO
    msg?: string
  }

  type CommonResultCombinationValidateJoinRespDTO = {
    code?: number
    data?: CombinationValidateJoinRespDTO
    msg?: string
  }

  type CommonResultListCouponRespDTO = {
    code?: number
    data?: CouponRespDTO[]
    msg?: string
  }

  type CommonResultListLong = {
    code?: number
    data?: number[]
    msg?: string
  }

  type CommonResultListPromotionArticleCategorySimpleRespVO = {
    code?: number
    data?: PromotionArticleCategorySimpleRespVO[]
    msg?: string
  }

  type CommonResultListPromotionCombinationActivityRespVO = {
    code?: number
    data?: PromotionCombinationActivityRespVO[]
    msg?: string
  }

  type CommonResultListPromotionCouponTemplateRespVO = {
    code?: number
    data?: PromotionCouponTemplateRespVO[]
    msg?: string
  }

  type CommonResultListPromotionDiyPageRespVO = {
    code?: number
    data?: PromotionDiyPageRespVO[]
    msg?: string
  }

  type CommonResultListPromotionSeckillActivityRespVO = {
    code?: number
    data?: PromotionSeckillActivityRespVO[]
    msg?: string
  }

  type CommonResultListPromotionSeckillConfigRespVO = {
    code?: number
    data?: PromotionSeckillConfigRespVO[]
    msg?: string
  }

  type CommonResultListPromotionSeckillConfigSimpleRespVO = {
    code?: number
    data?: PromotionSeckillConfigSimpleRespVO[]
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultPageResultPromotionArticleCategoryRespVO = {
    code?: number
    data?: PageResultPromotionArticleCategoryRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionArticleRespVO = {
    code?: number
    data?: PageResultPromotionArticleRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionBannerRespVO = {
    code?: number
    data?: PageResultPromotionBannerRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionBargainActivityPageItemRespVO = {
    code?: number
    data?: PageResultPromotionBargainActivityPageItemRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionBargainHelpRespVO = {
    code?: number
    data?: PageResultPromotionBargainHelpRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionBargainRecordPageItemRespVO = {
    code?: number
    data?: PageResultPromotionBargainRecordPageItemRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionCombinationActivityPageItemRespVO = {
    code?: number
    data?: PageResultPromotionCombinationActivityPageItemRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionCombinationRecordPageItemRespVO = {
    code?: number
    data?: PageResultPromotionCombinationRecordPageItemRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionCouponPageItemRespVO = {
    code?: number
    data?: PageResultPromotionCouponPageItemRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionCouponTemplateRespVO = {
    code?: number
    data?: PageResultPromotionCouponTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionDiscountActivityRespVO = {
    code?: number
    data?: PageResultPromotionDiscountActivityRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionDiyPageRespVO = {
    code?: number
    data?: PageResultPromotionDiyPageRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionDiyTemplateRespVO = {
    code?: number
    data?: PageResultPromotionDiyTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionRewardActivityRespVO = {
    code?: number
    data?: PageResultPromotionRewardActivityRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionSeckillActivityRespVO = {
    code?: number
    data?: PageResultPromotionSeckillActivityRespVO
    msg?: string
  }

  type CommonResultPageResultPromotionSeckillConfigRespVO = {
    code?: number
    data?: PageResultPromotionSeckillConfigRespVO
    msg?: string
  }

  type CommonResultPointValidateJoinRespDTO = {
    code?: number
    data?: PointValidateJoinRespDTO
    msg?: string
  }

  type CommonResultPromotionArticleCategoryRespVO = {
    code?: number
    data?: PromotionArticleCategoryRespVO
    msg?: string
  }

  type CommonResultPromotionArticleRespVO = {
    code?: number
    data?: PromotionArticleRespVO
    msg?: string
  }

  type CommonResultPromotionBannerRespVO = {
    code?: number
    data?: PromotionBannerRespVO
    msg?: string
  }

  type CommonResultPromotionBargainActivityRespVO = {
    code?: number
    data?: PromotionBargainActivityRespVO
    msg?: string
  }

  type CommonResultPromotionCombinationActivityRespVO = {
    code?: number
    data?: PromotionCombinationActivityRespVO
    msg?: string
  }

  type CommonResultPromotionCombinationRecordSummaryVO = {
    code?: number
    data?: PromotionCombinationRecordSummaryVO
    msg?: string
  }

  type CommonResultPromotionCouponTemplateRespVO = {
    code?: number
    data?: PromotionCouponTemplateRespVO
    msg?: string
  }

  type CommonResultPromotionDiscountActivityRespVO = {
    code?: number
    data?: PromotionDiscountActivityRespVO
    msg?: string
  }

  type CommonResultPromotionDiyPagePropertyRespVO = {
    code?: number
    data?: PromotionDiyPagePropertyRespVO
    msg?: string
  }

  type CommonResultPromotionDiyPageRespVO = {
    code?: number
    data?: PromotionDiyPageRespVO
    msg?: string
  }

  type CommonResultPromotionDiyTemplatePropertyRespVO = {
    code?: number
    data?: PromotionDiyTemplatePropertyRespVO
    msg?: string
  }

  type CommonResultPromotionDiyTemplateRespVO = {
    code?: number
    data?: PromotionDiyTemplateRespVO
    msg?: string
  }

  type CommonResultPromotionRewardActivityRespVO = {
    code?: number
    data?: PromotionRewardActivityRespVO
    msg?: string
  }

  type CommonResultPromotionSeckillActivityDetailRespVO = {
    code?: number
    data?: PromotionSeckillActivityDetailRespVO
    msg?: string
  }

  type CommonResultPromotionSeckillConfigRespVO = {
    code?: number
    data?: PromotionSeckillConfigRespVO
    msg?: string
  }

  type CommonResultSeckillValidateJoinRespDTO = {
    code?: number
    data?: SeckillValidateJoinRespDTO
    msg?: string
  }

  type CouponRespDTO = {
    id?: number
    templateId?: number
    name?: string
    status?: number
    userId?: number
    takeType?: number
    usePrice?: number
    validStartTime?: string
    validEndTime?: string
    productScope?: number
    productScopeValues?: number[]
    discountType?: number
    discountPercent?: number
    discountPrice?: number
    discountLimitPrice?: number
    useOrderId?: number
    useTime?: string
  }

  type CouponUseReqDTO = {
    id: number
    userId: number
    orderId: number
  }

  type deleteArticleCategoryParams = {
    // 文章分类 Id
    id: number
  }

  type deleteArticleParams = {
    // 文章 Id
    id: number
  }

  type deleteBannerParams = {
    // Banner Id
    id: number
  }

  type deleteBargainActivityParams = {
    // 砍价活动 Id
    id: number
  }

  type deleteCombinationActivityParams = {
    // 拼团活动 Id
    id: number
  }

  type deleteCouponParams = {
    // 优惠劵 Id
    id: number
  }

  type deleteCouponTemplateParams = {
    // 优惠劵模板 Id
    id: number
  }

  type deleteDiscountActivityParams = {
    // 限时折扣活动 Id
    id: number
  }

  type deleteDiyPageParams = {
    // 装修页面 Id
    id: number
  }

  type deleteDiyTemplateParams = {
    // 装修模板 Id
    id: number
  }

  type deleteRewardActivityParams = {
    // 满减送活动 Id
    id: number
  }

  type deleteSeckillActivityParams = {
    // 秒杀活动 Id
    id: number
  }

  type deleteSeckillConfigParams = {
    // 秒杀配置 Id
    id: number
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

  type getArticleCategoryPageParams = {
    pageVO: PromotionArticleCategoryPageReqVO
  }

  type getArticleCategoryParams = {
    // 文章分类 Id
    id: number
  }

  type getArticlePageParams = {
    pageVO: PromotionArticlePageReqVO
  }

  type getArticleParams = {
    // 文章 Id
    id: number
  }

  type getBannerPageParams = {
    pageVO: PromotionBannerPageReqVO
  }

  type getBannerParams = {
    // Banner Id
    id: number
  }

  type getBargainActivityPageParams = {
    pageVO: PromotionBargainActivityPageReqVO
  }

  type getBargainActivityParams = {
    // 砍价活动 Id
    id: number
  }

  type getBargainHelpPageParams = {
    pageVO: PromotionBargainHelpPageReqVO
  }

  type getBargainRecordPageParams = {
    pageVO: PromotionBargainRecordPageReqVO
  }

  type getCombinationActivityListByIdsParams = {
    // 拼团活动 Ids
    ids: number[]
  }

  type getCombinationActivityPageParams = {
    pageVO: PromotionCombinationActivityPageReqVO
  }

  type getCombinationActivityParams = {
    // 拼团活动 Id
    id: number
  }

  type getCombinationRecordByOrderIdParams = {
    // 用户 Id
    userId: number
    // 订单编号
    orderId: number
  }

  type getCombinationRecordPageParams = {
    pageVO: PromotionCombinationRecordReqPageVO
  }

  type getCouponListByUserIdParams = {
    userId: number
    status: number
  }

  type getCouponPageParams = {
    pageVO: PromotionCouponPageReqVO
  }

  type getCouponTemplateListParams = {
    // 优惠劵模板 Ids
    ids: number[]
  }

  type getCouponTemplatePageParams = {
    pageVO: PromotionCouponTemplatePageReqVO
  }

  type getCouponTemplateParams = {
    // 优惠劵模板 Id
    id: number
  }

  type getDiscountActivityPageParams = {
    pageVO: PromotionDiscountActivityPageReqVO
  }

  type getDiscountActivityParams = {
    // 限时折扣活动 Id
    id: number
  }

  type getDiyPageListParams = {
    // 装修页面 Ids
    ids: number[]
  }

  type getDiyPagePageParams = {
    pageVO: PromotionDiyPagePageReqVO
  }

  type getDiyPageParams = {
    // 装修页面 Id
    id: number
  }

  type getDiyPagePropertyParams = {
    // 装修页面 Id
    id: number
  }

  type getDiyTemplatePageParams = {
    pageVO: PromotionDiyTemplatePageReqVO
  }

  type getDiyTemplateParams = {
    // 装修模板 Id
    id: number
  }

  type getDiyTemplatePropertyParams = {
    // 装修模板 Id
    id: number
  }

  type getRewardActivityPageParams = {
    pageVO: PromotionRewardActivityPageReqVO
  }

  type getRewardActivityParams = {
    // 满减送活动 Id
    id: number
  }

  type getSeckillActivityListByIdsParams = {
    // 秒杀活动 Ids
    ids: number[]
  }

  type getSeckillActivityPage1Params = {
    pageVO: PromotionSeckillActivityPageReqVO
  }

  type getSeckillActivityPageParams = {
    pageVO: PromotionSeckillConfigPageReqVO
  }

  type getSeckillActivityParams = {
    // 秒杀活动 Id
    id: number
  }

  type getSeckillConfigParams = {
    // 秒杀配置 Id
    id: number
  }

  type invalidateCouponsByAdminParams = {
    // 赠送的优惠券 Id
    giveCouponIds: number[]
    // 用户 Id
    userId: number
  }

  type PageResultPromotionArticleCategoryRespVO = {
    // 数据
    list: PromotionArticleCategoryRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionArticleRespVO = {
    // 数据
    list: PromotionArticleRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionBannerRespVO = {
    // 数据
    list: PromotionBannerRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionBargainActivityPageItemRespVO = {
    // 数据
    list: PromotionBargainActivityPageItemRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionBargainHelpRespVO = {
    // 数据
    list: PromotionBargainHelpRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionBargainRecordPageItemRespVO = {
    // 数据
    list: PromotionBargainRecordPageItemRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionCombinationActivityPageItemRespVO = {
    // 数据
    list: PromotionCombinationActivityPageItemRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionCombinationRecordPageItemRespVO = {
    // 数据
    list: PromotionCombinationRecordPageItemRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionCouponPageItemRespVO = {
    // 数据
    list: PromotionCouponPageItemRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionCouponTemplateRespVO = {
    // 数据
    list: PromotionCouponTemplateRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionDiscountActivityRespVO = {
    // 数据
    list: PromotionDiscountActivityRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionDiyPageRespVO = {
    // 数据
    list: PromotionDiyPageRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionDiyTemplateRespVO = {
    // 数据
    list: PromotionDiyTemplateRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionRewardActivityRespVO = {
    // 数据
    list: PromotionRewardActivityRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionSeckillActivityRespVO = {
    // 数据
    list: PromotionSeckillActivityRespVO[]
    // 总量
    total: number
  }

  type PageResultPromotionSeckillConfigRespVO = {
    // 数据
    list: PromotionSeckillConfigRespVO[]
    // 总量
    total: number
  }

  type PointValidateJoinRespDTO = {
    count?: number
    point?: number
    price?: number
  }

  type Product = {
    // 商品 SPU Id
    spuId: number
    // 商品 SKU Id
    skuId: number
    // 优惠类型
    discountType: number
    // 折扣百分比
    discountPercent?: number
    // 优惠金额
    discountPrice?: number
  }

  type PromotionArticleCategoryCreateReqVO = {
    // 文章分类名称
    name: string
    // 图标地址
    picUrl: string
    // 状态
    status: number
    // 排序
    sort: number
  }

  type PromotionArticleCategoryPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 文章分类名称
    name?: string
    // 状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type PromotionArticleCategoryRespVO = {
    // 文章分类名称
    name: string
    // 图标地址
    picUrl: string
    // 状态
    status: number
    // 排序
    sort: number
    // 文章分类 Id
    id: number
    // 创建时间
    createTime: string
  }

  type PromotionArticleCategorySimpleRespVO = {
    // 文章分类 Id
    id: number
    // 文章分类名称
    name: string
  }

  type PromotionArticleCategoryUpdateReqVO = {
    // 文章分类名称
    name: string
    // 图标地址
    picUrl: string
    // 状态
    status: number
    // 排序
    sort: number
    // 文章分类 Id
    id: number
  }

  type PromotionArticleCreateReqVO = {
    // 文章分类 Id
    categoryId: number
    // 关联商品 Id
    spuId: number
    // 文章标题
    title: string
    // 文章作者
    author: string
    // 文章封面图片地址
    picUrl: string
    // 文章简介
    introduction: string
    // 排序
    sort: number
    // 状态
    status: number
    // 是否热门（小程序）
    recommendHot: boolean
    // 是否轮播图（小程序）
    recommendBanner: boolean
    // 文章内容
    content: string
  }

  type PromotionArticlePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 文章分类 Id
    categoryId?: number
    // 关联商品 Id
    spuId?: number
    // 文章标题
    title?: string
    // 文章作者
    author?: string
    // 状态
    status?: number
    // 是否热门（小程序）
    recommendHot?: boolean
    // 是否轮播图（小程序）
    recommendBanner?: boolean
    // 创建时间
    createTime?: string[]
  }

  type PromotionArticleRespVO = {
    // 文章分类 Id
    categoryId: number
    // 关联商品 Id
    spuId: number
    // 文章标题
    title: string
    // 文章作者
    author: string
    // 文章封面图片地址
    picUrl: string
    // 文章简介
    introduction: string
    // 排序
    sort: number
    // 状态
    status: number
    // 是否热门（小程序）
    recommendHot: boolean
    // 是否轮播图（小程序）
    recommendBanner: boolean
    // 文章内容
    content: string
    // 文章 Id
    id: number
    // 浏览量
    browseCount: number
    // 创建时间
    createTime: string
  }

  type PromotionArticleUpdateReqVO = {
    // 文章分类 Id
    categoryId: number
    // 关联商品 Id
    spuId: number
    // 文章标题
    title: string
    // 文章作者
    author: string
    // 文章封面图片地址
    picUrl: string
    // 文章简介
    introduction: string
    // 排序
    sort: number
    // 状态
    status: number
    // 是否热门（小程序）
    recommendHot: boolean
    // 是否轮播图（小程序）
    recommendBanner: boolean
    // 文章内容
    content: string
    // 文章 Id
    id: number
  }

  type PromotionBannerCreateReqVO = {
    // 标题
    title: string
    // 跳转链接
    url: string
    // 图片地址
    picUrl: string
    // position
    position: number
    // 排序
    sort: number
    // 状态
    status: number
    // 备注
    memo?: string
  }

  type PromotionBannerPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // Banner 标题
    title?: string
    // 状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type PromotionBannerRespVO = {
    // 标题
    title: string
    // 跳转链接
    url: string
    // 图片地址
    picUrl: string
    // position
    position: number
    // 排序
    sort: number
    // 状态
    status: number
    // 备注
    memo?: string
    // Banner Id
    id: number
    // 创建时间
    createTime: string
  }

  type PromotionBannerUpdateReqVO = {
    // 标题
    title: string
    // 跳转链接
    url: string
    // 图片地址
    picUrl: string
    // position
    position: number
    // 排序
    sort: number
    // 状态
    status: number
    // 备注
    memo?: string
    // Banner Id
    id: number
  }

  type PromotionBargainActivityCreateReqVO = {
    // 砍价活动名称
    name: string
    // 商品 SPU Id
    spuId: number
    // 商品 SKU Id
    skuId: number
    // 砍价起始价格
    bargainFirstPrice: number
    // 砍价底价
    bargainMinPrice: number
    // 活动库存
    stock: number
    // 总限购数量
    totalLimitCount: number
    // 活动开始时间
    startTime: string
    // 活动结束时间
    endTime: string
    // 最大助力次数
    helpMaxCount: number
    // 最大帮砍次数
    bargainCount: number
    // 用户每次砍价的最小金额
    randomMinPrice: number
    // 用户每次砍价的最大金额
    randomMaxPrice: number
  }

  type PromotionBargainActivityPageItemRespVO = {
    // 砍价活动名称
    name: string
    // 商品 SPU Id
    spuId: number
    // 商品 SKU Id
    skuId: number
    // 砍价起始价格
    bargainFirstPrice: number
    // 砍价底价
    bargainMinPrice: number
    // 活动库存
    stock: number
    // 总限购数量
    totalLimitCount: number
    // 活动开始时间
    startTime: string
    // 活动结束时间
    endTime: string
    // 最大助力次数
    helpMaxCount: number
    // 最大帮砍次数
    bargainCount: number
    // 用户每次砍价的最小金额
    randomMinPrice: number
    // 用户每次砍价的最大金额
    randomMaxPrice: number
    // 活动 Id
    id: number
    // 商品名称
    spuName: string
    // 商品主图
    picUrl: string
    // 活动状态
    status: number
    // 活动总库存
    totalStock: number
    // 创建时间
    createTime: string
    // 总砍价的用户数量
    recordUserCount: number
    // 成功砍价的用户数量
    recordSuccessUserCount: number
    // 帮助砍价的用户数量
    helpUserCount: number
  }

  type PromotionBargainActivityPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 砍价活动名称
    name?: string
    // 活动状态
    status?: number
  }

  type PromotionBargainActivityRespVO = {
    // 砍价活动名称
    name: string
    // 商品 SPU Id
    spuId: number
    // 商品 SKU Id
    skuId: number
    // 砍价起始价格
    bargainFirstPrice: number
    // 砍价底价
    bargainMinPrice: number
    // 活动库存
    stock: number
    // 总限购数量
    totalLimitCount: number
    // 活动开始时间
    startTime: string
    // 活动结束时间
    endTime: string
    // 最大助力次数
    helpMaxCount: number
    // 最大帮砍次数
    bargainCount: number
    // 用户每次砍价的最小金额
    randomMinPrice: number
    // 用户每次砍价的最大金额
    randomMaxPrice: number
    // 活动 Id
    id: number
    // 活动状态
    status: number
    // 创建时间
    createTime: string
  }

  type PromotionBargainActivityUpdateReqVO = {
    // 砍价活动名称
    name: string
    // 商品 SPU Id
    spuId: number
    // 商品 SKU Id
    skuId: number
    // 砍价起始价格
    bargainFirstPrice: number
    // 砍价底价
    bargainMinPrice: number
    // 活动库存
    stock: number
    // 总限购数量
    totalLimitCount: number
    // 活动开始时间
    startTime: string
    // 活动结束时间
    endTime: string
    // 最大助力次数
    helpMaxCount: number
    // 最大帮砍次数
    bargainCount: number
    // 用户每次砍价的最小金额
    randomMinPrice: number
    // 用户每次砍价的最大金额
    randomMaxPrice: number
    // 活动 Id
    id: number
  }

  type PromotionBargainHelpPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 砍价记录 Id
    recordId?: number
  }

  type PromotionBargainHelpRespVO = {
    // 用户 Id
    userId: number
    // 砍价活动名称
    activityId: number
    // 砍价记录 Id
    recordId: number
    // 减少砍价，单位：分
    reducePrice: number
    // 砍价助力 Id
    id: number
    // 创建时间
    createTime: string
    // 用户昵称
    nickname?: string
    // 用户头像
    avatar: string
  }

  type PromotionBargainRecordPageItemRespVO = {
    // 砍价活动名称
    activityId: number
    // 用户 Id
    userId: number
    // 商品 SPU Id
    spuId: number
    // 商品 SKU Id
    skuId: number
    // 砍价起始价格，单位：分
    bargainFirstPrice: number
    // 当前砍价，单位：分
    bargainPrice: number
    // 砍价状态
    status: number
    // 订单编号
    orderId?: number
    // 结束时间
    endTime: string
    // 砍价记录 Id
    id: number
    // 创建时间
    createTime: string
    // 帮砍次数
    helpCount: number
    // 用户昵称
    nickname?: string
    // 用户头像
    avatar: string
    activity?: PromotionBargainActivityRespVO
  }

  type PromotionBargainRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 砍价状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type PromotionCombinationActivityCreateReqVO = {
    // 拼团名称
    name: string
    // 商品 SPU Id
    spuId: number
    // 总限购数量
    totalLimitCount: number
    // 单次限购数量
    singleLimitCount: number
    // 活动时间
    startTime: string
    // 活动时间
    endTime: string
    // 开团人数
    userSize: number
    // 虚拟成团
    virtualGroup: boolean
    // 限制时长（小时）
    limitDuration: number
    // 拼团商品
    products: PromotionCombinationProductBaseVO[]
  }

  type PromotionCombinationActivityPageItemRespVO = {
    // 拼团名称
    name: string
    // 商品 SPU Id
    spuId: number
    // 总限购数量
    totalLimitCount: number
    // 单次限购数量
    singleLimitCount: number
    // 活动时间
    startTime: string
    // 活动时间
    endTime: string
    // 开团人数
    userSize: number
    // 虚拟成团
    virtualGroup: boolean
    // 限制时长（小时）
    limitDuration: number
    // 拼团活动 Id
    id: number
    // 创建时间
    createTime: string
    // 拼团活动状态
    status: number
    // 拼团商品
    products: PromotionCombinationProductRespVO[]
    // 商品名称
    spuName: string
    // 商品主图
    picUrl: string
    // 商品市场价，单位：分
    marketPrice: number
    // 开团组数
    groupCount: number
    // 成团组数
    groupSuccessCount: number
    // 购买次数
    recordCount: number
  }

  type PromotionCombinationActivityPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 拼团活动名称
    name?: string
    // 活动状态
    status?: number
  }

  type PromotionCombinationActivityRespVO = {
    // 拼团名称
    name: string
    // 商品 SPU Id
    spuId: number
    // 总限购数量
    totalLimitCount: number
    // 单次限购数量
    singleLimitCount: number
    // 活动时间
    startTime: string
    // 活动时间
    endTime: string
    // 开团人数
    userSize: number
    // 虚拟成团
    virtualGroup: boolean
    // 限制时长（小时）
    limitDuration: number
    // 拼团活动 Id
    id: number
    // 创建时间
    createTime: string
    // 拼团商品
    products: PromotionCombinationProductRespVO[]
    // 商品 SPU 名字
    spuName: string
    // 商品图片
    picUrl: string
    // 商品市场价，单位：分
    marketPrice: number
    // 拼团金额，单位：分
    combinationPrice: number
  }

  type PromotionCombinationActivityUpdateReqVO = {
    // 拼团名称
    name: string
    // 商品 SPU Id
    spuId: number
    // 总限购数量
    totalLimitCount: number
    // 单次限购数量
    singleLimitCount: number
    // 活动时间
    startTime: string
    // 活动时间
    endTime: string
    // 开团人数
    userSize: number
    // 虚拟成团
    virtualGroup: boolean
    // 限制时长（小时）
    limitDuration: number
    // 拼团活动 Id
    id: number
    // 拼团商品
    products: PromotionCombinationProductBaseVO[]
  }

  type PromotionCombinationProductBaseVO = {
    // 商品 SPU Id
    spuId: number
    // 商品 SKU Id
    skuId: number
    // 拼团价格，单位：分
    combinationPrice: number
  }

  type PromotionCombinationProductRespVO = {
    // 商品 SPU Id
    spuId: number
    // 商品 SKU Id
    skuId: number
    // 拼团价格，单位：分
    combinationPrice: number
    // 拼团商品 Id
    id: number
    // 创建时间
    createTime: string
  }

  type PromotionCombinationRecordPageItemRespVO = {
    // 拼团记录 Id
    id: number
    // 拼团活动 Id
    activityId: number
    // 团长 Id
    headId: number
    // 用户 Id
    userId: number
    // 用户昵称
    nickname?: string
    // 用户头像
    avatar: string
    // 商品 SPU Id
    spuId: number
    // 商品 SKU Id
    skuId: number
    // 商品名字
    spuName: string
    // 商品图片
    picUrl: string
    // 过期时间
    expireTime: string
    // 可参团人数
    userSize: number
    // 已参团人数
    userCount: number
    // 拼团状态
    status: number
    // 是否虚拟成团
    virtualGroup: boolean
    // 开始时间（订单付款后开始的时间）
    startTime: string
    // 结束时间（成团时间/失败时间）
    endTime: string
    activity?: PromotionCombinationActivityRespVO
  }

  type PromotionCombinationRecordReqPageVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 活动状态
    status?: number
    // 团长 Id
    headId?: number
    // 创建时间
    createTime?: string[]
  }

  type PromotionCombinationRecordSummaryVO = {
    // 所有拼团记录
    userCount: number
    // 成团记录
    successCount: number
    // 虚拟成团记录
    virtualGroupCount: number
  }

  type PromotionCouponPageItemRespVO = {
    // 优惠劵模板 Id
    templateId: number
    // 优惠劵名
    name: string
    // 优惠码状态
    status: number
    // 用户 Id
    userId: number
    // 领取方式
    takeType: number
    // 是否设置满多少金额可用
    usePrice: number
    // 固定日期 - 生效开始时间
    validStartTime?: string
    // 固定日期 - 生效结束时间
    validEndTime?: string
    // 商品范围
    productScope: number
    // 商品范围编号的数组
    productScopeValues?: number[]
    // 优惠类型
    discountType: number
    // 折扣百分比
    discountPercent?: number
    // 优惠金额
    discountPrice?: number
    // 折扣上限
    discountLimitPrice?: number
    // 使用订单号
    useOrderId?: number
    // 使用时间
    useTime?: string
    // 优惠劵 Id
    id: number
    // 创建时间
    createTime: string
    // 用户昵称
    nickname?: string
  }

  type PromotionCouponPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 优惠劵模板 Id
    templateId?: number
    // 优惠码状态
    status?: number
    // 创建时间
    createTime?: string[]
    // 用户昵称
    nickname?: string
    // 用户 Id
    userIds?: number[]
  }

  type PromotionCouponSendReqVO = {
    // 优惠劵模板 Id
    templateId: number
    // 用户 Ids
    userIds: number[]
  }

  type PromotionCouponTemplateCreateReqVO = {
    // 优惠劵名称
    name: string
    // 优惠券说明
    description?: string
    // 发行总量
    totalCount: number
    // 每人限领个数
    takeLimitCount: number
    // 领取方式
    takeType: number
    // 是否设置满多少金额可用
    usePrice: number
    // 商品范围
    productScope: number
    // 商品范围编号的数组
    productScopeValues?: number[]
    // 生效日期类型
    validityType: number
    // 固定日期：生效开始时间
    validStartTime?: string
    // 固定日期：生效结束时间
    validEndTime?: string
    // 领取日期：开始天数
    fixedStartTerm?: number
    // 领取日期：结束天数
    fixedEndTerm?: number
    // 优惠类型
    discountType: number
    // 折扣百分比
    discountPercent?: number
    // 优惠金额
    discountPrice?: number
    // 折扣上限
    discountLimitPrice?: number
  }

  type PromotionCouponTemplatePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 优惠劵名称
    name?: string
    // 状态
    status?: number
    // 优惠类型
    discountType?: number
    // 创建时间
    createTime?: string[]
    // 可以领取的类型
    canTakeTypes?: number[]
    // 商品范围
    productScope?: number
    // 商品范围编号
    productScopeValue?: number
  }

  type PromotionCouponTemplateRespVO = {
    // 优惠劵名称
    name: string
    // 优惠券说明
    description?: string
    // 发行总量
    totalCount: number
    // 每人限领个数
    takeLimitCount: number
    // 领取方式
    takeType: number
    // 是否设置满多少金额可用
    usePrice: number
    // 商品范围
    productScope: number
    // 商品范围编号的数组
    productScopeValues?: number[]
    // 生效日期类型
    validityType: number
    // 固定日期：生效开始时间
    validStartTime?: string
    // 固定日期：生效结束时间
    validEndTime?: string
    // 领取日期：开始天数
    fixedStartTerm?: number
    // 领取日期：结束天数
    fixedEndTerm?: number
    // 优惠类型
    discountType: number
    // 折扣百分比
    discountPercent?: number
    // 优惠金额
    discountPrice?: number
    // 折扣上限
    discountLimitPrice?: number
    // 优惠劵模板 Id
    id: number
    // 优惠劵模板状态
    status: number
    // 领取优惠券的数量
    takeCount: number
    // 使用优惠券的次数
    useCount: number
    // 创建时间
    createTime: string
  }

  type PromotionCouponTemplateUpdateReqVO = {
    // 优惠劵名称
    name: string
    // 优惠券说明
    description?: string
    // 发行总量
    totalCount: number
    // 每人限领个数
    takeLimitCount: number
    // 领取方式
    takeType: number
    // 是否设置满多少金额可用
    usePrice: number
    // 商品范围
    productScope: number
    // 商品范围编号的数组
    productScopeValues?: number[]
    // 生效日期类型
    validityType: number
    // 固定日期：生效开始时间
    validStartTime?: string
    // 固定日期：生效结束时间
    validEndTime?: string
    // 领取日期：开始天数
    fixedStartTerm?: number
    // 领取日期：结束天数
    fixedEndTerm?: number
    // 优惠类型
    discountType: number
    // 折扣百分比
    discountPercent?: number
    // 优惠金额
    discountPrice?: number
    // 折扣上限
    discountLimitPrice?: number
    // 优惠劵模板 Id
    id: number
  }

  type PromotionCouponTemplateUpdateStatusReqVO = {
    // 优惠劵模板 Id
    id: number
    // 优惠劵模板状态
    status: number
  }

  type PromotionDiscountActivityCreateReqVO = {
    // 限时折扣活动标题
    name: string
    // 开始时间
    startTime: string
    // 结束时间
    endTime: string
    // 备注
    remark?: string
    products: Product[]
  }

  type PromotionDiscountActivityPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 限时折扣活动标题
    name?: string
    // 限时折扣活动状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type PromotionDiscountActivityRespVO = {
    // 限时折扣活动标题
    name: string
    // 开始时间
    startTime: string
    // 结束时间
    endTime: string
    // 备注
    remark?: string
    // 限时折扣活动 Id
    id: number
    // 限时折扣活动状态
    status: number
    // 创建时间
    createTime: string
    // 限时折扣商品
    products: Product[]
  }

  type PromotionDiscountActivityUpdateReqVO = {
    // 限时折扣活动标题
    name: string
    // 开始时间
    startTime: string
    // 结束时间
    endTime: string
    // 备注
    remark?: string
    // 限时折扣活动 Id
    id: number
    products: Product[]
  }

  type PromotionDiyPageCreateReqVO = {
    // 装修模板 Id
    templateId?: number
    // 装修页面名称
    name: string
    // 备注
    remark?: string
    // 预览图
    previewPicUrls?: string[]
  }

  type PromotionDiyPagePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 装修页面名称
    name?: string
    // 创建时间
    createTime?: string[]
  }

  type PromotionDiyPagePropertyRespVO = {
    // 装修模板 Id
    templateId?: number
    // 装修页面名称
    name: string
    // 备注
    remark?: string
    // 预览图
    previewPicUrls?: string[]
    // 装修页面 Id
    id: number
    // 页面属性
    property?: string
  }

  type PromotionDiyPagePropertyUpdateRequestVO = {
    // 装修页面 Id
    id: number
    // 页面属性，JSON 格式
    property: string
  }

  type PromotionDiyPageRespVO = {
    // 装修模板 Id
    templateId?: number
    // 装修页面名称
    name: string
    // 备注
    remark?: string
    // 预览图
    previewPicUrls?: string[]
    // 装修页面 Id
    id: number
    // 创建时间
    createTime: string
  }

  type PromotionDiyPageUpdateReqVO = {
    // 装修模板 Id
    templateId?: number
    // 装修页面名称
    name: string
    // 备注
    remark?: string
    // 预览图
    previewPicUrls?: string[]
    // 装修页面 Id
    id: number
  }

  type PromotionDiyTemplateCreateReqVO = {
    // 装修模模板名称
    name: string
    // 备注
    remark?: string
    // 预览图
    previewPicUrls?: string[]
  }

  type PromotionDiyTemplatePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 装修模板名称
    name?: string
    // 是否使用
    used?: boolean
    // 使用时间
    usedTime?: string[]
    // 创建时间
    createTime?: string[]
  }

  type PromotionDiyTemplatePropertyRespVO = {
    // 装修模模板名称
    name: string
    // 备注
    remark?: string
    // 预览图
    previewPicUrls?: string[]
    // 装修模板 Id
    id: number
    // 模板属性，JSON 格式
    property: string
    // 装修模板页面
    pages: PromotionDiyPagePropertyRespVO[]
  }

  type PromotionDiyTemplatePropertyUpdateRequestVO = {
    // 装修模板 Id
    id: number
    // 模板属性，JSON 格式
    property: string
  }

  type PromotionDiyTemplateRespVO = {
    // 装修模模板名称
    name: string
    // 备注
    remark?: string
    // 预览图
    previewPicUrls?: string[]
    // 装修模板 Id
    id: number
    // 创建时间
    createTime: string
    // 是否使用
    used: boolean
    // 使用时间
    usedTime?: string
  }

  type PromotionDiyTemplateUpdateReqVO = {
    // 装修模模板名称
    name: string
    // 备注
    remark?: string
    // 预览图
    previewPicUrls?: string[]
    // 装修模板 Id
    id: number
  }

  type PromotionRewardActivityCreateReqVO = {
    // 满减送活动标题
    name: string
    // 开始时间
    startTime: string
    // 结束时间
    endTime: string
    // 备注
    remark?: string
    // 条件类型
    conditionType: number
    // 商品范围
    productScope: number
    // 商品范围编号的数组
    productScopeValues?: number[]
    rules?: Rule[]
  }

  type PromotionRewardActivityPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 满减送活动标题
    name?: string
    // 活动状态
    status?: number
  }

  type PromotionRewardActivityRespVO = {
    // 满减送活动标题
    name: string
    // 开始时间
    startTime: string
    // 结束时间
    endTime: string
    // 备注
    remark?: string
    // 条件类型
    conditionType: number
    // 商品范围
    productScope: number
    // 商品范围编号的数组
    productScopeValues?: number[]
    rules?: Rule[]
    // 满减送活动 Id
    id: number
    // 活动状态
    status: number
    // 创建时间
    createTime: string
  }

  type PromotionRewardActivityUpdateReqVO = {
    // 满减送活动标题
    name: string
    // 开始时间
    startTime: string
    // 结束时间
    endTime: string
    // 备注
    remark?: string
    // 条件类型
    conditionType: number
    // 商品范围
    productScope: number
    // 商品范围编号的数组
    productScopeValues?: number[]
    rules?: Rule[]
    // 满减送活动 Id
    id: number
  }

  type PromotionSeckillActivityCreateReqVO = {
    // 秒杀活动商品 Id
    spuId: number
    // 秒杀活动名称
    name: string
    // 备注
    remark?: string
    // 活动开始时间
    startTime: string
    // 活动结束时间
    endTime: string
    // 排序
    sort: number
    // 秒杀配置 Id
    configIds: number[]
    // 总限购数量
    totalLimitCount: number
    // 单次限够数量
    singleLimitCount: number
    // 秒杀商品列表
    products: PromotionSeckillProductBaseVO[]
  }

  type PromotionSeckillActivityDetailRespVO = {
    // 秒杀活动商品 Id
    spuId: number
    // 秒杀活动名称
    name: string
    // 备注
    remark?: string
    // 活动开始时间
    startTime: string
    // 活动结束时间
    endTime: string
    // 排序
    sort: number
    // 秒杀配置 Id
    configIds: number[]
    // 总限购数量
    totalLimitCount: number
    // 单次限够数量
    singleLimitCount: number
    // 秒杀活动 Id
    id: number
    // 秒杀商品
    products: PromotionSeckillProductRespVO[]
  }

  type PromotionSeckillActivityPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 秒杀活动名称
    name?: string
    // 活动状态
    status?: number
    // 秒杀时段 Id
    configId?: number
    // 创建时间
    createTime?: string[]
  }

  type PromotionSeckillActivityRespVO = {
    // 秒杀活动商品 Id
    spuId: number
    // 秒杀活动名称
    name: string
    // 备注
    remark?: string
    // 活动开始时间
    startTime: string
    // 活动结束时间
    endTime: string
    // 排序
    sort: number
    // 秒杀配置 Id
    configIds: number[]
    // 总限购数量
    totalLimitCount: number
    // 单次限够数量
    singleLimitCount: number
    // 秒杀活动 Id
    id: number
    // 秒杀商品
    products: PromotionSeckillProductRespVO[]
    // 活动状态
    status: number
    // 订单实付金额，单位：分
    totalPrice: number
    // 秒杀库存
    stock: number
    // 秒杀总库存
    totalStock: number
    // 新增订单数
    orderCount: number
    // 付款人数
    userCount: number
    // 创建时间
    createTime: string
    // 商品名称
    spuName: string
    // 商品主图
    picUrl: string
    // 商品市场价，单位：分
    marketPrice: number
    // 秒杀金额，单位：分
    seckillPrice: number
  }

  type PromotionSeckillActivityUpdateReqVO = {
    // 秒杀活动商品 Id
    spuId: number
    // 秒杀活动名称
    name: string
    // 备注
    remark?: string
    // 活动开始时间
    startTime: string
    // 活动结束时间
    endTime: string
    // 排序
    sort: number
    // 秒杀配置 Id
    configIds: number[]
    // 总限购数量
    totalLimitCount: number
    // 单次限够数量
    singleLimitCount: number
    // 秒杀活动 Id
    id: number
    // 秒杀商品
    products: PromotionSeckillProductBaseVO[]
  }

  type PromotionSeckillConfigCreateReqVO = {
    // 秒杀配置名称
    name: string
    // 开始时间点
    startTime: string
    // 结束时间点
    endTime: string
    // 秒杀轮播图
    sliderPicUrls: string[]
    // 状态
    status: number
  }

  type PromotionSeckillConfigPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 秒杀配置名称
    name?: string
    // 状态
    status?: number
  }

  type PromotionSeckillConfigRespVO = {
    // 秒杀配置名称
    name: string
    // 开始时间点
    startTime: string
    // 结束时间点
    endTime: string
    // 秒杀轮播图
    sliderPicUrls: string[]
    // 状态
    status: number
    // 秒杀配置 Id
    id: number
    // 秒杀活动数量
    seckillActivityCount: number
    // 创建时间
    createTime: string
  }

  type PromotionSeckillConfigSimpleRespVO = {
    // 秒杀配置 Id
    id: number
    // 秒杀配置名称
    name: string
    // 开始时间点
    startTime: string
    // 结束时间点
    endTime: string
  }

  type PromotionSeckillConfigUpdateReqVO = {
    // 秒杀配置名称
    name: string
    // 开始时间点
    startTime: string
    // 结束时间点
    endTime: string
    // 秒杀轮播图
    sliderPicUrls: string[]
    // 状态
    status: number
    // 秒杀配置 Id
    id: number
  }

  type PromotionSeckillConfigUpdateStatusReqVO = {
    // 秒杀配置 Id
    id: number
    // 状态，见 CommonStatusEnum 枚举
    status: number
  }

  type PromotionSeckillProductBaseVO = {
    // 商品 SKU Id
    skuId: number
    // 秒杀金额，单位：分
    seckillPrice: number
    // 秒杀库存
    stock: number
  }

  type PromotionSeckillProductRespVO = {
    // 商品 SKU Id
    skuId: number
    // 秒杀金额，单位：分
    seckillPrice: number
    // 秒杀库存
    stock: number
    // 秒杀参与商品 Id
    id: number
    // 创建时间
    createTime: string
  }

  type returnUsedCouponParams = {
    // 优惠券 Id
    id: number
  }

  type Rule = {
    // 优惠门槛
    limit: number
    // 优惠价格
    discountPrice: number
    // 是否包邮
    freeDelivery: boolean
    // 赠送的积分
    point: number
    // 赠送的优惠劵编号的数组
    giveCouponTemplateCounts?: Record<string, any>
  }

  type SeckillValidateJoinRespDTO = {
    name?: string
    totalLimitCount?: number
    seckillPrice?: number
  }

  type takeCouponsByAdminParams = {
    // 用户 Id
    userId: number
    // key: 优惠劵模版 Id，value：对应的数量
    giveCoupons: any
  }

  type updateBargainActivityStockParams = {
    // 砍价活动 Id
    id: number
    // 购买数量
    count: number
  }

  type updateBargainRecordOrderIdParams = {
    // 砍价记录 Id
    id: number
    oderId: number
    // 订单编号
    orderId: any
  }

  type updatePointStockDecrParams = {
    // 活动 Id
    id: number
    // 商品 SKU Id
    skuId: number
    // 数量
    count: number
  }

  type updatePointStockIncrParams = {
    // 活动 Id
    id: number
    // 商品 SKU Id
    skuId: number
    // 数量
    count: number
  }

  type updateSeckillStockDecrParams = {
    // 活动 Id
    id: number
    // 商品 SKU Id
    skuId: number
    // 数量
    count: number
  }

  type updateSeckillStockIncrParams = {
    // 活动 Id
    id: number
    // 商品 SKU Id
    skuId: number
    // 数量
    count: number
  }

  type useDiyTemplateParams = {
    id: number
  }

  type validateCombinationRecordParams = {
    // 用户 Id
    userId: number
    // 活动 Id
    activityId: number
    // 团长 Id
    headId: number
    // 商品 SKU Id
    skuId: number
    // 数量
    count: number
  }

  type validateJoinBargainParams = {
    // 用户 Id
    userId: number
    // 砍价记录 Id
    bargainRecordId: number
    // 商品 SKU Id
    skuId: number
  }

  type validateJoinCombinationParams = {
    // 用户 Id
    userId: number
    // 活动 Id
    activityId: number
    // 团长 Id
    headId?: number
    // SKU Id
    skuId: number
    // 数量
    count: number
  }

  type validateJoinPointActivityParams = {
    // 活动 Id
    activityId: number
    // 商品 SKU Id
    skuId: number
    // 数量
    count: number
  }

  type validateJoinSeckillParams = {
    // 活动 Id
    activityId: number
    // 商品 SKU Id
    skuId: number
    // 数量
    count: number
  }
  type PointProductRespVO = {
    // 积分商城商品编号
    id?: number
    // 活动编号
    activityId?: number
    // 商品 SPU 编号
    spuId?: number
    // 商品 SKU 编号
    skuId: number
    // 可兑换数量
    count: number
    // 兑换积分
    point: number
    // 兑换金额，单位：分
    price: number
    // 积分商城商品库存
    stock: number
  }

  type PointActivityRespVO = {
    // 积分商城活动编号
    id: number
    // 活动商品 SPU 编号
    spuId: number
    // 活动状态
    status: number
    // 活动库存
    stock: number
    // 活动总库存
    totalStock: number
    // 备注
    remark?: string
    // 排序
    sort: number
    // 创建时间
    createTime: string
    // 积分商城商品列表
    products: PointProductRespVO[]
    // 商品名称
    spuName: string
    // 商品主图
    picUrl: string
    // 商品市场价，单位：分
    marketPrice: number
    // 兑换积分（最少）
    point: number
    // 兑换金额，单位：分（最少）
    price: number
  }

  type PointActivitySaveReqVO = {
    // 积分商城活动编号
    id?: number
    // 活动商品 SPU 编号
    spuId: number
    // 备注
    remark?: string
    // 排序
    sort: number
    // 积分商城商品列表
    products: PointProductRespVO[]
  }

  type PageResultPointActivityRespVO = {
    // 数据
    list: PointActivityRespVO[]
    // 总量
    total: number
  }

  type CommonResultPageResultPointActivityRespVO = {
    code?: number
    data?: PageResultPointActivityRespVO
    msg?: string
  }

  type CommonResultPointActivityRespVO = {
    code?: number
    data?: PointActivityRespVO
    msg?: string
  }

  type CommonResultListPointActivityRespVO = {
    code?: number
    data?: PointActivityRespVO[]
    msg?: string
  }

  type getPointActivityParams = {
    id: number
  }

  type getPointActivityPageParams = {
    pageReqVO: PageParam & {
      spuName?: string
      status?: number
      createTime?: string[]
    }
  }

  type deletePointActivityParams = {
    id: number
  }

  type closePointActivityParams = {
    id: number
  }

}
