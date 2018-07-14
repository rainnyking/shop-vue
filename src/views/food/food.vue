<template>
  <div>
    <div class="food">
      <div class="foodHeader" :class="{active:headerActive}">
        <div class="left">
          <div class="goback" @click="goback">
            <van-icon name="arrow-left" />
          </div>
        </div>
        <div class="title">
          <div class="img-box">
            <img :src="food.icon">
          </div>
        </div>
        <div class="right"></div>
      </div>
      <div class="food-content" ref="foodContent">
        <div class="food-box">
          <div class="food-image-banner">
            <van-swipe :autoplay="3000">
              <van-swipe-item v-for="(item, index) in food.image" :key="index">
                <img v-lazy="item" :key="item" />
              </van-swipe-item>
            </van-swipe>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="small-des" v-if="food.info">
              {{food.info}}
            </div>
            <!--<div class="detail">-->
              <!--<span class="sell-count">月售{{food.sellCount}}份</span>-->
              <!--<span class="rating">好评率{{food.rating}}%</span>-->
            <!--</div>-->
            <div class="price">
              <span class="now"><i>￥</i>{{food.price}}</span>
              <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="three-sell">
              <div class="item">
                <span><i class="iconfont icon-gouwu"></i></span>
                <span class="text">￥{{food.price}}/{{food.unit}}</span>
              </div>
              <div class="item">
                <span><i class="iconfont icon-shuye"></i></span>
                <span class="text">月售{{food.sellCount}}份</span>
              </div>
              <div class="item">
                <span><i class="iconfont icon-haopingganxie"></i></span>
                <span class="text">好评率{{food.rating}}%</span>
              </div>
            </div>
          </div>
          <split>间隔</split>
          <div class="info" v-if="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split>间隔</split>
          <div class="food-more">
            <div class="food-title b-t-1px">
              <span>更多选择</span>
            </div>
            <div class="goods-box">
              <van-row gutter="20">
                <van-col span="8" v-for="(item,index) in foodList.foods" v-if="index < 6 && item.id !== $route.query.id" :key="index">
                  <div class="goods-item" @tap.stop.prevent="goOther(foodList.id, item.id)">
                    <div class="foods-img-box">
                      <img v-lazy="item.icon">
                    </div>
                    <div class="title">{{item.name}}</div>
                    <div class="money">
                      <div class="pice-box">
                        <span class="samll">￥</span>
                        <span class="pice">{{item.price}}</span>
                        <span class="samll unit">/{{item.unit}}</span>
                      </div>
                      <div class="buy-box" @tap.stop.prevent="buyCart(item, $event)">
                        <div class="buy"><van-icon name="cart" /></div>
                      </div>
                    </div>
                    <!--<buy-ball :food="food" ref="cartFood" >添加加减按钮</buy-ball>-->
                  </div>
                </van-col>
              </van-row>
            </div>
          </div>
          <!--<split>间隔</split>-->
          <!--<div class="rating">-->
            <!--<h1 class="title">商品评价</h1>-->
            <!--<div class="rating-wrapper">-->
              <!--<ul style="">-->
                <!--<li class="rating-item border-1px">-->
                  <!--<div class="user"><span class="name">3******c</span>-->
                    <!--<img width="12" height="12" src="http://static.galileo.xiaojukeji.com/static/tms/default_header.png" class="avatar">-->
                  <!--</div>-->
                  <!--<div class="time">2016-07-23 21:52</div>-->
                  <!--<p class="text"><span class="icon-thumb_up"></span>很喜欢的粥-->
                  <!--</p>-->
                <!--</li>-->
                <!--<li class="rating-item border-1px" style="display: none;">-->
                  <!--<div class="user"><span class="name">2******3</span> <img width="12" height="12" src="http://static.galileo.xiaojukeji.com/static/tms/default_header.png" class="avatar"></div>-->
                  <!--<div class="time">2016-07-23 18:54</div>-->
                  <!--<p class="text"><span class="icon-thumb_up"></span>-->
                  <!--</p>-->
                <!--</li>-->
                <!--<li class="rating-item border-1px" style="display: none;">-->
                  <!--<div class="user"><span class="name">3******b</span> <img width="12" height="12" src="http://static.galileo.xiaojukeji.com/static/tms/default_header.png" class="avatar"></div>-->
                  <!--<div class="time">2016-07-23 16:19</div>-->
                  <!--<p class="text"><span class="icon-thumb_down"></span>-->
                  <!--</p>-->
                <!--</li>-->
              <!--</ul>-->
              <!--<div class="no-rating" style="display: none;">暂无评价</div>-->
            <!--</div>-->
          <!--</div>-->
          <!--<split>间隔</split>-->
        </div>
      </div>
    </div>
    <food-bottom :food="food">加入购物车</food-bottom>
  </div>
</template>

<script>
import Bus from '../common/bus'
import foodBottom from './children/foodBottom'
import split from '../split/split'
import BScroll from 'better-scroll'
import buyBall from '../buyBall/buyball'
import { mapGetters } from 'vuex'
export default {
  name: 'food',
  data () {
    return {
      food: {},
      foodList: {},
      scrollY: ''
    }
  },
  computed: {
    ...mapGetters(['getFoodContent', 'getFoodList']),
    headerActive () {
      if (this.scrollY < -10) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.getFoodListData()
  },
  methods: {
    getFoodListData () {
      let _this = this
      let uid = this.$route.query.id
      let pid = this.$route.query.pid
      this.foodList = this.getFoodList(pid)
      // this.foodList.foods.forEach(function (item) {
      //   if (parseInt(item.id) === parseInt(uid)) {
      //     _this.food = item
      //   }
      // })
      this.food = this.getFoodContent(uid)
      this.$nextTick(function () {
        _this.initScroll()
      })
    },
    initScroll () {
      this.foodContentScroll = new BScroll(this.$refs.foodContent, {
        // click: true,
        tap: 'goOther,buyCart',
        probeType: 3
      })
      let _this = this
      this.foodContentScroll.on('scroll', function (pos) {
        _this.scrollY = Math.round(pos.y)
        // console.log(_this.scrollY)
      })
    },
    gothink (to) {
      this.$router.push(to)
    },
    goOther (pid, id) {
      this.$router.replace({
        path: '/food',
        query: {
          pid: pid,
          id: id
        }
      })
    },
    buyCart (food, event) {
      console.log(food)
      if (!food.count) {
        this.$set(food, 'count', 1)
      } else {
        food.count++
      }
      Bus.$emit('cartBall', {dom: event.target, ico: food.icon})
      // console.log(food.count)
    },
    goback () {
      this.$router.go(-1)
    }
  },
  watch: {
    '$route': 'getFoodListData'
  },
  components: {
    buyBall, split, foodBottom
  }
}
</script>
<style lang="scss">
  .van-toast--bottom {
    top: auto;
    bottom: 18%;
  }
</style>
<style lang="scss" scoped>
  @import "../../styles/mixins";
  .food {
    .foodHeader {
      display: flex;
      height: 46px;
      align-items: center;
      text-align: center;
      line-height: 46px;
      padding: 0 15px;
      transition: opacity .5s;
      .title {
        width: 70%;
        .img-box {
          display: none;
          width: 32px;
          height: 32px;
          vertical-align: middle;
          img {
            display: block;
            width: 100%;
          }
        }
      }
      .left{
        flex: 1;
        text-align: left;
        .goback {
          display: inline-block;
          width: 32px;
          height: 32px;
          color: #fff;
          line-height: 38px;
          text-align: center;
          border-radius: 50%;
          vertical-align: middle;
          background: rgba(0, 0, 0, 0.36);
        }
      }
      .right {
        flex: 1;
      }
      &.active {
        background-color: rgba(244, 244, 244, 0.81);
        .title {
          width: 70%;
          .img-box {
            display: inline-block
          }
        }
        .left {
          .goback {
            background-color: rgba(255, 255, 255, 0);
            color: rgb(93, 99, 110);
          }
        }
      }
    }
    .food-content {
      position: absolute;
      top: 0;
      bottom: 50px;
      width: 100%;
      overflow: hidden;
      z-index: -1;
      .food-box {
        .food-image-banner {
          position: relative;
          img {
            display: block;
            width: 100%;
          }
          .back {
            position: absolute;
            top: 10px;
            left: 0;
            .icon-arrow_lift {
              display: block;
              padding: 10px;
              font-size: 20px;
              color: #fff;
            }
          }
        }
        .image-header {
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 100%;
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
        .content {
          padding: 18px;
          position: relative;
          .title {
            line-height: 18px;
            font-size: 22px;
            font-weight: normal;
            color: #07111b;
            text-align: center;
            margin: 6px 0;
            margin-bottom: 12px;
          }
          .small-des {
            font-size: 12px;
            text-align: center;
            color: rgb(147, 153, 159);
            margin-bottom: 15px;
          }
          .detail {
            margin-bottom: 18px;
            line-height: 10px;
            height: 10px;
            font-size: 0;
            text-align: center;
            .sell-count, .rating {
              font-size: 10px;;
              color: rgb(147, 153, 159);
            }
            .sell-count {
              margin-right: 12px;
            }
          }
          .price {
            font-weight: 700;
            line-height: 30px;
            text-align: center;
            .now {
              font-size: 30px;
              color: #FF9800;
              i {
                font-size: 12px;
                font-style: normal;
              }
            }
            .old {
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 12px;
            bottom: 12px;
          }
          .three-sell {
            display: flex;
            align-items: center;
            width: 80%;
            text-align: center;
            margin: 10px auto;
            color: #93999f;
            .item {
              flex: 1;
              span {
                display: block;
                margin-bottom: 2px;
                i{
                  font-size: 20px;
                }
                &.text {
                  font-size: 12px;
                }
              }
            }
          }
          .buy {
            position: absolute;
            right: 18px;
            bottom: 18px;
            z-index: 10;
            height: 24px;
            line-height: 24px;
            padding: 0 12px;
            box-sizing: border-box;
            border-radius: 12px;
            font-size: 10px;
            color: #fff;
            background: #17b356;
            &.fade-enter-active, &.fade-leave-active {
              transition: opacity .5s
            }
            &.fade-enter, &.fade-leave-active {
              opacity: 0
            }
          }
        }
        .info {
          padding: 18px;
          .title {
            line-height: 14px;
            margin-bottom: 6px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .text {
            line-height: 24px;
            padding: 0 8px;
            font-size: 12px;
            color: rgb(77, 85, 93);
          }
        }
        .rating {
          padding-top: 18px;
          .title {
            line-height: 14px;
            margin-left: 18px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .rating-wrapper {
            padding: 0 18px;
            .rating-item {
              position: relative;
              padding: 16px 0;
              @include border-1px(rgba(7, 17, 27, .1));
              .user {
                position: absolute;
                right: 0;
                top: 16px;
                line-height: 12px;
                font-size: 0;
                .name {
                  display: inline-block;
                  vertical-align: top;
                  margin-right: 6px;
                  font-size: 10px;
                  color: rgb(147, 153, 159);
                }
                .avatar {
                  border-radius: 50%;
                }
              }
              .time {
                margin-bottom: 6px;
                line-height: 12px;
                font-size: 10px;
                color: rgb(147, 153, 159);
              }
              .text {
                line-height: 16px;
                font-size: 12px;
                color: rgb(7, 17, 27);
                .icon-thumb_up, .icon-thumb_down {
                  margin-right: 4px;
                  line-height: 16px;
                  font-size: 12px;
                }
                .icon-thumb_up {
                  color: rgb(0, 160, 220);
                }
                .icon-thumb_down {
                  color: rgb(147, 153, 159);
                }
              }
            }
            .no-rating {
              padding: 16px 0;
              font-size: 12px;
              color: rgb(147, 153, 159);
            }
          }
        }
      }
    }
    .food-more {
      .food-title {
        position: relative;
        font-size: 14px;
        text-align: center;
        color: #17b356;
        margin-bottom: 10px;
        span {
          display: inline-block;
          height: 44px;
          line-height: 46px;
          padding: 0 10px;
          border-bottom: 2px solid #17b356;
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
  }
</style>
