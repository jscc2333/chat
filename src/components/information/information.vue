<template>
  <div class="information">
    <div class="user-wrapper" @click="showInformation">
      <img src="../../assets/account.png" width="32" height="32">
      <span class="username">{{username}}</span>
    </div>
    <transition name="fade">
      <div class="user-information" v-show="show">
        <div class="info-avatar">
          <img src="" alt="">
        </div>
        <div class="info-details" ref=" ">
          <ul>
            <li v-for="(infoItem,infoIndex) in information" :key="infoIndex" class="info-item">
              <span class="info-type">{{infoItem.type}}</span>
              <span class="info-value" v-if="scanmode">{{infoItem.value}}</span>
              <input class="info-input" type="text" v-else :value="infoItem.value">
              <span class="edit" @click="toggle($event)">&gt</span>
            </li>
          </ul>
          <div class="edit-selection" v-show="!scanmode">
            <span class="save" @click="updateInfo">保存</span>
            <span class="cancel" @click="cancelEditMode">取消</span>
          </div>
        </div>
        <span class="icon-close" @click="hideInformation"></span>
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
    updateInfo() {
      let infoItem = document.getElementsByClassName('info-item');
      console.log(infoItem);
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
      }
    },
    updateInfoSuccessful() {
      this.scanmode = true;
      this.$socket.emit('fetchInformation', this.username);
    }
  }
};
</script>

<style lang="less">
.information {
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
    &.fade-enter,
    &.fade-leave-active {
      opacity: 0;
    }
    &.fade-enter-active,
    &.fade-leave-active {
      transition: all .5s ease-in;
    }
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