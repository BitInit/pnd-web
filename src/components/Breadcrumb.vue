<template>
    <div class="navigation">
        <div class="navigation-prefix" v-if="levelList.length > 1">
            <span class="go-back">返回上一级</span>
            <span class="navigation-separator">|</span>
        </div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(val, index) in levelList" :key="index" :to="{ path: '/' }">{{val.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    computed: {
        levelList (){
            return this.$store.state.levelList;
        }
    },
    watch: {
        '$route' () {
            console.info('hhh')
            console.info(this.$route)
        }
    },
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
.navigation{
    font-size: 14px;
    font-weight: 400;
    color: #606266;
    line-height: 1;
    .navigation-separator{
        padding: 0 5px;
    }
    .navigation-prefix{
        display: inline-block;
    }
    .go-back{
        font-weight: 700;
        cursor: pointer;
    }
    .go-back:hover{
        color: #3794ff;
    }
    .el-breadcrumb{
        display: inline-block;
    }
}
</style>
