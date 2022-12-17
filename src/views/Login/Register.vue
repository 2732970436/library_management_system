<template>
 
  <Title :title="'Register'"></Title>
  <el-radio-group v-model="labelPosition" label="label position">
  </el-radio-group>
  <div style="margin: 20px" />
  <div class="register_warp">
  <el-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
    style="max-width: 460px"
    :rules="rule"
    @validate = "validate"
  >
    <el-form-item label="Account" prop="account">
      <el-input v-model="formLabelAlign.account" maxlength="18" minlength="6" clearable class="input_item"/>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="formLabelAlign.password" type="password" maxlength="18" minlength="6" clearable class="input_item"/>
    </el-form-item>
    <el-form-item label="ConfirmPassword" prop="ensurePassword">
      <el-input  type="password" v-model="formLabelAlign.ensurePassword" clearable></el-input>
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="formLabelAlign.email" placeholder="You can choose not to fill in this field" clearable></el-input>
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
  <el-button type="primary" @click="register()" :disabled ="!registerButtonFlag" >Register</el-button>
  </el-form>
</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Title from '@/components/title.vue';

import { getRegister } from '@/network/user';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { ms } from '@/tools/message';

interface Format {
  account: string,
  password: string,
  type: "Student" | "Admin",
  ensurePassword:string,
  email:string
}
const labelPosition = ref('right')
const formLabelAlign = reactive<Format>({
  account: '',
  password: '',
  type: "Student",
  ensurePassword:"",
  email:""
})

const accountFlag = ref(false);
const passwordFlag = ref(false);
const ensurePasswordFlag = ref(false);
const emailFLag = ref(true)
const registerButtonFlag = ref(false);
const checkAccount = (rule:any,value:string,callback:any) => {
  if (!value.match("^[a-zA-Z]+$")) {
    accountFlag.value = false;
    callback(new Error("Please Input Letter"));
  } else if (value.length < 2) {
    accountFlag.value = false;
    callback(new Error("please input more than 2 letter"))
  } else {
    accountFlag.value = true;
    callback();
  }
}

const checkPassword = (rule:any,value:string,callback:any) => {
  if (!value.match("^[0-9A-Za-z]+$")) {
    passwordFlag.value = false;
    callback(new Error("content must contain only letter or digital"))
  } else if (value.length < 6) {
    passwordFlag.value = false;
    callback(new Error("passwrod length must greater than six"))
  } else {
    passwordFlag.value = true;
    callback();
  }
}

const checkEnsurePassword = (rule:any,value:string,callback:any) => {
  if (value === formLabelAlign.password) {
    ensurePasswordFlag.value = true;
    callback()
  } else {
    ensurePasswordFlag.value = false;
    callback("Not the same as password")
  }
}

const  checkEmail = (rule:any,value:string,callback:any) => {
  let pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (value.match(pattern)) {
    emailFLag.value = true
      callback();
  } else if (value) {
    emailFLag.value = false
    callback(new Error("The email format is wrong"));
  } else {
    emailFLag.value = true;
    callback();
  }
}

const rule = reactive({
  account:[{ validator:checkAccount, trigger:'blur'}],
  password:[{validator:checkPassword, trigger:"blur"}],
  ensurePassword:[{validator:checkEnsurePassword,trigger:"blur"}],
  email:[{validator:checkEmail,trigger:"blur"}]
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

const register = () => {
  getRegister(formLabelAlign).then((res) => {
    const code = res.data.code;
    const token = res.headers.token;
    switch(code) {
      case 200: ms({
      message:res.data.message,
      type:"success"
    }); 
    window.localStorage.setItem("token", token);
    if (formLabelAlign.type === "Student") {
      router.replace("/student")
    } else if (formLabelAlign.type === "Admin") {
      router.replace("/admin")
    }
      break;
      default: ms({
      message:res.data.message,
      type:"warning"
    });
 
    }
  }).catch((err) => {
    ms("服务器错误", "There is something wrong", "e")
  })
}

const validate = () => {
  if (accountFlag.value && passwordFlag.value && ensurePasswordFlag.value && emailFLag.value) {
    registerButtonFlag.value = true;
  } else {
    registerButtonFlag.value = false
  }
}
</script>

<style scoped>
  .select {
    width: 360px;
    max-width: 360px;
  }
  .register_warp {
    width: 100vw;
    display: flex;
    justify-content:center
  }
</style>