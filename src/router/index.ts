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
        component: () => import("../views/Student.vue")
      },
      {
        path: 'admin',
        name: 'Admin',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/index/children/Admin.vue')
      },

    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
