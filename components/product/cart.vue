<template>
    <div class="cart-container">
        <scroller class="no-product-show" v-if="cartList.length > 0">       
        <div v-for="(product,index) in cartList" class="list-item">
            <div class="product-info-group" @click="setData(index)">
                <text class="product-intro product-name">{{product["PRODUCT_SKU.SKU_NAME"]}}</text>
                <text class="product-intro product-kind" v-if="product['PRODUCT_SKU.SKU_CONTENT']['CONTENT']">{{product["PRODUCT_SKU.SKU_CONTENT"]["CONTENT"]}}</text>
                <div class="flex-row">
                <text class="product-intro product-price">{{product["PRICE"] | price}}</text>
                <text class="product-intro product-oldprice" v-if="product['PRICE'] != product['PRODUCT_SKU.ORDER_PRICE']">{{product["PRODUCT_SKU.ORDER_PRICE"] | price}}</text>
                </div>
                <text class="product-intro product-price" v-if="product['REMARK']">备注：{{product["REMARK"]}}</text>
            </div>
            <div class="count-group">
                <div class="count-group-item reduce-btn" @click="upData('-1',index)">
                    <image :src="reduce" class="count-btn-image"></image>
                </div>
                <text class="count-group-item product-count" @click="upData('0',index)">{{product.COUNT}}</text>
                <div class="count-group-item add-btn" @click="upData('1',index)">
                    <image :src="add" class="count-btn-image"></image>
                </div>
            </div>
        </div> 
        </scroller>
        <div class="remark" v-if="remark" @click="addRemark">
            <text class="remark-text">整单备注:{{remark}}</text>    
        </div>   
        <div class="no-product-show" v-if="cartList.length == 0">
            <div class="tip">
                <div class="tip-icon">
                    <image class="no-product-show-image" :src='pinkCart'></image>
                </div> 
                <div class="no-product-show-text-area">
                    <text class="no-product-show-text">购物车还是空的哦！</text>
                </div>            
            </div>
        </div>                             
        <div class="billings-area">
            <div class="computed-area">
                <div class="computed-col">
                    <text class="computed-area-total-count-text">总数：{{sumCount}}</text>
                </div>
                <div class="computed-col">
                    <text class="computed-area-total-preferential-text">合计:{{sumPrice | price}}</text>
                    <text class="computed-should-pay" v-if="discount > 0">优惠: -{{discount | price}}</text>
                    <text class="computed-should-pay" v-if="memberPay > 0">会员卡: -{{memberPay | price}}</text>
                </div>
            </div>
            <div class="pay-operate-btn-group">
                <div class="pay-operate-wait-pay" @click="emptyAll">
                    <text class="pay-operate-empty-text">清空</text>
                </div>
                <div class="pay-operate-wait-pay" @click="openPendingOrderModal">
                    <text class="pay-operate-wait-pay-text">挂单</text>
                </div>
                <div class="pay-operate-wait-pay" @click="addRemark">
                    <text class="pay-operate-wait-pay-text">备注</text>
                </div>
                <div class="pay-operate-wait-pay" @click="openPreferentialModal(prdOverPrice)">
                    <text class="pay-operate-wait-pay-text">优惠</text>
                </div>
            </div>
            <div class="pay-right-now" @click='submit'>
                <text class="pay-right-now-text">去结算</text>
                <text class="pay-right-now-h1" ref="ant">{{overPrice | price}}</text>
            </div>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .cart-container {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 604*$rate;
        background-color: white;
    }
    .tip{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0; 
        justify-content: center;
        align-items: center;
    }
    .tip-icon{
        width: 184*$rate;
        height: 184*$rate;
        border-radius: 99;
        justify-content: center;
        align-items: center;
        background-color: #FFFBFC;
        margin-bottom: 40*$rate;
    }
    .no-product-show {
        position: absolute;
        top: 0;
        bottom: 430*$rate;
        left: 0;
        right: 0;
        flex-direction: column;
        border-bottom-width: 1*$rate;
        border-bottom-color: #999;
        border-bottom-style: solid;
    }
    .no-product-show-image {
        width: 95*$rate;
        height: 91*$rate;       
    }
    .no-product-show-text-area {
        justify-content: center;
        align-items: center;
    }
    .no-product-show-text {
        color:#999999;
        font-size: round(28*$rate);
    }
    .product-intro {
        margin-top:10*$rate;
        margin-bottom:10*$rate;
    }
    .list-item {
        border-bottom-color: #d6d7dc;
        border-bottom-width: 1*$rate;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
        padding-left: 20*$rate;
        padding-right: 20*$rate;
        width: 604*$rate;
    }
    .product-info-group {
        flex:1;
    }
    .product-name {
        font-size: round(26*$rate);
        color:#333333;
    }
    .product-kind {
        font-size: round(26*$rate);
        color:#666666;
    }
    .product-price {
        font-size: round(28*$rate);
        color: #ef484c;
    }
    .product-oldprice {
        font-size: round(28*$rate);
        color: #999;
        text-decoration: line-through;
        margin-left: 20*$rate;
    }
    .count-group {
        width: 220*$rate;
        height: 50*$rate;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .reduce-btn {
        width: 70*$rate;
        height: 70*$rate;
    }
    .product-count {
        font-size: round(26*$rate);
        color:#000000;
        padding-left: 20*$rate;
        padding-right: 20*$rate;
    }
    .add-btn {
        width: 70*$rate;
        height: 70*$rate;
    }
    .count-btn-image {
        width: 70*$rate;
        height: 70*$rate;
    }
    .billings-area {
        position: absolute;
        bottom: 0;
        height: 430*$rate;
    }
    .computed-area {
        padding: 30*$rate;
        width: 604*$rate;
        flex-direction: row;
        justify-content: space-between;
    }
    .computed-col {
        flex-direction: column;
        justify-content: space-between;
    }
    .computed-row-set-right {
        justify-content: flex-end;
    }
    .computed-area-total-count {
        flex:1;
    }
    .computed-area-total-count-text {
        font-size: round(26*$rate);
        color:#333333;
    }
    .computed-area-total-preferential {
        flex: 1;
    }
    .computed-area-total-preferential-text {
        font-size: round(26*$rate);
        color:#333333;
        text-align: right;
    }
    .computed-item {
        flex: 0;
        flex-direction: row;
        justify-content: space-between;
    }
    .computed-item-number {
     
    }
    .computed-total-price {
        font-size: round(26*$rate);
        color:#333333;
    }
    .computed-preferential {
        font-size: round(26*$rate);
        color:#333333;
    }
    .computed-member-assets {
        font-size: round(35*$rate);
        color:#ef494d;
        text-align: right;
        margin-top: 30*$rate;
    }
    .computed-member-assets-amount {
        font-size:  round(26*$rate);
        color:#ef494d;
        text-align: right;
    }
    .computed-member-assets-disable {
        color:#999999;
    }
    .computed-should-pay {
        font-size: round(26*$rate);
        color: #ef494d;
        margin-top: 20*$rate;
        text-align: right;
    }
    .pay-operate-btn-group {
        position: absolute;
        bottom: 160*$rate;
        width: 604*$rate;
        border-top-color: #d6d7dc;
        border-top-width: 1*$rate;
        flex-direction: row;
        justify-content: space-between;
    }
    .pay-operate-wait-pay {
        flex: 1;
        height: 80*$rate;
        justify-content: center;
        align-items: center;
        border-right-color: #d6d7dc;
        border-right-width: 1*$rate;
    }
    .pay-operate-preferential {
        width: 304*$rate;
        height: 80*$rate;
        justify-content: center;
        align-items: center;
    }
    .pay-operate-empty-text {
        font-size: round(28*$rate);
        color:#999999;
    }
    .pay-operate-wait-pay-text {
        font-size: round(28*$rate);
        color:#ef494d;
    }
    .pay-operate-preferential-text {
        font-size: round(28*$rate);
        color:#ef494d;
        
    }
    .pay-right-now {
        width: 604*$rate;
        height: 160*$rate;
        position: absolute;
        bottom: 0*$rate;
        padding: 30*$rate;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .pay-right-now-text {
        font-size: round(30*$rate);
        color: white;
    }
    .should-pay-in-btn {
        font-size: round(30*$rate);
        color: white;
        font-weight: bolder;
    }
    .anmition-div{
        width: 200*$rate;
        height: 50*$rate;
    }
    .pay-right-now-h1{
        font-size: round(70*$rate);
        color: white;
        font-weight: bold;
    }
    .flex-row{
        flex-direction: row;
    }
    .remark{
        position: absolute;
        bottom: 430*$rate;
        left: 0;
        right: 0;
        padding: 30*$rate;
        background-color:#fff;
    }
    .remark-text{
        font-size: round(33*$rate);
        color:#ef494d;
    }
</style>
<script>
    import icons from '../../assets/icon.js'
    import navigator from '../../common/navigator.js'
    import stream from '../../common/stream.js'
    import modal from '../../common/modal.js'
    import filters from '../../common/filters.js'
    const storage = weex.requireModule('storage')
    const animation = weex.requireModule('animation')
    const getEvent = weex.requireModule('event')
    export default {
        data () {
            return {
                
                pinkCart: icons.shoppingCartIcons.cartIcon,
                add: icons.shoppingCartIcons.add,
                reduce: icons.shoppingCartIcons.reduce,
                addApi:'/bee/store/order/bill/addByCommon'
            }
        },
        filters: {
            price:filters.price
        },
        props:['cartList','discountInfo','member','remark'],
        computed: {
            sumCount (){
                var count = 0;
                this.cartList.map((ele) => {
                    count += ele.COUNT
                })
                return count
            },
            sumPrice (){
                var price = 0;
                this.cartList.map((ele) => {
                    price += ele.COUNT * ele['PRODUCT_SKU.ORDER_PRICE']
                })
                return price
            },
            prdOverPrice(){
                var price = 0;
                this.cartList.map((ele) => {
                    price += ele.COUNT * ele['PRICE']
                })
                return price
            },
            overPrice() {
                if(this.payMoney - this.memberPay > 0){

                   return this.payMoney - this.memberPay

                }else{
                    return 0
                }                
            },
            payMoney(){
                return this.sumPrice - this.discount
            },
            changePrice(){
                var price = 0 
                this.cartList.map((ele) =>{
                    if(ele['PRICE'] != ele['PRODUCT_SKU.ORDER_PRICE']){
                        price = price + (ele['PRODUCT_SKU.ORDER_PRICE'] - ele['PRICE'])*ele['COUNT']
                    }
                })
                return price
            },
            discount(){
                return (this.discountInfo.type == 'ORDER_DISCOUNT' ? this.discountInfo.discount : ((this.sumPrice - this.changePrice) * (10 - this.discountInfo.rate)/10)) + this.changePrice
            },
            memberPay(){
                var val = 0
                var member = this.member['MEMB_CARD.USABLE_MONEY'] ? this.member['MEMB_CARD.USABLE_MONEY']  : 0

                val =  (member - this.payMoney  >= 0) ? this.payMoney : member

                return val
            }
        },  
        watch:{
            overPrice(){
                this.animated()
            }
        }, 
        methods: {
            animated(){
                var ele = this.$refs.ant;
                animation.transition(ele, {
                  styles: {
                    transform:'scale(1.5)',
                  },
                  duration: 200, //ms
                  timingFunction: 'ease',
                  needLayout:false,
                  delay: 0 //ms
                }, function () {
                  animation.transition(ele, {
                      styles: {
                        transform:'scale(1)',
                      },
                      duration: 200, //ms
                      timingFunction: 'ease',
                      needLayout:false,
                      delay: 0 //ms
                  }, function () {
                  
                  })
                })
            },
            upData (type,index){
                if(type == '1'){
                    this.cartList[index]['COUNT'] ++
                }else if(type == '-1'){
                    this.cartList[index]['COUNT'] --                   
                }else{
                    this.$emit('event',{
                        data:this.cartList[index]['COUNT'],
                        index: index,
                        type: 'COUNT'
                    })
                }                    
                this.$set(this.cartList,index,this.cartList[index])
                this.cartList[index]['COUNT'] == 0 ? this.cartList.splice(index,1) : ''           
            },
            setData(index){
                this.$emit('modify',{
                    data:this.cartList[index],
                    index: index,
                })
            },
            openPreferentialModal (sumPrice) {
       
                this.$emit('event',sumPrice)
            },
            openPendingOrderModal () {
                let $this = this
                modal.alert({message:'此功能还未开放'})
            },
            emptyAll () {
                let $this = this
                modal.confirm({
                    message:'确定清空所选商品？',
                    okTitle:'确定',
                    cancelTitle:'取消',
                },result => {
                    result === '确定' ? $this.$emit('event',-1) : ''
                })
            },
            addRemark(){
                this.$emit('openremark',true,this.remark)
            },
            submit () {
                let self = this
                if(this.cartList.length){
                    storage.getItem('store_info',res =>{
                        let val = JSON.parse(res.data)
                        let tel = val['STORE.CONTACT_PHONE']
                        let name = val['STORE.STORE_NAME']
                        let service = val['STORE.SERVICE_ID']
                        let obj = {
                            'IS_OVER': 'true',
                            'STORE_ORDER.MEMB_CARD_MONEY': self.memberPay,
                            'STORE_ORDER.OTHER_PAY_WAY_TYPE':'CASH_PAY',
                            'STORE_ORDER.OTHER_PAY_WAY_MONEY':self.overPrice,
                            'STORE_ORDER.MEMB_CARD_NUM': self.member['MEMB_CARD.MEMB_CARD_ID'],
                            'STORE_ORDER.MEMB_PHONE': self.member['MEMBER.PHONE'],
                            'STORE_ORDER.UID':self.member['MEMBER.UID'],
                            'STORE_ORDER.USER_NAME': self.member['MEMBER.NAME'], 
                            'STORE_ORDER.DISCOUNT_MONEY': self.discount,
                            'STORE_ORDER.REMARK': self.remark,
                            'STORE_ORDER.MEMB_CARD_INTEGRAL': self.member['MEMB_CARD.USABLE_POINT'],
                            'STORE_ORDER.MEMB_CARD_BALANCE': self.member['MEMB_CARD.USABLE_MONEY'],
                            'SERVICE_ID':service,
                            'ADD_TIME': '',
                            'GATHER_MONEY': self.overPrice,
                            'ODD_CHANGE':'0',
                            'STORE_NAME':name,
                            'STORE_TEL':tel,
                            'SORT_CODE':'',
                            'SHOULD_PRINT_WIFI':1,
                            'STORE_ORDER.DISCOUNT_INFO_LIST':JSON.stringify([{"DISCOUNT_INFO.DISCOUNT_TYPE":self.discountInfo.type,"DISCOUNT_INFO.RATE":self.discountInfo.rate,"DISCOUNT_INFO.MONEY":self.discountInfo.discount,"DISCOUNT_INFO.REMARK":""}]),
                            'STORE_ORDER.STORE_ORDER_DETAILS':JSON.stringify(self.cartList.map(item => {
                                return {
                                    'STORE_ORDER_DETAIL.COUNT':item['COUNT'],
                                    'STORE_ORDER_DETAIL.PRD_PRICE':item['PRICE'],
                                    'STORE_ORDER_DETAIL.SKU_NAME':item["PRODUCT_SKU.SKU_NAME"],
                                    'STORE_ORDER_DETAIL.SKU_CONTENT':item["PRODUCT_SKU.SKU_CONTENT"]["CONTENT"],
                                    'STORE_ORDER_DETAIL.OLD_PRICE':item['PRODUCT_SKU.ORDER_PRICE'],
                                    'STORE_ORDER_DETAIL.SKU_ID':item['PRODUCT_SKU.SKU_ID'],
                                    'STORE_ORDER_DETAIL.PRD_ID':item['PRODUCT_SKU.PRD_ID'],
                                    'STORE_ORDER_DETAIL.REMARK':item['REMARK'],
                                }
                            }))
                        }
                        if(self.overPrice == 0){
                            self.addOrder(obj,val['STORE.STORE_ID'])
                        }else{
                            storage.setItem('orderInfo',JSON.stringify(obj),function(){
                                navigator.push({
                                    'url':'/payment',
                                    'animated': 'false'
                                })
                            })
                        }                       
                    }) 
                    
                    
                }else {
                    modal.alert({
                        message:'没有要结算的商品'
                    })
                }
                
            },
            addOrder(obj,storeId){
                var self = this
                self.$emit('render',true)
                stream.fetch({
                  method:"POST",
                  url:self.addApi,
                  body:obj
                },res=>{
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
                        obj['SORT_CODE'] = val.code
                        storage.getItem(storeId + 'account_data',function(res){
                            var accountInfo = {}
                            if(res.result == 'success'){
                                
                                accountInfo = JSON.parse(res.data)
                                
                            }
                            if(accountInfo['MEMB_CARD']){

                                accountInfo['MEMB_CARD'].pay += self.memberPay/1

                            }else{
                                accountInfo['MEMB_CARD'] = {
                                    'pay' : self.memberPay/1,
                                    'recharge' : 0,
                                    'return' : 0
                                } 
                            }
                            storage.setItem(storeId + 'account_data',JSON.stringify(accountInfo),res =>{
                                self.$emit('event',-1)
                                self.$emit('render',false,self.memberPay)
                                modal.toast({message:'结算成功',duration:2})
                                if(getEvent && typeof(getEvent.goPrint) == "function"){
                                    obj['STORE_ORDER.STORE_ORDER_DETAILS'] = JSON.parse(obj['STORE_ORDER.STORE_ORDER_DETAILS'])
                                    obj['STORE_ORDER.DISCOUNT_INFO_LIST'] = JSON.parse(obj['STORE_ORDER.DISCOUNT_INFO_LIST'])
                                    getEvent.goPrint(obj,function(res){

                                    })
                                }                   
                                storage.setItem('order_sort',JSON.stringify(val),res=>{

                                })
                            })
                        })     
                    })

                  
                },res=>{
                    if(!res.ok || res.data.code != 0){
                        self.$emit('render',false,0)  
                    }                            
                }) 
            }
        },
    }
</script>