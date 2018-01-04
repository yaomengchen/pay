<template>
    <div class="item" v-if="display">
        <div class="pay-con">
            <text class="font-13 fs-99">{{title}}</text>
            <div class="row">
                <image :src="type?wxIcon:aliIcon" :class="[type?'wxIcon':'aliIcon']"></image>
                <text class="font-24 fs-red">{{money | price}}</text>               
            </div>           
            <input class="font-12 fs-33 input" type="number" placeholder="支付码" v-model="code" return-key-type="defalut" @return="submit"/>
            <div class="pay-foot">
                <div class="btn bor-r" @click="cancel">
                    <text class="font-12 fs-33">取消</text>
                </div>
                <div class="btn" @click="submit">
                    <text class="font-12 fs-red">确认</text>
                </div>
            </div>
            
        </div>
    </div>
</template>
<style scoped lang="sass">
    .item{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.4);
        justify-content: center;
        align-items: center;
    }
    .img{
        width: 90;
        height: 90;
    }
    .pay-con{
        background-color: #fff;
        border-radius: 3px;
        padding-top: 25px;
        width: 300px;
        align-items: center;
    }
    .row{
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .input{
        margin-bottom: 25px;
        width: 250px;
        height: 30px;
        border-width: 0.3px;
        border-color: #D8D8D8;
        padding-left: 10px;
        padding-right: 10px;
    }
    .font-13{
        font-size: 13px;
    }
    .fs-99{
        color: #999;
    }
    .font-12{
        font-size: 12px;
    }
    .font-24{
        margin: 15px;
        font-size: 24px;
    }
    .fs-33{
        color: #333;
    }
    .pay-foot{
        width: 300px;
        border-top-width: 0.3px;
        border-top-color: #D8D8D8;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .fs-red{
        color: #ef484c;
    }
    .btn{
        width: 150px;
        height: 40px;
        justify-content: center;
        align-items: center;
    }
    .bor-r{
        border-right-width: 0.3px;
        border-right-color: #D8D8D8;
    }
    .wxIcon{
        width: 30px;
        height: 30px;
    }
    .aliIcon{
        width: 37px;
        height: 30px;
    }
</style>
<script>
    import filters from '../../common/filters.js'
    import modal from '../../common/modal.js'
    
    export default {
        data () {
            return {
                aliIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/icon/ali-icon.png',
                wxIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/icon/wx-icon.png',
                titleList:{
                    'ALI_PAY':'请扫描客户支付宝支付码支付',
                    'WX_PAY':'请扫描客户微信支付码支付'
                },
                code:''
            }
        },
        filters:{
            price:filters.price
        },
        methods:{
            submit(code){
                if(this.display){
                    if(code && typeof code == 'string'){
                        this.$emit('event',code)
                    }
                    if(this.code){
                        this.$emit('event',this.code)
                    }else{
                        modal.toast({message:'请输入支付码',duration:1.5})
                    } 
                    this.code = ''  
                }                            
            },
            cancel(){
                this.code = ''
                this.$emit('event',false)
            }
        },
        watch:{

        },
        computed:{
            title(){
               return this.titleList[this.data.type]
            },
            type(){
                return this.data.type == 'WX_PAY'
            }
        },
        props:['display','data','money']
    }
</script>