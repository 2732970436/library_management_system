<template>
    <el-form>
 <el-switch
    v-model="language"
    active-text="中文"
    inactive-text="English"
  />
</el-form>
</template>

<script lang="ts" setup>
import { store } from '@/store';
import { ref, watch } from 'vue';

  const language = ref(window.localStorage.getItem("lang") ? !!(parseInt(window.localStorage.getItem("lang")!)  - 0): true);

  watch(language, () => {
    store.commit("changeLang",language.value ? 1: 0)
  })

</script>

<style>
</style>