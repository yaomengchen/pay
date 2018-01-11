<template>
    <div class="item" v-if="display" @click="close">
        <div class="preferential-modal" @click="stopClick">
            <div class="title">
                <div class="toggle-bar">
                    <div class="toggle-bar-item" :class="[nowIndex==0?'toggle-bar-item-active':'toggle-bar-item-denied']" @click="change(0)">
                        <text class="toggle-bar-item-name">折扣优惠</text>
                    </div>
                    <div class="toggle-bar-item" :class="[nowIndex==1?'toggle-bar-item-active':'']" @click="change(1)">
                        <text class="toggle-bar-item-name">其他优惠</text>
                    </div>
                </div>
                <div class="close-btn" @click="close">
                    <image class="close-btn-img" :src="imageObj.closeBtn"></image>
                </div>
            </div>
            <div class="toggle-bar-item-ref-area">
                 
                <div class="swipe-container">
                    <text class="tip"> 这里是【整单优惠】，可点击列表中的商品添加【单品优惠】</text>   
                    <div class="type-in-area type-in-area-1" v-if="nowIndex==0">
                        <input type="number" class="type-in-item" placeholder="请填写整单折扣，例如:8折,则输入8" autofocus="true" v-model="rateText"/>
                    </div>
                    <div class="type-in-area type-in-area-2" v-if="nowIndex==1">
                        <input type="number" class="type-in-item" placeholder="请填写优惠金额,例如优惠5元,则填写5" autofocus="true" v-model="cutText"/>
                    </div>
                    <div class="radio"  v-if="nowIndex==0">
                        <div class="radio-item" v-for="item in radioList" @click="setValue(item.value,'rateText')">
                            <text class="radio-text">{{item.value}}折</text>
                        </div>
                    </div>
                    <div class="radio2" v-if="nowIndex==1">
                        <div class="radio-item2" v-for="item in radioList" @click="setValue(item.value,'cutText')">
                            <text class="radio-text">{{item.type}} -{{item.value | price}}</text>
                        </div>
                    </div>
                </div>               
            </div>
            <div class="computed-group">
                <div class="row">
                    <text class="prefrential-info-text">原价:</text>
                    <text class="total-price">{{sumprice | price}}</text>
                </div>
                <div class="prefrential-info">
                    <div class="row">
                        <text class="prefrential-info-text">已优惠:</text>
                        <text class="total-price">{{discount | price}}</text>
                    </div>
                    
                    <div class="confirm" @click="submit">
                        <text class="confirm-text">确认</text>
                    </div>
                </div>         
            </div>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .row{
        flex-direction: row;
        align-items: center;
    }
    .item{
        background-color: rgba(0,0,0,0.3);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        align-items: center;
    }
    .preferential-modal {
        background-color: white;
        padding-left: 32*$rate;
        padding-right: 32*$rate;
        padding-top: 15.5*$rate;
        margin-top: 50*$rate;
        padding-bottom: 7*$rate;
    }
    .title {
        width: 854*$rate;
        flex-direction: row;
        border-bottom-width: 1*$rate;
        border-bottom-color: #d0d0d0;
        justify-content: space-between;
    }
    .toggle-bar {
        flex-direction: row;
    }
    .toggle-bar-item {
        padding-left: 14.5*$rate;
        padding-right: 14.5*$rate;
        justify-content: center;
        margin-right: 31*$rate;
        border-bottom-width: 5*$rate;
        border-top-width: 5*$rate;
        border-bottom-color:white;
        border-top-color: white;
    }
    .toggle-bar-item-active {
        border-bottom-color:#f04e52;
    }
    .toggle-bar-item-name {
        font-size:round( 33*$rate);
        color: #333333;
    }
    .close-btn {
        width: 77*$rate;
        height: 77*$rate;
        justify-content: center;
        align-items: center;
    }
    .close-btn-img {
        width: 40*$rate;
        height: 40*$rate;
    }
    .toggle-bar-item-ref-area {

    }
    .swipe-container {
        width: 854*$rate;
        align-items: center;
    }
    .type-in-area {
        margin-top: 40*$rate;
        margin-bottom: 40*$rate;
        width: 790*$rate;
        justify-content: center;
        align-items: center;
    }
    .type-in-item {
        width: 790*$rate;
        height: 83*$rate;
        padding-left: 36*$rate;
        padding-right: 36*$rate;
        border-width: 1*$rate;
        border-color: #b1b1b1;
        border-radius: 5*$rate;
        font-size:round( 33*$rate);
        placeholder-color:#b3b3b3;
        color:#333333;
    }
    .computed-group {
        height: 124*$rate;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        border-top-color: #d0d0d0;
        border-top-width: 1*$rate;
    }
    .total-price {
        font-size:round(32*$rate);
        color:#ef484c;
    }
    .confirm {
        width: 155*$rate;
        height: 80*$rate;
        margin-left: 20*$rate;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        border-radius: 99px;
        justify-content: center;
        align-items: center;
    }
    .confirm-text {
        font-size:round( 30*$rate);
        color: white;
    }
    .prefrential-info {
        align-items: center;
        flex-direction: row;
        justify-content: flex-end;
    }
    .prefrential-info-text {
        font-size:round( 32*$rate);
        color: #333333;
        text-align: right;
        margin-right: 30*$rate;
    }
    .radio{
        width: 790*$rate;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40*$rate;
    }
    .radio2{
        width: 790*$rate;
        flex-direction: row;
        align-items: center;
        margin-bottom: 40*$rate;
    }
    .radio-item{
        width: 50;
        height: 30;
        border-color: #d0d0d0;
        border-width: 1*$rate;
        border-radius: 3;
        justify-content: center;
        align-items: center;
    }
    .radio-item2{
        width: 70;
        height: 30;
        border-color: #d0d0d0;
        border-width: 1*$rate;
        border-radius: 3;
        margin-right: 10;
        justify-content: center;
        align-items: center;
    }
    .radio-text{
        font-size: 10;
        color: #333;
    }
    .tip{
        margin-top: 40*$rate;
        font-size: 9;
        color: #999;
    }
</style>
<script>
    import icons from '../../assets/icon.js'
    import filters from '../../common/filters.js'
    const modal = weex.requireModule("modal");
    const storage = weex.requireModule('storage')
    export default {
        data () {
            return {
                imageObj:{
                    closeBtn:icons.modalIcons.closeBtnIcon
                },
                nowIndex:-1,
                rateText: '',
                cutText: '',
                directReduce:'',
                radioList:[]
            }
        },
        filters:{
            price:filters.price
        },
        methods: {
            change (res){
                res == this.nowIndex ? '' : (this.nowIndex = res)
                
            },
            submit(){
                var self = this
                if(self.nowIndex == 0 && self.rate != 10){
                    let i = -1
                    self.radioList.forEach((ele,index) =>{
                        if(ele.value == self.rate){
                            i = index
                            return
                        }
                    })
                    if(i == -1){
                        self.radioList.pop()
                    }else{
                        self.radioList.splice(i,1)
                    }                    
                    self.radioList.unshift({value:self.rate})
                    storage.setItem('order_discount_history',JSON.stringify(self.radioList))
                }
                self.$emit('event',{
                    type: self.nowIndex == 0 ? 'DISCOUNT' : 'ORDER_DISCOUNT',
                    discount: self.discount,
                    rate: self.nowIndex == 0 ? self.rate : null
                })
            },
            close(){
                var self = this
                self.$emit('event',false)
            },
            getMoneyList(m){
                let arr = []
                if(Number(m)%10 !=0){
                    if(Number(m)%1 == 0){
                        arr = [{
                            type:'抹元',
                            value:Number(m)%10
                        }]
                    }else if(Number(m)%0.1 == 0){
                        arr = [{
                            type:'抹元',
                            value:Number(m)%10
                        },{
                            type:'抹角',
                            value:Number(m)%1
                        }]
                    }else{
                        arr = [{
                            type:'抹元',
                            value:Number(m)%10
                        },{
                            type:'抹角',
                            value:Number(m)%1
                        },{
                            type:'抹分',
                            value:Number(m)%0.1
                        }]
                    }
                }
                return arr 
            },
            stopClick(){},
            setValue(val,type){
                this[type] = val
            }
        },
        props:['display','sumprice'],
        created () {
            
        },  
        watch:{
            display(){
                this.rateText = ''
                this.cutText = ''
                if(this.display == false){
                    this.nowIndex = -1
                }else{
                    this.nowIndex = 0
                }
            },
            nowIndex(){
                if(this.nowIndex == 0){
                    storage.getItem('order_discount_history',res =>{
                        if(res.result == 'success'){
                            this.radioList = JSON.parse(res.data)
                        }else{
                            this.radioList = [{value:'9'},{value:'8'},{value:'7'},{value:'6'},{value:'5'}]
                        }
                    })                    
                }else{
                    this.radioList = this.getMoneyList(this.sumprice)
                }
            }
        },     
        computed: {
            discount(){
                var sum
                if(this.nowIndex == 0){
                    sum = this.sumprice * (10 - this.rate)/10
                }else {
                    sum = this.cutPrice
                }
                return sum
            },
            rate() {
                return this.rateText != "" && this.rateText/1 < 10 ? parseFloat(this.rateText) : 10
            },
            cutPrice() {
                return this.cutText != "" && this.cutText/1 > 0 ? parseFloat(this.cutText) : 0
            }
        },
    }
</script>