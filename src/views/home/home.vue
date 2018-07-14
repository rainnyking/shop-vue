<template>
  <div class="home">
    <div class="bannerbox">
      <search-box>搜索</search-box>
      <div class="banner-back">
        <img :src="bannerbg">
      </div>
    </div>
    <div class="home-main-content" ref="homeGoods">
      <div class="content-ul">
        <div class="newbanner">
          <van-swipe :autoplay="5000" @change="bannerChange">
            <van-swipe-item v-for="(item,index) in seller.banner" :key="index">
              <div class="banner-item">
                <div class="img-box" v-lazy:background-image="item">
                  <img :src="item">
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
        <div class="banner-bottom" :class="{active:bannerText}">
          <van-row>
            <van-col span="8" v-for="item in tipItems" :key="item.id">
              <div class="bottom-item">
                <i :class="item.ico"></i>
                <span>{{ item.title }}</span>
              </div>
            </van-col>
          </van-row>
        </div>
        <!--<div class="title-type">-->
          <!--<span class="text">每日特辑</span>-->
          <!--<span class="des">SPECIAL ALBUM</span>-->
        <!--</div>-->
        <div class="pro-home">
          <div class="home-item" v-for="(item, index) in getCartGoods" :key="index">
            <div class="content">
              <div class="header" v-lazy:background-image="item.img">
                <img :src="item.img">
              </div>
              <div class="goods-box">
                <van-row gutter="20">
                  <van-col span="8" v-for="(food,index) in item.foods" :key="index">
                    <div class="goods-item" @tap.stop.prevent="gothink(item.id, food.id)">
                      <div class="foods-img-box">
                        <img v-lazy="food.icon">
                      </div>
                      <div class="title">{{food.name}}</div>
                      <div class="money">
                        <div class="pice-box">
                          <span class="samll">￥</span>
                          <span class="pice">{{food.price}}</span>
                          <span class="samll unit">/{{food.unit}}</span>
                        </div>
                        <div class="buy-box" @tap.stop.prevent="buyCart(food, $event)">
                          <div class="buy"><van-icon name="cart" /></div>
                        </div>
                      </div>
                      <!--<buy-ball :food="food" ref="cartFood" >添加加减按钮</buy-ball>-->
                    </div>
                  </van-col>
                </van-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getDataGoodsApi } from '@/utils/api'
import { mapGetters, mapActions } from 'vuex'
import searchBox from '../search/search'
import buyBall from '../buyBall/buyball'
export default {
  name: 'home',
  data () {
    return {
      seller: {},
      // goods: [],
      bannerbg: '',
      tipItems: [
        {ico: 'iconfont icon-shuye', title: '新鲜食材'},
        {ico: 'iconfont icon-lightning', title: '快速送达'},
        {ico: 'iconfont icon-huodongzhongxin', title: '优惠多多'}
      ],
      scrollY: ''
    }
  },
  created () {
    this.getData()
  },
  // activated () {
  //   this.getData()
  // },
  computed: {
    ...mapGetters(['getCartGoods']),
    bannerText () {
      if (this.scrollY < -40) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions(['setCartGoods']),
    getData () {
      this.setCartGoods()
      getDataGoodsApi().then(res => {
        res = res.data
        this.seller = res.seller
        this.bannerbg = this.seller.banner[0]
        // let oldGoodsData = this.getCartGoods
        // let newGoodsData = []
        // if (oldGoodsData.length > 0) {
        //   res.goods.forEach(function (item, index) {
        //     item.foods.forEach(function (food, findex) {
        //       if (oldGoodsData[index].foods[findex].count) {
        //         food.count = oldGoodsData[index].foods[findex].count
        //       }
        //     })
        //   })
        //   newGoodsData = res.goods
        // } else {
        //   newGoodsData = res.goods
        // }
        // this.setCartGoods(newGoodsData)
        this.$nextTick(() => {
          this._initScroll()
        })
      }, res => {
        console.info('调用失败')
      })
    },
    _initScroll () {
      if (!this.goodsScroll) {
        this.goodsScroll = new BScroll(this.$refs.homeGoods, {
          // click: true,
          // wheelWrapperClass: true,
          tap: 'gothink,buyCart',
          probeType: 3
        })
      } else {
        this.goodsScroll.refresh()
      }
      let _this = this
      this.goodsScroll.on('scroll', function (pos) {
        _this.scrollY = Math.round(pos.y)
      })
    },
    bannerChange (index) {
      // console.log(typeof (index)) // index 为数字类型
      // console.log(index)
      this.bannerbg = this.seller.banner[index]// 两者相等要转成同类型
    },
    buyCart (food, event) {
      // console.log(food)
      if (!food.count) {
        this.$set(food, 'count', 1)
      } else {
        food.count++
      }
      this.$emit('cartBall', {dom: event.target, ico: food.icon})
      // console.log(food.count)
    },
    gothink (pid, id) {
      // console.log(id)
      // console.log(pid)
      this.$router.push({
        path: '/food',
        query: {
          pid: pid,
          id: id
        }
      })
    }
  },
  watch: {
    // 'bannerItemsIndex' (newVal, oldVal) {
    //   if (!oldVal) {
    //     return 0
    //   } else {
    //     return newVal
    //   }
    // }
    // '$route': 'getData'
  },
  components: {
    buyBall, searchBox
  }
}
</script>

<style lang="scss" scoped>
.home {
  .bannerbox {
    .banner-back {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 26%;
      overflow: hidden;
      z-index: -1;
      img {
        width: 120%;
        height: 110%;
        filter: blur(8px);
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .banner-item {
    padding: 0px 12px 0;
    position: relative;
    .img-box {
      border-radius: 5px;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
      }
      &[lazy="error"] {
        width: 100%;
        height: 140px;
        background-position: center center;
        background-size: 75%;
      }
    }
  }
  .home-main-content {
    position: absolute;
    top: 46px;
    bottom: 50px;
    width: 100%;
    overflow: hidden;
  }
  .banner-bottom {
    text-align: center;
    font-size: 12px;
    padding: 10px 10px;
    color: rgb(51, 51, 51);
    font-weight: 200;
    &.active {
      color: #fff;
    }
  }
  .title-type {
    height: 18px;
    padding: 16px 15px 6px;
    background-color: rgb(244, 244, 244);
    .text {
      margin-right: 8px;
      color: rgb(51, 51, 51);
      font-size: 18px;
      font-weight: 700;
    }
    .des {
      font-size: 12px;
      color: rgb(153, 153, 153);
    }
  }
  .home-item {
    padding: 6px 6px 0;
    background-color: rgb(244, 244, 244);
    .content {
      width: 100%;
      border-radius: 5px;
      background-color: #fff;
      overflow: hidden;
      .header {
        img {
          display: block;
          width: 100%;
        }
        &[lazy="error"] {
          width: 100%;
          height: 114px;
          background-position: center center;
          background-size: 75%;
          border-bottom: 1px solid #f6f6f6;
        }
      }
      .goods-box {
        padding: 0.5px 10.5px 10px;
        .goods-item {
          .foods-img-box {
            padding: 8px;
            img {
              width: 100%;
              display: block;
            }
            img[lazy=loading] {
              width: 100%;
              display: block;
              /*your style here*/
            }
            img[lazy=error] {
              width: 100%;
              display: block;
              /*your style here*/
            }
            img[lazy=loaded] {
              width: 100%;
              display: block;
              /*your style here*/
            }
          }
          .title {
            max-height: 20px;
            line-height: 16px;
            font-size: 12px;
            color: #333333;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .money {
            font-size: 14px;
            text-align: center;
            padding: 8px 0px;
            color: #FF9800;
            display: flex;
            align-items: center;
            .pice-box {
              text-align: left;
              flex: 1;
              font-size: 14px;
              .samll{
                font-size: 10px;
                &.unit {
                  margin-left: -3px;
                }
              }
              .pice {
                margin-left: -3px;
                font-weight: bold;
              }
            }
          }
          .buy-box {
            padding: 2px;
            .buy {
              width: 22px;
              height: 22px;
              line-height: 27px;
              border-radius: 50%;
              font-size: 11px;
              text-align: center;
              text-align: center;
              color: #fff;
              background: #17b356;
            }
          }
        }
      }
    }
    &:last-child{
      padding-bottom: 6px;
    }
  }
}
</style>
