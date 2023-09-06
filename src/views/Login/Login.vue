<template>
  <div class="home">
    <Title>
      <template #title>
        <span style="margin:auto">{{ lang ? '工资管理系统' : 'salary management system' }}</span>
      </template>
      <template #suffix>
        <el-button style="margin: auto;" type="primary" size="large" @click="register()">{{ lang ? '注册' : 'Sign up'}}</el-button>
      </template>
    </Title>

    <div class="login_warp">
      <el-radio-group v-model="labelPosition" label="label position">
      </el-radio-group>
      <div style="margin: 20px" />
      <el-form :label-position="labelPosition" label-width="100px" :model="user" style="max-width: 460px"
        ref="ruleFormRef" status-icon :rules="rules">
        <el-form-item :label="lang ? '账户' : 'Account'" prop="account">
          <el-input v-model="user.account" learable class="input_item" />
        </el-form-item>
        <el-form-item :label="lang ? '密码' : 'Password'" prop="password">
          <el-input v-model="user.password" clearable class="input_item" type="password" />
        </el-form-item>
        <el-form-item :label="lang ? '身份' : 'Identity'">
          <el-select v-model="user.role" class="select input_item" placeholder="choose your identity" size="large"
            :collapse-tags="true">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="lang ? '验证码' : 'verifyCode'" prop="verifyCode" class="check_code_wrapper">
          <el-input v-model="user.checkCode" clearable class="input_item verifycode" />
          <el-image :src='url + imgUrl' class="verify_img" @click="verifyImgChange()" />
        </el-form-item>
        <el-button type="primary" @click="login(ruleFormRef)">{{ lang ? '登录' : 'Login' }}</el-button>
      </el-form>
    </div>

  </div>
</template>

<script lang="ts" setup>


import Title from "@/components/common/tab_bar.vue"
import { getLogin } from "@/network/profile"
import { useRouter, useRoute } from 'vue-router'
import { ld, ms } from "@/tools/message";
import { store } from "@/store";
import { LoginUser, User } from "@/interface/User";
import { computed, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import url from "@/network/network_url"

const lang = computed(() => store.state.config.lang)

const labelPosition = ref('right')
const imgUrl = ref("/salary/api/checkCode");



const user = reactive<LoginUser>(new LoginUser())

const options = [
  {
    value: 0,
    label: lang ? '员工' : 'emp',
  },
  {
    value: 1,
    label: lang ? '管理员' : 'Admin',
  }
]

const login = (form: FormInstance | undefined) => {
  form?.validate().then((valid) => {
    const loading = ld('提交中', 'Submitting', true)
    getLogin(user).then((res) => {
      const {code, message, messageE, data} = res.data;
      if (code === 200) {
        const user: User = data.user;
        const token = res.headers.token;
        ms(message,messageE, "s")
        window.localStorage.setItem("token", token)
        window.localStorage.setItem("user", JSON.stringify(user))
        store.commit("changeProfile", user);
        user.role ? router.push("/index/admin/dept") : router.push("/index/employee/salarys")
      } else {
        ms(message, messageE, "e")
      }
    }).finally(() => {
      loading.close();
    })
  }).catch(() => {
    ms("请先填写必填字段", "please fill all item before you submit", "e")
  })
}

// 在后加上时间戳来更改验证码重新加载
const verifyImgChange = () => {
  imgUrl.value = imgUrl.value.split("?time")[0] + "?time=" + new Date().getMilliseconds();
}




const route = useRoute()
const router = useRouter()


const register = () => {
  router.push("/register")
}

//-- 表单验证开始

const ruleFormRef = ref<FormInstance>()

const checkAccount = (rule: any, value: string, callback: any) => {
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  if (value === '') {
    callback(new Error(lang ? '请输入账户名' : 'Please input the account'))
  } else if (value.length > 18) {
    callback(new Error(lang ? '账户名必须小于18位' : "account length must less than 18"))
  } else if (value.length < 2) {
    callback(new Error(lang ? '账户名最少为2位' : "account length must more than 2 character"))
  }
  else if (pattern.test(value)) {
    callback(new Error(lang ? '账户名不能包含特殊字符' : 'account could not contain special character'))
  } else {
    callback()
  }
}

const checkPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error(lang ? '请输入密码' : 'Please input the password code'))
  } else if (value.length > 18) {
    callback(new Error(lang ? '密码必须少于18位' : "password length must less than 18"))
  } else if (value.length < 6) {
    callback(new Error(lang ? '密码必须大于六位' : "password must more than 6 character"))
  } else {
    callback()
  }
}
const checkVerifyCode = (rule: any, value: string, callback: any) => {
  value = user.checkCode
  if (value === '') {
    callback(new Error(lang ? '请输入验证码' : 'Please input the check code'))
  } else if (value.length > 10) {
    callback(new Error(lang ? '验证码必须小于10位' : "check code length must less than 10"))
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
.login_warp {
  margin-top: 80px;
  width: 100vw;
  display: flex;
  justify-content: center;
}

.verify_img {
  width: 100px;
  height: 32px;
}

.check_code_wrapper {
  width: 100vw;
  display: flex;
  height: 40px;
}


.input_item {
  width: 30vw;
}


</style>



