export default {
  state: {
    msg: '今天天气很好',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  },
  mutations: {
    // 设置父应用信息
    SET_MSG_VALUE(state, data) {
      state.msg = data;
    },
    // 设置父应用token
    SET_TOKEN(state, data) {
      state.token = data;
    }
  },
  actions: {
    // 设置父应用信息
    changeMsg({ commit }, data) {
      commit('SET_MSG_VALUE', data)
    },
    // 设置父应用token
    changeToken({ commit }, data) {
      commit('SET_TOKEN', data)
    }
  }
}