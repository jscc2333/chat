<template>
  <div class="login" v-show="flag">
    <div class="logo-wrapper">
      <h1 class="title">Chat</h1>
      <i class="icon-chat"></i>
    </div>
    <div class="login-wrapper">
      <form>
        <div class="name">
          <label for="name">用户名:</label>
          <input type="text" id="name" v-model="name" placeholder="请输入你的用户名" autofocus="true">
        </div>
        <div class="password">
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="password" @keyup.enter="submit($event)" placeholder="请输入密码">
        </div>
        <transition name="move">
          <div class="confirm-password" v-show="regist">
            <label for="cPassword">确认密码:</label>
            <input type="password" id="cPassword" v-model="cPassword" @keyup.enter="submit" placeholder="确认密码">
          </div>
        </transition>
        <div class="login-select">
          <span class="confirm" @click="submit($event)">{{optionButton}}</span>
          <span class="regist" @click="needRegist">{{option}}</span>
        </div>
        <div class="message">
          <transition name="fade">
            <span v-show="message" class="text">{{message}}</span>
          </transition>
        </div>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import router from '../../router';
  import { loadFromLocal, saveToLocal } from '../../common/js/store.js';

  const OPTION_TYPE_REGSIT = true;

  export default {
    data() {
      return {
        name: '',
        password: '',
        cPassword: '',
        message: '',
        regist: false,
        optionType: OPTION_TYPE_REGSIT,
        flag: true,
        submitNumber: 0
      };
    },
    watch: {
      // 监测name的值
      name: function () {
        this.password = '';
        let password = loadFromLocal(this.name);
        if (password) {
          // 若本地缓存存在密码，则自动补全密码
          this.password = password;
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.name && from.params.username) {
          vm.signout(from.params.username);
        }
      });
    },
    computed: {
      option() {
        return this.optionType ? '没有账户？点击注册' : '回到登录界面';
      },
      optionButton() {
        return this.optionType ? '登录' : '注册';
      }
    },
    methods: {
      signout(username) {
        this.$socket.emit('iamOffline', { 'username': username });
      },
      submit(event) {
        if (!this.submitNumber) {
          this.submitNumber += 1;
          console.log(this.submitNumber);
        } else {
          return;
        }
        let user = {
          'username': this.name,
          'password': this.password
        };
        if (this.optionType) {
          if (!(this.name && this.password)) {
            this.submitNumber = 0;
            return;
          }
          // 保存密码到本地存储
          saveToLocal(this.name, this.password);
          // 发布登录事件
          this.$socket.emit('login', user);
        } else {
          if (!(this.name && this.password && this.cPassword)) {
            this.submitNumber = 0;
            return;
          }
          if (this.password !== this.cPassword) {
            this.submitNumber = 0;
            this.message = '两次输入的密码不一致，请确认';
          } else {
            // 发布注册用户事件
            this.$socket.emit('regist', user);
          }
        }
      },
      needRegist() {
        this.name = '';
        this.password = '';
        this.cPassword = '';
        this.regist = !this.regist;
        this.optionType = !this.optionType;
      },
      needJump(status = false) {
        this.flag = !status;
        router.push(`room/${this.name}/public`);
      }
    },
    sockets: {
      loginMsg(data) {
        this.submitNumber = 0;
        data = JSON.parse(data);
        if (!data.status) {
          this.message = data.info;
        } else {
          this.message = '';
          this.needJump(data.status);
        }
      },
      registMsg(data) {
        this.submitNumber = 0;
        data = JSON.parse(data);
        if (!data.status) {
          this.message = data.info;
        } else {
          this.regist = false;
          this.optionType = true;
          this.message = '';
        }
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
      box-sizing: border-box;
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
      .message {
        padding: 10px;
        text-align: center;
        .text {
          margin-left: 33.5%;
          line-height: 14px;
          font-size: 12px;
          color: rgb(240, 20, 20);
          &.fade-enter {
            opacity: 0;
          }
          &.fade-enter-active {
            transition: all .5s ease-in;
          }
        }
      }
    }
  }
</style>
