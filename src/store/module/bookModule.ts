import { BookC } from "@/interface/Book"
import {ld, ms} from "@/tools/message"
import { addBook, delBook, updateBook , getBooksByPage} from '@/network/book'
import { StoreOptions } from "vuex";


const bookModule:StoreOptions<bookState> = {
      state: {
        books:[],
        isUpdate:false,
        delIds:new Set<number>(),
        currentPage:0,
        bookCounts:0,
        bookPageSize:10
      },
      mutations:{
        /**
         * 添加书本
         * @param bookstate 上下文
         * @param book 被添加的书本信息
         */
        addBook(bookstate:bookState , book:BookC) {
          book.isAdd = true;
          //如果有书名重复了则提醒用户正在添加一本书名重复的书
          //后期考虑给用户提供一个按钮，点击将当前的库存添加到已存在的书名书的库存量中
          const overlap = bookstate.books.find((item) => item.bookName === book.bookName)
          if (overlap) {
            ms("你添加的的这本书的名字已经存在了!!!", "You are add a book's name to be same as current!!!","w")
          }
          bookstate.books.push(JSON.parse(JSON.stringify(book)))
        },
        /**
         * 
         * @param bookstate 上下文
         * @param payload 参数，里面包含被修改书本信息
         */
        modifyBook(bookstate: bookState, payload:{index:number,newBook:BookC}) {
          let i  = 0;
          bookstate.books[payload.index] = payload.newBook
          const overlap = bookstate.books.find((item: { bookName: string }) => item.bookName === payload.newBook.bookName && i++)
          if (overlap) {
            ms("您修改的书名已存在！！！", "You are updating a book's name to be same as current!!!","w")
          }
        },
        // 在本地删除书,即将被删除书的id放入delIds数组中，最后一起通过updateBooks更新，减少服务器压力
        deleteBook(bookstate: bookState ,index:number) {
          bookstate.delIds.add(bookstate.books[index].id)
          bookstate.books.splice(index,1)
        },
    // 更改book的是否被更改属性，只把被更改的书本传入服务器减少不必要的压力
        updateFlag(bookstate: { isUpdate: boolean },flag:boolean) {
          bookstate.isUpdate = flag
        },
        // 提交修改后把当前的所有书本状态设置为未修改
        submitBookUpdate(bookstate: bookState) {
          bookstate.books.forEach((item: { isUpdate: boolean; isAdd: boolean }) => {
            item.isUpdate = false;
            item.isAdd = false;
          })
        },
        // 在本地更新所有书本，删除原来的所有数据并把新数据添加
        replaceBooks(bookstate, books:Array<BookC>) {
          books.forEach((item,index,arr) => {
            item.isUpdate = false;
            item.index = index;
            item.isAdd = false;
          })
          // 删除所有数据并添加新数据
          bookstate.books.splice(0,bookstate.books.length,...books)
        },
        // 清除被删除数组
        cleanIds(bookstate) {
          bookstate.delIds.clear()
        },
        setPage(state,page:number) {
          state.currentPage = page;
        },
        setBookCount(state,count:number) {
           state.bookCounts = count
        },
        changeBookPageSize(state, size:number) {
          state.bookPageSize = size;
        },
        borrow(state, book:BookC) {
          let index = state.books.findIndex(item =>item === book)

          state.books[index].remain -= 1;

        }
      },
      actions:{
         updateBookPage(context, page:number) {
           context.commit("setPage", page);
           context.dispatch("getBooksFromNet",page)
         },

        /**
         * 从服务器获取书籍信息
         * @param context 
         * @param page 页数
         */
        getBooksFromNet(context, page:number = context.state.currentPage) {
          const l = ld("加载数据中","loading data",true)
          getBooksByPage(page).then((res) => {
            // 将服务器返回的书籍替换当前的书籍
            context.commit("replaceBooks",res.data.data.records);
            context.commit("setBookCount", res.data.data.total)
          }).finally(() => {
            l.close()
          })
        },
        // 更新所有新增的，删除的。修改的数据到服务器
        updateBooks(context) {
          // 将需要的网络请求加入promise数组
          const promiseArr = [];
          const addBooks = context.state.books.filter((item: { isAdd: any }) => item.isAdd);
          const updateBooks = context.state.books.filter((item: { isUpdate: boolean }) => item.isUpdate);
          const delBooks = Array.from(context.state.delIds)
          
          if (addBooks.length != 0) {
            promiseArr.push(addBook(addBooks))
          }
          if (updateBooks.length != 0) {
            promiseArr.push(updateBook(updateBooks))
          }
          if (delBooks.length != 0) {
             promiseArr.push(delBook(delBooks))
          }
          if (promiseArr.length === 0) {
            return ms("无需要提交的操作", 'no action', "e")
          }
                    

          Promise.all(promiseArr).then((values) => {
            // 如果新增，删除，修改都成功
            if (values.every((value) => value.data.code === 200)) {
              ms("操作成功", "operate success", "s")
              context.commit("submitBookUpdate");
              context.commit("updateFlag",false);
              context.commit("cleanIds");
              // 重新从服务器上获取数据，可能导致性能变差，后期优化
              context.dispatch("getBooksFromNet", context.state.currentPage);
            } else {
              values.forEach((item) => {
                if (item.data.code != 200) {
                  ms(item.data.message, item.data.messageE, "e")
                }
               })
            }
         }).catch((values) => {
           ms("操作失败","Operate failure","e")
         })
        }
      }
    };
    
    // 为了使用vuex的时候bookstate能有类型
    export interface bookState {
      books:Array<BookC>,
      isUpdate:boolean,
      delIds:Set<number>,
      currentPage:number,
      bookCounts:number,
      bookPageSize:number
    }

export default bookModule;