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
                            <FileUploadStatus :fileStatus="scope.row.status" :description="scope.row.description" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <i @click="resumeFileUpload(scope.row.id)" title="恢复上传" v-if="scope.row.status === 'paused'" class="el-icon-caret-right file-upload-operation"></i>
                            <span @click="pauseFile(scope.row.id)" title="暂停" v-else-if="scope.row.status !== 'success'" class="file-upload-operation file-upload-suspend"></span>
                            <i @click="deleteFile(scope.row.id)" title="删除" class="el-icon-close file-upload-operation"></i>
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
import { formatterFileSize } from '@/util/common_utils.js'
import FileUploadStatus from '@/views/upload/FileUploadStatus'
import {getConfig} from '@/api/resource.js'
import {mapState} from 'vuex'
import { FileUploader } from '@/views/upload/FileUploader.js'

export default {
    components: {
        FileUploadStatus
    },
    data() {
        return {
            tableData: [],
            fileUploader: null
        }
    },
    computed: {
        ...mapState({
            status: state => state.fileUploadComponentStatus
        })
    },
    watch: {
        '$store.state.fileUploadList' (newFiles) {
            this.fileUploader.addNewFiles(newFiles)
        }
    },
    methods: {
        operationWindow(status) {
            if (status === 'close'){
                let unfinishedTask = 0
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].status !== 'success') {
                        unfinishedTask++
                    }
                }
                if (unfinishedTask !== 0){
                    this.$confirm('还有 ' + unfinishedTask + ' 个未完成的上传任务，是否确定取消？', '取消上传', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.fileUploader.pauseAll()
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
        pauseFile (id){
            this.fileUploader.pause(id)
        },
        resumeFileUpload (id){
            this.fileUploader.resume(id)
        },
        deleteFile (id){
            var that = this
            this.$confirm('确定删除该条上传信息吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.fileUploader.delete(id)
            }).catch(() => {});
        }
    },
    created () {
        var that = this
        getConfig().then((response) => {
            that.fileUploader = new FileUploader(response.data.maxConcurrentUploadNumbers,
                response.data.chunkByteSize, response.data.clientId, that.tableData, function (){
                    that.$store.commit('flushFileListEvent')
                })
            that.fileUploader.addNewFiles(that.$store.state.fileUploadList)
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
