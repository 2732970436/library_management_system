import { BookC } from "@/interface/Book";
import { store } from "@/store";
import axios from "axios";
import url from "./network_url";





export function updateBook(books: Array<BookC>) {
  return axios({
    url: url + "/library/book",
    method: "patch",
    data: books
  })
}

export function addBook(books: Array<BookC>) {
  return axios({
    url: url + "/library/book",
    method: "post",
    data: books
  })
}

/**
 * 
 * @param ids 即将被删除的ID下标
 * @returns  {code, data:null, message:string}
 */

export function delBook(ids: Array<number>) {
  return axios.delete(url + "/library/book", {
    data: ids
  })
}

/**
 * 测试接口，请勿调用！！！
 * @returns 所有书本
 */
export function getBooks() {
  return axios.get(url + "/library/book");
}

/**
 * 分页查询
 * @param page 要查询的页数
 * @param size 单页大小，默认为store.state.book.bookPageSize()
 * @returns {code, books, message}
 */

export function getBooksByPage(page: number, size:number = store.state.book.bookPageSize) {
  return axios.get(`${url}/library/book/${page}/${size}`);
}
