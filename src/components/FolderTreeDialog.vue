<template>
  <el-dialog
    :title="title"
    :visible="true"
    width="40%">
    <el-tree
      :props="props"
      :load="loadNode"
      node-key="id"
      lazy
      ref="tree"
      check-strictly
      show-checkbox>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('return', {type: 'cancel'})">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getFileList} from '@/apis/file'

export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    sourceFiles: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      props: {
        label: 'fileName',
      }
    }
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ fileName: '全部文件', id: 0}]);
      }
      getFileList(node.data.id).then(response => {
        let r = response.data.filter(f =>
          f.type === 'folder' && !this.contains(this.sourceFiles, f))
        resolve(r)
      }).catch(() => {})
    },
    submit() {
      this.$emit('return', {
        type: 'submit',
        value: this.$refs.tree.getCheckedKeys()
      })
    },
    contains (sourceFiles, targetFile) {
      for (let i = 0; i < sourceFiles.length; i++) {
        if (sourceFiles[i].id === targetFile.id) {
          return true
        }
      }
      return false
    }
  }
}
</script>