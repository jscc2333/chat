<template>
  <div class="public-room">
    <div class="user-wrapper" ref="userWrapper">
      <ul>
        <li tag="li" v-for="(user,userIndex) in userList" :key="userIndex" class="user-item" @click="scanInformation($event,userIndex)" @dblclick="goPrivate($event,userIndex)" ref="user">
          <span class="name">{{user}}</span>
          <span class="count" v-show="countMessage(userIndex)">{{messageCount[userIndex]}}</span>
        </li>
      </ul>
    </div>
    <div class="room-wrapper" @click="hideInformation()">
      <chatbox :username="username" :newuser="newuser" :roomType="1"></chatbox>
      <transition name="slide">
        <div class="information" v-show="show">
          <img :src="otherAvatar" alt="头像">
          <ul>
            <li v-for="(infoItem,infoIndex) in information" :key="infoIndex" class="info-item">
              <span class="info-type">{{information_cn[infoIndex][infoItem.type]}}</span>
              <span class="info-value">{{infoItem.value}}</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

 <script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import chatbox from '../chatbox/chatbox.vue';
  import router from '../../router';
  import { loadMessage } from '../../common/js/store.js';

  export default {
    data() {
      return {
        username: '',
        userList: [],
        newuser: '',
        messageCount: [],
        timer: null,
        otherAvatar: '',
        information: [],
        information_cn: [
          { Autograph: '签名' },
          { Sex: '性别' },
          { Age: '年龄' },
          { Area: '地区' },
          { Career: '职业' },
          { Like: '爱好' }
        ],
        show: false,
        showIndex: -1
      };
    },
    components: {
      chatbox
    },
    created() {
      this.username = this.$route.params.username;
      // 获取用户列表
      this.$socket.emit('fetchList', { 'username': this.username });
      // 广播上线消息
      this.$socket.emit('iamOnline', { 'username': this.username });
      // 发布上线提醒结束事件
      this.$root.eventHub.$on('timeover', () => {
        this.newuser = '';
      });
      // 响应获取私人消息事件
      this.$root.eventHub.$on('getPrivateMsg', () => {
        let messages = loadMessage(this.username);
        this.userList.forEach((user, index) => {
          if (messages) {
            let length = messages.filter((item) => {
              return item.username === user;
            }).length;
            Vue.set(this.messageCount, index, length);
          }
        });
      });
      this.$root.eventHub.$on('getMsgOnce', () => {
        let messages = loadMessage(this.username);
        this.userList.forEach((user, index) => {
          if (messages) {
            let length = messages.filter((item) => {
              return item.username === user;
            }).length;
            Vue.set(this.messageCount, index, length);
          }
        });
      });
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.userWrapper, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    methods: {
      scanInformation(event, userIndex) {
        if (!event._constructed) {
          return;
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if (this.show && userIndex === this.showIndex) {
            this.goPrivate(event, userIndex);
            return;
          }
          this.showIndex = userIndex;
          this.show = false;
          let el = event.target;
          let username = '';
          if (el.className !== 'user-item') {
            el = el.parentNode;
          }
          username = el.getElementsByTagName('span')[0].innerHTML;
          this.$socket.emit('fetchOtherInformation', username);
        }, 300);
      },
      // 私聊消息计数
      countMessage(index) {
        if (!this.messageCount) {
          return false;
        } else {
          return this.messageCount[index] > 0;
        }
      },
      hideInformation() {
        this.showIndex = -1;
        this.show = false;
        this.$root.eventHub.$emit('closeInformation');
      },
      // 进入私聊房间
      goPrivate(event, userIndex) {
        // if (!event._constructed) {
        //   return;
        // }
        this.showIndex = -1;
        this.show = false;
        clearTimeout(this.timer);
        this.$root.eventHub.$emit('sendAvatar', this.userAvatar);
        router.push(`/room/${this.username}/private/${this.userList[userIndex]}`);
      }
    },
    sockets: {
      provList(data) {
        if (!data.length) {
          console.log('当前没有用户在线');
        } else {
          // 添加在线列表
          data.forEach((user) => {
            if (this.userList.indexOf(user.username) === -1) {
              this.userList.push(user.username);
            }
          });
        }
      },
      // 上线
      someoneOnline(user) {
        this.newuser = user.username;
        if (this.userList.indexOf(user.username) === -1) {
          this.userList.push(user.username);
        }
      },
      // 下线
      someoneOffline(user) {
        let index = this.userList.indexOf(user.username);
        if (index !== -1) {
          this.userList.splice(index, 1);
        }
      },
      // 获取在线人员信息
      provOtherInformation(data) {
        let information = data.information;
        this.otherAvatar = data.avatar;
        for (let item in information) {
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
              value: information[item]
            });
          } else {
            // 更新信息
            Vue.set(this.information, updateIndex, {
              type: item,
              value: information[item]
            });
          }
        }
        this.show = true;
      }
    }
  };
</script>

<style lang="less">
  .public-room {
    display: flex;
    position: absolute;
    top: 44px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .user-wrapper {
      flex: 0 0 80px;
      background: #f3f5f7;
      .user-item {
        display: table;
        position: relative;
        padding: 0 12px;
        line-height: 54px;
        width: 56px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .name {
          display: table-cell;
          vertical-align: middle;
          width: 56px;
          text-align: center;
          font-size: 20px;
          &:last-child {
            border: none;
          }
        }
        .count {
          display: inline-block;
          padding: 2px;
          line-height: 12px;
          font-size: 12px;
          background: rgba(0, 160, 220, 0.2);
          border-radius: 50%;
        }
      }
    }
    .room-wrapper {
      flex: 1;
      .information {
        position: absolute;
        top: 0;
        left: 80px;
        right: 0;
        background: #fff;
        z-index: 10;
        &.slide-enter,
        &.slide-leave-active {
          opacity: 0;
          transform: translateY(-100%);
        }
        &.slide-enter-active,
        &.slide-leave-active {
          transition: all .3s linear;
        }
        text-align: center;
        .info-item {
          padding: 10px 0;
          margin: 0 10px;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          text-align: left;
          &:last-child {
            border: none;
          }
          .info-type {
            display: inline-block;
            width: 65px;
            text-align: center;
            color: rgba(0, 160, 220, 0.5);
            font-size: 14px;
          }
          .info-value {
            color: #000;
            font-size: 16px;
          }
        }
      }
    }
  }
</style>
`
