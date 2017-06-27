<template>
  <div class="header">
    <i class="icon-chat"></i>
    <span class="title">Chat</span>
    <span class="icon-close" @click="signout"></span>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  methods: {
    signout() {

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
