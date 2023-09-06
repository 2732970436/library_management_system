import Result from "@/interface/Result";
import { LoginUser, User } from "@/interface/User";
import axios from "axios";
import md5 from "js-md5";
import url from "./network_url";

export function getLogin<T = any>(info: LoginUser): Promise<Result<T>> {
  return axios({
    url: url + "/salary/api/profile",
    method: "get",
    params: {
      checkCode: info.checkCode,
      account: info.account,
      password: md5(info.password),
      role: info.role,
    },
  }) as unknown as Promise<Result>
}


export function getRegister(info: User): Promise<Result> {
  return axios({
    url: url + '/salary/api/profile',
    method: "post",
    data: {
      account: info.account,
      password: md5(info.password),
      role: info.role,
      email: info.email,
      phone: info.phone,
      dept:info.dept
    }
  }) as unknown as Promise<Result>
}

export async function checkAccountIsExist(account: string, role: number){
  const result = await axios({
    url: url + `/salary/api/profile/${account}/${role}`
  })
  return result.data.code === 200

}

export async function isAdmin(account: string) {
  return await checkAccountIsExist(account, 1);
}

export function updateProfile(user:User): Promise<Result> {
  const localpassword = user.passwordLocal;
 if (localpassword) {
  user.password = md5(localpassword)
 }
  return axios({
    url: url + '/salary/api/profile',
    data: user,
    method: "patch"
  }) as unknown as any
}
