<template>
    <div>
        <div class="file-upload-layout" @click="operationWindow('collapse')" :class="[status === 'open'? 'open': 'close']">
            <div class="dialog-header">
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
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="dir"
                        label="上传目录">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态">
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
import {mapState} from 'vuex'
export default {
    data() {
        return {
            // status: 'close',
            tableData: [{
                fileName: '肖生克的救赎',
                size: '1.5G',
                dir: '全部文件',
                status: 'success'
            },{
                fileName: 'coco',
                size: '1.7G',
                dir: '全部文件',
                status: 'success'
            }]
        }
    },
    computed: {
        ...mapState({
            status: state => state.fileUploadComponentStatus
        })
    },
    methods: {
        operationWindow(status) {
            this.$store.commit('operationFileUploadWindow', status)
        }
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
</style>
