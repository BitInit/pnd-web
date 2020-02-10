<template>
  <div class="header-container">
    <i v-if="asideVisiable" class="el-icon-s-fold icon"></i>
    <router-link to="/"><span class="name">个人网盘</span></router-link>
    <el-avatar :size="30" :src="require('@/assets/user.jpeg')"></el-avatar>
  </div>
</template>

<script>
export default {
  props: {
    asideVisiable: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/index.scss";
.header-container {
  width: 96%;
  margin: 0 auto;
  color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  .icon {
    font-size: 30px;
    cursor: pointer;
  }
  .name {
    padding-left: 6px;
  }
  .el-avatar {
    margin-left: auto;
    cursor: pointer;
  }
  a {
    @include linkTo;
  }
}
</style>