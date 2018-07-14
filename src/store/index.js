import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import orders from './modules/orders'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    cart,
    orders
  }
})

export default store
