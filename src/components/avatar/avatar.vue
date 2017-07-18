<template>
  <div class="avatar">
    <div class="user-wrapper" @click="showInformation">
      <img src="../../assets/account.png" width="32" height="32">
      <span class="username">{{username}}</span>
    </div>
    <div class="user-information" :show="show">
      <ul>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      show: false,
      information: {}
    }
  },
  props: {
    username: {
      type: String
    }
  },
  created() {
    this.socket.$emit();
  },
  methods: {
    showInformation() {
      this.show = true;
    }
  }
};
</script>

<style lang="less">

</style>
