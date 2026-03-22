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
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' }
]
