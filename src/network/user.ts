import Result from "@/interface/Result";
import { User } from "@/interface/User";
import { store } from "@/store";
import axios from "axios";
import md5 from "js-md5";
import url from "./network_url";

const userUrl = url + "/salary/user"

export function updateUser(users: Array<User>):Promise<Result> {
  users.forEach((item) => {
    if (item.passwordLocal) {
      item.password = md5(item.passwordLocal);
    }
  })
  return axios({
    url: userUrl,
    method: "patch",
    data: users
  }) as any
}

export function addUser(users: Array<User>):Promise<Result> {
  users.forEach((item) => {
    if (item.passwordLocal) {
      item.password = md5(item.passwordLocal);
    }
  })
  return axios({
    url: userUrl,
    method: "post",
    data: users
  }) as any
}

/**
 *
 * @param ids 即将被删除的ID下标
 * @returns Result
 */

export function delUsers(ids: Array<number>):Promise<Result> {
  return axios({
    url:userUrl,
    method:"delete",
    data: ids
  }) as any
}

/**
 * 测试接口，请勿调用！！！
 * @returns 所有用户
 */
export function getUsers():Promise<Result> {
  return axios.get(userUrl) as any;
}

/**
 * 分页查询
 * @param page 要查询的页数
 * @param size 单页大小，默认为store.state.user.userPageSize()
 * @returns {code, salarys, message}
 */

export function getUsersByPage(page: number, size:number = store.state.user.usersPageSize):Promise<Result> {
  return axios.get(userUrl + `/${page}/${size}`);
}

export function getUsersByAccount(account:string): Promise<Result>  {
  return axios.get(userUrl + `/${account}`);
}
