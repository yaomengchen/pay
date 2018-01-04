<template>
<div class="container">
    <headerBar :title="'交班记录'"></headerBar>
    <div class="change" v-if="!display">
    <div class="content">
        <div class="head">
            <div class="baseCash">
                <text class="redText">{{dataList['STORE_HAND_OVER.CASH_INCOME'] | price}}</text>
                <text class="text">实收现金</text>
            </div>
            <div class="baseCash">
                <text class="redText">{{dataList['STORE_HAND_OVER.CURRENT_PETTY_CASH'] | price}}</text>
                <text class="text">备用金</text>
            </div>
            <div class="saleCash">
                <text class="white">{{dataList['STORE_HAND_OVER.HAND_OVER_CASH'] | price}}</text>
                <text class="whiteText">交接现金(含备用金)</text>
            </div>
        </div>
        <div class="table">
            <div class="panel-head">
                <div class="payWay">
                    <text class="text">支付方式</text>
                </div>
                <div class="payWay">
                    <text class="text">消费金额        +</text>
                </div>
                <div class="payWay">
                    <text class="text">充值金额        -</text>
                </div>
                <div class="payWay">
                    <text class="text">退款金额        =</text>
                </div>
                <div class="payWay">
                    <text class="text">总金额</text>
                </div>
            </div>

            <div class="panel-body" v-for="(item,index) in dataList.detail">
                <div class="payWay">
                    <text class="text" >{{payways[item['STORE_HAND_OVER_DETAIL.PAY_MODE']]}}</text>
                </div>
                <div class="payWay">
                    <text class="text">{{item['STORE_HAND_OVER_DETAIL.SALE_MONEY'] | price}}</text>
                </div>
                <div class="payWay">
                    <text class="text" v-if="item['STORE_HAND_OVER_DETAIL.PAY_MODE'] == 'MEMB_CARD'">--</text>
                    <text class="text" v-if="item['STORE_HAND_OVER_DETAIL.PAY_MODE'] != 'MEMB_CARD'">{{item['STORE_HAND_OVER_DETAIL.RECHARGE_MONEY'] | price}}</text>
                </div>
                <div class="payWay">
                    <text class="text">{{item['STORE_HAND_OVER_DETAIL.REFUND_MONEY'] | price}}</text>
                </div>
                <div class="payWay">
                    <text class="allMoneyText">{{item.sumMoney | price}}</text>
                </div>
            </div>
            <div class="panel-foot">
                <div class="payWay">
                    <text class="bigtext" >合计</text>
                </div>
                <div class="payWay">
                    <text class="bigtext">{{dataList['STORE_HAND_OVER.SALE_SUM_MONEY'] | price}}</text>
                </div>
                <div class="payWay">
                    <text class="bigtext">{{dataList['STORE_HAND_OVER.RECHARGE_SUM_MONEY'] | price}}</text>
                </div>
                <div class="payWay">
                    <text class="bigtext">{{dataList['STORE_HAND_OVER.REFUND_SUM_MONEY'] | price}}</text>
                </div>
                <div class="payWay">
                    <text class="allMoneyBigText">{{sumOverMoney | price}}</text>
                </div>
            </div>                    
        </div>
        <div class="remark">
            <text class="remark-text">备注：{{dataList['STORE_HAND_OVER.REMARK']}}</text>    
        </div>
    </div>

    <div class="foot-top">
        <text class="text" >当班时间：{{dataList['STORE_HAND_OVER.BEGIN_DATETIME']}} - {{dataList['STORE_HAND_OVER.END_DATETIME']}}</text>
        <text class="text" >当班人员：{{dataList['STORE_HAND_OVER.DUTY_MAN_NAME']}}</text>
    </div>
    </div>
    <renderTip :render='display'></renderTip>
</div>
</template>
<style scoped lang="sass">
    $rate:0.732;
    $set:0.3662;
    .container {
        flex-direction: column;
        background-color: #f2f2f2;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-bottom: 9*$rate;
    }
    .change{
        flex: 1;
        border-radius: 5px*$rate;
        overflow: hidden; 
    }
    .content {
        flex: 1;
        align-items: center;
        margin-left: 9*$rate;
        margin-right: 9*$rate;
        margin-top: 9*$rate;
        background-color: #fff;

    }
    .head {
        width: 841*$rate;
        margin-bottom: 26px*$rate;
        margin-top: 26px*$rate;
        flex-direction: row;
        justify-content: space-between;
    }
    .remark{
         width: 841*$rate;
         height: 150*$rate;
         background-color: #f3f3f3;
         padding: 30*$set;
         margin-top: 30*$set
    }
    .remark-text{
        font-size: 11;
        color: #333;
    }
    .allMoneyText {
        font-size: 16*$rate;
        color: #ef494d;
    }
    .redText {
        font-size: 27*$rate;
        color: #ef494d;
    }
    .text {
        font-size: 16*$rate;
    }
    .bigtext{
        font-size: 20*$rate;
    }
    .allMoneyBigText{
        font-size: 20*$rate;
        color: #ef494d;
    }
    .white {
        font-size: 27*$rate;
        color: #fff;
    }
    .whiteText {
        font-size: 16*$rate;
        color: #fff;
    }
    .baseCash {
        border-style: solid;
        border-width: .7px*$rate;
        border-color: #aeaeae;
        width: 265*$rate;
        height: 97*$rate;
        padding-left: 30*$rate;
        justify-content: center;
        border-radius: 5px*$rate;
    }
    .saleCash {
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        width: 265*$rate;
        height: 97*$rate;
        justify-content: center;
        padding-left: 30*$rate;
        border-radius: 5px*$rate;
    }
    .table {
        width: 841*$rate;
        border-width: .5px*$rate;
        border-style: solid;
        border-color: #aeaeae;
    }
    .panel-head {
        height: 44px*$rate;
        padding-left: 30*$rate;
        background-color: #f6f6f6;
        flex-direction: row;
        align-items: center;
    }
    .panel-body {
        height: 44px*$rate;
        padding-left: 30*$rate;
        flex-direction: row;
        align-items: center;
    }
    .panel-foot{
        height: 55px*$rate;
        padding-left: 30*$rate;
        flex-direction: row;
        align-items: center;
        border-top-width: .5px*$rate;
        border-top-style: solid;
        border-top-color: #aeaeae;
    }
    .panel-special {
        width: 841*$rate;
        height: 44px*$rate;
        flex-direction: row;
        align-items: center;
        border-style: solid;
        border-width: .5*$rate;
        border-color: #aeaeae;
        margin-top: 15px*$rate;

    }
    .payWay {
        flex: 1;
        justify-content: center;
    }
    .input {
        color: #999999;
        width: 134px*$rate;
        font-size: 15*$rate;
    }
    .textarea {
        width: 841*$rate;
        height: 70*$rate;
        background-color: #f7f7f7;
        font-size: 16*$rate;
        padding-left: 15*$rate;
        padding-top: 9*$rate;
        margin-top: 20*$rate;
    }
    .foot-top {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 80px*$rate;
        margin-left: 9*$rate;
        margin-right: 9*$rate;
        background-color: #fff;
        padding-left: 30*$rate;
        padding-right: 30*$rate;
    }
    .foot-submit {
        height: 82px*$rate;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        border-top-color: #aeaeae;
        border-top-style: solid;
        border-top-width: .5*$rate;
        margin-left: 9*$rate;
        margin-right: 9*$rate;
        margin-bottom: 9*$rate;
        background-color: #fff;
        border-bottom-left-radius: 10px*$rate;
        border-bottom-right-radius: 10px*$rate;
    }
    .btn {
        width: 146*$rate;
        height: 49*$rate;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        margin-right: 30*$rate;
        justify-content: center;
        align-items: center;
        border-radius: 99;
    }
</style>
<script>

    import filters from '../../common/filters.js'
    import headerBar from "../../components/header-back.vue"
    import renderTip from '../../components/render-tip.vue'
    import stream from '../../common/stream.js'
    import navigator from '../../common/navigator.js'
    const modal = weex.requireModule('modal')
    export default {
        data () {
            return {
                payways:{'CASH_PAY':'现金','ALI_PAY':'支付宝','WX_PAY':'微信支付','BANK_CARD_PAY':'银行卡','MEMB_CARD':'会员卡'},
                display:false,
                dataList:[],
                sumOverMoney:0
            }
        },
        filters:{
           price:filters.price
        },
        components: {
            headerBar,
            renderTip
        },
        methods: {
            getDataByUrl: function (name, url) {
              name = name.replace(/[\[\]]/g, "\\$&");
              var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url); 
              if (!results) return null;
              if (!results[2]) return '';
              return decodeURIComponent(results[2].replace(/\+/g, " "));
            },
        },
        computed: {

        },
        mounted () {
            let self = this
            self.display = true
            let bundleUrl = self.$getConfig().bundleUrl
            stream.fetch({
                method:'GET',
                url:'/store/hand/over/getById?STORE_HAND_OVER.HAND_OVER_RECORD_ID=' + self.getDataByUrl('id',bundleUrl)
            },res =>{
                let data = res.data
                data.forEach(ele =>{
                    let obj = ele['STORE_HAND_OVER.STORE_HAND_OVER_DETAILS']
                    let arr = []
                    for(let i in obj){
                        obj[i]['sumMoney'] = obj[i]['STORE_HAND_OVER_DETAIL.SALE_MONEY']/1 + obj[i]['STORE_HAND_OVER_DETAIL.RECHARGE_MONEY']/1 - obj[i]['STORE_HAND_OVER_DETAIL.REFUND_MONEY']
                        arr.push(obj[i])
                    }
                    ele.detail = arr
                })
                self.dataList = data[0]
                self.sumOverMoney = self.dataList['STORE_HAND_OVER.SALE_SUM_MONEY']/1 + self.dataList['STORE_HAND_OVER.RECHARGE_SUM_MONEY']/1 - self.dataList['STORE_HAND_OVER.REFUND_SUM_MONEY']
            },res=>{
                self.display = false
            })
        }
    }
</script>