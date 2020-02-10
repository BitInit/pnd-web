<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="box">
          <div class="info-header">
            磁盘
          </div>
          <div class="info-body clearfix">
            <div class="border-right col-3">
              <span class="info-body-header">系统总容量</span>
              <br>
                <span class="text-primary">{{ totalCap }}</span>
              <span class="mark">GB</span>
            </div>
            <div class="border-right col-3">
              <span class="info-body-header">已使用</span>
              <br>
              <span class="text-success">{{ usedCap }}</span>
              <span class="mark">GB</span>
            </div>
            <div class="col-3">
              <span class="info-body-header">剩余</span>
              <br>
              <span class="text-success">{{ freeCap }}</span>
              <span class="mark">GB</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="info-row" :gutter="20">
      <el-col :span="24">
        <div class="box">
          <div class="info-header">
            系统文件信息
          </div>
          <div class="info-body clearfix">
            <div class="border-right col-3">
              <span class="info-body-header">文件与文件夹数</span>
              <br>
              <span class="text-primary">{{ totalNum }}</span>
            </div>
            <div class="border-right col-3">
              <span class="info-body-header">文件夹数</span>
              <br>
              <span class="text-success"> {{ folderNum }}</span>
            </div>
            <div class="col-3">
              <span class="info-body-header">文件数</span>
              <br>
              <span class="text-success">{{ fileNum }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="info-row" :gutter="20">
      <el-col :span="8">
        <div class="box">
          <div class="info-header">
            视频数
          </div>
          <div class="info-body clearfix">
            <span class="text-success">{{ videoNum }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="box">
          <div class="info-header">
            音频数
          </div>
          <div class="info-body clearfix">
            <span class="text-success">{{ audioNum }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="box">
          <div class="info-header">
            其他文件数
          </div>
          <div class="info-body clearfix">
            <span class="text-success">{{ otherNum }}</span>
          </div>
        </div>
      </el-col>
  </el-row>
  </el-main>
</template>

<script>
import { systemInfo } from '@/apis/system'

export default {
  data () {
    return {
      totalCap: 0,
      usedCap: 0,
      freeCap: 0,
      totalNum: 0,
      folderNum: 0,
      fileNum: 0,
      videoNum: 0,
      audioNum: 0,
      otherNum: 0
    }
  },
  methods: {
    formatToGB (size, pointLength) {
      if (size) {
        let result = size / 1024 / 1024 / 1024
        return result.toFixed( pointLength || 2 )
      }
      return '-'
    }
  },
  mounted () {
    systemInfo().then(response => {
      this.totalCap = this.formatToGB(response.data.totalCap, 2)
      this.usedCap = this.formatToGB(response.data.totalCap - response.data.usableCap, 2)
      this.freeCap = this.formatToGB(response.data.usableCap, 2)
      this.totalNum = response.data.totalNum
      this.folderNum = response.data.folderNum
      this.fileNum = response.data.fileNum
      this.videoNum = response.data.videoNum
      this.audioNum = response.data.audioNum
      this.otherNum = response.data.fileNum - response.data.videoNum - response.data.audioNum
    }).catch(() => {})
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  font-size: 16px;
  font-weight: 300;
}
.info-row {
  padding-top: 30px;
}
.box {
  border: 1px solid #dddddd;
  text-align: center;
}
.info-header {
  color: #333333;
  background-color: #f9f9f9;
  height: 30px;
  line-height: 30px;
}
.info-body {
  padding: 10px 0;
  .info-body-header {
    font-size: 14px;
  }
}
.col-3 {
  float: left;
  width: 33%;
}
.col-2 {
  float: left;
  width: 49%;
}
.text-primary{
  color: #09C !important;
  font-size: 30px;
  cursor: pointer;
}
.text-success {
  color: #090 !important;
  font-size: 30px;
  cursor: pointer;
}
.text-warn {
  color: red !important;
  font-size: 30px;
  cursor: pointer;
}
.border-right {
  border-right: 1px solid #dddddd;
}
.clearfix {
  clear: both;
}
.clearfix:after{
  content: "020"; 
  display: block; 
  height: 0; 
  clear: both; 
  visibility: hidden;  
}
.mark{
  font-size: 18px;
  padding-left: 5px;
}
</style>