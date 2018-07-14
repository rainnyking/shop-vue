<template>
  <div class="wap">
    <keep-alive>
      <router-view @cartBall="cartBallFun"></router-view>
    </keep-alive>
    <div class="ball-container">
      <div v-for="ball in balls" :key="ball.id">
        <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook">
              <img :src="innerImg">
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="fotterBox b-h-1px">
      <ul class="tab">
        <router-link to="/home" tag="li" replace class="tab-item" active-class="active">
          <div class="icon">
            <van-icon name="home" />
          </div>
          <div class="text">首页</div>
        </router-link>
        <router-link to="/class" tag="li" replace class="tab-item" active-class="active">
          <div class="icon">
            <van-icon name="more-o" />
          </div>
          <div class="text">分类</div>
        </router-link>
        <router-link to="/cart" tag="li" replace class="tab-item" active-class="active">
          <div class="icon">
            <van-icon name="cart" />
            <div class="smalltext">{{ cartCount === 0 ? '': cartCount }}</div>
          </div>
          <div class="van-tabbar-item__text">购物车</div>
        </router-link>
        <router-link to="/mine" tag="li" replace class="tab-item" active-class="active">
          <div class="icon">
            <van-icon name="contact" />
          </div>
          <div class="text">我的</div>
        </router-link>
      </ul>
    </div>
    <!--<van-tabbar v-model="menuActive">-->
      <!--<van-tabbar-item icon="home" to="/home" replace>首页</van-tabbar-item>-->
      <!--<van-tabbar-item icon="more-o" to="/class" replace>分类</van-tabbar-item>-->
      <!--<van-tabbar-item icon="cart" to="/cart" :info="cartCount === 0 ? '': cartCount" replace>购物车</van-tabbar-item>-->
      <!--<van-tabbar-item icon="contact" to="/mine" replace>我的</van-tabbar-item>-->
    <!--</van-tabbar>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'layout',
  data () {
    return {
      menuActive: 0,
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      innerImg: ''
    }
  },
  computed: {
    ...mapGetters(['getCartGoods']),
    cartCount () {
      let zhi = 0
      this.getCartGoods.forEach(function (item) {
        item.foods.forEach(function (food) {
          if (food.count) {
            zhi += food.count
          }
        })
      })
      return zhi
    }
  },
  methods: {
    cartBallFun (msg) {
      // console.log(msg.dom)
      this.drop(msg.dom)
      this.innerImg = msg.ico
    },
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          // 保存el
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeEnter (el) {
      // console.log(el)
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          // getBoundingClientRect 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - (window.innerWidth * 0.6)
          let y = -(window.innerHeight - rect.top - 22)

          el.style.display = ''

          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`

          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    },
    enter (el) {
      /* 触发浏览器重绘 */
      let rf = el.offsetHeight
      console.log(rf)
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'

        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translate3d(0, 0, 0)'
      })
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixins";
.wap {
  .van-tabbar-item--active {
    color: #17b356;
  }
  .ball-container {
    .ball {
      position: fixed;
      left: 60%;
      bottom: 22px;
      z-index: 200;
      .inner {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        img {
          display: block;
          width: 100%;
          vertical-align: center;
          border-radius: 50%;
          border: 2px solid #17b356;
        }
      }
      &.drop-enter-active {
        transition: all .4s cubic-bezier(.49, -0.29, .75, .41);
        .inner {
          transition: all .4s linear;
        }
      }
    }
  }
  .fotterBox {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    height: 50px;
    .tab {
      display: flex;
      align-items: center;
      .tab-item {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        color: #666;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        line-height: 1;
        font-size: 12px;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        height: 50px;
        .icon {
          font-size: 18px;
          margin:2px 0;
          position: relative;
          .smalltext {
            color: #fff;
            left: 100%;
            top: -.5em;
            font-size: .5em;
            padding: 0 .3em;
            text-align: center;
            min-width: 1.2em;
            line-height: 1.2;
            position: absolute;
            border-radius: .6em;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            background-color: #f44;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
            font-family: PingFang SC,Helvetica Neue,Arial,sans-serif;
          }
        }
        &.active {
          color: #17b356;
        }
      }
    }
  }
}
</style>
