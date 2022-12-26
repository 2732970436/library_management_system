import { Book } from "@/interface/Book";
import { borrowRecord } from "@/interface/borrowRecord";
import Result from "@/interface/Result";
import { User } from "@/interface/User";
import axios from "axios";
import url from "./network_url";

const borrowUrl = url + "/library/borrow"

export function updateUser(users: Array<User>):Promise<Result> {
  return axios({
    url: borrowUrl,
    method: "patch",
    data: users
  }) as any
}

export function borrowBook(book:Book):Promise<Result> {
  return axios({
    url: `${borrowUrl}/${book.id}`,
    method: "post",
  }) as any
}

/**
 * 
 * @param ids 即将被删除的ID下标
 * @returns Result
 */

export function delUsers(ids: Array<number>):Promise<Result> {
  return axios({
    url:borrowUrl,
    method:"delete",
    data: ids
  }) as any 
} 

/**
 * 
 * @returns 
 */
export function getBorrowRecords():Promise<Result<Array<borrowRecord>>> {
  return axios.get(borrowUrl) as any;
}


export function returnBookNet(id:number):Promise<Result<any>> {
  return axios({
    url:borrowUrl+"/"+id,
    method:"patch",
  }) as any
}
