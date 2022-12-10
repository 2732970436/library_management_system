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

