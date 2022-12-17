<template>
  <div class="index_warpper">
    <div class="index_left">
  <el-menu
    default-active="bookInfo"
  >
    <el-sub-menu index="book">
      <template #title>
        <el-icon><Collection /></el-icon>
        <span>书籍管理</span>
      </template>
    </el-sub-menu>
    <el-menu-item index="borrowInfo">
      <el-icon><Operation /></el-icon>
      <template #title>借阅管理</template>
    </el-menu-item>
    <el-menu-item index="setting">
      <el-icon><Setting /></el-icon>
      <template #title>系统设置</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><UserFilled /></el-icon>
      <template #title>个人资料</template>
    </el-menu-item>
  </el-menu>

</div>

<div class="index_right">
 <router-view></router-view>
</div>
</div>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import {
  Setting,
  Collection,
  Operation,
  UserFilled
} from '@element-plus/icons-vue'
import {useRoute, useRouter} from 'vue-router'

import {isAdmin} from "@/network/user"
import { store } from '@/store';

const route = useRoute();
const router = useRouter();


const addFlag = ref(false);
const infoFlag = ref(true);
const userFlag = ref(false);

// 改变页面状态
const change = (item:"bookAdd" | "bookInfo" | "userInfo") => {
    // store.commit("changeActive", item)
}



console.log(route.params.role);

(async function test() {
  console.log(await isAdmin("yzxyzx"))
})()





</script>

<style scoped>
  .index_warpper {  
    display: flex;
    width: 100vw;
    height: 100vh;
  }

  .index_left {
    flex: 1;
  }

  .index_right {
    flex:5
  }




</style>
