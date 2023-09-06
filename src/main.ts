import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {store, key} from './store'
//  加载全局axios配置文件
  require("@/network/global_axios_config")




createApp(App).use(router).use(ElementPlus, {
  locale: zhCn,
}).use(store, key).mount('#app')
