<template>
    <div class="item" v-if="show"  @click="close">
        <div class="div" @click="stop">
            <div class="head">
                <text class="title">选择打印机</text>
            </div>
            <div class="list">
                <text class="list-title">选择需要重新打印的打印机</text>
                <div class="choosecontent">
                    <div class="chooseitem"  v-for="(item,index) in printlist" @click="chooseItem(index)">
                        <text class="choosetitle">{{item['name']}}</text>
                        <image :src="(item['choose'])?choose:unchoose" class="chooseIcon"></image>
                    </div>
                </div>
            </div>
            
            <div class="btn" @click="sure">
                 <text class="btn-text">确定</text>
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
        height: 70;
        width: 400;
        border-bottom-width: 0.3;
        border-bottom-color: #999;
        padding-left: 15;
        padding-right: 15;
        justify-content: center;
    }
    .h2{
        font-size: 12;
        color: #999;
    }
    .div{
        width: 400;
        background-color: #fff;
        border-radius: 5;
        align-items: center;
    }
    .list{
        height: 110;
        width: 400;
        padding-left: 15;
        padding-right: 15;
        padding-top: 5;
        flex-direction: column;
    }
    .title{
        font-size: 22;
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
    .btn{
        margin-top: 30;
        margin-bottom: 20;
        height: 45;
        width: 250;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        align-items: center;
        justify-content: center;
        border-radius: 45;
    }
    .btn-text{
        font-size: 12;
        color: #fff;
    }
    .choosetitle{
        font-size: 16;
        color: #333
    }
    .chooseIcon{
        width:15;
        height:15;
        margin-left:120;
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
                printlist:[
                    {'name':'第三方打印机','choose':false},
                    {'name':'前台打印机','choose':false},
                ]
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
                this.$emit('choose',false)
            },
            stop(){
            },
            chooseItem(index){
                var self = this;
                self.printlist[index]['choose'] = !self.printlist[index]['choose'] 
            },
            sure(){
                var self  = this
                if(self.printlist[0]['choose'] == false && self.printlist[1]['choose'] == false){
                    modal.toast({message:'请选择打印方式',duration:1})
                }else{
                    if(self.printlist[1]['choose'] == true){
                        self.chooselist.push('front')
                    }
                    if(self.printlist[0]['choose'] == true){
                        self.chooselist.push('other')
                    }
                    self.$emit('choose',false, self.chooselist)
                }
            }
        },
        // watch(){


        // },

    }
</script>