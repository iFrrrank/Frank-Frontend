declare namespace API {
  type CommonResultBigDecimal = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultErpAccountRespVO = {
    code?: number
    data?: ErpAccountRespVO
    msg?: string
  }

  type CommonResultErpCustomerRespVO = {
    code?: number
    data?: ErpCustomerRespVO
    msg?: string
  }

  type CommonResultErpFinancePaymentRespVO = {
    code?: number
    data?: ErpFinancePaymentRespVO
    msg?: string
  }

  type CommonResultErpFinanceReceiptRespVO = {
    code?: number
    data?: ErpFinanceReceiptRespVO
    msg?: string
  }

  type CommonResultErpProductCategoryRespVO = {
    code?: number
    data?: ErpProductCategoryRespVO
    msg?: string
  }

  type CommonResultErpProductRespVO = {
    code?: number
    data?: ErpProductRespVO
    msg?: string
  }

  type CommonResultErpProductUnitRespVO = {
    code?: number
    data?: ErpProductUnitRespVO
    msg?: string
  }

  type CommonResultErpPurchaseInRespVO = {
    code?: number
    data?: ErpPurchaseInRespVO
    msg?: string
  }

  type CommonResultErpPurchaseOrderRespVO = {
    code?: number
    data?: ErpPurchaseOrderRespVO
    msg?: string
  }

  type CommonResultErpPurchaseReturnRespVO = {
    code?: number
    data?: ErpPurchaseReturnRespVO
    msg?: string
  }

  type CommonResultErpPurchaseSummaryRespVO = {
    code?: number
    data?: ErpPurchaseSummaryRespVO
    msg?: string
  }

  type CommonResultErpSaleOrderRespVO = {
    code?: number
    data?: ErpSaleOrderRespVO
    msg?: string
  }

  type CommonResultErpSaleOutRespVO = {
    code?: number
    data?: ErpSaleOutRespVO
    msg?: string
  }

  type CommonResultErpSaleReturnRespVO = {
    code?: number
    data?: ErpSaleReturnRespVO
    msg?: string
  }

  type CommonResultErpSaleSummaryRespVO = {
    code?: number
    data?: ErpSaleSummaryRespVO
    msg?: string
  }

  type CommonResultErpStockCheckRespVO = {
    code?: number
    data?: ErpStockCheckRespVO
    msg?: string
  }

  type CommonResultErpStockInRespVO = {
    code?: number
    data?: ErpStockInRespVO
    msg?: string
  }

  type CommonResultErpStockMoveRespVO = {
    code?: number
    data?: ErpStockMoveRespVO
    msg?: string
  }

  type CommonResultErpStockOutRespVO = {
    code?: number
    data?: ErpStockOutRespVO
    msg?: string
  }

  type CommonResultErpStockRecordRespVO = {
    code?: number
    data?: ErpStockRecordRespVO
    msg?: string
  }

  type CommonResultErpStockRespVO = {
    code?: number
    data?: ErpStockRespVO
    msg?: string
  }

  type CommonResultErpSupplierRespVO = {
    code?: number
    data?: ErpSupplierRespVO
    msg?: string
  }

  type CommonResultErpWarehouseRespVO = {
    code?: number
    data?: ErpWarehouseRespVO
    msg?: string
  }

  type CommonResultListErpAccountRespVO = {
    code?: number
    data?: ErpAccountRespVO[]
    msg?: string
  }

  type CommonResultListErpCustomerRespVO = {
    code?: number
    data?: ErpCustomerRespVO[]
    msg?: string
  }

  type CommonResultListErpProductCategoryRespVO = {
    code?: number
    data?: ErpProductCategoryRespVO[]
    msg?: string
  }

  type CommonResultListErpProductRespVO = {
    code?: number
    data?: ErpProductRespVO[]
    msg?: string
  }

  type CommonResultListErpProductUnitRespVO = {
    code?: number
    data?: ErpProductUnitRespVO[]
    msg?: string
  }

  type CommonResultListErpPurchaseTimeSummaryRespVO = {
    code?: number
    data?: ErpPurchaseTimeSummaryRespVO[]
    msg?: string
  }

  type CommonResultListErpSaleTimeSummaryRespVO = {
    code?: number
    data?: ErpSaleTimeSummaryRespVO[]
    msg?: string
  }

  type CommonResultListErpSupplierRespVO = {
    code?: number
    data?: ErpSupplierRespVO[]
    msg?: string
  }

  type CommonResultListErpWarehouseRespVO = {
    code?: number
    data?: ErpWarehouseRespVO[]
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultPageResultErpAccountRespVO = {
    code?: number
    data?: PageResultErpAccountRespVO
    msg?: string
  }

  type CommonResultPageResultErpCustomerRespVO = {
    code?: number
    data?: PageResultErpCustomerRespVO
    msg?: string
  }

  type CommonResultPageResultErpFinancePaymentRespVO = {
    code?: number
    data?: PageResultErpFinancePaymentRespVO
    msg?: string
  }

  type CommonResultPageResultErpFinanceReceiptRespVO = {
    code?: number
    data?: PageResultErpFinanceReceiptRespVO
    msg?: string
  }

  type CommonResultPageResultErpProductRespVO = {
    code?: number
    data?: PageResultErpProductRespVO
    msg?: string
  }

  type CommonResultPageResultErpProductUnitRespVO = {
    code?: number
    data?: PageResultErpProductUnitRespVO
    msg?: string
  }

  type CommonResultPageResultErpPurchaseInRespVO = {
    code?: number
    data?: PageResultErpPurchaseInRespVO
    msg?: string
  }

  type CommonResultPageResultErpPurchaseOrderRespVO = {
    code?: number
    data?: PageResultErpPurchaseOrderRespVO
    msg?: string
  }

  type CommonResultPageResultErpPurchaseReturnRespVO = {
    code?: number
    data?: PageResultErpPurchaseReturnRespVO
    msg?: string
  }

  type CommonResultPageResultErpSaleOrderRespVO = {
    code?: number
    data?: PageResultErpSaleOrderRespVO
    msg?: string
  }

  type CommonResultPageResultErpSaleOutRespVO = {
    code?: number
    data?: PageResultErpSaleOutRespVO
    msg?: string
  }

  type CommonResultPageResultErpSaleReturnRespVO = {
    code?: number
    data?: PageResultErpSaleReturnRespVO
    msg?: string
  }

  type CommonResultPageResultErpStockCheckRespVO = {
    code?: number
    data?: PageResultErpStockCheckRespVO
    msg?: string
  }

  type CommonResultPageResultErpStockInRespVO = {
    code?: number
    data?: PageResultErpStockInRespVO
    msg?: string
  }

  type CommonResultPageResultErpStockMoveRespVO = {
    code?: number
    data?: PageResultErpStockMoveRespVO
    msg?: string
  }

  type CommonResultPageResultErpStockOutRespVO = {
    code?: number
    data?: PageResultErpStockOutRespVO
    msg?: string
  }

  type CommonResultPageResultErpStockRecordRespVO = {
    code?: number
    data?: PageResultErpStockRecordRespVO
    msg?: string
  }

  type CommonResultPageResultErpStockRespVO = {
    code?: number
    data?: PageResultErpStockRespVO
    msg?: string
  }

  type CommonResultPageResultErpSupplierRespVO = {
    code?: number
    data?: PageResultErpSupplierRespVO
    msg?: string
  }

  type CommonResultPageResultErpWarehouseRespVO = {
    code?: number
    data?: PageResultErpWarehouseRespVO
    msg?: string
  }

  type deleteAccountParams = {
    // 账户 Id
    id: number
  }

  type deleteCustomerParams = {
    // 客户 Id
    id: number
  }

  type deleteFinancePaymentParams = {
    // 付款单 Ids
    ids: number[]
  }

  type deleteFinanceReceiptParams = {
    // 收款单 Ids
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

  type deleteProductUnitParams = {
    // 产品单位 Id
    id: number
  }

  type deletePurchaseInParams = {
    // 采购入库 Ids
    ids: number[]
  }

  type deletePurchaseOrderParams = {
    // 采购订单 Ids
    ids: number[]
  }

  type deletePurchaseReturnParams = {
    // 采购退货 Ids
    ids: number[]
  }

  type deleteSaleOrderParams = {
    // 订单 Ids
    ids: number[]
  }

  type deleteSaleOutParams = {
    // 销售出库 Ids
    ids: number[]
  }

  type deleteSaleReturnParams = {
    // 销售退货 Ids
    ids: number[]
  }

  type deleteStockCheckParams = {
    // 编号数组
    ids: number[]
  }

  type deleteStockInParams = {
    // 入库单 Ids
    ids: number[]
  }

  type deleteStockMoveParams = {
    // 库存调拨单 Ids
    ids: number[]
  }

  type deleteStockOutParams = {
    // 其它出库单 Ids
    ids: number[]
  }

  type deleteSupplierParams = {
    // 供应商 Id
    id: number
  }

  type deleteWarehouseParams = {
    // 仓库 Id
    id: number
  }

  type ErpAccountPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 账户编码
    no?: string
    // 账户名称
    name?: string
    // 备注
    remark?: string
  }

  type ErpAccountRespVO = {
    // 结算账户 Id
    id: number
    // 账户名称
    name: string
    // 账户编码
    no?: string
    // 备注
    remark?: string
    // 开启状态
    status: number
    // 排序
    sort: number
    // 是否默认
    defaultStatus?: boolean
    // 创建时间
    createTime: string
  }

  type ErpAccountSaveReqVO = {
    // 结算账户 Id
    id: number
    // 账户名称
    name: string
    // 账户编码
    no?: string
    // 备注
    remark?: string
    // 开启状态
    status: number
    // 排序
    sort: number
  }

  type ErpCustomerPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 客户名称
    name?: string
    // 手机号码
    mobile?: string
    // 联系电话
    telephone?: string
  }

  type ErpCustomerRespVO = {
    // 客户 Id
    id: number
    // 客户名称
    name: string
    // 联系人
    contact?: string
    // 手机号码
    mobile?: string
    // 联系电话
    telephone?: string
    // 电子邮箱
    email?: string
    // 传真
    fax?: string
    // 备注
    remark?: string
    // 开启状态
    status: number
    // 排序
    sort: number
    // 纳税人识别号
    taxNo?: string
    // 税率
    taxPercent?: number
    // 开户行
    bankName?: string
    // 开户账号
    bankAccount?: string
    // 开户地址
    bankAddress?: string
    // 创建时间
    createTime: string
  }

  type ErpCustomerSaveReqVO = {
    // 客户 Id
    id: number
    // 客户名称
    name: string
    // 联系人
    contact?: string
    // 手机号码
    mobile?: string
    // 联系电话
    telephone?: string
    // 电子邮箱
    email?: string
    // 传真
    fax?: string
    // 备注
    remark?: string
    // 开启状态
    status: number
    // 排序
    sort: number
    // 纳税人识别号
    taxNo?: string
    // 税率
    taxPercent?: number
    // 开户行
    bankName?: string
    // 开户账号
    bankAccount?: string
    // 开户地址
    bankAddress?: string
  }

  type ErpFinancePaymentPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 付款单 Id
    no?: string
    // 付款时间
    paymentTime?: string[]
    // 供应商 Id
    supplierId?: number
    // 创建者
    creator?: string
    // 财务人员 Id
    financeUserId?: string
    // 结算账户 Id
    accountId?: number
    // 付款状态
    status?: number
    // 备注
    remark?: string
    // 业务 Id
    bizNo?: string
  }

  type ErpFinancePaymentRespVO = {
    // 付款单 Id
    id: number
    // 付款单号
    no: string
    // 付款状态
    status: number
    // 付款时间
    paymentTime: string
    // 财务人员 Id
    financeUserId?: number
    // 财务人员名称
    financeUserName?: string
    // 供应商 Id
    supplierId: number
    // 供应商名称
    supplierName: string
    // 付款账户 Id
    accountId: number
    // 付款账户名称
    accountName: string
    // 合计价格，单位：元
    totalPrice: number
    // 优惠金额，单位：元
    discountPrice: number
    // 实际价格，单位：元
    paymentPrice: number
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 付款项列表
    items: Item[]
  }

  type ErpFinancePaymentSaveReqVO = {
    // 付款单 Id
    id: number
    // 付款时间
    paymentTime: string
    // 财务人员 Id
    financeUserId?: number
    // 供应商 Id
    supplierId: number
    // 付款账户 Id
    accountId: number
    // 优惠金额，单位：元
    discountPrice: number
    // 备注
    remark?: string
    // 付款项列表
    items: Item[]
  }

  type ErpFinanceReceiptPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 收款单 Id
    no?: string
    // 收款时间
    receiptTime?: string[]
    // 客户 Id
    customerId?: number
    // 创建者
    creator?: string
    // 财务人员 Id
    financeUserId?: string
    // 收款账户 Id
    accountId?: number
    // 收款状态
    status?: number
    // 备注
    remark?: string
    // 业务 Id
    bizNo?: string
  }

  type ErpFinanceReceiptRespVO = {
    // 收款单 Id
    id: number
    // 收款单号
    no: string
    // 收款状态
    status: number
    // 收款时间
    receiptTime: string
    // 财务人员 Id
    financeUserId?: number
    // 财务人员名称
    financeUserName?: string
    // 客户 Id
    customerId: number
    // 客户名称
    customerName: string
    // 收款账户 Id
    accountId: number
    // 收款账户名称
    accountName: string
    // 合计价格，单位：元
    totalPrice: number
    // 优惠金额，单位：元
    discountPrice: number
    // 实际价格，单位：元
    receiptPrice: number
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 收款项列表
    items: Item[]
  }

  type ErpFinanceReceiptSaveReqVO = {
    // 收款单 Id
    id: number
    // 收款时间
    receiptTime: string
    // 财务人员 Id
    financeUserId?: number
    // 客户 Id
    customerId: number
    // 收款账户 Id
    accountId: number
    // 优惠金额，单位：元
    discountPrice: number
    // 备注
    remark?: string
    // 收款项列表
    items: Item[]
  }

  type ErpProductCategoryListReqVO = {
    // 分类名称
    name?: string
    // 开启状态
    status?: number
  }

  type ErpProductCategoryRespVO = {
    // 分类 Id
    id: number
    // 父分类 Id
    parentId: number
    // 分类名称
    name: string
    // 分类编码
    code: string
    // 分类排序
    sort?: number
    // 开启状态
    status: number
    // 创建时间
    createTime: string
  }

  type ErpProductCategorySaveReqVO = {
    // 产品分类 Id
    id: number
    // 父分类 Id
    parentId: number
    // 分类名称
    name: string
    // 分类编码
    code: string
    // 分类排序
    sort: number
    // 开启状态
    status: number
  }

  type ErpProductPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 产品名称
    name?: string
    // 产品分类 Id
    categoryId?: number
    // 创建时间
    createTime?: string[]
  }

  type ErpProductRespVO = {
    // 产品 Id
    id: number
    // 产品名称
    name: string
    // 产品条码
    barCode: string
    // 产品分类 Id
    categoryId: number
    // 产品分类
    categoryName: string
    // 单位 Id
    unitId: number
    // 单位
    unitName: string
    // 产品状态
    status: number
    // 产品规格
    standard?: string
    // 产品备注
    remark?: string
    // 保质期天数
    expiryDay?: number
    // 基础重量（kg）
    weight?: number
    // 采购价格，单位：元
    purchasePrice?: number
    // 销售价格，单位：元
    salePrice?: number
    // 最低价格，单位：元
    minPrice?: number
    // 创建时间
    createTime: string
  }

  type ErpProductUnitPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 单位名字
    name?: string
    // 单位状态
    status?: number
  }

  type ErpProductUnitRespVO = {
    // 单位 Id
    id: number
    // 单位名字
    name: string
    // 单位状态
    status: number
    // 创建时间
    createTime: string
  }

  type ErpProductUnitSaveReqVO = {
    // 单位 Id
    id: number
    // 单位名字
    name: string
    // 单位状态
    status: number
  }

  type ErpPurchaseInPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 采购单 Id
    no?: string
    // 供应商 Id
    supplierId?: number
    // 入库时间
    inTime?: string[]
    // 备注
    remark?: string
    // 入库状态
    status?: number
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
    // 仓库 Id
    warehouseId?: number
    // 结算账号 Id
    accountId?: number
    // 付款状态
    paymentStatus?: number
    // 是否可付款
    paymentEnable?: boolean
    // 采购单号
    orderNo?: string
  }

  type ErpPurchaseInRespVO = {
    // 采购入库 Id
    id: number
    // 入库单 Id
    no: string
    // 入库状态
    status: number
    // 供应商 Id
    supplierId: number
    // 供应商名称
    supplierName?: string
    // 结算账户 Id
    accountId: number
    // 入库时间
    inTime: string
    // 采购订单 Id
    orderId: number
    // 采购订单号
    orderNo: string
    // 合计数量
    totalCount: number
    // 最终合计价格
    totalPrice: number
    // 已付款金额，单位：元
    paymentPrice: number
    // 合计产品价格，单位：元
    totalProductPrice: number
    // 合计税额，单位：元
    totalTaxPrice: number
    // 优惠率，百分比
    discountPercent: number
    // 优惠金额，单位：元
    discountPrice: number
    // 定金金额，单位：元
    otherPrice: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 入库项列表
    items: Item[]
    // 产品信息
    productNames: string
  }

  type ErpPurchaseInSaveReqVO = {
    // 采购入库 Id
    id: number
    // 结算账户 Id
    accountId?: number
    // 入库时间
    inTime: string
    // 采购订单 Id
    orderId: number
    // 优惠率，百分比
    discountPercent: number
    // 其它金额，单位：元
    otherPrice?: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 入库清单列表
    items?: Item[]
  }

  type ErpPurchaseOrderPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 采购单 Id
    no?: string
    // 供应商 Id
    supplierId?: number
    // 采购时间
    orderTime?: string[]
    // 备注
    remark?: string
    // 采购状态
    status?: number
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
    // 入库状态
    inStatus?: number
    // 退货状态
    returnStatus?: number
    // 是否可入库
    inEnable?: boolean
    // 是否可退货
    returnEnable?: boolean
  }

  type ErpPurchaseOrderRespVO = {
    // 采购订单 Id
    id: number
    // 采购单 Id
    no: string
    // 采购状态
    status: number
    // 供应商 Id
    supplierId: number
    // 供应商名称
    supplierName?: string
    // 结算账户 Id
    accountId: number
    // 采购时间
    orderTime: string
    // 合计数量
    totalCount: number
    // 最终合计价格
    totalPrice: number
    // 合计产品价格，单位：元
    totalProductPrice: number
    // 合计税额，单位：元
    totalTaxPrice: number
    // 优惠率，百分比
    discountPercent: number
    // 优惠金额，单位：元
    discountPrice: number
    // 定金金额，单位：元
    depositPrice: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 订单项列表
    items: Item[]
    // 产品信息
    productNames: string
    // 采购入库数量
    inCount: number
    // 采购退货数量
    returnCount: number
  }

  type ErpPurchaseOrderSaveReqVO = {
    // 采购订单 Id
    id: number
    // 供应商 Id
    supplierId: number
    // 结算账户 Id
    accountId?: number
    // 采购时间
    orderTime: string
    // 优惠率，百分比
    discountPercent: number
    // 定金金额，单位：元
    depositPrice?: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 订单清单列表
    items?: Item[]
  }

  type ErpPurchaseReturnPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 采购单 Id
    no?: string
    // 供应商 Id
    supplierId?: number
    // 退货时间
    returnTime?: string[]
    // 备注
    remark?: string
    // 退货状态
    status?: number
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
    // 仓库 Id
    warehouseId?: number
    // 结算账号 Id
    accountId?: number
    // 采购单号
    orderNo?: string
    // 退款状态
    refundStatus?: number
    // 是否可退款
    refundEnable?: boolean
  }

  type ErpPurchaseReturnRespVO = {
    // 采购退货 Id
    id: number
    // 退货单 Id
    no: string
    // 退货状态
    status: number
    // 供应商 Id
    supplierId: number
    // 供应商名称
    supplierName?: string
    // 结算账户 Id
    accountId: number
    // 退货时间
    returnTime: string
    // 采购订单 Id
    orderId: number
    // 采购订单号
    orderNo: string
    // 合计数量
    totalCount: number
    // 最终合计价格
    totalPrice: number
    // 已退款金额，单位：元
    refundPrice: number
    // 合计产品价格，单位：元
    totalProductPrice: number
    // 合计税额，单位：元
    totalTaxPrice: number
    // 优惠率，百分比
    discountPercent: number
    // 优惠金额，单位：元
    discountPrice: number
    // 定金金额，单位：元
    otherPrice: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 退货项列表
    items: Item[]
    // 产品信息
    productNames: string
  }

  type ErpPurchaseReturnSaveReqVO = {
    // 采购退货 Id
    id: number
    // 结算账户 Id
    accountId?: number
    // 退货时间
    returnTime: string
    // 采购订单 Id
    orderId: number
    // 优惠率，百分比
    discountPercent: number
    // 其它金额，单位：元
    otherPrice?: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 退货清单列表
    items?: Item[]
  }

  type ErpPurchaseSummaryRespVO = {
    // 今日采购金额
    todayPrice: number
    // 昨日采购金额
    yesterdayPrice: number
    // 本月采购金额
    monthPrice: number
    // 今年采购金额
    yearPrice: number
  }

  type ErpPurchaseTimeSummaryRespVO = {
    // 时间
    time: string
    // 采购金额
    price: number
  }

  type ErpSaleOrderPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 销售单 Id
    no?: string
    // 客户 Id
    customerId?: number
    // 下单时间
    orderTime?: string[]
    // 备注
    remark?: string
    // 销售状态
    status?: number
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
    // 出库状态
    outStatus?: number
    // 退货状态
    returnStatus?: number
    // 是否可出库
    outEnable?: boolean
    // 是否可退货
    returnEnable?: boolean
  }

  type ErpSaleOrderRespVO = {
    // 销售订单 Id
    id: number
    // 销售单 Id
    no: string
    // 销售状态
    status: number
    // 客户 Id
    customerId: number
    // 客户名称
    customerName?: string
    // 结算账户 Id
    accountId: number
    // 销售员 Id
    saleUserId?: number
    // 下单时间
    orderTime: string
    // 合计数量
    totalCount: number
    // 最终合计价格
    totalPrice: number
    // 合计产品价格，单位：元
    totalProductPrice: number
    // 合计税额，单位：元
    totalTaxPrice: number
    // 优惠率，百分比
    discountPercent: number
    // 优惠金额，单位：元
    discountPrice: number
    // 定金金额，单位：元
    depositPrice: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 订单项列表
    items: Item[]
    // 产品信息
    productNames: string
    // 销售出库数量
    outCount: number
    // 销售退货数量
    returnCount: number
  }

  type ErpSaleOrderSaveReqVO = {
    // 销售订单 Id
    id: number
    // 客户 Id
    customerId: number
    // 下单时间
    orderTime: string
    // 销售员 Id
    saleUserId?: number
    // 结算账户 Id
    accountId?: number
    // 优惠率，百分比
    discountPercent: number
    // 定金金额，单位：元
    depositPrice?: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 订单清单列表
    items?: Item[]
  }

  type ErpSaleOutPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 销售单 Id
    no?: string
    // 客户 Id
    customerId?: number
    // 出库时间
    outTime?: string[]
    // 备注
    remark?: string
    // 出库状态
    status?: number
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
    // 仓库 Id
    warehouseId?: number
    // 结算账号 Id
    accountId?: number
    // 收款状态
    receiptStatus?: number
    // 是否可收款
    receiptEnable?: boolean
    // 销售单号
    orderNo?: string
  }

  type ErpSaleOutRespVO = {
    // 销售出库 Id
    id: number
    // 出库单 Id
    no: string
    // 出库状态
    status: number
    // 客户 Id
    customerId: number
    // 客户名称
    customerName?: string
    // 结算账户 Id
    accountId: number
    // 出库员 Id
    saleUserId?: number
    // 出库时间
    outTime: string
    // 销售订单 Id
    orderId: number
    // 销售订单号
    orderNo: string
    // 合计数量
    totalCount: number
    // 最终合计价格
    totalPrice: number
    // 已收款金额，单位：元
    receiptPrice: number
    // 合计产品价格，单位：元
    totalProductPrice: number
    // 合计税额，单位：元
    totalTaxPrice: number
    // 优惠率，百分比
    discountPercent: number
    // 优惠金额，单位：元
    discountPrice: number
    // 其它金额，单位：元
    otherPrice: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 出库项列表
    items: Item[]
    // 产品信息
    productNames: string
  }

  type ErpSaleOutSaveReqVO = {
    // 销售出库 Id
    id: number
    // 结算账户 Id
    accountId?: number
    // 销售员 Id
    saleUserId?: number
    // 出库时间
    outTime: string
    // 销售订单号
    orderId: number
    // 优惠率，百分比
    discountPercent: number
    // 其它金额，单位：元
    otherPrice?: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 出库清单列表
    items?: Item[]
  }

  type ErpSaleReturnPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 销售单 Id
    no?: string
    // 客户 Id
    customerId?: number
    // 退货时间
    returnTime?: string[]
    // 备注
    remark?: string
    // 退货状态
    status?: number
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
    // 仓库 Id
    warehouseId?: number
    // 结算账号 Id
    accountId?: number
    // 销售单号
    orderNo?: string
    // 退款状态
    refundStatus?: number
    // 是否可退款
    refundEnable?: boolean
  }

  type ErpSaleReturnRespVO = {
    // 销售退货 Id
    id: number
    // 退货单 Id
    no: string
    // 退货状态
    status: number
    // 客户 Id
    customerId: number
    // 客户名称
    customerName?: string
    // 结算账户 Id
    accountId: number
    // 退货员 Id
    saleUserId?: number
    // 退货时间
    returnTime: string
    // 销售订单 Id
    orderId: number
    // 销售订单号
    orderNo: string
    // 合计数量
    totalCount: number
    // 最终合计价格
    totalPrice: number
    // 已退款金额，单位：元
    refundPrice: number
    // 合计产品价格，单位：元
    totalProductPrice: number
    // 合计税额，单位：元
    totalTaxPrice: number
    // 优惠率，百分比
    discountPercent: number
    // 优惠金额，单位：元
    discountPrice: number
    // 其它金额，单位：元
    otherPrice: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 退货项列表
    items: Item[]
    // 产品信息
    productNames: string
  }

  type ErpSaleReturnSaveReqVO = {
    // 销售退货 Id
    id: number
    // 结算账户 Id
    accountId?: number
    // 销售员 Id
    saleUserId?: number
    // 退货时间
    returnTime: string
    // 销售订单 Id
    orderId: number
    // 优惠率，百分比
    discountPercent: number
    // 其它金额，单位：元
    otherPrice?: number
    // 附件地址
    fileUrl?: string
    // 备注
    remark?: string
    // 退货清单列表
    items?: Item[]
  }

  type ErpSaleSummaryRespVO = {
    // 今日销售金额
    todayPrice: number
    // 昨日销售金额
    yesterdayPrice: number
    // 本月销售金额
    monthPrice: number
    // 今年销售金额
    yearPrice: number
  }

  type ErpSaleTimeSummaryRespVO = {
    // 时间
    time: string
    // 销售金额
    price: number
  }

  type ErpStockCheckPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 盘点单号
    no?: string
    // 仓库 Id
    warehouseId?: number
    // 盘点时间
    checkTime?: string[]
    // 状态
    status?: number
    // 备注
    remark?: string
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
  }

  type ErpStockCheckRespVO = {
    // 盘点 Id
    id: number
    // 盘点单号
    no: string
    // 盘点时间
    checkTime: string
    // 合计数量
    totalCount: number
    // 合计金额，单位：元
    totalPrice: number
    // 状态
    status: number
    // 备注
    remark?: string
    // 附件 URL
    fileUrl?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 盘点项列表
    items: Item[]
    // 产品信息
    productNames: string
  }

  type ErpStockCheckSaveReqVO = {
    // 出库 Id
    id: number
    // 出库时间
    checkTime: string
    // 备注
    remark?: string
    // 附件 URL
    fileUrl?: string
    // 出库项列表
    items: Item[]
  }

  type ErpStockInPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 入库单号
    no?: string
    // 供应商 Id
    supplierId?: number
    // 入库时间
    inTime?: string[]
    // 状态
    status?: number
    // 备注
    remark?: string
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
    // 仓库 Id
    warehouseId?: number
  }

  type ErpStockInRespVO = {
    // 入库 Id
    id: number
    // 入库单号
    no: string
    // 供应商 Id
    supplierId?: number
    // 供应商名称
    supplierName?: string
    // 入库时间
    inTime: string
    // 合计数量
    totalCount: number
    // 合计金额，单位：元
    totalPrice: number
    // 状态
    status: number
    // 备注
    remark?: string
    // 附件 URL
    fileUrl?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 入库项列表
    items: Item[]
    // 产品信息
    productNames: string
  }

  type ErpStockInSaveReqVO = {
    // 入库 Id
    id: number
    // 供应商 Id
    supplierId?: number
    // 入库时间
    inTime: string
    // 备注
    remark?: string
    // 附件 URL
    fileUrl?: string
    // 入库项列表
    items: Item[]
  }

  type ErpStockMovePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 调拨单号
    no?: string
    // 调拨时间
    moveTime?: string[]
    // 状态
    status?: number
    // 备注
    remark?: string
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
    // 调出仓库 Id
    fromWarehouseId?: number
  }

  type ErpStockMoveRespVO = {
    // 调拨 Id
    id: number
    // 调拨单号
    no: string
    // 调拨时间
    moveTime: string
    // 合计数量
    totalCount: number
    // 合计金额，单位：元
    totalPrice: number
    // 状态
    status: number
    // 备注
    remark?: string
    // 附件 URL
    fileUrl?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 调拨项列表
    items: Item[]
    // 产品信息
    productNames: string
  }

  type ErpStockMoveSaveReqVO = {
    // 调拨 Id
    id: number
    // 客户 Id
    customerId?: number
    // 调拨时间
    moveTime: string
    // 备注
    remark?: string
    // 附件 URL
    fileUrl?: string
    // 调拨项列表
    items: Item[]
  }

  type ErpStockOutPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 出库单号
    no?: string
    // 客户 Id
    customerId?: number
    // 出库时间
    outTime?: string[]
    // 状态
    status?: number
    // 备注
    remark?: string
    // 创建者
    creator?: string
    // 产品 Id
    productId?: number
    // 仓库 Id
    warehouseId?: number
  }

  type ErpStockOutRespVO = {
    // 出库 Id
    id: number
    // 出库单号
    no: string
    // 客户 Id
    customerId?: number
    // 客户名称
    customerName?: string
    // 出库时间
    outTime: string
    // 合计数量
    totalCount: number
    // 合计金额，单位：元
    totalPrice: number
    // 状态
    status: number
    // 备注
    remark?: string
    // 附件 URL
    fileUrl?: string
    // 创建人
    creator?: string
    // 创建人名称
    creatorName?: string
    // 创建时间
    createTime: string
    // 出库项列表
    items: Item[]
    // 产品信息
    productNames: string
  }

  type ErpStockOutSaveReqVO = {
    // 出库 Id
    id: number
    // 客户 Id
    customerId?: number
    // 出库时间
    outTime: string
    // 备注
    remark?: string
    // 附件 URL
    fileUrl?: string
    // 出库项列表
    items: Item[]
  }

  type ErpStockPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 产品 Id
    productId?: number
    // 仓库 Id
    warehouseId?: number
  }

  type ErpStockRecordPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 产品 Id
    productId?: number
    // 仓库 Id
    warehouseId?: number
    // 业务类型
    bizType?: number
    // 业务单号
    bizNo?: string
    // 创建时间
    createTime?: string[]
  }

  type ErpStockRecordRespVO = {
    // 产品库存明细 Id
    id: number
    // 产品 Id
    productId: number
    // 仓库 Id
    warehouseId: number
    // 出入库数量
    count: number
    // 总库存量
    totalCount: number
    // 业务类型
    bizType: number
    // 业务 Id
    bizId: number
    // 业务项 Id
    bizItemId: number
    // 业务单号
    bizNo: string
    // 创建时间
    createTime: string
    // 创建人
    creator: string
    // 产品名称
    productName: string
    // 产品分类
    categoryName: string
    // 单位
    unitName: string
    // 仓库名称
    warehouseName: string
    // 创建人
    creatorName: string
  }

  type ErpStockRespVO = {
    // 库存 Id
    id: number
    // 产品 Id
    productId: number
    // 仓库 Id
    warehouseId: number
    // 库存数量
    count: number
    // 产品名称
    productName: string
    // 产品分类
    categoryName: string
    // 单位
    unitName: string
    // 仓库名称
    warehouseName: string
  }

  type ErpSupplierPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 供应商名称
    name?: string
    // 手机号码
    mobile?: string
    // 联系电话
    telephone?: string
  }

  type ErpSupplierRespVO = {
    // 供应商 Id
    id: number
    // 供应商名称
    name: string
    // 联系人
    contact?: string
    // 手机号码
    mobile?: string
    // 联系电话
    telephone?: string
    // 电子邮箱
    email?: string
    // 传真
    fax?: string
    // 备注
    remark?: string
    // 开启状态
    status: number
    // 排序
    sort: number
    // 纳税人识别号
    taxNo?: string
    // 税率
    taxPercent?: number
    // 开户行
    bankName?: string
    // 开户账号
    bankAccount?: string
    // 开户地址
    bankAddress?: string
    // 创建时间
    createTime: string
  }

  type ErpSupplierSaveReqVO = {
    // 供应商 Id
    id: number
    // 供应商名称
    name: string
    // 联系人
    contact?: string
    // 手机号码
    mobile?: string
    // 联系电话
    telephone?: string
    // 电子邮箱
    email?: string
    // 传真
    fax?: string
    // 备注
    remark?: string
    // 开启状态
    status: number
    // 排序
    sort: number
    // 纳税人识别号
    taxNo?: string
    // 税率
    taxPercent?: number
    // 开户行
    bankName?: string
    // 开户账号
    bankAccount?: string
    // 开户地址
    bankAddress?: string
  }

  type ErpWarehousePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 仓库名称
    name?: string
    // 开启状态
    status?: number
  }

  type ErpWarehouseRespVO = {
    // 仓库 Id
    id: number
    // 仓库名称
    name: string
    // 仓库地址
    address?: string
    // 排序
    sort: number
    // 备注
    remark?: string
    // 负责人
    principal?: string
    // 仓储费，单位：元
    warehousePrice?: number
    // 搬运费，单位：元
    truckagePrice?: number
    // 开启状态
    status: number
    // 是否默认
    defaultStatus?: boolean
    // 创建时间
    createTime: string
  }

  type ErpWarehouseSaveReqVO = {
    // 仓库 Id
    id: number
    // 仓库名称
    name: string
    // 仓库地址
    address?: string
    // 排序
    sort: number
    // 备注
    remark?: string
    // 负责人
    principal?: string
    // 仓储费，单位：元
    warehousePrice?: number
    // 搬运费，单位：元
    truckagePrice?: number
    // 开启状态
    status: number
  }

  type exportAccountExcelParams = {
    pageReqVO: ErpAccountPageReqVO
  }

  type exportCustomerExcelParams = {
    pageReqVO: ErpCustomerPageReqVO
  }

  type exportFinancePaymentExcelParams = {
    pageReqVO: ErpFinancePaymentPageReqVO
  }

  type exportFinanceReceiptExcelParams = {
    pageReqVO: ErpFinanceReceiptPageReqVO
  }

  type exportProductCategoryExcelParams = {
    listReqVO: ErpProductCategoryListReqVO
  }

  type exportProductExcelParams = {
    pageReqVO: ErpProductPageReqVO
  }

  type exportProductUnitExcelParams = {
    pageReqVO: ErpProductUnitPageReqVO
  }

  type exportPurchaseInExcelParams = {
    pageReqVO: ErpPurchaseInPageReqVO
  }

  type exportPurchaseOrderExcelParams = {
    pageReqVO: ErpPurchaseOrderPageReqVO
  }

  type exportPurchaseReturnExcelParams = {
    pageReqVO: ErpPurchaseReturnPageReqVO
  }

  type exportSaleOrderExcelParams = {
    pageReqVO: ErpSaleOrderPageReqVO
  }

  type exportSaleOutExcelParams = {
    pageReqVO: ErpSaleOutPageReqVO
  }

  type exportSaleReturnExcelParams = {
    pageReqVO: ErpSaleReturnPageReqVO
  }

  type exportStockCheckExcelParams = {
    pageReqVO: ErpStockCheckPageReqVO
  }

  type exportStockExcelParams = {
    pageReqVO: ErpStockPageReqVO
  }

  type exportStockInExcelParams = {
    pageReqVO: ErpStockInPageReqVO
  }

  type exportStockMoveExcelParams = {
    pageReqVO: ErpStockMovePageReqVO
  }

  type exportStockOutExcelParams = {
    pageReqVO: ErpStockOutPageReqVO
  }

  type exportStockRecordExcelParams = {
    pageReqVO: ErpStockRecordPageReqVO
  }

  type exportSupplierExcelParams = {
    pageReqVO: ErpSupplierPageReqVO
  }

  type exportWarehouseExcelParams = {
    pageReqVO: ErpWarehousePageReqVO
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

  type getAccountPageParams = {
    pageReqVO: ErpAccountPageReqVO
  }

  type getAccountParams = {
    // 结算账户
    id: number
  }

  type getCustomerPageParams = {
    pageReqVO: ErpCustomerPageReqVO
  }

  type getCustomerParams = {
    // 客户 Id
    id: number
  }

  type getFinancePaymentPageParams = {
    pageReqVO: ErpFinancePaymentPageReqVO
  }

  type getFinancePaymentParams = {
    // 付款单 Id
    id: number
  }

  type getFinanceReceiptPageParams = {
    pageReqVO: ErpFinanceReceiptPageReqVO
  }

  type getFinanceReceiptParams = {
    // 收款单 Id
    id: number
  }

  type getProductCategoryListParams = {
    listReqVO: ErpProductCategoryListReqVO
  }

  type getProductCategoryParams = {
    // 产品分类 Id
    id: number
  }

  type getProductPageParams = {
    pageReqVO: ErpProductPageReqVO
  }

  type getProductParams = {
    // 产品 Id
    id: number
  }

  type getProductUnitPageParams = {
    pageReqVO: ErpProductUnitPageReqVO
  }

  type getProductUnitParams = {
    // 产品单位 Id
    id: number
  }

  type getPurchaseInPageParams = {
    pageReqVO: ErpPurchaseInPageReqVO
  }

  type getPurchaseInParams = {
    // 采购入库 Id
    id: number
  }

  type getPurchaseOrderPageParams = {
    pageReqVO: ErpPurchaseOrderPageReqVO
  }

  type getPurchaseOrderParams = {
    // 采购订单 Id
    id: number
  }

  type getPurchaseReturnPageParams = {
    pageReqVO: ErpPurchaseReturnPageReqVO
  }

  type getPurchaseReturnParams = {
    // 采购退货 Id
    id: number
  }

  type getPurchaseTimeSummaryParams = {
    // 时间段数量
    count?: number
  }

  type getSaleOrderPageParams = {
    pageReqVO: ErpSaleOrderPageReqVO
  }

  type getSaleOrderParams = {
    // 订单号
    id: number
  }

  type getSaleOutPageParams = {
    pageReqVO: ErpSaleOutPageReqVO
  }

  type getSaleOutParams = {
    // 销售出库 Id
    id: number
  }

  type getSaleReturnPageParams = {
    pageReqVO: ErpSaleReturnPageReqVO
  }

  type getSaleReturnParams = {
    // 销售退货 Id
    id: number
  }

  type getSaleTimeSummaryParams = {
    // 时间段数量
    count?: number
  }

  type getStockCheckPageParams = {
    pageReqVO: ErpStockCheckPageReqVO
  }

  type getStockCheckParams = {
    // 库存调拨单 Id
    id: number
  }

  type getStockCountParams = {
    // 产品 Id
    productId: number
  }

  type getStockInPageParams = {
    pageReqVO: ErpStockInPageReqVO
  }

  type getStockInParams = {
    // 入库单 Id
    id: number
  }

  type getStockMovePageParams = {
    pageReqVO: ErpStockMovePageReqVO
  }

  type getStockMoveParams = {
    // 库存调拨单 Id
    id: number
  }

  type getStockOutPageParams = {
    pageReqVO: ErpStockOutPageReqVO
  }

  type getStockOutParams = {
    // 出库单 Id
    id: number
  }

  type getStockPageParams = {
    pageReqVO: ErpStockPageReqVO
  }

  type getStockParams = {
    // 产品库存 Id
    id?: number
    // 产品 Id
    productId?: number
    // 仓库 Id
    warehouseId?: number
  }

  type getStockRecordPageParams = {
    pageReqVO: ErpStockRecordPageReqVO
  }

  type getStockRecordParams = {
    // 产品库存明细 Id
    id: number
  }

  type getSupplierPageParams = {
    pageReqVO: ErpSupplierPageReqVO
  }

  type getSupplierParams = {
    // 供应商 Id
    id: number
  }

  type getWarehousePageParams = {
    pageReqVO: ErpWarehousePageReqVO
  }

  type getWarehouseParams = {
    // 仓库 Id
    id: number
  }

  type Item = {
    // 出库项 Id
    id?: number
    // 仓库 Id
    warehouseId: number
    // 产品 Id
    productId: number
    // 产品单价
    productPrice?: number
    // 产品数量
    count: number
    // 备注
    remark?: string
  }

  type PageResultErpAccountRespVO = {
    // 数据
    list: ErpAccountRespVO[]
    // 总量
    total: number
  }

  type PageResultErpCustomerRespVO = {
    // 数据
    list: ErpCustomerRespVO[]
    // 总量
    total: number
  }

  type PageResultErpFinancePaymentRespVO = {
    // 数据
    list: ErpFinancePaymentRespVO[]
    // 总量
    total: number
  }

  type PageResultErpFinanceReceiptRespVO = {
    // 数据
    list: ErpFinanceReceiptRespVO[]
    // 总量
    total: number
  }

  type PageResultErpProductRespVO = {
    // 数据
    list: ErpProductRespVO[]
    // 总量
    total: number
  }

  type PageResultErpProductUnitRespVO = {
    // 数据
    list: ErpProductUnitRespVO[]
    // 总量
    total: number
  }

  type PageResultErpPurchaseInRespVO = {
    // 数据
    list: ErpPurchaseInRespVO[]
    // 总量
    total: number
  }

  type PageResultErpPurchaseOrderRespVO = {
    // 数据
    list: ErpPurchaseOrderRespVO[]
    // 总量
    total: number
  }

  type PageResultErpPurchaseReturnRespVO = {
    // 数据
    list: ErpPurchaseReturnRespVO[]
    // 总量
    total: number
  }

  type PageResultErpSaleOrderRespVO = {
    // 数据
    list: ErpSaleOrderRespVO[]
    // 总量
    total: number
  }

  type PageResultErpSaleOutRespVO = {
    // 数据
    list: ErpSaleOutRespVO[]
    // 总量
    total: number
  }

  type PageResultErpSaleReturnRespVO = {
    // 数据
    list: ErpSaleReturnRespVO[]
    // 总量
    total: number
  }

  type PageResultErpStockCheckRespVO = {
    // 数据
    list: ErpStockCheckRespVO[]
    // 总量
    total: number
  }

  type PageResultErpStockInRespVO = {
    // 数据
    list: ErpStockInRespVO[]
    // 总量
    total: number
  }

  type PageResultErpStockMoveRespVO = {
    // 数据
    list: ErpStockMoveRespVO[]
    // 总量
    total: number
  }

  type PageResultErpStockOutRespVO = {
    // 数据
    list: ErpStockOutRespVO[]
    // 总量
    total: number
  }

  type PageResultErpStockRecordRespVO = {
    // 数据
    list: ErpStockRecordRespVO[]
    // 总量
    total: number
  }

  type PageResultErpStockRespVO = {
    // 数据
    list: ErpStockRespVO[]
    // 总量
    total: number
  }

  type PageResultErpSupplierRespVO = {
    // 数据
    list: ErpSupplierRespVO[]
    // 总量
    total: number
  }

  type PageResultErpWarehouseRespVO = {
    // 数据
    list: ErpWarehouseRespVO[]
    // 总量
    total: number
  }

  type ProductSaveReqVO = {
    // 产品 Id
    id: number
    // 产品名称
    name: string
    // 产品条码
    barCode: string
    // 产品分类 Id
    categoryId: number
    // 单位 Id
    unitId: number
    // 产品状态
    status: number
    // 产品规格
    standard?: string
    // 产品备注
    remark?: string
    // 保质期天数
    expiryDay?: number
    // 基础重量（kg）
    weight?: number
    // 采购价格，单位：元
    purchasePrice?: number
    // 销售价格，单位：元
    salePrice?: number
    // 最低价格，单位：元
    minPrice?: number
  }

  type updateAccountDefaultStatusParams = {
    // 账户 Id
    id: number
    defaultStatus: boolean
    // 状态
    status: any
  }

  type updateFinancePaymentStatusParams = {
    id: number
    status: number
  }

  type updateFinanceReceiptStatusParams = {
    id: number
    status: number
  }

  type updatePurchaseInStatusParams = {
    id: number
    status: number
  }

  type updatePurchaseOrderStatusParams = {
    id: number
    status: number
  }

  type updatePurchaseReturnStatusParams = {
    id: number
    status: number
  }

  type updateSaleOrderStatusParams = {
    id: number
    status: number
  }

  type updateSaleOutStatusParams = {
    id: number
    status: number
  }

  type updateSaleReturnStatusParams = {
    id: number
    status: number
  }

  type updateStockCheckStatusParams = {
    id: number
    status: number
  }

  type updateStockInStatusParams = {
    id: number
    status: number
  }

  type updateStockMoveStatusParams = {
    id: number
    status: number
  }

  type updateStockOutStatusParams = {
    id: number
    status: number
  }

  type updateWarehouseDefaultStatusParams = {
    // 仓库 Id
    id: number
    defaultStatus: boolean
    // 仓库默认状态
    status: any
  }
}
