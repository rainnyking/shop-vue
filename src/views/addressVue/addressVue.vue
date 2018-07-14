<template>
  <div class="address">
    <div class="address-header">
      <van-nav-bar
        title="地址管理"
        left-arrow
        @click-left="goback"
      />
    </div>
    <div class="address-content">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        @add="onAdd"
        @edit="onEdit"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'address-vue',
  data () {
    return {
      chosenAddressId: '1',
      list: [
        {
          id: '1',
          name: '张三',
          tel: '13000000000',
          address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
        },
        {
          id: '2',
          name: '李四',
          tel: '1310000000',
          address: '浙江省杭州市拱墅区莫干山路 50 号'
        }
      ]
    }
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    onAdd () {
      this.$Toast('新增收货地址')
    },
    onEdit (item, index) {
      this.$Toast('编辑收货地址:' + index)
    }
  }
}
</script>
<style lang="scss">
  .address {
    .address-header {
      .van-nav-bar {
        background-color: #3cc591;
        color: #fff;
        .van-icon {
          color: #fff;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
</style>
