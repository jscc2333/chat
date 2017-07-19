<template>
  <div class="avatar">
    <div class="user-wrapper" @click="showInformation">
      <img src="../../assets/account.png" width="32" height="32">
      <span class="username">{{username}}</span>
    </div>
    <div class="user-information" v-show="show">
      <div class="info-avatar">
        <img src="../../assets/account.png" alt="">
      </div>
      <div class="info-details">
        <ul>
          <li v-for="(infoItem,infoIndex) in information" :key="infoIndex" class="info-item">
            <span class="info-type">{{infoItem.type}}</span>
            <span class="info-value">{{infoItem.value}}</span>
          </li>
        </ul>
      </div>
      <span class="icon-close" @click="hideInformation"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';

export default {
  data() {
    return {
      show: false,
      information: []
    };
  },
  props: {
    username: {
      type: String
    }
  },
  created() {
  },
  methods: {
    showInformation() {
      this.$socket.emit('fetchInformation', this.username);
      this.show = true;
    },
    hideInformation() {
      this.show = false;
    }
  },
  sockets: {
    provInfo(data) {
      let informationObj = data[0].information;
      for (let item in informationObj) {
        if (informationObj[item].length) {
          // 添加信息项标志位
          let pushFlag = 0;
          // 需要更新数据项索引
          let updateIndex;
          let length = this.information.length;
          for (let i = 0; i < length; i++) {
            if (this.information[i].type !== item) {
              pushFlag += 1;
            } else {
              updateIndex = i;
            }
          }
          if (pushFlag === length) {
            this.information.push({
              type: item,
              value: informationObj[item]
            });
          } else {
            // Vue.set(this.information, updateIndex, {
            // type: item,
            // value: informationObj[item]
            // });
          }
        }
      }
      console.log(this.information);
    }
  }
};
</script>

<style lang="less">
.avatar {
  .user-wrapper {
    position: absolute;
    left: 10px;
    top: 5px;
    .username {
      display: inline-block;
      vertical-align: top;
      line-height: 32px;
      font-size: 24px;
    }
  }
  .user-information {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    overflow: auto;
    .info-avatar {
      width: 100%;
      height: 200px;
      background: rgba(7, 17, 27, 0.9);
      filter: blur(2px);
      img {
        width: 90%;
        height: 100%;
      }
    }
    .info-details {
      position: absolute;
      left: 0;
      right: 0;
      top: 200px;
      bottom: 0;
      background: #fff;
      .info-item {
        padding: 10px 0;
        margin: 0 10px;
        text-align: left;
        border-bottom: 1px solid rgba(147, 153, 159, 0.1);
        .info-type {
          color: rgba(147, 153, 159, 0.5);
          font-size: 14px;
        }
        .info-value {
          color: #000;
          font-size: 16px;
        }
      }
    }
    .icon-close {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 101;
      color: #fff;
    }
  }
}
</style>
