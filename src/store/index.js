import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menus'
import users from './modules/users'
import rights from './modules/rights'
import roles from './modules/roles'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login: {
      namespaced: true,
      state: {
        token: null
      },
      mutations: {
        saveTokenMutaion (state, payload) {
          state.token = payload.token
        }
      },
      actions: {
        loginAction ({ commit }, token) {
          commit({
            type: 'saveTokenMutaion',
            token
          })
        }
      },
      modules: {
        menu,
        users,
        rights,
        roles
      }
    }
  }
})
