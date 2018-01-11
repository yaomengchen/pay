<template>
    <div class="item" v-if="show" @click="stopClick">
        <div class="preferential-modal" @click="stopClick">
            <div class="title">
                <div class="toggle-bar">
                    <div class="toggle-bar-item">
                        <text class="toggle-bar-item-name" lines="3">验收开发中的功能请输入调试码，测试已经完成的功能不用输入任何内容直接点击确定</text>
                    </div>
                </div>
                
            </div> 
            <div class="close-btn">
                <image class="close-btn-img" :src="imageObj.closeBtn"></image>
            </div>                
            <div class="swipe-container">
                <div class="type-in-area type-in-area-2">
                    <textarea class="textarea" placeholder="输入调试码" autofocus="true" v-model="remark"></textarea>
                </div>
                <div style="flex-direction:row;justify-content:space-between;width:300;height:60;">
                    <div class="confirm" @click="submit">
                        <text class="confirm-text">确认</text>
                    </div>  
                    <div class="confirm" @click="cancel">
                        <text class="confirm-text">取消</text>
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
        justify-content: center;
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
        justify-content: center;
    }
    .toggle-bar {
        flex-direction: row;
    }
    .toggle-bar-item {
        width:750*$rate;
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
        lines: 3;
        font-size:round(36*$rate);
        color: #333333;
    }
    .close-btn {
    	position:absolute;
    	top:0;
    	right:0;
        width: 77*$rate;
        height: 77*$rate;
        justify-content: center;
        align-items: center;
    }
    .close-btn-img {
        width: 30*$rate;
        height: 30*$rate;
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
    .confirm {
        width: 320*$rate;
        height: 90*$rate;
        margin-bottom: 30*$rate;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        border-radius: 99px;
        justify-content: center;
        align-items: center;
    }
    .confirm-text {
        font-size:round( 30*$rate);
        color: white;
    }
    .radio{
        width: 790*$rate;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
    }
    .radio-item{
        height: 30;
        margin-top: 30*$rate;
        border-color: #d0d0d0;
        border-width: 1*$rate;
        border-radius: 3;
        margin-right: 30*$rate;
        padding-left: 30*$rate;
        padding-right: 30*$rate;
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
    .textarea{
        height: 60;
        width: 790*$rate;
        background-color: #f3f3f3;
        padding: 10;
        font-size:round( 33*$rate);
    }
    .text-btn{
        position: absolute;
        right: 30*$rate;
        bottom: 30*$rate; 
        font-size:round(30*$rate);
        color:#ef484c;
    }
</style>
<script>
    import icons from '../assets/icon.js'
    import filters from '../common/filters.js'
    import modal from '../common/modal.js'
    const storage = weex.requireModule('storage')
    export default {
        data () {
            return {
                imageObj:{
                    closeBtn:icons.modalIcons.closeBtnIcon
                },
                remark:'',
                remarkList:[],
            }
        },
        filters:{
            price:filters.price
        },
        methods: {
            submit(){
            	if(this.remark == undefined || this.remark == ''){
                    this.$emit('submit',true,this.remark)
            	}else{
                    this.$emit('submit',true,this.remark)
                    console.log(this.remark)
            	}
            },
            cancel(){
                this.$emit('close',false)
            },
            getRemark(){
                var self = this
                storage.getItem('order_remark_history',res =>{
                    
                    if(res.result == 'success'){
                        self.remarkList = JSON.parse(res.data)
                    }else{
                        self.remarkList = []
                    }
                })
            },
            setValue(val){
                if(this.remark){
                    this.remark += '，' + val
                }else{
                    this.remark = val
                }
                
            },
            stopClick(){},
            addRemark(){
                if(this.remark){
                    this.remarkList.unshift({value:this.remark})
                    if(this.remarkList.length > 15){
                        this.remarkList.pop()
                    }
                    storage.setItem('order_remark_history',JSON.stringify(this.remarkList),res =>{
                        modal.toast({message:'添加成功',duration:1})
                    })
                }              
            }
        },
        props:['show'],
        created () {
            
        },  
        watch:{
            display(){
                if(this.display){
                    this.remark = this.res
                    this.getRemark()
                }
            }
        },     
        computed: {

        },
    }
</script>