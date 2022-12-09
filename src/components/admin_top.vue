<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
  >
    <el-menu-item index="0"><el-image fit="contain"  class="logo" :src="require('@/assets/img/logo.jpg')" /></el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1" @click="Info()">BookInfo</el-menu-item>
    <el-menu-item index="2-1" @click="UserInfo()">UserInfo</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Operate</template>
      <el-menu-item index="2-1" @click="Add()">AddBook</el-menu-item>
      
      <el-sub-menu index="2-4">
        <template #title>Profile</template>
        <el-menu-item index="2-4-1" @click="loginOut">Login out</el-menu-item>
        <el-menu-item index="2-4-2" @click="Empty">Empty</el-menu-item>
        <el-menu-item index="2-4-3" @click="Empty">Empty</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>
a
<script lang="ts" setup>
import router from '@/router';
import { ElMessage } from 'element-plus';
import { ref } from 'vue'

const activeIndex = ref('1')

const emit = defineEmits(["change"])

const Add = () => {
  emit("change",'add')
}
const Info = () => {
  emit("change",'info')
}

const UserInfo = () => {
  emit("change","userInfo")
}

const loginOut = () => {
  window.localStorage.removeItem("token")
  router.push("/")
}

const Empty = () => {
  ElMessage({
    message: "Thank you for you click",
    type:"success",
    showClose:true
  })
}

</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
.logo {
  width: 59px;
  height: 59px;
}
</style>