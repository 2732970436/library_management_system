import router from "@/router";
import { ms } from "@/tools/message";
import axios from "axios";

axios.defaults.withCredentials=true;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前添加token
    const token = window.localStorage.getItem("token")
    token && config.headers ? config.headers.token = token : void 0; 
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


  axios.interceptors.response.use(function (response) {
    if (response.data.code === 520) {
      const {message, messageE} = response.data;
      ms(message, messageE,"e")
      router.push("/")
    }
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    ms("发生了一些错误", "Some error occurred", "e");
    console.log(error);
    return Promise.reject(error);
  });

