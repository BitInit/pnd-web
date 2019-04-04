<template>
    <el-main>
        <div class="main-button">
            <el-button type="primary">
                <i class="el-icon-upload"></i>
                <span>上传文件</span>
            </el-button>
            <el-button plain>
                <i class="el-icon-document"></i>
                <span>新建文件夹</span>
            </el-button>
        </div>
        <div class="content">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">全部文件</el-breadcrumb-item>
            </el-breadcrumb>
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
                    <template scope="scope">
                        <FileIcon :type="scope.row.type"></FileIcon>
                        <a class="file-name" @click="getFileList(scope.row.id)" v-if="scope.row.type === 'folder'">
                            {{scope.row.name}}
                        </a>
                        <a class="file-name" v-else>
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
                    <template scope="scope">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <i class="el-icon-more operation"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click="moveTo(scope.$index, tableData)">移动到</el-dropdown-item>
                                <el-dropdown-item>复制到</el-dropdown-item>
                                <el-dropdown-item>重命名</el-dropdown-item>
                                <el-dropdown-item v-if="scope.row.type !== 'folder'">下载</el-dropdown-item>
                                <el-dropdown-item>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-main>
</template>

<script>
import FileIcon from '@/components/FileIcon'
import { fetchFileList } from '@/api/resource'
import { formatterMillisecond } from '@/util/common_utils'

export default {
    components: {
        FileIcon
    }, 
    data(){
        return {
            levelList: [],
            tableData: [],
        }
    },
    methods: {
        moveTo: function(index, tableData){
            alert(index, tableData)
        },
        getFileList: function(parentId){
            console.info(parentId)
            fetchFileList(parentId).then(response => {
                console.info(response.data)
                this.tableData = response.data
            })
        },
        formatterTime: function(row, column){
            return formatterMillisecond(new Date(row.gmtModified))
        },
        formatterSize: function(row, column){
            let s = row.size
            if (s === 0) {
                return '-'
            } else if (s < 1024) {
                return s + 'K'
            } else if(s < 1024 * 1024) {
                return (s / 1024).toFixed(1) + 'M'
            } else if (s < 1024 * 1024 * 1024) {
                return Math.floor(s / (1024 * 1024)) + 'G'
            } else {
                return Math.floor(s / (1024 * 1024 * 1024)) + 'P'
            }
        }
    },
    created() {
        this.getFileList(0)
    }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
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
