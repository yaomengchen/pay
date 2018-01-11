<template>
    <div class="settle-account">
        <div class="header">
            <div class="back-btn" @click="comeBack">
                <image class="back-btn-img" :src="imageObj.backBtn"></image>
                <text class="back-btn-text">结算</text>
            </div>
        </div>
        <div class="body">
            <div class="body-left">
                <div class="need-pay-group">
                    <div class="group-title">
                        <text class="group-title-name">应收金额</text>
                    </div>
                    <div class="need-pay-info-area">
                        <text class="total-need-pay">{{overPrice | price}}</text>
                        <text class="preferential-price" v-if="orderInfo['STORE_ORDER.MEMB_CARD_MONEY']">会员卡已付：{{orderInfo['STORE_ORDER.MEMB_CARD_MONEY'] | price}}</text>
                        <text class="preferential-price">已优惠：{{discount | price}}</text>
                    </div>
                </div>
                <div class="payway-group">
                    <div class="group-title">
                        <text class="group-title-name">支付方式</text>
                    </div>
                    <div class="payways">
                        <div class="payways-item" v-for="(payway,index) in payways" :class="[paywayIndex==index?'payways-item-active':'']" @click="setPaywayIndex(payway,index)">
                            <text class="payways-item-text" :class="[paywayIndex==index?'payways-item-text-active':'']">{{payway['PAY_WAY.SHOW_NAME']}}</text>
                        </div>
                    </div>
                </div>
            </div>
            <div class="body-right">
                <div class="actual-pay-group">
                    <div class="group-title">
                        <text class="group-title-name">实收金额</text>
                    </div>
                    <div class="chose-actual-pay" v-if="payways[paywayIndex].type == 'CASH_PAY'">

                        <div class="chose-actual-pay-item" v-for="(item,index) in defaultActualPayList" :class="[chosePriceIndex==index?'chose-actual-pay-item-active':'']" @click="setChosePriceInde(index)">
                            <text class="chose-actual-pay-price" :class="[chosePriceIndex==index?'chose-actual-pay-item-text-active':'']">{{item.sum | price}}</text>
                            <div class="row">
                                <text class="chose-actual-pay-cash" :class="[chosePriceIndex==index?'chose-actual-pay-item-text-active':'']">{{item.rem == 0?'不找零' :'找零:'}}</text>
                                <text class="chose-actual-pay-cash" :class="[chosePriceIndex==index?'chose-actual-pay-item-text-active':'']" v-if="item.rem">{{item.rem | price}}</text>
                            </div>
                        </div>

                        <div class="chose-actual-pay-item" :class="[chosePriceIndex==-1?'chose-actual-pay-item-active':'']" @click="setChosePriceInde(-1)">
                            <input type="number" class="type-in-actual-pay" ref="typeInPay" v-model="typeInPay" placeholder="其他额度现金"/>
                            <text class="chose-actual-pay-cash" :class="[chosePriceIndex==-1?'chose-actual-pay-item-text-active':'']">找零：{{otherMoney - overPrice | price}}</text>
                        </div>
                    </div>
                    <div class="chose-actual-pay" v-if="payways[paywayIndex].type != 'CASH_PAY'">
                        <div class="chose-actual-pay-item" :class="[chosePriceIndex==0?'chose-actual-pay-item-active':'']" @click="setChosePriceInde(0)">
                            <text class="chose-actual-pay-price" :class="[chosePriceIndex==0?'chose-actual-pay-item-text-active':'']">{{overPrice | price}}</text>
                            <text class="chose-actual-pay-cash" :class="[chosePriceIndex==0?'chose-actual-pay-item-text-active':'']">不找零</text>
                        </div>
                    </div>
                    <div class="cash-man">
                        <text class="cash-man-text">收银员：{{userInfo['USER.NAME']}}</text>
                    </div>
                </div>
                <div class="confirm-group">
                    <div class="confirm-group-item confirm-btn" @click='submitOrder'>
                        <text class="confirm-btn-text">确定</text>
                    </div>
                </div>
            </div>
        </div>
       
        <payConfirm :display="payConfirmDis" :data="payways[paywayIndex]" :money="overPrice" @event="payEvent" ref="confirm"></payConfirm>
        <renderTip :render="loading"></renderTip>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .settle-account{
        background-color: #333;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .header {
        height: 128*$rate;
        background-color: #fff;
        flex-direction: row;
        align-items: flex-end;
    }
    .back-btn {
        height: 94*$rate;
        width: 176*$rate;
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
    .body {
        background-color: #f6f6f6;
        flex: 1;
        padding-left: 27*$rate;
        padding-right: 27*$rate;
        padding-top: 21*$rate;
        padding-bottom: 21*$rate;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
    }
    .body-left {
        width: 720*$rate;
        flex-direction: column;
    }
    .need-pay-group {
        padding:34*$rate;
        height: 372*$rate;
        background-color: white;
        border-radius: 21*$rate;
    }
    .group-title {
        height: 41*$rate;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .group-title-name {
        color:#333333;
        font-size: round(34*$rate);
    }
    .need-pay-info-area {
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .total-need-pay {
        font-size: round(70*$rate);
        color: #ef484c;
        margin-bottom: 8*$rate;
    }
    .preferential-price {
        font-size:round(30*$rate);
        color:#333333;
    }
    .payway-group {
        margin-top: 21*$rate;
        flex: 1;
        padding:34*$rate;
        background-color: white;
        border-radius: 21*$rate;
    }
    .payways {
        margin-left: -21*$rate;
        flex-direction: row;
        flex-wrap: wrap;
        width: 635*$rate;
    }
    .payways-item {
        padding-left: 20*$rate;
        padding-right: 20*$rate;
        height: 83*$rate;
        justify-content: center;
        align-items: center;
        margin-left: 21*$rate;
        margin-top: 25*$rate;
        border-radius: 5*$rate;
        border-color: #aeaeae;
        border-width: 1*$rate;
        background-image: linear-gradient(to bottom right,#FFF,#FFF);
    }
    .payways-item-text {
        font-size: round(34*$rate);
        color:#ef484c;
    }
    .payways-item-active {
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        border-color: #ef4a4e;
    }
    .payways-item-text-active {
        color:white;
    }
    .body-right {
        width: 1230*$rate;
        border-radius: 21*$rate;
        background-color: white;
    }
    .actual-pay-group {
        padding-top: 32*$rate;
        padding-left: 68*$rate;
        padding-right: 68*$rate;
        padding-bottom: 32*$rate;
        flex: 1;
    }
    .chose-actual-pay {
        flex-direction: row;
        justify-content: space-between;
        margin-top: 21*$rate;
        flex-wrap: wrap;
        flex: 1;
    }
    .chose-actual-pay-item {
        margin-bottom: 27*$rate;
        border-radius: 10*$rate;
        width: 342*$rate;
        height: 248*$rate;
        border-color: #ef484c;
        border-width: 1*$rate;
        padding-top: 50*$rate;
        padding-bottom: 50*$rate;
        justify-content: space-between;
        align-items: center;
        background-image: linear-gradient(to bottom right,#FFF,#FFF);
    }
    .chose-actual-pay-price {
        font-size: round(57*$rate);
        color: #ef484c;
    }
    .chose-actual-pay-cash {
        font-size:round(30*$rate);
        color:#333333;
    }
    .chose-actual-pay-item-active {
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
    }
    .chose-actual-pay-item-text-active {
        color:white;
    }
    .type-in-actual-pay {
        height: 80*$rate;
        width: 341*$rate;
        placeholder-color:#999999;
        text-align: center;
        color:#333333;
        font-size: 38*$rate;
    }
    .cash-man {
        flex: 0;
        height: 46*$rate;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .cash-man-text {
        font-size: round(34*$rate);
        color: #333333;
    }
    .confirm-group {
        height: 170*$rate;
        padding-left: 53*$rate;
        padding-right: 53*$rate;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        border-top-width: 1*$rate;
        border-top-color: #bcbcbc;
    }
    .confirm-group-item {
        width: 329*$rate;
        height: 103*$rate;
        border-radius: 9999px;
        justify-content: center;
        align-items: center;
        margin-left: 15.5*$rate;
    }
    .cancel-btn {
        border-color: #ef4a4e;
        border-width: 1*$rate;
        background-color: white;
    }
    .cancel-btn-text {
        color:#ef494d;
        font-size: round(34*$rate);
    }
    .confirm-btn {
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
    }
    .confirm-btn-text {
        color:white;
        font-size: round(34*$rate);
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
<script>
    import icons from './assets/icon.js'
    import navigator from './common/navigator.js'
    import modal from './common/modal.js'
    import stream from './common/stream.js'
    import filters from './common/filters.js'
    import renderTip from './components/render-tip.vue'
    import payConfirm from './components/payment/pay-confirm.vue'
    const storage = weex.requireModule('storage')
    const getEvent = weex.requireModule('event')
    const globalEvent = weex.requireModule('globalEvent')
    const blueScanEvent = weex.requireModule('blueScanEvent');
    export default {
        data () {
            return {
                imageObj:{
                    backBtn:icons.commonIcons.backIcon
                },
                ways:{
                    'CASH_ACCT':{name:'现金',type:'CASH_PAY'},
                    'ALI_ACCT':{name:'支付宝',type:'ALI_PAY'},
                    'WX_ACCT':{name:'微信支付',type:'WX_PAY'},
                    'BANK_ACCT':{name:'银行卡',type:'BANK_CARD_PAY'},
                    'OTHER_ACCT':{name:'其他',type:'OTHER_PAY'}
                },
                codeObj:{},
                payways:[],
                paywayIndex:0,
                chosePriceIndex:0,
                typeInPay:'',
                orderInfo: {},
                userInfo:{},
                api:'/bee/store/order/bill/addByCommon',
                defaultActualPayList:[1,2,3,4],
                loading:false,
                accountInfo:{},
                payConfirmDis:false,
                orderId:''
            }
        },
        components: {
          renderTip,
          payConfirm
        },
        filters:{
            price: filters.price
        },
        mounted(){
                      
        },
        methods: {
            comeBack(){
                navigator.pop({
                'animated': "false"
                },function(){})
            },
            submitOrder(){
                var self = this
                self.loading = true
                storage.getItem('order_sort',res =>{
                    let val
                    let day = new Date().getDate()
                    if(res.result == 'success'){
                        val = JSON.parse(res.data)
                        if(val.date == day){
                            val.code ++ 
                        }else{
                            val = {
                                date: day,
                                code: 1
                            } 
                        }
                    }else{
                        val = {
                            date: day,
                            code: 1
                        }
                    }
                    self.codeObj = val
                    self.orderInfo['SORT_CODE'] = val.code
                    let payService = self.payways[self.paywayIndex]['PAY_WAY.EXTEND_SERVICE_TWO']
                    let acctType = self.payways[self.paywayIndex]['PAY_WAY.PAY_WAY_TYPE']
                    if(self.orderInfo['STORE_ORDER.MEMB_CARD_MONEY'] > 0 || payService){
                        if(payService){
                            self.orderInfo['IS_OVER'] = 'false'
                        }else{
                            self.orderInfo['IS_OVER'] = 'true'
                        }
                        stream.fetch({
                            method:'POST',
                            url:self.api,
                            body:self.orderInfo
                        },res=>{
                            self.loading = false
                            self.orderId = res.extraData['STORE_ORDER.ORDER_ID']
                            if(payService){
                                self.payConfirmDis = true
                            }else{
                                self.setAccount(val)
                            }                               
                        },res=>{
                            if(!res.ok || res.data.code != 0 ){
                                self.loading = false
                            }
                        })
                    }else{
                        self.orderInfo['IS_OVER'] = 'true'
                        storage.setItem('add_order',JSON.stringify(self.orderInfo),res =>{
                            self.setAccount(val)      
                        })
                    }
                })
            },
            setAccount(val){
                var self = this
                let index = self.orderInfo['STORE_ORDER.OTHER_PAY_WAY_TYPE']
                if(self.accountInfo[index]){
                    self.accountInfo[index].pay += self.overPrice/1
                }else{
                    self.accountInfo[index] = {
                        'pay' : self.orderInfo['STORE_ORDER.OTHER_PAY_WAY_MONEY']/1,
                        'recharge' : 0,
                        'return' : 0
                    }
                }
                if(self.orderInfo['STORE_ORDER.MEMB_CARD_MONEY'] > 0){
                    if(self.accountInfo['MEMB_CARD']){
                        self.accountInfo['MEMB_CARD'].pay += self.orderInfo['STORE_ORDER.MEMB_CARD_MONEY']/1
                    }else{
                        self.accountInfo['MEMB_CARD'] = {
                            'pay' : self.orderInfo['STORE_ORDER.MEMB_CARD_MONEY']/1,
                            'recharge' : 0,
                            'return' : 0
                        }
                    }
                }
                storage.setItem(self.storeId + 'account_data',JSON.stringify(self.accountInfo),res =>{
                    modal.toast({message:'结算成功',duration:2})
                    if(typeof(getEvent.goPrint) == "function"){
                        self.orderInfo['STORE_ORDER.STORE_ORDER_DETAILS'] = JSON.parse(self.orderInfo['STORE_ORDER.STORE_ORDER_DETAILS'])
                        self.orderInfo['STORE_ORDER.DISCOUNT_INFO_LIST'] = JSON.parse(self.orderInfo['STORE_ORDER.DISCOUNT_INFO_LIST'])
                        getEvent.goPrint(self.orderInfo,function(res){
                        })
                    }                   
                    storage.setItem('order_sort',JSON.stringify(val),res=>{
                        storage.setItem('page_refersh','clear_cart',res =>{
                            self.loading = false
                            setTimeout(()=>{ 
                                navigator.pop({
                                    'animated': "false"
                                },function(){})
                            },1000)                           
                        })
                    })
                })
            },
            /*
                选择支付方式
            */
            setPaywayIndex(type,index){
                this.orderInfo['STORE_ORDER.OTHER_PAY_WAY_TYPE'] = type.type
                this.paywayIndex = index
            },

            setChosePriceInde(index){
                if(index == -1){
                    this.orderInfo['GATHER_MONEY'] = this.otherMoney
                    this.orderInfo['ODD_CHANGE'] = (this.otherMoney - this.overPrice).toFixed(2)
                }else{
                    this.orderInfo['GATHER_MONEY'] = this.defaultActualPayList[index].sum
                    this.orderInfo['ODD_CHANGE'] = this.defaultActualPayList[index].rem
                }                
                this.chosePriceIndex = index

            },
            /*智能计算找零*/
            intelligentComputing(val){
                let result = []            
                let arr
                val = Number(val)
                if(val % 1< 0.001){
                    arr = [1,5,10,20,50,100]
                }else{
                    arr = [0.5,1,5,10,20,50,100]
                }
                arr.forEach(ele =>{
                    let part = val % ele < 0.001 ? val : (parseInt(val/ele) + 1) * ele
                    if(!result[0] || part > result[result.length -1].sum){
                        result.push({
                            sum: part,
                            rem: val % ele < 0.001 ? 0 : (ele - val % ele).toFixed(2)
                        })
                    }                    
                })
                return result
            },
            /*
            支付宝支付
            */
            aliPay(code,id){
                var self = this
                var pid = self.payways[self.paywayIndex]['PAY_WAY.EXTEND_SERVICE_ONE']
                var acct = self.payways[self.paywayIndex]['PAY_WAY.EXTEND_SERVICE_TWO']
                stream.fetch({
                    method: 'POST',
                    url: '/ali/pay/microPay',
                    type: 'json',
                    body:{
                        'ORDER_ID':id,
                        'FEE': self.overPrice.toFixed(2),
                        'REMARK':'boloogo收银-支付宝订单支付',
                        'BODY':'boloogo收银-支付宝订单支付',
                        'TYPE':'ORDER',
                        'PID': pid,
                        'PID_TOKEN': acct,
                        'PAY_CLIENT':'redBoloogo',
                        'SOURCE':'redBoloogo',
                        'BAR_CODE':code
                    }
                },res =>{

                    self.aliQueryState(res.extraData['OUT_TRADE_NO']).then(response=>{
                        self.orderInfo['OUT_TRADE_NO'] = res.extraData['OUT_TRADE_NO']
                        self.setAccount(self.codeObj)
                    })
                },res =>{
                    if(!res.ok || res.data.code != 0 ){
                        self.loading = false
                    }
                })
            },
            /*
            支付宝支付
            轮训查询支付结果
            */
            aliQueryState(id){
                var self = this
                stream.fetch({
                    method: 'GET',
                    url: '/alipay/queryTradeState?ALI_PAY_ITEM.OUT_TRADE_NO=' + id,
                    type: 'json'
                },res =>{
                    if(!res.data[0]){
                        self.loading = false
                        modal.alert({message:'支付失败'})
                    }else if(res.data[0]['ALI_PAY_ITEM.PAY_STATE'] == '1'){
                        self.payConfirmDis = false
                        modal.toast({message:'支付成功',duration:1.5})
                        self.orderInfo['OUT_TRADE_NO'] = id
                        self.setAccount(self.codeObj)
                    }else{
                        setTimeout(()=>{
                            self.aliQueryState(id)
                        },2000)
                    }
                },res =>{
                    if(!res.ok || res.data.code != 0 ){
                        self.loading = false
                    }
                })
            },
            /*
            微信支付
            */
            wxPay(code,id){
                var self = this

                var acct = self.payways[self.paywayIndex]['PAY_WAY.EXTEND_SERVICE_TWO']
                stream.fetch({
                    method: 'POST',
                    url: '/wx/pay/microPay',
                    type: 'json',
                    body:{
                        'PRODUCT_ID':id,
                        'FEE': self.overPrice.toFixed(2),
                        'REMARK2':'boloogo收银-微信支付',
                        'BODY':'boloogo收银-微信支付',
                        'TYPE':'ORDER',
                        'PAY_CLIENT':'APP',
                        'SOURCE':'redBoloogo',
                        'AUTH_CODE':code,
                        'MCH_ID':acct
                    }
                },res =>{
                    self.wxQueryState(res.extraData['OUT_TRADE_NO'])
                },res =>{
                    if(!res.ok || res.data.code != 0 ){
                        self.loading = false
                    }
                })

            },
            /*
            微信支付
            轮训查询支付结果
            */
            wxQueryState(id){
                var self = this
                stream.fetch({
                    method: 'GET',
                    url: '/wxpay/queryTradeState?WX_PAY_ITEM.OUT_TRADE_NO=' + id,
                    type: 'json'
                },res =>{
                    if(!res.data[0]){
                        self.loading = false
                        modal.alert({message:'支付失败'})
                    }else if(res.data[0]['WX_PAY_ITEM.PAY_STATE'] == '1'){
                        self.payConfirmDis = false
                        self.orderInfo['OUT_TRADE_NO'] = id
                        modal.toast({message:'支付成功',duration:1.5})
                        self.setAccount(self.codeObj)
                    }else{
                        setTimeout(()=>{
                            self.wxQueryState(id)
                        },2000)
                    }
                },res =>{
                    if(!res.ok || res.data.code != 0 ){
                        self.loading = false
                    }
                })
            },
            payEvent(res){
                if(res){
                    this.loading = true
                    let type = this.payways[this.paywayIndex].type

                    if( type == 'ALI_PAY'){
                        this.aliPay(res,this.orderId).then(res=>{

                        })
                    }else if( type == 'WX_PAY'){
                        this.wxPay(res,this.orderId).then(res=>{

                        })
                    }
                    
                }else{
                    this.payConfirmDis = false
                }
            }
        },
        
        created(){
            
            var self = this
            // if(typeof blueScanEvent.listenPayBlueScan == 'function'){
            if(blueScanEvent){
                blueScanEvent.listenPayBlueScan()
                if(typeof globalEvent.addEventListener == 'function'){    
                  globalEvent.addEventListener("payBlueScanInfo", function (e) {
                    if(!self.loading){
                        self.$refs.confirm.submit(e.info)
                    }                   
                  });             
                }
            } 
            storage.getItem('store_pay_type',res =>{
                
                let val = JSON.parse(res.data)
                console.log(val)
                if(val.length == 0){
                    modal.alert({message:'请配置支付方式'})
                }else{
                    this.payways = val
                    this.payways.forEach(ele =>{
                        let obj = this.ways[ele['PAY_WAY.PAY_WAY_TYPE']]
                        ele.type = obj.type
                    })
                }
                storage.getItem('orderInfo',function(res){
                    if(res.result == 'success' && res.data){
                        self.orderInfo = JSON.parse(res.data)
                        self.orderInfo['STORE_ORDER.OTHER_PAY_WAY_TYPE'] = self.payways[0].type
                        self.defaultActualPayList = self.intelligentComputing(self.orderInfo['STORE_ORDER.OTHER_PAY_WAY_MONEY'])
                    }
                })
            })
            
            storage.getItem('userInfo',function(res){
                if(res.result == 'success' && res.data){
                    self.userInfo = JSON.parse(res.data)
                }
            })
            storage.getItem('store_info',function(res){
                if(res.result == 'success' && res.data){
                    self.storeId = JSON.parse(res.data)['STORE.STORE_ID']
                    storage.getItem(self.storeId + 'account_data',function(res){
                        if(res.result == 'success' && res.data){
                            
                            self.accountInfo = JSON.parse(res.data)
                            
                        }
                    })
                }
            })
        },

        computed: {
           otherMoney(){
            return parseFloat(this.typeInPay ? this.typeInPay : this.overPrice)
           },
           overPrice(){
            return this.orderInfo['STORE_ORDER.OTHER_PAY_WAY_MONEY']
           },
            discount(){
            return JSON.parse(this.orderInfo['STORE_ORDER.DISCOUNT_MONEY'])
           }
        }
    }
</script>