<template>
    <tab_bar>
        <template #prefix>
            <el-upload
            :action="avatarUrl" 
            :headers="headers" 
            :accept="'image/png, image/jpeg'" 
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            :show-file-list = "false" 
            :alt='l("点击上传头像", "upload image")'
            style="margin: auto;">
                <el-avatar :size="62" :src="avatarUrl" v-if="freshAvatar"/>
            </el-upload>
        </template>
        <template #title>
            <h4 style="margin: auto;">{{l('个人主页', 'PROFILE')}}</h4>
        </template>

        <template #suffix>
          <el-button style="margin: auto;" @click="loginOut">{{l("退出登录", 'LOGIN OUT')}}</el-button>
        </template>
    </tab_bar>

</template>

<script lang="ts" setup>
import tab_bar from '@/components/common/tab_bar.vue';
import Result from '@/interface/Result';
import url from "@/network/network_url"
import router from '@/router';
import { store } from '@/store';
import { l } from '@/tools/lang';
import { ms } from '@/tools/message';
import { UploadProps } from 'element-plus';
import { computed, ref } from 'vue';

const headers:Record<string, any> = {token: window.localStorage.getItem("token")}

const user = computed(() => store.state.profile.user)
let avatarUrl = `${url}/library/api/profile/avatar/img/${user.value?.id}`
const freshAvatar = ref(true);

const uploadSuccess = (res:any) => {
    const {code, message, messageE, data} = res;
    if (code === 200) {
        ms(message, messageE, "s");
        freshAvatar.value = false;
        avatarUrl += '?'+new Date()
        freshAvatar.value = true;
    } else {
        ms("发生了一些错误", "there is something wrong", "e");
    }
   
} 

const beforeUpload = (rawFile:any) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
     ms("文件必须是以jpg, png, jpeg结尾的图片格式", "Documents must be in JPG, PNG, jpeg format at the end of the image", "w")
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ms("图片大小不能超过2mb",'Avatar picture size can not exceed 2MB!', "w");
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
</script>