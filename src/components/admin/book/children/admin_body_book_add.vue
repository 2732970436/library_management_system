<template>
<div style="margin-top: 50px;">
  <div style="width: 50%; margin:auto;">
  <el-form :model="newBook" :rules="rules" ref="formInstance">
      <el-form-item :label=" lang? '书名': 'bookName'" :label-width="'140px'" prop="book">
        <el-input v-model="newBook.bookName" autocomplete="off" style="min-width: 140px;" maxlength="18" minlength="1" show-word-limit />
      </el-form-item>
      <el-form-item :label="lang? '库存量' : 'Store'" :label-width="'140px'" prop="store">
        <el-input v-model.number="newBook.store" autocomplete="off" type="number" style="min-width: 140px;" maxlength="3" />
      </el-form-item>

      <el-form-item :label="lang? '可借数': 'remain'" :label-width="'140px'" prop="remain">
        <el-input v-model.number="newBook.remain" autocomplete="off" style="min-width: 140px;" type="number" maxlength="3" />
      </el-form-item>

      <el-form-item :label="lang? '作者': 'Author'" :label-width="'140px'">
        <el-input v-model="newBook.author" autocomplete="off" style="min-width: 140px;" />
      </el-form-item>
      <el-form-item :label="lang? '价格': 'Price'" :label-width="'140px'" prop="price">
        <el-input v-model.number="newBook.price" autocomplete="off"  style="min-width: 140px;" type="number" />
      </el-form-item>
    </el-form>
    <el-button @click="submit(formInstance)" style="margin-top: 10px;">{{lang? '提交' : 'Submit'}}</el-button>
    <el-button @click="cancel" style="margin-top: 10px; width=100vw;">{{lang? '取消': 'Cancel'}}</el-button>
</div>
</div>
</template>
<script lang="ts" setup>
import { BookC } from '@/interface/Book';
import { computed, reactive, ref } from 'vue';
import { useStore } from '@/store/index';
import { FormInstance } from 'element-plus';
import { ms } from '@/tools/message';
const store = useStore();
const emit = defineEmits(["bookAddOver"])
const formInstance = ref<FormInstance>();

const lang = computed(() => store.state.config.lang)


const newBook = reactive<BookC>(new BookC());

const cancel = () => {
  ms("取消添加", 'cancel', "i")
  emit("bookAddOver")
}


const submit = (formInstance:FormInstance | undefined) => {
  formInstance?.validate().then(() => {
    store.commit("addBook",newBook)
    store.commit("updateFlag",true)
    emit("bookAddOver")
    ms("本地添加成功","local Add book success","s")
  }).catch(() => {
    ms('添加错误', 'failure to add book', 'e')
  })

}




const checkName = (rule:any, value:string, callback:Function) => {  
   const overlap = store.state.book.books.find((item) => item.bookName === value)
   value = newBook.bookName;
   if (overlap) {
      callback(new Error(lang ? '书名已经存在': "The name must not be same as current"))
   } else if (!value) {
    console.log(value)
      callback(new Error(lang? '书名为必填' : 'book name must not be null'))
   } else {
    callback()
   }
}

  const checkPrice = (rule: any, value: number, callback: any) => {
  if (!value && value !=0) {
    return callback(new Error(lang? '请输入价格' : 'Please input the price'))
  }  else {
      if (value < 0) {
        callback(new Error(lang? '请输入正数': 'Age must be greater than 0'))
      } else if(value > 1000) {
         callback(lang? '价格不能超过1000元': "the price must not getter than 1000")
    } else {
        callback()
      }
    }
  }

const checkStore = (rule: any, value: any, callback: any) => {
  if (!value && value != 0) {
    callback(new Error('Please input the Store'))
  } else if (!Number.isInteger(value)) {
    callback(new Error("Please Enter A Number"))
  }  else if (value <0 || value < newBook.remain) {
       callback(new Error(lang? '库存量不能小于0或小于可借数': "Please Enter A Positive Number or greatter than remain"))
  } else if(value > 100000) {
    callback("the store must not getter than 100000")
  }  else {
    callback()
  }
  callback()
  
}


const checkRemain = (rule: any, value: any, callback: any) => {
  console.log(value)
  if (!value && value != 0) {
    callback(new Error(lang? '请输入可借量' :'Please input the remain'))
  } else if (!Number.isInteger(value)) {
    callback(new Error(lang? "请输入数字" : "Please Enter A Number"))
  }  else if (value < 0) {
    callback(new Error(lang? '请输入正数': "Please Enter A Positive Number"))
  } else if(value > 100000 || value > newBook.store) {
    callback(lang ? "可借数不可以超过100000或大于库存量": "the store must not getter than 100000 or greatter than store number")
  }  else {
    callback()
  }
}





// // 全局注册事件确定提交可不可以
// const vaildate: any = (prop:string,isVaild:boolean) => {
//   if (priceFlag.value && storeFlag.value && nameFlag.value) {
//     updateButtonFlag.value = true
//   } else [
//     updateButtonFlag.value = false
//   ]
// }






// 规则
const rules = reactive({
  store: [{ validator: checkStore, trigger: 'blur' }],
  price: [{ validator: checkPrice, trigger: 'blur' }],
  book:[{validator:checkName,trigger:"blur"}],
  remain:[{validator:checkRemain, trigger:'blur'}]
})
</script>
<style>
</style>
   