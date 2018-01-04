<template>
    <div class="order-index">
        <div class="header">
            <div class="toggle-order-mode-bar">
                <div class="toggle-order-mode-bar-item" :class="[nowIndex==0?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(0)">
                    <text class="toggle-order-mode-bar-item-text" >今日订单</text>
                    <div class="pop" ref="webpop" v-if="webcount > 0">
                        <text class="pop-text">{{webcount}}</text>  
                    </div>
                </div>
                <div class="toggle-order-mode-bar-item" :class="[nowIndex==1?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(1)">
                    <text class="toggle-order-mode-bar-item-text">今日退单</text>
                </div>
                <div class="toggle-order-mode-bar-item" :class="[nowIndex==2?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(2)">
                    <text class="toggle-order-mode-bar-item-text">全部单据</text>
                </div> 
                <!-- <div class="toggle-order-mode-bar-item" :class="[nowIndex==3?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(3)">
                    <text class="toggle-order-mode-bar-item-text">同步中</text>
                </div> -->  
            </div>
        </div>
        <div class="item" v-if="render">
            <nothing :display="orderList.length"></nothing>
            <orderList class="order-list body-item" :order-list="orderList" :focus-order="focusOrder" @change="change" @load="loadmore"></orderList>
            <orderDetail class="order-detail body-item" :order="orderDetails" @printed="choosePrint" :list="printlist" ref="detail"  @cancel="chooseReason" @type="chooseType"  @agreeTip="getAgreeRefund" @rejectTip="getRejectRefund" :cancelbtn="cancelbtntext"></orderDetail>
        </div>
        <!-- <div class="item" v-if="render &&  nowIndex ==1">
            <nothing :display="orderList.length"></nothing>
            <returnList class="order-list body-item" :order-list="orderList" :focus-order="focusOrder" @change="change" @load="loadmore"></returnList>
            <returnDetail class="order-detail body-item" :order="orderDetails" @printed="choosePrint" :list="printlist" ref="detail"  @cancel="chooseReason" @type="chooseType"  @agreeTip="getAgreeRefund" @rejectTip="getRejectRefund" :cancelbtn="cancelbtntext"></returnDetail>
        </div> -->
        <!-- 3为同步中 -->
        <!-- <div class="item" v-if="render &&  nowIndex == 3">
            <nothing :display="wait.length"></nothing>
            <pendingOrderList class="order-list body-item" :order-wait="wait" :focus-order="focusOrder" @change="change" @load="loadmore"></pendingOrderList>
            <pendingOrderDetail class="order-detail body-item" :order="pendingOrder" @submited="submited"></pendingOrderDetail>
        </div> -->
        <!-- 4为同步失败 -->
        <!-- <div class="item" v-if="render &&  nowIndex == 4">
            <nothing :display="fail.length"></nothing>
            <faildOrderList class="order-list body-item" :order-fail="fail" :focus-order="focusOrder" @change="change" @load="loadmore"></faildOrderList>
            <faildOrderDetail class="order-detail body-item" :order="faildOrder" @submited="submited"></faildOrderDetail>
        </div> -->
        <printChoose :show="displayPri" @choose="choosePrint"></printChoose>
        <cancelchoose :show="displayCanc" @cancel="chooseReason"></cancelchoose>
        <cancelSure :show="displaySure" @agree="doAgreeRefund"></cancelSure>
        <cancelReject :show="displayReject" @reject="doRejectRefund"></cancelReject>
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
    .pop{
      position: absolute;
      top: 0;
      right: 0;
      background-color: #ef494d;
      width: 40*$rate;
      height: 40*$rate;
      border-radius: 20;
      justify-content: center;
      align-items: center;
    }
    .pop-text{
      font-size: 8;
      color: #fff;
    }
</style>
<script>
    import orderList from './order-list.vue'
    import orderDetail from './order-detail.vue'
    import cancelchoose from './cancel-choose.vue'
    import cancelSure from './cancel-sure.vue'
    import cancelReject from './cancel-reject.vue'
    // import pendingOrderList from './pending-order-list.vue'
    // import pendingOrderDetail from './pending-order-detail.vue'

    // import faildOrderList from './faild-order-list.vue'
    // import faildOrderDetail from './faild-order-detail.vue'
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
                // 网单查询接口
                webAllApi         :'/bee/three/waimai/queryAllOrderByStore?SERVICE_ID=',
                // 饿了么卖家主动取消
                cancelSellerEleme:'/bee/eleme/initiativeCancel?SERVICE_ID=',
                // 美团卖家主动取消
                cancelSellerMeituan:'/bee/meituan/initiativeCancel?SERVICE_ID=',
                //卖家同意退单（仅对饿了么有效）
                agreeRefund:'/bee/eleme/agreeRefund?SERVICE_ID=',
                //卖家拒绝退单（仅对饿了么有效）
                rejectRefund:' /bee/eleme/disagreeRefund?SERVICE_ID=',
                // 详情查询
                orderDetail    :'/bee/store/order/bill/getById?STORE_ORDER.ORDER_ID=',
                addApi:'/bee/store/order/bill/addByCommon',
                pendingOrder:{},
                nowIndex:0,
                focusOrder: 0,
                focusPendingOrder:0,
                render: false,
                displayPri:false,
                displayCanc:false,
                pageNumber:1,
                printlist:[],
                webcount:2,
                cancelbtntext:'取消订单',
                webTodayList:[],
                webReturnList:[],
                cancelType:'',
                cancelId:'',
                displayReject:false,
                displaySure:false,
                refundId:'',
                orderDetailObj:{},
                pageNumber:0,
                webAllList:[],
            }
        },
        props:['count','todaylist','returnlist','alllist','serviceid','storeid'],
        components: {
            orderList,
            orderDetail,
            nothing,
            cancelchoose,
            printChoose,
            cancelSure,
            cancelReject,
        },
        computed: {
            orderList(){
                if(this.nowIndex == 0){
                    return this.todaylist
                }else if(this.nowIndex == 1){
                    // this.orderlist = this.returnlist
                    // this.getOrder(0);
                    return this.returnlist
                }else if(this.nowIndex == 2){
                    // this.orderlist = this.webAllList
                    // this.getOrder(0);
                    return this.webAllList
                }
            },
            orderDetails(){
                return this.orderDetailObj

            }
        },
        methods: {
            // 全部订单查询
            webALLQuery(){
              let self = this,
                  sum  = 0,
                  type = 0,
              orderlist= [];
              stream.fetch({
                method: 'GET',
                url: self.webAllApi + self.serviceid + '&STORE_ID=' + self.storeid + "&PAGE_SIZE=20&PN="+self.pageNumber,
                type: 'json'
              },res =>{
                if(self.webAllList['SUM']){
                    sum = self.webAllList['SUM']
                }
                res.extraData['ALL_ORDER_LIST'].forEach(e=>{
                    sum += parseFloat(e['STORE_ORDER.SUM_MONEY'])
                    self.webAllList.push(e)
                })
             })
            self.webAllList['SUM'] = sum
            self.webAllList['TYPE'] = self.webAllList.length;

            },
            // 全部订单查询
            loadmore(){
                var self = this
                self.pageNumber ++ 
                self.webALLQuery()
            },
            // 打印前后台选择显示
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
            //卖家取消订单原因选择
            chooseReason(res,reason,type){
                let self = this;
                let url = ''
                this.displayCanc = res;
                if(reason){
                    self.cancelbtntext = '取消中';
                    if(self.cancelType == 'ELEME'){
                        url = self.cancelSellerEleme
                    }else if(self.cancelType == 'MEITUAN'){
                        url = self.cancelSellerMeituan
                    }
                    stream.fetch({
                        'method':'POST',
                        'url':url  + self.serviceid + '&STORE_ID=' + self.storeid + '&CANCEL_TYPE='+type+'&CANCEL_REASON='+ encodeURI(reason) +'&ORDER_ID='+ self.cancelId 
                    },res=>{
                        if(self.pageNumber == 1){
                            self.orderList = res.data
                            self.order = self.getOrder(this.focusOrder)
                        }else{
                            self.orderList = self.orderList.concat(res.data)
                        }                                        
                        self.render ? '' : (self.render = true)
                        self.cancelbtntext = '已取消';

                        callback();
                    })
                }
                
            },
            // // 卖家取消类型
            chooseType(res,type,id){
                this.displayCanc = res;
                this.cancelType = type;
                this.cancelId   = id;

            },
            // 父级调用
            renderData(callback){
                var self = this
                self.focusOrder = 0
                self.nowIndex = 0
                self.pageNumber = 1
                self.render = true;
                self.$emit('renderOrder',true)
                // self.getData(self.api.today + self.pageNumber,callback)
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
                }else{this.order = this.getOrder(res)
                }
            },
            getOrder(index){
                let self = this 
                var arr = []
                var sum = 0;
                var result = [];
                if(self.orderList[index]){
                    let id = self.orderList[index]['STORE_ORDER.ORDER_ID']
                    stream.fetch({
                      method:"GET",
                      url:self.orderDetail + id,
                      type:'json'
                    },res=>{
                        self.orderDetailObj = res.data[0];
                        for(let i in this.orderDetailObj['STORE_ORDER.STORE_ORDER_DETAILS']){
                            console.log(1111)
                            console.log(this.orderDetailObj['STORE_ORDER.STORE_ORDER_DETAILS'][i]['STORE_ORDER_DETAIL.COUNT'])
                            sum += parseFloat(this.orderDetailObj['STORE_ORDER.STORE_ORDER_DETAILS'][i]['STORE_ORDER_DETAIL.COUNT'])
                            arr.push(this.orderDetailObj['STORE_ORDER.STORE_ORDER_DETAILS'][i])
                        }
                        this.orderDetailObj.COUNT = sum.toString()
                        this.orderDetailObj['STORE_ORDER.STORE_ORDER_DETAILS'] = arr
                        return this.orderDetailObj
                    }) 
                    
                }else{
                    return {}
                }
            },
            toggleActiveHeader(res){
                var self = this
                if(self.nowIndex != res){
                    self.nowIndex = res
                    if(self.nowIndex == 0){
                        if(self.todaylist.length > 0){
                            self.orderList == self.todaylist
                            self.getOrder(0)
                        }else{
                            self.orderDetailObj = {}
                        }
                    }else if(self.nowIndex == 1){
                        if(self.returnlist.length > 0){
                            self.orderList == self.returnlist
                            self.getOrder(0)
                        }else{
                            self.orderDetailObj = {}
                        }
                    }else if(self.nowIndex == 2){
                        if(self.webAllList.length > 0){
                            self.pageNumber = 1
                            self.webALLQuery()
                            self.orderList == self.webAllList
                            self.getOrder(0)
                        }else{
                            self.orderDetailObj = {}
                        }
                        

                    }
                    // self.focusOrder = 0
                    // 3、4为同步中/同步失败
                    // if(res != 3 && res != 4) {  
                    //     self.$emit('renderOrder',true)
                    // }
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
                  // this.$emit('cleanfailed',this.focusOrder)
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
            },
            getAgreeRefund(res,id){
                this.displaySure = res
                this.refundId = id
            },
            getRejectRefund(res,id){
                this.displayReject = res;
                this.refundId = id
            },
            // 卖家同意
            doAgreeRefund(res,act){
                let self = this;
                self.displaySure = res
                if(act){
                    stream.fetch({
                    method: 'GET',
                    url: self.agreeRefund + self.serviceid + '&STORE_ID=' + self.storeid+'&ORDER_ID='+self.refundID,
                    type: 'json'
                  },res =>{
                    for (var i = 0; i < self.webTodaylist.length; i++) {
                        if (self.webTodaylist[i]['STORE_ORDER.ORDER_ID'] === ele['STORE_ORDER.ORDER_ID']) {
                            self.webTodaylist.splice(i, 1);
                            break;
                        }
                    }
                  })
                }
                
                // self.webTodaylist.unshift(ele);
                // self.webAllList.unshift(ele);

            },
            doRejectRefund(res,reason){
                let self = this;
                self.displayReject = res;
                if(reason){
                    stream.fetch({
                        method: 'GET',
                        url: self.rejectRefund + self.serviceid + '&STORE_ID=' + self.storeid+'&ORDER_ID='+self.refundID+'&REMARK='+reason,
                        type: 'json'
                      },res =>{
                        self.webTodayList = res.extraData['TODAY_ORDER_LIST']
                    })
                }
               
            },

        }
    }
</script>