export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './user/login' }]
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { path: '/system/user', name: '用户管理', icon: 'user', component: './system/user' },
  { path: '/system/role', name: '角色管理', icon: 'team', component: './system/role' },
  { path: '/system/dept', name: '部门管理', icon: 'apartment', component: './system/dept' },
  { path: '/system/menu', name: '菜单管理', icon: 'menu', component: './system/menu' },
  { path: '/system/post', name: '岗位管理', icon: 'solution', component: './system/post' },
  { path: '/system/dict', name: '字典管理', icon: 'book', component: './system/dict' },
  { path: '/system/dict/data/:dictType', name: '字典数据', component: './system/dict/data', hideInMenu: true },
  { path: '/system/messages/sms/channel', name: '短信渠道', icon: 'message', component: './system/sms/channel' },
  { path: '/system/messages/sms/sms-template', name: '短信模板', icon: 'mail', component: './system/sms/template' },
  { path: '/system/messages/sms/sms-log', name: '短信日志', icon: 'profile', component: './system/sms/log' },
  { path: '/system/messages/mail/mail-account', name: '邮箱账号', icon: 'mail', component: './system/mail/account' },
  { path: '/system/messages/mail/mail-template', name: '邮件模板', icon: 'profile', component: './system/mail/template' },
  { path: '/system/messages/mail/mail-log', name: '邮件日志', icon: 'profile', component: './system/mail/log' },
  { path: '/system/messages/notify/notify-template', name: '模板管理', icon: 'profile', component: './system/notify/template' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' }
]
