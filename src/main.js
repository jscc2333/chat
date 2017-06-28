// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import socket from 'vue-socket.io';
Vue.config.productionTip = false;

router.push('login');
Vue.use(socket, 'http://localhost:3000');
import './common/less/index.less';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  sockets: {
    connect() {
      console.log('socket connected');
    }
  }
});
