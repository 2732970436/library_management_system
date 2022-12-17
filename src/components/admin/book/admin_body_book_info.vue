<template>
  <div class="book_info_wrapper" v-show="!bookAddFlag">
  <el-table :data="filterTableData" style="width:100%; height: 100%; display: flex" >
    <el-table-column type="selection" style="flex: 1;"/>
    <el-table-column prop="bookName" label="Name" style="flex:1"/>
    <el-table-column prop="author" label="Author" style="flex:1"/>
    <el-table-column prop="price" label="Price" style="flex:1"/>
    <el-table-column prop="store" label="Store" style="flex:1"/>
    <el-table-column prop="remain" label="Remain" style="flex:1"/>
    <el-table-column>
      <template #header>
        <el-input v-model="search" size="small" placeholder="search by name" />
      </template>
      <template #default="scope">
        <el-button text @click="bookEdit(scope.$index,scope.row)"
    >Edit</el-button
  >
        <el-button
          size="small"
          type="danger"
          @click="bookDelete(scope.$index, scope.row)"
          >Delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="UpdateInfo">
    <el-form :model="tempBook" :rules="rules"  @validate="vaildate">
      <el-form-item label="Name" :label-width="'140px'">
        <el-input v-model="tempBook.bookName" autocomplete="off" maxlength="18" :show-word-limit="true" />
      </el-form-item>
      <el-form-item label="Store" :label-width="'140px'" prop="store">
        <el-input v-model.number="tempBook.store" autocomplete="off" type="number"/>
      </el-form-item>
      <el-form-item label="Author" :label-width="'140px'">
        <el-input v-model="tempBook.author" autocomplete="off"  maxlength="18" :show-word-limit="true" />
      </el-form-item>
      <el-form-item label="Price" :label-width="'140px'" prop="price">
        <el-input v-model.number="tempBook.price" autocomplete="off"  type="number" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="EditCancel()">Cancel</el-button>
        <el-button  :disabled="!updateButtonFlag" type="primary" @click="EditConfirm()"
          >Confirm</el-button>
      </span>
    </template>
  </el-dialog>
  <el-button type="primary" style="width: 30vw;" :disabled="!store.state.book.isUpdate" @click="submitUpdate()">submit</el-button>
  <el-pagination background layout="prev, pager, next, size" :total="100" style="justify-content: end; margin-top: 20px;"/>
  <admin_body_book_add v-if="bookAddFlag"></admin_body_book_add>
</div>
</template>

<script lang="ts" setup>
import admin_body_book_add from './children/admin_body_book_add.vue';

import { ElMessage } from 'element-plus';
import { ref,computed,reactive } from 'vue';
import {Book,BookC} from "@/interface/Book";
import { useStore } from '@/store';
import { ms } from '@/tools/message';

// 定义是否让添加组件显示的flag,false为不显示，true为显示
const bookAddFlag = ref(false);

const store = useStore();
// 搜索变量
const search = ref('')
// 放置修改的临时数据
const tempBook = ref<BookC>(
  new BookC()
);

tempBook.value.isAdd = false;

let dialogFormVisible = ref(false);

const priceFlag = ref(true);

const storeFlag = ref(true);

const updateButtonFlag = ref(true)

let books = store.state.book.books

// 搜索数据行，筛选搜索框
const filterTableData = computed(() =>
  books.filter(
    (data) =>
      !search.value ||
      data.bookName.toLowerCase().includes(search.value.toLowerCase())
  )
)

  const bookEdit = (index:number,info:Book) => {
    let i = books.findIndex((item) => {
      return info === item;
    })
    tempBook.value = JSON.parse(JSON.stringify(info));
    tempBook.value.isUpdate = true;
    tempBook.value.index = i;
    if (info.isAdd) {
      ms({
        message:"you must submit your All modify before you do this",
        type:"error",
        showClose:true
      })
    } else {
    dialogFormVisible.value = true
    }
  }

  const EditCancel = () => {
    dialogFormVisible.value = false;
    ElMessage({
    message: 'operate cancel',
    type: 'info',
    showClose:true
  })
  }

  const EditConfirm = ()=> {
    dialogFormVisible.value = false;
    store.commit("updateFlag",true)
    store.commit("modifyBook",{index:tempBook.value.index,newBook:tempBook.value})
    ElMessage({
    message: 'Update Success',
    type: 'success',
    showClose:true
  })
  }

  const checkPrice = (rule: any, value: number, callback: any) => {
  if (value === null) {
    priceFlag.value = false
    return callback(new Error('Please input the price'))
  }  else if (value < 0) {
        priceFlag.value = false
        callback(new Error('Price must be greater than 0'))
      } else if (value > 1000) {
        priceFlag.value = false;
        callback(new Error("Price must not getter than 1000"))
      }
      else {
        priceFlag.value = true
        callback()
      }
    }

const checkStore = (rule: any, value: number, callback: any) => {
  if (value === null) {
    storeFlag.value = false
    callback(new Error('Please input the Store'))
  } else if (!Number.isInteger(value)) {
    storeFlag.value = false
    callback(new Error("Please Enter A Number"))
  }  else if (value <0) {
    storeFlag.value = false
       callback(new Error("Please Enter A Positive Number"))
  } else if(value > 100000) {
    storeFlag.value = false;
    callback("the store must not getter than 100000")
  }
  else  {
    storeFlag.value = true
    callback()
  }
}
// 规则
const rules = reactive({
  store: [{ validator: checkStore, trigger: 'blur' }],
  price: [{ validator: checkPrice, trigger: 'blur' }],
})



// 全局注册事件确定提交可不可以
const vaildate = (prop:string,isVaild:boolean) => {
  if (priceFlag.value && storeFlag.value) {
    updateButtonFlag.value = true
  } else [
    updateButtonFlag.value = false
  ]
}


// 处理删除操作
const bookDelete = (index:number,row:BookC) => {
   if (row.isAdd) {
      ElMessage({
        message:"you must submit your All modify before you do this",
        type:"error",
        showClose:true
      })
   } else {
    let i = books.findIndex((item) => item === row)
    store.commit("deleteBook",i)
    store.commit("updateFlag",true)
   }
   
}

const submitUpdate = () => {
 store.dispatch("updateBooks")
}
</script>

<style scoped>
.book_info_wrapper {
  /* display: flex; */
  height: 70%;
}
</style>