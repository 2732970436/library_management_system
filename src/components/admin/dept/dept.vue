<template>
    <div class="dept_info_warpper">
        <tab-bar>
            <template #title>
                <h4 style="margin: auto;">{{lang? '部门管理': 'Dept management'}}</h4>
            </template>
        </tab-bar>
        <div class="dept_info_table_warpper">
            <el-table
                max-height="70vh"
                :data="filterTableData"
                style="width: 100%; display: flex; overflow: hidden;"
                border
            >
                <el-table-column prop="dept"  resizable show-overflow-tooltip :label="lang? '部门': 'department'" style="flex: 2"/>
                <el-table-column prop="managerName" resizable show-overflow-tooltip :label="lang? '经理名': 'manager'" style="flex: 3"/>
                <el-table-column prop="empNum" resizable show-overflow-tooltip :label="lang? '员工人数': 'emp_number'" style="flex: 2"/>
                <el-table-column prop="description" resizable show-overflow-tooltip :label="lang? '部门描述': 'description'" style="flex: 1"/>
                <el-table-column>
                    <template #header>
                        <el-input v-model="search" size="small" :placeholder="lang? '按名字搜索': 'search by name'" />
                    </template>
                    <template #default="scope">
                        <div style="display: flex; justify-content: space-between;">
                            <el-button :icon="Edit as any"   @click="deptEdit(scope.$index,scope.row)" style="width: 40%;"></el-button>
                            <el-button :icon="Delete as any" type="danger"  @click="deptDelete(scope.$index, scope.row)" style="width: 40%;"></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="addNewDept" style="margin-top: 50px">添加新部门</el-button>
            <el-dialog v-model="dialogFormVisible" :title="lang? isAdd? '新增部门': '更新部门': 'UpdateInfo'">
                <el-form :model="tempDept">
                    <el-form-item :label="lang? '部门名': 'deptName'" :label-width="'140px'">
                        <el-input v-model="tempDept.dept" autocomplete="off" :disabled="!isAdd" />
                    </el-form-item>
                    <el-form-item :label="l('经理名', 'manager name')" :label-width="'140px'">
                        <el-input v-model="tempDept.managerName" autocomplete="off" />
                    </el-form-item>
                    <el-form-item :label="l('部门描述' ,'deptScript')" :label-width="'140px'">
                        <el-input v-model="tempDept.description" autocomplete="off" />
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

import { Dept } from '@/interface/dept';
import { ElMessage, FormInstance} from 'element-plus';
import { Edit, Delete } from '@element-plus/icons-vue';
import { ref,computed,reactive, watchEffect, watch } from 'vue';
import tabBar from '@/components/common/tab_bar.vue';
import { useStore } from '@/store';

import {l} from "@/tools/lang"
import { ms } from '@/tools/message';
import {deleteDept, getDepts, insertDept, updateDept} from "@/network/dept";



const store = useStore();

const lang = store.state.config.lang
// 搜索变量
const search = ref('')

const isAdd = ref(false)

// 放置修改的临时数据
const tempDept = ref<Dept>(new Dept());

let dialogFormVisible = ref(false);


let depts = reactive<Array<Dept>>([]);

// 获取部门信息
getDepts().then(async (res) => {
    depts.length = 0;
    depts.push(...res.data.data as Array<Dept>)
})


// 搜索数据行
const filterTableData = computed(() =>
    depts.filter(
        (data) => {
            return !search.value || data.dept.toLowerCase().includes(search.value.toLowerCase())
        }
    )
)






// 当用户点击编辑时将查找该条记录的index并插入到Dept的index属性中
const deptEdit = (index:number,info:Dept) => {
    let i = depts.findIndex((item) => {
        return info === item;
    })
    // 因为vuex建议不要直接修改,而且直接修改会导致取消操作很麻烦，所以这里深克隆当前对象
    tempDept.value = JSON.parse(JSON.stringify(info));
    dialogFormVisible.value = true
}

function addNewDept() {
    isAdd.value = true;
    tempDept.value = new Dept();
    dialogFormVisible.value = true;
}

const EditCancel = () => {
    dialogFormVisible.value = false;
    ms('操作取消','operate cancel',"i");
}
// 处理删除操作
const deptDelete = (index: number, row: Dept) => {
    let i = depts.findIndex((item: any) => item === row)
    deleteDept(row).then((res: any) => {
        if (res.data.code === 200) {
            depts.splice(i, 1)
            ms('删除成功', 'delete success', "s");
        } else {
            ms('删除失败', 'delete failed', "e");
        }
    }).catch((err: any) => {
        ms('删除失败', 'delete failed', "e");
    })
}

const EditConfirm = ()=> {
    dialogFormVisible.value = false;
    if (isAdd.value) {
        insertDept(tempDept.value).then((res: any) => {
            if (res.data.code === 200) {
                depts.push(tempDept.value)
                ms('添加成功', 'add success', "s");
            } else {
                ms('添加失败', 'add failed', "e");
            }
        }).catch((err: any) => {
            ms('添加失败', 'add failed', "e");
        })
    } else {
        updateDept(tempDept.value).then((res: any) => {
            if (res.data.code === 200) {
                let i = depts.findIndex((item: any) => item === tempDept.value)
                depts.splice(i, 1, tempDept.value)
                ms('更新成功', 'update success', "s");
            } else {
                ms('更新失败', 'update failed', "e");
            }
        }).catch((err: any) => {
            ms('更新失败', 'update failed', "e");
        })

    }

}



</script>

<style scoped>
.dept_info_warpper {
    height: 100%;
    width: 100%;
}
</style>

