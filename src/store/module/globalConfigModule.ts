import {ms} from "@/tools/message"
import { StoreOptions } from "vuex";

const globalConfigModule:StoreOptions<GlobalConfigState>  = {
      state: {
        lang:1,
        bookPageSize:10,
      },
      mutations:{
        /**
         * 改变语言
         * @param state 上下文
         * @param lang 参数
         */
        changeLang(state:GlobalConfigState ,lang:number) {
           state.lang = lang;
        },
        changeBookPageSize(state, size:number) {
          state.bookPageSize = size;
        }
      },
      actions:{
         
    }
  }
    
    // 为了使用vuex的时候bookstate能有类型
    export interface GlobalConfigState {
      /**
       * lang为语言选择，0为英文，1为中文
       */
       lang:number,
       bookPageSize:number
    }

export default globalConfigModule;