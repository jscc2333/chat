<template>
  <div class="private-room">
    <div class="room-wrapper" @click="hideInformation()">
      <chatbox :chatuser="chatuser" :roomType="0" :username="username" :unReceivedMsg="unReceivedMsg"></chatbox>
      <img src="../../assets/back.png" width="18" height="18" class="back" @click="goBack">
    </div>
  </div>
</template>

 <script type="text/ecmascript-6">
  import Vue from 'vue';
  import router from '../../router';
  import header from '../header/header';
  import chatbox from '../chatbox/chatbox';
  import { loadMessage } from '../../common/js/store.js';

  export default {
    data() {
      return {
        username: '',
        chatuser: '',
        unReceivedMsg: [],
        messageCount: []
      };
    },
    components: {
      'v-header': header,
      chatbox
    },
    created() {
      // 从路由中获取参数
      this.username = this.$route.params.username;
      this.chatuser = this.$route.params.chatuser;
      // 获取本地存储中的私人信息
      let messagelist = loadMessage(this.username);
      if (messagelist !== undefined) {
        // 存在消息且用户对象正确则添加
        messagelist.forEach((item) => {
          let data = {
            'message': item.message,
            'username': item.username
          };
          if (data.username === this.chatuser) {
            this.unReceivedMsg.push(data);
          }
        });
      }
    },
    mounted() {
      // 添加页面重载事件
      window.addEventListener('unload', this.unloadHandler);
    },
    destroyed() {
      setTimeout(() => {
        this.$root.eventHub.$emit('getMsgOnce');
      }, 1000);
      // 移除页面重载事件
      window.removeEventListener('unload', this.unloadHandler);
    },
    methods: {
      hideInformation() {
        this.$root.eventHub.$emit('closeInformation');
      },
      goBack() {
        router.go(-1);
      },
      unloadHandler() {
        this.$socket.emit('iamOffline', { 'username': this.username });
      }
    }
  };
</script>

<style lang="less">
  .private-room {
    .room-wrapper {
      position: absolute;
      top: 44px;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      .back {
        position: absolute;
        left: 0;
        top: 5px;
      }
    }
  }
</style>
