import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { BookC } from '@/interface/Book'
import { ElMessage } from 'element-plus'
import { addBook, delBook, getBooks, updateBook } from '@/ntework/book'

// 为了使用vuex的时候state能有类型
export interface State {
  books:Array<BookC>,
  isUpdate:boolean,
  delIds:Set<number>
}
// this line is ensure that Vuex state could has type
export const key: InjectionKey<Store<State>> = Symbol()

// export store
export const store = createStore<State>({
  strict: true,
  state: {
    books:[],
    isUpdate:false,
    delIds:new Set<number>()
  },
  mutations:{
    addBook(state,book:BookC) {
      const overlap = state.books.find((item) => item.bookname === book.bookname)
      if (overlap) {
        ElMessage({
          message:"You are updating a book's name to be same as current!!!",
          type:"warning",
          duration:0,
          showClose:true,
          grouping:true
        })
      }
      state.books.push(JSON.parse(JSON.stringify(book)))
    },
    modifyBook(state,payload:{index:number,newBook:BookC}) {
      let i  = 0;
      state.books[payload.index] = payload.newBook
      const overlap = state.books.find((item) => item.bookname === payload.newBook.bookname && i++)
      if (overlap) {
        ElMessage({
          message:"You are updating a book's name to be same as current!!!",
          type:"warning",
          duration:0,
          showClose:true,
          grouping:true
        })
      }
    },
    deleteBook(state,index:number) {
      state.delIds.add(state.books[index].id)
      state.books.splice(index,1)
    },

    updateFlag(state,flag:boolean) {
      state.isUpdate = flag
    },

    submitBookUpdate(state) {
      state.books.forEach((item) => {
        item.isUpdate = false;
        item.isAdd = false;
      })
    },
    replaceBooks(state,books:Array<BookC>) {
      books.forEach((item,index,arr) => {
        item.isUpdate = false;
        item.index = index;
        item.isAdd = false;
      })
      state.books.splice(0,state.books.length,...books)
    },

    cleanIds(state) {
      state.delIds.clear()
    }

  },
  actions:{
    getBooksFromNet(context) {
      getBooks().then((res) => {
        context.commit("replaceBooks",res.data.books)
      })
    },
    updateBooks(context) {
      Promise.all([addBook(context.state.books.filter((item) => item.isAdd)),updateBook(context.state.books.filter((item) => item.isUpdate)),delBook(Array.from(context.state.delIds))]).then((values) => {
        if (values[0].data.err_code === 200 && values[1].data.err_code === 200 && values[2].data.err_code === 200) {
          ElMessage({
           message:values[0].data.message,
           type:"success",
           showClose:true
          })
          context.commit("submitBookUpdate")
          context.commit("updateFlag",false)
          context.commit("cleanIds")
          context.dispatch("getBooksFromNet")
        } else {
          ElMessage({
            message:values[0].data.message,
            type:"error",
            showClose:true
           })
        }
     }).catch((values) => {
      ElMessage({
        message:'操作失败',
        type:"error",
        showClose:true
       })
     })
    }
  }
})

// 定义自己的 `useStore` 组合式函数
export function useStore () {
  return baseUseStore(key)
}


