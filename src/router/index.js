import Vue from 'vue';
import Router from 'vue-router';
import login from '../components/login/login.vue';
import room from '../components/room/room.vue';
import vprivate from '../components/private/private.vue';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/room/:username',
    name: 'room',
    component: room
  },
  {
    path: '/room/:username/private/:chatuser',
    name: 'private',
    component: vprivate
  }
  ]
});
