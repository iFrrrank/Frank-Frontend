import {
  CommonStatusEnum,
  CrmAuditStatusEnum,
  CrmSceneTypeEnum,
  CrmCustomerLevelEnum,
  CrmProductStatusEnum,
  CrmReceivableReturnTypeEnum,
  CrmCustomerLimitConfigTypeEnum,
  ErpAuditStatusEnum,
  ProductSpuStatusEnum,
  DeliveryTypeEnum,
  BannerPositionEnum,
  PromotionDiscountTypeEnum,
  CouponTakeTypeEnum,
  CouponTemplateValidityTypeEnum,
  CouponStatusEnum,
  CombinationRecordStatusEnum
} from './constants'
import { ProSchemaValueEnumType } from '@ant-design/pro-components'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]
type SelectValueItem = Record<string | number, ProSchemaValueEnumType>

export interface OptionItem {
  label: string
  value: string | number
}

export const AUTO_APPROVE_SCOPES: OptionItem[] = [
  { label: '读取', value: 'read' },
  { label: '写入', value: 'write' },
  { label: '删除', value: 'delete' },
  { label: '全部', value: 'all' }
]

// ========== Common ==========
export const COMMON_STATUS: SelectValueItem = {
  [CommonStatusEnum.ENABLE.status]: {
    text: CommonStatusEnum.ENABLE.name,
    status: 'Success'
  },
  [CommonStatusEnum.DISABLE.status]: {
    text: CommonStatusEnum.DISABLE.name,
    status: 'Error'
  }
}

export const COMMON_STATUS_OPTIONS: OptionItem[] = [
  { label: CommonStatusEnum.ENABLE.name, value: CommonStatusEnum.ENABLE.status },
  { label: CommonStatusEnum.DISABLE.name, value: CommonStatusEnum.DISABLE.status }
]

export const BOOLEAN_OPTIONS: OptionItem[] = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]

export const SEX_OPTIONS: OptionItem[] = [
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]

// ========== CRM 系统 ==========
export const BACKLOG_MENU_LIST: MenuItem[] = [
  { key: 'todayCustomer', label: '今日需联系客户' },
  { key: 'followClue', label: '分配给我的线索' },
  { key: 'followCustomer', label: '分配给我的客户' },
  { key: 'poolCustomer', label: '待进入公海的客户' },
  { key: 'auditContract', label: '待审核合同' },
  { key: 'auditReceivable', label: '待审核回款' },
  { key: 'remindReceivablePlan', label: '待回款提醒' },
  { key: 'expiringContract', label: '即将到期的合同' }
]

export const AUDIT_STATUS: SelectValueItem = {
  [CrmAuditStatusEnum.DRAFT.status]: {
    text: CrmAuditStatusEnum.DRAFT.name,
    status: 'Default'
  },
  [CrmAuditStatusEnum.PROCESS.status]: {
    text: CrmAuditStatusEnum.PROCESS.name,
    status: 'Processing'
  },
  [CrmAuditStatusEnum.APPROVE.status]: {
    text: CrmAuditStatusEnum.APPROVE.name,
    status: 'Success'
  },
  [CrmAuditStatusEnum.REJECT.status]: {
    text: CrmAuditStatusEnum.REJECT.name,
    status: 'Error'
  },
  [CrmAuditStatusEnum.CANCEL.status]: {
    text: CrmAuditStatusEnum.CANCEL.name,
    status: 'Error'
  }
}

export const CONTACT_STATUS: SelectValueItem = {
  1: { text: '今日需联系' },
  2: { text: '已逾期' },
  3: { text: '已联系' }
}

export const CONTRACT_EXPIRY_STATUS: SelectValueItem = {
  1: { text: '即将过期' },
  2: { text: '已过期' }
}

export const FOLLOW_STATUS: SelectValueItem = {
  10: { text: '待跟进' },
  20: { text: '已跟进' }
}

export const SCENE_TYPE: SelectValueItem = {
  [CrmSceneTypeEnum.OWNER.type]: {
    text: CrmSceneTypeEnum.OWNER.name
  },
  [CrmSceneTypeEnum.INVOLVED.type]: {
    text: CrmSceneTypeEnum.INVOLVED.name
  },
  [CrmSceneTypeEnum.SUBORDINATE.type]: {
    text: CrmSceneTypeEnum.SUBORDINATE.name
  }
}

export const RECEIVABLE_STATUS: SelectValueItem = {
  1: { text: '待回款' },
  2: { text: '已逾期' },
  3: { text: '已回款' }
}

export const CLUE_TRANSFER_STATUS: SelectValueItem = {
  10: { text: '未转化' },
  20: { text: '已转化' }
}

export const INDUSTRY_LIST: SelectValueItem = {
  1: { text: '农、林、牧、渔业' },
  2: { text: '采矿业' },
  3: { text: '制造业' },
  4: { text: '电力、热力、燃气及水生产和供应业' },
  5: { text: '建筑业' },
  6: { text: '批发零售业' },
  7: { text: '交通运输、仓储和邮政业' },
  8: { text: '住宿和餐饮业' },
  9: { text: '信息传输、软件和信息技术服务业' },
  10: { text: '金融业' },
  11: { text: '房地产业' },
  12: { text: '租赁和商务服务业' },
  13: { text: '科学研究和技术服务业' },
  14: { text: '水利、环境和公共设施管理业' },
  15: { text: '教育' },
  16: { text: '卫生和社会工作' },
  17: { text: '文化、体育和娱乐业' },
  18: { text: '公共管理、社会保障和社会组织' },
  19: { text: '其他' }
}

export const CUSTOMER_LEVEL: SelectValueItem = {
  [CrmCustomerLevelEnum.IMPORTANT.level]: { text: CrmCustomerLevelEnum.IMPORTANT.name },
  [CrmCustomerLevelEnum.GENERAL.level]: { text: CrmCustomerLevelEnum.GENERAL.name },
  [CrmCustomerLevelEnum.LOW_PRIORITY.level]: { text: CrmCustomerLevelEnum.LOW_PRIORITY.name }
}

export const CUSTOMER_SOURCE: SelectValueItem = {
  1: { text: '促销' },
  2: { text: '广告' },
  3: { text: '转介绍' },
  4: { text: '搜索引擎' },
  5: { text: '线上注册' },
  6: { text: '线上咨询' },
  7: { text: '预约上门' },
  8: { text: '电话咨询' },
  9: { text: '邮件咨询' },
  10: { text: '陌拜' },
  11: { text: '其他' }
}

export const PRODUCT_UNITS: OptionItem[] = [
  { label: '个', value: 1 },
  { label: '块', value: 2 },
  { label: '只', value: 3 },
  { label: '把', value: 4 },
  { label: '枚', value: 5 },
  { label: '瓶', value: 6 },
  { label: '盒', value: 7 },
  { label: '台', value: 8 },
  { label: '吨', value: 9 },
  { label: '千克', value: 10 },
  { label: '米', value: 11 },
  { label: '箱', value: 12 },
  { label: '套', value: 13 }
]

export const PRODUCT_STATUS_ENUM: SelectValueItem = {
  [CrmProductStatusEnum.ENABLE.status]: {
    text: CrmProductStatusEnum.ENABLE.name,
    status: 'Success'
  },
  [CrmProductStatusEnum.DISABLE.status]: {
    text: CrmProductStatusEnum.DISABLE.name,
    status: 'Error'
  }
}

export const PRODUCT_STATUS: OptionItem[] = [
  { label: CrmProductStatusEnum.ENABLE.name, value: CrmProductStatusEnum.ENABLE.status },
  { label: CrmProductStatusEnum.DISABLE.name, value: CrmProductStatusEnum.DISABLE.status }
]

export const RECEIVABLE_RETURN_TYPE: OptionItem[] = [
  { label: CrmReceivableReturnTypeEnum.CHECK.name, value: CrmReceivableReturnTypeEnum.CHECK.type },
  { label: CrmReceivableReturnTypeEnum.CASH.name, value: CrmReceivableReturnTypeEnum.CASH.type },
  {
    label: CrmReceivableReturnTypeEnum.POSTAL_REMITTANCE.name,
    value: CrmReceivableReturnTypeEnum.POSTAL_REMITTANCE.type
  },
  {
    label: CrmReceivableReturnTypeEnum.TELEGRAPHIC_TRANSFER.name,
    value: CrmReceivableReturnTypeEnum.TELEGRAPHIC_TRANSFER.type
  },
  {
    label: CrmReceivableReturnTypeEnum.ONLINE_TRANSFER.name,
    value: CrmReceivableReturnTypeEnum.ONLINE_TRANSFER.type
  },
  {
    label: CrmReceivableReturnTypeEnum.ALIPAY.name,
    value: CrmReceivableReturnTypeEnum.ALIPAY.type
  },
  {
    label: CrmReceivableReturnTypeEnum.WECHAT_PAY.name,
    value: CrmReceivableReturnTypeEnum.WECHAT_PAY.type
  },
  { label: CrmReceivableReturnTypeEnum.OTHER.name, value: CrmReceivableReturnTypeEnum.OTHER.type }
]

export const NOTIFY_STATUS: OptionItem[] = [
  { label: '提醒', value: 1 },
  { label: '不提醒', value: 0 }
]

export const CUSTOMER_LIMIT_CONFIG_TYPE: SelectValueItem = {
  [CrmCustomerLimitConfigTypeEnum.CUSTOMER_OWNER_LIMIT.type]: {
    text: CrmCustomerLimitConfigTypeEnum.CUSTOMER_OWNER_LIMIT.name
  },
  [CrmCustomerLimitConfigTypeEnum.CUSTOMER_LOCK_LIMIT.type]: {
    text: CrmCustomerLimitConfigTypeEnum.CUSTOMER_LOCK_LIMIT.name
  }
}

// ========== ERP 系统 ==========
export const ERP_AUDIT_STATUS: SelectValueItem = {
  [ErpAuditStatusEnum.PROCESS.status]: {
    text: ErpAuditStatusEnum.PROCESS.name,
    status: 'Processing'
  },
  [ErpAuditStatusEnum.APPROVE.status]: {
    text: ErpAuditStatusEnum.APPROVE.name,
    status: 'Success'
  }
}

export const BIZ_TYPE: SelectValueItem = {
  10: { text: '采购入库', status: 'Success' },
  11: { text: '采购入库（作废）', status: 'Error' },
  12: { text: '采购退货出库', status: 'Success' },
  13: { text: '采购退货出库（作废）', status: 'Error' },
  20: { text: '盘盈入库', status: 'Success' },
  21: { text: '盘盈入库（作废）', status: 'Error' },
  22: { text: '盘盈出库', status: 'Success' },
  23: { text: '盘盈出库（作废）', status: 'Error' },
  30: { text: '销售出库', status: 'Success' },
  31: { text: '销售出货（作废）', status: 'Error' },
  32: { text: '销售退货入库', status: 'Success' },
  33: { text: '销售退货入库（作废）', status: 'Error' },
  40: { text: '调拨入库', status: 'Success' },
  41: { text: '调拨入库（作废）', status: 'Error' },
  42: { text: '调拨出库', status: 'Success' },
  43: { text: '调拨出库（作废）', status: 'Error' },
  50: { text: '其他入库', status: 'Success' },
  51: { text: '其他入库（作废）', status: 'Error' },
  52: { text: '其他出库', status: 'Success' },
  53: { text: '其他出库（作废）', status: 'Error' }
}

// ========== MALL-PRODUCT 系统 ==========
export const PRODUCT_SPU_TYPE: OptionItem[] = [
  { value: '0', label: '出售中(0)' },
  { value: '1', label: '仓库中(0)' },
  { value: '2', label: '已售罄(0)' },
  { value: '3', label: '警戒库存(0)' },
  { value: '4', label: '回收站(0)' }
]

export const SPU_STATUS: SelectValueItem = {
  [ProductSpuStatusEnum.ENABLE.status]: {
    text: ProductSpuStatusEnum.ENABLE.name,
    status: 'Success'
  },
  [ProductSpuStatusEnum.DISABLE.status]: {
    text: ProductSpuStatusEnum.DISABLE.name,
    status: 'Error'
  },
  [ProductSpuStatusEnum.RECYCLE.status]: {
    text: ProductSpuStatusEnum.RECYCLE.name,
    status: 'Error'
  }
}

export const DISTRIBUTE_TYPE: OptionItem[] = [
  { label: '默认设置', value: 0 },
  { label: '单独设置', value: 1 }
]

export const SPEC_TYPE: OptionItem[] = [
  { label: '单规格', value: 0 },
  { label: '多规格', value: 1 }
]

export const DELIVERY_TYPE: OptionItem[] = [
  { label: DeliveryTypeEnum.EXPRESS.name, value: DeliveryTypeEnum.EXPRESS.type },
  { label: DeliveryTypeEnum.PICK_UP.name, value: DeliveryTypeEnum.PICK_UP.type }
]

export const REPLY_STATUS: SelectValueItem = {
  0: { text: '未回复', status: 'Default' },
  1: { text: '已回复', status: 'Success' }
}

export const BANNER_POSITION: SelectValueItem = {
  [BannerPositionEnum.HOME_POSITION.position]: {
    text: BannerPositionEnum.HOME_POSITION.name,
    status: ''
  },
  [BannerPositionEnum.SECKILL_POSITION.position]: {
    text: BannerPositionEnum.SECKILL_POSITION.name,
    status: ''
  },
  [BannerPositionEnum.COMBINATION_POSITION.position]: {
    text: BannerPositionEnum.COMBINATION_POSITION.name,
    status: ''
  },
  [BannerPositionEnum.DISCOUNT_POSITION.position]: {
    text: BannerPositionEnum.DISCOUNT_POSITION.name,
    status: ''
  },
  [BannerPositionEnum.REWARD_POSITION.position]: {
    text: BannerPositionEnum.REWARD_POSITION.name,
    status: ''
  }
}

export const BANNER_POSITION_OPTIONS: OptionItem[] = [
  {
    label: BannerPositionEnum.HOME_POSITION.name,
    value: BannerPositionEnum.HOME_POSITION.position
  },
  {
    label: BannerPositionEnum.SECKILL_POSITION.name,
    value: BannerPositionEnum.SECKILL_POSITION.position
  },
  {
    label: BannerPositionEnum.COMBINATION_POSITION.name,
    value: BannerPositionEnum.COMBINATION_POSITION.position
  },
  {
    label: BannerPositionEnum.DISCOUNT_POSITION.name,
    value: BannerPositionEnum.DISCOUNT_POSITION.position
  },
  {
    label: BannerPositionEnum.REWARD_POSITION.name,
    value: BannerPositionEnum.REWARD_POSITION.position
  }
]

export const DISCOUNT_TYPE: SelectValueItem = {
  [PromotionDiscountTypeEnum.PRICE.type]: {
    text: PromotionDiscountTypeEnum.PRICE.name,
    status: ''
  },
  [PromotionDiscountTypeEnum.PERCENT.type]: {
    text: PromotionDiscountTypeEnum.PERCENT.name,
    status: ''
  }
}

export const DISCOUNT_TYPE_OPTIONS: OptionItem[] = [
  {
    label: PromotionDiscountTypeEnum.PRICE.name,
    value: PromotionDiscountTypeEnum.PRICE.type
  },
  {
    label: PromotionDiscountTypeEnum.PERCENT.name,
    value: PromotionDiscountTypeEnum.PERCENT.type
  }
]

export const COUPON_TAKE_TYPE: SelectValueItem = Object.values(CouponTakeTypeEnum).reduce(
  (acc, item) => {
    acc[item.type] = {
      text: item.name
      // status: item.type === 1 ? 'Processing' : 'Default'
    }
    return acc
  },
  {} as SelectValueItem
)

export const COUPON_TAKE_TYPE_OPTIONS: OptionItem[] = Object.values(CouponTakeTypeEnum).map(
  (item) => ({
    label: item.name,
    value: item.type
  })
)

export const COUPON_TYPE: SelectValueItem = {
  1: { text: '通用券', status: 'Default' },
  2: { text: '商品券', status: 'Success' },
  3: { text: '品类券', status: 'Success' }
}

export const COUPON_TYPE_OPTIONS: OptionItem[] = [
  { label: '通用券', value: 1 },
  { label: '商品券', value: 2 },
  { label: '品类券', value: 3 }
]

export const COUPON_TEMPLATE_VALIDITY_TYPE_OPTIONS: OptionItem[] = Object.values(
  CouponTemplateValidityTypeEnum
).map((item) => ({
  label: item.name,
  value: item.type
}))

export const COUPON_STATUS: SelectValueItem = Object.values(CouponStatusEnum).reduce(
  (acc, item) => {
    acc[item.status] = {
      text: item.name,
      status: item.status === 1 ? 'Default' : item.status === 2 ? 'Success' : 'Error'
    }
    return acc
  },
  {
    0: { text: '全部', status: 'Default' }
  } as SelectValueItem
)

export const COMBINATION_RECORD_STATUS: SelectValueItem = Object.values(
  CombinationRecordStatusEnum
).reduce(
  (acc, item) => {
    acc[item.status] = {
      text: item.name,
      status: item.status === 1 ? 'Processing' : item.status === 2 ? 'Success' : 'Error'
    }
    return acc
  },
  {
    0: { text: '全部', status: 'Default' }
  } as SelectValueItem
)
