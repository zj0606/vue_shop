export default {
  namespaced: true,
  state: () => ({
    // 权限列表的数据
    rolesList: [],
    // 分配弹窗的数据
    rightsList: []
  }),
  mutations: {
    rolesListMutation (state, payload) {
      state.rolesList = payload.rolesList
    },
    rightsListMutation (state, payload) {
      state.rightsList = payload.rightsList
    }
  },
  actions: {
    async rolesListAction ({ commit, dispatch, state }) {
      const { data, meta } = await this._vm.$get('roles')
      if (meta.status === 200) {
        commit({
          type: 'rolesListMutation',
          rolesList: data
        })
      }
    },
    async rightsListAction ({ commit, dispatch, state }) {
      const { data, meta } = await this._vm.$get('rights/tree')
      if (meta.status === 200) {
        commit({
          type: 'rightsListMutation',
          rightsList: data
        })
      } else {
        return this._vm.$message.error('查询权限失败')
      }
    }
  }
}
