import Result from "@/interface/Result";
import { LoginUser, User } from "@/interface/User";
import axios from "axios";
import md5 from "js-md5";
import url from "./network_url";

export function getLogin<T = any>(info: LoginUser): Promise<Result<T>> {
  return axios({
    url: url + "/library/api/profile",
    method: "get",
    params: {
      checkCode: info.checkCode,
      account: info.account,
      password: md5(info.password),
      role: info.role,
    },
  }) as unknown as Promise<Result>
}
console.log(md5('123456'));


export function getRegister(info: User): Promise<Result> {
  return axios({
    url: url + '/library/api/profile',
    method: "post",
    data: {
      account: info.account,
      password: md5(info.password),
      role: info.role,
      email: info.email,
      phone: info.phone
    }
  }) as unknown as Promise<Result>
}

export function checkAccountIsExist(account: string, role: number) {
  return axios({
    url: url + `/library/api/profile/${account}/${role}`
  }) as unknown as Promise<Result>
}

export function isAdmin(account: string): Promise<Result> {
  return checkAccountIsExist(account, 1);
}