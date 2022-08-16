import Vue from 'vue'
import Vuex from 'vuex'
import appsSubscribed from '_vuex/appsSubscribed'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    appsSubscribed,
  },
})
