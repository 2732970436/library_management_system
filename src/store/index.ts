import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store, ModuleTree } from 'vuex'
import { BookC } from '@/interface/Book'
import { ElMessage } from 'element-plus'
import { addBook, delBook, getBooks, updateBook , getBooksByPage} from '@/network/book'

import bookModule from './module/bookModule'
import { bookState } from './module/bookModule'
import globalConfigModule, { globalConfigState } from './module/globalConfigModule'

export interface State {
  book: bookState,
  config:globalConfigState
}

// export store
export const store = createStore<State>({
  
  strict: true,
  modules:{
    book:bookModule as ModuleTree<State>,
    config:globalConfigModule
  },
  actions:{
  
  }
})
export const key: InjectionKey<Store<State>> = Symbol()
  
// 定义自己的 `useStore` 组合式函数
export function useStore () {
  return baseUseStore(key)
}


