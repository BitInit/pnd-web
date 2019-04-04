<template>
  <el-header>
    <el-menu
      mode="horizontal"
      background-color="#4284f4"
      text-color="#fff">
      <div class="menu">
        <img src="@/assets/menu.png" @click="toggleAsideStatus" alt="切换主菜单">
        <span>全部文件</span>
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src="@/assets/user.jpeg">
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
  </el-header>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath, "4284f4");
    },
    toggleAsideStatus(){
      this.$store.commit('toggleAside')
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
*:focus{
  outline: none
}
.el-header {
  padding: 0px;
  box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
  .el-menu{
    padding: 0 25px;
  }
}
.menu {
  float: left;
  height: 60px;
  line-height: 60px;
  img {
    vertical-align: middle;
    cursor: pointer;
  }
  span {
    color: #fff;
    padding-left: 10px;
  }
}
.avatar-container{
  float: right;
  cursor: pointer;
  line-height: 60px;
  color: #fff;
  .avatar-wrapper{
    img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
}
.inlineBlock{
  text-decoration: none !important;
}
</style>
