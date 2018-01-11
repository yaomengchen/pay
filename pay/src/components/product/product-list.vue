<template>  
    <div class="product-picker">
        <scroller class="product-list-show" loadmoreoffset="10" @loadmore="loading">
            <div v-if="!productList.length" class="product-list">
                <text class="tip-text">没有商品</text>
            </div>
            <div class="product-list">
                <div v-for="item in productList" class="product-list-item" @click="choseProductKind(item)">
                    <div class="product-img-info product-item">
                        <image :src="'http://jiaorder-file.oss-cn-shanghai.aliyuncs.com/'+item['PRODUCT_SPU.PRD_IMG']['COVER']+'?x-oss-process=image/resize,m_mfit,h_200,w_200'" class="product-img" resize="cover"></image>
                        <!-- <div class="discount-info" v-if="product.discount">
                            <text class="discount-info-text">{{product.discount}}</text>
                        </div> -->
                    </div>
                    <text class="product-name product-item">{{item["PRODUCT_SPU.PRD_NAME"]}}</text>
                    <text class="product-price product-item">{{item["PRODUCT_SPU.ORDER_PRICE"] | price}}</text>
                </div>
            </div>
        </scroller>
        <div class="pick-kind-modal" v-if="display" @click="preventClose">
            <div class="modal-item"  @click="stopClick">
                <div class="title">
                    <div class="title-name">
                        <text class="title-name-text">{{product['PRODUCT_SPU.PRD_NAME']}}</text>
                    </div>
                    <!-- <div class="close-btn" @click="closeModal">
                        <image class="close-btn-image" :src="closeBtnIcon"></image>
                    </div> -->
                </div>
                <div class="pick-kind-class-group">
                    <div class="kind-group" v-for="sku in skuList">
                        <text class="kind-class-name">{{sku.name}}</text>
                        <div class="kinds">
                            <div class="kind" v-for="value in sku.value" :class="[value.isFocus?'kind-active':'']" @click="skuSelect(value,sku.value)">
                                <text class="kind-text" :class="[value.isFocus?'kind-text-active':'']">{{value.name}}</text>        
                            </div>
                        </div>
                    </div>
                </div>
                <div class="computed-group">
                    <text class="total-price">{{product['PRODUCT_SPU.ORDER_PRICE'] | price}}</text>
                    <div class="confirm" :class="[skuTrue?'':'confirm-stop']" @click="addCart">
                        <text class="confirm-text">确认</text>
                    </div>
                </div>
            </div>          
        </div>
    </div>    
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .product-picker {
        width: 1084*$rate;
        position: absolute;
        bottom: 0;
        top: 0;
        right: 0;
        border-radius: 10*$rate;
        flex-direction: row;
        align-items: stretch;
        background-color: white;   
        padding: 50*$rate; 
        background-color: #fff;  
    }
    .refresh {
        background-color: white;
        width: 511.72rem;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .tip-text{
        color:#333333;
        font-size: round(35*$rate);
    }
    .product-list-show {
        flex: 1;
    }
    .indicator {
        color: #888888;
        font-size: 20;
        text-align: center;
    }
    .oprate-status-text {
        text-align: center;
    }
    .product-list {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items:flex-start;
    }
    .product-list-item {
        width: 217*$rate;
        flex-direction: column;
        justify-content: center;
        margin-left: 13*$rate;
        margin-right: 13*$rate;
        margin-bottom: 30*$rate;
    }
    .product-item {
        margin-top: 10*$rate;               
        text-align: center;
    }
    .product-img-info {
        width: 217*$rate;
        height: 217*$rate;
        border-radius: 10*$rate;
        overflow: hidden;
    }
    .product-img {
        width: 217*$rate;
        height: 217*$rate;
    }
    .discount-info {
        position:absolute;
        left: 0;
        bottom:-2.8rem;
        height: 19.53rem;
        width: 106.44rem;
        justify-content: center;
        align-content: center;
        
    }
    .discount-info-text {
        font-size: 12rem;
        color:white;
        text-align: center;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
    }
    .product-name {
        color:#333333;
        font-size: round(28*$rate);
        lines:2;
        text-overflow:ellipsis;
    }
    .product-price {
        color:#ef484c;
        font-size: round(28*$rate);
        margin-bottom: 0rem;
    }
    .pick-kind-modal {
        position: fixed;
        background-color: rgba(0,0,0,0.3);
        top: 0;
        left: 0;
        width: 750;
        bottom: 0;
        justify-content: center;
        align-items: center;
    }
    .modal-item{
        background-color: #fff;
        border-radius: 5*$rate;
    }
    .title {
        width: 1000*$rate;
        padding: 30*$rate;
        flex-direction: row;
        border-bottom-width: 1*$rate;
        border-bottom-color: #d0d0d0;
        justify-content: space-between;
        align-items: center;
        flex: 1;
    }
    .title-name {
        flex:1;
        height: 39*$rate;
        justify-content: center;
    }
    .title-name-text {
        font-size: round(32*$rate);
        color: #333333;
        lines:1;
        text-overflow: ellipsis;
    }
    .close-btn {
        width: 21*$rate;
        height: 17*$rate;
        justify-content: center;
        align-items: center;
    }
    .close-btn-image {
        width: 20$rate;
        height: 20$rate;
    }
    .pick-kind-class-group {
        padding: 30*$rate;
    }
    .kind-group {
        
    }
    .kind-class-name {
        font-size: round(26*$rate);
        color:#333333;
    }
    .kinds {
        flex-direction: row;
        flex-wrap: wrap;
        width: 1000*$rate;
    }
    .kind {
        margin: 25*$rate;
        height: 70*$rate;
        padding-left: 40*$rate;
        padding-right: 40*$rate;
        border-width: 1*$rate;
        border-color:#ef494d;
        border-radius: 99;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(to bottom right,#fff,#fff);
    }
    .kind-active {
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
    }
    .kind-text {
        font-size: round(26*$rate);
        color:#ef484c;
    }
    .kind-text-active {
        color:white;
    }
    .computed-group {
        height: 140*$rate;
        padding-left: 80*$rate;
        padding-right: 50*$rate;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        border-top-color: #d0d0d0;
        border-top-width: 1*$rate;
    }
    .total-price {
        font-size: round(38*$rate);
        color:#ef484c;
    }
    .confirm {
        width: 150*$rate;
        height: 80*$rate;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        border-radius: 99;
        justify-content: center;
        align-items: center;
    }
    .confirm-stop{
        background-image: linear-gradient(to bottom right,#999,#f3f3f3);
    }
    .confirm-text {
        font-size: round(26*$rate);
        color: white;
    }
</style>
<script>
    import icons from "../../assets/icon.js";
    import filters from '../../common/filters.js'
    const modal = weex.requireModule('modal')
    export default {
        data () {
            return {
                display: false,
                product:{},
                productsku:{},
                skuList:[],
                skuTrue:true
            }
        },
        filters:{
            price:filters.price
        },
        props:['productList'],
        created() {

        }, 
        computed: {
            
        },
        methods: {
            choseProductKind (product) {
                var self = this
                self.product = product
                if(product['SKU_LIST'].length > 1 || product['PRODUCT_SPU.IS_MULTI_SKU'] == '1'){
                    self.productDisplay()
                }else{  
                    self.product['SKU_LIST'][0]['PRODUCT_SKU.SKU_NAME'] = self.product['PRODUCT_SPU.PRD_NAME']
                    self.productsku = self.product['SKU_LIST'][0]
                    self.$emit('addcart',self.productsku)        
                }
            },
            addCart (){
                var self = this
                if(this.skuTrue){
                    self.display = false
                    self.$emit('addcart',self.productsku)
                }
            },
            // 多规格情况下 展示商品的SKU
            productDisplay: function(){

                var self = this         
                var skuName = self.product['SKU_NORMS']['NORMS_NAME']               
                var sku = self.product['SKU_NORMS']['NORMS']            
                self.skuList = []
                self.skuTrue = true
                for(let i in skuName){
                    let key = i.replace('Name','')
                    let arr = []
                    if(sku[key]){
                        sku[key].forEach(function(ele){
                            let isFocus = false
                            if(self.product['SKU_LIST'][0]['PRODUCT_SKU.SKU_CONTENT'][key] == ele){
                                isFocus = true
                            }
                            arr.push({name:ele,isFocus:isFocus,key:key})
                        })
                        self.skuList.push({name:skuName[i][0],value:arr})
                    }
                }
                self.product['SKU_LIST'][0]['PRODUCT_SKU.SKU_NAME'] = self.product['PRODUCT_SPU.PRD_NAME']
                self.productsku = self.product['SKU_LIST'][0]
                self.display = true   
            },
            /*

            选择商品SKU  获取到商品的skuID

            */
            skuSelect: function(value,item){
                var self = this
                var obj = {}
                if(!value.isFocus){
                    item.map(function(ele){return ele.isFocus = false})
                    value.isFocus = true
                    self.skuList.forEach(function(ele){
                        ele.value.forEach(function(child){
                            if(child.isFocus){
                                obj[child.key] = child.name
                                
                            }
                        })
                    })
                    var sum = 0
                    self.product['SKU_LIST'].forEach(function(ele){
                        let bal = true

                        for(let i in obj){
                            if(ele['PRODUCT_SKU.SKU_CONTENT'][i] != obj[i]){
                                bal = false
                            }
                        }
                        if(bal){
                            ele['PRODUCT_SKU.SKU_NAME'] = self.product['PRODUCT_SPU.PRD_NAME']
                            self.productsku = ele
                            self.skuTrue = true
                        }else{
                            sum++
                        }

                    })
                    if(sum == self.product['SKU_LIST'].length){
                        self.skuTrue = false
                    }
                }
            },
            preventClose() {
                this.display = !this.display
            },
            stopClick(){
                
            },
            loading(){
                if(this.productList.length >= 20){
                    this.$emit('loadmore','')
                }                
            }
        },
        computed: {

        }
          
    }
</script>