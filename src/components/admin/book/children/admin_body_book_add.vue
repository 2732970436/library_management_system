<template>
<div style="margin-top: 50px;">
  <div style="width: 50%; margin:auto;">
  <el-form :model="newBook" :rules="rules"  @validate="vaildate">
      <el-form-item label="Name" :label-width="'140px'" prop="book">
        <el-input v-model="newBook.bookName" autocomplete="off" maxlength="18" minlength="1" show-word-limit />
      </el-form-item>
      <el-form-item label="Store" :label-width="'140px'" prop="store">
        <el-input v-model.number="newBook.store" autocomplete="off" type="number" maxlength="3" />
      </el-form-item>

      <el-form-item label="remain" :label-width="'140px'" prop="remain">
        <el-input v-model.number="newBook.remain" autocomplete="off" type="number" maxlength="3" />
      </el-form-item>

      <el-form-item label="Author" :label-width="'140px'">
        <el-input v-model="newBook.author" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Price" :label-width="'140px'" prop="price">
        <el-input v-model.number="newBook.price" autocomplete="off"  type="number" />
      </el-form-item>
    </el-form>
    <el-button @click="submit" style="margin-top: 10px; width=100vw;">Submit</el-button>
</div>
</div>
</template>
<script lang="ts" setup>
import { BookC } from '@/interface/Book';
import { reactive, ref } from 'vue';
import { useStore } from '@/store/index';
import { ElMessage } from 'element-plus';
const store = useStore();


const newBook = reactive<BookC>(new BookC());

const priceFlag = ref(true);

const storeFlag = ref(true);

const remainFlag = ref(true);

const nameFlag = ref(true);

const updateButtonFlag = ref(true);

  const checkPrice = (rule: any, value: number, callback: any) => {
  if (value === null) {
    priceFlag.value = false
    return callback(new Error('Please input the price'))
  }  else {
      if (value < 0) {
        priceFlag.value = false
        callback(new Error('Age must be greater than 0'))
      } else if(value > 1000) {
         storeFlag.value = false;
         callback("the price must not getter than 1000")
    } else {
        priceFlag.value = true
        callback()
      }
    }
  }

const checkStore = (rule: any, value: any, callback: any) => {
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
  }  else {
    storeFlag.value = true
    callback()
  }
  callback()
  
}


const checkRemain = (rule: any, value: any, callback: any) => {
  const flag = remainFlag;
  if (value === null) {
    flag.value = false
    callback(new Error('Please input the remain'))
  } else if (!Number.isInteger(value)) {
    flag.value = false
    callback(new Error("Please Enter A Number"))
  }  else if (value < 0) {
    flag.value = false
    callback(new Error("Please Enter A Positive Number"))
  } else if(value > 100000) {
    flag.value = false;
    callback("the store must not getter than 100000")
  }  else {
    flag.value = true
    callback()
  }
  callback()
}

const checkName = (rule:any, value:string, callback:Function) => {
  console.log(store.state.book.books)
  console.log(value)
   const overlap = store.state.book.books.find((item) => item.bookName === value)
   if (overlap) {
      nameFlag.value = false;
      callback(new Error("The name must not be same as current"))
   } else {
      nameFlag.value = true;
      callback()
   }
}
// 规则
const rules = reactive({
  store: [{ validator: checkStore, trigger: 'blur' }],
  price: [{ validator: checkPrice, trigger: 'blur' }],
  book:[{validator:checkName,trigger:"blur"}]
})



// 全局注册事件确定提交可不可以
const vaildate: any = (prop:string,isVaild:boolean) => {
  if (priceFlag.value && storeFlag.value && nameFlag.value) {
    updateButtonFlag.value = true
  } else [
    updateButtonFlag.value = false
  ]
}


const submit = () => {
  store.commit("addBook",newBook)
  store.commit("updateFlag",true)
  ElMessage({
    message:"Add book success",
    type:"success",
    showClose:true
  })
}

</script>
<style>
</style>
   