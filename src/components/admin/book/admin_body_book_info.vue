<template>
  <Tab_bar @tabClick="tabClick">
    <template #title>
      <h4 style="margin: auto;">{{ lang ? '书籍信息' : 'bookInfo' }}</h4>
    </template>

    <template #suffix>
      <el-button type="primary" :icon="CirclePlus" style="margin: auto;" />
    </template>
  </Tab_bar>

  <div class="book_info_wrapper" v-show="!bookAddFlag">
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
            <el-button size="small" style="width:40%" :icon="Edit"
              @click="bookEdit(scope.$index, scope.row)"></el-button>
            <el-button :icon="Delete" type="danger" size="small" style="width: 40%;"
              @click="bookDelete(scope.$index, scope.row)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" :title="lang ? '修改信息' : 'UpdateInfo'">
      <el-form :model="tempBook" :rules="rules" ref="bookForm">
        <el-form-item :label="lang ? '书名' : 'bookName'" :label-width="'140px'">
          <el-input v-model="tempBook.bookName" autocomplete="off" maxlength="18" :show-word-limit="true" />
        </el-form-item>
        <el-form-item :label="lang ? '作者' : 'Author'" :label-width="'140px'">
          <el-input v-model="tempBook.author" autocomplete="off" maxlength="18" :show-word-limit="true" />
        </el-form-item>
        <el-form-item :label="lang ? '库存量' : 'Store'" :label-width="'140px'" prop="store">
          <el-input v-model.number="tempBook.store" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item :label="lang ? '可借数' : 'Remain'" :label-width="'140px'" prop="remain">
          <el-input v-model.number="tempBook.remain" autocomplete="off" type="number" />
        </el-form-item>
        
        <el-form-item :label="lang ? '价格' : 'Price'" :label-width="'140px'" prop="price">
          <el-input v-model.number="tempBook.price" autocomplete="off" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="EditCancel()">{{ lang ? '取消' : 'Cancel' }}</el-button>
          <el-button :disabled="!updateButtonFlag" type="primary" @click="EditConfirm(bookForm)">{{ lang ? '确认' :
              'Confirm'
          }}</el-button>
        </span>
      </template>
    </el-dialog>
    <el-button type="primary" style="width: 30%;" :disabled="!store.state.book.isUpdate" @click="submitUpdate()">{{ lang ?
        '提交修改' : 'submit'
    }}</el-button>
    <el-pagination background layout="prev, pager, next, size, jumper" v-model:current-page="currentPage"
      :total="store.state.book.bookCounts"
      style="justify-content: end; margin-top: 20px;" />
  </div>
  <admin_body_book_add v-if="bookAddFlag" @book-add-over="() => bookAddFlag = false"></admin_body_book_add>
</template>

<script lang="ts" setup>
import admin_body_book_add from './children/admin_body_book_add.vue';
import Tab_bar from "@/components/common/tab_bar.vue";


import { Delete, Edit, CirclePlus } from "@element-plus/icons-vue"
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { Book, BookC } from "@/interface/Book";
import { useStore } from '@/store';
import { mb, ms } from '@/tools/message';
import { maxBy } from 'lodash';
import { FormInstance } from 'element-plus';



//---------------初始化变量----------------------//
const store = useStore();
const lang = computed(() => store.state.config.lang)


// 搜索变量
const search = ref('')
// 放置修改的临时数据
const tempBook = ref<BookC>(
  new BookC()
);

const bookForm = ref<FormInstance>();

let dialogFormVisible = ref(false);

const priceFlag = ref(true);

const storeFlag = ref(true);

const updateButtonFlag = ref(true)
// 定义是否让添加组件显示的flag,false为不显示，true为显示
const bookAddFlag = ref(false)

//初始化
let books = store.state.book.books

const currentPage = ref<number>(1)

//-----------------初始化变量结束------------------------//
onMounted(() => {
  document.querySelector(".book_info_wrapper .el-pagination__goto")!.innerHTML = lang? '跳转至': 'goto';
})


//-----------------回调事件开始--------------------------//


let isRollBack = false;
//监听页面改变并且初始立即触发
const pageWatch = watch(currentPage, (newPage, oldPage) => {
  //判断是不是回溯，是回溯就不进行任何操作
  if (!isRollBack) {
  if (store.state.book.isUpdate) {
    mb("您在本页中的修改还未提交，是否提交", "You must commit current page before you do this", "warning").then(() => {
    submitUpdate()
    store.dispatch("updateBookPage",newPage)
  }).catch(() => {
    currentPage.value = oldPage!;
    isRollBack = true;
  })
  } else {
    store.dispatch("updateBookPage",newPage)
  }
} else {
  isRollBack = false
}
},{immediate:true})



const tabClick = (p: "suffix" | "title" | "prefix") => {
  switch (p) {
    case "suffix": bookAddFlag.value = true; break;
  }
}

// 搜索数据行，筛选搜索框
const filterTableData = computed(() =>
  books.filter(
    (data) =>
      !search.value ||
      data.bookName.toLowerCase().includes(search.value.toLowerCase())
  )
)

const bookEdit = (index: number, info: Book) => {
  let i = books.findIndex((item) => {
    return info === item;
  })
  tempBook.value = JSON.parse(JSON.stringify(info));
  tempBook.value.isUpdate = true;
  tempBook.value.index = i;
  if (info.isAdd) {
    ms('你必须先提交修改再进行此操作', "you must submit your All modify before you do this", "w")
  } else {
    dialogFormVisible.value = true
  }
}

const EditCancel = () => {
  dialogFormVisible.value = false;
  ms('操作取消', 'operate cancel', "i")
}

const EditConfirm = (bookForm:FormInstance| undefined) => {
  bookForm!.validate().then(() => {
    dialogFormVisible.value = false;
    store.commit("updateFlag", true)
    store.commit("modifyBook", { index: tempBook.value.index, newBook: tempBook.value })
    ms('本地更新成功', 'local Update Success', "s")
  }).catch(() => {
    ms("请先正确填写完所有字段","please fill all item currently", "e")
  })

  
}

// 处理删除操作
const bookDelete = (index: number, row: BookC) => {
  if (row.isAdd) {
    ms('你必须先提交修改再进行此操作', "you must submit your All modify before you do this", "w")
  } else {
    let i = books.findIndex((item) => item === row)
    store.commit("deleteBook", i)
    store.commit("updateFlag", true)
  }

}

const submitUpdate = () => {
  store.dispatch("updateBooks")
}

//----------------回调事件结束---------------------//

//------------表单验证开始---------------//
const checkName = (rule:any, value:string, callback:Function) => {  
   const overlap = store.state.book.books.find((item) => item.bookName === value)
   value = tempBook.value.bookName;
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
  }  else if (value <0 || value < tempBook.value.remain) {
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
  } else if(value > 100000 || value > tempBook.value.store) {
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

//-----------------------表单验证结束---------------------------//


</script>

<style scoped>
.book_info_wrapper {
  /* display: flex; */
  height: 70%;
}
</style>