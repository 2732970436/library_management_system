import { User } from "@/interface/User";
import {ms} from "@/tools/message"
import { StoreOptions } from "vuex";

const profileModule:StoreOptions<ProfileState>  = {
      state: {
        user: JSON.parse(window.localStorage.getItem("user") ? window.localStorage.getItem("user")!: "{}")
      },
      mutations:{
        /**
         * 
         * @param state 上下文
         * @param user 用户 
         */
         changeProfile(state,user:User) {
          state.user = user;
        }
      },
      actions:{
         
    }
  }
    
    // 为了使用vuex的时候bookstate能有类型
    export interface ProfileState {
      /**
       * lang为语言选择，0为英文，1为中文
       */
       user?:User
    }

export default profileModule;