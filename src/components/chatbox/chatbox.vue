<template>
  <div class="chat-box">
    <h1 class="title">公共聊天室</h1>
    <div class="message-box">
      <ul>
        <li v-for="(msgObj,msgIndex) in receiveList" :key="msgIndex" class="msgReceive">
          <span class="o-username">{{msgObj.username}}</span>
          <span class="text">{{msgObj.msg}}</span>
        </li>
        <li v-for="(msg,msgIndex) in sendList" :key="msgIndex" class="msgSend">
          <span class="text">{{msg}}</span>
          <span class="username">{{username}}</span>
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
export default {
  data() {
    return {
      message: '',
      sendList: [],
      receiveList: [{ 'username': 'aron', 'msg': 'hahahahah' }]
    };
  },
  props: {
    username: {
      type: String
    }
  },
  methods: {
    sendMessage() {
      this.sendList.push(this.message);
      this.message = '';
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
    margin-bottom: 7px;
  }
  .message-box {
    position: absolute;
    top: 25px;
    left: 85px;
    right: 0;
    bottom: 40px;
    padding: 0 0 0 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    .msgSend,.msgReceive {
      margin-bottom: 10px;
      padding:0 5px;
      line-height: 20px;
      .text {
        display: inline-block;
        padding: 5px 10px;
        background: #f3f5f7;
        border-radius: 20px;
        font-size: 16px;
      }
    }
    .msgSend{
      text-align: right;
    }
  }
  .message-input {
    position: fixed;
    display: flex;
    bottom: 0;
    right: 0;
    left: 85px;
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
