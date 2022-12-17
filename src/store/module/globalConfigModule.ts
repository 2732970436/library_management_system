import {ms} from "@/tools/message"

const globalConfigModule = {
      state: {
        lang:0
      },
      mutations:{
        changeLang(state:globalConfigState ,lang:number) {
           state.lang = lang;
        }
      },
      actions:{
         
    }
  }
    
    // 为了使用vuex的时候bookstate能有类型
    export interface globalConfigState {
      /**
       * lang为语言选择，0为中文，1为英文
       */
       lang:number
    }

export default globalConfigModule;