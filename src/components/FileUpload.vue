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
                        prop="targetFolder"
                        label="上传目录">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态">
                        <template scope="scope">
                            <i v-if="scope.row.status === 'success'" class="el-icon-success" style="color: #3794ff;"></i>
                            <span v-else-if="scope.row.status === 'check'">检查中...</span>
                            <span v-else-if="scope.row.status === 'prepare'">等待中...</span>
                            <span v-else-if="scope.row.status === 'pause'">已暂停</span>
                            <span v-else>{{ scope.row.status }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template scope="scope">
                            <i @click="statusChange(scope.row, 'prepare')" v-if="scope.row.status === 'pause' && scope.row.status !== 'success'" class="el-icon-caret-right file-upload-operation"></i>
                            <span @click="statusChange(scope.row, 'pause')" title="暂停" v-else-if="scope.row.status !== 'success'" class="file-upload-operation file-upload-suspend"></span>
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
import { formatterFileSize } from '@/util/common_utils.js'
import {fileFingerPoint} from '@/util/crc32_utils.js'
import {resourceExist} from '@/api/resource.js'
import {mapState} from 'vuex'
export default {
    data() {
        return {
            tableData: [],
            maxConcurrentUploadNumbers: 3,
            chunkByteSize: 10485760
        }
    },
    computed: {
        ...mapState({
            status: state => state.fileUploadComponentStatus,
            fileUploadList: state => state.fileUploadList
        })
    },
    watch: {
        fileUploadList (val) {
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
                let fileName = val[i].file.name, size = val[i].file.size, targetFolder = val[i].targetFileName
                let  file = val[i].file, targetId = val[i].targetId
                let j = 0
                for (; j < this.tableData.length; j++){
                    if (this.isEqualsOfFiles(this.tableData[j], {fileName, size})){
                        break
                    }
                }
                if (j === this.tableData.length){
                    let pendingFile = {
                        id: j,
                        targetId,
                        fileName,
                        size,
                        targetFolder,
                        status: 'prepare',
                        file
                    }
                    this.tableData.push(pendingFile)
                    pendingFileIds.push(j)
                }
            }
            if (pendingFileIds.length > 0){
                for (let id in pendingFileIds){
                    let pendingFileId = pendingFileIds[id], data = this.tableData[pendingFileId]
                    data.status = 'check'
                    fileFingerPoint(this.tableData[pendingFileId].file, function(crc){
                        resourceExist(crc).then((response) => {
                            if (response.data){
                                data.status = 'success'
                            } else {
                                data.status = 'prepare'
                            }
                        })
                    })
                }
            }
        },
        isEqualsOfFiles (f, s){
            if (f.fileName === s.fileName && f.size === s.size){
                return true
            }
            return false
        }
    },
    created () {
        this.addFileUploadList(this.$store.state.fileUploadList)
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
    background-image: url('../assets/suspend.png')
}
.file-upload-suspend:hover {
    background-image: url('../assets/suspend_hover.png')
}
</style>
