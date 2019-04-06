<template>
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

<script>
export default {
    props: ['scope'],
    methods: {
        moveTo: function(index, tableData){
            alert(index, tableData)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}
.el-icon-arrow-down {
    font-size: 12px;
}
</style>
