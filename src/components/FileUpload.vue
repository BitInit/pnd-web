<template>
    <div>
        <div class="file-upload-layout" :class="[status === 'open'? 'open': 'close']">
            <div class="dialog-header">
                <span class="dialog-header-title">文件上传</span>
                <div class="dialog-control">
                    <span @click="collapseWindow">-</span>
                    <span @click="closeWindow">x</span>
                </div>
            </div>
            <div class="dialog-body">
                
            </div>
        </div>
        <div class="file-upload-layout collapse-header" :class="[status === 'collapse'? 'collapse': 'close']">
            <div class="dialog-header">
                <span class="dialog-header-title">文件上传</span>
                <div class="dialog-control">
                    <span @click="openWindow">□</span>
                    <span @click="closeWindow">x</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 窗口状态 打开:open 关闭:close 折叠:collapse
            status: 'collapse'
        }
    },
    methods: {
        closeWindow: function(){
            this.status = 'close'
        },
        collapseWindow: function(){
            this.status = 'collapse'
        },
        openWindow: function(){
            this.status = 'open'
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
