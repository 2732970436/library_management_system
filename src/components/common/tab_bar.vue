<template>
  <div  class="tab_bar">
  <div class="tab_bar_prefix" @click="$emit('tabClick', 'prefix')">
    <slot name="prefix">
      <el-image fit="contain" class="tab_bar_logo" :src="require('@/assets/img/logo.jpg')" />
  </slot> 
  </div>

  <div class = "tab_bar_title" @click="$emit('tabClick', 'title')">
      <slot name="title">
        <h4 style="margin: auto;">{{lang? '图书管理系统': 'library management system'}}</h4>
      </slot>
  </div>

  <div class="tab_bar_suffix" @click="$emit('tabClick', 'suffix')">
    <slot name="suffix"></slot>
  </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { store } from '@/store';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue'

const lang = computed(() => store.state.config.lang)

const emit = defineEmits();

const suffixClick = () => {

}

</script>

<style scoped>

.tab_bar {
  height: 62px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.tab_bar_logo {
  width: 62px;
  height: 62px;
  margin: auto;
}

.tab_bar_prefix {
  display: flex;
  width: 15%;
}



.tab_bar_title {
  display: flex;
  flex: 1;
}

.tab_bar_suffix {
  display: flex;
  width: 15%;
}
</style>