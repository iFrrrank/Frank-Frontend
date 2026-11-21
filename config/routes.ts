export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './user/login' }]
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/system',
    name: '系统管理',
    icon: 'setting',
    routes: [
      { path: '/system/user', name: '用户管理', icon: 'user', component: './system/user' },
      { path: '/system/role', name: '角色管理', icon: 'team', component: './system/role' },
      { path: '/system/dept', name: '部门管理', icon: 'apartment', component: './system/dept' },
      { path: '/system/menu', name: '菜单管理', icon: 'menu', component: './system/menu' },
      { path: '/system/post', name: '岗位管理', icon: 'solution', component: './system/post' },
      { path: '/system/area', name: '地区管理', icon: 'global', component: './system/area' },
      { path: '/system/dict', name: '字典管理', icon: 'book', component: './system/dict' },
      {
        path: '/system/dict/data/:dictType',
        name: '字典数据',
        component: './system/dict/data',
        hideInMenu: true
      },
      {
        path: '/system/messages',
        name: '消息中心',
        icon: 'message',
        routes: [
          {
            path: '/system/messages/sms',
            name: '短信管理',
            icon: 'mobile',
            routes: [
              {
                path: '/system/messages/sms/channel',
                name: '短信渠道',
                icon: 'phone',
                component: './system/sms/channel'
              },
              {
                path: '/system/messages/sms/sms-template',
                name: '短信模板',
                icon: 'fileText',
                component: './system/sms/template'
              },
              {
                path: '/system/messages/sms/sms-log',
                name: '短信日志',
                icon: 'fileDone',
                component: './system/sms/log'
              }
            ]
          },
          {
            path: '/system/messages/mail',
            name: '邮件管理',
            icon: 'mail',
            routes: [
              {
                path: '/system/messages/mail/mail-account',
                name: '邮件账号',
                icon: 'inbox',
                component: './system/mail/account'
              },
              {
                path: '/system/messages/mail/mail-template',
                name: '邮件模板',
                icon: 'fileText',
                component: './system/mail/template'
              },
              {
                path: '/system/messages/mail/mail-log',
                name: '邮件日志',
                icon: 'fileDone',
                component: './system/mail/log'
              }
            ]
          },
          {
            path: '/system/messages/notify',
            name: '站内信管理',
            icon: 'bell',
            routes: [
              {
                path: '/system/messages/notify/notify-template',
                name: '模板管理',
                icon: 'fileText',
                component: './system/notify/template'
              },
              {
                path: '/system/messages/notify/notify-message',
                name: '消息记录',
                icon: 'message',
                component: './system/notify/message'
              },
              {
                path: '/system/messages/notify/my',
                name: '我的站内信',
                icon: 'mail',
                component: './system/notify/my'
              }
            ]
          },
          {
            path: '/system/messages/notice',
            name: '通知公告',
            icon: 'notification',
            component: './system/notice'
          }
        ]
      },
      {
        path: '/system/log',
        name: '审计日志',
        icon: 'audit',
        routes: [
          {
            path: '/system/log/operate-log',
            name: '操作日志',
            icon: 'history',
            component: './system/log/operatelog'
          },
          {
            path: '/system/log/login-log',
            name: '登录日志',
            icon: 'login',
            component: './system/log/loginlog'
          }
        ]
      },
      {
        path: '/system/oauth2',
        name: 'OAuth2',
        icon: 'safety',
        routes: [
          {
            path: '/system/oauth2/oauth2/application',
            name: '应用管理',
            icon: 'appstore',
            component: './system/oauth2/client'
          },
          {
            path: '/system/oauth2/token',
            name: '令牌管理',
            icon: 'key',
            component: './system/oauth2/token'
          }
        ]
      },
      {
        path: '/system/social',
        name: '三方登录',
        icon: 'api',
        routes: [
          {
            path: '/system/social/client',
            name: '三方应用',
            icon: 'api',
            component: './system/social/client'
          },
          {
            path: '/system/social/user',
            name: '三方用户',
            icon: 'usergroupAdd',
            component: './system/social/user'
          }
        ]
      }
    ]
  },
  {
    path: '/infra',
    name: '基础设施',
    icon: 'tool',
    routes: [
      {
        path: '/infra/log',
        name: 'API 日志',
        icon: 'profile',
        routes: [
          {
            path: '/infra/log/api-access-log',
            name: '访问日志',
            icon: 'api',
            component: './infra/log/apiAccessLog'
          },
          {
            path: '/infra/log/api-error-log',
            name: '错误日志',
            icon: 'exception',
            component: './infra/log/apiErrorLog'
          }
        ]
      },
      {
        path: '/infra/file',
        name: '文件管理',
        icon: 'folder',
        routes: [
          {
            path: '/infra/file/list',
            name: '文件列表',
            icon: 'fileText',
            component: './infra/file/list'
          },
          {
            path: '/infra/file/config',
            name: '文件配置',
            icon: 'setting',
            component: './infra/file/config'
          }
        ]
      },
      {
        path: '/infra/config',
        name: '配置管理',
        icon: 'setting',
        component: './infra/config'
      },
      {
        path: '/infra/data-source-config',
        name: '数据源配置',
        icon: 'database',
        component: './infra/dataSourceConfig'
      },
      {
        path: '/infra/monitors',
        name: '系统监控',
        icon: 'dashboard',
        routes: [
          {
            path: '/infra/monitors/redis',
            name: 'Redis 监控',
            icon: 'fund',
            component: './infra/monitors/redis'
          }
        ]
      },
      {
        path: '/infra/job',
        name: '定时任务',
        icon: 'schedule',
        routes: [
          {
            path: '/infra/job',
            redirect: '/infra/job/index'
          },
          {
            path: '/infra/job/index',
            name: '任务管理',
            icon: 'schedule',
            component: './infra/job/index'
          },
          {
            path: '/infra/job/job-log',
            name: '任务日志',
            icon: 'unorderedList',
            component: './infra/job/jobLog/index'
          }
        ]
      }
    ]
  },
  {
    path: '/pay',
    name: '支付管理',
    icon: 'user',
    routes: [
      {
        path: '/pay/app',
        name: '应用中心',
        icon: 'shoppingCart',
        component: './pay/app'
      },
      {
        path: '/pay/order',
        name: '支付订单',
        icon: 'shoppingCart',
        component: './pay/order'
      },
      {
        path: '/pay/refund',
        name: '退款订单',
        icon: 'shoppingCart',
        component: './pay/refund'
      },
      {
        path: '/pay/transfer',
        name: '转账订单',
        icon: 'shoppingCart',
        component: './pay/transfer'
      },
      {
        path: '/pay/wallet',
        name: '钱包管理',
        icon: 'shoppingCart',
        routes: [
          {
            path: '/pay/wallet/balance',
            name: '钱包余额',
            icon: 'shoppingCart',
            component: './pay/wallet/balance'
          },
          {
            path: '/pay/wallet/recharge-package',
            name: '充值套餐',
            icon: 'shoppingCart',
            component: './pay/wallet/package'
          }
        ]
      },
      {
        path: '/pay/notify',
        name: '回调通知',
        icon: 'shoppingCart',
        component: './pay/notify'
      },
      {
        path: '/pay/demo',
        name: '示例功能',
        icon: 'experiment',
        routes: [
          {
            path: '/pay/demo/order',
            name: '示例订单',
            icon: 'shoppingCart',
            component: './pay/demo/order'
          },
          {
            path: '/pay/demo/withdraw',
            name: '示例提现',
            icon: 'shoppingCart',
            component: './pay/demo/withdraw'
          }
        ]
      },
      {
        // 收银台为独立页面（从示例订单等处跳转进入），不显示在菜单中
        path: '/pay/cashier',
        name: '收银台',
        component: './pay/cashier',
        hideInMenu: true
      }
    ]
  },
  {
    path: '/mall',
    name: '商城系统',
    icon: 'user',
    routes: [
      {
        path: '/mall/product',
        name: '商品管理',
        icon: 'shoppingCart',
        routes: [
          {
            name: '商品列表',
            path: '/mall/product/spu',
            icon: 'schedule',
            component: './mall/product/spu/index'
          },
          {
            name: '新增商品',
            path: '/mall/product/spu/add',
            icon: 'schedule',
            component: './mall/product/spu/add',
            hideInMenu: true
          },
          {
            name: '编辑商品',
            path: '/mall/product/spu/edit',
            icon: 'schedule',
            component: './mall/product/spu/add',
            hideInMenu: true
          },
          {
            name: '商品分类',
            path: '/mall/product/category',
            icon: 'schedule',
            component: './mall/product/category'
          },
          {
            name: '商品品牌',
            path: '/mall/product/brand',
            icon: 'schedule',
            component: './mall/product/brand'
          },
          {
            name: '商品属性',
            path: '/mall/product/property',
            icon: 'schedule',
            component: './mall/product/property'
          },
          {
            name: '商品评论',
            path: '/mall/product/comment',
            icon: 'schedule',
            component: './mall/product/comment'
          }
        ]
      },
      {
        path: '/mall/trade',
        name: '订单中心',
        icon: 'shoppingCart',
        routes: [
          {
            name: '交易配置',
            path: '/mall/trade/config',
            icon: 'schedule',
            component: './mall/trade/config'
          },
          {
            name: '订单列表',
            path: '/mall/trade/order',
            icon: 'schedule',
            component: './mall/trade/order'
          },
          {
            name: '售后退款',
            path: '/mall/trade/aftersale',
            icon: 'schedule',
            component: './mall/trade/aftersale'
          },
          {
            name: '配送管理',
            path: '/mall/trade/delivery',
            icon: 'schedule',
            routes: [
              {
                name: '快递发货',
                path: '/mall/trade/delivery/express',
                icon: 'schedule',
                routes: [
                  {
                    name: '快递公司',
                    path: '/mall/trade/delivery/express/company',
                    icon: 'schedule',
                    component: './mall/trade/delivery/express/company'
                  },
                  {
                    name: '运费模板',
                    path: '/mall/trade/delivery/express/template',
                    icon: 'schedule',
                    component: './mall/trade/delivery/express/template'
                  }
                ]
              },
              {
                name: '门店自提',
                path: '/mall/trade/delivery/pickupstore',
                icon: 'schedule',
                routes: [
                  {
                    name: '门店管理',
                    path: '/mall/trade/delivery/pickupstore/list',
                    icon: 'schedule',
                    component: './mall/trade/delivery/pickupstore/list'
                  },
                  {
                    name: '核销订单',
                    path: '/mall/trade/delivery/pickupstore/order',
                    icon: 'schedule',
                    component: './mall/trade/delivery/pickupstore/order'
                  }
                ]
              }
            ]
          },
          {
            name: '分销管理',
            path: '/mall/trade/brokerage',
            icon: 'schedule',
            routes: [
              {
                name: '分销用户',
                path: '/mall/trade/brokerage/user',
                icon: 'schedule',
                component: './mall/trade/brokerage/user'
              },
              {
                name: '佣金记录',
                path: '/mall/trade/brokerage/record',
                icon: 'schedule',
                component: './mall/trade/brokerage/record'
              },
              {
                name: '佣金提现',
                path: '/mall/trade/brokerage/withdraw',
                icon: 'schedule',
                component: './mall/trade/brokerage/withdraw'
              }
            ]
          }
        ]
      },
      {
        path: '/mall/promotion',
        name: '营销中心',
        icon: 'shoppingCart',
        routes: [
          {
            name: '内容管理',
            path: '/mall/promotion/content',
            icon: 'schedule',
            routes: [
              {
                name: '文章列表',
                path: '/mall/promotion/content/article',
                icon: 'schedule',
                component: './mall/promotion/content/article'
              },
              {
                name: '文章分类',
                path: '/mall/promotion/content/article/category',
                icon: 'schedule',
                component: './mall/promotion/content/category'
              },
              {
                name: 'Banner',
                path: '/mall/promotion/content/banner',
                icon: 'schedule',
                component: './mall/promotion/content/banner'
              }
            ]
          },
          {
            name: '优惠券',
            path: '/mall/promotion/coupon',
            icon: 'schedule',
            routes: [
              {
                name: '优惠券列表',
                path: '/mall/promotion/coupon/list',
                icon: 'schedule',
                component: './mall/promotion/coupon/list'
              },
              {
                name: '领取记录',
                path: '/mall/promotion/coupon/record',
                icon: 'schedule',
                component: './mall/promotion/coupon/record'
              }
            ]
          },
          {
            name: '秒杀活动',
            path: '/mall/promotion/seckill',
            icon: 'schedule',
            routes: [
              {
                name: '秒杀模板',
                path: '/mall/promotion/seckill/config',
                icon: 'schedule',
                component: './mall/promotion/seckill/config'
              },
              {
                name: '秒杀商品',
                path: '/mall/promotion/seckill/activity',
                icon: 'schedule',
                component: './mall/promotion/seckill/activity'
              }
            ]
          },
          {
            name: '拼团活动',
            path: '/mall/promotion/combination',
            icon: 'schedule',
            routes: [
              {
                name: '拼团商品',
                path: '/mall/promotion/combination/acitivity',
                icon: 'schedule',
                component: './mall/promotion/combination/acitivity'
              },
              {
                name: '拼团记录',
                path: '/mall/promotion/combination/record',
                icon: 'schedule',
                component: './mall/promotion/combination/record'
              }
            ]
          },
          {
            name: '砍价活动',
            path: '/mall/promotion/bargain',
            icon: 'schedule',
            routes: [
              {
                name: '砍价商品',
                path: '/mall/promotion/bargain/acitivity',
                icon: 'schedule',
                component: './mall/promotion/bargain/activity'
              },
              {
                name: '砍价记录',
                path: '/mall/promotion/bargain/record',
                icon: 'schedule',
                component: './mall/promotion/bargain/record'
              }
            ]
          },
          {
            name: '商城装修',
            path: '/mall/promotion/diy',
            icon: 'schedule',
            routes: [
              {
                name: '装修模板',
                path: '/mall/promotion/diy/template',
                icon: 'schedule',
                component: './mall/promotion/diy/template'
              },
              {
                name: '装修页面',
                path: '/mall/promotion/diy/page',
                icon: 'schedule',
                component: './mall/promotion/diy/page'
              }
            ]
          },
          {
            name: '优惠活动',
            path: '/mall/promotion/discount',
            icon: 'schedule',
            routes: [
              {
                name: '限时折扣',
                path: '/mall/promotion/discount/activity',
                icon: 'schedule',
                component: './mall/promotion/discount/activity'
              },
              {
                name: '满减送',
                path: '/mall/promotion/discount/reward',
                icon: 'schedule',
                component: './mall/promotion/discount/reward'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/crm',
    name: 'CRM系统',
    icon: 'user',
    routes: [
      {
        path: '/crm/backlog',
        name: '待办事项',
        icon: 'schedule',
        component: './crm/backlog'
      },
      {
        path: '/crm/clue',
        name: '线索管理',
        icon: 'schedule',
        component: './crm/clue'
      },
      {
        path: '/crm/customer',
        name: '客户管理',
        icon: 'user',
        routes: [
          {
            path: '/crm/customer/list',
            name: '客户列表',
            icon: 'user',
            component: './crm/customer'
          },
          {
            path: '/crm/customer/pool',
            name: '客户公海',
            icon: 'user',
            component: './crm/customer/pool'
          }
        ]
      },
      {
        path: '/crm/contact',
        name: '联系人管理',
        icon: 'contacts',
        component: './crm/contact'
      },
      {
        path: '/crm/business',
        name: '商机管理',
        icon: 'shoppingCart',
        component: './crm/business'
      },
      {
        path: '/crm/contract',
        name: '合同管理',
        icon: 'shoppingCart',
        component: './crm/contract'
      },
      {
        path: '/crm/receivable',
        name: '回款管理',
        icon: 'shoppingCart',
        routes: [
          {
            path: '/crm/receivable/list',
            name: '回款列表',
            icon: 'user',
            component: './crm/receivable'
          },
          {
            path: '/crm/receivable/plan',
            name: '回款计划',
            icon: 'user',
            component: './crm/receivable/plan'
          }
        ]
      },
      {
        path: '/crm/product',
        name: '产品管理',
        icon: 'shoppingCart',
        component: './crm/product'
      },
      {
        path: '/crm/config',
        name: '系统配置',
        icon: 'shoppingCart',
        routes: [
          {
            path: '/crm/config/customer/pool',
            name: '客户公海配置',
            icon: 'user',
            component: './crm/config/customer/pool'
          },
          {
            path: '/crm/config/customer/limit',
            name: '客户限制配置',
            icon: 'user',
            component: './crm/config/customer/limit'
          },
          {
            path: '/crm/config/product/category',
            name: '产品分类配置',
            icon: 'user',
            component: './crm/config/product/category'
          },
          {
            path: '/crm/config/business/status',
            name: '商机状态配置',
            icon: 'user',
            component: './crm/config/business/status'
          },
          {
            path: '/crm/config/contract',
            name: '合同配置',
            icon: 'user',
            component: './crm/config/contract'
          }
        ]
      },
      {
        path: '/crm/statistics',
        name: '数据统计',
        icon: 'shoppingCart',
        routes: [
          {
            path: '/crm/statistics/customer',
            name: '客户分析',
            icon: 'user',
            component: './crm/statistics/customer'
          }
        ]
      }
    ]
  },
  {
    path: '/erp',
    name: 'ERP系统',
    icon: 'user',
    routes: [
      {
        path: '/erp/purchase',
        name: '采购管理',
        icon: 'shoppingCart',
        routes: [
          {
            path: '/erp/purchase/order',
            name: '采购订单',
            icon: 'schedule',
            component: './erp/purchase/order'
          },
          {
            path: '/erp/purchase/in',
            name: '采购入库',
            icon: 'schedule',
            component: './erp/purchase/in'
          },
          {
            path: '/erp/purchase/return',
            name: '采购退货',
            icon: 'schedule',
            component: './erp/purchase/return'
          },
          {
            path: '/erp/purchase/supplier',
            name: '供应商信息',
            icon: 'schedule',
            component: './erp/purchase/supplier'
          }
        ]
      },
      {
        path: '/erp/sale',
        name: '销售管理',
        icon: 'shoppingCart',
        routes: [
          {
            path: '/erp/sale/order',
            name: '销售订单',
            icon: 'schedule',
            component: './erp/sale/order'
          },
          {
            path: '/erp/sale/out',
            name: '销售出库',
            icon: 'schedule',
            component: './erp/sale/out'
          },
          {
            path: '/erp/sale/return',
            name: '销售退货',
            icon: 'schedule',
            component: './erp/sale/return'
          },
          {
            path: '/erp/sale/customer',
            name: '客户信息',
            icon: 'schedule',
            component: './erp/sale/customer'
          }
        ]
      },
      {
        path: '/erp/stock',
        name: '库存管理',
        icon: 'shoppingCart',
        routes: [
          {
            path: '/erp/stock/index',
            name: '产品库存',
            icon: 'schedule',
            component: './erp/stock/stock'
          },
          {
            path: '/erp/stock/warehouse',
            name: '仓库信息',
            icon: 'schedule',
            component: './erp/stock/warehouse'
          },
          {
            path: '/erp/stock/record',
            name: '出入库明细',
            icon: 'schedule',
            component: './erp/stock/record'
          },
          {
            path: '/erp/stock/in',
            name: '其他入库',
            icon: 'schedule',
            component: './erp/stock/in'
          },
          {
            path: '/erp/stock/out',
            name: '其他出库',
            icon: 'schedule',
            component: './erp/stock/out'
          },
          {
            path: '/erp/stock/move',
            name: '库存调拨',
            icon: 'schedule',
            component: './erp/stock/move'
          },
          {
            path: '/erp/stock/check',
            name: '库存盘点',
            icon: 'schedule',
            component: './erp/stock/check'
          }
        ]
      },
      {
        path: '/erp/product',
        name: '产品管理',
        icon: 'shoppingCart',
        routes: [
          {
            path: '/erp/product/index',
            name: '产品信息',
            icon: 'schedule',
            component: './erp/product/product'
          },
          {
            path: '/erp/product/category',
            name: '产品分类',
            icon: 'schedule',
            component: './erp/product/category'
          },
          {
            path: '/erp/product/unit',
            name: '产品单位',
            icon: 'schedule',
            component: './erp/product/unit'
          }
        ]
      },
      {
        path: '/erp/finance',
        name: '财务管理',
        icon: 'shoppingCart',
        routes: [
          {
            path: '/erp/finance/payment',
            name: '付款单',
            icon: 'schedule',
            component: './erp/finance/payment'
          },
          {
            path: '/erp/finance/receipt',
            name: '收款单',
            icon: 'schedule',
            component: './erp/finance/receipt'
          },
          {
            path: '/erp/finance/account',
            name: '结算账户',
            icon: 'schedule',
            component: './erp/finance/account'
          }
        ]
      }
    ]
  },
  {
    path: '/hrm',
    name: 'HRM系统',
    icon: 'team',
    routes: [
      {
        path: '/hrm/recruit',
        name: '招聘管理',
        icon: 'user',
        routes: [
          {
            path: '/hrm/recruit/candidate',
            name: '候选人管理',
            icon: 'user',
            component: './hrm/recruit/candidate'
          },
          {
            path: '/hrm/recruit/candidate/detail',
            name: '候选人详情',
            hideInMenu: true,
            component: './hrm/recruit/candidate/detail'
          },
          {
            path: '/hrm/recruit/post',
            name: '招聘职位',
            component: './hrm/recruit/post'
          },
          {
            path: '/hrm/recruit/post/detail',
            name: '职位详情',
            hideInMenu: true,
            component: './hrm/recruit/post/detail'
          },
          {
            path: '/hrm/recruit/channel',
            name: '招聘渠道',
            component: './hrm/recruit/channel'
          },
          {
            path: '/hrm/recruit/setting/eliminate',
            name: '淘汰原因设置',
            component: './hrm/recruit/setting/eliminate'
          }
        ]
      },
      {
        path: '/hrm/dept',
        name: '组织架构',
        icon: 'cluster',
        routes: [
          {
            path: '/hrm/dept',
            name: '架构总览',
            component: './hrm/dept'
          },
          {
            path: '/hrm/dept/detail',
            name: '部门详情',
            hideInMenu: true,
            component: './hrm/dept/detail'
          }
        ]
      },
      {
        path: '/hrm/employee',
        name: '员工管理',
        icon: 'solution',
        routes: [
          {
            path: '/hrm/employee',
            name: '员工花名册',
            component: './hrm/employee'
          },
          {
            path: '/hrm/employee/config',
            name: '员工字段设置',
            component: './hrm/employee/config'
          }
        ]
      },
      {
        path: '/hrm/attendance',
        name: '考勤管理',
        icon: 'schedule',
        routes: [
          {
            path: '/hrm/attendance/clock',
            name: '考勤打卡',
            component: './hrm/attendance/clock'
          },
          {
            path: '/hrm/attendance/leave',
            name: '请假记录',
            component: './hrm/attendance/leave'
          },
          {
            path: '/hrm/attendance/month',
            name: '月度考勤',
            component: './hrm/attendance/month'
          },
          {
            path: '/hrm/attendance/month/detail',
            name: '月度考勤详情',
            hideInMenu: true,
            component: './hrm/attendance/month/detail'
          }
        ]
      },
      {
        path: '/hrm/salary',
        name: '薪资管理',
        icon: 'pay-circle',
        routes: [
          {
            path: '/hrm/salary/month-record',
            name: '月度工资表',
            component: './hrm/salary/month-record'
          },
          {
            path: '/hrm/salary/month-record/history',
            name: '历史工资表',
            component: './hrm/salary/month-record/history'
          },
          {
            path: '/hrm/salary/month-record/detail',
            name: '工资表详情',
            hideInMenu: true,
            component: './hrm/salary/month-record/detail'
          },
          {
            path: '/hrm/salary/employee-info',
            name: '员工薪资档案',
            component: './hrm/salary/employee-info'
          },
          {
            path: '/hrm/salary/employee-info/detail',
            name: '薪资档案详情',
            hideInMenu: true,
            component: './hrm/salary/employee-info/detail'
          },
          {
            path: '/hrm/salary/slip/send-record',
            name: '工资条发放记录',
            component: './hrm/salary/slip/send-record'
          },
          {
            path: '/hrm/salary/slip/send-record/detail',
            name: '工资条发放详情',
            hideInMenu: true,
            component: './hrm/salary/slip/send-record/detail'
          },
          {
            path: '/hrm/salary/config/config',
            name: '薪资配置',
            component: './hrm/salary/config/config'
          },
          {
            path: '/hrm/salary/config/group',
            name: '薪资组',
            component: './hrm/salary/config/group'
          },
          {
            path: '/hrm/salary/config/option',
            name: '薪资项',
            component: './hrm/salary/config/option'
          },
          {
            path: '/hrm/salary/config/tax-rule',
            name: '计税规则',
            component: './hrm/salary/config/tax-rule'
          },
          {
            path: '/hrm/salary/config/change-template',
            name: '调薪模板',
            component: './hrm/salary/config/change-template'
          }
        ]
      },
      {
        path: '/hrm/portal',
        name: '员工工作台',
        icon: 'user',
        routes: [
          {
            path: '/hrm/portal/home',
            name: '个人工作台',
            component: './hrm/portal/home'
          },
          {
            path: '/hrm/portal/opening-guide',
            name: '员工端开通引导',
            hideInMenu: true,
            component: './hrm/portal/opening-guide'
          },
          {
            path: '/hrm/portal/employee',
            name: '我的档案',
            component: './hrm/portal/employee'
          },
          {
            path: '/hrm/portal/salary/slip',
            name: '我的工资条',
            component: './hrm/portal/salary/slip'
          },
          {
            path: '/hrm/portal/insurance/record',
            name: '我的社保',
            component: './hrm/portal/insurance/record'
          },
          {
            path: '/hrm/portal/attendance/report',
            name: '考勤报表',
            component: './hrm/portal/attendance/report'
          },
          {
            path: '/hrm/portal/performance/assessment',
            name: '我的绩效',
            component: './hrm/portal/performance/assessment'
          },
          {
            path: '/hrm/portal/performance/assessment/history',
            name: '绩效档案',
            component: './hrm/portal/performance/assessment/history'
          }
        ]
      }
    ]
  },
  {
    path: '/fms',
    name: '财务系统',
    icon: 'accountBook',
    routes: [
      {
        path: '/fms/home',
        name: '财务首页',
        icon: 'dashboard',
        component: './fms/home'
      },
      {
        path: '/fms/voucher',
        name: '凭证管理',
        icon: 'fileText',
        routes: [
          {
            path: '/fms/voucher/create',
            name: '新增凭证',
            icon: 'plusSquare',
            component: './fms/voucher/create'
          },
          {
            path: '/fms/voucher/list',
            name: '凭证列表',
            icon: 'unorderedList',
            component: './fms/voucher/list'
          },
          {
            path: '/fms/voucher/statistics',
            name: '凭证汇总',
            icon: 'barChart',
            component: './fms/voucher/statistics'
          }
        ]
      },
      {
        path: '/fms/closing',
        name: '期末结账',
        icon: 'carryOut',
        routes: [
          {
            path: '/fms/closing/period',
            name: '结转与结账',
            icon: 'schedule',
            component: './fms/closing'
          }
        ]
      },
      {
        path: '/fms/ledger',
        name: '账簿管理',
        icon: 'book',
        routes: [
          {
            path: '/fms/ledger/general',
            name: '总账',
            icon: 'table',
            component: './fms/ledger/general'
          },
          {
            path: '/fms/ledger/detail',
            name: '明细账',
            icon: 'profile',
            component: './fms/ledger/detail'
          },
          {
            path: '/fms/ledger/subject-balance',
            name: '科目余额表',
            icon: 'fund',
            component: './fms/ledger/subject-balance'
          },
          {
            path: '/fms/ledger/multi-column',
            name: '多栏账',
            icon: 'insertRowAbove',
            component: './fms/ledger/multi-column'
          },
          {
            path: '/fms/ledger/quantity-general',
            name: '数量金额总账',
            icon: 'calculator',
            component: './fms/ledger/quantity-general'
          },
          {
            path: '/fms/ledger/quantity-detail',
            name: '数量金额明细账',
            icon: 'orderedList',
            component: './fms/ledger/quantity-detail'
          },
          {
            path: '/fms/ledger/auxiliary-balance',
            name: '核算项目余额表',
            icon: 'cluster',
            component: './fms/ledger/auxiliary-balance'
          },
          {
            path: '/fms/ledger/auxiliary-detail',
            name: '核算项目明细账',
            icon: 'partition',
            component: './fms/ledger/auxiliary-detail'
          }
        ]
      },
      {
        path: '/fms/report',
        name: '财务报表',
        icon: 'areaChart',
        routes: [
          {
            path: '/fms/report/balance-sheet',
            name: '资产负债表',
            icon: 'fileDone',
            component: './fms/report/balance-sheet'
          },
          {
            path: '/fms/report/income-statement',
            name: '利润表',
            icon: 'lineChart',
            component: './fms/report/income-statement'
          },
          {
            path: '/fms/report/cash-flow-statement',
            name: '现金流量表',
            icon: 'transaction',
            component: './fms/report/cash-flow-statement'
          }
        ]
      },
      {
        path: '/fms/config',
        name: '财务设置',
        icon: 'setting',
        routes: [
          {
            path: '/fms/config/account-set',
            name: '账套管理',
            icon: 'database',
            component: './fms/config/account-set'
          },
          {
            path: '/fms/config/subject',
            name: '会计科目',
            icon: 'apartment',
            component: './fms/config/subject'
          },
          {
            path: '/fms/config/auxiliary',
            name: '辅助核算',
            icon: 'appstore',
            component: './fms/config/auxiliary'
          },
          {
            path: '/fms/config/initial-balance',
            name: '财务初始余额',
            icon: 'dollar',
            component: './fms/config/initial-balance'
          },
          {
            path: '/fms/config/currency',
            name: '币别设置',
            icon: 'payCircle',
            component: './fms/config/currency'
          },
          {
            path: '/fms/config/voucher-word',
            name: '凭证字设置',
            icon: 'fontColors',
            component: './fms/config/voucher-word'
          },
          {
            path: '/fms/config/digest',
            name: '常用摘要',
            icon: 'snippets',
            component: './fms/config/digest'
          },
          {
            path: '/fms/config/voucher-template',
            name: '凭证模板',
            icon: 'copy',
            component: './fms/config/voucher-template'
          },
          {
            path: '/fms/config/finance-parameter',
            name: '财务参数',
            icon: 'sliders',
            component: './fms/config/finance-parameter'
          },
          {
            path: '/fms/config/finance-indicator',
            name: '财务指标配置',
            icon: 'radarChart',
            component: './fms/config/finance-indicator'
          }
        ]
      }
    ]
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' }
]
