<template>
    <div class="wrapper" v-if="action == 1">

        <div class="header">
            <div class="search-input">
                <image :src="search" class="img"></image>
                <input  class="input" placeholder="请输入员工姓名 登录账号"  v-model="searchKey" return-key-type="search" @return = "onreturn"/>
            </div>
        </div>
        <div class="body">       
        <div class="panel-head">
            <div class="userPhone">
                <text class="text">当班日期</text>
            </div>
            <div class="userName">
                <text class="text">员工姓名</text>
            </div>           
            <div class="userCard">
                <text class="text">初始备用金</text>
            </div>
            <div class="userState">
                <text class="text">当班现金总额</text>
            </div>          
            <div class="userState">
                <text class="text">操作</text>
            </div>
        </div>
        <scroller class="scroller" loadmoreoffset="10" @loadmore="loadmore">
            <div class="panel-body" @click="showDetail(item)" v-for="item in list">
                <div class="userPhone">
                    <text class="text">{{item['time']}}</text>
                </div>
                <div class="userName">
                    <text class="text">{{item['STORE_HAND_OVER.DUTY_MAN_NAME']}}</text>
                </div>                
                <div class="userCard">
                    <text class="text" >{{item['STORE_HAND_OVER.CURRENT_PETTY_CASH'] | price}}</text>                      
                </div>
                <div class="userState">
                    <text class="text">{{item['STORE_HAND_OVER.HAND_OVER_CASH'] | price}}</text>
                </div>               
                <div class="userState">
                    <div class="btn2-item" @click="showDetail(item)">
                        <text class="btn2" >详情</text>
                    </div>
                </div>
            </div>
        </scroller>
        </div> 
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    /*测试scroller*/
    .wrapper {
        flex: 1;
        align-items: center;
        background-color: #fff;
        margin: 20*$rate;
        border-radius: 10*$rate;
    }
    .header{
        width: 1758*$rate;
        padding-top: 60*$rate;
        padding-bottom: 60*$rate;
    }
    .body{
        flex: 1;
    }
    .scroller {
        position: absolute;
        top: 50;
        left: 0;
        right: 0;
        bottom: 60*$rate;
        margin-bottom: 60*$rate;
        flex-direction: column;
        align-items: center;
    }
    .panel-head {
        height: 50px;
        width: 1758*$rate;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background-color: #f6f6f6;
        padding-left: 27px;
        padding-right: 27px;
        border-color: #d6d6d6;
        border-width: 0.36;
        border-style: solid;
    }
    .panel-body {
        height: 50px;
        width: 1758*$rate;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background-color: #ffffff;
        padding-left: 27px;
        padding-right: 27px;
        border-bottom-color: #d6d6d6;
        border-bottom-width: 0.36;
        border-bottom-style: solid;

        border-left-color: #d6d6d6;
        border-left-width: 0.5;
        border-left-style: solid;

        border-right-color: #d6d6d6;
        border-right-width: 0.5;
        border-right-style: solid;
    }
    .text {
        font-size: round(30*$rate);
        margin-right: 3px;
        color: #333; 
    }
    .h1{
        font-size: round(40*$rate);
        margin-right: 3px;
        color: #000;
    }
    .h2{
        font-size: round(40*$rate);
        margin-right: 3px;
        color: #000;
    }
    .userCard {
        width: 100px;
        height: 45px;
        justify-content: center;
    }
    .userName {
        width: 77px;
        height: 45px;
        justify-content: center;
    }
    .userPhone {
        width: 100px;
        height: 45px;
        justify-content: center;
    }
    .userPoint {
        width: 66px;
        height: 45px;
        justify-content: center;
    }
    .userRemain {
        width: 79px;
        height: 45px;
        justify-content: center;
    }
    .userState {
        width: 96px;
        height: 45px;
        justify-content: center;
    }
    .btn1-item{
        width: 36;
        /*height: 60px;*/
        height: 20px;
        border-width: 0.5;
        border-style: solid;
        border-color: #aeaeae;
        border-radius: 15;
        justify-content: center;
        align-items: center;
    }
    .btn1 {
        font-size: round(30*$rate);
        /*font-size: 16px;*/
        color: #f8797e;
    }
    .btn2-item{
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 23px;
        border-radius: 15;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
    }
    .btn2 {
        /*font-size: 13px;*/
        font-size: round(24*$rate);
        color: #fff;
        /*color: #f8797e;*/
    }
    .search-input {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background-color: #f2f2f2;
        width: 1000 * $rate;
        height: 90 * $rate;
        border-radius: 99;
    }
    .img {
        width: 40 * $rate;
        height: 40 * $rate;
        margin-left: 30 * $rate;
    }
    .input {
        font-size: round(30*$rate);
        width: 800*$rate;
        height: 80 * $rate;
        margin-left: 40 * $rate;
        color: #999;
        background-color: rgba(0,0,0,0);
        placeholder-color: #999999;
    }
</style>
<script>
    import navigator from "../../common/navigator"
    import filters from "../../common/filters"
    import icons from "../../assets/icon.js"
    const searchBarIcons = icons.searchBarIcons;
    const modal = weex.requireModule('modal');

    export default {
        data () {
            return {
                search:searchBarIcons.searchIcon,
                insertedData:'',
                searchKey:'',
            }
        },
        computed:{

        },
        props: ['action','list'],
        filters:{
            price:filters.price
        },
        methods: {
            showDetail: function (item) {
                navigator.push({
                    'url': '/modules/change/change-history',
                    'query':'?id='+item['STORE_HAND_OVER.HAND_OVER_RECORD_ID'],
                    'animated': "false"
                }, function(e){
                    
                })  
                          
            },
            onreturn(){
                this.$emit('search',encodeURI(this.searchKey))
            },
            loadmore(){
                
            }
        }
    }
</script>