import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 侧边栏样式
    asideStatus: 'inline-block',
    // 文件上传窗口状态 打开:open 关闭:close 折叠:collapse
    fileUploadComponentStatus: 'close',
    levelList: []
  },
  mutations: {
    toggleAside(state) {
      state.asideStatus = state.asideStatus === 'inline-block'? 'none': 'inline-block'
    },
    operationFileUploadWindow (state, status) {
      state.fileUploadComponentStatus = status
    },
    pushLevelList (state, val){
      state.levelList.push(val)
    },
    spliceLevelList(state, index){
      state.levelList.splice(index + 1, state.levelList.length - index)
    }
  },
  actions: {

  }
})
