<template>
  <div class="index_warpper">
    <div class="index_left">
  <el-menu
    :default-active="defaultActive"
    :router="true"
  >
    <el-menu-item index="book">
      <template #title>
        <el-icon><Collection /></el-icon>
        <span>{{lang? '书籍管理' : 'BOOK'}}</span>
      </template>
    </el-menu-item>
    <el-menu-item index="user">
      <template #title>
        <el-icon><User /></el-icon>
        <span>{{lang? '用户管理' : 'USER'}}</span>
      </template>
    </el-menu-item>
    <el-menu-item index="BorrowedRecord">
      <el-icon><Operation /></el-icon>
      <template #title>{{lang? '借阅管理': 'BORROW'}}</template>
    </el-menu-item>
    <el-menu-item index="setting">
      <el-icon><Setting /></el-icon>
      <template #title>{{lang? '系统设置': 'SETTING'}}</template>
    </el-menu-item>
    <el-menu-item index="profile">
      <el-icon><UserFilled /></el-icon>
      <template #title>{{lang? '个人资料': 'PROFILE'}}</template>
    </el-menu-item>
  </el-menu>



</div>

<div class="index_right">
 <router-view></router-view>
</div>
</div>
</template>

<script lang="ts" setup>

import { computed, ref } from 'vue'
import {
  Setting,
  Collection,
  Operation,
  UserFilled,
  User
} from '@element-plus/icons-vue'
import {useRoute, useRouter} from 'vue-router'

import {isAdmin} from "@/network/profile"
import { store } from '@/store';

const route = useRoute();
const router = useRouter();



const lang = computed(() => store.state.config.lang)

const defaultActive = route.name



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
