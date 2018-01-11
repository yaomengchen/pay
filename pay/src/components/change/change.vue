<template>
<div class="container">
    <headBar :title="title" :action="action" @event="change"  needreturn="" ></headBar>
    <div class="change" v-if="action == 0">
    <div class="content">
        <div class="head">
            <div class="baseCash">
                <text class="redText">{{cashMoney | price}}</text>
                <text class="text">实收现金</text>
            </div>
            <div class="baseCash">
                <text class="redText" @click="setMoney">{{prepareMoney > 0?prepareMoney:'点击填写'}}</text>
                <text class="text">备用金</text>
            </div>
            <div class="saleCash">
                <text class="white">{{sumMoney | price}}</text>
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

            <div class="panel-body" v-for="(item,index) in accountList">
                <div class="payWay">
                    <text class="text" >{{item.name}}</text>
                </div>
                <div class="payWay">
                    <text class="text">{{item.pay | price}}</text>
                </div>
                <div class="payWay">
                    <text class="text" v-if="index == accountList.length -1">--</text>
                    <text class="text" v-if="index != accountList.length -1">{{item.recharge | price}}</text>
                </div>
                <div class="payWay">
                    <text class="text">{{item.return | price}}</text>
                </div>
                <div class="payWay">
                    <text class="allMoneyText">{{item.sum | price}}</text>
                </div>
            </div>
            <div class="panel-foot">
                <div class="payWay">
                    <text class="bigtext" >合计</text>
                </div>
                <div class="payWay">
                    <text class="bigtext">{{sumPay | price}}</text>
                </div>
                <div class="payWay">
                    <text class="bigtext">{{sumRecharge | price}}</text>
                </div>
                <div class="payWay">
                    <text class="bigtext">{{sumReturn | price}}</text>
                </div>
                <div class="payWay">
                    <text class="allMoneyBigText">{{sumOverMoney | price}}</text>
                </div>
            </div>                    
        </div>
    </div>

    <div class="foot-top">
        <text class="text" >当班时间：{{startTime}} - {{endTime}}</text>
        <text class="text" >当班人员：{{user['USER.NAME']}}</text>
    </div>
    <div class="foot-submit">
        <div class="btn" @click="sure">
            <text class="whiteText" >交班并确认</text>
        </div>
    </div>
    <changeConfirm :display="display" :prepare="prepareMoney" :money="sumMoney" :cash="cashMoney" @close="close" @submit="submit"></changeConfirm>
    <confirm :display="disConfirm" @event="setConfirm"></confirm>
    </div>
    <changeHistory :action="action" :list="historyList" @search="search"></changeHistory>
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
        padding-left: 150*$set;
    }
    .change{
        flex: 1;
    }
    .content {
        flex: 1;
        align-items: center;
        margin-left: 9*$rate;
        margin-right: 9*$rate;
        margin-top: 9*$rate;
        background-color: #fff;
        border-radius: 5px*$rate;
    }
    .head {
        width: 841*$rate;
        margin-bottom: 26px*$rate;
        margin-top: 26px*$rate;
        flex-direction: row;
        justify-content: space-between;
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
        height: 30px*$rate;
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
    import headBar from "../head-bar.vue"
    import filters from '../../common/filters.js'
    import format from '../../common/format.js'
    import changeHistory from './change-history.vue'
    import changeConfirm from './change-confirm.vue'
    import confirm from './confirm.vue'
    import stream from '../../common/stream.js'
    import navigator from '../../common/navigator.js'
    const modal = weex.requireModule('modal')
    const storage = weex.requireModule('storage')
    export default {
        data () {
            return {
                nowTime:'',
                payways:[{name:'现金',type:'CASH_PAY'},{name:'支付宝',type:'ALI_PAY'},{name:'微信支付',type:'WX_PAY'},{name:'银行卡',type:'BANK_CARD_PAY'},{name:'会员卡',type:'MEMB_CARD'}],
                user:{},
                title:['交   班','交班记录'],
                prepareMoney:'',
                accountInfo:{},
                display:false,
                disConfirm:false,
                endTime:'',
                action: 0,
                historyList:[]
            }
        },
        filters:{
           price:filters.price
        },
        components: {
            headBar,
            changeConfirm,
            confirm,
            changeHistory
        },
        props:['storeid','startTime','storename'],
        methods: {
            change(index,search){

                var self = this
                this.action = index
                if(index == 1){
                    self.$emit('render',true)
                    let date = new Date()
                    let yesterday = new Date(date.getTime() -  1000*60*60*24)
                    let year = date.getFullYear()
                    let month = date.getMonth() + 1
                    let day = date.getDate()
                    let yearY = yesterday.getFullYear()
                    let monthY = yesterday.getMonth() + 1
                    let dayY = yesterday.getDate()
                    let url  = ''
                    if(search != undefined){
                         console.log(search)
                        url = '/store/hand/over/queryAll'+search
                    }else{
                        url = '/store/hand/over/queryAll'
                    }
                    stream.fetch({
                        method:'GET',
                        url:url,
                    },res=>{
                        let data = res.data
                        data.forEach(ele =>{
                            ele.time = self.timeFilter(year,month,day,yearY,monthY,dayY,ele['STORE_HAND_OVER.BEGIN_DATETIME']) 
                        })
                        self.historyList = data
                    },res=>{
                        self.$emit('render',false)
                    })
                }
            },
            search(res){
                var self = this  
                self.$emit('render',true)
                self.change(1,'?SEARCH_SIGN=' + res)
            },
            timeFilter(y1,m1,d1,y2,m2,d2,time){

                let y = time.substring(0,4)
                let m = time.substring(5,7)
                let d = time.substring(8,10)
                if(y1 == y && m1 == m && d1 == d){
                    return '今天'
                }else if(y2 == y && m2 == m && d2 == d){
                    return '昨天'
                }else{
                    return time.substring(0,10)
                }
            },
            sure(){
                this.display = true
            },
            close(){
                this.display = false
            },
            clock () {
                this.nowTime = dateformat(new Date(),'yyyy-mm-dd MM:ss')
                setTimeout(this.clock.bind(this), 1000);
            },
            setMoney(){
                if(this.prepareMoney == 0){

                    this.disConfirm = true

                }
            },
            renderData(callback) {
                var self = this
                storage.getItem(self.storeid + 'prepare_money' , res =>{
                    if(res.result != 'success'){
                        self.prepareMoney = 0
                    }else{
                        self.prepareMoney = res.data
                    }
                })
                storage.getItem(self.storeid + 'account_data' , res =>{
                    if(res.result == 'success'){
                       self.accountInfo = JSON.parse(res.data)
                    }
                    callback()
                })
                this.endTime = format.format()
                
            },
            setConfirm(res){
                if(res){
                    this.prepareMoney = res.data
                    storage.setItem(this.storeid + 'prepare_money' ,this.prepareMoney, res =>{
                        
                    })
                }
                this.disConfirm = false
            },
            submit(prepare,remark){
                var self = this
                var detailList = []
                self.$emit('render',true)
                console.log(self.accountInfo)
                self.payways.forEach(ele => {
                    detailList.push({
                        'STORE_HAND_OVER_DETAIL.PAY_MODE':ele.type,
                        'STORE_HAND_OVER_DETAIL.SALE_MONEY':self.accountInfo[ele.type] ?self.accountInfo[ele.type].pay : 0,
                        'STORE_HAND_OVER_DETAIL.RECHARGE_MONEY':self.accountInfo[ele.type] ?self.accountInfo[ele.type].recharge : 0,
                        'STORE_HAND_OVER_DETAIL.REFUND_MONEY':self.accountInfo[ele.type] ?self.accountInfo[ele.type].return : 0,
                        'STORE_HAND_OVER_DETAIL.NOTE':''
                    })
                })
                
                stream.fetch({
                    method:'POST',
                    url:'/store/hand/over/add',
                    body: {
                        'STORE_HAND_OVER.DUTY_MAN_ID': self.user['USER.UID'], //当班人员ID
                        'STORE_HAND_OVER.DUTY_MAN_NAME': self.user['USER.NAME'],// 当班人员姓名,
                        'STORE_HAND_OVER.LOGIN_ACCOUNT': self.user['USER.LOGIN_ID'],
                        'STORE_HAND_OVER.CURRENT_PETTY_CASH': self.prepareMoney, //本次备用金
                        'STORE_HAND_OVER.NEXT_PETTY_CASH':prepare,//预留下次备用金
                        'STORE_HAND_OVER.CASH_INCOME':self.cashMoney,//现金收入
                        'STORE_HAND_OVER.HAND_OVER_CASH':self.sumMoney,//本次交接现金
                        'STORE_HAND_OVER.SALE_SUM_MONEY':self.sumOverMoney,//销售总额
                        'STORE_HAND_OVER.REFUND_SUM_MONEY':self.sumReturn,//退款总额
                        'STORE_HAND_OVER.RECHARGE_SUM_MONEY':self.sumRecharge,//充值总额
                        'STORE_HAND_OVER.BEGIN_DATETIME':self.startTime,//当班初始时间
                        'STORE_HAND_OVER.END_DATETIME':self.endTime,//当班结束时间
                        'STORE_HAND_OVER.STORE_ID':self.storeid,//门店ID
                        'STORE_HAND_OVER.STORE_NAME':self.storename,//门店名称
                        'STORE_HAND_OVER.REMARK': remark,//交班备注
                        'STORE_HAND_OVER.STORE_HAND_OVER_DETAILS':JSON.stringify(detailList)
                    }
                },res=>{
                    modal.alert({message:'交班成功'})
                    navigator.pop({
                        'animated': "false"
                    },function(){})
                },res=>{
                    self.$emit('render',false)
                })
            }

        },
        computed: {
            sumMoney(){        
                return this.cashMoney + this.prepareMoney/1
            },
            cashMoney(){
                return this.accountInfo['CASH_PAY'] ? (this.accountInfo['CASH_PAY'].pay/1 + this.accountInfo['CASH_PAY'].recharge/1 - this.accountInfo['CASH_PAY'].return/1)  : 0
            },
            accountList(){
                var arr = []
                var self = this
                this.payways.forEach(function(ele){
                    if(self.accountInfo[ele.type]) {
                        ele.pay = self.accountInfo[ele.type].pay
                        ele.recharge = self.accountInfo[ele.type].recharge
                        ele.return = self.accountInfo[ele.type].return
                    }else{
                        ele.pay = 0
                        ele.recharge = 0
                        ele.return = 0
                    }
                    ele.sum = ele.pay/1 + ele.recharge/1 - ele.return
                    arr.push(ele)
                })
                return arr
            },
            sumPay(){
                let sum = 0
                this.accountList.forEach(ele =>{
                    sum += ele.pay/1
                })
                return sum
            },
            sumRecharge(){
                let sum = 0
                this.accountList.forEach(ele =>{
                    sum += ele.recharge/1
                })
                return sum
            },
            sumReturn(){
                let sum = 0
                this.accountList.forEach(ele =>{
                    sum += ele.return/1
                })
                return sum
            },
            sumOverMoney(){
                return this.sumPay + this.sumRecharge - this.sumReturn
            }
        },
        mounted () {
            var self = this
            
           storage.getItem('userInfo',res =>{
             self.user = JSON.parse(res.data)
             console.log(self.user)
           })
        }
    }
</script>