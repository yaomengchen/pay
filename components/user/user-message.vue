<template>
    <div class="item" v-if="dis" @click="close">
        <div class="div" @click="stop">
            <div class="head">
                <text class="title">{{user['USER.NAME']}}</text>
                <text class="h2">{{user['USER.LOGIN_ID']}}</text>
            </div>
            <div class="list">
                <text class="list-title">门店</text>
                <text class="list-content">{{store['STORE.STORE_NAME']}}</text>
            </div>
            <div class="list">
                <text class="list-title">门店电话</text>
                <text class="list-content">{{store['STORE.CONTACT_PHONE']}}</text>
            </div>
            <div class="btn" @click="click">
                 <text class="btn-text">切换账号</text>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .item{
        position: fixed;
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
        width: 300;
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
        width: 300;
        background-color: #fff;
        border-radius: 5;
        align-items: center;
    }
    .list{
        height: 40;
        width: 300;
        border-bottom-width: 0.3;
        border-bottom-color: #999;
        padding-left: 15;
        padding-right: 15;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
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
        color: #333
    }
    .btn{
        margin-top: 30;
        margin-bottom: 20;
        height: 45;
        width: 250;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        align-items: center;
        justify-content: center;
        border-radius: 5;
    }
    .btn-text{
        font-size: 12;
        color: #fff;
    }
</style>
<script>
    import navigator from "../../common/navigator.js"
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    export default {
        data () {
            return {
                result:'',
                input:false,
                store:{},
                user:{}
            }
        },
        props:['dis'],
        created(){
            storage.getItem('store_info',res =>{
                this.store = JSON.parse(res.data)
            })
            storage.getItem('userInfo',res =>{
                this.user = JSON.parse(res.data)
            })
        },
        methods:{
            click(){
                navigator.pop({
                    'animated': "false"
                },function(){})
            },
            close(){
                this.$emit('close',false)
            },
            stop(){}
        }
    }
</script>