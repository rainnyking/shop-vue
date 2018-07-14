<template>
  <div class="classification">
    <div class="top">
      <search-box>搜索</search-box>
    </div>
    <div class="class-content">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li class="menu-item"
              v-for="(item, index) in getCartGoods"
              :key="index"
              :class="{'current': index === currentIndex}"
              @click="foodScorllTo(index)">
            <span class="text border-1px">
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodWrapper">
        <ul>
          <li class="food-list food-list-hook" v-for="goods in getCartGoods" :key="goods.id">
            <h1 class="title">{{goods.name}}</h1>
            <ul>
              <li class="food-item border-1px" v-for="(food, index) in goods.foods" :key="index" @click="gothink(goods.id, food.id)">
                <div class="icon">
                  <img v-lazy="food.icon" :key="food.icon" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc" v-if="food.description">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span >好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <ball-buy :food="food" @buyCartBall="buyballDom">购物加减</ball-buy>
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
import BScroll from 'better-scroll'
import { mapGetters, mapActions } from 'vuex'
import searchBox from '../search/search'
import ballBuy from '../buyBall/buyball'
export default {
  name: 'class',
  data () {
    return {
      foodHeight: [],
      scorllY: ''
    }
  },
  mounted () {
    this.getFoodList()
    // console.log(this.getCartGoods)
  },
  computed: {
    ...mapGetters(['getCartGoods']),
    currentIndex () {
      for (let i = 0; i < this.foodHeight.length; i++) {
        let firstHeight = this.foodHeight[i]
        let secHeight = this.foodHeight[i + 1]
        if (!secHeight || (this.scorllY >= firstHeight && this.scorllY < secHeight)) {
          return i
        }
      }
      return 0
    }
  },
  methods: {
    ...mapActions(['setCartGoods']),
    buyballDom (msg) {
      this.$emit('cartBall', msg)
    },
    getFoodList () {
      this.setCartGoods()
      this.$nextTick(() => {
        this.initScorll()
      })
    },
    initScorll () {
      this.menuScorll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      if (!this.foodScorll) {
        this.foodScorll = new BScroll(this.$refs.foodWrapper, {
          click: true,
          probeType: 3
        })
      } else {
        this.foodScorll.refresh()
      }
      this.heightList()
      let _this = this
      this.foodScorll.on('scroll', function (pos) {
        _this.scorllY = Math.abs(Math.round(pos.y))
      })
    },
    heightList () {
      let liDom = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      let heightSun = 0
      this.foodHeight.push(heightSun)
      for (let i = 0; i < liDom.length; i++) {
        let heightItem = liDom[i].offsetHeight
        heightSun += heightItem
        this.foodHeight.push(heightSun)
      }
      // console.log(this.foodHeight)
    },
    foodScorllTo (index) {
      let liDom = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      this.foodScorll.scrollToElement(liDom[index], 300)
    },
    gothink (pid, id) {
      // console.log(pid)
      // console.log(id)
      this.$router.push({
        path: '/food',
        query: {
          pid: pid,
          id: id
        }
      })
      // console.log(this.scorllY)
      // this.$router.push('/food/' + id)
    }
  },
  components: {
    searchBox, ballBuy
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixins";
.classification {
  .top {
    width: 100%;
    background-color: #3cc591;
  }
  .class-content {
    position: absolute;
    top: 46px;
    width: 100%;
    bottom: 50px;
    display: flex;
    overflow: hidden;
    .menu-wrapper {
      width: 80px;
      flex: 0 0 80px;
      background: #f3f5f7;
      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
        &.current {
          position: relative;
          margin-top: -1px;
          z-index: 10;
          background: #fff;
          font-weight: 700;
          .text {
            @include border-none();
          }
        }
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
        }
        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          font-size: 12px;
          @include border-1px(rgba(7, 17, 27, .1));
        }
      }
    }
    .foods-wrapper {
      flex: 1;
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
        margin-top: 0;
      }
      .food-item {
        display: flex;
        margin: 18px 10px;
        padding-bottom: 18px;
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
  }
}
</style>
