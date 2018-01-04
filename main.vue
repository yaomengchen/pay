<template>
  <div @viewappear="refersh">
    <div class="page">
      <div class="content" ref="page">
        <div class="pageItem">
          <product @render="renderOver" @search="startInput" @loadmore="loadingOver" @member="openMemberConfirm" ref="index"></product>
        </div>
        <div class="pageItem">
          <order ref="order" :storeid="storeId" :count="count" :wait="waitSubmitList" :fail="errorSubmitList" @renderOrder="renderOver" @cleanfailed="cleanFailedOrder"></order> 
        </div>

        <div class="pageItem">
          <member ref="member"></member>
        </div>
        <div class="pageItem">
          <change ref="change" :storeid="storeId" :storename="storeName"  :start-time="startTime" @render="renderOver"></change>
        </div>
        <!-- 网单 -->
        <div class="pageItem">
          <weborder ref="weborder"  @renderOrder="renderOver"  :todaylist="webAllTodayList" :returnlist="webAllReturnList" :serviceid="serviceId" :storeid="storeId"></weborder> 
        </div>
        <!-- 网单 -->
      </div>
      <div class="sidebar bg">
        <div>
          <div class="item" @click="goLogin('1')">
            <image :src="privateIcon" class="private-icon"></image>                  
          </div>
          <div class="item" @click="switchPage(0)">
            <image :src="index == 0 ? cartIconAction : cartIcon" class="cart-icon"></image>
            <text class="item-name">收银</text>                  
          </div>
          <div class="item" @click="switchPage(1)">
            <image :src="index == 1 ? orderIconAction : orderIcon" class="order-icon" ></image>
            <text class="item-name">订单</text>
            <div class="pop" ref="pop" v-if="count > 0">
              <text class="pop-text">{{count}}</text>  
            </div>
          </div>
          <!-- 网单 -->
          <div class="item" @click="switchPage(4)">
            <image :src="index == 4 ? orderIconAction : orderIcon" class="order-icon" ></image>
            <text class="item-name">全网订单</text>
            <div class="pop-or" ref="webpop" v-if="webReturnTip"></div>
          </div>
          <!-- 网单 -->
        </div>
        <div>
          <div class="item" @click="switchPage(2)">
            <image :src="index == 2? memberIconAction : memberIcon" class="change-icon"></image>
            <text class="item-name">会员</text>
          </div>
          <div class="item" @click="switchPage(3)">
            <image :src="index == 3? changeIconAction : changeIcon" class="member-icon"></image>
            <text class="item-name">交班</text>
          </div>
        </div>
      </div>        
    </div>
    <memberConfirm @data="memberData" @render="renderOver" ref="confirm"></memberConfirm> 
    <!-- <renderTip :render="render"></renderTip> -->
    <dataLoading :loading="loading"></dataLoading>
    <bigInput @event="inputEvent" ref="input"></bigInput>
    <cancelTip @cancel="cancelOrder" :show="displayCanc" @click="switchPage(4)" :num="cancelNum"></cancelTip>
    <userMessage :dis="displayMes" @close="goLogin"></userMessage>

  </div>
</template>
<style scoped lang="sass">
$rate:0.3662;
.page {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #f2f2f2;
}
.sidebar{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #252A2F;
  width: $rate*150px;
  justify-content: space-between;
  align-items: center;
  padding-top: $rate*60px;
  padding-bottom: $rate*60px;
}
.item{
  width: $rate*100px;
  height: $rate*100px;
  justify-content: center;
  align-items: center;
  margin-bottom: $rate*60px;
}
.item-name {
  color: #999999;
  font-size: round(22*$rate);
  margin-top: $rate*15px;
}
.private-icon {
  height: 56px*$rate;
  width: 50px*$rate;
}
.cart-icon {
  width: 50px*$rate;
  height: 47px*$rate;
}
.order-icon {
  width: 47px*$rate;
  height: 47px*$rate;
}
.pending-order-icon {
  width: 47px*$rate;
  height: 47px*$rate;
}
.change-icon {
  width: 48px*$rate;
  height: 48px*$rate;
}
.member-icon {
  width: 48px*$rate;
  height: 43px*$rate;
}
.content{
  flex-direction: row;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
}
.pageItem{
  width: 750px;
  top: 0;
  bottom: 0;
  background-color: #f2f2f2;
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
.pop-or{
  position: absolute;
  top: 1;
  right: 7;
  background-color: #ef494d;
  width: 20*$rate;
  height: 20*$rate;
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
import product from './components/product/product.vue'
import order from './components/order/order.vue'
import member from './components/member/member.vue'
import change from './components/change/change.vue'
    //网单
    import weborder from './components/weborder/weborder.vue'
    //网单
    import renderTip from './components/render-tip.vue'
    import dataLoading from './components/loading.vue'
    import bigInput from './components/big-input.vue'
    import cancelTip from './components/weborder/cancel-tip.vue'
    import memberConfirm from './components/member/member-confirm.vue'
    import userMessage from './components/user/user-message.vue'
    import icons from './assets/icon.js'
    import navigator from './common/navigator.js'
    import stream from './common/stream.js'
    import modal from './common/modal.js'
    import format from './common/format.js'

    const animation = weex.requireModule('animation')
    
    const storage = weex.requireModule('storage')
    const globalEvent = weex.requireModule('globalEvent');
    const blueScanEvent = weex.requireModule('blueScanEvent');
    const tabBarIcons = icons.tabBarIcons

    export default{
      data () {
        return {
          privateIcon:tabBarIcons.defaultLogoIcon,
          cartIcon:tabBarIcons.cartIcon,
          orderIcon:tabBarIcons.orderIcon,
          changeIcon:tabBarIcons.changeIcon,
          memberIcon:tabBarIcons.memberIcon,
          cartIconAction:tabBarIcons.cartIconAction,
          orderIconAction:tabBarIcons.orderIconAction,
          changeIconAction:tabBarIcons.changeIconAction,
          memberIconAction:tabBarIcons.memberIconAction,
          addApi            :'/bee/store/order/bill/addByCommon',
          getPayType        :'/store/pay/way/map/getByIdleft?STORE.STORE_ID=',
                // 网单轮询接口1. service_id,  2 store_id, 3 LAST_ORDER_ID 这个是前端已经处理的最大的订单id(order_id)
                webQueryApi       :'/bee/three/waimai/queryNewOrder?SERVICE_ID=',
                // 网单今日订单
                webTodayApi       :'/bee/three/waimai/queryAllTodayOrderByStore?SERVICE_ID=',
                //网单今日退单
                webReturnApi      :'/bee/three/waimai/queryAllTodayReturnOrderByStore?SERVICE_ID=',
                // 详情查询
                webNewQueryApi    :'/bee/store/order/bill/getById?STORE_ORDER.ORDER_ID=',
                
                online: false,
                index: 0,
                render: false,
                loading:false,
                input: false,
                startTime:'',
                configList: [
                {
                  name:'index',isrefresh:false,isRender:true
                },
                {
                  name:'order',isrefresh:true,isRender:false
                },
                {
                  name:'member',isrefresh:true,isRender:false
                },
                {
                  name:'change',isrefresh:true,isRender:false                  
                },
                  //网单
                  {
                    name:'weborder',isrefresh:true,isRender:false                  
                  }
                  //网单
                  
                  ],
                  waitSubmitList:[],
                  errorSubmitList:[],
                  pending: false,
                  displayMes:false,
                  displayCanc:false,
                  storeId:'',
                  storeName:'',
                  serviceId:'',
                  webOrderId:[],
                  webBigId  :0,
                  webToday :'',
                  webNewList:[],
                  webTodayList:[],
                  webReturnList:[],
                  webAllOrderId:[],
                  webTodayReturnList:[],
                  cancelNum:"",
                  allPageNum:'',
                }
              },
              created(){
                var self = this
                self.webTodayQuery()
                self.webReturnQuery()
                self.webIdQuery();
                self.webToday = format.format().substr(0,10)
                if(blueScanEvent){
            // if(typeof globalEvent.addEventListener == 'function'){
              blueScanEvent.listenBlueScan() 
              blueScanEvent.setInputFocus()        
              globalEvent.addEventListener("blueScanInfo", function (e) {
               self.$refs.index.scanEvent(e.info)
             });             
            }      
          },
          mounted(){
            var self = this
            this.render = true;
            storage.getItem('store_info',res=>{
              let val = JSON.parse(res.data)
              self.storeId   = '1048'
            // self.storeId   = val['STORE.STORE_ID']
            self.storeName = val['STORE.STORE_NAME']
            self.serviceId = val['STORE.SERVICE_ID']
            /*
    
                获取登录用户所属门店的收银方式

                */
                stream.fetch({
                  method:'GET',
                  url:self.getPayType+self.storeId
                },res =>{
                  storage.setItem('store_pay_type',JSON.stringify(res.data),res=>{
                    storage.getItem('store_pay_type',res=>{})
                  })
                },res=>{})

            // 读取网单存储的数据
            // storage.getItem(self.storeId + 'web_new_order',res=>{
            //   if(res.result == 'success'){
            //     self.webBigId = JSON.parse(res.data)[0]
                
            //   }
            //   self.webTodayQuery()
            //   self.webReturnQuery()
            //   self.webALLQuery()
            // })

            storage.getItem(self.storeId+'order_list',res =>{
              if(res.result == 'success'){

                self.waitSubmitList = JSON.parse(res.data)

              }
            })
            storage.getItem(self.storeId+'error_order_list',res =>{
              if(res.result == 'success'){

                self.errorSubmitList = JSON.parse(res.data)

              }
            })
            // 获取最大id
            // storage.getItem(self.storeId+'web_new_order',res =>{
            //   if(res.result == 'success'){
            //     self.webBigId = JSON.parse(res.data['ordbig'])
            
            //   }
            // })
            
            storage.getItem(self.storeId + 'work_start_time',res =>{
              if(res.result == 'success' && res.data != 'false'){
                this.startTime = res.data
              }else{
                this.startTime = format.format()
                storage.setItem(self.storeId + 'work_start_time',this.startTime,res =>{})
              }
            })
          })
          },
          computed:{
            count(){
              return this.waitSubmitList.length + this.errorSubmitList.length
            },
            webAllTodayList(){
            // return this.webTodayList
            if(this.webNewList){
              this.webNewList.forEach(ele=>{
                this.webTodayList['SUM'] += parseFloat(ele['STORE_ORDER.SUM_MONEY'])
              })
              this.webNewList.forEach(e=>{
               this.webTodayList.push(e)
              })
               this.webTodayList['TYPE'] = this.webTodayList.length
              return this.webTodayList
            }else{
              return this.webTodayList
            }

          },
          webAllReturnList(){
            let self = this;
            if(self.webNewList){
              self.webNewList.forEach(ele=>{
                if(ele['STORE_ORDER.STATE']== 'WAIT_CANCEL' || ele['STORE_ORDER.STATE']== 'CANCEL'){
                  this.webReturnList.push(ele)
                }
              })

              return this.webReturnList
            }
          },
          webReturnTip(){
          	let self = this;
          	for (var i = 0; i < self.webReturnList.length; i++) {
              if (self.webReturnList[i]['STORE_ORDER.STATE'] === 'WAIT_CANCEL') {
                self.webTodaylist.splice(i, 1);
                return true;
                break
              }
              return false
            }
            
          },
          // webTodayAllList(){
          //   return this.webNewList.concat(this.webTodayList)
          // }
        },
        watch:{
          /*
            此观察者检测的是  就像是订单提交的开关  
            如果从关闭到打开  则触发提交订单的任务
            如果从打开到关闭 则不进行任何操作  因为这个时候提交订单的任务已经结束了 任务处在完成的状态 需要再次启动
            */
            pending(){
              if(this.pending){
                this.submit()
              }

            },
          /*
            此观察者检测的是  改变pending(开关)观察者的状态 判断订单数组是否为空 当数组为空的时候  就把开关关闭  数组不为空的时候把开关打开
            */
            waitSubmitList(){
              if(this.waitSubmitList.length == 0){
                this.pending = false
              }else if(!this.pending){
                this.pending = true
                var self = this
                setTimeout(function(){
                  var ele = self.$refs.pop
                  self.popAnm(1.3,ele)
                },100)

              }
            }
          },
          components: {
            product,
            order,
            weborder,
            member,
            renderTip,
            bigInput,
            dataLoading,
            memberConfirm,
            change,
            userMessage,
            cancelTip
          },
          methods: {
            // 网单轮询接口
            // 网单id查询
            webIdQuery(){
              let self    = this,
              eleme   = [],
              meituan = [],
              cancel  = [],
              done    = [],
              arrlist = [];
              console.log(self.webBigId)
              self.webBigId = '1827'
              stream.fetch({
                method: 'GET',
                url: self.webQueryApi + self.serviceId + '&STORE_ID=' + self.storeId +'&LAST_ORDER_ID=' + self.webBigId,
                type: 'json'
              },res =>{
                // 轮询新订单
                if(res.extraData['NEW_ORDER']){
                  if(res.extraData['NEW_ORDER']['ELEME'].length > 0){
                    // 饿了么新订单
                    eleme   = res.extraData['NEW_ORDER']['ELEME'];
                    eleme.forEach(e=>{
                      arrlist.push(e)
                    })
                 }
                 if(res.extraData['NEW_ORDER']['MEITUAN']){
                    // 美团新订单
                    meituan = res.extraData['NEW_ORDER']['MEITUAN'];
                    meituan.forEach(e=>{
                      arrlist.push(e)
                    })
                    // arrlist.concat(meituan)
                 }
                if(res.extraData['NEW_ORDER']['RETURN']){
                  self.webNewQuery(res.extraData['NEW_ORDER']['RETURN']);
                }
                arrlist.sort(self.sortNum)
                 if(arrlist.length > 0){
                  self.webBigId = arrlist[0];
                  self.webNewQuery(arrlist);
                 }
              };
              // 轮询新订单
              // 轮询取消订单状态
                if(res.extraData['CANCEL']){
                  cancel = res.extraData['CANCEL'];
                  if(cancel.length > 0 && self.webReturnList.length > 0){
                    self.webReturnList.forEach(e=>{
                      if(cancel.indexOf(e['STORE_ORDER.ORDER_ID']) != -1){
                        e['STORE_ORDER.STATE'] = 'CANCEL'
                      }
                    })
                  }
                };

              // 轮询取消订单状态
              // 轮询完结订单状态
              if(res.extraData['DONE']){
                  done = res.extraData['DONE'];
                  if(done.length > 0 && self.webReturnList.length > 0){
                    self.webTodayList.forEach(e=>{
                      if(done.indexOf(e['STORE_ORDER.ORDER_ID']) != -1){
                        e['STORE_ORDER.STATE'] = 'DONE'
                      }
                    })
                  }
                };
              // 轮询完结订单状态
            },res1 =>{
              setTimeout(()=>{
                self.webIdQuery()
              },30000)
            })
            },
            // 网单id查询
            webNewQuery(webOrderId){
              let self = this;
              let webOrderIdCopy = webOrderId.join(',')
              stream.fetch({
                method: 'GET',
                url: self.webNewQueryApi + webOrderIdCopy,
                type: 'json'
              },res =>{
                console.log(res)
                	//退单判断
                	res.extraData['TODAY_ORDER_LIST'].forEach(ele=>{
                		// 等待订单取消
                		if(ele['STORE_ORDER.STATE'] == 'WAIT_CANCEL'){
                			self.webReturnList.unshift(ele)
                			for (var i = 0; i < self.webTodaylist.length; i++) {
                        if (self.webTodaylist[i]['STORE_ORDER.ORDER_ID'] === ele['STORE_ORDER.ORDER_ID']) {
                         self.webTodaylist.splice(i, 1);
                         break;
                       }
                     }
                      self.webTodaylist.unshift(ele);
                    }
                  })
                	if(self.webTodayReturnList.length > 0){
                		self.cancelNum = self.webTodayReturnList.length ;
                		self.displayCanc = true;
                	} 
                  self.webNewList = res.extraData['TODAY_ORDER_LIST']
                  // self.webNewList.concat(self.webTodaylist)
                })
            },
            // 网单轮询接口
            
            // 今日网单查询
            webTodayQuery(){
              let self = this,
                  sum  = 0,
                  type = 0;
              stream.fetch({
                method: 'GET',
                url: self.webTodayApi + self.serviceId + '&STORE_ID=' + self.storeId,
                type: 'json'
              },res =>{
                res.extraData['TODAY_ORDER_LIST'].forEach(ele=>{
                  self.webAllOrderId.push(ele['STORE_ORDER.ORDER_ID'])
                  sum+= parseFloat(ele['STORE_ORDER.SUM_MONEY'])
                })
                if(self.webAllOrderId.length > 0 ){
                  self.webAllOrderId.sort(self.sortNum)
                  self.webBigId   = self.webAllOrderId[0];
                }else{
                  self.webBigId   = 0;
                }
                self.webTodayList = res.extraData['TODAY_ORDER_LIST'];
                self.webTodayList['SUM'] = sum

              })
            },
            // 今日网单查询
            // 今日退单查询
            webReturnQuery(){
              let self = this;
              stream.fetch({
                method: 'GET',
                url: self.webReturnApi + self.serviceId + '&STORE_ID=' + self.storeId,
                type: 'json'
              },res =>{
              	res.extraData['TODAY_ORDER_LIST']
                self.webReturnList = res.extraData['TODAY_ORDER_LIST']
              })
            },
            // 今日退单查询
            // 排序函数
            sortNum(a,b){
              return b - a 
            },
            
            //
            cleanFailedOrder(index){
              this.errorSubmitList.splice(index,1)
              storage.setItem(this.storeId+'error_order_list',JSON.stringify(this.errorSubmitList),r=>{

              })
            },
            goLogin(res){
              if(res == '1'){
                this.displayMes = true
              }else{
                this.displayMes = false
              }              
            },
            popAnm(val,ele){
              var self = this
              if(self.pending || val == 1){
                animation.transition(ele, {
                  styles: {
                    transform: 'scale('+ val +')',
                  },
                  duration: 1500, //ms
                  timingFunction: 'linear',
                  needLayout:false,
                  delay: 0 //ms
                }, function () {
                  if(self.count >= 0 || val != 1){
                    self.popAnm(val == 1.3 ? 1 : 1.3 , ele)
                  }                
                })
              } 
            },
            /*
              页面切换
              */
              switchPage (index){
                var self = this
                if(this.index != index){
                  if(self.configList[index].name){
                    this.index = index;
                    this.move(index);
                    if(self.configList[index].isrefresh || !self.configList[index].isRender) {
                      this.render = true
                      this.$refs[self.configList[index].name].renderData(res => {
                        self.render = false
                        self.configList[index].isRender = true
                      })
                    }
                    if(index == 4){
                      // console.log(this.webTodayList)
                      if(this.webTodayList){
                        this.$refs[self.configList[index].name].getOrder(0)
                        this.$refs[self.configList[index].name].webALLQuery()
                      }
                    }
                  }else{

                    modal.toast({message:'此功能暂时没有开放',duration:1})

                  }
                }            
              },
              move (index) {
                var page = this.$refs.page;
                animation.transition(page, {
                  styles: {
                    transform: 'translateX('+ -index*750 +'px)',
                  },
                duration: 0, //ms
                timingFunction: 'ease',
                needLayout:false,
                delay: 0 //ms
              }, function () {

              })
              },
              renderOver (res){
                this.render = res
                console.log( this.render)
              },
              loadingOver (res){
                this.loading = res
              },
              cancelOrder(res){
                this.displayCanc = res
              },
              refersh (){
                var self = this
                if(typeof blueScanEvent.listenBlueScan == 'function'){
                  blueScanEvent.listenBlueScan()
                }               
                storage.getItem('page_refersh',res =>{
                  if(res.result == 'success' && res.data != 'false'){
                    if(self.index == 0 ){
                      if(res.data == 'clear_cart'){
                        self.$refs[self.configList[self.index].name].cartEvent(-1)
                      }else{
                        self.$refs[self.configList[self.index].name].searchMember()
                      }                                                           
                    }else{
                      self.render = true
                      self.$refs[self.configList[self.index].name].renderData(res => {
                        self.render = false
                      })
                    }
                    storage.setItem('page_refersh','false',res =>{})                  
                  }
                })
                storage.getItem('add_order',res =>{
                  if(res.result == 'success' && res.data != 'false'){
                    console.log(res)
                    self.waitSubmitList.push(JSON.parse(res.data))
                    storage.setItem('add_order','false',res=>{})
                  }
                })
              },
              startInput(){
                this.$refs.input.startInput()
              },
              inputEvent(res){
                this.$refs.index.searchMember(res)
              },
              openMemberConfirm(res){
                this.$refs.confirm.render(res)
              },
              memberData(res){
                this.$refs.index.searchMember(res)
              },
              submit(){
                var self = this            
                function fetch(list){
                  storage.setItem(self.storeId+'order_list',JSON.stringify(list),r=>{
                    console.log(JSON.stringify(list))
                    if(list.length == 0){
                      return
                    }else{                    
                      stream.fetch({
                        method:"POST",
                        url:self.addApi,
                        body:list[0]
                      },res=>{
                        list.shift()
                        return fetch(list)
                      },res=>{
                        if(!res.ok || res.data.code != 0){
                          let obj = list[0]
                          obj['IS_FAILED'] = true
                          self.errorSubmitList.push(obj)
                          list.shift()                        
                          storage.setItem(self.storeId+'error_order_list',JSON.stringify(self.errorSubmitList),r=>{
                            fetch(list)
                          })
                        }                                                                
                      })                                    
                    }
                  })                
                }
                fetch(this.waitSubmitList)
              }

            }
          }
          </script>