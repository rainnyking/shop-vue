<template>
  <div class="food-bottom b-h-1px">
    <div class="bottom-item" @click="likeCurrt">
      <span v-if="!food.like || food.like === 0">
        <van-icon name="like-o" />
      </span>
      <span class="likecolor" v-else>
        <van-icon name="like" />
      </span>
    </div>
    <div class="bottom-item" @click="golink('/cart')">
      <span>
        <van-icon name="cart" />
        <div class="smalltext" v-show="cartCount > 0">{{cartCount}}</div>
      </span>
    </div>
    <div class="bottom-item-cart">
      <div v-show="!food.count || food.count === 0">
        <div @click="addCartFirst">加入购物车</div>
      </div>
      <div class="buyBox" v-show="food.count > 0">
        <div class="item jian" @click="reduce">
          <span class="iconfont icon-jianhao"></span>
        </div>
        <div class="item count">{{food.count}}</div>
        <div class="item add" @click="addCart">
          <span class="iconfont icon-jiahao"></span>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script>
import Bus from '../../common/bus'
import { mapGetters } from 'vuex'
export default {
  name: 'food-bottom',
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
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
  mounted () {
    Bus.$on('cartBall', el => {
      this.$nextTick(() => {
        this.drop(el.dom)
        this.innerImg = el.ico
      })
    })
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
    // 第一次点击加入购物车
    addCartFirst () {
      if (!this.food.count) {
        this.$set(this.food, 'count', 1)
      }
    },
    addCart () {
      if (!this.food.count) return
      this.food.count++
    },
    reduce () {
      if (!this.food.count) return
      this.food.count--
    },
    // 收藏
    likeCurrt () {
      if (!this.food.like || this.food.like === 0) {
        this.$set(this.food, 'like', 1)
        this.$toast({
          duration: 1000,
          position: 'bottom',
          message: '已收藏'
        })
      } else {
        this.food.like = 0
        this.$toast({
          duration: 1000,
          position: 'bottom',
          message: '已取消收藏'
        })
      }
    },
    golink (to) {
      this.$router.push(to)
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
          let x = rect.left - (window.innerWidth * 0.26)
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
  .food-bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    text-align: center;
    line-height: 50px;
    .bottom-item {
      flex: 1;
      line-height: 62px;
      color: #666;
      span {
        position: relative;
        &.likecolor {
          color: #f44;
        }
        i {
          font-size: 18px;
        }
        .smalltext{
          color: #fff;
          left: 100%;
          top: -.9em;
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
    }
    .bottom-item-cart {
      width: 62%;
      font-size: 16px;
      background-color: #00bd68;
      color: #fff;
      .buyBox {
        display: flex;
        align-items: center;
        .item {
          flex: 1;
          span {
            font-size: 20px;
          }
          &.count {
            width: 50px;
            background-color: #00af60;
          }
          &.jian,&.add {
            background-color: #rgba(0, 177, 97, 0.51);
          }
          &.jian:active,&.add:active {
            background-color: #00a75c;
          }
        }
      }
    }
  }
  .ball-container {
    .ball {
      position: fixed;
      left: 26%;
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
</style>
