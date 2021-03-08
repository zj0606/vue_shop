export default {
  namespaced: true,
  state: () => ({
    rightsList: []
  }),
  getters: {
    rightsListGetter (state, getters) {
      return state.rightsList
    }
  },
  mutations: {
    rightsListMutation (state, payload) {
      state.rightsList = payload.rightsList
    }
  },
  actions: {
    async rightsListAction ({ commit, dispatch, state }, rightsList) {
      const { data, meta } = await this._vm.$get('rights/list')
      if (meta.status === 200) {
        commit({
          type: 'rightsListMutation',
          rightsList: data
        })
      }
    }
  }
}
