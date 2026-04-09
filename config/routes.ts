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
          }
        ]
      }
    ]
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' }
]
