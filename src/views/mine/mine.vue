<template>
  <div class="mine">
    <div class="mine-header">
      <img src="../../assets/images/pcenter2bg.jpg">
    </div>
    <div class="mine-cont-box" ref="mineContBox">
      <div>
        <div class="mine-top">
          <div class="mine-info">
            <div class="info">
              <div class="ico">
                <img src="../../assets/images/ico.jpeg">
              </div>
              <div class="user-info">
                <div class="user-name">rainnyKing</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mine-content">
          <div class="mine-order mt-35 b-t-1px">
            <div class="main">
              <div class="four-btn">
                <van-row type="flex">
                  <van-col span="6" v-for="(item, index) in fourbtn" :key="index">
                    <div class="four-btn-item" @click="gotolink(item.url)">
                      <div class="font-icon">
                        <van-icon :name="item.ico" />
                        <div class="tips" v-show="item.tip > 0">{{item.tip}}</div>
                      </div>
                      <div>{{item.title}}</div>
                    </div>
                  </van-col>
                </van-row>
              </div>
            </div>
          </div>
          <split></split>
          <div class="other-menu">
            <van-cell-group>
              <van-cell value="查看全部订单" icon="records" is-link clickable @click="gotolink('/order/0')">
                <template slot="title">
                  <span class="van-cell-text">全部订单</span>
                </template>
              </van-cell>
              <van-cell value="修改地址" icon="location" is-link @click="addressAf">
                <template slot="title">
                  <span class="van-cell-text">收货地址</span>
                </template>
              </van-cell>
            </van-cell-group>
            <split></split>
            <van-cell-group>
              <van-cell value="配送时间" icon="clock" is-link>
                <template slot="title">
                  <span class="van-cell-text">配送时间说明</span>
                </template>
              </van-cell>
              <van-cell value="发现问题与反馈" icon="info-o" is-link>
                <template slot="title">
                  <span class="van-cell-text">帮助与反馈</span>
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import split from '../split/split'
import { mapGetters } from 'vuex'
export default {
  name: 'mine',
  data () {
    return {
      fourbtn: [
        {title: '待付款', ico: 'card', url: '/order/1'},
        {title: '待收货', ico: 'send-gift', url: '/order/2'},
        {title: '待评价', ico: 'more', url: '/order/3'},
        {title: '我的收藏', ico: 'like', url: '/like', tip: '0'}
      ]
    }
  },
  mounted () {
    this.likeCountFun()
    this.$nextTick(() => {
      this.initScorll()
    })
  },
  computed: {
    ...mapGetters(['getCartGoods']),
    // 收藏个数
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
  methods: {
    initScorll () {
      if (!this.mineContScorll) {
        this.mineContScorll = new BScroll(this.$refs.mineContBox, {
          click: true
        })
      } else {
        this.mineContScorll.refresh()
      }
    },
    // 收藏个数赋值
    likeCountFun () {
      this.fourbtn.forEach((item) => {
        if (item.title === '我的收藏') {
          item.tip = this.likeCount
        }
      })
    },
    gotolink (to) {
      this.$router.push(to)
    },
    addressAf () {
      this.$toast({
        duration: 1000,
        position: 'bottom',
        message: '此功能还未实现，敬请见谅'
      })
    }
  },
  components: {
    split
  }
}
</script>

<style lang="scss">
.mine {
  .van-cell__value {
    span {
      font-size: 12px;
      color: #919191;
    }
  }
  .other-menu{
    .van-cell {
      padding: 15px;
      line-height: 26px;
      .van-cell__left-icon {
        color: #17b356;
        margin-right: 10px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
  @import "../../styles/mixins";
  .mine-cont-box {
    position: absolute;
    top: 0;
    bottom: 50px;
    width: 100%;
    overflow: hidden;
  }
  .mine-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
    img {
      display: block;
      width: 100%;
    }
  }
  .mine-top {
    padding-top: 11%;
    .mine-info {
      .info {
        text-align: center;
        .ico {
          width: 60px;
          height: 60px;
          overflow: hidden;
          border: 3px solid #fff;
          border-radius: 50%;
          display: inline-block;
          img {
            width: 100%;
            display: block;
          }
        }
      }
    }
  }
  .mine-content {
    .mine-order {
      background-color: #fff;
      position: relative;
      &.mt-35{
        margin-top: 0px;
      }
      .top {
        position: relative;
      }
      .main {
        .four-btn {
          text-align: center;
          font-size: 12px;
          color: #666;
          .four-btn-item {
            padding: 20px 0;
          }
          .font-icon {
            position: relative;
            i {
              font-size: 22px;
              margin-bottom: 5px;
              &::before {
                display: inline-block;
                background: linear-gradient(to right, #ff9c00, #ff6b00);
                -webkit-background-clip: text;
                color: transparent;
              }
            }
            .tips {
              position: absolute;
              top: -6px;
              left: 50%;
              border: 1px solid #ff6b00;
              border-radius: 50%;
              width: 14px;
              height: 14px;
              font-size: 10px;
              line-height: 16px;
              margin-left: 2px;
              color: #ff6b00;
              text-align: center;
              background-color: #fff;
            }
          }
        }
      }
    }
  }
</style>
