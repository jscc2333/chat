<template>
  <div class="login">
    <div class="logo-wrapper">
      <h1 class="title">Chat</h1>
      <i class="icon-chat"></i>
    </div>
    <div class="login-wrapper">
      <form>
        <div class="name">
          <label for="name">用户名:</label>
          <input type="text" id="name" v-model="name">
        </div>
        <div class="password">
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="password">
        </div>
        <transition name="move">
          <div class="confirm-password" v-show="regist">
            <label for="cPassword">确认密码:</label>
            <input type="password" id="cPassword" v-model="cPassword">
          </div>
        </transition>
        <div class="login-select">
          <span class="confirm" @click="login">登录</span>
          <span class="regist" @click="needRegist">{{message}}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const MESSAGE_TYPE_REGSIT = true;

export default {
  data() {
    return {
      name: '',
      password: '',
      cPassword: '',
      regist: false,
      messageType: MESSAGE_TYPE_REGSIT
    };
  },
  computed: {
    message() {
      return this.messageType ? '没有账户？点击注册' : '回到登录界面';
    }
  },
  methods: {
    login() {
      console.log(`${this.name}  ${this.password}  ${this.cPAssword}`);
    },
    needRegist() {
      this.regist = !this.regist;
      this.messageType = !this.messageType;
    }
  }
};
</script>

<style lang="less">
.login {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .logo-wrapper {
    line-height: 50px;
    width: 100%;
    height: 110px;
    text-align: center;
    .title {
      font-size: 50px;
      font-weight: 700;
      font-style: italic;
      color: rgb(0, 160, 220);
    }
    .icon-chat {
      font-size: 50px;
    }
  }
  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    line-height: 16px;
    width: 100%;
    height: 50%;
    font-size: 0px;
    .name,
    .password,
    .confirm-password {
      margin-bottom: 25px;
      font-size: 16px;
      label {
        text-align: left;
        padding: 3px;
        display: inline-block;
        width: 80px;
      }
      input {
        padding: 3px;
        border: 1px solid rgba(7, 17, 27, 0.1);
        border-radius: 10px;
        font-size: 16px;
      }
    }
    .move-enter,
    .move-leave-active {
      opacity: 0;
      transform: translateX(-100%);
    }
    .move-enter-active,
    .move-leave-active {
      transition: all 1s linear;
    }
    .login-select {
      text-align: center;
      .confirm {
        display: block;
        padding: 2px 4px;
        background: rgb(0, 160, 220);
        border-radius: 10px;
        line-height: 16px;
        margin: 0 0 10px 33.5%;
        width: 60%;
        font-size: 16px;
        color: #fff;
      }
      .regist {
        margin: 0 0 10px 33.5%;
        cursor: pointer;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }
  }
}
</style>
