<template>
  <div id="app">
    <router-view></router-view>
    <FileUpload v-if="$store.state.fileUploadComponentStatus !== 'close'"/>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload'

export default {
  components: {
    FileUpload
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: hidden;
}

#app {
  height: 100%;
  font: 300 1em/1.8 PingFang SC,Lantinghei SC,Microsoft Yahei,Hiragino Sans GB,Microsoft Sans Serif,WenQuanYi Micro Hei,Helvetica,sans-serif;
}
</style>