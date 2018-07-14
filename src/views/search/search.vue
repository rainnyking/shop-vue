<template>
  <div class="searchbox" @click="golink('/search')">
    <form action="/">
      <van-search
        v-model="searchValu"
        show-action
        background=""
        placeholder="请输入商品名称"
        @search="onSearch"
      >
        <div slot="action" @click="onSearch">
          <div class="searchbtn">搜索</div>
        </div>
      </van-search>
    </form>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      searchValu: ''
    }
  },
  methods: {
    onSearch () {
      alert('搜索')
      console.log(this.searchValu)
    },
    onCancel () {
      alert('键盘')
    },
    golink (to) {
      this.$router.push(to)
    }
  }
}
</script>

<style lang="scss" scoped>
  .searchbox {
    position: relative;
    width: 100%;
    z-index: 99;
    .searchbtn {
      width: 50px;
      text-align: center;
      color: #fff;
    }
  }
</style>
