import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login/Login.vue")
  },
  
  {
    path:"/register",
    name:"Register",
    component: () => import("../views/Login/Register.vue")
  },

  {
    path:"/index",
    name:"Index",
    meta:{
      
    },
    component: () => import("@/views/index/Index.vue"),
    children:[
      {
        path:"student",
        name:"student",
        component: () => import("@/views/index/children/student/Student.vue"),
        children:[
          {
            path: "books",
            name: "books",
            component: () => import("@/components/student/book/book.vue")
          },
          {
            path:"borrows",
            name: 'borrows',
            component: () => import("@/components/student/borrow/borrow.vue")
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
            path: 'book',
            name: 'book',
            component: () => import('@/components/admin/book/admin_body_book_info.vue')
          },
          {
            path: 'user',
            name: 'user',
            component: () => import('@/components/admin/user/admin_body_user_info.vue')
          },
          {
            path:'borrowedRecord',
            name: 'borrow',
            component: () => import('@/components/admin/borrowedRecord/borrowedRecord.vue')
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

export default router
