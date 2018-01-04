<template>
    <div class="item" v-if="show"  @click="close">
        <div class="div" @click="stop">
            <div class="head">
                <text class="title-or">选择取消原因</text>
            </div>
            <div class="list">
                <scroller class="scroller">
                    <div  class="list-detail" v-for="(item,index) in cancelList"  @click="chooseItem(index)">
                        
                        <text class="title"  v-if="!item['remark']">{{item['reason']}}</text>
                        <textarea class="textarea" v-if="item['remark']"  placeholder="*  请填写其他原因"  v-model="otherReason"></textarea>
                           <!--  <div>
                                <text class="title"  v-if="!item['remark']">{{item['reason']}}</text>
                                
                            </div> -->
                        <image :src="(item['state'])?choose:unchoose" class="chooseIcon"></image>
                    </div>
                </scroller>
            </div>
            <div class="btn-warp">
                <div class="btn-cancel" @click="close">
                     <text class="btn-text-or">取消</text>
                </div>
                <div class="btn-sure" @click="sure">
                     <text class="btn-text">确定</text>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .item{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-top: 30;
        align-items: center;
        background-color: rgba(0,0,0,0.3);
        align-items: center;
        justify-content: center;
    }
    .head{
        height: 40;
        width: 400;
        border-bottom-width: 0.3;
        border-bottom-color: #999;
        padding-left: 15;
        padding-right: 15;
        align-items: center;
        justify-content: center;
    }
    .h2{
        font-size: 12;
        color: #999;
    }
    .div{
        width: 400;
        height:350;
        background-color: #fff;
        border-radius: 5;
        align-items: center;
    }
    .scroller {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom:0;
        /*bottom: 60*$rate;*/
        /*margin-bottom: 60*$rate;*/
        flex-direction: column;
    }
    .list{
        height:260;
        width: 400;
        padding-left: 15;
        padding-right: 15;
        padding-top: 5;
        flex-direction: column;
    }
    .list-detail{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left:20;
        padding-right:20;
        padding-top:16;
        padding-bottom:16;
        border-width: 0.3;
        border-color: #d4d4d4;
        background-color:#fff;

    }
    .title{
        font-size: 12;
        color: #666;
    }
    .title-or{
        font-size: 14;
        color: #333
    }
    .list-content{
        font-size: 12;
        color: #999;
    }
    .list-title{
        font-size: 12;
        color: #666
    }
    .choosecontent{
        width:370;
        height:90;
        flex-direction: row;
        justify-content: space-around;
        align-items:center;
    }
    .btn-warp{
        position:absolute;
        bottom: 0;
        left:0;
        right:0;
        height: 50;
        padding-right: 30;
        border-width: 0.3;
        border-color: #d4d4d4;
        background-color:#fff;
        flex-direction: row;
        align-items:center;
        justify-content:flex-end;
    }
    .btn-sure{
        height: 35;
        width: 100;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        align-items: center;
        justify-content: center;
        border-radius: 35;

    }
    .btn-cancel{
        height: 35;
        width: 100;
        background-color:#fff;
        margin-right:20;
        align-items: center;
        justify-content: center;
        border-radius: 35;
        border-width: 0.3;
        border-color: #ef484c;
    }
    .btn-text{
        font-size: 12;
        color: #fff;
    }
    .btn-text-or{
        font-size: 12;
        color: #ef484c;
    }
    .choosetitle{
        font-size: 16;
        color: #333
    }
    .chooseIcon{
        width:15;
        height:15;
    }
    .chooseitem{
        width:160;
        height:70;
        padding:10;
        border-width: 0.3;
        border-color: #999;
        flex-direction: column;
        justify-content:space-between;
        align-items: center;
    }
    .textarea{
        height:60;
        width: 300;
        padding-top:10;
        padding-bottom:10;
        padding-left:10;
        padding-right:10;
        background-color: #f8f8f8;
        font-size: 12;
        color:#333;
    }
</style>
<script>
    import navigator from "../../common/navigator.js"
    const storage = weex.requireModule('storage')
    import modal from '../../common/modal.js'
    import icons from '../../assets/icon.js'
    const orderIcon = icons.orderIcon
    export default {
        data () {
            return {
                result:'',
                choose:orderIcon.choose,
                unchoose:orderIcon.unchoose,
                chooselist:[],
                cancelList:[
                    {'reason':'其他原因',    'type':'OTHERS','state':false,'remark':false},
                    {'reason':'联系不上用户','type':'CONTACT_USER_FAILED','state':false},
                    {'reason':'食物已售完',  'type':'FOOD_SOLD_OUT','state':false},
                    {'reason':'餐厅已打烊',  'type':'RESTAURANT_CLOSED','state':false},
                    {'reason':'超出配送范围','type':'DISTANCE_TOO_FAR','state':false},
                    {'reason':'风控取消',    'type':'USER_CANCEL','state':false},
                ],
                type:'',
                reason:'',
                otherReason:'',
            }
        },
        props:['show'],
        // created(){
        //     storage.getItem('store_info',res =>{
        //         this.store = JSON.parse(res.data)
        //     })
        //     storage.getItem('userInfo',res =>{
        //         this.user = JSON.parse(res.data)
        //     })
        // },
        // computed:{
        //     printlist(){

        //     }
        // }
        methods:{
            close(){
                this.$emit('cancel',false)
            },
            stop(){
            },
            chooseItem(index){
                let self   = this;
                self.cancelList.forEach(function(ele) {
                    ele['state'] = false
                })
                self.cancelList[index]['state'] = !self.cancelList[index]['state'];
                self.reason = self.cancelList[index]['reason'];
                self.type = self.cancelList[index]['type'];
                if(index == 0 && self.cancelList[index]['state']){
                    self.cancelList[0]['remark'] = true;
                }else{
                    self.cancelList[0]['remark'] = false
                } 
                if(index != 0 ){
                    self.otherReason = '';
                }
            },
            sure(){
                var self  = this
                if(self.reason == '' || self.reason == undefined){
                    modal.toast({message:'请选择取消原因',duration:1})
                }else if(self.reason == '其他原因' && (self.otherReason == ''||self.otherReason == undefined)){
                    modal.toast({message:'请填写取消原因',duration:1})
                }else{
                    if(self.otherReason){
                        self.reason = self.otherReason;
                    }
                    self.$emit('cancel',false, self.reason,self.type)
                }
            }
        },
        // watch(){


        // },

    }
</script>