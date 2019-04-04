import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 侧边栏样式
    asideStatus: 'inline-block',
    // 文件上传窗口状态 打开:open 关闭:close 折叠:collapse
    fileUploadComponentStatus: 'close'
  },
  mutations: {
    toggleAside(state) {
      state.asideStatus = state.asideStatus === 'inline-block'? 'none': 'inline-block'
    },
    operationFileUploadWindow (state, status) {
      state.fileUploadComponentStatus = status
    }
  },
  actions: {

  }
})
