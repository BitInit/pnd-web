<template>
    <div class="file-status">
        <i v-if="fileStatus === 'success'" class="el-icon-success" style="color: #3794ff;"></i>
        <span v-else-if="fileStatus === 'check'">校验中...</span>
        <span v-else-if="fileStatus === 'prepareUpload'">等待中...</span>
        <span v-else-if="fileStatus === 'uploading'">上传中...</span>
        <span v-else-if="fileStatus === 'paused'">已暂停</span>
        <span v-else>{{ fileStatus }}</span>
    </div>
</template>

<script>
export default {
    props: {
        fileStatus: String
    }
}
</script>

<style lang="scss" scoped>
.file-status{
    display: inline-block;
}
</style>
