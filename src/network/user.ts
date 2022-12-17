import Result from "@/interface/Result";
import axios from "axios";
import url from "./network_url";

export function getLogin(info:{account:String,password:String,type:"Student" | "Admin",checkCode:string}) {
   return axios({
      url:url+"/library/api/user",
      method:"get",
      params:{
        checkCode:info.checkCode,
          account:info.account,
        password:info.password,
        role:info.type=="Admin" ? 1 : 0,
      },
    }) as unknown as Promise<Result>
}

export function getRegister(info: { account: string, password: string, type: "Student" | "Admin", email: string }): Promise<Result> {
  return axios({
    url: url+'/library/api/user',
    method:"post",
    data: {
      account: info.account,
      password: info.password,
      role: info.type === "Admin" ? 1 : 0,
      email: info.email
    }
  }) as unknown as Promise<Result>
}

export function checkAccountIsExist(account:string, role:number) {
   return axios({
     url: url + `/library/api/user/${account}/${role}`
   }) as unknown as Promise<Result>
}

export function isAdmin(account:string) :Promise<Result> {
     return checkAccountIsExist(account,1);
}