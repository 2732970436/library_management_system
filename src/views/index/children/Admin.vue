<template>
<div>
  <Tab_bar>
    <template #title>
      <h4>书籍信息</h4>
    </template>
  </Tab_bar>
  <Admin_body_info></Admin_body_info>
  
</div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";

import Tab_bar from "@/components/common/tab_bar.vue";
import Admin_body_info from "@/components/admin/book/admin_body_book_info.vue";
import Admin_body_userInfo from "@/components/admin/user/admin_body_user_Info.vue";
import { BookC } from "@/interface/Book";
import { store } from "@/store";


// 从服务器获取所有book信息
/**
 * page 查询的页数
 */
store.dispatch("getBooksFromNet", store.state.book.page)


const addbook = (newBook:BookC) => {
    
}

</script>
<style>
</style>
   