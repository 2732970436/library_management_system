<template>
<div>
  <Admin_top @change="change"></Admin_top>
  <Admin_body_info  v-show="infoFlag"></Admin_body_info>
  <Admin_body_add v-show="addFlag" @addbook="addbook"></Admin_body_add>
  <Admin_body_userInfo v-show="userFlag"></Admin_body_userInfo>
</div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Admin_top from "@/components/admin_top.vue";
import Admin_body_info from "@/components/admin_body_info.vue";
import Admin_body_add from "@/components/admin_body_add.vue"
import Admin_body_userInfo from "@/components/admin_body_userInfo.vue";
import { BookC } from "@/interface/Book";
import { store } from "@/store";

const addFlag = ref(false);
const infoFlag = ref(true);
const userFlag = ref(false);

const change = (item:"add" | "info" | "userInfo") => {
  if (item === "add") {
    addFlag.value = true;
    infoFlag.value = false;
    userFlag.value = false;
  } else if (item === "info") {
    infoFlag.value = true;
    addFlag.value = false;
    userFlag.value = false;
  } else if (item === "userInfo") {
    userFlag.value = true;
    infoFlag.value = false;
    addFlag.value = false;
  }
}
// 从服务器获取所有book信息
store.dispatch("getBooksFromNet")

const addbook = (newBook:BookC) => {
    
}

</script>
<style>
</style>
   