<template>
    <div class="order-list" v-if="orderList.length > 0">
        <div class="search-bar-container">
            <div class="search-bar">
                <image class="search-icon" src="1"></image>
                <input type="tel" class="search-bar-type-in" placeholder="请输入姓名或卡号" v-model="searchKey" @input='searchOrderList'/>
            </div>
        </div>       
        <scroller class="list-area-container" loadmoreoffset="10" @loadmore="loadmore">
            <div class="list-area">           
                <div class="item-bar"></div>
                <div class="list">
                    <div class="list-item" v-for="(order,orderIndex) in orderList" :class="[(orderIndex==orderList.length-1)?'list-item-last':'']" @click="toggleActiveItem(orderIndex)">
                        <div class="dot-sign-container">
                            <div class="dot-sign"></div>
                        </div>
                        <div class="list-item-true-area" :class="[focusOrder===orderIndex?'list-item-true-area-active':'']">
                            <div class="order-info">
                                <text class="user-info">{{order['STORE_ORDER.USER_NAME'] || '匿名'}}</text>
                                <text class="order-time">{{order['STORE_ORDER.ADD_DATETIME']}}</text>
                            </div>
                            <div class="item-price">
                                <text class="item-price-text">{{order["STORE_ORDER.PAID_MONEY"] | price}}</text>
                            </div>
                            <div class="return-sign" v-if="order['STORE_ORDER.RETURN_MONEY']">
                                <image class="return-sign-img" :src="returnIcon"></image>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </scroller>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .order-list {
        background-color: white;
        flex-direction: column;
        padding-left: 28*$rate;
        padding-right: 28*$rate;
        padding-top: 39*$rate;
        padding-bottom: 39*$rate;
    }
    .search-bar-container {
        flex-direction: row;
        justify-content: flex-end;
    }
    .search-bar {
        width: 652*$rate;
        height: 72*$rate;
        border-radius: 999px;
        background-color: #f6f6f6;
        flex-direction: row;
        align-items: center;
        padding-left: 23*$rate;
    }
    .search-icon {
        width: 30*$rate;
        height: 30*$rate;
    }
    .search-bar-type-in {
        flex: 1;
        height: 72*$rate;
        padding-left:19*$rate;
        font-size:32*$rate;
        placeholder-color:#999999;
        color:#333333;
        background-color: rgba(0,0,0,0);
    }
    .list-area-container {
        flex: 1;
        margin-top: 36*$rate;
    }
    .list-area {
        flex-direction: row;
        justify-content: flex-end;
        align-items: stretch;
    }
    .item-bar {
        width: 1*$rate;
        position: absolute;
        top:0;
        bottom: 0;
        left:12*$rate;
        background-color: #d4d4d4;
    }
    .list {
        flex: 1;
        flex-direction: column;
    }
    .list-item {
        height: 155*$rate;
        margin-bottom: 31*$rate;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .dot-sign-container {
        width: 26*$rate;
        height: 43*$rate;
        background-color:white;
        align-items: center;
        justify-content: center;
    }
    .dot-sign {
        width: 11*$rate;
        height: 11*$rate;
        background-color: #ff5b5f*$rate;
        border-radius: 99px;
    }
    .list-item-true-area {
        width: 641*$rate;
        height: 155*$rate;
        border-radius: 5*$rate;
        border-width: 1*$rate;
        border-color: #d4d4d4;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: 38*$rate;
        padding-right: 38*$rate;
        background-color: white;
    }
    .list-item-true-area-active {
        background-color: #f6f6f6;
    }
    .list-item-last {
        margin-bottom: 0;
    }
    .order-info {
        height: 97*$rate;
        width: 379*$rate;
        justify-content: space-between;
    }
    .user-info {
        font-size: round(29*$rate);
        color: #333333;
    }
    .order-time {
        font-size: round(27*$rate);
        color: #999999;
    }
    .item-price {
        width: 201*$rate;
        height: 97*$rate;
        justify-content: center;
        align-items: flex-end;
    }
    .item-price-text {
        font-size: round(34*$rate);
        color:#ef484c;
    }
    .return-sign {
        width: 42*$rate;
        height: 48.6*$rate;
        position: absolute;
        right:20*$rate;
        top:0;
    }
    .return-sign-img {
        width: 42*$rate;
        height: 48.6*$rate;
    }
</style>
<script>
    import icon from '../../assets/icon.js'
    import filters from '../../common/filters.js'
    const modal = weex.requireModule('modal')

    export default {
        data () {
            return {
                returnIcon:icon.orderIcon.return,

                searchKey:''
            }
        },
        computed: {

          
        },
        filters:{
            price:filters.price
        },
        props:['orderList','focusOrder'],
        methods: {
            toggleActiveItem (index) {

                this.$emit('change',index)
            },
            searchOrderList () {
                searchDbc(this)
            },
            loadmore(){
                this.$emit('load','')
            }
        }
    }
</script>