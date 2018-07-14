<template>
  <div class="like">
    <div class="like-header">
      <van-nav-bar
        title="我的收藏"
        left-arrow
        @click-left="goback"
        right-text="清空"
        @click-right="empty"
      />
    </div>
    <div class="like-content" v-show="likeCount > 0">
      <div class="cart-food" ref="cartFood">
        <ul style="padding: 10px 0 20px">
          <li class="food-list food-list-hook" v-for="goods in getCartGoods" :key="goods.id">
            <ul
              class="li-ul"
              v-for="(food, index) in goods.foods"
              v-if="food.like > 0"
              :key="index">
                <li class="food-item" @click.stop.prevent="gothink(goods.id, food.id)">
                  <div class="icon">
                    <img :src="food.icon" width="57" height="57">
                  </div>
                  <div class="content">
                    <h2 class="name">
                      {{food.name}}
                      <span>好评率{{food.rating}}%</span>
                    </h2>
                    <p class="desc" v-if="food.info">{{food.info}}</p>
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}份</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                  </div>
                </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="like-null-box" v-show="likeCount < 1">
      <div class="cart-null">
        <i class="iconfont icon-hezi401"></i>
        <div class="text">您还没有收藏的商品哦~</div>
        <van-button size="small" class="cart-button" @click="tolink('/home')">去逛逛</van-button>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BScroll from 'better-scroll'
export default {
  name: 'like',
  computed: {
    ...mapGetters(['getCartGoods']),
    likeCount () {
      let zhi = 0
      this.getCartGoods.forEach((item) => {
        item.foods.forEach((food) => {
          if (food.like) {
            zhi += food.like
          }
        })
      })
      return zhi
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    empty () {
      this.getCartGoods.forEach((item) => {
        item.foods.forEach((food) => {
          if (food.like) {
            food.like = 0
          }
        })
      })
    },
    goback () {
      this.$router.go(-1)
    },
    tolink (to) {
      this.$router.push(to)
    },
    getData () {
      let _this = this
      this.$nextTick(function () {
        _this.initLickScroll()
      })
    },
    initLickScroll () {
      if (!this.lickScroll) {
        this.lickScroll = new BScroll(this.$refs.cartFood, {
          click: true
        })
      } else {
        this.lickScroll.refresh()
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
    }
  },
  watch: {
    '$router': 'getData'
  }
}
</script>
<style lang="scss">
  .like {
    .van-nav-bar__right {
      .van-nav-bar__text {
        color: #fff;
        &:active {
          background-color: #37bd8a;
        }
      }
    }
    .van-icon {
      color: #fff;
    }
  }
</style>

<style lang="scss" scoped>
  @import "../../styles/mixins";
  .like-header {
    .van-nav-bar {
      background-color: #3cc591;
      color: #fff;
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
    .food-item {
      display: flex;
      padding: 18px 10px 10px;
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
            color: #93999f;
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
          right: 5px;
          bottom: 14px;
        }
      }
    }
  }
  .like-null-box {
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
