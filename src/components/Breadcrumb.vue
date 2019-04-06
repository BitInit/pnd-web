<template>
    <div class="navigation">
        <div class="navigation-prefix" v-if="levelList.length > 1">
            <span class="go-back" @click="goBack">返回上一级</span>
            <span class="navigation-separator">|</span>
        </div>
        <div class="breadcrumb">
            <div class="breadcrumb-item" v-for="(val, index) in levelList" :key="index">
                <span v-if="(levelList.length - 1) !== index" @click="forwardTo(index)" class="breadcrumb-item-val">{{ val.name }}</span>
                <span v-else class="breadcrumb-item-val">{{ val.name }}</span>
                <span v-if="(levelList.length - 1) !== index" class="breadcrumb-sparator">/</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        levelList (){
            return this.$store.state.levelList;
        }
    },
    methods: {
        forwardTo (index) {
            this.$store.commit('spliceLevelList', index)
        },
        goBack () {
            this.$store.commit('spliceLevelList', this.levelList.length - 2)
        }
    }
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
    .breadcrumb{
        display: inline-block;
        cursor: pointer;
        .breadcrumb-item {
            display: inline-block;
        }
        .breadcrumb-sparator {
            display: inline-block;
            padding: 0 5px;
        }
        .breadcrumb-item-val:hover{
            color: #3794ff;
        }
    }
}
</style>
