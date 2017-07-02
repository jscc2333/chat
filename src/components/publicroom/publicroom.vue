<template>
  <div>
    <v-header :username="username"></v-header>
    <div class="public-room">
      <div class="user-wrapper" ref="userWrapper">
        <ul>
          <li v-for="(user,userIndex) in userList" :key="userIndex" class="user-item">
            <span class="name">{{user}}</span>
          </li>
        </ul>
      </div>
      <div class="room-wrapper">
        <chatbox :username="username" :newuser="newuser"></chatbox>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import header from '../header/header';
import chatbox from '../chatbox/chatbox';

export default {
  data() {
    return {
      username: '',
      userList: [],
      newuser: ''
    };
  },
  watch: {
    '$route': 'fetchData'
  },
  components: {
    'v-header': header,
    chatbox
  },
  created() {
    this.username = this.$route.params.username;
    this.$socket.emit('fetchList', { 'username': this.username });
    this.$socket.emit('iamOnline', { 'username': this.username });
    this.$root.eventHub.$on('timeover', () => {
      this.newuser = '';
    });
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.userWrapper, {
          click: true
        });
      } else {
        this.scroll.refresh();
      }
    });
  },
  methods: {
    fetchData() {
      this.username = this.$route.params.username;
    }
  },
  sockets: {
    provList(data) {
      if (!data.length) {
        console.log('当前没有用户在线');
      } else {
        data.forEach((user) => {
          this.userList.push(user.username);
        });
      }
    },
    someoneOnline(user) {
      this.newuser = user.username;
      this.userList.push(user.username);
    },
    someoneOffline(user) {
      console.log('offline');
      console.log(`${this.userList} ${user.username}`);
      let index = this.userList.indexOf(user.username);
      if (index !== -1) {
        this.userList.splice(index, 1);
      }
    }
  }
};
</script>

<style lang="less">
.public-room {
  display: flex;
  position: absolute;
  top: 44px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .user-wrapper {
    flex: 0 0 80px;
    background: #f3f5f7;
    .user-item {
      display: table;

      padding: 0 12px;
      line-height: 54px;
      width: 56px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .name {
        display: table-cell;
        vertical-align: middle;
        width: 56px;
        font-size: 20px;
        &:last-child {
          border: none;
        }
      }
    }
  }
  .room-wrapper {
    flex: 1
  }
}
</style>
