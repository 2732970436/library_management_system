import { checkAccountIsExist, isAdmin } from '@/network/profile'
import { store } from '@/store'
import { ms } from '@/tools/message'
import { ro } from 'element-plus/es/locale'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login/Login.vue")
  },

  {
    path:"/register",
    name:"register",
    component: () => import("../views/Login/Register.vue")
  },

  {
    path:"/index",
    name:"index",
    meta:{

    },
    component: () => import("@/views/index/Index.vue"),
    children:[
      {
        path:"employee",
        name:"employee",
        component: () => import("@/views/index/children/employee/employee.vue"),
        children:[
          {
            path: "salarys",
            name: "salarys",
            component: () => import("@/components/employee/audit/audit.vue")
          },
          {
            path: "salarysRecord",
            name: "salarysRecord",
            component: () => import("@/components/employee/salary/salary.vue")
          },
          {
            path:"audits",
            name: 'audits',
            component: () => import("@/components/employee/employee/employee.vue")
          },
          {
            path:'profiles',
            name: 'profiles',
            component: () => import('@/components/common/profile.vue')
          },
          {
            path:'settings',
            name: 'settings',
            component: () => import('@/components/common/setting.vue')
          }
        ]
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/index/children/admin/Admin.vue'),
        children:[
          {
            path: 'user',
            name: 'user',
            component: () => import('@/components/admin/user/admin_body_user_info.vue')
          },
          {
            path: 'salaryRecord',
            name: 'salaryRecord',
            component: () => import('@/components/admin/salaryRecord/salaryRecord.vue')
          },
          {
            path: 'dept',
            name: 'dept',
            component: () => import('@/components/admin/dept/dept.vue')
          },
          {
            path:'auditedRecord',
            name: 'auditedRecord',
            component: () => import('@/components/admin/auditedRecord/auditedRecord.vue')
          },
          {
            path:'profile',
            name: 'profile',
            component: () => import('@/components/common/profile.vue')
          },
          {
            path:'setting',
            name: 'setting',
            component: () => import('@/components/common/setting.vue')
          }
        ]
      },

    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const account = store.state.profile.user?.account
  const role = store.state.profile.user?.role;
  // 如果是去注册或登录页面则不进行拦截
  if (to.name == "register") next();
  else if (to.name == 'login') next();
  // 如果账户密码存在,进一步判断，否则跳转登录页面
  else if (account && (role || role === 0)) {
    // 如果用户前往admin区域
    if (to.fullPath.includes("admin") ) {
      if (await isAdmin(account) ) {
        next();
      } else {
        ms("您没有权限访问此页面", "you has not be permit", "e")
        next({name:'login'})
      }
    }
    //用户前往普通区域
    else if (await checkAccountIsExist(account, role) ) {
      next()
    } else {
      ms("您还未登录，请先登录后再试", "You are not logged in, please try again after log on first", "w");
      // 如果用户不满足上述条件则前往login
      next({name:'login'})
    }
  } else {
    ms("您还未登录，请先登录后再试", "You are not logged in, please try again after log on first", "w");
    next({name:"login"})
  }

})

export default router
