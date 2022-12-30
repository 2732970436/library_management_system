<template>
  <Tab_bar>
    <template #title>
      <h4 style="margin: auto;">{{ lang ? '借阅管理' : 'borrowInfo' }}</h4>
    </template>
  </Tab_bar>

  <div class="query_wapper" style="display:flex; justify-content: space-around;">
    <div>
      {{ l("用户名", "userName") }}
      <el-select v-model="query.user" filterable remote reserve-keyword :placeholder="l('按用户名搜索', 'search by userName')"
        :remote-method="getUsersByAccountLocal" :loading="loading">
        <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div>
      {{ l("书本名", "bookName") }}
      <el-select v-model="query.book" filterable remote reserve-keyword :placeholder="l('按书本名搜索', 'search by bookName')"
        :remote-method="getbooksByAccountLocal" :loading="loading">
        <el-option v-for="item in bookOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>

  <div class="borrow_info_wrapper">
    <el-table :data="borrows" style="width:100%; height: 100%; display: flex">
      <el-table-column type="selection" style="flex: 1;" />
      <el-table-column prop="bookName" :label="lang ? '书名' : 'borrowName'" style="flex:1" />
      <el-table-column prop="userName" :label="lang ? '借阅者' : 'borrowUser'" style="flex:1" />
      <el-table-column prop="startTimeLocal" :label="lang ? '发起时间' : 'startTime'" style="flex:1" />
      <el-table-column prop="borrowDays" :label="lang ? '借阅天数' : 'borrowDays'" style="flex:1" />
      <el-table-column style="flex: 1;" :label="lang ? '审批' : 'approval'">
        <template #default="scope">
          <div style="display:flex; justify-content: space-between;">
            <el-button size="small" style="width:40%" @click="approval(scope.$index, scope.row)">{{ l("批准", "approval")
}}</el-button>
            <el-button type="danger" size="small" style="width: 40%;" @click="reject(scope.$index, scope.row)">{{
    l("拒绝", "reject")
}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, size, jumper" v-model:current-page="currentPage"
      :total="total"
      style="justify-content: end; margin-top: 20px;" />
  </div>
</template>
  
<script lang="ts" setup>

import Tab_bar from "@/components/common/tab_bar.vue";


import { Delete, Edit } from "@element-plus/icons-vue"
import { ref, computed, reactive, watch, watchEffect, nextTick } from 'vue';
import { useStore } from '@/store';

import { getUsersByAccount } from '@/network/user';
import { l } from '@/tools/lang';
import { User } from '@/interface/User';
import { getBooksByBookName } from "@/network/book";


import { borrowRecord, Query } from '@/interface/borrowRecord';
import { Book } from "@/interface/Book";
import { getBorrowRecordsByCondition, putRecordsToNet } from "@/network/borrow";
import { ld, ms } from "@/tools/message";
import { formatDate } from "@/tools/date";



//---------------初始化变量----------------------//
const store = useStore();
const lang = computed(() => store.state.config.lang)


//初始化
let borrows = reactive<Array<borrowRecord>>([]);

const total = ref(0);

const query = reactive<Query>({})

const userOptions = ref<Array<{
  value: number
  label: string
}>>([]);


const bookOptions = ref<Array<{
  value: number
  label: string
}>>([]);



const loading = ref(false);

const currentPage = ref<number>(1)

//-----------------初始化变量结束------------------------//
watchEffect(async () => {
  nextTick(() => {
    if (document.querySelector(".borrow_info_wrapper .el-pagination__goto")) {
      document.querySelector(".borrow_info_wrapper .el-pagination__goto")!.innerHTML = lang.value ? '跳转至' : 'goto';
    }
  })
})

watch(query, () => {
  getBorrowFromNet(query, currentPage.value, 10);
},
{ deep: true})
//-----------------回调事件开始--------------------------//

const getBorrowFromNet = (query:Query, page:number, size:number = 10 ) => {
  const loading = ld("加载借阅数据中", "Loading library data");
  getBorrowRecordsByCondition(query,page,size).then((res) => {
    const data = res.data;
     data.data.records.forEach((item:borrowRecord) => {
      item.remainDaysLocal =parseInt((item.borrowDays - ((new Date() as any) - (new Date(item.startTime) as unknown as any))/1000/60/24/24).toFixed(0))
      switch (item.approvalStatus) {
        case 0 : item.approvalStatusLocal = "待审批"; break;
        case 1 : item.approvalStatusLocal = "审批通过"; break;
        case 2 : item.approvalStatusLocal = "未被批准"; break;
        default: item.approvalStatusLocal = "待审批"; break;
      }
      item.startTimeLocal = formatDate(item.startTime);
    }) 
    borrows.splice(0, borrows.length, ...res.data.data.records)
    total.value = res.data.data.total
  }).finally(() => {
    loading.close();
  })
}

//监听页面改变并且初始立即触发
watch(currentPage, () => {
  getBorrowFromNet(query, currentPage.value, 10);
}, { immediate: true })



const getUsersByAccountLocal = (query: string) => {
  if (query) {
    loading.value = true;
    getUsersByAccount(query).then((res) => {
      loading.value = false;
      userOptions.value.length = 0;
      res.data.data.forEach((item: User) => {
        userOptions.value.push({ value: item.id, label: item.account })
      });
    })
  }
}

const getbooksByAccountLocal = (query: string) => {
  if (query) {
    loading.value = true;
    getBooksByBookName(query).then((res) => {
      loading.value = false;
      bookOptions.value.length = 0;
      res.data.data.forEach((item: Book) => {
        bookOptions.value.push({ value: item.id, label: item.bookName })
      });
    })
  }
}





const reject = (index: number, borrowInfo: borrowRecord) => {
  borrowInfo.approvalStatus = 2;
  const loading = ld("提交申请中", "submit",true);
  putRecordsToNet(borrowInfo).then((res) => {
     const {code, message, messageE, data} = res.data;
     if (code === 200) {
      ms(message, messageE, "s");
     } else {
      ms(message, messageE, "e");
     }
  }).finally(() => {
    loading.close()
  })
}

const approval = (index: number, borrowInfo: borrowRecord) => {
  borrowInfo.approvalStatus = 1;
  const loading = ld("提交申请中", "submit",true);
  putRecordsToNet(borrowInfo).then((res) => {
     const {code, message, messageE, data} = res.data;
     if (code === 200) {
      ms(message, messageE, "s");
     } else {
      ms(message, messageE, "e");
     }
  }).finally(() => {
    loading.close()
  })
  
}



  //----------------回调事件结束---------------------//



</script>
  
<style scoped>
.borrow_info_wrapper {
  /* display: flex; */
  height: 70%;
}
</style>