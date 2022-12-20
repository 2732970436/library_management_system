import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store, ModuleTree } from 'vuex'
import { BookC } from '@/interface/Book'
import { ElMessage } from 'element-plus'
import { addBook, delBook, getBooks, updateBook , getBooksByPage} from '@/network/book'

import bookModule, { bookState } from './module/bookModule'
import globalConfigModule, { GlobalConfigState } from './module/globalConfigModule'
import userModule, {UserState} from './module/userModule'

export interface State {
  book: bookState,
  config:GlobalConfigState,
  user: UserState
}

// export store
export const store = createStore<State>({
  
  strict: true,
  modules:{
    book:bookModule as ModuleTree<State>,
    config:globalConfigModule as ModuleTree<State>,
    user:userModule as ModuleTree<State>
  },
  actions:{
  
  }
})
export const key: InjectionKey<Store<State>> = Symbol()
  
// 定义自己的 `useStore` 组合式函数
export function useStore () {
  return baseUseStore(key)
}


