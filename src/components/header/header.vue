<template>
  <div class="header">
    <div class="user-wrapper">
      <img src="../../assets/account.png" width="32" height="32">
      <span class="username">{{username}}</span>
    </div>
    <i class="icon-chat"></i>
    <span class="title">Chat</span>
    <span class="icon-close" @click="signout"></span>
  </div>
</template>

<script type="text/ecmascript-6">
import router from '../../router';
export default {
  props: {
    username: {
      type: String
    }
  },
  methods: {
    signout() {
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
