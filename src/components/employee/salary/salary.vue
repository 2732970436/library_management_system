<template>
    <Tab_bar>
        <template #title>
            <h4 style="margin: auto;">{{ lang ? '工资信息' : 'salaryInfo' }}</h4>
        </template>
    </Tab_bar>

    <div class="audit_info_wrapper">
        <el-table :data="audits" style="width:100%; height: 100%;  display: flex">
            <el-table-column type="selection" style="flex: 1;" />
            <el-table-column prop="id"  :label="lang ? '记录id' : 'id'" style="flex:1" />
            <el-table-column prop="salaryMonth" :label="lang ? '月份' : 'month'" style="flex:1" />
            <el-table-column prop="totalWage" :label="lang ? '应发工资' : 'totalWage'" style="flex:1" />
            <el-table-column prop="bonus" :label="lang ? '奖金' : 'bonus'" style="flex:1" />
            <el-table-column prop="netSalary" :label="lang ? '实发工资' : 'netSalary'" style="flex:1" />
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import Tab_bar from "@/components/common/tab_bar.vue";

import { ref, computed, reactive, watch, onMounted, watchEffect, nextTick } from 'vue';
import { useStore } from '@/store';
import {getsalaryRecords, insertsalaryRecords } from "@/network/salaryRecord"
import { ld, mb, ms} from '@/tools/message';
import { l } from '@/tools/lang'
import {SalaryRecord } from "@/interface/salaryRecord";




//---------------初始化变量----------------------//
const store = useStore();
const lang = computed(() => store.state.config.lang)
// 搜索变量
const search = ref('')
let audits = ref<Array<SalaryRecord>>([]);

const dialogFormVisible = ref(false)
const newAudit = ref<SalaryRecord>(new SalaryRecord());

const init_data = () => {
    getsalaryRecords().then((res) => {
        const data = res.data;
        audits.value = data.data;
    })
}

init_data();

//-----------------初始化变量结束------------------------//
watchEffect(() => {
    nextTick(() => {
        if (document.querySelector(".audit_info_wrapper .el-pagination__goto")) {
            document.querySelector(".audit_info_wrapper .el-pagination__goto")!.innerHTML = lang.value? '跳转至': 'goto';
        }
    })
})




//----------------回调事件结束---------------------//

</script>

<style scoped>
.audit_info_wrapper {
    /* display: flex; */
    height: 70%;
}
</style>
