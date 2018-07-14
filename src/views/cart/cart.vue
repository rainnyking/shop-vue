<template>
  <div class="cart-box">
    <div class="cart-header">
      <van-nav-bar
        title="购物车"
        right-text="清空"
        @click-right="empty"
      />
    </div>
    <div class="cart-null-box" v-show="cartFoodCount === 0">
      <div class="cart-null">
        <i class="iconfont icon-hezi401"></i>
        <div class="text">您还没有添加商品哦~</div>
        <van-button size="small" class="cart-button" @click="tolink('/home')">去逛逛</van-button>
      </div>
    </div>
    <div class="cart-food" ref="cartFood" v-show="cartFoodCount > 0">
      <ul style="padding: 10px 0 20px">
        <van-checkbox-group v-model="cartChooseResult">
        <li class="food-list food-list-hook" v-for="goods in getCartGoods" :key="goods.id">
          <ul class="li-ul">
              <van-checkbox
                v-for="(food, index) in goods.foods"
                v-if="food.count > 0"
                :key="index"
                :name="food"
              >
                <li class="food-item" @click.stop.prevent="gothink(goods.id, food.id)">
                  <div class="icon">
                    <img :src="food.icon" width="57" height="57">
                  </div>
                  <div class="content">
                    <h2 class="name">{{food.name}}</h2>
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}份</span>
                      <span >好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <ball-buy :food="food" @buyCartBall="buyballDom" :cartChooseResult="cartChooseResult">购物加减</ball-buy>
                    </div>
                  </div>
                </li>
              </van-checkbox>
            <!--<li-->
              <!--class="food-item"-->
              <!--v-for="(food, index) in goods.foods"-->
              <!--v-if="food.count > 0"-->
              <!--:key="index"-->
              <!--@click="gothink(goods.id, food.id)">-->
              <!--<div class="icon">-->
                <!--&lt;!&ndash;<img v-lazy="food.icon" :key="food.icon" width="57" height="57">&ndash;&gt;-->
                <!--<img :src="food.icon" width="57" height="57">-->
              <!--</div>-->
              <!--<div class="content">-->
                <!--<h2 class="name">{{food.name}}</h2>-->
                <!--<div class="extra">-->
                  <!--<span class="count">月售{{food.sellCount}}份</span>-->
                  <!--<span >好评率{{food.rating}}%</span>-->
                <!--</div>-->
                <!--<div class="price">-->
                  <!--<span class="now">￥{{food.price}}</span>-->
                  <!--<span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>-->
                <!--</div>-->
                <!--<div class="cartcontrol-wrapper">-->
                  <!--<ball-buy :food="food" @buyCartBall="buyballDom">购物加减</ball-buy>-->
                <!--</div>-->
              <!--</div>-->
            <!--</li>-->
          </ul>
        </li>
        </van-checkbox-group>
      </ul>
    </div>
    <div class="pei-money" v-show="cartFoodCount > 0 && resultPay < 19">
      <div class="pei-text">
        满 <span>￥{{minPrice}}</span> 元免配送费，还差 <span>￥{{woesePrice}}</span> 元
      </div>
    </div>
    <div class="cart-result" v-show="cartFoodCount > 0">
      <div class="result-box">
        <div class="left">
          <div class="result-count">
            <van-checkbox v-model="chosseResuleALL" v-on:change="chosseResuleALLZhi">已选 ( {{resultCount}} )</van-checkbox>
          </div>
          <div class="pay">
            ￥{{resultPay}}
          </div>
        </div>
        <div class="right" @click="resultBtn">
          去结算
        </div>
      </div>
      <order :cartOrder="cartChooseResult" ref="cartOrderVue"></order>
    </div>
  </div>
</template>

<script>
import order from './order'
import BScroll from 'better-scroll'
import ballBuy from '../buyBall/buyball'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'cart',
  data () {
    return {
      minPrice: 19,
      cartChooseResult: [],
      chosseResuleALL: false
    }
  },
  computed: {
    ...mapGetters(['getCartGoods', 'getCartlistData', 'getOrderItems']),
    cartFoodCount () {
      let zhi = 0
      this.getCartGoods.forEach(function (item) {
        item.foods.forEach(function (food) {
          if (food.count) {
            zhi += food.count
          }
        })
      })
      return zhi
    },
    // 已选总个数
    resultCount () {
      let rcount = 0
      this.cartChooseResult.forEach(function (food) {
        rcount += food.count
      })
      return rcount
    },
    // 已选的价格总和
    resultPay () {
      let rPay = 0
      this.cartChooseResult.forEach(function (food) {
        rPay += food.count * food.price
      })
      return Math.round(parseFloat(rPay) * 100) / 100 // 取小数点后两位
    },
    woesePrice () {
      let zhi = this.minPrice - this.resultPay
      return Math.round(parseFloat(zhi) * 100) / 100
    }
  },
  mounted () {
    this.getCartFood()
  },
  methods: {
    ...mapActions(['getCartlistDataFun', 'setOrderItems']),
    buyballDom (msg) {
      this.$emit('cartBall', msg)
    },
    empty () {
      if (this.cartFoodCount < 1) return
      this.$dialog.confirm({
        title: '温馨提示',
        message: '真的要清空购物车吗？',
        cancelButtonText: '再想想',
        closeOnClickOverlay: true
      }).then(() => {
        // on confirm
        this.getCartGoods.forEach(function (item) {
          item.foods.forEach(function (food) {
            if (food.count) {
              food.count = 0
            }
          })
        })
        this.cartChooseResult = []
      }).catch(() => {
        // on cancel
      })
    },
    getCartFood () {
      let _this = this
      this.$nextTick(function () {
        _this.cartScroll()
      })
      this.cartChooseResult = []
      this.getCartlistDataFun()
    },
    chosseResuleALLZhi () {
      if (this.chosseResuleALL === true) {
        this.cartChooseResult = this.getCartlistData
      } else {
        // 判断如果全选中的商品等于购物车的商品就清空
        if (this.cartChooseResult.length === this.getCartlistData.length) {
          this.cartChooseResult = []
        }
      }
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
      if (!event._constructed && !event.forwardedTouchEvent) { return }
      this.$router.push({
        path: '/food',
        query: {
          pid: pid,
          id: id
        }
      })
    },
    tolink (to) {
      this.$router.replace(to)
    },
    resultBtn () {
      // console.log(this.getCartlistData)
      if (this.resultCount < 1) {
        this.$toast({
          duration: 1000,
          position: 'bottom',
          message: '请您选择商品'
        })
      } else {
        this.$refs.cartOrderVue.show()
      }

      // this.cartChooseResult.forEach((item) => {
      //   item.count = 0
      // })
      // console.log(this.cartChooseResult)
    }
  },
  watch: {
    '$route': 'getCartFood', // 监听路由重新加载滚动的dom，这样购物车的商品才不会不滚动
    'cartChooseResult': function () {
      if (this.cartChooseResult.length === this.getCartlistData.length) {
        this.chosseResuleALL = true
      } else {
        this.chosseResuleALL = false
      }
    }
  },
  components: {
    ballBuy, order
  }
}
</script>
<style lang="scss">
  .van-toast--bottom {
    top: auto;
    bottom: 18%;
  }
</style>
<style lang="scss">
  .cart-box {
    .van-nav-bar__right {
      .van-nav-bar__text {
        color: #fff;
        &:active {
          background-color: #37bd8a;
        }
      }
    }
    .li-ul {
      .van-checkbox {
        .van-checkbox__label {
          flex: 1;
          line-height: normal;
          margin-left: 5px;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../styles/mixins";
.cart-box {
  .pei-money {
    position: fixed;
    width: 100%;
    bottom: 98px;
    z-index: 2;
    text-align: center;
    .pei-text {
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      background-color: #fff7cc;
      color: #333;
      span {
        color: #f60;
      }
    }
  }
  .cart-header {
    .van-nav-bar {
      background-color: #3cc591;
      color: #fff;
    }
  }
  .cart-null-box {
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
  .cart-food {
    position: absolute;
    top: 46px;
    width: 100%;
    bottom: 98px;
    flex: 1;
    overflow: hidden;
    background-color: #f8f8f8;
    .li-ul {
      .van-checkbox {
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 0 10px 0 15px;
        margin-bottom: 10px;
        .van-checkbox__label {
          flex: 1;
          .food-item {
            display: flex;
            padding: 18px 10px;
            background-color: #fff;
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
                right: 5px;
                bottom: 14px;
              }
            }
          }
        }
      }
    }
  }
  .cart-result {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 50px;
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
        line-height: 48px;
        padding: 0 15px;
        .result-count {
          flex: 1;
        }
        .pay {
          width: 50px;
          font-weight: 700;
          text-align: right;
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
