<template>
<div class="container">
    <div class="header" >
        <div class="head-fl" v-for="(item,index) in title" @click="change(index)" :class="[action == index ? 'head-fl-action' : '']">
            <text class="text">{{ item }}</text>
        </div>
    </div>
</div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .header {
        height: 132 * $rate;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background-color: #fff;
        padding-left: 30 * $rate;        
    }
    .head-fl {
        height: 132 * $rate;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;
        padding-left: 20 * $rate;
        padding-right: 20*$rate;
        margin-right: 30*$rate;
        padding-bottom: 15*$rate;
        border-top-color: white;
        border-top-width: 5*$rate;
        border-bottom-color: white;
        border-bottom-width: 5*$rate;
    }
    .head-fl-action{
        border-bottom-color: #f25b5f;
    }
    .text {
        font-size: round(36 * $rate);
        color: #333333;
    }
    .text-user {
        font-size: 32px;
        color: #333333;
        margin-left: 60px;
    }
    /*顶部返回标识的样式*/
    .back{
        /*图片必须设置样式，否则无法显示*/
        width: 9px;
        height: 15px;
    }
    .img {
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        width: 26px;
    }
</style>
<script>
    import icons from "../assets/icon.js"
    const searchBarIcons = icons.searchBarIcons;
    const modal = weex.requireModule("modal")
    export default {
        data: function () {
            return {
                
                back: searchBarIcons.backIcon,
            }
        },
        computed: {

        },
        props:['title','needreturn','action'],
        methods: {
            change ( index ) {
                if(this.title.length > 1 && this.action != index){
                    
                this.$emit('event',index)
                }
            }
        }
    }
</script>