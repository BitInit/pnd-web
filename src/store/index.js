import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    folderId: 0
  },
  mutations: {
    changeFolderId (state, folderId) {
      state.folderId = folderId
    }
  }
})