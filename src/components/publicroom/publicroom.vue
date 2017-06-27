<template>
  <div>
    <v-header></v-header>
    <div class="public-room">
      <div class="user-wrapper">
        <ul>
          <li v-for="(item,index) in 20" :key="index" class="user-item">
            <span>{{item}}</span>
          </li>
        </ul>
      </div>
      <div class="room-wrapper">
  
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import header from '../header/header';

export default {
  components: {
    'v-header': header
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
    background: rgb(0, 160, 220);
    .user-item {
      display: table;
      line-height: 20px;
      font-size: 20px;
    }
  }
  .room-wrapper {
    flex: 1
  }
}
</style>
