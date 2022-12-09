<template>
  <div>
  <el-table :data="filterTableData" height="500" style="width:100vw" >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="bookname" label="Name" style="width:20vw"/>
    <el-table-column prop="store" label="Store" style="width:20vw"/>
    <el-table-column prop="author" label="Author" style="width:20vw"/>
    <el-table-column prop="price" label="Price" style="width:20vw"/>
    <el-table-column>
      <template #header>
        <el-input v-model="search" size="small" placeholder="search by name" />
      </template>
      <template #default="scope">
        <el-button text @click="bookEdit(scope.$index,scope.row)"
    >borrow</el-button
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
</div>
</template>

<script lang="ts" setup>

import { ElMessage } from 'element-plus';
import { ref,computed,reactive } from 'vue';
import {Book,BookC} from "@/interface/Book"
import { useStore } from '@/store';
const store = useStore();
// 搜索变量
const search = ref('')
// 放置修改的临时数据
const tempBook = ref<BookC>(
  new BookC(0,"",0,"",0,0,false,"")
);

let a:string = "";
a = 10;

let dialogFormVisible = ref(false);

const priceFlag = ref(true);

const storeFlag = ref(true);

const updateButtonFlag = ref(true)

let books = store.state.books

// 搜索数据行
const filterTableData = computed(() =>
  books.filter(
    (data) =>
      !search.value ||
      data.bookname.toLowerCase().includes(search.value.toLowerCase())
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
      ElMessage({
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