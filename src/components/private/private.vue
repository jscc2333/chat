<template>
  <div class="private">
    <v-header></v-header>
    <div class="room-wrapper">
      <chatbox :chatuser="chatuser" :roomType="0" :username="username" :unReceivedMsg="unReceivedMsg"></chatbox>
      <img src="../../assets/back.png" width="18" height="18" class="back" @click="goBack">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
    this.username = this.$route.params.username;
    this.chatuser = this.$route.params.chatuser;
    let messagelist = loadMessage(this.username);
    if (messagelist !== undefined) {
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
  destroyed() {
    setTimeout(() => {
      this.$root.eventHub.$emit('getMsgOnce');
    }, 1000);
  },
  methods: {
    goBack() {
      router.go(-1);
    }
  }
};
</script>

<style lang="less">
.private {
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
