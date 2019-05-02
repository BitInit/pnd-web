<template>
    <el-main>
        <div class="main-button">
            <div class="upload" @click="triggerFileUpload">
                <el-button type="primary">
                    <i class="el-icon-upload"></i>
                    <span>上传文件</span>
                </el-button>
                <input type="file" @change="dealWithFileUpload" ref="fileInput" name="file" multiple class="upload-input">
            </div>
            <el-button plain @click="createFolder">
                <i class="el-icon-document"></i>
                <span>新建文件夹</span>
            </el-button>
        </div>
        <div class="content">
            <Breadcrumb />
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                :default-sort = "{prop: 'fileName', order: 'descending'}"
                style="width: 100%">
                <el-table-column
                    label="文件名"
                    prop="name"
                    sortable
                    min-width="54">
                    <template slot-scope="scope">
                        <FileIcon :type="scope.row.type"></FileIcon>
                        <a class="file-name" @click="getFileList(scope.row.id, scope.row.name)" v-if="scope.row.type === 'folder'">
                            {{scope.row.name}}
                        </a>
                        <a class="file-name" target="_blank" @click="openVideo(scope.row.resourceId, scope.row.name)" v-else-if="scope.row.type === 'video'">
                            {{scope.row.name}}
                        </a>
                        <a class="file-name" :href="baseURL + 'v1/rs/' + scope.row.resourceId + '?fileName=' + scope.row.name" v-else>
                            {{scope.row.name}}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="size"
                    label="大小"
                    :formatter="formatterSize"
                    min-width="22">
                </el-table-column>
                <el-table-column
                    prop="gmtModified"
                    label="修改日期"
                    sortable
                    min-width="22"
                    :formatter="formatterTime"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column 
                    label="操作"
                    min-width="22">
                    <template slot-scope="scope">
                        <FileOperation v-on:flush="flushAccordingToLevelList" :scope="scope" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <FileTree v-on:flush="flushAccordingToLevelList" v-if="$store.state.fileTreeDialogVisible" />
    </el-main>
</template>

<script>
import FileIcon from '@/components/FileIcon'
import Breadcrumb from '@/components/Breadcrumb'
import FileOperation from '@/views/home/FileOperation'
import FileTree from '@/views/home/FileTree'
import { fetchFileList, createNewFolder } from '@/api/resource'
import { formatterMillisecond, formatterFileSize, baseUrl } from '@/util/common_utils'

export default {
    components: {
        FileIcon, Breadcrumb, FileOperation, FileTree
    }, 
    data(){
        return {
            tableData: [],
            fileTreeDialogVisible: false,
            dialogVisible: '设置',
            baseURL: baseUrl
        }
    },
    computed: {
        levelList () {
            return this.$store.state.levelList
        }
    },
    watch: {
        levelList (){
            this.flushAccordingToLevelList()
        },
        '$store.state.flushFileListEvent' (){
            this.flushAccordingToLevelList()
        }
    },
    methods: {
        createFolder (){
            let parentId = this.levelList[this.levelList.length - 1].parentId
            // TODO 文件夹名校验
            this.$prompt('请输入文件夹名', '新建文件夹', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({value}) => {
                createNewFolder(parentId, value).then(() => {
                    this.flushAccordingToLevelList()
                })
            }).catch(() => {})
        },
        getFileList (parentId, name){
            fetchFileList(parentId).then(response => {
                this.tableData = response.data
                let len = this.levelList.length
                if (len !== 0 && this.levelList[len - 1].parentId === parentId){
                    return
                }
                this.$store.commit('pushLevelList', {
                    parentId: parentId,
                    name: name
                })
            })
        },
        openVideo (resourceId, fileName) {
            var src = this.baseURL + 'v1/rs/' + resourceId +'?fileName=' + fileName
            var supportVideo = ['mp4', 'ogg', 'mkv']
            var fileInfo = fileName.split('.'), suffix = fileInfo[fileInfo.length - 1]
            if (supportVideo.some((item) => {
                return item === suffix
            })){
                let page = window.open()
                let html="<head><title>视频播放</title></head><body style='background:black'><div style='width:80%; height: 80%; margin:60px auto;'><video style='display:inline-block;margin: 0 auto' controls height='80%' width='80%' autoplay src='" + src + "'></video></div></body>"
                page.document.write(html)
            } else {
                this.$confirm('该视频浏览器不支持播放，是否下载？', '下载', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var a = document.createElement('a')
                    a.href = src
                    a.click()
                }).catch(() => {});
            }
        },
        flushAccordingToLevelList (){
            let lastVal = this.levelList[this.levelList.length - 1]
            this.getFileList(lastVal.parentId, lastVal.name)
        },
        formatterTime (row){
            return formatterMillisecond(new Date(row.gmtModified))
        },
        formatterSize (row){
            if (row.type === 'folder'){
                return '-'
            }
            return formatterFileSize(row.size)
        },
        triggerFileUpload () {
            this.$refs.fileInput.click()
        },
        dealWithFileUpload (event){
            this.$store.commit('clearFileUploadList')
            let files = event.target.files
            let target = this.levelList[this.levelList.length - 1]
            Array.from(files).forEach( file => {
                let fileInfo = {
                    targetFolderId: target.parentId,
                    targetFolderName: target.name,
                    file: file
                }
                this.$store.commit('addUploadFile', fileInfo)
                this.$store.commit('operationFileUploadWindow', 'open')
            })
        }
    },
    created() {
        if (this.levelList.length === 0){
            this.getFileList(0, '全部文件')
        } else {
            this.flushAccordingToLevelList()
        }
    }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
.el-main{
    margin-bottom: 50px;
}
.upload {
    display: inline-block;
    margin-right: 10px;
    .upload-input{
        display: none;
    }
}
.content{
    margin-top: 20px;
    .content-table{
        margin-top: 10px;
    }
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.file-name{
    display: inline-block; 
    padding-left: 5px;
    text-decoration: none;
    color: #000;
    cursor: pointer;
}
.file-name:hover{
    color: #3794ff;
}
</style>
