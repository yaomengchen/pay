<template>
    <div class="wrapper">
        <div class="panel-head">
            <div class="userPhone">
                <text class="text">手机号</text>
            </div>
            <div class="userName">
                <text class="text">姓名</text>
            </div>           
            <div class="userCard">
                <text class="text">卡号</text>
            </div>
            <div class="userState">
                <text class="text">类型</text>
            </div>
            <div class="userPoint">
                <text class="text">积分</text>
            </div>
            <div class="userRemain">
                <text class="text">余额</text>
            </div>           
            <div class="userState">
                <text class="text">操作</text>
            </div>
        </div>

        <scroller class="scroller" loadmoreoffset="10" @loadmore="loadmore">
            <div class="panel-body" v-for="(item, index) in memberList" @click="showDetail(item)">
                <div class="userPhone">
                    <text class="h1">{{ item["MEMBER.PHONE"] }}</text>
                </div>
                <div class="userName">
                    <text class="text">{{ item["MEMBER.NAME"] }}</text>
                </div>                
                <div class="userCard">
                    <text class="text" >{{ item["MEMB_CARD.MEMB_CODE"] }}</text>                      
                </div>
                <div class="userState">
                    <text class="text">{{  item["MEMB_CARD.TYPE_ID"] }}</text>
                </div>
                <div class="userPoint">
                    <text class="text">{{ Math.floor(item["MEMB_CARD.USABLE_POINT"]) }}</text>
                </div>
                <div class="userRemain">
                    <text class="h2">{{ item["MEMB_CARD.USABLE_MONEY"] | price}}</text>
                </div>                
                <div class="userState">
                    <div class="btn2-item" @click="showDetail(item)">
                        <text class="btn2" >详情/充值</text>
                    </div>
                </div>
            </div>
        </scroller>

    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    /*测试scroller*/
    .wrapper {
        position: absolute;
        top: 208*$rate;
        bottom: 0;
        left: 0;
        right: 0;
        align-items: center;
    }
    .scroller {
        position: absolute;
        left: 0;
        right: 0;
        top: 50;
        bottom: 60*$rate;
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
        width: 67px;
        height: 45px;
        justify-content: center;
    }
    .userPhone {
        width: 110px;
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
        width: 66px;
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
        width: 50px;
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

</style>
<script>
    import navigator from "../../common/navigator"
    import filters from "../../common/filters"
    const modal = weex.requireModule('modal');

    export default {
        data () {
            return {
                
            }
        },
        computed:{

        },
        props: [
            "memberList",
            "tableRight",
            "tableLeft",
            "urlLeft",
            "urlRight",
        ],
        filters:{
            price:filters.price
        },
        methods: {
            showDetail: function (item) {
                if (item["MEMB_CARD.STATE"] == 'FORBID' || item['MEMBER.STATE' == 'FORBID']) {
                    modal.alert({
                      message: '卡已禁用！',
                      duration: 0.3
                    }, function (value) {
                      console.log('alert callback', value)
                    })
                } else {
                    navigator.push({
                        'url': '/modules/member/member-detail',
                        'query':'?id='+item['MEMB_CARD.MEMB_CARD_ID'],
                        'animated': "false"
                    }, function(e){
                        
                    })  
                }                           
            },
            // addMoneny: function (item) {
            //     if (item["MEMB_CARD.STATE"] == 'FORBID' || item['MEMBER.STATE' == 'FORBID']) {
            //         modal.alert({
            //           message: '卡已禁用！',
            //           duration: 0.3
            //         }, function (value) {
            //           console.log('alert callback', value)
            //         })
            //     } else {
            //         navigator.push({
            //             'url': '/modules/member/member-recharge',
            //             'query':'?id='+item['MEMB_CARD.MEMB_CARD_ID'],
            //             'animated': "false"
            //         }, function(e){
                        
            //         })
            //     }
            // },
            jumpToDetail: function ( item, index ) {
                    let $this = this;
                    $this.$store.dispatch('USER_GET').then(res => {             
                        const userId = item['MEMB_CARD.MEMB_CARD_ID']
                        const token = res["data"]["extraData"]["bubuId"]
                        const options = {
                            headers:{
                                token,
                                "Access-Control-Allow-Origin" : "*",
                                'Content-Type':'application/x-www-form-urlencoded',
                            },
                            body: {
                                'MEMB_CARD.MEMB_CARD_ID': userId
                            }
                        }
                        $this.$store.dispatch('BUYER_GET',options).then(res => {
                            $this.$router.push({
                                path:  '/member/userDetail',
                            });
                        })
                    })
            },
            loadmore(){
                this.$emit('load','')
            }
        }
    }
</script>