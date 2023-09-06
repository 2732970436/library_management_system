import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store, ModuleTree } from 'vuex'

import globalConfigModule, { GlobalConfigState } from './module/globalConfigModule'
import profileModule, {ProfileState} from './module/profileModule'
import usersModule, { userState } from './module/usersModule'

export interface State {
  config:GlobalConfigState,
  profile: ProfileState,
  user: userState
}

// export store
export const store = createStore<State>({
  
  strict: true,
  modules:{
    config:globalConfigModule as ModuleTree<State>,
    profile:profileModule as ModuleTree<State>,
    user:usersModule as ModuleTree<userState>
  },
  actions:{
  
  }
})
export const key: InjectionKey<Store<State>> = Symbol()
  
// 定义自己的 `useStore` 组合式函数
export function useStore () {
  return baseUseStore(key)
}


