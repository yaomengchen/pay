<template>
    <div class="item" v-if="display" @click="close">
        <div class="preferential-modal" @click="stopClick">
            <div class="title">
                <div class="toggle-bar">
                    <div class="toggle-bar-item">
                        <text class="toggle-bar-item-name">{{title}}</text>
                    </div>
                </div>
                <div class="close-btn" @click="close">
                    <image class="close-btn-img" :src="imageObj.closeBtn"></image>
                </div>
            </div>
            <div class="toggle-bar-item-ref-area">
                <div class="swipe-container">
                    <div class="type-in-area type-in-area-1">
                        <input type="number" class="type-in-item" :placeholder="data" autofocus="true" v-model="inputText" return-key-type="defalut" @return = "submit"/>
                    </div>
                </div>
            </div>
            <div class="computed-group">
                <div></div>
                <div class="prefrential-info">                    
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
        width: 30*$rate;
        height: 30*$rate;
    }
    .toggle-bar-item-ref-area {
        height: 216*$rate;
    }
    .swipe-container {
        height: 216*$rate;
        width: 854*$rate;
        align-items: center;
    }
    .type-in-area {
        height: 216*$rate;
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
        font-size:round(42*$rate);
        color:#ef484c;
    }
    .confirm {
        width: 155*$rate;
        height: 80*$rate;
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
</style>
<script>
    import icons from '../../assets/icon.js'
    const modal = weex.requireModule("modal");
    const animation = weex.requireModule('animation')
    export default {
        data () {
            return {
                imageObj:{
                    closeBtn:icons.modalIcons.closeBtnIcon
                },
                nowIndex:0,
                inputText: '',
            }
        },
        methods: {
            submit(){
                var self = this
                self.$emit('event',{data:parseFloat(self.inputText)})
                this.inputText = ''
            },
            close(){
                var self = this
                self.$emit('event',false)
            },
            stopClick(){}
        },
        props:['display','data','type'],
        created () {
            
        },       
        computed: {
            title(){
                var title
                if(this.type == 'COUNT'){
                    title = '修改数量'
                }else{
                    title = '修改价格'
                }
                return title
            }
        },
    }
</script>