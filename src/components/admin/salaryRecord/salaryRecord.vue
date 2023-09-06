<template>
    <Tab_bar>
        <template #title>
            <h4 style="margin: auto;">{{ lang ? '工资审核' : 'salary audit' }}</h4>
        </template>
    </Tab_bar>

    <div class="audit_info_wrapper">
        <el-table :data="filterTableData" style="width:100%; height: 100%;  display: flex">
            <el-table-column type="selection" style="flex: 1;" />
            <el-table-column prop="id"  :label="lang ? '工资记录id' : 'id'" style="flex:1" />
            <el-table-column prop="empName" :label="lang ? '工资发放对象' : ''" style="flex:1" />
            <el-table-column prop="totalWage" :label="lang ? '应发工资' : 'totalWage'" style="flex:1" />
            <el-table-column prop="netSalary" :label="lang ? '实发工资' : 'netSalary'" style="flex:1" />
            <el-table-column prop="bonus" :label="lang ? '奖金' : 'bonus'" style="flex:1" />
            <el-table-column prop="salaryMonth" :label="lang ? '月份' : 'month'" style="flex:1" />
            <el-table-column>
                <template #header>
                    <el-input v-model="search" size="small" :placeholder="lang? '按工资发放对象搜索': 'search by name'" />
                </template>
                <template #default="scope">
                    <div style="display: flex; justify-content: space-between;">
                        <el-button :icon="Edit as any"   @click="deptEdit(scope.$index,scope.row)" style="width: 40%;"></el-button>
                        <el-button :icon="Delete as any" type="danger"  @click="salaryDelete(scope.$index, scope.row)" style="width: 40%;"></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogFormVisible" :title="lang? '更新信息': 'UpdateInfo'">
            <el-form :model="tempSalaryRecord">
                <el-form-item :label="lang? '工资发放对象': 'salary name'" :label-width="'140px'">
                    <el-input v-model="tempSalaryRecord.empName" autocomplete="off" disabled />
                </el-form-item>
                <el-form-item :label="lang? '月份': 'salary month'" :label-width="'140px'">
                    <el-input v-model="tempSalaryRecord.salaryMonth" autocomplete="off" disabled />
                </el-form-item>
                <el-form-item :label="l('应发工资', 'total wage')" :label-width="'140px'">
                    <el-input v-model="tempSalaryRecord.totalWage" autocomplete="off" />
                </el-form-item>
                <el-form-item :label="l('奖金' ,'bonus')" :label-width="'140px'">
                    <el-input v-model="tempSalaryRecord.bonus" autocomplete="off" />
                </el-form-item>
                <el-form-item :label="l('实发工资' ,'netSalary')" :label-width="'140px'">
                    <el-input :value="Number(tempSalaryRecord.totalWage) + Number(tempSalaryRecord.bonus || 0)" autocomplete="off" disabled />
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
</template>

<script lang="ts" setup>
import Tab_bar from "@/components/common/tab_bar.vue";

import { ref, computed, reactive, watch, onMounted, watchEffect, nextTick } from 'vue';
import { useStore } from '@/store';
import { ld, mb, ms} from '@/tools/message';
import { l } from "@/tools/lang";
import { SalaryRecord } from "@/interface/salaryRecord";
import {deleteSalaryRecord, getAllSalaryRecords, updatesalaryRecords} from "@/network/salaryRecord";
import {Delete, Edit} from "@element-plus/icons-vue";
import { auditRecord } from "@/interface/auditRecord";
import {updateAuditRecords} from "@/network/audit";



const dialogFormVisible = ref(false);
//---------------初始化变量----------------------//
const store = useStore();
const lang = computed(() => store.state.config.lang)
// 搜索变量
const search = ref('')
let audits = ref<Array<SalaryRecord>>([]);
const tempSalaryRecord = ref<SalaryRecord>(new SalaryRecord())
const init_data = () => {
    getAllSalaryRecords().then((res:any) => {
        const data = res.data as {data: SalaryRecord[]};
        audits.value = data.data;
    })
}

const filterTableData = computed(() =>
    audits.value.filter(
        (data) => {
            return !search.value || data.empName.toLowerCase().includes(search.value.toLowerCase())
        }
    )
)

init_data();


//-----------------初始化变量结束------------------------//
watchEffect(() => {
    nextTick(() => {
        if (document.querySelector(".audit_info_wrapper .el-pagination__goto")) {
            document.querySelector(".audit_info_wrapper .el-pagination__goto")!.innerHTML = lang.value? '跳转至': 'goto';
        }
    })
})

// 当用户点击编辑时将查找该条记录的index并插入到SalaryRecord的index属性中
const deptEdit = (index:number,info:SalaryRecord) => {
    let i = audits.value.findIndex((item) => item === info)
    // 因为vuex建议不要直接修改,而且直接修改会导致取消操作很麻烦，所以这里深克隆当前对象
    tempSalaryRecord.value = JSON.parse(JSON.stringify(info));
    dialogFormVisible.value = true
}


const EditCancel = () => {
    dialogFormVisible.value = false;
    ms('操作取消','operate cancel',"i");
}

const EditConfirm = ()=> {
    dialogFormVisible.value = false;
    tempSalaryRecord.value.netSalary = Number(tempSalaryRecord.value.totalWage) + Number((tempSalaryRecord.value.bonus || 0));
    updatesalaryRecords(tempSalaryRecord.value).then(() => {
        ms('操作成功','operate success',"s");
        init_data();
    }).catch(() => {
        ms('操作失败','operate failed',"e");
    })
}



// 处理删除操作
const salaryDelete = (index:number,row:SalaryRecord) => {
    let i = audits.value.findIndex((item) => item === row)
    deleteSalaryRecord(row).then(() => {
        ms('操作成功','operate success',"s");
        init_data();
    }).catch(() => {
        ms('操作失败','operate failed',"e");
    })
}



//----------------回调事件结束---------------------//

</script>

<style scoped>
.audit_info_wrapper {
    /* display: flex; */
    height: 70%;
}
</style>
