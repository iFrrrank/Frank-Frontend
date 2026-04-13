declare namespace API {
  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultListProductBrandRespVO = {
    code?: number
    data?: ProductBrandRespVO[]
    msg?: string
  }

  type CommonResultListProductBrandSimpleRespVO = {
    code?: number
    data?: ProductBrandSimpleRespVO[]
    msg?: string
  }

  type CommonResultListProductCategoryRespVO = {
    code?: number
    data?: ProductCategoryRespVO[]
    msg?: string
  }

  type CommonResultListProductPropertyRespVO = {
    code?: number
    data?: ProductPropertyRespVO[]
    msg?: string
  }

  type CommonResultListProductPropertyValueRespVO = {
    code?: number
    data?: ProductPropertyValueRespVO[]
    msg?: string
  }

  type CommonResultListProductSkuRespDTO = {
    code?: number
    data?: ProductSkuRespDTO[]
    msg?: string
  }

  type CommonResultListProductSpuRespDTO = {
    code?: number
    data?: ProductSpuRespDTO[]
    msg?: string
  }

  type CommonResultListProductSpuRespVO = {
    code?: number
    data?: ProductSpuRespVO[]
    msg?: string
  }

  type CommonResultListProductSpuSimpleRespVO = {
    code?: number
    data?: ProductSpuSimpleRespVO[]
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

  type CommonResultPageResultProductBrandRespVO = {
    code?: number
    data?: PageResultProductBrandRespVO
    msg?: string
  }

  type CommonResultPageResultProductBrowseHistoryRespVO = {
    code?: number
    data?: PageResultProductBrowseHistoryRespVO
    msg?: string
  }

  type CommonResultPageResultProductCommentRespVO = {
    code?: number
    data?: PageResultProductCommentRespVO
    msg?: string
  }

  type CommonResultPageResultProductFavoriteRespVO = {
    code?: number
    data?: PageResultProductFavoriteRespVO
    msg?: string
  }

  type CommonResultPageResultProductPropertyRespVO = {
    code?: number
    data?: PageResultProductPropertyRespVO
    msg?: string
  }

  type CommonResultPageResultProductPropertyValueRespVO = {
    code?: number
    data?: PageResultProductPropertyValueRespVO
    msg?: string
  }

  type CommonResultPageResultProductSpuRespVO = {
    code?: number
    data?: PageResultProductSpuRespVO
    msg?: string
  }

  type CommonResultProductBrandRespVO = {
    code?: number
    data?: ProductBrandRespVO
    msg?: string
  }

  type CommonResultProductCategoryRespVO = {
    code?: number
    data?: ProductCategoryRespVO
    msg?: string
  }

  type CommonResultProductPropertyRespVO = {
    code?: number
    data?: ProductPropertyRespVO
    msg?: string
  }

  type CommonResultProductPropertyValueRespVO = {
    code?: number
    data?: ProductPropertyValueRespVO
    msg?: string
  }

  type CommonResultProductSkuRespDTO = {
    code?: number
    data?: ProductSkuRespDTO
    msg?: string
  }

  type CommonResultProductSpuRespDTO = {
    code?: number
    data?: ProductSpuRespDTO
    msg?: string
  }

  type CommonResultProductSpuRespVO = {
    code?: number
    data?: ProductSpuRespVO
    msg?: string
  }

  type deleteBrandParams = {
    // 品牌 Id
    id: number
  }

  type deleteCategoryParams = {
    // 商品分类 Id
    id: number
  }

  type deletePropertyParams = {
    // 属性 Id
    id: number
  }

  type deletePropertyValueParams = {
    // 属性值 Id
    id: number
  }

  type deleteSpuParams = {
    // 商品 SPU Id
    id: number
  }

  type exportSpuListParams = {
    reqVO: ProductSpuPageReqVO
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

  type getBrandListParams = {
    listVO: ProductBrandListReqVO
  }

  type getBrandPageParams = {
    pageVO: ProductBrandPageReqVO
  }

  type getBrandParams = {
    // 品牌 Id
    id: number
  }

  type getBrowseHistoryPageParams = {
    pageReqVO: ProductBrowseHistoryPageReqVO
  }

  type getCategoryListParams = {
    listReqVO: ProductCategoryListReqVO
  }

  type getCategoryParams = {
    // 商品分类 Id
    id: number
  }

  type getCommentPageParams = {
    pageVO: ProductCommentPageReqVO
  }

  type getFavoritePageParams = {
    pageVO: ProductFavoritePageReqVO
  }

  type getPropertyPageParams = {
    pageVO: ProductPropertyPageReqVO
  }

  type getPropertyParams = {
    // 属性 Id
    id: number
  }

  type getPropertyValuePageParams = {
    pageVO: ProductPropertyValuePageReqVO
  }

  type getPropertyValueParams = {
    // 属性值 Id
    id: number
  }

  type getPropertyValueSimpleListParams = {
    // 属性值 Id
    propertyId: number
  }

  type getSkuListBySpuIdParams = {
    // 商品 SKU Ids
    spuIds: number[]
  }

  type getSkuListParams = {
    // 商品 SKU Ids
    ids: number[]
  }

  type getSkuParams = {
    // 商品 SKU Id
    id: number
  }

  type getSpuDetailParams = {
    // 商品 SPU Id
    id: number
  }

  type getSpuList1Params = {
    // 商品 SPU Ids
    spuIds: number[]
  }

  type getSpuListParams = {
    // 商品 SPU Ids
    ids: number[]
  }

  type getSpuPageParams = {
    pageVO: ProductSpuPageReqVO
  }

  type getSpuParams = {
    // SPU Id
    id: number
  }

  type Item = {
    // 商品 SKU Id
    id: number
    // 库存变化数量
    incrCount: number
  }

  type PageResultProductBrandRespVO = {
    // 数据
    list: ProductBrandRespVO[]
    // 总量
    total: number
  }

  type PageResultProductBrowseHistoryRespVO = {
    // 数据
    list: ProductBrowseHistoryRespVO[]
    // 总量
    total: number
  }

  type PageResultProductCommentRespVO = {
    // 数据
    list: ProductCommentRespVO[]
    // 总量
    total: number
  }

  type PageResultProductFavoriteRespVO = {
    // 数据
    list: ProductFavoriteRespVO[]
    // 总量
    total: number
  }

  type PageResultProductPropertyRespVO = {
    // 数据
    list: ProductPropertyRespVO[]
    // 总量
    total: number
  }

  type PageResultProductPropertyValueRespVO = {
    // 数据
    list: ProductPropertyValueRespVO[]
    // 总量
    total: number
  }

  type PageResultProductSpuRespVO = {
    // 数据
    list: ProductSpuRespVO[]
    // 总量
    total: number
  }

  type ProductBrandCreateReqVO = {
    // 品牌名称
    name: string
    // 品牌图片
    picUrl: string
    // 品牌排序
    sort: number
    // 品牌描述
    description?: string
    // 状态
    status: number
  }

  type ProductBrandListReqVO = {
    // 品牌名称
    name?: string
  }

  type ProductBrandPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 品牌名称
    name?: string
    // 状态
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type ProductBrandRespVO = {
    // 品牌名称
    name: string
    // 品牌图片
    picUrl: string
    // 品牌排序
    sort: number
    // 品牌描述
    description?: string
    // 状态
    status: number
    // 品牌 Id
    id: number
    // 创建时间
    createTime: string
  }

  type ProductBrandSimpleRespVO = {
    // 品牌 Id
    id: number
    // 品牌名称
    name: string
  }

  type ProductBrandUpdateReqVO = {
    // 品牌名称
    name: string
    // 品牌图片
    picUrl: string
    // 品牌排序
    sort: number
    // 品牌描述
    description?: string
    // 状态
    status: number
    // 品牌 Id
    id: number
  }

  type ProductBrowseHistoryPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 排序字段
    sortingFields?: SortingField[]
    // 用户 Id
    userId?: number
    // 用户是否删除
    userDeleted?: boolean
    // 商品 SPU Id
    spuId?: number
    // 创建时间
    createTime?: string[]
  }

  type ProductBrowseHistoryRespVO = {
    // Id
    id: number
    // 商品 SPU Id
    spuId: number
    // 商品 SPU 名称
    spuName?: string
    // 商品封面图
    picUrl?: string
    // 商品单价
    price?: number
    // 商品销量
    salesCount?: number
    // 库存
    stock?: number
  }

  type ProductCategoryListReqVO = {
    // 分类名称
    name?: string
    // 开启状态
    status?: number
    // 父分类 Id
    parentId?: number
    // 父分类 Id 数组
    parentIds?: number[]
  }

  type ProductCategoryRespVO = {
    // 分类 Id
    id: number
    // 父分类 Id
    parentId: number
    // 分类名称
    name: string
    // 移动端分类图
    picUrl: string
    // 分类排序
    sort: number
    // 开启状态
    status: number
    // 分类描述
    description?: string
    // 创建时间
    createTime: string
  }

  type ProductCategorySaveReqVO = {
    // 分类 Id
    id?: number
    // 父分类 Id
    parentId: number
    // 分类名称
    name: string
    // 移动端分类图
    picUrl: string
    // 分类排序
    sort: number
    // 开启状态
    status: number
    // 分类描述
    description?: string
  }

  type ProductCommentCreateReqDTO = {
    // 商品 SKU Id
    skuId: number
    // 订单编号
    orderId?: number
    // 交易订单项编号
    orderItemId?: number
    // 描述星级 1-5 分
    descriptionScores: number
    // 服务星级 1-5 分
    benefitScores: number
    // 评论内容
    content: string
    // 评论图片地址数组，以逗号分隔最多上传 9 张
    picUrls?: string[]
    // 是否匿名
    anonymous: boolean
    // 评价人 Id
    userId: number
  }

  type ProductCommentCreateReqVO = {
    // 评价人 Id
    userId: number
    // 评价订单编号
    orderItemId: number
    // 评价人昵称
    userNickname: string
    // 评价人头像
    userAvatar: string
    // 商品 SKU 编号
    skuId: number
    // 描述星级 1-5 分
    descriptionScores: number
    // 服务星级 1-5 分
    benefitScores: number
    // 评论内容
    content: string
    // 评论图片地址数组，以逗号分隔最多上传 9 张
    picUrls: string[]
  }

  type ProductCommentPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 评价人名称
    userNickname?: string
    // 交易订单编号
    orderId?: number
    // 商品 SPU 编号
    spuId?: number
    // 商品 SPU 名称
    spuName?: string
    // 评分星级 1-5 分
    scores?: number
    // 商家是否回复
    replyStatus?: boolean
    // 创建时间
    createTime?: string[]
  }

  type ProductCommentReplyReqVO = {
    // 评价 Id
    id: number
    // 商家回复内容
    replyContent: string
  }

  type ProductCommentRespVO = {
    // 订单编号
    id: number
    // 评价人 Id
    userId: number
    // 评价人名称
    userNickname: string
    // 评价人头像
    userAvatar: string
    // 是否匿名
    anonymous: boolean
    // 交易订单编号
    orderId: number
    // 评价订单项
    orderItemId: number
    // 商品 SPU 编号
    spuId: number
    // 商品 SKU 编号
    skuId: number
    // 商品 SPU 名称
    spuName: string
    // 商品 SKU 图片地址
    skuPicUrl?: string
    // 商品 SKU 规格值数组
    skuProperties?: Property[]
    // 是否可见
    visible: boolean
    // 评分星级 1-5 分
    scores: number
    // 描述星级 1-5 分
    descriptionScores: number
    // 服务星级 1-5 分
    benefitScores: number
    // 评论内容
    content: string
    // 评论图片地址数组，以逗号分隔最多上传 9 张
    picUrls: string[]
    // 商家是否回复
    replyStatus: boolean
    // 回复管理员编号
    replyUserId?: number
    // 商家回复内容
    replyContent?: string
    // 商家回复时间
    replyTime?: string
    // 创建时间
    createTime: string
  }

  type ProductCommentUpdateVisibleReqVO = {
    // 评价 Id
    id: number
    // 是否可见
    visible: boolean
  }

  type ProductFavoritePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户 Id
    userId?: number
  }

  type ProductFavoriteRespVO = {
    // 商品 SPU Id
    id: number
    // 商品名称
    name: string
    // 关键字
    keyword: string
    // 商品简介
    introduction: string
    // 商品详情
    description: string
    // 商品分类编号
    categoryId: number
    // 商品品牌 Id
    brandId: number
    // 商品封面图
    picUrl: string
    // 商品轮播图
    sliderPicUrls: string[]
    // 排序字段
    sort: number
    // 商品状态
    status: number
    // 商品创建时间
    createTime: string
    // 规格类型
    specType: boolean
    // 商品价格
    price: number
    // 市场价，单位使用：分
    marketPrice: number
    // 成本价，单位使用：分
    costPrice: number
    // 商品库存
    stock: number
    // SKU 数组
    skus?: ProductSkuRespVO[]
    // 配送方式数组
    deliveryTypes: number[]
    // 物流配置模板编号
    deliveryTemplateId: number
    // 赠送积分
    giveIntegral: number
    // 分销类型
    subCommissionType: boolean
    // 商品销量
    salesCount: number
    // 虚拟销量
    virtualSalesCount?: number
    // 浏览量
    browseCount: number
    // 用户 Id
    userId: number
    // spu Id
    spuId: number
  }

  type ProductPropertyPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 属性名称
    name?: string
    // 状态
    status: number
    // 创建时间
    createTime?: string[]
  }

  type ProductPropertyRespVO = {
    // 属性 Id
    id: number
    // 属性名称
    name: string
    // 备注
    remark?: string
    // 创建时间
    createTime: string
  }

  type ProductPropertySaveReqVO = {
    // Id
    id?: number
    // 名称
    name: string
    // 备注
    remark?: string
  }

  type ProductPropertyValueDetailRespDTO = {
    // 属性 Id
    propertyId: number
    // 属性名称
    propertyName: string
    // 属性值 Id
    valueId: number
    // 属性值名称
    valueName: string
  }

  type ProductPropertyValuePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 属性值 Id
    propertyId?: string
    // 属性值名称
    name?: string
    // 状态
    status: number
  }

  type ProductPropertyValueRespVO = {
    // 属性值 Id
    id?: number
    // 属性 Id
    propertyId: number
    // 属性值名称
    name: string
    // 备注
    remark?: string
    // 创建时间
    createTime?: string
  }

  type ProductPropertyValueSaveReqVO = {
    // 属性值 Id
    id?: number
    // 属性 Id
    propertyId: number
    // 属性值名称
    name: string
    // 备注
    remark?: string
  }

  type ProductSkuRespDTO = {
    // 商品 SKU Id
    id: number
    // 商品 SPU Id
    spuId: number
    // 属性数组
    properties: ProductPropertyValueDetailRespDTO[]
    // 销售价格，单位：分
    price: number
    // 市场价，单位：分
    marketPrice: number
    // 成本价，单位：分
    costPrice: number
    // SKU 的条形码
    barCode: string
    // 图片地址
    picUrl: string
    // 库存
    stock: number
    // 商品重量，单位：kg 千克
    weight: number
    // 商品体积，单位：m^3 平米
    volume: number
    // 一级分销的佣金，单位：分
    firstBrokeragePrice: number
    // 二级分销的佣金，单位：分
    secondBrokeragePrice: number
  }

  type ProductSkuRespVO = {
    // 商品 SKU Id
    id: number
    // 商品 SKU 名字
    name: string
    // 销售价格，单位：分
    price: number
    // 市场价
    marketPrice?: number
    // 成本价
    costPrice?: number
    // 条形码
    barCode?: string
    // 图片地址
    picUrl: string
    // 库存
    stock: number
    // 商品重量，单位：kg 千克
    weight?: number
    // 商品体积，单位：m^3 平米
    volume?: number
    // 一级分销的佣金，单位：分
    firstBrokeragePrice?: number
    // 二级分销的佣金，单位：分
    secondBrokeragePrice?: number
    // 属性数组
    properties?: Property[]
  }

  type ProductSkuSaveReqVO = {
    // 商品 SKU 名字
    name: string
    // 销售价格，单位：分
    price: number
    // 市场价
    marketPrice?: number
    // 成本价
    costPrice?: number
    // 条形码
    barCode?: string
    // 图片地址
    picUrl: string
    // 库存
    stock: number
    // 商品重量，单位：kg 千克
    weight?: number
    // 商品体积，单位：m^3 平米
    volume?: number
    // 一级分销的佣金，单位：分
    firstBrokeragePrice?: number
    // 二级分销的佣金，单位：分
    secondBrokeragePrice?: number
    // 属性数组
    properties?: Property[]
  }

  type ProductSkuUpdateStockReqDTO = {
    // 商品 SKU 数组
    items: Item[]
  }

  type ProductSpuPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 商品名称
    name?: string
    // 前端请求的 tab 类型
    tabType: number
    // 商品分类 Id
    categoryId?: number
    // 创建时间
    createTime?: string[]
  }

  type ProductSpuRespDTO = {
    id?: number
    name?: string
    unit?: number
    categoryId?: number
    picUrl?: string
    status?: number
    specType?: boolean
    price?: number
    marketPrice?: number
    costPrice?: number
    stock?: number
    deliveryTypes?: number[]
    deliveryTemplateId?: number
    giveIntegral?: number
    subCommissionType?: boolean
  }

  type ProductSpuRespVO = {
    // 商品 SPU Id
    id: number
    // 商品名称
    name: string
    // 关键字
    keyword: string
    // 商品简介
    introduction: string
    // 商品详情
    description: string
    // 商品分类编号
    categoryId: number
    // 商品品牌 Id
    brandId: number
    // 商品封面图
    picUrl: string
    // 商品轮播图
    sliderPicUrls: string[]
    // 排序字段
    sort: number
    // 商品状态
    status: number
    // 商品创建时间
    createTime: string
    // 规格类型
    specType: boolean
    // 商品价格
    price: number
    // 市场价，单位使用：分
    marketPrice: number
    // 成本价，单位使用：分
    costPrice: number
    // 商品库存
    stock: number
    // SKU 数组
    skus?: ProductSkuRespVO[]
    // 配送方式数组
    deliveryTypes: number[]
    // 物流配置模板编号
    deliveryTemplateId: number
    // 赠送积分
    giveIntegral: number
    // 分销类型
    subCommissionType: boolean
    // 商品销量
    salesCount: number
    // 虚拟销量
    virtualSalesCount?: number
    // 浏览量
    browseCount: number
  }

  type ProductSpuSaveReqVO = {
    // 商品 Id
    id?: number
    // 商品名称
    name: string
    // 关键字
    keyword: string
    // 商品简介
    introduction: string
    // 商品详情
    description: string
    // 商品分类 Id
    categoryId: number
    // 商品品牌 Id
    brandId: number
    // 商品封面图
    picUrl: string
    // 商品轮播图
    sliderPicUrls: string[]
    // 排序字段
    sort: number
    // 规格类型
    specType: boolean
    // 配送方式数组
    deliveryTypes: number[]
    // 物流配置模板编号
    deliveryTemplateId: number
    // 赠送积分
    giveIntegral: number
    // 分销类型
    subCommissionType: boolean
    // 虚拟销量
    virtualSalesCount?: number
    // 商品销量
    salesCount: number
    // 浏览量
    browseCount: number
    // SKU 数组
    skus?: ProductSkuSaveReqVO[]
  }

  type ProductSpuSimpleRespVO = {
    // 商品 SPU Id
    id: number
    // 商品名称
    name: string
    // 商品价格，单位使用：分
    price: number
    // 商品市场价，单位使用：分
    marketPrice: number
    // 商品成本价，单位使用：分
    costPrice: number
    // 商品库存
    stock: number
    // 商品销量
    salesCount: number
    // 商品虚拟销量
    virtualSalesCount: number
    // 商品浏览量
    browseCount: number
  }

  type ProductSpuUpdateStatusReqVO = {
    // 商品 Id
    id: number
    // 商品状态
    status: number
  }

  type Property = {
    // 属性 Id
    propertyId?: number
    // 属性名字
    propertyName?: string
    // 属性值编号
    valueId?: number
    // 属性值名字
    valueName?: string
  }

  type SortingField = {
    field?: string
    order?: string
  }

  type validateCategoryListParams = {
    // 商品分类 Ids
    ids: number[]
  }

  type validateSpuListParams = {
    // 商品 SPU Ids
    ids: number[]
  }
}

