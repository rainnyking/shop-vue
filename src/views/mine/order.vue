<template>
  <div class="order">
    <div class="order-header">
      <van-nav-bar
        title="我的订单"
        left-arrow
        @click-left="goback"
      />
    </div>
    <div class="order-content">
      <van-tabs v-model="active" swipeable sticky>
        <van-tab v-for="(item,index) in tabName" :title="item" :key="index">
          <div class="foods-box" v-if="index === '0'">
            <div class="cartOrder-null-pos" v-show="getOrderItems.length < 1">
              <div class="cartOrder-null-box">
                <div class="cartOrder-null">
                  <i class="iconfont icon-hezi401"></i>
                  <div class="text">您还没有该类型的订单哦~</div>
                  <van-button size="small" class="cart-button" @click="tolink('/home')">去逛逛</van-button>
                </div>
              </div>
            </div>
            <div class="foods-wrapper">
              <ul v-for="foods in getOrderItems" :key="foods.id">
                <li class="food-item border-1px" v-for="(food, index) in foods" :key="index" v-if="food.count > 0">
                  <div class="icon">
                    <img v-lazy="food.icon" :key="food.icon" width="57" height="57">
                  </div>
                  <div class="content">
                    <h2 class="name">
                      {{food.name}}
                      <span>× {{food.count}}</span>
                    </h2>
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}份</span>
                      <span >好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="foods-box" v-if="index === '1'">
            <div class="cartOrder-null-pos">
              <div class="cartOrder-null-box">
                <div class="cartOrder-null">
                  <i class="iconfont icon-hezi401"></i>
                  <div class="text">您还没有该类型的订单哦~</div>
                  <van-button size="small" class="cart-button" @click="tolink('/home')">去逛逛</van-button>
                </div>
              </div>
            </div>
          </div>
          <div class="foods-box" v-if="index === '2'">
            <div class="cartOrder-null-pos">
              <div class="cartOrder-null-box">
                <div class="cartOrder-null">
                  <i class="iconfont icon-hezi401"></i>
                  <div class="text">您还没有该类型的订单哦~</div>
                  <van-button size="small" class="cart-button" @click="tolink('/home')">去逛逛</van-button>
                </div>
              </div>
            </div>
          </div>
          <div class="foods-box" v-if="index === '3'">
            <div class="cartOrder-null-pos">
              <div class="cartOrder-null-box">
                <div class="cartOrder-null">
                  <i class="iconfont icon-hezi401"></i>
                  <div class="text">您还没有该类型的订单哦~</div>
                  <van-button size="small" class="cart-button" @click="tolink('/home')">去逛逛</van-button>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
// import BScroll from 'better-scroll'
import { mapGetters } from 'vuex'
export default {
  name: 'order',
  data () {
    return {
      active: 0,
      tabName: {
        '0': '全部订单',
        '1': '待付款',
        '2': '待收货',
        '3': '待评价'
      }
    }
  },
  mounted () {
    document.body.style.backgroundColor = '#f5f5f5'
    this.initActive()
    // console.log(this.getOrderItems)
  },
  destroyed () {
    document.body.style.backgroundColor = ''
  },
  computed: {
    ...mapGetters(['getOrderItems'])
  },
  methods: {
    initActive () {
      let id = this.$route.params.id
      this.active = id
      // if (!this.cartOrderScroll) {
      //   this.cartOrderScroll = new BScroll(this.$refs.foodsBox)
      // } else {
      //   this.cartOrderScroll.refresh()
      // }
    },
    goback () {
      this.$router.go(-1)
    },
    tolink (to) {
      this.$router.push(to)
    }
  }
}
</script>

<style lang="scss">
  .order {
    .order-header {
      .van-nav-bar {
        background-color: #3cc591;
        color: #fff;
        .van-icon {
          color: #fff;
        }
      }
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__line {
      height: 3px;
      background-color: #45cda2;
    }
    .van-tab__pane {
      position: relative;
    }
    .van-tabs__content {
    }
  }
</style>

<style lang="scss" scoped>
  @import "../../styles/mixins";
  .order {
    .order-content {
    }
    .foods-wrapper {
      flex: 1;
      background-color: #f5f5f5;
      .food-item {
        display: flex;
        padding: 18px 10px 18px;
        padding-bottom: 14px;
        margin-bottom: 10px;
        background-color: #fff;
        &:last-child {
          @include border-none();
          margin-bottom: 0;
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
            line-height: 10px;
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
            right: 0;
            bottom: 14px;
          }
        }
      }
    }
    .cartOrder-null-pos {
      position: fixed;
      top: 90px;
      bottom: 0;
      width: 100%;
      background-color: #fff;
      z-index: 2;
    }
    .cartOrder-null-box {
      position: absolute;
      top: 42%;
      left: 50%;
      transform: translate(-50%, -50%);
      .cartOrder-null {
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
  }
</style>
