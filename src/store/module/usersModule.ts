import {ld, ms} from "@/tools/message"
import { StoreOptions } from "vuex";
import { User } from "@/interface/User";
import { addUser, delUsers, getUsers, getUsersByPage, updateUser } from "@/network/user";
import Result from "@/interface/Result";


const usersModule:StoreOptions<userState> = {
      state: {
        users:[],
        delIds:new Set<number>(),
        currentPage:0,
        usersCounts:0,
        usersPageSize:20
      },
      mutations:{
        /**
         * 添加用户
         * @param state 上下文
         * @param user 被添加的用户信息
         */
        addUser(state:userState , user:User) {
          user.isAdd = true;
          //如果有账户重复了则警告用户
          const overlap = state.users.find((item) => item.account === user.account || item.email === user.email && user.id != item.id)
          if (overlap) {
             ms("账户名或邮箱重复!!!", "Account name or E-mail to repeat!!!","e")
             return
            }
          state.users.push(JSON.parse(JSON.stringify(user)))
        },
        /**
         * 
         * @param state 上下文
         * @param payload 参数，里面包含被修改用户信息
         */
        modifyUser(state: userState, user:User) {         
          let i  = 0;
          //如果有账户重复了则警告用户
          const overlap = state.users.find((item) => (item.account === user.account || item.email === user.email) && user.id != item.id)
          if (overlap) {
             ms("账户名或邮箱重复!!!", "Account name or E-mail to repeat!!!","e")
             return
            }
        //   ms('更新成功', 'Update Success', "s");
          state.users[user.index] = user
        },
        // 在本地删除书,即将被删除书的id放入delIds数组中，最后一起通过updateusers更新，减少服务器压力
        deleteUser(userstate: userState ,index:number) {
          userstate.delIds.add(userstate.users[index].id)
          userstate.users.splice(index,1)
        },
        // 提交修改后把当前的所有书本状态设置为未修改
        submitUsersUpdate(userstate: userState) {
          userstate.users.forEach((item: { isUpdate: boolean; isAdd: boolean }) => {
            item.isUpdate = false;
            item.isAdd = false;
          })
        },
        // 在本地更新所有书本，删除原来的所有数据并把新数据添加
        replaceUsers(userstate, users:Array<User>) {
          users.forEach((item,index,arr) => {
            item.isUpdate = false;
            item.index = index;
            item.isAdd = false;
          })
          // 删除所有数据并添加新数据
          userstate.users.splice(0,userstate.users.length,...users)
        },
        // 清除被删除数组
        cleanIds(userstate) {
          userstate.delIds.clear()
        },
        setPage(state,page:number) {
          state.currentPage = page;
        },
        setUserount(state,count:number) {
           state.usersCounts = count
        },
        changeusersPageSize(state, size:number) {
          state.usersPageSize = size;
        }
      },
      actions:{
         updateUserPage(context, page:number) {
           context.commit("setPage", page);
           context.dispatch("getUsersFromNet",page)
         },

        /**
         * 从服务器获取书籍信息
         * @param context 
         * @param page 页数
         */
        getUsersFromNet(context, page:number) {
          // const l = ld("加载数据中","loading data",true)
          // 此为分页逻辑-----------------------------------

          // getUsersByPage(page).then((res) => {
          //   // 将服务器返回的书籍替换当前的书籍
          //   context.commit("replaceUsers",res.data.data.records);
          //   context.commit("setUserount", res.data.data.total)
          // }).finally(() => {
          //   l.close()
          // })
          
          // 此为获取全部用户逻辑--------------------------------

          getUsers().then((res) => {
            context.commit("replaceUsers", res.data.data)
            // ms(res.data.message, res.data.messageE, "s");
          }).finally(() => {
            // l.close()
          })
        },
        // 更新所有新增的，删除的。修改的数据到服务器
        updateusers(context) {
          // 将需要的网络请求加入promise数组
          const promiseArr:Array<Promise<Result>> = [];
          const addusers = context.state.users.filter((item: { isAdd: any }) => item.isAdd);
          const updateusers = context.state.users.filter((item: { isUpdate: boolean }) => item.isUpdate);
          const delusers = Array.from(context.state.delIds)
          
          if (addusers.length != 0) {
            promiseArr.push(addUser(addusers))
          }
          if (updateusers.length != 0) {
            promiseArr.push(updateUser(updateusers))
          }
          if (delusers.length != 0) {
             promiseArr.push(delUsers(delusers))
          }
          if (promiseArr.length === 0) {
            return ms("无需要提交的操作", 'no action', "e")
          }
                    

          Promise.all(promiseArr).then((values) => {
            // 如果新增，删除，修改都成功
            if (values.every((value) => value.data.code === 200)) {
              ms("操作成功", "operate success", "s")
              context.commit("submitUsersUpdate");
              context.commit("cleanIds");
              // 重新从服务器上获取数据，可能导致性能变差，后期优化
              context.dispatch("getUsersFromNet", context.state.currentPage);
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
    
    // 为了使用vuex的时候userstate能有类型
    export interface userState {
      users:Array<User>,
      delIds:Set<number>,
      currentPage:number,
      usersCounts:number,
      usersPageSize:number
    }

export default usersModule;