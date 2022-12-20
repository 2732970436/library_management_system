import { store } from "@/store";
import { ElLoading, ElLoadingService, ElMessage, ElMessageBox, ElMessageBoxOptions, LoadingOptionsResolved, MessageOptions, MessageParams, messageType } from "element-plus";
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
export function ms(options: MessageOptions): void;

export function ms(chinese: string, english: string, mytype: 's' | 'w' | 'i' | 'e', options?: MessageOptions): void

export function ms(chinese: MessageOptions | string, english?: string, mytype?: 's' | 'w' | 'i' | 'e', options?: MessageOptions) {



    //如果第一个参数为字符串，则表示是新版
    if (typeof chinese === "string") {
        // 如果用户没有传指定的options,则准备一个默认的options对象
        if (!options) {
            options = {
                type: "info",
                duration: 3000,
                showClose: true,
                grouping: true
            }
        }
        options!.message = lang.value ? chinese : english
        // 如果用户传了mytype则进行替换
        switch (mytype) {
            case "s": options.type = "success"; break;
            case "i": options.type = "info"; break;
            case "w": options.type = "warning"; break;
            case "e": options.type = "error"; break;
            default: options.type = "info"
        }

        ElMessage(options)
        // 如果第一个参数是对象，则兼容ELmessage写法
    } else if (typeof chinese === "object") {
        ElMessage(options)
    }


}

/**
 * 加载
 * @param chinese 中文提示
 * @param english 英文提示
 * @param lock    是否锁屏，默认不锁
 * @param options 可空 原版的Options
 */
export function ld(chinese: string, english: string, lock: boolean = false, options: Partial<Omit<LoadingOptionsResolved, "target" | "parent"> & {
    target: string | HTMLElement;
    body: boolean;
}> = { background: 'rgba(0, 0, 0, 0.7)', text: lang ? "加载中" : "loading" }) {
    options.text = lang ? chinese : english;
    options.lock = lock;

    return ElLoading.service(options)
}

export function mb(contentC:string,contentE:string,type:messageType , options?:ElMessageBoxOptions) {
    if (!options) {
      options = {
            confirmButtonText: lang? '确定': 'OK',
            cancelButtonText: lang? '取消': 'Cancel',
      }
    }
    options.type = type;
    return ElMessageBox.confirm(lang?  contentC: contentE, options);
}