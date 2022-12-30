<template>
    <tab_bar>
        <template #prefix>
            <el-upload :action="`${url}/library/profile/avatar/img/${user?.id}`" :headers="headers" :accept="'image/png, image/jpeg'"
                :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list="false"
                :alt='l("点击上传头像", "upload image")' style="margin: auto;">
                <el-avatar :size="62" :src="avatarUrl" v-if="freshAvatar" />
            </el-upload>
        </template>
        <template #title>
            <h4 style="margin: auto;">{{ l('个人主页', 'PROFILE') }}</h4>
        </template>

        <template #suffix>
            <el-button style="margin: auto;" @click="loginOut">{{ l("退出登录", 'LOGIN OUT') }}</el-button>
        </template>
    </tab_bar>
    <div class="user_info">
    <el-upload :action="avatarUrl" :headers="headers" :accept="'image/png, image/jpeg'"
                :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list="false"
                :alt='l("点击上传头像", "upload image")' style="margin: auto;">
                <el-avatar :size="200" :src="avatarUrl" v-if="freshAvatar" />
                
     </el-upload>
  
    </div>
    <div class="info_warpper">
        <el-descriptions
    class="margin-top"
    :column="3"
    border
  >
    <el-descriptions-item>
      <template #label>
        <div >
        <el-icon  class="profile_icon">
            <UserFilled />
          </el-icon>
          {{ l("用户名", "Username") }} 
        </div>
      </template>
       {{ user.account }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div >
          <el-icon class="profile_icon">
            <Iphone />
          </el-icon>
          {{ l("手机号", "phone") }}
        </div>
      </template>
      {{ user.phone }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div >
          <el-icon class="profile_icon">
            <Calendar />
          </el-icon>
          {{ l('注册日期', 'enrollTime') }}
        </div>
      </template>
      {{ enrollTime }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div >
          <el-icon class="profile_icon">
            <Notebook />
          </el-icon>
          {{ l('书本借阅量', 'Book circulation') }}
        </div>
      </template>
      <el-tag size="small">{{ user.borrowCount }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item >
      <template #label>
        <div>
          <el-icon  class="profile_icon">
            <Connection />
          </el-icon>
          {{ l('邮箱地址', 'Email') }}
        </div>
      </template>
     <p style="text-align: center;">{{ user.email }}</p> 
    </el-descriptions-item>
  </el-descriptions>
    </div>
    <el-dialog v-model="dialogFormVisible" :title="lang ? '修改信息' : 'UpdateInfo'">
        <el-form :label-position="'right'" ref="bookForm" :model="user" style="width: 100%" :rules="rule">
            <el-form-item prop="account">
                <el-input v-model="user.account" maxlength="18" minlength="2" disabled clearable class="input_item">
                    <template #prepend>
                        {{ l("用户名", "account") }}
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="email">
                <el-input v-model="user.email" clearable>
                    <template #prepend>
                        {{ l('邮箱地址', 'Email') }}
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="phone">
                <el-input v-model="user.phone" clearable>
                    <template #prepend>
                        {{ l('电话号码', 'Phone') }}
                    </template>
                </el-input>
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

    <el-dialog v-model="passwordFormVisible" :title="lang ? '修改密码' : 'UpdatePassword'">
        <el-form :label-position="'right'" ref="bookForm" :model="user" style="width: 100%" :rules="rule">
            <el-form-item prop="passwordLocal">
                <el-input v-model="user.passwordLocal" maxlength="18" minlength="6" clearable class="input_item">
                    <template #prepend>
                        {{ l("新密码", "new password") }}
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordEditCancel()">{{ lang ? '取消' : 'Cancel' }}</el-button>
          <el-button :disabled="!updateButtonFlag" type="primary" @click="passwordEditConfirm(bookForm)">{{ lang ? '确认' :
              'Confirm'
          }}</el-button>
        </span>
      </template>
    </el-dialog>
    <el-link style="margin-top: 20px; margin-right: 20px;" @click="updateInfo">{{l('修改信息', "updateInfo")}}</el-link>
    <el-link style="margin-top: 20px;" @click="updatePassword">{{l('修改密码', "updatePassword")}}</el-link>
   
</template>

<script lang="ts" setup>
import tab_bar from '@/components/common/tab_bar.vue';
import url from "@/network/network_url"
import router from '@/router';
import { store } from '@/store';
import { l } from '@/tools/lang';
import { ms } from '@/tools/message';
import { computed, reactive, ref } from 'vue'

import { updateProfile } from '@/network/profile';
import { User } from '@/interface/User';
import { Calendar, Connection, Iphone, UserFilled, Notebook } from '@element-plus/icons-vue';
import { FormInstance } from 'element-plus';
import { formatDate } from '@/tools/date';

const lang = computed(() => store.state.config.lang)
const headers: Record<string, any> = { token: window.localStorage.getItem("token") }
const user = ref<User>(JSON.parse(JSON.stringify(store.state.profile.user!)))
let avatarUrl = `${url}/library/api/profile/avatar/img/${user.value?.id}`
const freshAvatar = ref(true);
let dialogFormVisible = ref(false);
const updateButtonFlag = ref(true);
const bookForm = ref<FormInstance>();
const passwordFormVisible = ref(false)





const enrollTime = formatDate(user.value.enrollTime);


const updateInfo = () => {
    dialogFormVisible.value = true;
}

const updatePassword = () => {
    passwordFormVisible.value = true;
}

const passwordEditCancel = () => {
    passwordFormVisible.value = false;
  ms('操作取消', 'operate cancel', "i")
}

const passwordEditConfirm = (bookForm:FormInstance| undefined) => {
  bookForm!.validate().then(() => {
    updateProfile(user.value).then((res) => {
        const { message, messageE, code, data } = res.data;
        switch (code) {
            case 200: ms(message, messageE, "s");
            store.commit("changeProfile", user.value)
            passwordFormVisible.value = false;
                break;
            default: ms(message, messageE, "w");
                break;
        }
    }).catch((err) => {
        ms("发生了一些错误", "There is soething wrong", "e")
    })
  }).catch(() => {
    ms("请先正确填写完所有字段","please fill all item currently", "e")
  })
}

const EditCancel = () => {
  dialogFormVisible.value = false;
  ms('操作取消', 'operate cancel', "i")
}

const EditConfirm = (bookForm:FormInstance| undefined) => {
  bookForm!.validate().then(() => {
    updateProfile(user.value).then((res) => {
        const { message, messageE, code, data } = res.data;
        switch (code) {
            case 200: ms(message, messageE, "s");
            store.commit("changeProfile", user.value)
            dialogFormVisible.value = false;
                break;
            default: ms(message, messageE, "w");
                break;
        }
    }).catch((err) => {
        ms("发生了一些错误", "There is soething wrong", "e")
    })
  }).catch(() => {
    ms("请先正确填写完所有字段","please fill all item currently", "e")
  })
}

const uploadSuccess = (res: any) => {
    const { code, message, messageE, data } = res;
    if (code === 200) {
        ms(message, messageE, "s");
        freshAvatar.value = false;
        avatarUrl += '?' + new Date()
        freshAvatar.value = true;
    } else {
        ms("发生了一些错误", "there is something wrong", "e");
    }

}

const beforeUpload = (rawFile: any) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ms("文件必须是以jpg, png, jpeg结尾的图片格式", "Documents must be in JPG, PNG, jpeg format at the end of the image", "w")
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ms("图片大小不能超过2mb", 'Avatar picture size can not exceed 2MB!', "w");
        return false
    }
    return true
}


const loginOut = () => {
    window.localStorage.setItem("user", "");
    window.localStorage.setItem("token", "")
    ms("退出登录", 'loginOut', "s");
    router.push("/login")
}





const checkAccount = (rule: any, value: string, callback: any) => {
    if (!value.match("^[a-zA-Z0-9|#|@|\.]+$")) {
        callback(new Error(lang ? '请输入字母或数字' : "Please Input Letter"));
    } else if (value.length < 2) {
        callback(new Error(lang ? '用户名最短为2位' : "please input more than 2 letter"))
    } else {
        callback();
    }
}

const checkPassword = (rule: any, value: string, callback: any) => {
    if (!value.match("^[0-9A-Za-z|\.|#|!|%|^|&|*|\(|\)|\?|+|-|\/]+$")) {
        callback(new Error(lang ? '密码只能包含数组字母和某些特殊字符' : 'content must contain only letter or digital'))
    } else if (value.length < 6) {
        callback(new Error(lang ? '密码必须大于6位' : "passwrod length must greater than six"))
    } else {
        callback();
    }
}


const checkEmail = (rule: any, value: string, callback: any) => {
    let pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (value.match(pattern)) {
        callback();
    } else if (value) {
        callback(new Error(lang ? '错误的邮件格式' : "The email format is wrong"));
    } else if (!value) {
        callback(new Error(lang ? '邮箱必须填写' : "The email is required"));
    }
    else {
        callback();
    }
}

const rule = reactive({
    account: [{ validator: checkAccount, trigger: 'blur' }],
    passwordLocal: [{ validator: checkPassword, trigger: "blur" }],
    email: [{ validator: checkEmail, trigger: "blur" }]
})


</script>


<style scoped>
.profile_body {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: calc(100% - 62px)
}

.profile_item {
    display: flex;
}

.select {
    width: 360px;
    max-width: 360px;
}

.info_warpper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.user_info {
    display: flex;
}

.info_account {
   
}

.profile_icon {
    transform: translateY(3px);
}
</style>