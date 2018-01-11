<template>
    <div class="order-detail">
        <div class="order-detail-body">
            <div class="info-bar">
                <text class="font-gray33 font24">{{info['USER.NAME']}}</text>
                <text class="font-gray33 font24">{{info['USER.LOGIN_ID']}}</text>
            </div>
            <div class="infoLine"></div>
            <div class="item">
                <text class="font-gray33 font12">所属门店：</text>
                <text class="font-gray33 font12">{{store['STORE.STORE_NAME']}}</text>
            </div>
            <div class="item">
                <text class="font-gray33 font12">门店电话：</text>
                <text class="font-gray33 font12">{{store['STORE.CONTACT_PHONE']}}</text>
            </div>
        </div>
        <div class="order-detail-foot" @click="click">
            <div class="order-detail-content">
                <text class="order-text">退出</text>
            </div>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    $rem:0.472;
    .order-detail {
        position:relative;
        padding-top: 39*$rate;
        background-color: white;
        width:(1060*$rate);
        flex-direction:column;
    }
    .order-detail-body {
        height: 172*$rate;
        padding-bottom: 6.84/$rem*$rate;
        flex-direction: column;
        padding-left: 42.46/$rem*$rate;
        padding-right: 22.46/$rem*$rate;
    }
    .order-detail-foot{
        position: absolute;
        left: 0;
        rigth: 0;
        bottom: 0;
        width:(1060*$rate);
        height: 172*$rate;
        flex-direction:row;
        align-items:center;
        justify-content:center; 
        border-top-color:#d8d8d8;
        border-top-style:solid;
        border-top-width:1;
    }
    .order-detail-content{
        width:(800*$rate);
        background-color: #ef494d;
        height: 92*$rate;
        border-radius: 80;
        align-items:center;
        justify-content:center;

    }
    .order-text{
        font-size:14px;
        color:#fff;
    }
    .infoLine{
        height:1*$rate;
        border-bottom-color:#d8d8d8;
        border-bottom-style:solid;
        border-bottom-width:1;
        margin-bottom:15;
    }
    .info-bar {
        height: 172*$rate;
        flex-direction: column;
        margin-top:20;
        margin-bottom:20;
    }
    .item{
        height: 86*$rate;
        flex-direction:row;
        justify-content: space-between;
        align-items:center;
    }

    .font-gray33{
        color:#333;
    }
    .font12{
        font-size:14;
    }
    .font24{
        font-size:24;
        font-weight:bold;
    }
</style>
<script>
    import icon from '../../assets/icon.js'
    import filters from '../../common/filters.js'
    import stream from '../../common/stream.js'
    import navigator from '../../common/navigator.js'
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    const getEvent = weex.requireModule('event')

    export default {
        data () {
            return {
                returnIcon: icon.orderIcon.return,
                numberIcon: icon.weborderIcon.number,
                telIcon: icon.weborderIcon.tel,
                markDrakIcon: icon.weborderIcon.markDrak,
                localIcon: icon.weborderIcon.local,
                isRejectOrder: false,
                number:'',
                versions:{},
                // cancelbtn:'取消订单',
            }
        },
         mounted(){
            var self = this
            storage.getItem('store_info',res=>{
                let val = JSON.parse(res.data)
                self.versions  = self.$getConfig().env;
                console.log(self.versions)
                self.getinfo()
            })

        },
        props:['info','store'],
        filters:{
            price:filters.price
        },
        computed: {
            isReturn (){
                return this.order['STORE_ORDER.RETURN_MONEY']?true:false
            }
        },
        methods:{
            getinfo(){
                stream.fetch({
                    method: 'GET',
                    url:'/version/queryCurrentVersion',
                    type: 'json'
                },res => {
                    this.number = res.extraData['VERSION_NAME']
                })
            },
            click(){
                navigator.pop({
                    'animated': "false"
                },function(){})
            },
        }
    }
</script>