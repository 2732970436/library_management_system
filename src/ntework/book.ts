import { BookC } from "@/interface/Book";
import axios from "axios";
import url from "./network_url";


axios.interceptors.request.use(function (config:any) {
  // 在发送请求之前做些什么
  const token = window.localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

export function updateBook(books:Array<BookC>) {
  return axios.post(url+"/apis/books/update",{
    books:books
  })
}

export function addBook(books:Array<BookC>) {
 return axios.post(url+"/apis/books/add",{
    books:books
  })
}

export function delBook(ids:Array<number>) {
 return axios.post(url+"/apis/books/del",{
    ids:ids
  })
}

export function getBooks() {
  return axios.get(url+"/apis/books/get")
}
