<template>
  <div>
    <v-header :username="username"></v-header>
    <div class="public-room">
      <div class="user-wrapper" ref="userWrapper">
        <ul>
          <li v-for="(user,userIndex) in userList" :key="userIndex" class="user-item" @click="goPrivate($event,userIndex)">
            <span class="name">{{user}}</span>
            <span class="count" v-show="countMessage(userIndex)">{{messageCount[userIndex]}}</span>
          </li>
        </ul>
      </div>
      <div class="room-wrapper">
        <chatbox :username="username" :newuser="newuser" :roomType="1"></chatbox>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import Vue from 'vue';
import router from '../../router';
import header from '../header/header';
import chatbox from '../chatbox/chatbox';
import { loadMessage } from '../../common/js/store.js';

export default {
  data() {
    return {
      username: '',
      userList: [],
      newuser: '',
      messageCount: []
    };
  },
  components: {
    'v-header': header,
    chatbox
  },
  created() {
    this.username = this.$route.params.username;
    this.$socket.emit('fetchList', { 'username': this.username });
    this.$socket.emit('iamOnline', { 'username': this.username });
    this.$root.eventHub.$on('timeover', () => {
      this.newuser = '';
    });
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
  destroyed() {
    window.removeEventListener('unload', this.unloadHandler);
  },
  mounted() {
    window.addEventListener('unload', this.unloadHandler);
  },
  methods: {
    goPrivate(event, userIndex) {
      if (!event._constructed) {
        return;
      }
      router.push(`${this.username}/private/${this.userList[userIndex]}`);
    },
    countMessage(index) {
      if (!this.messageCount) {
        return false;
      } else {
        return this.messageCount[index] > 0;
      }
    },
    unloadHandler(e) {
      this.$socket.emit('iamOffline', { 'username': this.username });
    }
  },
  sockets: {
    provList(data) {
      if (!data.length) {
        console.log('当前没有用户在线');
      } else {
        data.forEach((user) => {
          if (this.userList.indexOf(user.username) === -1) {
            this.userList.push(user.username);
          }
        });
      }
    },
    someoneOnline(user) {
      this.newuser = user.username;
      if (this.userList.indexOf(user.username) === -1) {
        this.userList.push(user.username);
      }
    },
    someoneOffline(user) {
      let index = this.userList.indexOf(user.username);
      if (index !== -1) {
        this.userList.splice(index, 1);
      }
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
  }
}
</style>
