<template>
    <div class="order-detail">
        <div class="order-detail-body">
            <div class="info-bar">
                <text class="font-gray33 font24">关于拨浪鼓</text>
            </div>
            <div class="infoLine"></div>
            <div class="item">
                <text class="font-gray33 font12">应用版本：</text>
                <text class="font-gray33 font12">{{versions['appVersion']}}</text>
            </div>
            <div class="item">
                <text class="font-gray33 font12">所属版本：</text>
                <text class="font-gray33 font12">{{number}}</text>
            </div>
            <div class="item">
                <text class="font-gray33 font12">PAD型号：</text>
                <text class="font-gray33 font12">{{versions['deviceModel']}}</text>
            </div>
            <div class="item">
                <text class="font-gray33 font12">系统版本：</text>
                <text class="font-gray33 font12">{{versions['osName']}} {{versions['osVersion']}}</text>
            </div>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    $rem:0.472;
    .order-detail {
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
    .infoLine{
        height:1*$rate;
        border-bottom-color:#d8d8d8;
        border-bottom-style:solid;
        border-bottom-width:1;
        margin-bottom:15;
    }
    .info-bar {
        height: 172*$rate;
        flex-direction: row;
        align-items: center;
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
        props:['info','store'],
        mounted(){
            var self = this
            storage.getItem('store_info',res=>{
                let val = JSON.parse(res.data)
                self.versions  = self.$getConfig().env;
                console.log(self.versions)
                self.getinfo()
            })

        },
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
            cancel(){
                this.$emit('type',true,this.order['STORE_ORDER.ORDER_SOURCE'],this.order['STORE_ORDER.ORDER_ID'])
            },
        }
    }
</script>