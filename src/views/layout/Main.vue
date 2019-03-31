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
                show-summary
                :default-sort = "{prop: 'fileName', order: 'descending'}"
                style="width: 100%">
                <!-- <el-table-column
                    type="selection"
                    min-width="2">
                </el-table-column> -->
                <el-table-column
                    label="文件名"
                    prop="fileName"
                    sortable
                    min-width="54">
                    <template scope="scope">
                        <FileIcon :type="scope.row.type"></FileIcon>
                        <span style="display: inline-block; padding-left: 5px">{{scope.row.fileName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="size"
                    label="大小"
                    min-width="22">
                </el-table-column>
                <el-table-column
                    prop="modifyTime"
                    label="修改日期"
                    sortable
                    min-width="22"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column 
                    label="操作"
                    min-width="22">
                    <!-- <i class="el-icon-more operation"></i> -->
                    <template scope="scope">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <i class="el-icon-more operation"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click="moveTo(scope.$index, tableData)">移动到</el-dropdown-item>
                                <el-dropdown-item>复制到</el-dropdown-item>
                                <el-dropdown-item>重命名</el-dropdown-item>
                                <el-dropdown-item>下载</el-dropdown-item>
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
export default {
    components: {
        FileIcon
    }, 
    data(){
        return {
            tableData: [{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影888',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心9999',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影0000',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心22222',
                size: '2G',
                modifyTime: '2019-01-02'
            },{
                type: 'folder',
                fileName: '电影111',
                size: '-',
                modifyTime: '2018-12-09'
            },{
                type: 'video',
                fileName: '勇敢的心1111',
                size: '2G',
                modifyTime: '2019-01-02'
            }],
        }
    },
    methods: {
        moveTo: function(index, tableData){
            alert(index, tableData)
        }
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
</style>
