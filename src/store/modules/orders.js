const orders = {
  state: { // 初始状态
    orderItems: []
  },
  mutations: { // 当前 object 触发状态方法
    setOrderItemsFun (state, order) {
      state.orderItems.push(order)
    }
  },
  getters: { // 全局获得的变量接口
    getOrderItems: function (state) {
      return state.orderItems
    }
  },
  actions: { // 触发改变状态的方法   对外开放 object 触发状态方法
    setOrderItems (context, order) {
      context.commit('setOrderItemsFun', order)
    }
  }
}
export default orders
