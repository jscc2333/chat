<template>
  <div class="chat-box">
    <h1 class="title">公共聊天室</h1>
    <div class="notice-wrapper">
      <transition name="fade">
        <h2 class="notice" v-show="notice">{{newuser}}上线了</h2>
      </transition>
    </div>
    <div class="message-box" ref="messageBox">
      <ul>
        <li v-for="(msgObj,msgIndex) in messageList" :key="msgIndex" class="message-list message-list-hook" :class="{'current':msgObj.current}">
          <span class="username" v-if="!msgObj.current">{{msgObj.username}}</span>
          <span class="text">{{msgObj.message}}</span>
          <span class="username" v-if="msgObj.current">{{msgObj.username}}</span>
        </li>
      </ul>
    </div>
    <div class="message-input">
      <div class="message-wrapper">
        <input type="text" class="message" v-model="message" @keyup.enter="sendMessage" autofocus="autofocus">
      </div>
      <div class="send-wrapper">
        <span class="send" @click="sendMessage">send</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

export default {
  data() {
    return {
      message: '',
      messageList: []
    };
  },
  props: {
    username: {
      type: String
    },
    newuser: {
      type: String
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
    this.$nextTick(() => {
      if (!this.scroll) {
        console.log(1);
        this.scroll = new BScroll(this.$refs.messageBox, {
          scrollY: true,
          click: true
        });
      }
    });
  },
  computed: {
    notice() {
      if (this.newuser) {
        return true;
      }
    }
  },
  methods: {
    sendMessage() {
      let data = {
        'username': this.username,
        'message': this.message
      };
      this.$socket.emit('sendMessage', data);
      data.current = true;
      this.messageList.push(data);
      this.message = '';
      this.$nextTick(() => {
        this.scroll.refresh();
        let messagelist = this.$refs.messageBox.getElementsByClassName('message-list-hook');
        let el = messagelist[this.messageList.length - 1];
        this.scroll.scrollToElement(el);
      });
    }
  },
  sockets: {
    broadMessage(data) {
      this.messageList.push(data);
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
    left: 80px;
    right: 0;
    bottom: 40px;
    padding: 0 0 0 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    overflow: hidden;
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
    left: 80px;
    box-sizing: border-box;
    padding: 8px 0 5px 0;
    height: 40px;
    background: #f3f5f7;
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
}
</style>
