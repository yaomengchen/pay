<template>
<div class="container" v-if="display" @click="close">
    <div class="wrapper" @click="stopPro">
        <div class="head">
            <text class="text">交接并确认</text>
            <image class="close" :src="closeIcon" @click="close"></image>
        </div>
        <div class="body">
            <div class="wrap">
                <text class="text">交接现金总额</text>
                <div class="row">
                    <text class="text-ac">{{money | price}}</text>
                    <text class="text-small">备用金{{prepare | price}} + 现金收入{{cash | price}}</text>
                </div>                
            </div>
            <div class="wrap">
                <text class="text">预留下次备用金</text>
                <div class="input-div">
                    <text class="text">¥</text>
                    <input class="input" type="number" v-model="prepareMoney"/>
                </div>               
            </div>
            <div class="wrap">
                <textarea placeholder="备注" class="textarea" v-model="remark"></textarea>
            </div>
        </div>
        <div class="foot">
            <div class="hasBg" @click="save">
                <text class="whiteText">确认交班</text>
            </div>
        </div>
    </div>
</div>
</template>
<style scoped lang="sass">
    $rate:0.732;
    $set:0.3662;
    .textarea{
        width: 386*$rate;
        height: 70*$rate;
        background-color: #f3f3f3;
        font-size: round(15*$rate);
        border-radius: 3px*$rate;
        padding: 10*$rate;
    }
    .close{
        width: 9px;height: 9px;
    }
    .row{
        margin-left: 40*$rate;
    }
    .text-small{
        font-size: round(14*$rate);
        color: #999;  
    }
    .text-ac{
        font-size: round(22*$rate);
        color: #ef494d;        
    }
    .container{
        position: absolute;
        top: 0;
        left: 0;
        width: 750;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.4);
    }
    .wrapper {
        align-items: center;
        background-color: #fff;
        border-radius: 3px;
        padding-left: 40*$set;
        padding-right: 40*$set;
    }
    .head {
        height: 48*$rate;
        width: 386*$rate;
        border-bottom-style: solid;
        border-bottom-color: #aeaeae;
        border-bottom-width: .5*$rate;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .text {
        font-size: round(15*$rate);
    }
    .body {
        width: 386*$rate;
    }
    .wrap {
        margin-top:11px;
        margin-bottom: 15px*$rate;
        flex-direction: row;
        align-items: center;
    }
    .smallInput {
        width: 87*$rate;
        height: 40*$rate;
        font-size: round(15*$rate);
        margin-left: 22px*$rate;
        padding-left: 10px*$rate;
        border-style: solid;
        border-width: .5*$rate;
        border-color: #aeaeae;
        border-radius: 3px*$rate;
    }
    .smallBtn {
        height: 40*$rate;
        width: 40*$rate;
        margin-left: 8*$rate;
        align-items: center;
        justify-content: center;
        border-style: solid;
        border-width: .5*$rate;
        border-color: #aeaeae;
        border-radius: 3px*$rate;
    }
    .input-div {
        width: 243*$rate;
        height: 40*$rate;        
        border-style: solid;
        border-width: .5*$rate;
        border-color: #aeaeae*$rate;
        border-radius: 3px*$rate;
        margin-left: 22px*$rate;
        padding-left: 10px*$rate;
        flex-direction: row;
        align-items: center;
    }
    .input{
        font-size: round(16*$rate);
        height: 36*$rate;
        width: 200*$rate;
    }
    .foot {
        width: 386*$rate;
        height: 70*$rate;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        border-top-style: solid;
        border-top-color: #aeaeae;
        border-top-width: .5*$rate;
    }
    .hasBorder {
        width: 80*$rate;
        height: 40*$rate;
        align-items: center;
        justify-content: center;
        border-style: solid;
        border-color: #ef494d;
        border-width: .5*$rate;
        border-radius: 99;
    }
    .hasBg {
        /*width: 80;*/
        width: 380*$rate;
        height: 45*$rate;
        align-items: center;
        justify-content: center;
        margin-left: 7*$rate;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        border-radius: 99;
    }
    .redText {
        color: #ef494d;
        font-size: round(16*$rate);
    }
    .whiteText {
        font-size: round(16*$rate);
        color: #fff;
    }
</style>
<script>
    import icons from "../../assets/icon.js"
    import filters from '../../common/filters.js'
    const closeIcon = icons.modalIcons
    const modal = weex.requireModule('modal')
    const storage = weex.requireModule('storage')
    export default {
        data () {
            return {
                closeIcon: closeIcon.closeBtnIcon,
                name: '',
                password: '',
                prepareMoney: '',
                remark:''
            }
        },
        computed: {
            shiftData () {
                return 'xsssssssssssss'
            }
        },
        watch:{
            display(){
                this.prepareMoney = this.prepare
            }
        },
        props:['display','prepare','money','cash'],
        filters:{
            price: filters.price
        },
        methods: {
            stopPro () {

            },
            toggle (index) {
                this.nowIndex = index;
            },
            close () {
               this.$emit('close','')
            },
            save(){
                var self = this
                storage.getItem('store_info',res=>{
                    var id = JSON.parse(res.data)['STORE.STORE_ID']
                    storage.setItem(id + 'prepare_money',self.prepareMoney ,res=>{
                        storage.setItem(id + 'work_start_time','false',res=>{
                            storage.setItem(id + 'account_data','{}',res =>{
                                self.$emit('submit',self.prepareMoney,self.remark)
                            })
                        })                      
                    })
                })
            }

        }
    }
</script>