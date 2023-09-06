<template>
  <div class="user_info_warpper">
  <tab-bar>
    <template #title>
      <h4 style="margin: auto;">{{lang? '用户管理': 'User management'}}</h4>
    </template>
  </tab-bar>
    <div class="user_info_table_warpper">
  <el-table 
  max-height="70vh"
   :data="filterTableData" 
   style="width: 100%; display: flex; overflow: hidden;"
   :row-class-name="tableRowClassName"
    border
   >
    <el-table-column prop="account"  resizable show-overflow-tooltip :label="lang? '账户': 'account'" style="flex: 2"/>
    <el-table-column prop="email" resizable show-overflow-tooltip :label="lang? '邮箱': 'email'" style="flex: 3"/>
    <el-table-column prop="phone" resizable show-overflow-tooltip :label="lang? '手机号': 'phone'" style="flex: 2"/>
    <el-table-column prop="statusLocal" resizable show-overflow-tooltip :label="lang? '状态': 'status'" style="flex: 1">
        <template #default="scope">
            <el-tag :type="scope.row.statusLocal == '正常'? 'success': 'danger'" size="small">{{scope.row.statusLocal}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="dept" resizable show-overflow-tooltip :label="lang? '部门': 'dept'" style="flex: 1"/>
    <el-table-column prop="salary" resizable show-overflow-tooltip :label="lang? '工资': 'salary'" style="flex: 1"/>
    <el-table-column>
      <template #header>
        <el-input v-model="search" size="small" :placeholder="lang? '按名字搜索': 'search by name'" />
        </template>
      <template #default="scope">
        <div style="display: flex; justify-content: space-between;">
        <el-button :icon="Edit as any"   @click="userEdit(scope.$index,scope.row)" style="width: 40%;"></el-button>
        <el-button :icon="Delete as any" type="danger"  @click="salaryDelete(scope.$index, scope.row)" style="width: 40%;"></el-button>
      </div>
      </template>
    
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" :title="lang? '更新信息': 'UpdateInfo'">
    <el-form :model="tempUser">
      <el-form-item :label="lang? '账户': 'account'" :label-width="'140px'">
        <el-input v-model="tempUser.account" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="l('密码' ,'password')" :label-width="'140px'">
        <el-input v-model="tempUser.passwordLocal" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="l('邮件', 'email')" :label-width="'140px'">
        <el-input v-model="tempUser.email" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="l('手机号', 'phone')" :label-width="'140px'">
        <el-input v-model="tempUser.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="l('部门', 'dept')" :label-width="'140px'">
          <el-select v-model="tempUser.dept" class="m-2" placeholder="Select" size="large">
              <el-option
                      v-for="item in availDeptsOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
              />
          </el-select>
      </el-form-item>
      <el-form-item :label="l('工资', 'salary')" :label-width="'140px'">
        <el-input v-model="tempUser.salary" autocomplete="off" />
      </el-form-item>
        <el-form-item :label="l('状态', 'status')" :label-width="'140px'">
            <el-select v-model="tempUser.status" class="m-2" placeholder="Select" size="large">
                <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                />
            </el-select>
        </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="EditCancel()">{{l('取消', 'Cancel')}}</el-button>
        <el-button type="primary" @click="EditConfirm()"
          >{{l('确认', 'Confirm')}}</el-button>
      </span>
    </template>
  </el-dialog>
</div>
</div>
</template>

<script lang="ts" setup>

import { User } from '@/interface/User';
import { ElMessage, FormInstance} from 'element-plus';
import { Edit, Delete } from '@element-plus/icons-vue';
import { ref,computed,reactive, watchEffect, watch } from 'vue';
import tabBar from '@/components/common/tab_bar.vue';
import { useStore } from '@/store';

import {l} from "@/tools/lang"
import { ms } from '@/tools/message';
import {getDepts} from "@/network/dept";
import {Dept} from "@/interface/dept";

const statusOptions = [
    {
    value: 0,
    label: '正常',
  },
  {
    value: 1,
    label: '冻结',
  },
]

const availDeptsOptions = ref([])

getDepts().then((res) => {
    availDeptsOptions.value = res.data.data.map((item:Dept) =>  { return {label:item.dept, value:item.dept}})
})


const store = useStore();

const lang = store.state.config.lang
// 搜索变量
const search = ref('')

let users = store.state.user.users;

// 放置修改的临时数据
const tempUser = ref<User>(new User());

let dialogFormVisible = ref(false);


store.dispatch("getUsersFromNet", 1)



// 搜索数据行
const filterTableData = computed(() =>
users.filter(
    (data) => {
      return !search.value || data.account.toLowerCase().includes(search.value.toLowerCase())
    }
  )
)






// 当用户点击编辑时将查找该条记录的index并插入到User的index属性中
  const userEdit = (index:number,info:User) => {
    let i = users.findIndex((item) => {
      return info === item;
    })
    // 因为vuex建议不要直接修改,而且直接修改会导致取消操作很麻烦，所以这里深克隆当前对象
    tempUser.value = JSON.parse(JSON.stringify(info));
    tempUser.value.password;
    tempUser.value.isUpdate = true;
    tempUser.value.index = i;
    dialogFormVisible.value = true
  }


  const EditCancel = () => {
    dialogFormVisible.value = false;
    ms('操作取消','operate cancel',"i");
  }

  const EditConfirm = ()=> {
    dialogFormVisible.value = false;
    store.commit("modifyUser", tempUser.value);
    store.dispatch("updateusers")
  }



// 处理删除操作
const salaryDelete = (index:number,row:User) => {
   let i = users.findIndex((item) => item === row)
   store.commit("deleteUser", i);
   store.dispatch("updateusers")
}

// 表格高亮
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: User
  rowIndex: number
}) => {
  if (row.status === 0) {
    return ''
  } else if (row.status === 1) {
    return 'w'
  } else if (row.status === 2) {
    return "e"
  }
  return ''
}

</script>

<style scoped>
  .user_info_warpper {
    height: 100%;
    width: 100%;
  }
</style>

