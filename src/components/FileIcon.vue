<template>
    <div class="file-icon" :class="[type]"></div>
</template>

<script>
export default {
    props: {
        type: {
            validator: function(value){
                return ['default', 'folder', 'pdf', 'compress-file', 'video', 'picture'].indexOf(value) !== -1
            }
        }
    }
}
</script>


<style ref="stylesheet/scss" lang="scss" scoped>
.file-icon {
    display: inline-block;
    background-image: url(../assets/file_icons.png);
    background-repeat: no-repeat;
    width: 26px;
    height: 23px;
}
.default{
    background-position: -596px -566px;
}
.folder{
    background-position: -594px -862px;
}
.pdf{
    background-position: -596px -136px;
}
.compress-file{
    background-position: -596px -1664px;
}
.video{
    background-position: -596px -1630px;
}
.picture{
    background-position: -596px -306px;
}
</style>
