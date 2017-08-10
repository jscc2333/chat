<template>
  <div class="information">
    <div class="user-wrapper" @click="showInformation">
      <img :src="userAvatar" width="32" height="32">
      <span class="username">{{username}}</span>
    </div>
    <transition name="fade">
      <div class="user-information" v-show="show" ref="userInformation">
        <div class="info-avatar">
          <div class="blur"></div>
          <img :src="avatarDetail" alt="大头像" @click="updateAvatar">
          <div class="change-avatar" v-show="changeAvatarFlag">
            <ul>
              <li v-for="(avatarItem,avatarIndex) in avatarList" :key="avatarIndex" class="avatar-item" @click="changeAvatar(avatarIndex)">
                <img :src="avatarItem.avatar" :alt="avatarItem.avatar">
              </li>
            </ul>
          </div>
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
        <div class="advanced-operation" v-show="!scanmode">
          <div class="base-information" v-show="changeflag">
            <label for="password">新密码：</label>
            <input type="password" id="password">
          </div>
          <span class="change-base" @click="advancedToggle($event)">{{changeBase}}</span>
        </div>
        <div class="cancel-layer" @click="cancelAll"></div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import router from '../../router';

  export default {
    data() {
      return {
        show: false,
        scanmode: true,
        information: [],
        avatarList: [],
        changeflag: false,
        changeAvatarFlag: false
      };
    },
    props: {
      username: {
        type: String
      },
      userAvatar: {
        type: String
      },
      avatarDetail: {
        type: String
      }
    },
    created() {
      this.$root.eventHub.$on('closeInformation', () => {
        this.show = false;
        this.scanmode = true;
        this.changeflag = false;
        this.changeAvatarFlag = false;
      });
    },
    computed: {
      changeBase() {
        if (!this.changeflag) {
          return '更改密码';
        } else {
          return '保存新密码';
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
        if (!this.changeflag === true) {
          let el = event.target;
          let input = el.parentNode.getElementsByTagName('input');
          if (input[0].value.length === 0) {
            return;
          }
          let data = {
            username: this.username,
            password: input[0].value
          };
          this.$socket.emit('updateBaseInformation', data);
        }
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
      updateAvatar() {
        this.changeAvatarFlag = true;
        this.$nextTick(() => {
          this.$refs.userInformation.scrollLeft = 64;
        });
        this.$socket.emit('fetchAvatarList');
      },
      changeAvatar(avatarIndex) {
        let data = {
          username: this.username,
          avatar: this.avatarList[avatarIndex].avatar
        };
        this.$socket.emit('changeAvatar', data);
      },
      cancelEditMode() {
        this.scanmode = true;
      },
      cancelAll() {
        this.changeflag = false;
        this.scanmode = true;
        this.changeAvatarFlag = false;
      }
    },
    sockets: {
      provInfo(data) {
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
      provAvatarList(data) {
        this.avatarList = data;
      },
      updateInfoSuccessful() {
        // 消息成功更新，转为阅读模式
        if (!this.canmode) {
          this.$socket.emit('fetchInformation', this.username);
        }
        this.scanmode = true;
      },
      updateBaseInfoSuccessful() {
        this.changeflag = false;
        this.$socket.emit('iamOffline', { 'username': this.username });
        router.push('/login');
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
      bottom: 30px;
      left: 0;
      right: 100px;
      z-index: 50;
      overflow: auto;
      max-width: 375px;
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
        z-index: 100;
        .blur {
          position: absolute;
          width: 100%;
          height: 200px;
          background: rgba(7, 17, 27, 0.9);
          filter: blur(10px);
          z-index: 100;
        }
        img {
          display: inline-block;
          z-index: 100;
          border-radius: 50%;
          width: 70%;
          max-width: 140px;
          height: 70%;
        }
        .change-avatar {
          position: absolute;
          top: 0;
          bottom: 0;
          right: -64px;
          width: 64px;
          background: #f3f5f7;
          z-index: 200;
          .avatar-item {
            box-sizing: border-box;
            padding: 10px;
            width: 64px;
            height: 64px;
          }
        }
      }
      .info-details {
        position: absolute;
        left: 0;
        right: 0;
        top: 200px;
        z-index: 100;
        margin-top: 20px;
        margin-bottom: 10px;
        .info-item {
          position: relative;
          padding: 10px 0;
          margin: 0 10px;
          text-align: left;
          border-bottom: 1px solid rgba(147, 153, 159, 0.1);
          background: #fff;
          z-index: 100;
          &:last-child {
            border: none;
          }
          .info-type {
            display: inline-block;
            width: 60px;
            text-align: center;
            color: rgba(0, 160, 220, 0.5);
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
            top: 13px;
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
        position: fixed;
        left: 0;
        bottom: 0;
        right: 100px;
        padding: 0 0 5px 0;
        font-size: 16px;
        z-index: 100;
        background: #fff;
        .base-information {
          margin: 10px 0;
          text-align: left;
          label {
            display: inline-block;
            width: 30%;
            text-align: center;
            color: rgba(147, 153, 159, 0.5);
            font-size: 16px;
          }
          input {
            display: inline-block;
            width: 65%;
            background: rgba(147, 153, 159, 0.2);
            border-radius: 3px;
          }
        }
        .change-base {
          display: block;
          padding: 2px 5px;
          border-radius: 5px;
          text-align: center;
          background: rgba(0, 160, 220, 1);
          color: white;
        }
      }
      .cancel-layer {
        position: fixed;
        bottom: 0;
        top: 0;
        left: 0;
        right: 100px;
        max-width: 375px;
        z-index: 75;
        background: #fff;
      }
    }
  }
</style>
