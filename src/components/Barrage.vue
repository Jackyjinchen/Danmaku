<template>
  <section class="page in" :class="{ out: hide }">
    <!-- <div class="barrage-bg shadow" ref="barrageBg"></div> -->
    <div class="content" :style="contentStyle">
      <!-- <div class="live"><i></i><span>live</span></div> -->
      <div class="barrage-box">
        <div class="barrage-stage" ref="barrageStage">
          <template v-for="(item, index) of barrageList">
            <div
              class="barrage-item"
              :key="index"
              :style="`transform: translate3d(${item.x}px, ${item.y}px, 0)`"
            >
              <span class="barrage-msg">{{ item.msg }}</span>
            </div>
          </template>
        </div>
        <div class="barrage-cover-1"></div>
        <div class="barrage-cover-2"></div>
      </div>
      <div class="input-box" v-show="danmaku">
        <input
          type="text"
          class="input-control"
          placeholder="发条弹幕嗨起来"
          @blur="retractKeyboard"
        />
        <v-touch tag="button" class="barrage-add" @tap="send">
          <img src="../assets/img/btn-wish.png" alt="" width="100%" />
        </v-touch>
        <v-touch
          tag="button"
          class="barrage-add"
          @tap="
            danmaku = false;
            close();
          "
        >
          <img src="../assets/img/btn-close.png" alt="" width="100%" />
        </v-touch>
      </div>
      <div class="input-box" v-show="!danmaku">
        <v-touch
          tag="button"
          class="barrage-add"
          @tap="
            danmaku = true;
            openws();
          "
        >
          <img src="../assets/img/btn-open.png" alt="" width="100%" />
        </v-touch>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import barrage from "../assets/js/barrage";

export default {
  name: "Barrage",

  mixins: [barrage],

  data() {
    return {
      danmaku: false,
      hide: false,
      list: [],
      // list: ["快来发弹幕吧~"],
      // path:"ws://123.207.136.134:9010/ajaxchattest",
      // path: "ws://10.233.5.55:8010/dangdang/activity/websocket/",
      // path: "ws://127.0.0.1:8082/websocket/like/金辰",
      path: "ws://10.230.199.101:8080/ws/dangdang/activity/websocket/",
      // path: "ws://10.230.133.162:38010/dangdang/activity/websocket/",

      socket: ""
      // list: [
      //   "我竟然超过了全国86%的人，我可真牛逼",
      //   "希望招商信诺能安排一个防秃险，我觉得我很需要了",
      //   "有没有过劳肥险？我觉得我可以安排一个",
      //   "希望新的一年，可以赚更多更多的钱",
      //   "万事胜意，岁岁欢愉即可",
      //   "我可能就是传说中的投保达人吧？",
      //   "新的一年赚更多的钱，买最贵的险。没毛病",
      //   "贪心的我想许一个愿望，这个愿望就是我可以许再许三个吗？",
      //   "666，这个年度关键词可以说是总结的很到位了",
      //   "热闹凑一波，哈哈哈，希望明年头发少掉一点"
      // ]
    };
  },

  mounted() {
    // 初始化
  },

  computed: {
    ...mapState(["contentWidth", "insurancePolicyStatus", "total"]),

    contentStyle() {
      return { width: this.contentWidth };
    }
  },

  methods: {
    /**
     * 键盘退出
     */
    retractKeyboard() {
      setTimeout(() => {
        document.activeElement.scrollIntoView(true);
      }, 150);
    },

    openws() {
      // console.log("dakaile ");
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        var pathall = this.path + this.uuid() + "@bling";
        console.log(pathall);
        this.socket = new WebSocket(pathall);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
        // 关闭socket连接
        this.socket.onclose = this.close;
      }
    },
    open() {
      console.log("socket连接成功");
    },
    error() {
      console.log("连接错误");
    },
    getMessage(msg) {
      console.log(msg.data);
      this.addBarrageget(msg.data);
    },
    send(e) {
      let val = e.target.previousElementSibling.value.trim();
      if (val) {
        e.target.previousElementSibling.value = "";
      }
      this.socket.send(val);
      // this.socket.send(this.uuid());
    },
    close() {
      this.socket.close();
      console.log("socket已经关闭");
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    }
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close;
    console.log("socket已经关闭");
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/common";

.page {
  @include full;

  .barrage-bg {
    @include full;
    // background: url("../assets/img/barrage-bg.jpg") center;
    @include bgCover;
  }

  .barrage-box {
    @include pa;
    width: 100%;
    top: px2rem(10px);
    height: px2rem(500px);

    .barrage-cover-1,
    .barrage-cover-2 {
      width: px2rem(122px);
      height: 100%;
      @include pa;
      top: 0;
      background: linear-gradient(
        to right,
        #f9f3d2,
        #f9f3d2 10%,
        rgba(255, 255, 170, 0.1)
      );
    }
    .barrage-cover-1 {
      left: px2rem(-10px);
    }
    .barrage-cover-2 {
      right: px2rem(-10px);
      transform: rotate(180deg);
    }
  }

  .input-box {
    @include pa;
    width: 100%;
    display: flex;
    justify-content: center;
    left: 0;
    bottom: px2rem(100px);
    margin-bottom: px2rem(-15px);
    margin-left: px2rem(15px);
    margin-right: px2rem(15px);
    // margin: 0 px2rem(15px) px2rem(-15px) px2rem(15px);

    .input-control {
      width: px2rem(300px);
      box-sizing: border-box;
      height: px2rem(65px);
      padding: 0 px2rem(50px) 0 px2rem(15px);
      border-radius: px2rem(10px);
      // box-shadow: px2rem(10px) px2rem(10px) px2rem(16px) px2rem(3px)
      //   rgba(207, 202, 171, 0.73);
      margin-right: px2rem(10px);
      color: #a4917a;
      font-size: px2rem(30px);
      background: url("../assets/img/icon-2.png") #fff right center no-repeat;
      // background-color: #fff;
      background-size: px2rem(51px) px2rem(40px);
    }

    .barrage-add {
      width: px2rem(220px);
      &:active {
        transform: scale(0.97);
      }
    }
  }

  &.in {
    .barrage-bg,
    .logo-wrap {
      animation: fall-in-1 0.5s ease backwards;
    }

    .questionnaire-succ-title {
      animation: fall-in-1 0.6s cubic-bezier(0.3, 0.9, 0.7, 1) 0.5s backwards;
    }

    .questionnaire-btn {
      animation: fall-in-2 0.6s cubic-bezier(0.3, 0.9, 0.7, 1) 1.1s backwards;
    }
  }

  &.out {
    animation: fall-out-1 0.25s ease forwards;
  }
}

::-webkit-input-placeholder {
  opacity: 0.5;
}
input:focus::-webkit-input-placeholder {
  opacity: 0.2;
}
</style>
<style lang="scss">
@import "../assets/css/common";

.barrage-stage {
  width: 100%;
  height: 100%;
  padding: 2px 0 2px 0;
  box-sizing: border-box;
  overflow-x: hidden;
  @include pa;
  will-change: auto;
  /*background-color: rgba(204, 204, 204, 0.5);*/

  .barrage-item {
    padding: 5px 10px;
    box-shadow: px2rem(10px) px2rem(10px) px2rem(16px) px2rem(3px)
      rgba(207, 202, 171, 0.2);
    // color: #ff8c47 !important;
    color: #000 !important;
    font-size: px2rem(30px);
    @include pa;
    border-radius: 50px;
    display: flex;

    &:nth-of-type(even) {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    &:nth-of-type(odd) {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    .barrage-msg {
      line-height: 1.6;
      white-space: nowrap;
    }
  }
}
</style>
