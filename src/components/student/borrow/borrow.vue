<template>
    <Tab_bar>
      <template #title>
        <h4 style="margin: auto;">{{ lang ? '借阅信息' : 'borrowInfo' }}</h4>
      </template>
    </Tab_bar>
  
    <div class="borrow_info_wrapper">
      <el-table :data="borrows" style="width:100%; height: 100%;  display: flex" :row-class-name='tableRowClassName'>
        <el-table-column type="selection" style="flex: 1;" />
        <el-table-column prop="bookName"  :label="lang ? '书名' : 'borrowName'" style="flex:1" />
        <el-table-column prop="remainDaysLocal" :label="lang ? '剩余天数' : 'remainDays'" style="flex:1" />
        <el-table-column prop="approvalStatusLocal" :label="lang ? '审批状态' : 'approval_status'" style="flex:1" />
        <el-table-column style="flex: 1;">
          <template #header>
            <el-input v-model="search" size="small" :placeholder="lang ? '按名字搜索' : 'search by name'" />
          </template>
          <template #default="scope">
            <div style="display:flex; justify-content: space-between;">
              <el-button size="small" style="width:70%"
                @click="returnBookLocal(scope.$index, scope.row)">{{lang? '还书': 'return'}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script lang="ts" setup>
  import Tab_bar from "@/components/common/tab_bar.vue";
  
  import { ref, computed, reactive, watch, onMounted, watchEffect, nextTick } from 'vue';
  import { useStore } from '@/store';
  import {getBorrowRecords, returnBookNet} from "@/network/borrow"
  import { ld, mb, ms} from '@/tools/message';
import { borrowRecord } from "@/interface/borrowRecord";

  
  
  
  //---------------初始化变量----------------------//
  const store = useStore();
  const lang = computed(() => store.state.config.lang)  
  // 搜索变量
  const search = ref('')
  let borrows = ref<Array<borrowRecord>>([]);
  
  const init_data = () => {
    getBorrowRecords().then((res) => {
     const data = res.data;
     data.data.forEach((item) => {
      item.remainDaysLocal =parseInt((item.borrowDays - ((new Date() as any) - (new Date(item.startTime) as unknown as any))/1000/60/24/24).toFixed(0))
      switch (item.approvalStatus) {
        case 0 : item.approvalStatusLocal = "待审批"; break;
        case 1 : item.approvalStatusLocal = "审批通过"; break;
        case 2 : item.approvalStatusLocal = "未被批准"; break;
        default: item.approvalStatusLocal = "待审批"; break;
      } 
    })
     borrows.value = data.data;    
  })
  }

  init_data();
  
  //-----------------初始化变量结束------------------------//
  watchEffect(() => {
    nextTick(() => {
      if (document.querySelector(".borrow_info_wrapper .el-pagination__goto")) {
        document.querySelector(".borrow_info_wrapper .el-pagination__goto")!.innerHTML = lang.value? '跳转至': 'goto';
      }
    })  
    })

  
  
  //-----------------回调事件开始--------------------------//
 const returnBookLocal = (index:number, info:borrowRecord) => {
    const loading = ld("还书请求提交中", "Borrow request submission")
    
    returnBookNet(info.id).then((res) => {
      const data = res.data;
      const {code, message, messageE} = data;
      if (code === 200) {
        borrows.value.splice(index, 1)
        ms(message, messageE, "s");
      } else if (code === 550) {
        ms(message, messageE, "e");
        ms("跳转到缴纳罚金页面，我没写", "Jump to pay the fine page", "i");
      } else  {
        ms(message, messageE, "w");
      }
    }).finally(() => {
        loading.close()
    })
 }

 // 表格高亮
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: borrowRecord,
  rowIndex: number
}) => {
  if (row.remainDays >= 10) {
    return ''
  } else if (row.remainDays <= 10 && row.remainDays >= 0) {
    return 'w'
  } else if (row.remainDays < 0) {
    return "e"
  }
  return ''
}

//----------------回调事件结束---------------------//

  
  </script>
  
  <style scoped>
  .borrow_info_wrapper {
    /* display: flex; */
    height: 70%;
  }
  </style>