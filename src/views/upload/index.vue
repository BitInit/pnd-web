<template>
    <div>
        <div class="file-upload-layout" :class="[status === 'open'? 'open': 'close']">
            <div class="dialog-header" @click="operationWindow('collapse')">
                <span class="dialog-header-title">文件上传</span>
                <div class="dialog-control">
                    <span @click="operationWindow('collapse')">-</span>
                    <span @click.stop.prevent="operationWindow('close')">x</span>
                </div>
            </div>
            <div class="dialog-body">
                <el-table
                    :data="tableData"
                    height=360
                    style="width: 100%">
                    <el-table-column
                        prop="fileName"
                        label="文件名"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="size"
                        label="大小"
                        :formatter="formatterSize"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="targetFolderName"
                        label="上传目录">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态">
                        <template slot-scope="scope">
                            <FileUploadStatus :fileStatus="scope.row.status" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <i @click="statusChange(scope.row, 'prepare')" v-if="scope.row.status === 'pause' && scope.row.status !== 'success'" class="el-icon-caret-right file-upload-operation"></i>
                            <span @click="statusChange(scope.row, 'paused')" title="暂停" v-else-if="scope.row.status !== 'success'" class="file-upload-operation file-upload-suspend"></span>
                            <i @click="deleteFile(scope.row)" title="删除" class="el-icon-close file-upload-operation"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="file-upload-layout collapse-header" @click="operationWindow('open')" :class="[status === 'collapse'? 'collapse': 'close']">
            <div class="dialog-header">
                <span class="dialog-header-title">文件上传</span>
                <div class="dialog-control">
                    <span @click="operationWindow('open')">□</span>
                    <span @click.stop.prevent="operationWindow('close')">x</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatterFileSize, getPercent } from '@/util/common_utils.js'
import {fileFingerPoint} from '@/util/crc32_utils.js'
import FileUploadStatus from '@/views/upload/FileUploadStatus'
import {getConfig, resourceExist, createFile, prepareFileUpload, fileUpload} from '@/api/resource.js'
import {mapState} from 'vuex'
export default {
    components: {
        FileUploadStatus
    },
    data() {
        return {
            tableData: [],
            maxConcurrentUploadNumbers: 3,
            chunkByteSize: 10485760,
            clientId: ''
        }
    },
    computed: {
        ...mapState({
            status: state => state.fileUploadComponentStatus
        })
    },
    watch: {
        '$store.state.fileUploadList' (val) {
            this.addFileUploadList(val)
        }
    },
    methods: {
        operationWindow(status) {
            if (status === 'close'){
                let unfinishedTask = 0
                for (let i = 0; i < this.tableData.length; i++){
                    if (this.tableData[i].status !== 'success'){
                        unfinishedTask++
                    }
                }
                if (unfinishedTask !== 0){
                    this.$confirm('还有 ' + unfinishedTask + ' 个未完成的上传任务，是否确定取消？', '取消上传', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$store.commit('operationFileUploadWindow', 'close')
                    }).catch(() => {});
                } else {
                    this.$store.commit('operationFileUploadWindow', 'close')
                }
            } else {
                this.$store.commit('operationFileUploadWindow', status)
            }
        },
        formatterSize(row){
            return formatterFileSize(row.size)
        },
        statusChange (row, status){
            for (let i = 0; i < this.tableData.length; i++){
                if (this.isEqualsOfFiles(this.tableData[i], row)){
                    this.tableData[i].status = status
                    break
                }
            }
        },
        deleteFile (row){
            this.$confirm('确定删除该条上传信息吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let i = 0
                for (; i < this.tableData.length; i++){
                    if (this.isEqualsOfFiles(this.tableData[i], row)){
                        break
                    }
                }
                if (i !== this.tableData.length){
                    let rest = this.tableData.slice(i + 1)
                    this.tableData.length = i
                    this.tableData.push.apply(this.tableData, rest)
                }
            }).catch(() => {});
        },
        addFileUploadList(val){
            let pendingFileIds = []
            for (let i = 0; i < val.length; i++){
                let fileName = val[i].file.name, size = val[i].file.size, targetFolderName = val[i].targetFolderName
                let  file = val[i].file, folderId = val[i].folderId
                let j = 0
                for (; j < this.tableData.length; j++){
                    if (this.isEqualsOfFiles(this.tableData[j], {fileName, size})){
                        break
                    }
                }
                if (j === this.tableData.length){
                    let pendingFile = {
                        folderId,
                        fileName,
                        size,
                        targetFolderName,
                        status: 'check',
                        blob: file
                    }
                    this.tableData.push(pendingFile)
                    pendingFileIds.push(j)
                }
            }
            if (pendingFileIds.length > 0){
                for (let id in pendingFileIds){
                    let pendingFileId = pendingFileIds[id], 
                        data = this.tableData[pendingFileId], 
                        that = this
                    fileFingerPoint(this.tableData[pendingFileId].blob, function(fingerPrint){
                        resourceExist(fingerPrint).then((response) => {
                            if (response.data.exist){
                                let file = {
                                    resourceId: response.data.resourceId,
                                    name: data.fileName,
                                    parentId: data.folderId
                                }
                                createFile(file).then(() => {
                                    data.status = 'success'
                                    that.$store.commit('flushFileListEvent')
                                })
                            } else {
                                prepareFileUpload(that.clientId, data.size, fingerPrint, data.fileName, data.folderId).then((response) => {
                                    data.resourceId = response.data.resourceId
                                    data.status = 'prepareUpload'
                                    that.fileUploadProcess()
                                })
                            }
                        })
                    })
                }
            }
        },
        fileUploadProcess () {
            // 上传文件达到最大限制数
            let canUploadFileNumber = this.maxConcurrentUploadNumbers - this.numberOfCurrentlyUploading()
            for (let fileId in this.tableData){
                if (canUploadFileNumber > 0 && this.tableData[fileId].status === 'prepareUpload'){
                    canUploadFileNumber--
                    this.tableData[fileId].finishedUploadBytes = 0
                    this.tableData[fileId].status = 'uploading'
                    this.go(fileId, this.tableData[fileId])
                }
            }
        },
        // 文件分块上传
        go (fileId, pendingFile) {
            let end = pendingFile.finishedUploadBytes + this.chunkByteSize
            if (end > pendingFile.blob.size){
                end = pendingFile.blob.size
            }

            var chunk = pendingFile.blob.slice(pendingFile.finishedUploadBytes, end),
                reader = new FileReader(), that = this
            var formData = new FormData()
                    formData.set('resourceId', pendingFile.resourceId)
                    formData.set('clientId', this.clientId)
                    formData.append('file', chunk)
            reader.onloadend = function(e){
                if (e.target.readyState == FileReader.DONE){
                    fileUpload(formData).then((response) => {
                        that.tableData[fileId].finishedUploadBytes = response.data.completeBytes
                        if (response.data.code !== 0){ //暂停
                            that.tableData[fileId].status = 'pause'
                            that.fileUploadProcess()
                        } else {
                            if (response.data.completeBytes === pendingFile.size){
                                that.tableData[fileId].status = 'success'
                                that.fileUploadProcess()
                                that.$store.commit('flushFileListEvent')
                            } else {
                                that.tableData[fileId].status = getPercent(response.data.completeBytes, pendingFile.size)
                                that.go(fileId, pendingFile)
                            }
                        }
                    })
                }
            }
            reader.readAsBinaryString(chunk)
        },
        numberOfCurrentlyUploading () {
            let numberOfUploadsBeingProcessed = 0
            for (let fileId in this.tableData){
                var pendingFile = this.tableData[fileId]
                if (pendingFile.status === 'uploading'){
                    numberOfUploadsBeingProcessed++
                }
            }
            return numberOfUploadsBeingProcessed
        },
        isEqualsOfFiles (f, s){
            if (f.fileName === s.fileName && f.size === s.size){
                return true
            }
            return false
        }
    },
    created () {
        getConfig().then((response) => {
            this.maxConcurrentUploadNumbers = response.data.maxConcurrentUploadNumbers
            this.chunkByteSize = response.data.chunkByteSize
            this.clientId = response.data.clientId
            this.addFileUploadList(this.$store.state.fileUploadList)
        })
    }
}
</script>

<style lang="scss" ref="stylesheet/scss" scoped>
.close {
    display: none;
}
.open, .collapse {
    display: block;
}
.file-upload-layout{
    position: fixed;
    bottom: 0px;
    right: 20px;
    left: auto;
    top: auto;
    width: 600px;
    height: 400px;
    z-index: 40;
    background-color: #fff;
    box-shadow: 0 0 10px #ccc;
    border-radius: 7px;
}
.collapse-header{
    height: 40px;
}
.dialog-header {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border-bottom: 1px solid rgb(221, 218, 218);
    .dialog-header-title {
        color: #666;
        font-size: 16px;
    }
    .dialog-control {
        float: right;
        span {
            margin-right: 15px;
            cursor: pointer;
            font-size: 20px;
            font-weight: 400;
        }
    }
}
.file-upload-operation {
    cursor: pointer;
    display: inline-block;
    margin-right: 5px;
    font-size: 16px;
}
.file-upload-operation:hover{
    color: #3794ff;
}
.file-upload-suspend {
    width: 16px;
    height: 16px;
    background-image: url('../../assets/suspend.png')
}
.file-upload-suspend:hover {
    background-image: url('../../assets/suspend_hover.png')
}
</style>
