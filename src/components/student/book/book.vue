<template>
    <Tab_bar>
      <template #title>
        <h4 style="margin: auto;">{{ lang ? '书籍信息' : 'bookInfo' }}</h4>
      </template>
    </Tab_bar>
  
    <div class="book_info_wrapper">
      <el-table :data="filterTableData" style="width:100%; height: 100%; display: flex">
        <el-table-column type="selection" style="flex: 1;" />
        <el-table-column prop="bookName" :label="lang ? '书名' : 'bookName'" style="flex:1" />
        <el-table-column prop="author" :label="lang ? '作者' : 'Author'" style="flex:1" />
        <el-table-column prop="price" :label="lang ? '价格' : 'Price'" style="flex:1" />
        <el-table-column prop="store" :label="lang ? '库存量' : 'Store'" style="flex:1" />
        <el-table-column prop="remain" :label="lang ? '可借数' : 'Remain'" style="flex:1" />
        <el-table-column style="flex: 1;">
          <template #header>
            <el-input v-model="search" size="small" :placeholder="lang ? '按名字搜索' : 'search by name'" />
          </template>
          <template #default="scope">
            <div style="display:flex; justify-content: space-between;">
              <el-button size="small" style="width:70%"
                @click="borrow(scope.$index, scope.row)">{{lang? '借阅此书': 'borrow'}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next, size, jumper" v-model:current-page="currentPage"
        :total="store.state.book.bookCounts"
        style="justify-content: end; margin-top: 20px;" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import Tab_bar from "@/components/common/tab_bar.vue";
  
  import { ref, computed, reactive, watch, onMounted, watchEffect, nextTick } from 'vue';
  import { Book} from "@/interface/Book";
  import { useStore } from '@/store';
  import {borrowBook} from "@/network/borrow"
  import { ld, mb, ms} from '@/tools/message';

  
  
  
  //---------------初始化变量----------------------//
  const store = useStore();
  const lang = computed(() => store.state.config.lang)
  
  
  // 搜索变量
  const search = ref('')
  
  //初始化
  let books = store.state.book.books
  
  const currentPage = ref<number>(store.state.book.currentPage)
  
  //-----------------初始化变量结束------------------------//
  watchEffect(() => {
    nextTick(() => {
      if (document.querySelector(".book_info_wrapper .el-pagination__goto")) {
        document.querySelector(".book_info_wrapper .el-pagination__goto")!.innerHTML = lang.value? '跳转至': 'goto';
      }
    })  
    })

//监听页面改变并且初始立即触发
watch(currentPage, () => {
    store.dispatch("getBooksFromNet",currentPage.value)
  },{immediate:true})
  
  
  //-----------------回调事件开始--------------------------//
  // 搜索数据行，筛选搜索框
  const filterTableData = computed(() =>
    books.filter(
      (data) =>
        !search.value ||
        data.bookName.toLowerCase().includes(search.value.toLowerCase())
    )
  )
  
  const borrow = (index: number, info: Book) => {
    const loading = ld("借书请求提交中", "Borrow request submission")
    
    borrowBook(info).then((res) => {
        const data = res.data;
      if (data.code === 200) {
        store.commit("borrow", info);
        ms(data.message, data.messageE, "s");
      } else if (data.code === 550) {
        // 550 为已经超期，需先缴纳罚金
        ms(data.message, data.messageE, "w");
      } else {
        ms(data.message, data.messageE, "e")
      }
    }).finally(() => {
        loading.close()
    })
}
//----------------回调事件结束---------------------//

  
  </script>
  
  <style scoped>
  .book_info_wrapper {
    /* display: flex; */
    height: 70%;
  }
  </style>