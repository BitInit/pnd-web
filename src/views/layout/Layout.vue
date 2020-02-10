<template>
  <el-container class="app-container">
    <el-header height="50px">
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Aside></Aside>
      </el-aside>
      <el-main>
        <div class="main-container">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/views/layout/Header'
import Aside from '@/views/layout/Aside'

export default {
  name: 'Layout',
  components: { Header, Aside }
}
</script>

<style lang="scss" scoped>
@import "src/styles/layout.scss";
</style>