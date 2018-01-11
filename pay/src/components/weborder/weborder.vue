<template>
    <div class="order-index">
        <div class="header">
            <div class="toggle-order-mode-bar">
                <div class="toggle-order-mode-bar-item" :class="[nowIndex==0?'toggle-order-mode-bar-item-active':'']" @click="toggleActiveHeader(0)">
                    <text class="toggle-order-mode-bar-item-text">今日订单</text>
                    <div class="pop" ref="webpop" v-if="num > 0">
                        <text class="pop-text">{{num}}</text>  
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
            <!-- <orderList class="order-list body-item" :order-list="orderList" :focus-order="focusOrder" :type="tabbarType" @change="change" @search="search"  @load="loadmore"></orderList> -->
            <orderList class="order-list body-item" :order-list="orderList" :focus-order="focusOrder" :type="tabbarType" @change="change" @search="search"></orderList>
            <orderDetail class="order-detail body-item" :order="orderDetails" @printed="choosePrint" :list="printlist"  :type="tabbarType" ref="detail"  @cancel="chooseReason" @type="chooseType"  @agreeTip="getAgreeRefund" @rejectTip="getRejectRefund" :cancelbtn="cancelbtntext"></orderDetail>
        </div>
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
    const storage = weex.requireModule('storage')
    export default {
        data () {
            return {
                api:{
                    today:'',
                    return:'/bee/store/order/return/bill/queryAllForApp?PAGE_SIZE=20&PN=',
                    all:'/bee/store/order/bill/queryAllForApp?PAGE_SIZE=20&PN='
                },
                //网单今日退单
                webReturnApi      :'/bee/three/waimai/queryAllTodayCancelOrderByStore?SERVICE_ID=',
                // 网单查询接口
                webAllApi         :'/bee/three/waimai/queryAllOrderByStore?SERVICE_ID=',
                // 饿了么卖家主动取消
                cancelSellerEleme:'/bee/eleme/initiativeCancel?SERVICE_ID=',
                // 美团卖家主动取消
                cancelSellerMeituan:'/bee/meituan/initiativeCancel?SERVICE_ID=',
                //卖家同意退单（仅对饿了么有效）
                agreeRefundE:'/bee/eleme/agreeRefund?SERVICE_ID=',
                agreeRefundM:'/bee/meituan/agreeRefund?SERVICE_ID=',
                //卖家拒绝退单（仅对饿了么有效）
                rejectRefundE:'/bee/eleme/disagreeRefund?SERVICE_ID=',
                rejectRefundM:'/bee/meituan/disagreeRefund?SERVICE_ID=',
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
                cancelbtntext:'取消订单',
                webTodayList:[],
                webReturnList:[],
                cancelType:'',
                cancelId:'',
                displayReject:false,
                displaySure:false,
                refundId:'',
                orderDetailObj:{},
                webAllList:[],
                tabbarType:'today',
                sourceType:''
            }
        },
        props:['count','todaylist','returnlist','alllist','num'],
        components: {
            orderList,
            orderDetail,
            nothing,
            cancelchoose,
            printChoose,
            cancelSure,
            cancelReject,
        },
        mounted(){
            var self = this
            this.render = true;
            storage.getItem('store_info',res=>{
                let val = JSON.parse(res.data)
                self.storeid   = val['STORE.STORE_ID']
                self.storeTel  = val['STORE.CONTACT_PHONE']
                self.storeName = val['STORE.STORE_NAME']
                self.serviceid = val['STORE.SERVICE_ID']

            })

        },
        computed: {
            orderList(){
                if(this.nowIndex == 0){
                    this.tabbarType = 'today'
                    return this.todaylist
                }else if(this.nowIndex == 1){
                    this.tabbarType = 'return'
                    return this.webReturnList
                }else if(this.nowIndex == 2){
                    this.tabbarType = 'all'
                    return this.webAllList
                }
            },
            orderDetails(){
                return this.orderDetailObj

            }
        },
        methods: {
            // 今日退单查询
            webReturnQuery(state,index){
              let self = this;
              stream.fetch({
                method: 'GET',
                url: self.webReturnApi+ self.serviceid + '&STORE_ID=' + self.storeid,
                type:'json'
              }, function(res) {
                if(res.extraData['TODAY_CANCEL_ORDER_LIST']){
                      self.webReturnList = res.extraData['TODAY_CANCEL_ORDER_LIST']
                    if(state){
                        self.getOrder(self.webReturnList,index)
                    }
                }
                
              })
            },
            // 今日退单查询
            // 全部订单查询
            webALLQuery(state,index){
              let self = this,
                  sum  = 0,
                  type = 0,
              orderlist= [];
              stream.fetch({
                method: 'GET',
                url: self.webAllApi + self.serviceid + '&STORE_ID=' + self.storeid + "&PAGE_SIZE=20&PN="+self.pageNumber,
                type: 'json'
              },res =>{
                if(res.extraData['ALL_ORDER_LIST'].length > 0 ){
                    if(self.pageNumber == 1){
                        self.webAllList = res.extraData['ALL_ORDER_LIST'];
                    }else{
                        self.webAllList = self.webAllList.concat(res.extraData['ALL_ORDER_LIST']);

                    }
                }
                if(state){
                    self.getOrder(self.webAllList,index)
                }
             })
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
                        self.render ? '' : (self.render = true)
                        self.cancelbtntext = '已取消';
                        for (var i = 0; i < self.todaylist.length; i++){
                            if(self.todaylist[i]['STORE_ORDER.ORDER_ID'] == self.cancelId ){
                                self.todaylist.splice(i, 1);
                            }
                        }
                        self.cancelbtntext = '取消订单';
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
                }else if(this.nowIndex == 0){
                    this.order = this.getOrder(this.todaylist,res)
                }else if(this.nowIndex == 1){
                    this.order = this.getOrder(this.webReturnList,res)
                }else if(this.nowIndex == 2){
                    this.order = this.getOrder(this.webAllList,res)
                }
            },
            getOrder(list,index){
                let self = this 
                var arr = []
                var sum = 0;
                var result = [];
                console.log(index)
                if(list[index]){
                    let id = list[index]['STORE_ORDER.ORDER_ID']
                    stream.fetch({
                      method:"GET",
                      url:self.orderDetail + id,
                      type:'json'
                    },res=>{
                        self.orderDetailObj = res.data[0];
                        for(let i in this.orderDetailObj['STORE_ORDER.STORE_ORDER_DETAILS']){
                            sum += parseFloat(this.orderDetailObj['STORE_ORDER.STORE_ORDER_DETAILS'][i]['STORE_ORDER_DETAIL.COUNT'])
                            arr.push(this.orderDetailObj['STORE_ORDER.STORE_ORDER_DETAILS'][i])
                        }
                        this.orderDetailObj.COUNT = sum.toString()
                        this.orderDetailObj['STORE_ORDER.STORE_ORDER_DETAILS'] = arr
                        self.$emit('renderOrder',false)
                        return this.orderDetailObj
                    }) 
                }else{
                    this.orderDetailObj = {}
                    return this.orderDetailObj
                }
            },
            toggleActiveHeader(res){
                var self = this
                if(self.nowIndex != res){
                    self.nowIndex = res
                    self.orderDetailObj = {}
                    if(self.nowIndex == 0){
                        if(self.todaylist.length > 0){
                            self.$emit('todayFn','')
                        }else{
                            self.orderDetailObj = {}
                        }
                    }else if(self.nowIndex == 1){
                        self.webReturnQuery(true,0)
                    }else if(self.nowIndex == 2){
                        self.pageNumber = 1
                        self.webALLQuery(true,0)
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
            getAgreeRefund(res,id,type){
                this.refundId = id
                this.displaySure = res
                this.sourceType = type
            },
            getRejectRefund(res,id,type){
                this.refundId = id
                this.displayReject = res;
                this.sourceType = type
            },
            // 卖家同意
            doAgreeRefund(res,act){
                let self = this,
                url = '';
                self.displaySure = res
                if(this.sourceType == 'ELEME'&& act){
                    url = self.agreeRefundE
                }else if(this.sourceType == 'MEITUAN'&& act){
                    url = self.agreeRefundM

                }
                if(act){
                    stream.fetch({
                    method: 'GET',
                    url: url + self.serviceid + '&STORE_ID=' + self.storeid+'&ORDER_ID='+self.refundId,
                    type: 'json'
                  },res =>{
                    self.$emit('todayFn','')
                  })
                }
            },
            doRejectRefund(res,reason){
                let self = this,
                url = '';
                self.displayReject = res;
                if(this.sourceType == 'ELEME'&& reason){
                    url = self.rejectRefundE
                }else if(this.sourceType == 'MEITUAN'&& reason){
                    url = self.rejectRefundM
                }
                if(reason){
                    console.log(self.refundId)
                    stream.fetch({
                        method: 'GET',
                        url: url + self.serviceid + '&STORE_ID=' + self.storeid+'&ORDER_ID='+self.refundId+'&REMARK='+reason,
                        type: 'json'
                      },res =>{
                        self.$emit('todayFn','')
                    })
                }
                
            },
            // 搜索
            search(key){
                let self = this,
                api = '';
                self.pageNumber = 1;
                if(self.nowIndex == 0){
                    self.webTodayApi + self.serviceid + '&STORE_ID=' + self.storeid+"&SEARCH="+key
                }else if(self.nowIndex == 1){
                    stream.fetch({
                        method: 'GET',
                        url: self.webReturnApi+ self.serviceid + '&STORE_ID=' + self.storeid+"&SEARCH="+key,
                        type:'json'
                      }, function(res) {
                        if(res.extraData['TODAY_CANCEL_ORDER_LIST']){
                            res.extraData['TODAY_CANCEL_ORDER_LIST'].forEach(ele=>{
                              self.webReturnList.push(res.extraData['TODAY_CANCEL_ORDER_LIST'])
                            })
                        }
                    })
                }else if(self.nowIndex == 2){
                    stream.fetch({
                        method: 'GET',
                        url: self.webAllApi + self.serviceid + '&STORE_ID=' + self.storeid + "&PAGE_SIZE=20&PN="+self.pageNumber+"&SEARCH="+key,
                        type:'json'
                      }, function(res) {
                        if(res.extraData['TODAY_CANCEL_ORDER_LIST']){
                            res.extraData['TODAY_CANCEL_ORDER_LIST'].forEach(ele=>{
                              self.webReturnList.push(res.extraData['TODAY_CANCEL_ORDER_LIST'])
                            })
                        }
                    })
                }
            },

        }
    }
</script>