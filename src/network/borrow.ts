import { Book } from "@/interface/Book";
import { borrowRecord, Query } from "@/interface/borrowRecord";
import Result from "@/interface/Result";
import { User } from "@/interface/User";
import { store } from "@/store";
import axios from "axios";
import _ from "lodash";
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
export function getBorrowRecords(userId:number = store.state.profile.user!.id):Promise<Result<Array<borrowRecord>>> {
  return axios.get(borrowUrl + `/${userId}`) as any;
}


export function returnBookNet(id:number):Promise<Result<any>> {
  return axios({
    url:borrowUrl+"/"+id,
    method:"patch",
  }) as any
}

export function getBooksByPage(page: number, size:number):{records:Promise<Result<Array<borrowRecord>>>} {
  return axios.get(`${borrowUrl}/${page}/${size}`) as any;
}

export function getBorrowRecordsByCondition(query:Query, page:number, size:number = 10):Promise<Result> {
  query = _.cloneDeep(query);
  if (!query.book) query.book = -1;
  if (!query.user) query.user = -1;
  return axios({
    url: borrowUrl + `s/${query.user}/${query.book}/${page}/${size}`,
    method:"get",
  }) as any
}

export function putRecordsToNet(borrowRecord:borrowRecord) {
  return axios({
    method:"put",
    data:borrowRecord,
    url:borrowUrl+"s"
  })
}
