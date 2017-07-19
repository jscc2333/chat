<template>
  <div class="header">
    <avatar :username="username"></avatar>
    <i class="icon-chat"></i>
    <span class="title">Chat</span>
    <span class="icon-close" @click="signout"></span>
  </div>
</template>

<script type="text/ecmascript-6">
import router from '../../router';
import avatar from '../avatar/avatar';

export default {
  props: {
    username: {
      type: String
    }
  },
  components: {
    avatar
  },
  methods: {
    signout() {
      this.$socket.emit('iamOffline', { 'username': this.username });
      router.push('/login');
    }
  }
};
</script>

<style lang="less">
.header {
  position: relative;
  padding: 10px 0;
  line-height: 24px;
  width: 100%;
  text-align: center;
  background: #f3f5f7;
  font-size: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  .icon-chat {
    font-size: 20px;
  }
  .icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
