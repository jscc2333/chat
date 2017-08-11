<template>
  <div id="app">
    <router-link to="/login"></router-link>
    <router-link to="/room/username"></router-link>
    <transition name="router" mode="out-in">
    <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
#app {
  .router-enter-active,
  .router-leave-active {
    transition: all .5s linear;
  }
  .router-enter,
  .router-leave-active {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
