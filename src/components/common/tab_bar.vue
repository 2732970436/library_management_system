<template>
  <el-menu  class="tab_bar" mode="horizontal" :ellipsis="false">
    <el-menu-item>
      <el-image fit="contain" class="tab_bar_logo" :src="require('@/assets/img/logo.jpg')" />
    </el-menu-item>
    <div class = "tab_bar_title">
      <slot name="title"></slot>
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
import router from '@/router';
import { ElMessage } from 'element-plus';
import { ref } from 'vue'


</script>

<style scoped>

.tab_bar_logo {
  width: 59px;
  height: 59px;
}

.tab_bar {
  height: 62px;
  display: flex;
}

.tab_bar_title {
   margin: auto;
}
</style>