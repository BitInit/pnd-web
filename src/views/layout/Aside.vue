<template>
    <div class="aside" :style="{display: asideStatus}">
      <el-menu
        default-active="1"
        background-color="#fff"
        class="el-menu-vertical"
        text-color="#b5b4b4"
        active-text-color="#000">
        <el-menu-item index="1" @click="linkTo('/file')">
          <i class="el-icon-document"></i>
          <span slot="title">全部文件</span>
        </el-menu-item>
        <el-menu-item index="2" @click="linkTo('/white')">
          <i class="el-icon-delete"></i>
          <span slot="title">回收站</span>
        </el-menu-item>
      </el-menu>
    </div>
</template>

<script>
  export default {
    computed: {
      asideStatus () {
        return this.$store.state.asideStatus
      }
    },
    methods: {
      linkTo(url){
        this.$router.push({path: url})
      }
    }
  }
</script>

<style scoped>
.aside{
  padding-top: 10px;
  /* height: 100%; */
  width: 200px;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
}
</style>
