import { store } from "@/store";
import {ElMessage, MessageOptions, MessageParams} from "element-plus";
import { computed } from "vue";

// /**
//  * 
//  * @param param0  可选参数，为结构表达式
//  * @param message 可选参数，为消息
//  * @param stype 可选参数类型
//  */
// export const ms = ({
//     message = "",
//     type = "info",
//     showClose = true,
//     grouping = true,
//     duration = 3000
// }: MessageOptions = {}, mymessage :string | undefined = undefined, mytype: 's' | 'w' | 'i' | 'e' | undefined = undefined , ) => {

//     let atype: 'success' | 'warning' | 'info' | 'error' = "info";
//     let amessage:string;

//     //如果不传固定参数stype,则
//     if (mytype === undefined) {
//         atype = type
//     } else {
//         switch (mytype) {
//             case "s" : atype = "success"; break;
//             case "i" : atype = "info"; break;
//             case "w" : atype = "warning"; break;
//             case "e" : atype = "error"; break;
//             default: atype = "info"
//         }
//     }

//     if (mymessage === undefined) {
//       amessage = message as string;
//     } else {
//         amessage = mymessage;
//     }
    
    

//     ElMessage({
//         message: amessage,
//         type: atype,
//         showClose,
//         grouping,
//         duration
//     })
// }






const lang = computed(() => store.state.config.lang)
/**
 * 默认是一个消息为3秒，显示关闭和分组的消息
 * @param chinese 中文，为了兼容传统的ElMessage模式，也可以传一个原始的Elmessage参数
 * @param english 英文
 * @param mytype  类型 
 * @param options 原ElMessage选项
 */

/**
 * @deprecated 此方式将于3.0版本废除
 */
export function ms(options:MessageOptions): void;
export function ms(chinese:string,english:string, mytype?:'s' | 'w' | 'i' | 'e', options?:MessageOptions): void

export function ms (chinese:MessageOptions | string, english?:string, mytype?: 's' | 'w' | 'i' | 'e', options?:MessageOptions) {
    
    
    
    //如果第一个参数为字符串，则表示是新版
    if (typeof chinese === "string") {
        // 如果用户没有传指定的options,则准备一个默认的options对象
    if (!options) {
        options = {
          type:"info",
          duration:3000,
          showClose:true,
          grouping:true
        }
      } 
        options!.message = lang.value ? chinese : english

        let type = options.type;
    // 如果用户传了mytype则进行替换
        switch (mytype) {
                        case "s" : type = "success"; break;
                        case "i" : type = "info"; break;
                        case "w" : type = "warning"; break;
                        case "e" : type = "error"; break;
                        default: type = "info"
        }

        ElMessage(options)
    // 如果第一个参数是对象，则兼容ELmessage写法
    } else if (typeof chinese === "object") {
        ElMessage(options)
    }
    

}
