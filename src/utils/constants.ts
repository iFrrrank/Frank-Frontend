// ========== COMMON 模块 ==========
// 全局通用状态枚举
export const CommonStatusEnum = {
  ENABLE: {
    status: 0,
    name: '开启'
  },
  DISABLE: {
    status: 1,
    name: '禁用'
  }
}

// 时间间隔的枚举
export const DateIntervalEnum = {
  DAY: {
    interval: 1,
    name: '天'
  },
  WEEK: {
    interval: 2,
    name: '周'
  },
  MONTH: {
    interval: 3,
    name: '月'
  },
  QUARTER: {
    interval: 4,
    name: '季度'
  },
  YEAR: {
    interval: 5,
    name: '年'
  }
}

// 终端枚举
export const TerminalEnum = {
  UNKNOWN: {
    terminal: 0,
    name: '未知'
  },
  WECHAT_MINI_PROGRAM: {
    terminal: 10,
    name: '微信小程序'
  },
  WECHAT_WAP: {
    terminal: 11,
    name: '微信公众号'
  },
  H5: {
    terminal: 20,
    name: 'H5 网页'
  },
  APP: {
    terminal: 31,
    name: '手机 App'
  }
}

// 全局用户类型枚举
export const UserTypeEnum = {
  MEMBER: {
    value: 1,
    name: '会员'
  },
  ADMIN: {
    value: 2,
    name: '管理员'
  }
}

export const AreaTypeEnum = {
  COUNTRY: {
    value: 1,
    name: '国家'
  },
  PROVINCE: {
    value: 2,
    name: '省份'
  },
  CITY: {
    value: 3,
    name: '城市'
  }
}

// ========== SYSTEM 模块 ==========
// 登录结果枚举
export const LoginResultEnum = {
  SUCCESS: {
    result: 0
  },
  BAD_CREDENTIALS: {
    result: 10
  },
  USER_DISABLED: {
    result: 20
  },
  CAPTCHA_NOT_FOUND: {
    result: 30
  },
  CAPTCHA_CODE_ERROR: {
    result: 31
  }
}

// 登录日志的类型枚举
export const LoginLogTypeEnum = {
  LOGIN_USERNAME: {
    type: 100
  },
  LOGIN_SOCIAL: {
    type: 101
  },
  LOGIN_MOBILE: {
    type: 103
  },
  LOGIN_SMS: {
    type: 104
  },
  LOGOUT_SELF: {
    type: 200
  },
  LOGOUT_DELETE: {
    type: 202
  }
}

// 短信验证码发送场景的枚举
export const SmsSceneEnum = {
  MEMBER_LOGIN: {
    scene: 1,
    templateCode: 'user-sms-login',
    description: '会员用户 - 手机号登陆'
  },
  MEMBER_UPDATE_MOBILE: {
    scene: 2,
    templateCode: 'user-update-mobile',
    description: '会员用户 - 修改手机'
  },
  MEMBER_UPDATE_PASSWORD: {
    scene: 3,
    templateCode: 'user-update-password',
    description: '会员用户 - 修改密码'
  },
  MEMBER_RESET_PASSWORD: {
    scene: 4,
    templateCode: 'user-reset-password',
    description: '会员用户 - 忘记密码'
  },
  ADMIN_MEMBER_LOGIN: {
    scene: 21,
    templateCode: 'admin-sms-login',
    description: '后台用户 - 手机号登录'
  }
}

// 短信的发送状态枚举
export const SmsSendStatusEnum = {
  INIT: {
    status: 0
  },
  SUCCESS: {
    status: 10
  },
  FAILURE: {
    status: 20
  },
  IGNORE: {
    status: 30
  }
}

// 短信的接收状态枚举
export const SmsReceiveStatusEnum = {
  INIT: {
    status: 0
  },
  SUCCESS: {
    status: 10
  },
  FAILURE: {
    status: 20
  }
}

// 性别的枚举值
export const SexEnum = {
  MALE: {
    sex: 1
  },
  FEMALE: {
    sex: 2
  },
  UNKNOWN: {
    sex: 0
  }
}

// 角色类型枚举
export const RoleTypeEnum = {
  SYSTEM: {
    type: 1
  },
  CUSTOM: {
    type: 2
  }
}

// 角色标识枚举
export const RoleCodeEnum = {
  SUPER_ADMIN: {
    code: 'super_admin',
    name: '超级管理员'
  },
  CRM_ADMIN: {
    code: 'crm_admin',
    name: 'CRM 管理员'
  }
}

// 邮件的发送状态枚举
export const MailSendStatusEnum = {
  INIT: {
    status: 0
  },
  SUCCESS: {
    status: 10
  },
  FAILURE: {
    status: 20
  },
  IGNORE: {
    status: 30
  }
}

// 菜单类型枚举
export const MenuTypeEnum = {
  DIR: {
    type: 1
  },
  MENU: {
    type: 2
  },
  BUTTON: {
    type: 3
  }
}

// OAuth2 授权类型枚举
export const OAuth2GrantTypeEnum = {
  PASSWORD: {
    grantType: 'password'
  },
  AUTHORIZATION_CODE: {
    grantType: 'authorization_code'
  },
  IMPLICIT: {
    grantType: 'implicit'
  },
  CLIENT_CREDENTIALS: {
    grantType: 'client_credentials'
  },
  REFRESH_TOKEN: {
    grantType: 'refresh_token'
  }
}

// 数据范围枚举
export const DataScopeEnum = {
  ALL: {
    scope: 1
  },
  DEPT_CUSTOM: {
    scope: 2
  },
  DEPT_ONLY: {
    scope: 3
  },
  DEPT_AND_CHILD: {
    scope: 4
  },
  SELF: {
    scope: 5
  }
}

// 用户的社交平台的类型枚举
export const SystemUserSocialTypeEnum = {
  DINGTALK: {
    title: '钉钉',
    type: 20,
    source: 'dingtalk',
    img: 'https://s1.ax1x.com/2022/05/22/OzMDRs.png'
  },
  WECHAT_ENTERPRISE: {
    title: '企业微信',
    type: 30,
    source: 'wechat_enterprise',
    img: 'https://s1.ax1x.com/2022/05/22/OzMrzn.png'
  }
}

// ========== INFRA 模块 ==========
// 配置类型枚举
export const ConfigTypeEnum = {
  SYSTEM: {
    type: 1
  },
  CUSTOM: {
    type: 2
  }
}

export const InfraJobStatusEnum = {
  INIT: 0, // 初始化中
  NORMAL: 1, // 运行中
  STOP: 2 // 暂停运行
}

// API 异常数据的处理状态枚举
export const InfraApiErrorLogProcessStatusEnum = {
  INIT: 0, // 未处理
  DONE: 1, // 已处理
  IGNORE: 2 // 已忽略
}

export const ApiErrorLogProcessStatusEnum = {
  INIT: {
    status: 0,
    name: '未处理'
  },
  DONE: {
    status: 1,
    name: '已处理'
  },
  IGNORE: {
    status: 2,
    name: '已忽略'
  }
}

// ========== BPM 模块 ==========
export const BpmSimpleModeConditionTypeEnum = {
  EXPRESSION: {
    type: 1,
    name: '条件表达式'
  },
  RULE: {
    type: 2,
    name: '条件规则'
  }
}

export const BpmModelTypeEnum = {
  BPMN: {
    type: 10,
    name: 'BPMN 设计器'
  },
  SIMPLE: {
    type: 20,
    name: 'SIMPLE 设计器'
  }
}

export const BpmTriggerTypeEnum = {
  HTTP_REQUEST: {
    type: 1,
    desc: '发起 HTTP 请求'
  },
  HTTP_CALLBACK: {
    type: 2,
    desc: '接收 HTTP 回调'
  },
  FORM_UPDATE: {
    type: 10,
    desc: '更新流程表单数据'
  },
  FORM_DELETE: {
    type: 11,
    desc: '删除流程表单数据'
  }
}

export const BpmUserTaskTimeoutHandlerTypeEnum = {
  REMINDER: {
    type: 1,
    name: '自动提醒'
  },
  APPROVE: {
    type: 2,
    name: '自动同意'
  },
  REJECT: {
    type: 3,
    name: '自动拒绝'
  }
}

export const BpmModelFormTypeEnum = {
  NORMAL: {
    type: 10,
    name: '流程表单'
  },
  CUSTOM: {
    type: 20,
    name: '业务表单'
  }
}

export const BpmChildProcessStartUserEmptyTypeEnum = {
  MAIN_PROCESS_START_USER: {
    type: 1,
    name: '同主流程发起人'
  },
  CHILD_PROCESS_ADMIN: {
    type: 2,
    name: '子流程管理员'
  },
  MAIN_PROCESS_ADMIN: {
    type: 3,
    name: '主流程管理员'
  }
}

export const BpmChildProcessMultiInstanceSourceTypeEnum = {
  FIXED_QUANTITY: {
    type: 1,
    name: '固定数量'
  },
  NUMBER_FORM: {
    type: 2,
    name: '数字表单'
  },
  MULTIPLE_FORM: {
    type: 3,
    name: '多选表单'
  }
}

export const BpmProcessInstanceStatusEnum = {
  NOT_START: {
    status: -1,
    desc: '未开始'
  },
  RUNNING: {
    status: 1,
    desc: '审批中'
  },
  APPROVE: {
    status: 2,
    desc: '审批通过'
  },
  REJECT: {
    status: 3,
    desc: '审批不通过'
  },
  CANCEL: {
    status: 4,
    desc: '已取消'
  }
}

export const BpmDelayTimerTypeEnum = {
  FIXED_TIME_DURATION: {
    type: 1,
    name: '固定时长'
  },
  FIXED_DATE_TIME: {
    type: 2,
    name: '固定日期'
  }
}

export const BpmReasonEnum = {
  REJECT_TASK: {
    reason: '审批不通过任务，原因：{}'
  },
  CANCEL_PROCESS_INSTANCE_BY_START_USER: {
    reason: '用户主动取消流程，原因：{}'
  },
  CANCEL_PROCESS_INSTANCE_BY_ADMIN: {
    reason: '管理员【{}】取消流程，原因：{}'
  },
  CANCEL_CHILD_PROCESS_INSTANCE_BY_MAIN_PROCESS: {
    reason: '子流程自动取消，原因：主流程已取消'
  },
  REJECT_CHILD_PROCESS: {
    reason: '子流程审批不通过'
  },
  CANCEL_BY_SYSTEM: {
    reason: '系统自动取消'
  },
  TIMEOUT_APPROVE: {
    reason: '审批超时，系统自动通过'
  },
  TIMEOUT_REJECT: {
    reason: '审批超时，系统自动不通过'
  },
  ASSIGN_START_USER_APPROVE: {
    reason: '审批人与提交人为同一人时，自动通过'
  },
  ASSIGN_START_USER_APPROVE_WHEN_SKIP: {
    reason: '审批人与提交人为同一人时，自动通过'
  },
  ASSIGN_START_USER_APPROVE_WHEN_SKIP_START_USER_NODE: {
    reason: '发起人节点首次自动通过'
  },
  ASSIGN_START_USER_APPROVE_WHEN_DEPT_LEADER_NOT_FOUND: {
    reason: '审批人与提交人为同一人时，找不到部门负责人，自动通过'
  },
  ASSIGN_START_USER_TRANSFER_DEPT_LEADER: {
    reason: '审批人与提交人为同一人时，转交给部门负责人审批'
  },
  ASSIGN_EMPTY_APPROVE: {
    reason: '审批人为空，自动通过'
  },
  ASSIGN_EMPTY_REJECT: {
    reason: '审批人为空，自动不通过'
  },
  APPROVE_TYPE_AUTO_APPROVE: {
    reason: '非人工审核，自动通过'
  },
  APPROVE_TYPE_AUTO_REJECT: {
    reason: '非人工审核，自动不通过'
  },
  CANCEL_BY_PROCESS_CLEAN: {
    reason: '进程清理自动取消'
  },
  CANCEL_BY_WITHDRAW: {
    reason: '前一任务撤回，系统自动取消'
  }
}

export const BpmUserTaskApproveMethodEnum = {
  RANDOM: {
    method: 1,
    name: '随机挑选一人审批',
    completionCondition: null
  },
  RATIO: {
    method: 2,
    name: '多人会签（按通过比例）',
    completionCondition: '${ nrOfCompletedInstances/nrOfInstances >= %s}'
  },
  ANY: {
    method: 3,
    name: '多人或签（一人通过或拒绝）',
    completionCondition: '${ nrOfCompletedInstances > 0 }'
  },
  SEQUENTIAL: {
    method: 4,
    name: '依次审批',
    completionCondition: '${ nrOfCompletedInstances >= nrOfInstances }'
  }
}

export const BpmHttpRequestParamTypeEnum = {
  FIXED_VALUE: {
    type: 1,
    name: '固定值'
  },
  FROM_FORM: {
    type: 2,
    name: '表单'
  }
}

export const BpmChildProcessStartUserTypeEnum = {
  MAIN_PROCESS_START_USER: {
    type: 1,
    name: '同主流程发起人'
  },
  FROM_FORM: {
    type: 2,
    name: '表单'
  }
}

export const BpmProcessListenerTypeEnum = {
  EXECUTION: {
    type: 'execution',
    name: '执行监听器'
  },
  TASK: {
    type: 'task',
    name: '任务执行器'
  }
}

export const BpmUserTaskAssignEmptyHandlerTypeEnum = {
  APPROVE: {
    type: 1
  },
  REJECT: {
    type: 2
  },
  ASSIGN_USER: {
    type: 3
  },
  ASSIGN_ADMIN: {
    type: 4
  }
}

export const BpmUserTaskApproveTypeEnum = {
  USER: {
    type: 1
  },
  AUTO_APPROVE: {
    type: 2
  },
  AUTO_REJECT: {
    type: 3
  }
}

export const BpmCommentTypeEnum = {
  APPROVE: {
    type: '1',
    name: '审批通过',
    comment: '审批通过，原因是：{}'
  },
  REJECT: {
    type: '2',
    name: '不通过',
    comment: '审批不通过：原因是：{}'
  },
  CANCEL: {
    type: '3',
    name: '已取消',
    comment: '系统自动取消，原因是：{}'
  },
  RETURN: {
    type: '4',
    name: '退回',
    comment: '任务被退回，原因是：{}'
  },
  DELEGATE_START: {
    type: '5',
    name: '委派发起',
    comment: '[{}]将任务委派给[{}]，委派理由为:{}'
  },
  DELEGATE_END: {
    type: '6',
    name: '委派完成',
    comment: '[{}]完成委派任务，任务重新回到[{}]手中，审批建议为:{}'
  },
  TRANSFER: {
    type: '7',
    name: '转派',
    comment: '[{}]将任务转派给[{}]，转派理由为:{}'
  },
  ADD_SIGN: {
    type: '8',
    name: '加签',
    comment: '[{}]{}给了[{}]，理由为：{}'
  },
  SUB_SIGN: {
    type: '9',
    name: '减签',
    comment: '[{}]操作了【减签】,审批人[{}]的任务被取消'
  }
}

export const BpmTaskSignTypeEnum = {
  BEFORE: {
    type: 'before',
    name: '向前加签'
  },
  AFTER: {
    type: 'after',
    name: '向后加签'
  }
}

export const BpmAutoApproveTypeEnum = {
  NONE: {
    type: 0,
    name: '不自动通过'
  },
  APPROVE_ALL: {
    type: 1,
    name: '仅审批一次，后续重复的审批节点均自动通过'
  },
  APPROVE_SEQUENT: {
    type: 2,
    name: '仅针对连续审批的节点自动通过'
  }
}

export const BpmUserTaskAssignStartUserHandlerTypeEnum = {
  START_USER_AUDIT: {
    type: 1
  },
  SKIP: {
    type: 2
  },
  TRANSFER_DEPT_LEADER: {
    type: 3
  }
}

export const BannerPositionEnum = {
  HOME_POSITION: {
    position: 1,
    name: '首页'
  },
  SECKILL_POSITION: {
    position: 2,
    name: '秒杀活动页'
  },
  COMBINATION_POSITION: {
    position: 3,
    name: '砍价活动页'
  },
  DISCOUNT_POSITION: {
    position: 4,
    name: '限时折扣页'
  },
  REWARD_POSITION: {
    position: 5,
    name: '满减送页'
  }
}

export const BpmBoundaryEventTypeEnum = {
  USER_TASK_TIMEOUT: {
    type: 1,
    name: '用户任务超时'
  },
  DELAY_TIMER_TIMEOUT: {
    type: 2,
    name: '延迟器超时'
  },
  CHILD_PROCESS_TIMEOUT: {
    type: 3,
    name: '子流程超时'
  }
}

export const BpmProcessListenerValueTypeEnum = {
  CLASS: {
    type: 'class',
    name: 'Java 类'
  },
  DELEGATE_EXPRESSION: {
    type: 'delegateExpression',
    name: '代理表达式'
  },
  EXPRESSION: {
    type: 'expression',
    name: '表达式'
  }
}

export const BpmSimpleModelNodeTypeEnum = {
  START_NODE: {
    type: 0,
    name: '开始',
    bpmnType: 'startEvent'
  },
  END_NODE: {
    type: 1,
    name: '结束',
    bpmnType: 'endEvent'
  },
  START_USER_NODE: {
    type: 10,
    name: '发起人',
    bpmnType: 'userTask'
  },
  APPROVE_NODE: {
    type: 11,
    name: '审批人',
    bpmnType: 'userTask'
  },
  COPY_NODE: {
    type: 12,
    name: '抄送人',
    bpmnType: 'serviceTask'
  },
  TRANSACTOR_NODE: {
    type: 13,
    name: '办理人',
    bpmnType: 'userTask'
  },
  DELAY_TIMER_NODE: {
    type: 14,
    name: '延迟器',
    bpmnType: 'receiveTask'
  },
  TRIGGER_NODE: {
    type: 15,
    name: '触发器',
    bpmnType: 'serviceTask'
  },
  CHILD_PROCESS: {
    type: 20,
    name: '子流程',
    bpmnType: 'callActivity'
  },
  CONDITION_NODE: {
    type: 50,
    name: '条件',
    bpmnType: 'sequenceFlow'
  },
  CONDITION_BRANCH_NODE: {
    type: 51,
    name: '条件分支',
    bpmnType: 'exclusiveGateway'
  },
  PARALLEL_BRANCH_NODE: {
    type: 52,
    name: '并行分支',
    bpmnType: 'inclusiveGateway'
  },
  INCLUSIVE_BRANCH_NODE: {
    type: 53,
    name: '包容分支',
    bpmnType: 'inclusiveGateway'
  },
  ROUTER_BRANCH_NODE: {
    type: 54,
    name: '路由分支',
    bpmnType: 'exclusiveGateway'
  }
}

export const BpmTaskStatusEnum = {
  SKIP: {
    status: -2,
    name: '跳过'
  },
  NOT_START: {
    status: -1,
    name: '未开始'
  },
  RUNNING: {
    status: 1,
    name: '审批中'
  },
  APPROVE: {
    status: 2,
    name: '审批通过'
  },
  REJECT: {
    status: 3,
    name: '审批不通过'
  },
  CANCEL: {
    status: 4,
    name: '已取消'
  },
  RETURN: {
    status: 5,
    name: '已退回'
  },
  APPROVING: {
    status: 7,
    name: '审批通过中'
  },
  WAIT: {
    status: 0,
    name: '待审批'
  }
}

export const BpmUserTaskRejectHandlerTypeEnum = {
  FINISH_PROCESS_INSTANCE: {
    type: 1,
    name: '终止流程'
  },
  RETURN_USER_TASK: {
    type: 2,
    name: '驳回到指定任务节点'
  }
}

// ========== CRM 模块 ==========
// CRM 的审批状态枚举
export const CrmAuditStatusEnum = {
  DRAFT: {
    status: 0,
    name: '未提交'
  },
  PROCESS: {
    status: 10,
    name: '审批中'
  },
  APPROVE: {
    status: 20,
    name: '审核通过'
  },
  REJECT: {
    status: 30,
    name: '审核不通过'
  },
  CANCEL: {
    status: 40,
    name: '已取消'
  }
}

// CRM 业务类型枚举
export const CrmBizTypeEnum = {
  CRM_CLUE: {
    type: 1,
    name: '线索'
  },
  CRM_CUSTOMER: {
    type: 2,
    name: '客户'
  },
  CRM_CONTACT: {
    type: 3,
    name: '联系人'
  },
  CRM_BUSINESS: {
    type: 4,
    name: '商机'
  },
  CRM_CONTRACT: {
    type: 5,
    name: '合同'
  },
  CRM_PRODUCT: {
    type: 6,
    name: '产品'
  },
  CRM_RECEIVABLE: {
    type: 7,
    name: '回款'
  },
  CRM_RECEIVABLE_PLAN: {
    type: 8,
    name: '回款计划'
  }
}

// CRM 数据权限级别枚举
export const CrmPermissionLevelEnum = {
  OWNER: {
    level: 1,
    name: '负责人'
  },
  READ: {
    level: 2,
    name: '只读'
  },
  WRITE: {
    level: 3,
    name: '读写'
  }
}

// CRM 客户等级枚举
export const CrmCustomerLevelEnum = {
  IMPORTANT: {
    level: 1,
    name: 'A（重点客户）'
  },
  GENERAL: {
    level: 2,
    name: 'B（普通客户）'
  },
  LOW_PRIORITY: {
    level: 3,
    name: 'C（非优先客户）'
  }
}

// CRM 列表检索场景枚举
export const CrmSceneTypeEnum = {
  OWNER: {
    type: 1,
    name: '我负责的'
  },
  INVOLVED: {
    type: 2,
    name: '我参与的'
  },
  SUBORDINATE: {
    type: 3,
    name: '下属负责的'
  }
}

// CRM 商品状态枚举
export const CrmProductStatusEnum = {
  DISABLE: {
    status: 0,
    name: '下架'
  },
  ENABLE: {
    status: 1,
    name: '上架'
  }
}

// CRM 客户限制配置规则类型枚举
export const CrmCustomerLimitConfigTypeEnum = {
  CUSTOMER_OWNER_LIMIT: {
    type: 1,
    name: '拥有客户数限制'
  },
  CUSTOMER_LOCK_LIMIT: {
    type: 2,
    name: '锁定客户数限制'
  }
}

// CRM 回款方式枚举
export const CrmReceivableReturnTypeEnum = {
  CHECK: {
    type: 1,
    name: '支票'
  },
  CASH: {
    type: 2,
    name: '现金'
  },
  POSTAL_REMITTANCE: {
    type: 3,
    name: '邮政汇款'
  },
  TELEGRAPHIC_TRANSFER: {
    type: 4,
    name: '电汇'
  },
  ONLINE_TRANSFER: {
    type: 5,
    name: '网上转账'
  },
  ALIPAY: {
    type: 6,
    name: '支付宝'
  },
  WECHAT_PAY: {
    type: 7,
    name: '微信支付'
  },
  OTHER: {
    type: 8,
    name: '其它'
  }
}

// 商机的结束状态枚举
export const CrmBusinessEndStatusEnum = {
  WIN: {
    status: 1,
    name: '赢单'
  },
  LOSE: {
    status: 2,
    name: '输单'
  },
  INVALID: {
    status: 3,
    name: '无效'
  }
}

// ========== ERP 模块 ==========
// ERP 库存明细 - 业务类型枚举
export const ErpStockRecordBizTypeEnum = {
  OTHER_IN: {
    type: 10,
    name: '其它入库'
  },
  OTHER_IN_CANCEL: {
    type: 11,
    name: '其它入库（作废）'
  },
  OTHER_OUT: {
    type: 20,
    name: '其它出库'
  },
  OTHER_OUT_CANCEL: {
    type: 21,
    name: '其它出库（作废）'
  },
  MOVE_IN: {
    type: 30,
    name: '调拨入库'
  },
  MOVE_IN_CANCEL: {
    type: 31,
    name: '调拨入库（作废）'
  },
  MOVE_OUT: {
    type: 32,
    name: '调拨出库'
  },
  MOVE_OUT_CANCEL: {
    type: 33,
    name: '调拨出库（作废）'
  },
  CHECK_MORE_IN: {
    type: 40,
    name: '盘盈入库'
  },
  CHECK_MORE_IN_CANCEL: {
    type: 41,
    name: '盘盈入库（作废）'
  },
  CHECK_LESS_OUT: {
    type: 42,
    name: '盘亏出库'
  },
  CHECK_LESS_OUT_CANCEL: {
    type: 43,
    name: '盘亏出库（作废）'
  },
  SALE_OUT: {
    type: 50,
    name: '销售出库'
  },
  SALE_OUT_CANCEL: {
    type: 51,
    name: '销售出库（作废）'
  },
  SALE_RETURN: {
    type: 60,
    name: '销售退货入库'
  },
  SALE_RETURN_CANCEL: {
    type: 61,
    name: '销售退货入库（作废）'
  },
  PURCHASE_IN: {
    type: 70,
    name: '采购入库'
  },
  PURCHASE_IN_CANCEL: {
    type: 71,
    name: '采购入库（作废）'
  },
  PURCHASE_RETURN: {
    type: 80,
    name: '采购退货出库'
  },
  PURCHASE_RETURN_CANCEL: {
    type: 81,
    name: '采购退货出库（作废）'
  }
}

// ERP 审核状态枚举
export const ErpAuditStatusEnum = {
  PROCESS: {
    status: 10,
    name: '待审批'
  },
  APPROVE: {
    status: 20,
    name: '已审批'
  }
}

// ERP 业务类型枚举
export const ErpBizTypeEnum = {
  PURCHASE_ORDER: {
    type: 10,
    name: '采购订单'
  },
  PURCHASE_IN: {
    type: 11,
    name: '采购入库'
  },
  PURCHASE_RETURN: {
    type: 12,
    name: '采购退货'
  },
  SALE_ORDER: {
    type: 20,
    name: '销售订单'
  },
  SALE_OUT: {
    type: 21,
    name: '销售出库'
  },
  SALE_RETURN: {
    type: 22,
    name: '销售退货'
  }
}

// ========== MEMBER 模块 ==========
// 会员经验 - 业务类型枚举
export const MemberExperienceBizTypeEnum = {
  ADMIN: {
    type: 0,
    title: '管理员调整',
    description: '管理员调整获得 {} 经验',
    add: true
  },
  INVITE_REGISTER: {
    type: 1,
    title: '邀新奖励',
    description: '邀请好友获得 {} 经验',
    add: true
  },
  SIGN_IN: {
    type: 4,
    title: '签到奖励',
    description: '签到获得 {} 经验',
    add: true
  },
  LOTTERY: {
    type: 5,
    title: '抽奖奖励',
    description: '抽奖获得 {} 经验',
    add: true
  },
  ORDER_GIVE: {
    type: 11,
    title: '下单奖励',
    description: '下单获得 {} 经验',
    add: true
  },
  ORDER_GIVE_CANCEL: {
    type: 12,
    title: '下单奖励（整单取消）',
    description: '取消订单获得 {} 经验',
    add: false
  },
  ORDER_GIVE_CANCEL_ITEM: {
    type: 13,
    title: '下单奖励（单个退款）',
    description: '退款订单获得 {} 经验',
    add: false
  }
}

// 会员积分的业务类型枚举
export const MemberPointBizTypeEnum = {
  SIGN: {
    type: 1,
    name: '签到',
    description: '签到获得 {} 积分',
    add: true
  },
  ADMIN: {
    type: 2,
    name: '管理员修改',
    description: '管理员修改 {} 积分',
    add: true
  },
  ORDER_USE: {
    type: 11,
    name: '订单积分抵扣',
    description: '下单使用 {} 积分',
    add: false
  },
  ORDER_USE_CANCEL: {
    type: 12,
    name: '订单积分抵扣（整单取消）',
    description: '订单取消，退还 {} 积分',
    add: true
  },
  ORDER_USE_CANCEL_ITEM: {
    type: 13,
    name: '订单积分抵扣（单个退款）',
    description: '订单退款，退还 {} 积分',
    add: true
  },
  ORDER_GIVE: {
    type: 21,
    name: '订单积分奖励',
    description: '下单获得 {} 积分',
    add: true
  },
  ORDER_GIVE_CANCEL: {
    type: 22,
    name: '订单积分奖励（整单取消）',
    description: '订单取消，退还 {} 积分',
    add: false
  },
  ORDER_GIVE_CANCEL_ITEM: {
    type: 23,
    name: '订单积分奖励（单个退款）',
    description: '订单退款，扣除赠送的 {} 积分',
    add: false
  }
}

// ========== PAY 模块 ==========
// 支付通知状态枚举
export const PayNotifyStatusEnum = {
  WAITING: {
    status: 0,
    name: '等待通知'
  },
  SUCCESS: {
    status: 10,
    name: '通知成功'
  },
  FAILURE: {
    status: 20,
    name: '通知失败'
  },
  REQUEST_SUCCESS: {
    status: 21,
    name: '请求成功，但是结果失败'
  },
  REQUEST_FAILURE: {
    status: 22,
    name: '请求失败'
  }
}

// 支付订单的状态枚举
export const PayOrderStatusEnum = {
  WAITING: {
    status: 0,
    name: '未支付'
  },
  SUCCESS: {
    status: 10,
    name: '支付成功'
  },
  REFUND: {
    status: 20,
    name: '已退款'
  },
  CLOSED: {
    status: 30,
    name: '支付关闭'
  }
}

// 支付通知类型
export const PayNotifyTypeEnum = {
  ORDER: {
    type: 1,
    name: '支付单'
  },
  REFUND: {
    type: 2,
    name: '退款单'
  },
  TRANSFER: {
    type: 3,
    name: '转账单'
  }
}

// 支付的展示模式枚举
export const PayDisplayModeEnum = {
  URL: {
    mode: 'url'
  },
  IFRAME: {
    mode: 'iframe'
  },
  FORM: {
    mode: 'form'
  },
  QR_CODE: {
    mode: 'qr_code'
  },
  APP: {
    mode: 'app'
  }
}

// 支付渠道的编码的枚举
export const PayChannelEnum = {
  WX_PUB: {
    code: 'wx_pub',
    name: '微信 JSAPI 支付'
  },
  WX_LITE: {
    code: 'wx_lite',
    name: '微信小程序支付'
  },
  WX_APP: {
    code: 'wx_app',
    name: '微信 App 支付'
  },
  WX_NATIVE: {
    code: 'wx_native',
    name: '微信 Native 支付'
  },
  WX_WAP: {
    code: 'wx_wap',
    name: '微信 H5 支付'
  },
  WX_BAR: {
    code: 'wx_bar',
    name: '微信付款码支付'
  },
  ALIPAY_PC: {
    code: 'alipay_pc',
    name: '支付宝 PC 网站支付'
  },
  ALIPAY_WAP: {
    code: 'alipay_wap',
    name: '支付宝 Wap 网站支付'
  },
  ALIPAY_APP: {
    code: 'alipay_app',
    name: '支付宝 App 支付'
  },
  ALIPAY_QR: {
    code: 'alipay_qr',
    name: '支付宝扫码支付'
  },
  ALIPAY_BAR: {
    code: 'alipay_bar',
    name: '支付宝条码支付'
  },
  WALLET: {
    code: 'wallet',
    name: '钱包支付'
  }
}

// 钱包交易业务分类
export const PayWalletBizTypeEnum = {
  RECHARGE: {
    type: 1,
    description: '充值'
  },
  RECHARGE_REFUND: {
    type: 2,
    description: '充值退款'
  },
  PAYMENT: {
    type: 3,
    description: '支付'
  },
  PAYMENT_REFUND: {
    type: 4,
    description: '支付退款'
  },
  UPDATE_BALANCE: {
    type: 5,
    description: '更新余额'
  },
  TRANSFER: {
    type: 6,
    description: '转账'
  }
}

// 渠道的退款状态枚举
export const PayRefundStatusEnum = {
  WAITING: {
    status: 0,
    name: '未退款'
  },
  SUCCESS: {
    status: 10,
    name: '退款成功'
  },
  FAILURE: {
    status: 20,
    name: '退款失败'
  }
}

// 渠道的转账状态枚举
export const PayTransferStatusEnum = {
  WAITING: {
    status: 0,
    name: '等待转账'
  },
  PROCESSING: {
    status: 5,
    name: '转账进行中'
  },
  SUCCESS: {
    status: 10,
    name: '转账成功'
  },
  CLOSED: {
    status: 20,
    name: '转账关闭'
  }
}

// ========== MALL-PRODUCT 模块 ==========
// SPU状态枚举
export const ProductSpuStatusEnum = {
  RECYCLE: {
    status: -1,
    name: '回收站'
  },
  DISABLE: {
    status: 0,
    name: '下架'
  },
  ENABLE: {
    status: 1,
    name: '上架'
  }
}

// 评论星级枚举
export const CommentScoresEnum = {
  ONE: {
    scores: 1,
    name: '1星'
  },
  TWO: {
    scores: 2,
    name: '2星'
  },
  THREE: {
    scores: 3,
    name: '3星'
  },
  FOUR: {
    scores: 4,
    name: '4星'
  },
  FIVE: {
    scores: 5,
    name: '5星'
  }
}

// ========== MALL-PROMOTION 模块 ==========
// 优惠类型枚举
export const PromotionDiscountTypeEnum = {
  PRICE: {
    type: 1,
    name: '满减'
  },
  PERCENT: {
    type: 2,
    name: '折扣'
  }
}

// 营销条件类型枚举
export const PromotionConditionTypeEnum = {
  PRICE: {
    type: 10,
    name: '满 N 元'
  },
  COUNT: {
    type: 20,
    name: '满 N 件'
  }
}

// 营销商品范围枚举
export const PromotionProductScopeEnum = {
  ALL: {
    scope: 1,
    name: '全部商品'
  },
  SPU: {
    scope: 2,
    name: '指定商品'
  },
  CATEGORY: {
    scope: 3,
    name: '指定品类'
  }
}

// 优惠券领取方式枚举
export const CouponTakeTypeEnum = {
  USER: {
    type: 1,
    name: '直接领取'
  },
  ADMIN: {
    type: 2,
    name: '指定发放'
  },
  REGISTER: {
    type: 3,
    name: '新人券'
  }
}

// 优惠券状态枚举
export const CouponStatusEnum = {
  UNUSED: {
    status: 1,
    name: '未使用'
  },
  USED: {
    status: 2,
    name: '已使用'
  },
  EXPIRE: {
    status: 3,
    name: '已过期'
  }
}

// 优惠券模板的有限期类型枚举
export const CouponTemplateValidityTypeEnum = {
  DATE: {
    type: 1,
    name: '固定日期'
  },
  TERM: {
    type: 2,
    name: '领取之后'
  }
}

export const BargainRecordStatusEnum = {
  IN_PROGRESS: {
    status: 1,
    name: '砍价中'
  },
  SUCCESS: {
    status: 2,
    name: '砍价成功'
  },
  FAILED: {
    status: 3,
    name: '砍价失败'
  }
}

// ========== MALL-STATISTICS 模块 ==========
// 时间范围类型的枚举
export const TimeRangeTypeEnum = {
  DAY: {
    type: 1
  },
  WEEK: {
    type: 7
  },
  MONTH: {
    type: 30
  },
  YEAR: {
    type: 365
  }
}

// ========== MALL-TRADE 模块 ==========
// 配送方式枚举
export const DeliveryTypeEnum = {
  EXPRESS: {
    type: 1,
    name: '快递发货'
  },
  PICK_UP: {
    type: 2,
    name: '用户自提'
  }
}

// 拼团状态枚举
export const CombinationRecordStatusEnum = {
  IN_PROGRESS: {
    status: 0,
    name: '进行中'
  },
  SUCCESS: {
    status: 1,
    name: '拼团成功'
  },
  FAILED: {
    status: 2,
    name: '拼团失败'
  }
}

export const AfterSaleStatusEnum = {
  APPLY: {
    status: 10,
    name: '申请中',
    content: '会员申请退款'
  },
  SELLER_AGREE: {
    status: 20,
    name: '卖家通过',
    content: '商家同意退款'
  },
  BUYER_DELIVERY: {
    status: 30,
    name: '待卖家收货',
    content: '会员填写退货物流信息'
  },
  WAIT_REFUND: {
    status: 40,
    name: '等待平台退款',
    content: '商家收货'
  },
  COMPLETE: {
    status: 50,
    name: '完成',
    content: '商家确认退款'
  },
  BUYER_CANCEL: {
    status: 61,
    name: '买家取消售后',
    content: '会员取消退款'
  },
  SELLER_DISAGREE: {
    status: 62,
    name: '卖家拒绝',
    content: '商家拒绝退款'
  },
  SELLER_REFUSE: {
    status: 63,
    name: '卖家拒绝收货',
    content: '商家拒绝收货'
  }
}

export const AfterSaleWayEnum = {
  REFUND: {
    way: 10,
    name: '仅退款'
  },
  RETURN_AND_REFUND: {
    way: 20,
    name: '退货退款'
  }
}

export const AfterSaleTypeEnum = {
  IN_SALE: {
    type: 10,
    name: '售中退款'
  },
  AFTER_SALE: {
    type: 20,
    name: '售后退款'
  }
}

export const AfterSaleOperateTypeEnum = {
  MEMBER_CREATE: {
    type: 10,
    content: '会员申请退款'
  },
  ADMIN_AGREE_APPLY: {
    type: 11,
    content: '商家同意退款'
  },
  ADMIN_DISAGREE_APPLY: {
    type: 12,
    content: '商家拒绝退款'
  },
  MEMBER_DELIVERY: {
    type: 20,
    content: '会员填写退货物流信息，快递公司：{deliveryName}，快递单号：{logisticsNo}'
  },
  ADMIN_AGREE_RECEIVE: {
    type: 21,
    content: '商家收货'
  },
  ADMIN_DISAGREE_RECEIVE: {
    type: 22,
    content: '商家拒绝收货，原因：{reason}'
  },
  ADMIN_REFUND: {
    type: 30,
    content: '商家发起退款'
  },
  SYSTEM_REFUND_SUCCESS: {
    type: 31,
    content: '退款成功'
  },
  SYSTEM_REFUND_FAIL: {
    type: 32,
    content: '退款失败'
  },
  MEMBER_CANCEL: {
    type: 40,
    content: '会员取消退款'
  }
}

// 交易订单 - 退款状态
export const TradeOrderRefundStatusEnum = {
  NONE: {
    status: 0,
    name: '未退款'
  },
  PART: {
    status: 10,
    name: '部分退款'
  },
  ALL: {
    status: 20,
    name: '全部退款'
  }
}

// 交易订单 - 关闭类型
export const TradeOrderCancelTypeEnum = {
  PAY_TIMEOUT: {
    type: 10,
    name: '超时未支付'
  },
  AFTER_SALE_CLOSE: {
    type: 20,
    name: '退款关闭'
  },
  MEMBER_CANCEL: {
    type: 30,
    name: '买家取消'
  },
  COMBINATION_CLOSE: {
    type: 40,
    name: '拼团关闭'
  }
}

// 订单状态
export const TradeOrderStatusEnum = {
  UNPAID: {
    status: 0,
    name: '待支付'
  },
  UNDELIVERED: {
    status: 10,
    name: '待发货'
  },
  DELIVERED: {
    status: 20,
    name: '已发货'
  },
  COMPLETED: {
    status: 30,
    name: '已完成'
  },
  CANCELED: {
    status: 40,
    name: '已取消'
  }
}

// 交易订单项 - 售后状态
export const TradeOrderItemAfterSaleStatusEnum = {
  NONE: {
    status: 0,
    name: '未售后'
  },
  APPLY: {
    status: 10,
    name: '售后中'
  },
  SUCCESS: {
    status: 20,
    name: '售后成功'
  }
}

// 订单操作类型的枚举
export const TradeOrderOperateTypeEnum = {
  MEMBER_CREATE: {
    type: 1,
    content: '用户下单'
  },
  ADMIN_UPDATE_PRICE: {
    type: 2,
    content: '订单价格 {oldPayPrice} 修改，调整价格 {adjustPrice}，实际支付金额为 {newPayPrice} 元'
  },
  MEMBER_PAY: {
    type: 10,
    content: '用户付款成功'
  },
  ADMIN_UPDATE_ADDRESS: {
    type: 11,
    content: '收货地址修改'
  },
  ADMIN_DELIVERY: {
    type: 20,
    content: '已发货，快递公司：{expressName}，快递单号：{logisticsNo}'
  },
  MEMBER_RECEIVE: {
    type: 30,
    content: '用户已收货'
  },
  SYSTEM_RECEIVE: {
    type: 31,
    content: '到期未收货，系统自动确认收货'
  },
  ADMIN_PICK_UP_RECEIVE: {
    type: 32,
    content: '管理员自提收货'
  },
  MEMBER_COMMENT: {
    type: 33,
    content: '用户评价'
  },
  SYSTEM_COMMENT: {
    type: 34,
    content: '到期未评价，系统自动评价'
  },
  MEMBER_CANCEL: {
    type: 40,
    content: '取消订单'
  },
  SYSTEM_CANCEL: {
    type: 41,
    content: '到期未支付，系统自动取消订单'
  },
  ADMIN_CANCEL_AFTER_SALE: {
    type: 43,
    content: '订单全部售后，管理员自动取消订单'
  },
  MEMBER_DELETE: {
    type: 49,
    content: '删除订单'
  }
}

// 交易订单类型枚举
export const TradeOrderTypeEnum = {
  NORMAL: {
    type: 0,
    name: '普通订单'
  },
  SECKILL: {
    type: 1,
    name: '秒杀订单'
  },
  BARGAIN: {
    type: 2,
    name: '砍价订单'
  },
  COMBINATION: {
    type: 3,
    name: '拼团订单'
  },
  POINT: {
    type: 4,
    name: '积分商城'
  }
}

// 佣金提现类型枚举
export const BrokerageWithdrawTypeEnum = {
  WALLET: {
    type: 1,
    name: '钱包'
  },
  BANK: {
    type: 2,
    name: '银行卡'
  },
  WECHAT: {
    type: 3,
    name: '微信'
  },
  ALIPAY: {
    type: 4,
    name: '支付宝'
  }
}

// 佣金提现状态枚举
export const BrokerageWithdrawStatusEnum = {
  AUDITING: {
    status: 0,
    name: '审核中'
  },
  AUDIT_SUCCESS: {
    status: 10,
    name: '审核通过'
  },
  WITHDRAW_SUCCESS: {
    status: 11,
    name: '提现成功'
  },
  AUDIT_FAIL: {
    status: 20,
    name: '审核不通过'
  },
  WITHDRAW_FAIL: {
    status: 21,
    name: '提现失败'
  }
}

// 佣金记录业务类型枚举
export const BrokerageRecordBizTypeEnum = {
  ORDER: {
    type: 1,
    title: '获得推广佣金',
    description: '获得推广佣金 {}',
    add: true
  },
  WITHDRAW: {
    type: 2,
    title: '提现申请',
    description: '提现申请扣除佣金 {}',
    add: false
  },
  WITHDRAW_REJECT: {
    type: 3,
    title: '提现申请驳回',
    description: '提现申请驳回，返还佣金 {}',
    add: true
  }
}

// 佣金记录状态枚举
export const BrokerageRecordStatusEnum = {
  WAIT_SETTLEMENT: {
    status: 0,
    name: '待结算'
  },
  SETTLEMENT: {
    status: 1,
    name: '已结算'
  },
  CANCEL: {
    status: 2,
    name: '已取消'
  }
}

// 分佣模式枚举
export const BrokerageEnabledConditionEnum = {
  ALL: {
    condition: 1,
    name: '人人分销'
  },
  ADMIN: {
    condition: 2,
    name: '指定分销'
  }
}

// 分销关系绑定模式枚举
export const BrokerageBindModeEnum = {
  ANYTIME: {
    mode: 1,
    name: '首次绑定'
  },
  REGISTER: {
    mode: 2,
    name: '注册绑定'
  },
  OVERRIDE: {
    mode: 3,
    name: '覆盖绑定'
  }
}

// ========== HRM 招聘模块 ==========

// 招聘候选人状态枚举
export const HrmRecruitCandidateStatusEnum = {
  NEW: {
    status: 1,
    name: '新候选人'
  },
  PRIMARY_PASS: {
    status: 2,
    name: '初选通过'
  },
  INTERVIEW: {
    status: 3,
    name: '安排面试'
  },
  INTERVIEW_PASS: {
    status: 4,
    name: '面试通过'
  },
  OFFER_SENT: {
    status: 5,
    name: '已发 offer'
  },
  PENDING_ENTRY: {
    status: 6,
    name: '待入职'
  },
  ELIMINATED: {
    status: 7,
    name: '已淘汰'
  },
  JOINED: {
    status: 8,
    name: '已入职'
  }
}

// 招聘候选人学历枚举
export const HrmRecruitCandidateEducationEnum = {
  PRIMARY_SCHOOL: {
    education: 1,
    name: '小学'
  },
  JUNIOR_HIGH_SCHOOL: {
    education: 2,
    name: '初中'
  },
  SECONDARY_TECHNICAL_SCHOOL: {
    education: 3,
    name: '中专'
  },
  SECONDARY_VOCATIONAL_SCHOOL: {
    education: 4,
    name: '中职'
  },
  TECHNICAL_SCHOOL: {
    education: 5,
    name: '技校'
  },
  HIGH_SCHOOL: {
    education: 6,
    name: '高中'
  },
  COLLEGE: {
    education: 7,
    name: '大专'
  },
  BACHELOR: {
    education: 8,
    name: '本科'
  },
  MASTER: {
    education: 9,
    name: '硕士'
  },
  DOCTOR: {
    education: 10,
    name: '博士'
  },
  POSTDOCTORAL: {
    education: 11,
    name: '博士后'
  },
  OTHER: {
    education: 12,
    name: '其他'
  }
}

// 招聘面试方式枚举
export const HrmRecruitInterviewTypeEnum = {
  ONSITE: {
    type: 1,
    name: '现场面试'
  },
  PHONE: {
    type: 2,
    name: '电话面试'
  },
  VIDEO: {
    type: 3,
    name: '视频面试'
  }
}

// 招聘面试结果枚举
export const HrmRecruitInterviewResultEnum = {
  UNFINISHED: {
    result: 1,
    name: '面试未完成'
  },
  PASS: {
    result: 2,
    name: '面试通过'
  },
  NOT_PASS: {
    result: 3,
    name: '面试未通过'
  },
  CANCEL: {
    result: 4,
    name: '面试取消'
  }
}
