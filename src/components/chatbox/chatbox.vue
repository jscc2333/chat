<template>
  <div class="chat-box">
    <h1 class="title">{{roomname}}</h1>
    <div class="notice-wrapper">
      <transition name="fade">
        <h2 class="notice" v-show="notice">{{newuser}}上线了</h2>
      </transition>
    </div>
    <div class="message-box" ref="messageBox" :class="roomtype" @click="emojiShow = false">
      <ul>
        <li v-for="(msgObj,msgIndex) in messageList" :key="msgIndex" class="message-list message-list-hook" :class="{'current':msgObj.current}">
          <span class="username" v-if="!msgObj.current">{{msgObj.username}}</span>
          <span class="text">{{msgObj.message}}</span>
          <span class="username" v-if="msgObj.current">{{msgObj.username}}</span>
        </li>
      </ul>
    </div>
    <div class="message-input" :class="roomtype">
      <div class="message-wrapper">
        <input type="text" class="message" v-model="message" @keyup.enter="sendMessage" autofocus="autofocus" ref="input">
      </div>
      <div class="emoji-wrapper" @click="emojiShow = !emojiShow">
        <img src="../../assets/emoji.png" alt="emoji" class="emoji">
      </div>
      <div class="send-wrapper">
        <span class="send" @click="sendMessage">send</span>
      </div>
    </div>
    <transition name="slide">
      <div class="emoji-box" v-show="emojiShow">
        <ul>
          <li v-for="(emoji,emojiIndex) in emojis" :key="emojiIndex" class="emoji-item" @click="inputEmoji(emojiIndex)">{{emoji}}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import router from '../../router';
  import { saveMessage, clearMessage } from '../../common/js/store.js';

  const PRIVATE_ROOM = 0;
  const PUBLIC_ROOM = 1;

  export default {
    data() {
      return {
        message: '',
        messageList: [],
        emojiShow: false,
        emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️']
      };
    },
    props: {
      username: {
        type: String
      },
      newuser: {
        type: String
      },
      roomType: {
        type: Number,
        default: 0
      },
      chatuser: {
        type: String
      },
      unReceivedMsg: {
        type: Array
      }
    },
    watch: {
      newuser: function () {
        setTimeout(() => {
          this.$root.eventHub.$emit('timeover');
        }, 2000);
      }
    },
    created() {
      // 初始化better-scroll
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.messageBox, {
            scrollY: true,
            click: true
          });
        }
      });
      // 存在未接受消息，则添加消息
      if (this.unReceivedMsg) {
        this.messageList = this.unReceivedMsg;
        // 清楚消息缓存
        clearMessage(this.username, this.chatuser);
      }
    },
    computed: {
      notice() {
        if (this.newuser) {
          return true;
        }
      },
      roomname() {
        return this.roomType ? '公共聊天室' : `正在与${this.chatuser}聊天`;
      },
      roomtype() {
        switch (this.roomType) {
          case 0: return 'private';
          case 1: return 'public';
          case 2: return 'group';
        }
        return;
      }
    },
    methods: {
      sendMessage() {
        let data = {
          'username': this.username,
          'message': this.message,
          'userlist': []
        };
        if (!this.roomType) {
          // 添加组列表成员
          data.userlist.push(this.chatuser);
        }
        this.$socket.emit('sendMessage', data);
        data.current = true;
        this.messageList.push(data);
        this.message = '';
        this.$nextTick(() => {
          this.scroll.refresh();
          let messagelist = this.$refs.messageBox.getElementsByClassName('message-list-hook');
          // 取得最后一条消息位置
          let el = messagelist[this.messageList.length - 1];
          // 滚动到最后一条消息处
          this.scroll.scrollToElement(el);
        });
      },
      inputEmoji(index) {
        this.message += this.emojis[index];
        this.$refs.input.focus();
      }
    },
    sockets: {
      // 接受广播消息
      broadMessage(data) {
        if (data.userlist.length) {
          // 若存在私聊消息
          if (data.userlist.indexOf(this.username) !== -1 && this.roomType === PRIVATE_ROOM && this.chatuser === data.username) {
            // 若刚好在所聊天对象的私人聊天室，则将消息添加到消息列表中
            this.messageList.push(data);
          } else {
            // 不在私人聊天室，则将消息保存到本地存储中
            saveMessage(data);
            // 发布收到私人消息的事件
            this.$root.eventHub.$emit('getPrivateMsg');
          }
        } else {
          // 不是私聊消息，直接添加到公共聊天室列表
          if (this.roomType === PRIVATE_ROOM) {
            return;
          }
          this.messageList.push(data);
        }
        this.$nextTick(() => {
          this.scroll.refresh();
          let messagelist = this.$refs.messageBox.getElementsByClassName('message-list-hook');
          let el = messagelist[this.messageList.length - 1];
          this.scroll.scrollToElement(el);
        });
      }
    }
  };
</script>

<style lang="less">
  .chat-box {
    padding: 5px;
    .title {
      line-height: 18px;
      text-align: center;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .notice-wrapper {
      margin: 3px 0 7px 0;
      width: 100%;
      text-align: center;
      .notice {
        display: inline;
        padding: 0 3px;
        line-height: 12px;
        border-radius: 3px;
        font-size: 10px;
        background: #f3f5f7;
        &.fade-enter {
          opacity: 0;
        }
        &.fade-enter-active {
          transition: all .5s ease;
        }
      }
    }
    .message-box {
      position: absolute;
      top: 25px;
      right: 0;
      bottom: 40px;
      padding: 0 0 0 5px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.3);
      overflow: hidden;
      z-index: 1;
      &.private {
        left: 0
      }
      &.public {
        left: 80px;
      }
      .message-list {
        margin-bottom: 10px;
        padding: 0 5px;
        line-height: 20px;
        &.current {
          text-align: right;
        }
        .text {
          display: inline-block;
          vertical-align: top;
          padding: 5px 10px;
          max-width: 200px;
          word-wrap: break-word;
          word-break: normal;
          text-align: left;
          background: #f3f5f7;
          border-radius: 20px;
          font-size: 16px;
        }
      }
    }
    .message-input {
      position: fixed;
      display: flex;
      bottom: 0;
      right: 0;
      box-sizing: border-box;
      padding: 8px 0 5px 0;
      height: 40px;
      background: #f3f5f7;
      z-index:101;
      &.private {
        left: 0
      }
      &.public {
        left: 80px;
      }
      .message-wrapper {
        flex: 1;
        margin: 0 15px;
        .message {
          padding: 3px;
          height: 21px;
          width: 100%;
          border-radius: 10px;
        }
      }
      .emoji-wrapper {
        flex: 0 0 35px;
        .emoji {
          width: 27px;
          height: 27px;
        }
      }
      .send-wrapper {
        flex: 0 0 35px;
        .send {
          display: inline-block;
          border: 1px solid rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 2px 10px;
          line-height: 21px;
          background: #fff;
        }
      }
    }
    .emoji-box {
      position: fixed;
      bottom: 42px;
      left: 80px;
      right: 0;
      padding: 0 0 0 3px;
      background: #f3f5f7;
      z-index: 100;
      &.slide-enter,
      &.slide-leave-active {
        opacity: 0;
        transform: translateY(100%);
      }
      &.slide-enter-active,
      &.slide-leave-active {
        transition: all .5s linear;
      }
      .emoji-item {
        float: left;
        width: 20px;
        height: 20px;
        padding: 4px;
      }
    }
  }
</style>
