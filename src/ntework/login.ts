import axios from "axios";
import url from "./network_url";

export function getLogin(info:{account:String,password:String,type:"Student" | "Admin",checkCode:string}) {
   return axios({
      url:url+"/library/api/user",
      method:"post",
      data:{
        account:info.account,
        password:info.password,
        role:info.type=="Admin" ? 1 : 0,
      },
      params:{
        checkCode:info.checkCode
      }
    })
}