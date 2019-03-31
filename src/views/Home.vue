<template>
  <div class="main">
    <Header />
    <el-container class="main-body">
      <Aside />
      <router-view></router-view>
    </el-container>
  </div>
    
</template>

<script>
import Header from '@/views/layout/Header'
import Aside from '@/views/layout/Aside'
// import Main from '@/views/layout/Main'

export default {
  name: 'home',
  components: {
    Header, Aside
  }
}
</script>

<style>
.main{
  height: 100%;
}
.main-body{
  height: 100%;
  width: 100%;
}
</style>
