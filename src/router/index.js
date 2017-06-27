import Vue from 'vue';
import Router from 'vue-router';
import login from '../components/login/login.vue';
import publicroom from '../components/publicroom/publicroom.vue';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/publicroom',
    name: 'publicroom',
    component: publicroom
  }
  ]
});
