<template>
    <div class="order-detail" v-if="order['STORE_ORDER.ORDER_CODE']">
        <div class="order-detail-body">
            <div class="detail-title">
                <text class="detail-title-text">单据号 : {{order['STORE_ORDER.ORDER_CODE']}}</text>                
                <text class="detail-title-text">(收银员 : {{order['STORE_ORDER.OPERATOR_NAME']}})</text>
            </div>
            <div class="order-detail-info-group">
                <div class="order-detail-table">
                    <div class="table-head empty-bottom-border-style" :class="[isReturn?'':'no-reject-sign']">
                        <text class="table-head-text">{{order['STORE_ORDER.ADD_DATETIME']}}</text>
                        <text class="table-head-text">{{order['STORE_ORDER.USER_NAME'] || '匿名'}}</text>
                        <image class="order-reject-sign" :src="returnIcon" v-if="isReturn"></image>
                    </div>
                    <scroller class="table-body">
                        <div class="table-body-col empty-top-border-style">
                            <div class="col-product col-product-middle">
                                <text class="col-product-text col-text">商品</text>
                            </div>
                            <div class="col-count">
                                <text class="col-count-text col-text">数量</text>
                            </div>
                            <div class="col-sum">
                                <text class="col-sum-text col-text">小计</text>
                            </div>
                        </div>
                        <div class="empty-top-border-style row-item" v-for="item in order['STORE_ORDER.STORE_ORDER_DETAILS']">
                            <div class="col-product">
                                <text class="product-text">{{item['STORE_ORDER_DETAIL.PRD_NAME']}}</text>
                                <text class="sku-text">{{item['STORE_ORDER_DETAIL.SKU_CONTENT']}}</text>
                                <div class="flex-row">
                                    <text class="single-price-text">{{item['STORE_ORDER_DETAIL.PRD_FINAL_PRICE'] | price}}</text>
                                    <text class="single-price-oldtext" v-if="item['STORE_ORDER_DETAIL.PRD_PRICE'] - item['STORE_ORDER_DETAIL.PRD_FINAL_PRICE'] != 0">{{item['STORE_ORDER_DETAIL.PRD_PRICE'] | price}}</text>
                                </div>                                
                            </div>
                            <div class="col-count">
                                <text class="count-text">x {{item['STORE_ORDER_DETAIL.COUNT']}}</text>
                            </div>
                            <div class="col-sum">
                                <text class="col-sum-name">{{(item['STORE_ORDER_DETAIL.PRD_SUM_FINAL_PRICE']) | price}}</text>
                            </div>
                        </div>
                    </scroller>
                </div>
            </div>
        </div>
        <div class="computed-group">
            <div class="total-computed">
                <text class="total-computed-text">总数 {{order.COUNT}}</text>
                <!-- <text class="total-computed-text" v-if="isRejectOrder">，已退 15</text> -->
            </div>
            <div class="computed-group-item">
                <div class="coumputed-item-name-group">
                    <div class="computed-item-name">
                        <text class="coumputed-item-name-text">合计 :</text>
                    </div>
                    <div class="computed-item-name" v-if="order['STORE_ORDER.DISCOUNT_INFO']['0']">
                        <text class="coumputed-item-name-text">{{discountType[order['STORE_ORDER.DISCOUNT_INFO']['0']['DISCOUNT_INFO.DISCOUNT_TYPE']]}} :</text>
                    </div>
                    <div class="computed-item-name" v-if="order['STORE_ORDER.DISCOUNT_INFO']['1']">
                        <text class="coumputed-item-name-text">{{discountType[order['STORE_ORDER.DISCOUNT_INFO']['1']['DISCOUNT_INFO.DISCOUNT_TYPE']]}} :</text>
                    </div>
                    <div class="computed-item-name">
                        <text class="coumputed-item-name-text">订单金额 :</text>
                    </div>
                </div>
                <div class="coumputed-item-value-group">
                    <div class="computed-item-value">
                        <text class="computed-item-value-text">{{order['STORE_ORDER.SUM_PRD_MONEY'] | price}}</text>
                    </div>
                    <div class="computed-item-value" v-if="order['STORE_ORDER.DISCOUNT_INFO']['0']">
                        <text class="computed-item-value-text  computed-item-value-red-text">-{{order['STORE_ORDER.DISCOUNT_INFO']['0']['DISCOUNT_INFO.MONEY'] | price}}</text>
                    </div>
                    <div class="computed-item-value" v-if="order['STORE_ORDER.DISCOUNT_INFO']['1']">
                        <text class="computed-item-value-text  computed-item-value-red-text">-{{order['STORE_ORDER.DISCOUNT_INFO']['1']['DISCOUNT_INFO.MONEY'] | price}}</text>
                    </div>
                    <div class="computed-item-value">
                        <text class="computed-item-value-h1">{{order['STORE_ORDER.PAID_MONEY'] | price}}</text>
                    </div>
                </div>
            </div>
        </div>
        <div class="confirm-group">
            <!-- <div class="confirm-group-item only-reject-product-btn">
                <text class="confirm-group-item-text">仅退款</text>
            </div>
            <div class="confirm-group-item reject-all-btn">
                <text class="confirm-group-item-text">退货退款</text>
            </div> -->
            <div class="confirm-group-item print-btn" @click="print">
                <text class="confirm-group-item-text print-btn-text">打印</text>
            </div>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    $rem:0.472;
    .order-detail {
        background-color: white;
        width:(1060*$rate)
    }
    .order-detail-body {
        flex: 1;
        padding-left: 22.46/$rem*$rate;
        padding-right: 22.46/$rem*$rate;
        padding-top: 6.84/$rem*$rate;
        padding-bottom: 6.84/$rem*$rate;
        flex-direction: column;
    }
    .detail-title {
        height: 52.73/$rem*$rate;
        padding-left: 12.21/$rem*$rate;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .detail-title-text {
        font-size:round( 16/$rem*$rate);
        color:#333333;
    }
    .order-detail-info-group {
        flex: 1;
    }
    .order-detail-table {
        flex: 1;
    }
    .table-head {
        height: 34.18/$rem*$rate;
        background-color: #f6f6f6;
        padding-left: 56.64/$rem*$rate;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        /*padding-right: 5.86/$rem*$rate;*/
        /*padding-left: 11.72/$rem*$rate;*/
        padding-right: 19.53/$rem*$rate;
    }
    .no-reject-sign {
        padding-left: 11.72/$rem*$rate;
    }
    .table-head-text {
        font-size:round( 14/$rem*$rate);
        color: #333333;
    }
    .order-reject-sign {
        position: absolute;
        left:18.55/$rem*$rate;
        top: 0;
        width: 22.46/$rem*$rate;
        height: 25.88/$rem*$rate;
    }
    .table-body {
        flex: 1;
    }
    .empty-bottom-border-style {
        border-top-width: 0.49/$rem*$rate;
        border-left-width: 0.49/$rem*$rate;
        border-right-width: 0.49/$rem*$rate;
        border-top-color: #d4d4d4;
        border-left-color: #d4d4d4;
        border-right-color: #d4d4d4;
    }
    .empty-top-border-style {
        border-bottom-width: 0.49/$rem*$rate;
        border-left-width: 0.49/$rem*$rate;
        border-right-width: 0.49/$rem*$rate;
        border-bottom-color: #d4d4d4;
        border-left-color: #d4d4d4;
        border-right-color: #d4d4d4;
    }
    .table-body-col {
        height: 40.04/$rem*$rate;
        flex-direction: row;
        align-items: stretch;
        
    }
    .col-product {
        flex: 1;
        padding-left: 11.72/$rem*$rate;
        justify-content: space-between;
        flex-direction: column;
    }
    .col-product-middle {
        justify-content: center;
    }
    .col-count {
        width: 61.52/$rem*$rate;
        justify-content: center;
        align-items: center;
    }
    .col-sum {
        width: 100.59/$rem*$rate;
        padding-right: 19.53/$rem*$rate;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .col-text {
        font-size:round( 14/$rem*$rate);
        color: #333333;
    }
    .row-item {
        height: 73.24/$rem*$rate;
        padding-top: 8.30/$rem*$rate;
        padding-bottom: 8.30/$rem*$rate;
        flex-direction: row;
        align-items: stretch;
    }
    .product-text {
        color: #333333;
        font-size:round( 14/$rem*$rate);
        lines:1;
        text-overflow: ellipsis;
    }
    .sku-text {
        color: #666666;
        font-size:round( 13/$rem*$rate);
    }
    .single-price-text {
        font-size:round( 13/$rem*$rate);
        color: #ef484c;
    }
    .single-price-oldtext{
        font-size:round( 13/$rem*$rate);
        color: #999;
        text-decoration: line-through;
        margin-left: 20*$rate;
    }
    .count-text {
        font-size:round( 14/$rem*$rate);
        color:#333333;
    }
    .col-sum-name {
        font-size:round( 13/$rem*$rate);
        color: #333333;
    }
    .computed-group {
        height: 157.71/$rem*$rate;
        border-top-color: #d4d4d4;
        border-top-width: 0.49/$rem*$rate;
        border-bottom-color: #d4d4d4;
        border-bottom-width: 0.49/$rem*$rate;
        padding-left: 21/$rem*$rate;
        padding-right: 21/$rem*$rate;
        padding-top: 16.60/$rem*$rate;
        padding-bottom: 16.60/$rem*$rate;
        justify-content: space-between;
        flex-direction: row;
        align-items: stretch;
    }
    .computed-group-item {
        flex: 1;
        flex-direction: row;
        align-items: stretch;
        justify-content: space-between;
    }
    .total-computed {
        position:absolute;
        width: 209.96/$rem*$rate;
        height: 18.07/$rem*$rate;
        left:21/$rem*$rate;
        top:16.60/$rem*$rate;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .total-computed-text {
        font-size:round( 16/$rem*$rate);
        color: #333333;
    }
    .coumputed-item-name-group {
        flex: 1;
        flex-direction: column;
        justify-content:space-between;
        align-items: stretch;
    }
    .computed-item-name {
        height: 21.97/$rem*$rate;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .computed-item-name-has-extra {
        justify-content: space-between;
    }
    .coumputed-item-name-text {
        font-size:round( 16/$rem*$rate);
        color: #333333;
    }
    .extra-explain {
        color:#aaa2a2;
        font-size:round( 16/$rem*$rate);
    }
    .coumputed-item-value-group {
        width: 80/$rem*$rate;
        flex-direction: column;
        justify-content:space-between;
        align-items: stretch;
    }
    .computed-item-value {
        height: 21.97/$rem*$rate;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .computed-item-value-text {
        font-size:round( 16/$rem*$rate);
        color: #333333;
    }
    .computed-item-value-h1 {
        font-size:round( 19/$rem*$rate);
        color: #333333;
    }
    .computed-item-value-red-text {
        color:#ef494d;
    }
    .confirm-group {
        height: 71.29/$rem*$rate;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding-left: 21/$rem*$rate;
        padding-right: 21/$rem*$rate;
    }
    .confirm-group-item {
        width: 136.72/$rem*$rate;
        height: 43.94/$rem*$rate;
        background-color: white;
        border-radius: 9999/$rem*$rate;
        border-color: #ef484c;
        border-width: 0.49/$rem*$rate;
        justify-content: center;
        align-items: center;
    }
    .only-reject-product-btn {
        margin-right: 21/$rem*$rate;
    }
    .reject-all-btn {
        margin-right: 7.32/$rem*$rate;
    }
    .confirm-group-item-text {
        color:#ef484c;
        font-size:round( 16/$rem*$rate);
    }
    .print-btn {
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
    }
    .print-btn-text {
        color:white;
    }
    .flex-row{
        flex-direction: row;
        align-items: center;
    }
</style>
<script>
    import icon from '../../assets/icon.js'
    import filters from '../../common/filters.js'
    import stream from '../../common/stream.js'
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    const getEvent = weex.requireModule('event')

    export default {
        data () {
            return {
                returnIcon: icon.orderIcon.return,
                isRejectOrder: false,
                discountType:{
                    'PRD_DISCOUNT':'单品优惠',
                    'DISCOUNT':'折扣优惠',
                    'ORDER_DISCOUNT':'整单优惠'
                }
            }
        },
        props:['order','printed','list'],
        filters:{
            price:filters.price
        },
        computed: {
            isReturn (){
                return this.order['STORE_ORDER.RETURN_MONEY']?true:false
            }
        },
        methods:{
            print(){
                var self = this
                self.$emit('printed',true);
            },
            goprint(){
                var self = this
                storage.getItem('store_info',res =>{
                    let val = JSON.parse(res.data)
                    let tel = val['STORE.CONTACT_PHONE']
                    let name = val['STORE.STORE_NAME']
                        let obj = {
                            'TYPE':'ORDER',
                            'IS_OVER': 'true',
                            'STORE_ORDER.MEMB_CARD_MONEY': self.order['STORE_ORDER.MEMB_CARD_MONEY'],
                            'STORE_ORDER.OTHER_PAY_WAY_TYPE': self.order['STORE_ORDER.OTHER_PAY_WAY_TYPE'],
                            'STORE_ORDER.OTHER_PAY_WAY_MONEY':self.order['STORE_ORDER.OTHER_PAY_WAY_MONEY'],
                            'STORE_ORDER.MEMB_CARD_NUM': self.order['STORE_ORDER.MEMB_CARD_NUM'],
                            'STORE_ORDER.MEMB_PHONE': self.order['STORE_ORDER.MEMB_PHONE'],
                            'STORE_ORDER.UID':self.order['STORE_ORDER.UID'],
                            'STORE_ORDER.USER_NAME': self.order['STORE_ORDER.USER_NAME'], 
                            'STORE_ORDER.DISCOUNT_MONEY': self.order['STORE_ORDER.DISCOUNT_MONEY'],
                            'STORE_ORDER.REMARK': self.order['STORE_ORDER.REMARK'],
                            // 'STORE_ORDER.MEMB_CARD_INTEGRAL': self.member['MEMB_CARD.USABLE_POINT'],
                            // 'STORE_ORDER.MEMB_CARD_BALANCE': self.member['MEMB_CARD.USABLE_MONEY'],
                            'SERVICE_ID':self.order['STORE_ORDER.SERVICE_ID'],
                            'ADD_TIME': self.order['STORE_ORDER.ADD_DATETIME'],
                            'GATHER_MONEY':self.order['STORE_ORDER.OTHER_PAY_WAY_MONEY'],
                            'ODD_CHANGE':'0',
                            'STORE_NAME':name,
                            'STORE_TEL':tel,
                            'SORT_CODE':self.order['STORE_ORDER.SORT_CODE'],
                            'STORE_ORDER.DISCOUNT_INFO_LIST':self.order['STORE_ORDER.DISCOUNT_INFO'],
                            'STORE_ORDER.STORE_ORDER_DETAILS': self.order['STORE_ORDER.STORE_ORDER_DETAILS'],
                            'SHOULD_PRINT_WIFI':-1
                        }
                        if(typeof(getEvent.frontPrint) == "function"){
                            // getEvent.frontPrint(obj,function(res){})
                            if(self.list.indexOf('front') != -1){
                                 getEvent.frontPrint(obj,function(res){})
                            }
                        }
                        if(typeof(getEvent.backPrint) == "function"){
                            if(self.list.indexOf('other') != -1){
                                 getEvent.backPrint(obj,function(res){})
                            }
                           
                        } 
                    
                })
                
            },
        }
    }
</script>