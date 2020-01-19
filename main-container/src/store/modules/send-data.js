export default {
  namespaced: true,
  state: {
    msg: '今天阳光很好',
  },
  mutations: {
    // 设置折叠状态
    SET_MSG_VALUE(state, data) {
      state.msg = data;
    }
  },
  actions: {
    // 设置折叠状态
    changeMsg({ commit }, data) {
      commit('SET_MSG_VALUE', data)
    },
  }
}