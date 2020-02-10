<template>
  <el-container class="app-container">
    <el-header height="50px">
      <Header :asideVisiable="false"></Header>
    </el-header>
    <el-container>
      <el-main>
        <div class="video-container">
          <div class="header">
            <div class="video-title">
              {{ title }}
            </div>
            <div class="other">
               <el-link type="primary" @click="download">下载</el-link>
            </div>
          </div>
          <div class="video-content">
            <div id="video-player"></div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import 'dplayer/dist/DPlayer.min.css';
import DPlayer from 'dplayer';

import Header from '@/views/layout/Header'
import {getFile, downloadFileUrl} from '@/apis/file'

export default {
  components: { Header },
  props: {
    fileId: {
      type: String,
      required: true
    }
  },
  data (){
    return {
      title: '',
      videoSrc: downloadFileUrl(this.fileId),
      dp: null
    }
  },
  mounted () {
    getFile(this.fileId).then(response => {
      this.title = response.data.fileName
      this.dp = new DPlayer({
        container: document.getElementById('video-player'),
        video: {
          url: downloadFileUrl(this.fileId)
        }
      })
    }).catch(() => {})
  },
  methods: {
    download () {
      let tag = document.createElement('a')
      tag.setAttribute('href', downloadFileUrl(this.fileId))
      tag.click()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/layout.scss";
.video-container {
  width: 980px;
  height: 100%;
  margin: 0 auto;
  .header {
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
  }
  .video-content {
    width: 980px;
  }
}
</style>