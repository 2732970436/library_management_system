import axios from "axios";
import url from "./network_url"

export function getRegister(info:{account:string,password:string,type:"Student" | "Admin",email:string}) {
    return axios.post(url+'/apis/api/enroll',{
    account:info.account,
    password:info.password,
    role:info.type,
    email:info.email
  })
}