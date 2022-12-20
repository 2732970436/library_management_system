<template>
  <div class="home">
    <Title>
      <template #title>
        {{lang? '图书管理系统': 'library management system'}}
      </template>
    </Title>
    <div class="login_warp">
      <Login @login="login"></Login>
    </div>
    <el-link @click="register()" class="register">{{lang? '注册': 'Sign up'}}</el-link>
  </div>
</template>

<script lang="ts" setup>
import Title from "@/components/common/tab_bar.vue"
import Login from "@/components/login.vue"
import {getLogin} from "@/network/user"
import { useRouter, useRoute } from 'vue-router'
import { ElLink, ElLoading } from "element-plus";
import { ms } from "@/tools/message";
import { computed } from "@vue/reactivity";
import { store } from "@/store";
const route = useRoute()
const router = useRouter()

const lang = computed(() => store.state.config.lang)

const login = (para:{account:String,password:String,type:"Student" | "Admin",checkCode:string}) => {
  const loading = ElLoading.service({
    lock: true,
    text: lang? '提交中': 'Submitting',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const results = getLogin(para)
  if (results) {
    results.then((res) => {
      const token = res.headers.token;
       let code:number = res.data.code;
       if (code != 200) {
         ms({
         message: res.data.message,
         type: 'error',
         showClose:true
       })  
       } else {
        ms({
         message: res.data.message,
         type: 'success',
         showClose:true
        })
        window.localStorage.setItem("token",token)
        router.replace(`index/${para.type.toLowerCase()}/bookInfo`);
        }
    }).finally(() => {
      loading.close();
    })
  }
}

  const register = () => {
    router.push("/register")
  }

</script>
<style scoped>
  .login_warp {
    margin-top:80px;
    width: 100vw;
    display: flex;
    justify-content: center;
  }
  .register {
    position:absolute;
    right: 20px;
    top: 60px;
    font-size: 16px;
  }
</style>
