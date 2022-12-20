import {ms} from "@/tools/message"
import { StoreOptions } from "vuex";

const userModule:StoreOptions<UserState>  = {
      state: {
        role: 0,
       account: "",
       email: "",
       phone:""
      },
      mutations:{
        /**
         * 
         * @param state 上下文
         * @param role 当前登录身份
         */
        changeRole(state, role:number) {
           state.role = role;
        }
      },
      actions:{
         
    }
  }
    
    // 为了使用vuex的时候bookstate能有类型
    export interface UserState {
      /**
       * lang为语言选择，0为英文，1为中文
       */
       role:number,
       account:string,
       email:string,
       phone:string
    }

export default userModule;