<template>
  <div class="search-page">
    <div class="searchbox">
      <div class="search-header-left" @click="goback">
        <van-icon name="arrow-left" />
      </div>
      <div class="search-header-content">
        <form action="/">
          <van-search
            v-model="searchValu"
            background=""
            placeholder="请输入商品名称"
            @search="onSearch"
          >
          </van-search>
        </form>
      </div>
    </div>
    <div class="search-menu">
      <div v-if="list.length < 1">
        <div class="search-null-box">
          <div class="cart-null">
            <i class="iconfont icon-hezi401"></i>
            <div class="text">暂无相关商品~</div>
          </div>
        </div>
      </div>
      <div class="cart-food" ref="cartFood" v-else>
        <ul style="padding: 10px 0 20px">
          <li class="food-list food-list-hook">
            <ul
              class="li-ul"
              v-for="(food, index) in list"
              :key="index">
                <li class="food-item" @click.stop.prevent="gothink(food.pid, food.id)">
                  <div class="icon">
                    <img :src="food.icon" width="57" height="57">
                  </div>
                  <div class="content">
                    <h2 class="name">
                      {{food.name}}
                      <span>
                        好评率{{food.rating}}%
                      </span>
                    </h2>
                    <p class="desc" v-if="food.info">{{food.info}}</p>
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}份</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <ball-buy :food="food">购物加减</ball-buy>
                    </div>
                  </div>
                </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import search from './search'
import BScroll from 'better-scroll'
import ballBuy from '../buyBall/buyball'
export default {
  name: 'search-page',
  data () {
    return {
      searchValu: ''
    }
  },
  mounted () {
    this.getSearchData()
    // console.log(this.getCartGoods)
  },
  computed: {
    ...mapGetters(['getCartGoods']),
    list () {
      let _this = this
      let arrByZM = []// 声明一个空数组来存放数据
      // console.log(arrByZM)
      let str = this.searchValu.toLowerCase()
      this.getCartGoods.forEach(function (item) {
        item.foods.forEach(function (food) {
          if (food.name.toLowerCase().search(str) !== -1) {
            if (!food.pid) {
              _this.$set(food, 'pid', item.id)
            } else {
              food.pid = item.id
            }
            arrByZM.push(food)
          } else {
            console.log('meiyou')
          }
        })
      })
      return arrByZM
    }
  },
  methods: {
    onSearch () {
      // console.log(this.list)
    },
    onCancel () {
      alert('键盘')
    },
    getSearchData () {
      this.$nextTick(() => {
        this.cartScroll()
      })
    },
    cartScroll () {
      if (!this.cartFoodScroll) {
        this.cartFoodScroll = new BScroll(this.$refs.cartFood, {
          click: true
        })
      } else {
        this.cartFoodScroll.refresh()
      }
    },
    gothink (pid, id) {
      this.$router.push({
        path: '/food',
        query: {
          pid: pid,
          id: id
        }
      })
    },
    goback () {
      this.$router.go(-1)
    }
  },
  watch: {
    '$router': 'getSearchData'
  },
  components: {
    search, ballBuy
  }
}
</script>

<style lang="scss">
  .search-page {
    .searchbox {
      .van-search {
        padding: 8px 15px 8px 2px;
        .van-icon-search {
          left: 15px;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import "../../styles/mixins";
  .searchbox {
    position: relative;
    width: 100%;
    z-index: 99;
    background-color: #3cc591;
    display: flex;
    align-items: center;
    .searchbtn {
      width: 50px;
      text-align: center;
      color: #fff;
    }
    .search-header-left {
      width: 40px;
      line-height: 50px;
      height: 46px;
      color: #fff;
      text-align: center;
    }
    .search-header-content {
      flex: 1;
    }
  }
  .cart-food {
    position: absolute;
    top: 46px;
    width: 100%;
    bottom: 0;
    flex: 1;
    overflow: hidden;
    background-color: #f8f8f8;
    .li-ul {
      .food-item {
        display: flex;
        padding: 18px 10px;
        background-color: #fff;
        margin-bottom: 10px;
        @include border-1px(rgba(7, 17, 27, 0));
        &:last-child {
          @include border-none();
        }
        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            margin: 2px 0 8px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
            span {
              font-size: 12px;
              color: rgb(147, 153, 159);
              float: right;
              font-weight: normal;
            }
          }
          .desc,
          .extra {
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .desc {
            line-height: 12px;
            margin-bottom: 8px;
          }
          .extra {
            line-height: 14px;
            .count {
              margin-right: 12px;
            }
          }
          .price {
            font-weight: 700;
            line-height: 24px;
            .now {
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }
            .old {
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 10px;
            bottom: 14px;
          }
        }
      }
    }
  }
  .search-null-box {
    position: absolute;
    top: 42%;
    left: 50%;
    transform: translate(-50%, -50%);
    .cart-null {
      margin: 20px 0;
      text-align: center;
      i {
        font-size: 60px;
        color: #ddd;
      }
      .text {
        color: #ddd;
        font-size: 12px;
        padding: 0 0 15px;
      }
      .cart-button {
        color: #fff;
        background-color: #3cc591;
        border: 1px solid #3cc591;
      }
    }
  }
</style>
