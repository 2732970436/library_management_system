<template>
  <div class="home">
    <Title></Title>
    <div class="login_warp">
      <Login @login="login"></Login>
    </div>
    <el-link @click="register()" class="register">Sign up</el-link>
  </div>
</template>

<script lang="ts" setup>
import Title from "@/components/title.vue"
import Login from "@/components/login.vue"
import {getLogin} from "@/ntework/login"
import { useRouter, useRoute } from 'vue-router'
import { ElLoading, ElMessage } from "element-plus";
const route = useRoute()
const router = useRouter()


const login = (para:{account:String,password:String,type:"Student" | "Admin",checkCode:string}) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Submitting',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const results = getLogin(para)
  if (results) {
    results.then((res) => {
      console.log(res.headers)
       let code:number = res.data.err_code;
       if (code === 300) {
         ElMessage({
         message: res.data.message,
         type: 'error',
         showClose:true
       })    
       } else if (code === 200) {
        ElMessage({
         message: res.data.message,
         type: 'success',
         showClose:true
        })
        window.localStorage.setItem("token","")
        router.replace('/student');
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
