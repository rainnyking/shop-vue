<template>
  <div class="cart-order" v-show="cartOrderShow">
    <div class="cart-order-header">
      <div class="cart-header">
        <van-nav-bar
          title="订单配送至"
          left-arrow
          @click-left="goback"
        />
      </div>
      <div class="header-top">
        <div class="text">{{list.address}}</div>
        <div class="small-text">
          <span>{{list.name}} {{list.tel}}</span>
        </div>
      </div>
    </div>
    <div class="cart-order-content" ref="cartOrderContent">
      <div class="main">
        <div class="item">
          <van-cell title="商品" :value="allCount + ' 件'" />
          <div class="foods-wrapper">
            <ul style="padding-top: 18px">
              <li class="food-item border-1px" v-for="(food, index) in cartOrder" :key="index" v-if="food.count > 0">
                <div class="icon">
                  <img v-lazy="food.icon" :key="food.icon" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">
                    {{food.name}}
                    <span>× {{food.count}}</span>
                  </h2>
                  <!--<p class="desc" v-if="food.description">{{food.description}}</p>-->
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
        <div class="item">
          <van-cell-group>
            <van-cell title="总价" :value="'￥'+allMoney" />
            <van-cell title="配送费" :value="'￥'+peiMoney" />
            <van-cell title="合计" :value="'￥'+resultMoney" />
          </van-cell-group>
        </div>
      </div>
    </div>
    <div class="cart-result">
      <div class="result-box">
        <div class="left">
          <div class="pay">
            合计 <span>￥{{resultMoney}}</span>
          </div>
        </div>
        <div class="right" @click="resultButton">
          去支付
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BScroll from 'better-scroll'
export default {
  name: 'order',
  props: {
    cartOrder: {
      type: Array
    }
  },
  data () {
    return {
      list: {
        id: '2',
        name: '李四',
        tel: '1310000000',
        address: '浙江省杭州市拱墅区莫干山路 50 号'
      },
      cartOrderShow: false
    }
  },
  mounted () {
    this.initCartOrder()
  },
  computed: {
    ...mapGetters(['getOrderItems']),
    allCount () {
      let zhi = 0
      this.cartOrder.forEach((item) => {
        zhi += item.count
      })
      return zhi
    },
    allMoney () {
      let money = 0
      this.cartOrder.forEach((item) => {
        money += item.count * item.price
      })
      return Math.round(parseFloat(money) * 100) / 100
    },
    peiMoney () {
      if (this.allMoney < 19) {
        return 4
      } else {
        return 0
      }
    },
    resultMoney () {
      let zhi = this.allMoney + this.peiMoney
      return Math.round(parseFloat(zhi) * 100) / 100
    }
  },
  methods: {
    ...mapActions(['setOrderItems']),
    show () {
      this.cartOrderShow = true
      // console.log(this.cartOrder)
    },
    goback () {
      this.cartOrderShow = false
    },
    initCartOrder () {
      if (!this.cartContentScroll) {
        this.cartContentScroll = new BScroll(this.$refs.cartOrderContent, {
          clikc: true
        })
      } else {
        this.cartContentScroll.refresh()
      }
    },
    resultButton () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定支付' + this.resultMoney + '元',
        closeOnClickOverlay: true
      }).then(() => {
        let orderList = []
        this.cartOrder.forEach((item) => {
          if (item.count > 0) {
            orderList.push(JSON.parse(JSON.stringify(item))) // 深浅拷贝
          }
        })
        this.setOrderItems(orderList)
        this.cartOrder.forEach((item) => {
          item.count = 0
        })
        this.cartOrderShow = false
      }).catch(() => {
        // on cancel
      })
    }
  },
  components: {
  }
}
</script>

<style lang="scss">
  .cart-order {
    .cart-header {
      .van-nav-bar {
        background-color: #3cc591;
        color: #fff;
        .van-icon {
          color: #fff;
        }
      }
      .van-hairline--bottom::after{
        border-bottom-width: 0px;
      }
    }
    .van-cell:not(:last-child)::after {
      left: 10px;
      right: 10px;
    }
    .van-cell {
      padding: 15px;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../styles/mixins";
  .cart-order-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .cart-order {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #fafafa;
    z-index: 3;
    .header-top {
      background-color: #3cc591;
      text-align: center;
      color: #fff;
      padding: 0 0 10px;
      .text {
        font-size: 16px;
        font-weight: 700;
      }
      .small-text {
        font-size: 14px;
        line-height: 24px;
      }
    }
    .cart-order-content {
      position: absolute;
      top: 103px;
      bottom: 48px;
      width: 100%;
      overflow: hidden;
    }
    .main {
      .item {
        margin-bottom: 10px;
        .van-hairline--top-bottom::after {
          border-width: 0px 0;
        }
      }
    }
    .foods-wrapper {
      flex: 1;
      background-color: #fff;
      .food-item {
        display: flex;
        margin: 0 10px 18px;
        padding-bottom: 14px;
        @include border-1px(rgba(7, 17, 27, .1));
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
    .cart-result {
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 0px;
      height: 48px;
      .result-box {
        display: flex;
        align-items: center;
        width: 100%;
        .left {
          flex: 1;
          display: flex;
          align-items: center;
          background-color: #424242;
          color: #fff;
          font-size: 12px;
          line-height: 47px;
          padding: 0 15px;
          .pay {
            flex: 1;
            font-weight: 700;
            text-align: left;
            span {
              font-size: 16px;
            }
          }
        }
        .right {
          width: 105px;
          line-height: 48px;
          font-size: 14px;
          font-weight: 700;
          background-color: #ffa100;
          text-align: center;
          color: #fff;
        }
      }
    }
  }
</style>
