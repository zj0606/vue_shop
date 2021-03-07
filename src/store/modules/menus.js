export default {
  namespaced: true,
  state: () => ({
    menus: [],
    activeMenu: ''
  }),
  getters: {},
  mutations: {
    setMenuMutation (state, payload) {
      state.menus = payload.menus
    },
    activeMenuMutation (state, payload) {
      state.activeMenu = payload.activeMenu
    }
  },
  actions: {
    // dispatch commit 局部化
    // 提交菜单
    setMenuAction ({ state, commit, rootState }, menus) {
      commit({
        type: 'setMenuMutation',
        menus
      })
    },
    // 提交当前激活的菜单路径
    activeMenuAction ({ state, commit, rootState }, activeMenu) {
      commit({
        type: 'activeMenuMutation',
        activeMenu
      })
    }
  }
}
