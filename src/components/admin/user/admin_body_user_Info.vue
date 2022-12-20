<template>
  <div>
  <el-table :data="filterTableData" style="width:100%;height: 100%;" >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="account" label="account" style="width:20vw"/>
    <el-table-column prop="password" label="password(md5)" style="width:20vw"/>
    <el-table-column prop="email" label="email" style="width:20vw"/>
    <el-table-column>
      <template #header>
        <el-input v-model="search" size="small" placeholder="search by name" />
      </template>
      <template #default="scope">
        <el-button text @click="userEdit(scope.$index,scope.row)"
    >Edit</el-button>
        <el-button  size="small"  type="danger"  @click="bookDelete(scope.$index, scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" title="UpdateInfo">
    <el-form :model="tempUser"  @validate="vaildate">
      <el-form-item label="account" :label-width="'140px'">
        <el-input v-model="tempUser.account" autocomplete="off" />
      </el-form-item>
      <el-form-item label="password" :label-width="'140px'">
        <el-input v-model="tempUser.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="email" :label-width="'140px'">
        <el-input v-model="tempUser.email" autocomplete="off" />
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
</div>
</template>

<script lang="ts" setup>

import { ElMessage, FormInstance } from 'element-plus';
import { ref,computed,reactive } from 'vue';

class User{
 public account:string;
 public password:string;
 public email:string;
 public isUpdate:boolean;
 public index:number;
 constructor(account:string,password:string,email:string) {
   this.account = account;
   this.password = password;
   this.email = email;
   this.isUpdate = false;
   this.index = users.length
 }
}
// 搜索变量
const search = ref('')

let users = reactive<Array<User>>([])
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))
  users.push(new User("testaccount","test","test"))

// 放置修改的临时数据
const tempUser = ref<User>(
  new User("test","test","test")
);

let dialogFormVisible = ref(false);

const priceFlag = ref(true);

const storeFlag = ref(true);

const updateButtonFlag = ref(true)




// 搜索数据行
const filterTableData = computed(() =>
users.filter(
    (data) =>
      !search.value ||
      data.account.toLowerCase().includes(search.value.toLowerCase())
  )
)



  const userEdit = (index:number,info:User) => {
    let i = users.findIndex((item) => {
      return info === item;
    })
    tempUser.value = JSON.parse(JSON.stringify(info));
    tempUser.value.isUpdate = true;
    tempUser.value.index = i;
    dialogFormVisible.value = true
  }

  const EditCancel = () => {
    dialogFormVisible.value = false;
    ElMessage({
    message: 'operate cancel',
    type: 'info',
  })
  }

  const EditConfirm = ()=> {
    dialogFormVisible.value = false;
    users[tempUser.value.index] = tempUser.value
    ElMessage({
    message: 'Update Success',
    type: 'success',
  })
  }

// 全局注册事件确定提交可不可以
const vaildate = (prop:any,isVaild:boolean) => {
  console.log(updateButtonFlag.value)
  if (priceFlag.value && storeFlag.value) {
    updateButtonFlag.value = true
  } else {
    updateButtonFlag.value = false
  }
}


// 处理删除操作
const bookDelete = (index:number,row:User) => {
   let i = users.findIndex((item) => item === row)
   users.splice(i,1)
}
</script>