import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Login/Login.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  
  {
    path:"/register",
    name:"Register",
    component: () => import("../views/Login/Register.vue")
  },

  {
    path:"/index",
    name:"Index",
    component: () => import("@/views/index/Index.vue"),
    children:[
      {
        path:"student",
        name:"Studednt",
        component: () => import("@/views/index/children/student/Student.vue")
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
