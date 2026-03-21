export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './user/login' }]
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { path: '/system/user', name: '用户管理', icon: 'user', component: './system/user' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' }
]
