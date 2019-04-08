<template>
    <el-dialog :title="$store.state.fileTreeInfo.title" :visible.sync="$store.state.fileTreeDialogVisible">
        <el-tree
            :props="defaultProps"
            :load="loadNode"
            node-key="id"
            empty-text="没有文件夹"
            ref="fileTree"
            lazy
            check-strictly
            highlight-current
            show-checkbox>
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="$store.commit('closeFileTreeDialog')">取 消</el-button>
            <el-button type="primary" @click="operateNode">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { fetchSubfolder, moveFile, copyFile } from '@/api/resource'
export default {
    data () {
        return {
            defaultProps: {
                label: 'name',
            }
        }
    },
    methods: {
        loadNode (node, resolve) {
            if (node.level === 0){
                resolve([{
                    id: 0,
                    name: '全部文件'
                }])
            } else {
                fetchSubfolder(node.data.id).then(response => {
                    if (this.$store.state.fileTreeInfo.type === 'move'){
                        resolve(response.data.filter(item => {
                            return item.id !== this.$store.state.fileTreeInfo.id
                        }))
                    } else {
                        resolve(response.data)
                    }
                })
            }
        },
        operateNode () {
            if (this.$store.state.fileTreeInfo.type === 'move'){
                this.moveNode()
            } else if (this.$store.state.fileTreeInfo.type === 'copy'){
                this.copyNode()
            }
        },
        moveNode () {
            let keys = this.$refs.fileTree.getCheckedKeys()
            if (keys.length !== 1) {
                this.$message({
                    message: '请选择一个将要移动的目标文件夹',
                    type: 'warning',
                    duration: 3 * 1000
                })
            } else {
                moveFile(this.$store.state.fileTreeInfo.id, keys[0]).then(() => {
                    this.$emit('flush')
                    this.$store.commit('closeFileTreeDialog')
                })
            }
        },
        copyNode () {
            let keys = this.$refs.fileTree.getCheckedKeys()
            if (keys.length === 0) {
                this.$message({
                    message: '请选择将要复制到的目标文件夹',
                    type: 'warning',
                    duration: 3 * 1000
                })
            } else {
                copyFile(this.$store.state.fileTreeInfo.id, keys).then(() => {
                    this.$message({
                        message: '复制成功',
                        type: 'success',
                        duration: 3 * 1000
                    })
                    this.$store.commit('closeFileTreeDialog')
                })
            }
        }
    }
}
</script>