import { BookC } from "@/interface/Book";
import Result from "@/interface/Result";
import { User } from "@/interface/User";
import { store } from "@/store";
import axios from "axios";
import url from "./network_url";

const userUrl = url + "/library/user"

export function updateUser(users: Array<User>):Promise<Result> {
  return axios({
    url: userUrl,
    method: "patch",
    data: users
  }) as any
}

export function addUser(users: Array<User>):Promise<Result> {
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
 * @returns {code, books, message}
 */

export function getUsersByPage(page: number, size:number = store.state.user.usersPageSize):Promise<Result> {
  return axios.get(userUrl + `/${page}/${size}`);
}
