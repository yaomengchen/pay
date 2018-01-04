<template>
    <div class="container">
        <headerBar :title="'仅退款'"></headerBar>
        <div class="content">
            <div class="left-part">
                <text class="text" style="margin-bottom:11px;">应退金额</text>
                <div class="input">
                    <text class="big-text">￥{{ returnMoney}}</text>
                </div>
                <text class="greyText" style="margin-top:11px;">应退￥65，共3件；</text>
            </div>
            <div class="right-part">
                <text class="text" style="margin-bottom:11px;">退款方式</text>
                <div style="width:288px;flex-direction:row;justify-content:space-between; margin-bottom:12px;">
                    <div class="btn" @click="choose(0)" :style="{'background-image':0==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#FFF,#FFF)'}">
                        <text class="redText" :style="{'color':0==nowIndex?'#fff':'#ef494d'}">现金</text>
                    </div>
                    <div class="btn" @click="choose(1)" :style="{'background-image':1==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#FFF,#FFF)'}">
                        <text class="redText" :style="{'color':1==nowIndex?'#fff':'#ef494d'}">支付宝</text>
                    </div>
                    <div class="btn" @click="choose(2)" :style="{'background-image':2==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#FFF,#FFF)'}">
                        <text class="redText" :style="{'color':2==nowIndex?'#fff':'#ef494d'}">微信支付</text>
                    </div>
                </div>
                <div style="width:189px;flex-direction:row;justify-content:space-between;">
                    <div class="btn" @click="choose(3)" :style="{'background-image':3==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#FFF,#FFF)'}">
                        <text class="redText" :style="{'color':3==nowIndex?'#fff':'#ef494d'}">会员账户</text>
                    </div>
                    <div class="btn" @click="choose(4)" :style="{'background-image':4==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#FFF,#FFF)'}">
                        <text class="redText" :style="{'color':4==nowIndex?'#fff':'#ef494d'}">银行卡</text>
                    </div>
                </div>

            </div>
        </div>
        <div class="input-area">
            <text class="redText" style="margin-bottom:7px;">必填:</text>
            <textarea class="textarea" placeholder="退款原因" ></textarea>
        </div>
        <div  class="wrap-user">
            <text class="text" style="margin-top:14px;">收银人员:  user.name  user.id </text>
        </div>
        <div class="foot">
            <div class="confirm" @click="confirm">
                <text class="white-text">确认</text>
            </div>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.732;
    .container {
        background-color: #f2f2f2;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .content {
        background-color: #fff;
        margin-left: 9*$rate;
        margin-right: 9*$rate;
        margin-top: 9*$rate;
        border-top-left-radius: 3px*$rate;
        border-top-right-radius: 3px*$rate;
        flex: 1;
        flex-direction: row;
        justify-content: center;
    }
    .left-part {
        margin-left: 23px*$rate;
        margin-top: 15px*$rate;
    }
    .right-part {
        margin-left: 18px*$rate;
        margin-top: 15px*$rate;
    }
    .input {
        height: 95*$rate;
        width: 413*$rate;
        border-width: .5*$rate;
        border-color: #aeaeae;
        border-style: solid;
        justify-content: center;
        align-items: center;
        border-radius: 3px*$rate;
    }
    .text {
        font-size: round(15*$rate);
    }
    .big-text {
        font-size: round(30*$rate);
        color: #f04c50;
    }
    .greyText {
        font-size: round(13*$rate);
        color: #a8a8a8;
    }
    .redText {
        font-size: round(13*$rate);
        color: #ef494d;
    }
    .btn {
        width: 122*$rate;
        height: 39*$rate;
        border-width: .5*$rate;
        border-style: solid;
        border-color: #aeaeae;
        align-items: center;
        justify-content: center;
        border-radius: 3px*$rate;
    }
    .input-area {
        margin-left: 9*$rate;
        margin-right: 9*$rate;
        padding-left: 28px*$rate;
        padding-right: 28px*$rate;
        background-color: #fff;
    }
    .textarea {
        width: 839*$rate;
        height: 70*$rate;
        background-color: #f7f7f7;
        padding-left: 20px*$rate;
        padding-top: 20px*$rate;
        font-size: round(15px*$rate);

    }
    .foot {
        height: 78px*$rate;
        margin-left: 9*$rate;
        margin-right: 9*$rate;
        margin-bottom: 9*$rate;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        background-color: #fff;
        border-top-width: .5px*$rate;
        border-top-style: solid;
        border-top-color: #aeaeae;
    }
    .confirm {
        width: 122*$rate;
        height: 39*$rate;
        justify-content: center;
        align-items: center;
        margin-right: 10px*$rate;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        border-radius: 99;
    }
    .white-text {
        font-size: round(15px*$rate);
        color: #fff;
    }
    .wrap-user {
        flex-direction:row;
        justify-content:flex-end;
        padding-right:20px*$rate;
        background-color: #fff;
        margin-left: 9*$rate;
        margin-right: 9*$rate;
        padding-bottom: 10*$rate;
    }
</style>
<script>
    import icons from "../../assets/icon.js"
    const searchBarIcons = icons.searchBarIcons;
    import headerBar from "../../components/header-back.vue"
    export default {
        data () {
          return {
                returnMoney: 66.6,
                nowIndex: 0,
          }
        },
        components: {
              headerBar
        },
        filters:{
            
        },
        methods: {
            choose ( index ) {
                this.nowIndex = index;
            },
            confirm () {
                this.$router.push({
                    path: '/member/returnGoodsList',
                })
            }
        }
    }
</script>