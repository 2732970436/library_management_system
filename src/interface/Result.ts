import { Axios, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from "axios";

export default interface Result<T = any> extends AxiosResponse {
  code:number;
  data:{
    code:number,
    data:T,
    message:string
  };
  message:string;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig<any>;
  request?: any;
   
}