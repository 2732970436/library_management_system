<template>
  <el-radio-group v-model="labelPosition" label="label position">
  </el-radio-group>
  <div style="margin: 20px" />
  <el-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
    style="max-width: 460px"
    ref="ruleFormRef"
    status-icon
    :rules="rules"
  >
    <el-form-item label="Account" prop="account">
      <el-input v-model="formLabelAlign.account" clearable class="input_item"/>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="formLabelAlign.password" clearable class="input_item" type="password"/>
    </el-form-item>
    <el-form-item label="Identity">
      <el-select v-model="formLabelAlign.type" class="select" placeholder="choose your identity" size="large" :collapse-tags="true">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  </el-form-item>
  <el-form-item label="verifyCode" prop="verifyCode" >
      <el-input v-model="formLabelAlign.checkCode" clearable class="input_item verifycode"/>
      <el-image :src='url+imgUrl' class="verify_img" @click="verifyImgChange()" />
   </el-form-item>
  <el-button type="primary" @click="login(ruleFormRef)">Login</el-button>
  </el-form>

</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import url from "@/network/network_url"

import { ElMessage } from 'element-plus';

const labelPosition = ref('right')
const imgUrl = ref("/library/api/checkCode");
const formLabelAlign = reactive({
  account: '',
  password: '',
  type: 'Student',
  checkCode:""
})
const options = [
  {
    value: 'Student',
    label: 'Student',
  },
  {
    value: 'Admin',
    label: 'Admin',
  }
]

const emit = defineEmits(["login"])

const login = (form:FormInstance | undefined) => {
  form?.validate().then((valid) => {
    emit("login",formLabelAlign)
  }).catch(() => {
    ElMessage({
    message: "please fill all item before you submit",
    type:"error",
    showClose:true
  })
  })
  
}

// 在后加上时间戳来更改验证码重新加载
const verifyImgChange = () => {
  imgUrl.value = imgUrl.value.split("?time")[0] + "?time="+ new Date().getMilliseconds();
}


//-- 表单验证开始

const ruleFormRef = ref<FormInstance>()

const checkAccount = (rule: any, value: string, callback: any) => {
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  if (value === '') {
    callback(new Error('Please input the account'))
  } else if (value.length > 10) {
    callback(new Error("account length must less than 10"))
  } else if (value.length < 2) {
    callback(new Error("account length must more than 2 character"))
  } 
  else if (pattern.test(value)) {
    callback(new Error())
  } else {
    callback()
  }
}

const checkPassword = (rule: any, value: string, callback: any) => {
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  if (value === '') {
    callback(new Error('Please input the password code'))
  } else if (value.length > 18) {
    callback(new Error("password length must less than 18"))
  } else if (pattern.test(value)) {
    callback(new Error("password can't contain special character"))
  } else if (value.length < 6) {
    callback(new Error("password must more than 6 character"))
  }else {
    callback()
  }
}
const checkVerifyCode = (rule: any, value: string, callback: any) => {
  value = formLabelAlign.checkCode
  if (value === '') {
    callback(new Error('Please input the check code'))
  } else if (value.length > 10) {
    callback(new Error("check code length must less than 10"))
  } else {
    callback()
  }
}

  const rules = reactive({
  account: [{ validator: checkAccount, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
  verifyCode: [{ validator: checkVerifyCode, trigger: 'blur' }],
})




//-- 表单验证结束


</script>

<style scoped>

.verify_img {
  width: 100px;
  height: 32px;
}

.verifycode {
  width: 260px;
}

  .select {
    width: 360px;
    max-width: 360px;
  }
</style>