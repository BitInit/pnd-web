<template>
  <div class="global-uploader">
    <uploader :options="options" ref="uploaderFile" :auto-start="true" class="uploader-app"
        :file-status-text="statusText"
        @file-added="onFileAdded"
        @file-progress="onFileProgress"
        @file-success="onFileSuccess"
        @file-error="onFileError">
      <uploader-unsupport></uploader-unsupport>
      <uploader-btn id="global-uploader-btn" ref="uploadFileBtn">选择文件</uploader-btn>

      <uploader-list v-show="panelShow">
        <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
          <div class="file-title">
            <span>上传文件列表</span>
            <div class="operate">
              <el-button @click="fileListShow" type="text" :title="collapse? '展开':'折叠' ">
                <i :class="collapse? 'el-icon-full-screen': 'el-icon-minus'"></i>
              </el-button>
              <el-button @click="close" type="text" title="关闭">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
          </div>

          <ul class="file-list" v-if="!collapse">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
            </li>
            <div class="no-file" v-if="!props.fileList.length"><i class="el-icon-folder"></i> 暂无待上传文件</div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
import Uploader from './uploader/uploader'
import UploaderUnsupport from './uploader/unsupport'
import UploaderBtn from './uploader/btn'
import UploaderList from './uploader/list'
import UploaderFile from './uploader/file'
import {resourceUploadUrl, mergeResource} from '@/apis/resource'

export default {
  components: {
    Uploader, UploaderUnsupport, UploaderBtn, UploaderList, UploaderFile
  },
  props: {
    parentId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      fileMap: {},
      options: {
        target: resourceUploadUrl(), // 目标上传 URL
        chunkSize: '2048000',   //分块大小
        fileParameterName: 'file', //上传文件时文件的参数名，默认file
        maxChunkRetries: 3,  //最大自动失败重试上传次数
        testChunks: true,     //是否开启服务器分片校验
        simultaneousUploads: 3,
        // 服务器分片校验函数，秒传及断点续传基础
        // checkChunkUploadedByResponse: function (chunk, message) {
        //   let objMessage = JSON.parse(message);
        //   if (objMessage.skipUpload) {
        //     return true;
        //   }

        //   return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
        // },
      },
      statusText: {
        success: '成功了',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
      panelShow: false,   //选择文件后，展示上传panel
      collapse: false,
    }
  },
  computed: {
    uploader() {
      return this.$refs.uploaderFile.uploader;
    }
  },
  methods: {
    onFileAdded () {
      this.fileMap[arguments[0].uniqueIdentifier] = this.$store.state.folderId
      this.panelShow = true;
      this.computeMD5(arguments[0]);
    },
    onFileProgress(rootFile, file, chunk) {
      // eslint-disable-next-line no-console
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess () {
      let file = arguments[0].file,
          resource = {
            fileName: file.name,
            size: file.size,
            identifier: arguments[0].uniqueIdentifier,
            parentId: this.fileMap[arguments[0].uniqueIdentifier],
          }
      mergeResource(resource).then(() => {
        window.eventBus.$emit('flushFileList', this.fileMap[arguments[0].uniqueIdentifier])
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '文件合并失败，请重新上传'
        })
      })
    },
    onFileError() {

    },
    fileListShow() {
      this.collapse = !this.collapse
    },
    computeMD5 (file) {
      file
    },
    close() {
      this.uploader.cancel();
      this.panelShow = false;
    },
  },
  mounted() {
    window.eventBus.$on('openUploader', query => {
      this.params = query || {};
      if (this.$refs.uploadFileBtn) {
          this.$refs.uploadFileBtn.$el.click();
      }
    })
  },
  destroyed () {
    window.eventBus.$off('openUploader')
  }
}
</script>

<style lang="scss" scoped>
.global-uploader {
  position: fixed;
  z-index: 200;
  right: 15px;
  bottom: 5px;

  .uploader-app {
    width: 520px;
  }

  .file-panel {
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 7px 7px 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);

    .file-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      font-size: 14px;
      border-bottom: 1px solid #ddd;

      .operate {
        flex: 1;
        text-align: right;
      }
    }

    .file-list {
      position: relative;
      height: 240px;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;

      > li {
        background-color: #fff;
      }
    }

    &.collapse {
      .file-title {
        background-color: #E7ECF2;
      }
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  .uploader-file-icon {
    &:before {
      content: '' !important;
    }

    &[icon=image] {
      background-image: url(../assets/file_icons.png);
      background-position: -596px -306px;
    }
    &[icon=video] {
      background: url(../assets/file_icons.png) !important;
      background-position: -596px -1630px !important;
    }
    &[icon=document] {
      background: url(../assets/text-icon.png);
    }
  }

  .uploader-file-actions > span {
    margin-right: 6px;
  }
}

/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>