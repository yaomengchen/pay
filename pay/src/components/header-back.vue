<template>
    <div class="header">
        <div class="back-btn" @click="comeBack">
            <image class="back-btn-img" :src="imageObj.backBtn"></image>
            <text class="back-btn-text">{{title}}</text>
        </div>
            <text>单号:{{id}}</text>
            <text>XXX</text>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .header {
        width: 750;
        height: 128*$rate;
        background-color: #fff;
        flex-direction: row;
        align-items: flex-end;
    }
    .back-btn {
        height: 94*$rate;
        padding-left: 20*$rate;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .back-btn-img {
        width: 21*$rate;
        height: 34*$rate;
        margin-right: 15.5*$rate;
    }
    .back-btn-text {
        font-size: round(38*$rate);
        color: #333333;
    }
</style>
<script>
    import icons from '../assets/icon.js'
    import navigator from '../common/navigator.js'
    export default {
        data () {
            return {
                imageObj:{
                    backBtn:icons.commonIcons.backIcon
                },

            }
        },
        props:['title'],
        methods: {
          comeBack(){
            navigator.pop({
                'animated': "false"
            },function(){})
          },
        }
    }
</script>