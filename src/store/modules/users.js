export default {
  namespaced: true,
  state: () => ({
    usersData: [],
    total: 0
  }),
  mutations: {
    editUsersDataMutation (state, payload) {
      state.usersData = payload.usersData
    },
    editTotalMutation (state, payload) {
      state.total = payload.total
    }
  },
  actions: {
    editUsersDataAction ({ commit, state, dispatch }, usersData) {
      commit({
        type: 'editUsersDataMutation',
        usersData
      })
    },
    editTotalAction ({ commit, state, dispatch }, total) {
      commit({
        type: 'editTotalMutation',
        total
      })
    }
  }
}
