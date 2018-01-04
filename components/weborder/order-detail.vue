<template>
    <div class="order-detail" v-if="order['STORE_ORDER.ORDER_CODE']">
        <div class="order-detail-body">
            <div class="detail-title">
                <text class="detail-title-text">单据号 : {{order['STORE_ORDER.ORDER_CODE']}}</text>                
            </div>
            <div class="order-detail-info-group">
                <div class="order-detail-table">
                    <scroller class="table-body">
                        
                        <div class="table-head empty-bottom-border-style" :class="[isReturn?'':'no-reject-sign']">
                            <text class="table-head-text">{{order['STORE_ORDER.ADD_DATETIME']}}</text>
                            <text class="table-head-text">{{order['STORE_ORDER.OPERATOR_NAME'] || '匿名'}}</text>
                            <image class="order-reject-sign" :src="returnIcon" v-if="isReturn"></image>
                        </div>
                        <div class="table-sub-head">
                            <div class="table-sub-detail" v-if="order['STORE_ORDER.STATE'] == 'WAIT_CANCEL' || order['STORE_ORDER.STATE'] == 'CANCEL'">
                                <image :src="returnIcon" class="isReturn"></image> 
                                <text class="table-sub-text-or "  lines="3" >退单原因:{{order['STORE_ORDER.CANCEL_REMARK']}}</text>
                            </div>
                            <div class="table-sub-detail">
                                <image :src="returnIcon" class="isReturn"></image> 
                                <text class="table-sub-text"  lines="3">{{order['STORE_ORDER.USER_NAME'] || '匿名'}}  {{order['STORE_ORDER.MEMB_PHONE']}}</text>
                            </div>
                            <div class="table-sub-detail">
                                <image :src="returnIcon" class="isReturn"></image> 
                                <text class="table-sub-text"  lines="3">{{order['STORE_ORDER.ORDER_SOURCE_ADDR']}}</text>
                            </div>
                            <div class="table-sub-detail">
                                <image :src="returnIcon" class="isReturn"></image> 
                                <text class="table-sub-text"  lines="3">平台单号:{{order['STORE_ORDER.ORDER_CODE']}}  (取单号:#{{order['STORE_ORDER.GET_NUM']}})</text>
                            </div>
                            <div class="table-sub-detail">
                                <image :src="returnIcon" class="isReturn"></image> 
                                <text class="table-sub-text"  lines="3">备注:{{order['STORE_ORDER.REMARK']}}</text>
                            </div>
                        </div>
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
                                    <text class="single-price-text">{{item['STORE_ORDER_DETAIL.PRD_PRICE'] | price}}</text>
                                    <!-- <text class="single-price-oldtext" v-if="item['STORE_ORDER_DETAIL.PRD_PRICE'] - item['STORE_ORDER_DETAIL.PRD_FINAL_PRICE'] != 0">{{item['STORE_ORDER_DETAIL.PRD_PRICE'] | price}}</text> -->
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
                    <div class="computed-item-name">
                        <text class="coumputed-item-name-text">在线立减优惠:</text>
                    </div>
                    <div class="computed-item-name">
                        <text class="coumputed-item-name-text">配送费:</text>
                    </div>
                    <div class="computed-item-name-or">
                        <text class="coumputed-item-name-text-or" v-if="order['STORE_ORDER_DETAIL.PAY_TYPE'] == 'ONLINE'">货到付款 </text>
                        <text class="coumputed-item-name-text-or" v-if="order['STORE_ORDER_DETAIL.PAY_TYPE'] == 'OFFLINE'">在线支付 </text>
                        <text class="computed-item-value-h1">订单金额 :</text>
                    </div>
                </div>
                <div class="coumputed-item-value-group">
                    <div class="computed-item-value">
                        <text class="computed-item-value-text">{{order['STORE_ORDER.SUM_PRD_MONEY']}}</text>
                    </div>
                    <div class="computed-item-value">
                        <text class="computed-item-value-text  computed-item-value-red-text">-{{order['STORE_ORDER.DISCOUNT_MONEY']}}</text>
                    </div>
                    <div class="computed-item-value">
                        <text class="computed-item-value-text">{{order['STORE_ORDER.DISTRIBUTION_MONEY']}}</text>
                    </div>
                    <div class="computed-item-value">
                        <text class="computed-item-value-h1">{{order['STORE_ORDER.SUM_MONEY']}}</text>
                    </div>
                </div>
            </div>
        </div>
        <div class="confirm-group" v-if="order['STORE_ORDER.STATE'] != 'WAIT_CANCEL'">
            <!-- 
            <div class="confirm-group-item reject-all-btn">
                <text class="confirm-group-item-text">退货退款</text>
            </div> --> 
            <div class="confirm-group-item reject-all-btn" @click="cancel">
                <text class="confirm-group-item-text">{{cancelbtn}}</text>
            </div>
            <div class="confirm-group-item print-btn" @click="print">
                <text class="confirm-group-item-text print-btn-text">打印</text>
            </div>
        </div>
        <div class="confirm-group" v-if="order['STORE_ORDER.STATE'] == 'WAIT_CANCEL'">
            
            <div class="confirm-group-item reject-all-btn" @click="agreeRefund">
                <text class="confirm-group-item-text">同意取消</text>
            </div> 
            <div class="confirm-group-item reject-all-btn" @click="rejectRefund">
                <text class="confirm-group-item-text">拒绝</text>
            </div>
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
        border-width: 0.49/$rem*$rate;
        border-color: #d4d4d4;
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
    .table-sub-head {
        background-color: #f6f6f6;
        padding-left: 15/$rem*$rate;
        flex-direction: column;
        justify-content: space-around;
        padding-right: 19.53/$rem*$rate;
        padding-bottom: 10/$rem*$rate;
    }
    .table-sub-detail{
        padding-right: 19.53/$rem*$rate;
        padding-top: 20/$rem*$rate;
        width:  883*$rate;
        background-color: #f6f6f6;
        flex-direction: row;
        align-items: flex-start;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
    }
    .no-reject-sign {
        padding-left: 11.72/$rem*$rate;
    }
    .table-head-text {
        font-size:round( 14/$rem*$rate);
        color: #333333;
    }
    .table-sub-text {
        width:  883*$rate;
        lines: 3;
        text-overflow:ellipsis;
        font-size:round( 14/$rem*$rate);
        color: #666;
    }
    .table-sub-text-or {
        width:  883*$rate;
        lines: 3;
        text-overflow:ellipsis;
        font-size:round( 14/$rem*$rate);
        color: #ef484c;
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
     .computed-item-name-or {
        height: 21.97/$rem*$rate;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .computed-item-name-has-extra {
        justify-content: space-between;
    }
    .coumputed-item-name-text {
        font-size:round( 16/$rem*$rate);
        color: #333333;
    }
    .coumputed-item-name-text-or {
        font-size:round( 16/$rem*$rate);
        color: #666;
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
        font-weight:border;
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
                },
                // cancelbtn:'取消订单',
            }
        },
        props:['order','printed','list','cancelbtn'],
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
            cancel(){
                // switch(this.cancelbtn)
                // {
                // case '取消订单':
                //     this.cancelbtn = '取消中...'
                //   break;
                // case '取消中...':
                //     this.cancelbtn = '已取消'
                //   break;
                // case '已取消':
                //     this.cancelbtn = '已取消'
                //   break;
                // default:
                //     this.cancelbtn = '取消订单'
                // }
                this.$emit('type',true,this.order['STORE_ORDER.ORDER_SOURCE'],this.order['STORE_ORDER.ORDER_ID'])
            },
            goprint(){
                var self = this
                // storage.getItem('store_info',res =>{
                    let source ='';
                    if(self.order['STORE_ORDER.ORDER_SOURCE'] == 'ELEME'){
                        source = encodeURI('饿了么')
                    }else if(self.order['STORE_ORDER.ORDER_SOURCE'] == 'MEITUAN'){
                        source = encodeURI('美团')
                    }
                    let obj = {
                        'STORE_ORDER.ORDER_SOURCE'       : self.order['STORE_ORDER.ORDER_SOURCE'],
                        'STORE_ORDER.GET_NUM'            : self.order['STORE_ORDER.GET_NUM'],
                        'STORE_ORDER.STORE_NAME'         : self.order['STORE_ORDER.STORE_NAME'],
                        'STORE_ORDER.STORE_PHONE'        : self.order['STORE_ORDER.MEMB_CARD_NUM'],
                        // 送达时间
                        'STORE_ORDER.DELIVERY_DATETIME'  : self.order['STORE_ORDER.DELIVERY_DATETIME'],
                        'STORE_ORDER.ADD_DATETIME'       : self.order['STORE_ORDER.ADD_DATETIME'],
                        'STORE_ORDER.ORDER_CODE'         : self.order['STORE_ORDER.ORDER_CODE'],
                        'STORE_ORDER.REMARK'             : self.order['STORE_ORDER.REMARK'],
                        'STORE_ORDER.STORE_ORDER_DETAILS': self.order['STORE_ORDER.STORE_ORDER_DETAILS'],
                        'STORE_ORDER.SUM_MONEY'          : self.order['STORE_ORDER.SUM_MONEY'],
                        'STORE_ORDER.DISCOUNT_MONEY'     : self.order['STORE_ORDER.DISCOUNT_MONEY'],
                        'STORE_ORDER.DISTRIBUTION_MONEY' : self.order['STORE_ORDER.DISTRIBUTION_MONEY'],
                        // 餐盒费
                        'STORE_ORDER.PAID_MONEY'         : self.order['STORE_ORDER.PAID_MONEY'],
                        'STORE_ORDER.PAID_MONEY'         : self.order['STORE_ORDER.PAID_MONEY'],
                        'STORE_ORDER.UID'                : self.order['STORE_ORDER.UID'],
                        'STORE_ORDER.ORDER_SOURCE_ADDR'  : self.order['STORE_ORDER.ORDER_SOURCE_ADDR'],
                        'STORE_ORDER.USER_NAME'          : self.order['STORE_ORDER.USER_NAME'], 
                        'STORE_ORDER.MEMB_PHONE'         : self.order['STORE_ORDER.MEMB_PHONE'], 
                    }
                    modal.alert({message:typeof(getEvent.printFrontTakeOutInfo)})
                    
                    if(typeof(getEvent.printFrontTakeOutInfo) == "function"){
                        getEvent.printFrontTakeOutInfo(obj,function(res){})
                        // if(self.list.indexOf('front') != -1){
                        //      getEvent.printFrontTakeOutInfo(obj,function(res){})
                        // }
                    }
                    if(typeof(getEvent.backPrint) == "function"){
                        if(self.list.indexOf('other') != -1){
                             getEvent.backPrint(obj,function(res){})
                        }
                       
                    }
                // })
                
            },
            agreeRefund(){
                this.$emit("agreeTip",true,this['STORE_ORDER.ORDER_ID'])
            },
            rejectRefund(){
                this.$emit("rejectTip",true,this['STORE_ORDER.ORDER_ID'])
            },
        }
    }
</script>