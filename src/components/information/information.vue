<template>
  <div class="information">
    <div class="user-wrapper" @click="showInformation">
      <img src="../../assets/avatar.jpg" width="32" height="32">
      <span class="username">{{username}}</span>
    </div>
    <transition name="fade">
      <div class="user-information" v-show="show">
        <div class="info-avatar">
          <div class="blur"></div>
          <img src="../../assets/avatar.jpg" alt="">
        </div>
        <div class="info-details" ref=" ">
          <ul>
            <li v-for="(infoItem,infoIndex) in information" :key="infoIndex" class="info-item">
              <span class="info-type">{{infoItem.type}}</span>
              <span class="info-value" v-if="scanmode">{{infoItem.value}}</span>
              <input class="info-input" type="text" v-else :value="infoItem.value" @keyup.enter="updateInfo()" size="18">
              <span class="edit" @click="toggle($event)">&gt</span>
            </li>
          </ul>
          <div class="edit-selection" v-show="!scanmode">
            <span class="save" @click="updateInfo">保存</span>
            <span class="cancel" @click="cancelEditMode">取消</span>
          </div>
        </div>
        <div class="advanced-operation">
          <input type="text" v-show="changeflag" value="111">
          <input type="text" v-show="changeflag" value="222">
          <span class="change-base" @click="advancedToggle($event)">{{changeBase}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';

export default {
  data() {
    return {
      show: false,
      scanmode: true,
      information: [],
      changeflag: false
    };
  },
  props: {
    username: {
      type: String
    }
  },
  created() {
    this.$root.eventHub.$on('closeInformation', () => {
      this.show = false;
      this.scanmode = true;
    });
  },
  computed: {
    changeBase() {
      if (!this.changeflag) {
        return '更改基础信息';
      } else {
        return '保存信息';
      }
    }
  },
  methods: {
    showInformation() {
      this.$socket.emit('fetchInformation', this.username);
      this.show = true;
    },
    hideInformation() {
      this.show = false;
    },
    toggle(event) {
      this.scanmode = !this.scanmode;
      let parentNode = event.target.parentNode;
      this.$nextTick(() => {
        let inputSec = parentNode.getElementsByTagName('input');
        if (inputSec.length > 0) {
          inputSec[0].focus();
        }
      });
    },
    advancedToggle(event) {
      this.changeflag = !this.changeflag;
    },
    updateInfo() {
      let infoItem = document.getElementsByClassName('info-item');
      let data = {
        username: this.username
      };
      for (let i = 0; i < infoItem.length; i++) {
        let type = infoItem[i].getElementsByClassName('info-type')[0].innerHTML;
        let value = infoItem[i].getElementsByClassName('info-input')[0].value;
        data[type] = value;
      }
      this.$socket.emit('updateInformation', data);
    },
    cancelEditMode() {
      this.scanmode = true;
    }
  },
  sockets: {
    provInfo(data) {
      console.log(data);
      let informationObj = data[0].information;
      for (let item in informationObj) {
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
          // 如果都不等于该信息项，新增
          this.information.push({
            type: item,
            value: informationObj[item]
          });
        } else {
          // 更新信息
          Vue.set(this.information, updateIndex, {
            type: item,
            value: informationObj[item]
          });
        }
      }
    },
    updateInfoSuccessful() {
      // 消息成功更新，转为阅读模式
      this.scanmode = true;
      this.$socket.emit('fetchInformation', this.username);
    }
  }
};
</script>

<style lang="less">
.information {
  position: relative;
  .user-wrapper {
    position: absolute;
    left: 10px;
    top: -5px;
    img {
      border-radius: 50%;
    }
    .username {
      display: inline-block;
      vertical-align: top;
      line-height: 32px;
      font-size: 18px;
    }
  }
  .user-information {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 100px;
    z-index: 100;
    overflow: auto;
    &.fade-enter,
    &.fade-leave-active {
      opacity: 0;
      transform: translateX(-100%);
    }
    &.fade-enter-active,
    &.fade-leave-active {
      transition: all .5s ease-in;
    }
    .info-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 200px;
      .blur {
        position: absolute;
        width: 100%;
        height: 200px;
        background: rgba(7, 17, 27, 0.9);
        filter: blur(10px);
      }
      img {
        z-index: 10;
        border-radius: 50%;
        width: 70%;
        height: 70%;
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
        position: relative;
        padding: 10px 0;
        margin: 0 10px;
        text-align: left;
        border-bottom: 1px solid rgba(147, 153, 159, 0.1);
        &:last-child {
          border: none;
        }
        .info-type {
          color: rgba(147, 153, 159, 0.5);
          font-size: 14px;
        }
        .info-value,
        .info-input {
          color: #000;
          font-size: 16px;
        }
        .info-input {
          padding: 2px 5px;
          border: 1px solid #fff;
          border-radius: 5px;
          background: rgba(147, 153, 159, 0.2);
        }
        .edit {
          position: absolute;
          top: 16px;
          right: 5px;
          color: rgba(147, 153, 159, 0.5);
          font-size: 16px;
        }
      }
      .edit-selection {
        margin-top: 10px;
        font-size: 0;
        .save,
        .cancel {
          margin: 0 5px;
          padding: 5px;
          border-radius: 10px;
          font-size: 14px;
          color: #fff;
          background: rgb(0, 160, 220);
        }
      }
    }
    .advanced-operation {
      position: absolute;
      bottom: 5px;
      width: 100%;
      font-size: 16px;
      .change-base {
        display: block;
        padding: 2px 5px;
        border-radius: 5px;
        background: rgba(0, 160, 220, 0.8);
        color: white;
      }
    }
  }
}
</style>
