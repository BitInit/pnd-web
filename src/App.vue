<template>
  <div id="app">
    <router-view></router-view>
    <FileUpload></FileUpload>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload'
export default {
  name: 'app',
  components: {
    FileUpload
  }
}
</script>

<style lang="scss">
* {
  margin: 0px;
  padding: 0px;
}
html, body, #app {
  width: 100%;
  height: 100%;
}
</style>
