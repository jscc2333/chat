<template>
  <div>
    <v-header></v-header>
    <div class="public-room">
      <div class="user-wrapper" ref="userWrapper">
        <ul>
          <li v-for="(item,index) in 20" :key="index" class="user-item">
            <span class="name">user{{item}}</span>
          </li>
        </ul>
      </div>
      <div class="room-wrapper">
        <chatbox></chatbox>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import header from '../header/header';
import chatbox from '../chatbox/chatbox';

export default {
  components: {
    'v-header': header,
    chatbox
  },
  created() {
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.userWrapper, {
          click: true
        });
      }
    });
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
