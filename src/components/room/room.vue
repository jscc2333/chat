<template>
  <div class="room">
    <v-header :username="username" :userAvatar="userAvatar" :avatarDetail="userAvatarDetail"></v-header>
    <!-- <router-link to="public"></router-link> -->
    <!-- <router-link to="private"></router-link> -->
    <router-link to="/room/username/public"></router-link>
    <router-link to="/room/usernanme/private/chatuser"></router-link>
    <transition name="slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import router from '../../router';
  import header from '../header/header';
  import chatbox from '../chatbox/chatbox';
  import information from '../information/information';
  import { loadMessage } from '../../common/js/store.js';

  export default {
    data() {
      return {
        username: '',
        userAvatar: '',
        userAvatarDetail: ''
      };
    },
    components: {
      'v-header': header,
      chatbox,
      information
    },
    created() {
      // 获取路由信息
      this.username = this.$route.params.username;
      // 获取用户头像
      this.$socket.emit('fetchAvatar', { 'username': this.username });
    },
    destroyed() {
      // 移除页面重载事件
      window.removeEventListener('unload', this.unloadHandler);
    },
    mounted() {
      // 添加页面重载事件
      window.addEventListener('unload', this.unloadHandler);
    },
    methods: {
      unloadHandler(e) {
        this.$socket.emit('iamOffline', { 'username': this.username });
      }
    },
    sockets: {
      provAvatar(data) {
        this.userAvatar = data;
        this.userAvatarDetail = `${this.userAvatar.slice(0, -4)}_detail.png`;
      },

      updateAvatarSuccessful(data) {
        this.userAvatar = data;
        this.userAvatarDetail = `${this.userAvatar.slice(0, -4)}_detail.png`;
      }
    }
  };
</script>

<style lang="less">
  .room{
    .slide-enter,
    .slide-leave-active{
      opacity: 0;
    }
    .slide-enter-active,.slide-leave-active{
      transition: all .3s linear;
    }
  }
</style>
