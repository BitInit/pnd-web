<template>
    <el-dropdown>
        <span class="el-dropdown-link">
            <i class="el-icon-more operation"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="move">移动到</el-dropdown-item>
            <el-dropdown-item @click.native="copy" v-if="scope.row.type !== 'folder'">复制到</el-dropdown-item>
            <el-dropdown-item @click.native="rename">重命名</el-dropdown-item>
            <el-dropdown-item @click.native="download" v-if="scope.row.type !== 'folder'">下载</el-dropdown-item>
            <el-dropdown-item @click.native="deleteResource">删除</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import { renameFile, deleteFile } from '@/api/resource'
export default {
    props: ['scope'],
    methods: {
        move: function(){
            this.$store.commit('openFileTreeDialog', {
                title: '[' + this.scope.row.name + '] 移动到',
                id: this.scope.row.id,
                type: 'move'
            })
        },
        copy: function(){
            this.$store.commit('openFileTreeDialog', {
                title: '[' + this.scope.row.name + '] 复制到',
                id: this.scope.row.id,
                type: 'copy'
            })
        },
        download: function(){
            this.$message({
                message: '该功能还为开发',
                type: 'warning',
                duration: 3 * 1000
            })
        },
        rename: function(){
            // TODO 文件名校验
            this.$prompt('请输入新的文件名', '重新命名', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.scope.row.name
            }).then(({value}) => {
                renameFile(this.scope.row.id, value).then(() => {
                    this.$emit('flush')
                })
            }).catch(() => {})
        },
        deleteResource () {
            this.$confirm('是否确定要删除该文件？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteFile(this.scope.row.id).then(() => {
                    this.$emit('flush')
                })
            }).catch(() => {});
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
