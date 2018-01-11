<template>
    <div class="order-index">
        <div class="header">
            <div class="toggle-order-mode-bar">
                <div class="toggle-order-mode-bar-item" :class="[nowIndex==0?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(0)">
                    <text class="toggle-order-mode-bar-item-text" >今日销售</text>
                </div>
                <div class="toggle-order-mode-bar-item" :class="[nowIndex==1?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(1)">
                    <text class="toggle-order-mode-bar-item-text">退款订单</text>
                </div>
                <div class="toggle-order-mode-bar-item" :class="[nowIndex==2?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(2)">
                    <text class="toggle-order-mode-bar-item-text">全部订单</text>
                </div> 
                <div class="toggle-order-mode-bar-item" :class="[nowIndex==3?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(3)">
                    <text class="toggle-order-mode-bar-item-text">同步中</text>
                </div> 
                <div class="toggle-order-mode-bar-item" :class="[nowIndex==4?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(4)">
                    <text class="toggle-order-mode-bar-item-text">同步失败</text>
                </div>    
            </div>
        </div>
        <div class="item" v-if="render && nowIndex != 3">
            <nothing :display="orderList.length"></nothing>
            <orderList class="order-list body-item" :order-list="orderList" :focus-order="focusOrder" @change="change" @load="loadmore"></orderList>
            <orderDetail class="order-detail body-item" :order="order" @printed="choosePrint" :list="printlist" ref="detail"></orderDetail>
        </div>
        <div class="item" v-if="render &&  nowIndex == 3">
            <nothing :display="wait.length"></nothing>
            <pendingOrderList class="order-list body-item" :order-wait="wait" :focus-order="focusOrder" @change="change" @load="loadmore"></pendingOrderList>
            <pendingOrderDetail class="order-detail body-item" :order="pendingOrder" @submited="submited"></pendingOrderDetail>
        </div>
        <div class="item" v-if="render &&  nowIndex == 4">
            <nothing :display="fail.length"></nothing>
            <faildOrderList class="order-list body-item" :order-fail="fail" :focus-order="focusOrder" @change="change" @load="loadmore"></faildOrderList>
            <faildOrderDetail class="order-detail body-item" :order="faildOrder" @submited="submited"></faildOrderDetail>
        </div>
        <printChoose :show="displayPri" @choose="choosePrint"></printChoose>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .order-index {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        padding-left: 150*$rate;
    }
    .header {
        background-color: #fff;
        height: 132*$rate;
        justify-content: flex-end;
        padding-left: 41*$rate;
    }
    .toggle-order-mode-bar {
        height: 92*$rate;
        flex-direction: row;
        align-items: stretch;
        justify-content: flex-start;
    }
    .toggle-order-mode-bar-item {
        width: 157*$rate;
        height: 91*$rate;
        border-top-color: white;
        border-top-width: 5*$rate;
        border-bottom-color: white;
        border-bottom-width: 5*$rate;
        justify-content: center;
        align-items: center;
        margin-right: 36*$rate;
    }
    .toggle-order-mode-bar-item-active {
        border-bottom-color: #f25b5f;
    }
    .toggle-order-mode-bar-item-text {
        font-size: round(33*$rate);
        color:#333333;
    }
    .item {
        background-color: #f3f3f3;
        position: absolute;
        top: 132*$rate;
        left: 150*$rate;
        bottom: 0;
        width: 750-150*$rate;
        padding: 24*$rate;
        flex-direction: row;
        justify-content: space-between;
    }
    .body-item {
        border-radius: 20*$rate;
    }
    .order-list {
        width: 765*$rate;
        background-color: #fff;
    }
    .order-detail {
        width: (1040*$rate);
        background-color: #fff;
    }
</style>
<script>
    import orderList from './order-list.vue'
    import orderDetail from './order-detail.vue'
    import pendingOrderList from './pending-order-list.vue'
    import pendingOrderDetail from './pending-order-detail.vue'

    import faildOrderList from './faild-order-list.vue'
    import faildOrderDetail from './faild-order-detail.vue'
    import nothing from '../nothing.vue'
    import stream from '../../common/stream.js'
    import printChoose from '../print/print-choose.vue'
    import modal from '../../common/modal.js'
    export default {
        data () {
            return {
                api:{
                    today:'',
                    return:'/bee/store/order/return/bill/queryAllForApp?PAGE_SIZE=20&PN=',
                    all:'/bee/store/order/bill/queryAllForApp?PAGE_SIZE=20&PN='
                },
                addApi:'/bee/store/order/bill/addByCommon',
                orderList:[],
                order:{},
                pendingOrder:{},
                nowIndex:0,
                focusOrder: 0,
                focusPendingOrder:0,
                render: false,
                displayPri:false,
                pageNumber:1,
                printlist:[],

            }
        },
        created(){
            const date = new Date()
            const year = date.getFullYear()
            const month = date.getMonth()+1;
            const day = date.getDate()

            this.api.today = '/bee/store/order/bill/queryAllForApp'+encodeURI('?STORE_ORDER.START_DATETIME='+ year + '-' + month + '-' + day + ' 00:00:00') + '&PAGE_SIZE=20&PN='
        },
        props:['count','fail','wait','storeid'],
        components: {
            orderList,
            orderDetail,
            nothing,
            pendingOrderDetail,
            pendingOrderList,
            faildOrderDetail,
            faildOrderList,
            printChoose
        },
        computed: {
            pendingList(){
                return this.wait.concat(this.fail)
            }
        },
        methods: {
            // 前后台选择显示
            choosePrint(res,list){
              if(res == '1'){
                this.displayPri = true
              }else{
                this.displayPri = false
              }  

              if(list){
                this.printlist = list;
                this.$refs.detail.goprint();
              }

            },
            loadmore(){
                var self = this
                self.pageNumber ++ 
                var api = (self.nowIndex == 0 ? self.api.today : (self.nowIndex == 1 ? self.api.return : self.api.all))
                
                self.getData(api + self.pageNumber, ()=>{
                })
                   
            },
            renderData(callback){
                var self = this
                self.focusOrder = 0
                self.nowIndex = 0
                self.pageNumber = 1
                console.log(11)
                self.getData(self.api.today + self.pageNumber,callback);
            },
            getData(api,callback){
                var self = this

                stream.fetch({
                    'method':'GET',
                    'url':api + '&STORE_ORDER.STORE_ID=' + self.storeid
                },res=>{
                    if(self.pageNumber == 1){
                        self.orderList = res.data
                        self.order = self.getOrder(this.focusOrder)
                    }else{
                        self.orderList = self.orderList.concat(res.data)
                    }                                        
                    self.render ? '' : (self.render = true)
                    callback();
                })
            },
            change(res){
                this.focusOrder = res
                if(this.nowIndex == 3){
                    this.pendingOrder = this.wait[res]
                }else if(this.nowIndex == 4){
                    this.faildOrder = this.fail[res]
                }else{

                    this.order = this.getOrder(res)
                }
            },
            getOrder(index){
                var arr = []
                var sum = 0
                if(this.orderList[index]){
                    for(let i in this.orderList[index]['STORE_ORDER.STORE_ORDER_DETAILS']){

                        sum += parseFloat(this.orderList[index]['STORE_ORDER.STORE_ORDER_DETAILS'][i]['STORE_ORDER_DETAIL.COUNT'])
                        arr.push(this.orderList[index]['STORE_ORDER.STORE_ORDER_DETAILS'][i])
                    }
                    this.orderList[index].COUNT = sum.toString()
                    this.orderList[index]['STORE_ORDER.STORE_ORDER_DETAILS'] = arr
                    return this.orderList[index]
                }else{
                    return {}
                }
                
            },

            toggleActiveHeader(res){
                if(this.nowIndex != res){
                    var self = this
                    this.nowIndex = res
                    this.focusOrder = 0
                    
                    if(res != 3 && res != 4) {                       
                        this.pageNumber = 1
                        var api = (res == 0 ? this.api.today : (res == 1 ? this.api.return : this.api.all))
                        this.$emit('renderOrder',true)
                        self.getData(api + self.pageNumber, ()=>{
                            self.$emit('renderOrder',false)
                        })
                    }else if(res == 3){
                        this.pendingOrder = this.wait[this.focusOrder]
                    }else{
                        this.faildOrder = this.fail[this.focusOrder]
                    }
                }           
            },
            submited(){
                this.$emit('renderOrder',true)                
                stream.fetch({
                  method:"POST",
                  url:this.addApi,
                  body:this.fail[this.focusOrder]
                },res=>{
                  modal.toast({message:'提交成功',duration:1.5})
                  this.$emit('cleanfailed',this.focusOrder)
                  if(this.fail.length == 0){
                    this.faildOrder = undefined
                  }else{
                    if(this.focusOrder == this.fail.length){
                        this.focusOrder -- 
                    }
                    this.faildOrder = this.fail[this.focusOrder]
                  }
                },res=>{
                    this.$emit('renderOrder',false)                                                                 
                })                                    
            }
        }
    }
</script>