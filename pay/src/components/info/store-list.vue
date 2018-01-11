
<template>
    <div class="info-list">
        <div class="info-bar">
            <div class="infoWrap"> 
                <image :src="privateIcon" class="infoImg"/>
            </div>
            <text class="infoText">{{info}}</text>
        </div>
        <div class="infoLine"></div>
        <div  class="info-bar-or">
            <text class="infoName">关于拨浪鼓</text>
            <image :src="to" class="rightImg"/>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .info-list {
        background-color: white;
        flex-direction: column;
        padding-top: 39*$rate;
        padding-bottom: 39*$rate;
    }
    .info-bar {
        width: 708*$rate;
        height: 172*$rate;
        border-radius:8px;
        background-color: #ef494d;
        flex-direction: row;
        align-items: center;
        padding-left: 23*$rate;
        margin-top:20;
        margin-bottom:20;
        margin-left: 28*$rate;
        margin-right: 28*$rate;
    }
    .info-bar-or {
        width: 708*$rate;
        height: 172*$rate;
        border-radius:8px;
        flex-direction:row;
        align-items: center;
        justify-content:space-between;
        padding-left: 23*$rate;
        margin-bottom:20;
        margin-left: 28*$rate;
        margin-right: 28*$rate;
    }
    .infoLine{
        height:1*$rate;
        width:766*$rate;
        border-bottom-color:#d8d8d8;
        border-bottom-style:solid;
        border-bottom-width:1;
    }
    .infoName{
        color:#333;
        font-size:18;
    }
    .infoWrap{
        width:50;
        height:50;
        border-radius:50;
        margin-right:10;
        background-color:#fff;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .infoImg{
        width:40;
        height:40;
    }
    .rightImg{
        width:20;
        height:20;
    }
    .infoText{
        color:#fff;
        font-size:18;
    }
</style>
<script>
    import icon from '../../assets/icon.js'
    import filters from '../../common/filters.js'
    const modal = weex.requireModule('modal')
    const tabBarIcons = icon.tabBarIcons
    export default {
        data () {
            return {
                to:tabBarIcons.to,
                privateIcon:tabBarIcons.defaultLogoIcon,
            }
        },
        computed: {

          
        },
        props:['info'],
        methods: {
            toggleActiveItem (index) {
                this.$emit('change',index)
            },
            searchOrderList () {
                this.$emit('search',this.searchKey)
            },
            loadmore(){
                this.$emit('load','')
            },
            submit(){
                
            }
        }
    }
</script>