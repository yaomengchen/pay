<!-- 会员详情界面 -->
<template>
  <div class="container" @viewappear="appear">
  <headerBar :title="'会员卡详情'"></headerBar>
  <div class="content">
    <div class="mainMessage">
      <div class="userName">
        <image :src="userIcon" class="img"></image>
        <div>
          <text class="text" style="margin-left:12px;">{{ basicMessage['MEMB_CARD.MEMB_CODE'] }}</text>
        </div>
      </div>
      <div class="userRemain">
        <div>
          <text class="redText">¥{{ basicMessage["MEMB_CARD.USABLE_MONEY"]}}</text>
          <text class="text" style="margin-top: 7px">卡余额</text>
        </div>
      </div>
      <div class="userCard">
        <div>
          <text class="redText">{{ Math.floor(basicMessage["MEMB_CARD.USABLE_POINT"]) }}</text>
          <text class="text" style="margin-top: 7px">卡积分</text>
        </div>
      </div>
    </div>
    <div style="flex:1">
      <div class="moreMessage">
        <div class="moreLeft" >
          <div class="spaceA" >
            <div class="wrapText">
              <text class="text">姓 名</text>
            </div>
            <div class="wrapText">
              <text class="text">手 机</text>
            </div>
            <div class="wrapText">
              <text class="text">性 别</text>
            </div>
            <div class="wrapText">
              <text class="text">生 日</text>
            </div>
            <div class="wrapText">
              <text class="text">住 址</text>
            </div>
            <div class="greyBtn"  @click="change">
              <text class="text">编辑信息</text>
            </div>
          </div>
          <div class="spaceC" >
            <div class="wrapText">
              <text class="text">{{ user["MEMBER.NAME"] }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ user["MEMBER.PHONE"] }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ user["MEMBER.GENDER"] == 'MAN'? '男':'女' }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ user["MEMBER.BIRTHDAY"] }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ user["MEMBER.ADDR_GUO"] }}{{ user["MEMBER.ADDR_SHENG"] }}{{ user["MEMBER.ADDR_SHI"] }}{{ user["MEMBER.ADDR_XIAN"] }}{{ user["MEMBER.ADDR_DETAIL"]}} </text>
            </div>
          </div>
        </div>
        <div class="moreRight">
          <div class="spaceA">
            <div class="wrapText">
              <text class="text">卡类型</text>
            </div>
            <div class="wrapText">
              <text class="text">消费积分比</text>
            </div>
            <div class="wrapText">
              <text class="text">充值积分比</text>
            </div>
            <div class="wrapText">
              <text class="text">自动升级</text>
            </div>
            <div class="wrapText">
              <text class="text">升级积分</text>
            </div>
            <div class="wrapText">
              <text class="text">所属门店</text>
            </div>
            <div class="wrapText">
              <text class="text">服务人员</text>
            </div>
            <div class="wrapText">
              <text class="text">开卡日期</text>
            </div>
          </div>
          <div class="spaceB">
            <div class="wrapText">
              <text class="text">{{ cardType['MEMB_CARD_TYPE.NAME'] }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ cardType['MEMB_CARD_TYPE.CONSUME_POINT_RATIO'] }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ cardType['MEMB_CARD_TYPE.RECHARGE_POINT_RATIO'] }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ cardType['MEMB_CARD_TYPE.IS_UPGRADE_AUTO'] == -1 ? '否':'是' }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ (cardType['MEMB_CARD_TYPE.IS_UPGRADE_AUTO'] == -1) ? '无' : cardType["MEMB_CARD_TYPE.UPGRADE_POINT"]  }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ basicMessage["MEMB_CARD.STORE_ID"] }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ basicMessage["MEMB_CARD.SALEMAN_NAME"] }}</text>
            </div>
            <div class="wrapText">
              <text class="text">{{ basicMessage["MEMB_CARD.OPEN_DATETIME"] }}</text>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="foot">
      <div class="flex-row">
        <!-- <div class="wrap-btn" @click="destoryCard(basicMessage)">
          <text class="btn1">销卡</text>
        </div>
        <div class="wrap-btn" @click="switchCard">
          <text class="btn1">换卡</text>
        </div>
        <div class="wrap-btn" @click="disallow" >
          <text class="btn1">{{ cardState ? cardState : ( basicMessage['MEMB_CARD.STATE'] == 'HAVE_OPEN' ? '禁用' : '取消禁用') }}</text>
        </div> -->
      </div>
      <div class="wrap-btn1" @click="rechage" >
        <text class="btn2">充值</text>
      </div>
    </div>
    
  </div>
  <renderTip :render="render"></renderTip>
  </div>
</template>
<script>
  import icons from "../../assets/icon.js"
  import stream from "../../common/stream.js"
  import headerBar from "../../components/header-back.vue"
  import navigator from "../../common/navigator.js"
  import renderTip from "../../components/render-tip.vue"
  const modal = weex.requireModule('modal');
  const storage = weex.requireModule('storage');
  const searchBarIcons = icons.searchBarIcons;
  const userCardIcon = icons.commonIcons
  export default {
    data () {
      return {
          userIcon: userCardIcon.userCardIcon,
          discount: '',
          cardState: '',
          state: '',
          buyer:{},
          setApi:'/member/card/modifyById',
          render: false
      }
    },
    components: {
        headerBar,
        renderTip
    },
    computed: {
        user () {
          return this.buyer['INFO'] ? this.buyer['INFO']['MEMBER'] : ''
        },
        cardType () {
          return this.buyer['INFO'] ? this.buyer['INFO']['MEMB_CARD_TYPE'] : ''
        },
        basicMessage () {
          return this.buyer['INFO'] ? this.buyer['INFO']['MEMB_CARD'] : ''
        }
    },

    mounted () {

      var self = this
      var bundleUrl = self.$getConfig().bundleUrl
      self.render = true
      stream.fetch({
        method:'GET',
        url:'/member/card/getDetail?MEMB_CARD.MEMB_CARD_ID=' + self.getDataByUrl('id',bundleUrl)
        // url:'/member/card/getDetail?MEMB_CARD.MEMB_CARD_ID=62'
      }, res=>{
        self.buyer = res.extraData
        const state = res.extraData.INFO.MEMB_CARD['MEMB_CARD.STATE']
        if ( state == 'FORBID') {
           self.state = '0' 
           // 0 代表卡是禁用状态，可能需要触发激活卡状态
         } else {
           self.state = '1'
           // 1 表示卡是激活状态，可能需要触发禁用卡的状态
         }
      },res=>{
        self.render = false
      })                
    },
    methods: {
      rechage(){
        var self = this
        navigator.push({
            'url': '/modules/member/member-recharge',
            'query':'?id='+self.basicMessage['MEMB_CARD.MEMB_CARD_ID'],
            'animated': "false"
        }, function(e){
            
        })
      },
      appear(){
        var self = this
        storage.getItem('page_refersh',res =>{
          if(res.result == 'success' && res.data == 'true'){
              var bundleUrl = self.$getConfig().bundleUrl
              stream.fetch({
                method:'GET',
                url:'/member/card/getDetail?MEMB_CARD.MEMB_CARD_ID=' + self.getDataByUrl('id',bundleUrl)
                // url:'/member/card/getDetail?MEMB_CARD.MEMB_CARD_ID=62'
              }, res=>{
                self.buyer = res.extraData
              })
          }
        })
        
      },
      getDiscount () {
        const discount = this.cardType['MEMB_CARD_TYPE.NAME']
        
      },
      getDataByUrl: function (name, url) {
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url); 
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
      },
      change () {
        let $this = this
        if  ( $this.state == '0' ) {
            modal.alert({
              message: '该会员卡已经被禁用，不能编辑！'
            })
        } else {
          // let $this = this
          const temp = {
            'MEMB_CARD.MEMB_CODE': $this.basicMessage['MEMB_CARD.MEMB_CODE'],
            'MEMBER.PHONE': $this.user['MEMBER.PHONE'],
            'MEMB_CARD.MEMB_CARD_ID': $this.basicMessage['MEMB_CARD.MEMB_CARD_ID'],
            'MEMBER.NAME': $this.user['MEMBER.NAME'],
            'MEMBER.BIRTHDAY': $this.user['MEMBER.BIRTHDAY'],
          }
          $this.$store.commit('BUYER_CHANGE', { buyer: temp })

          const options = {
                      'province': $this.user["MEMBER.ADDR_SHENG"], 
                      'city': $this.user["MEMBER.ADDR_SHI"],
                      'district': $this.user["MEMBER.ADDR_XIAN"],
                      'detail': $this.user["MEMBER.ADDR_DETAIL"],
                  }
          
          $this.$store.commit('BUYER_ADDR_CHANGE', { buyerAddr: options })

          $this.$router.push({
              path: '/member/updateMessage',
          });
          modal.alert({
            message:'温馨提示：您接下来的修改提交将对所有该会员下的会员卡生效'
          })
          }
        
        
      },
      switchCard () {

        const message = {
          'MEMB_CARD.MEMB_CARD_ID': this.basicMessage['MEMB_CARD.MEMB_CARD_ID'],
          'MEMB_CARD.TYPE_ID': this.basicMessage['MEMB_CARD.TYPE_ID']
        }
        this.$store.commit('CARD_FIX', {cardMessage: message})
        this.$store.commit('OPEN_MODAL',{
            modalType:'changeCard',
            openFlag:true,
        })
    
      },
      disallow () {
        // 根据state判断当前执行禁用卡的操作还是激活卡的操作
        let $this = this;
        if  ( $this.state == '1' ) {
          $this.state = '0'
          modal.confirm({
          message: '确认禁用?',
          okTitle: '确定',
          cancelTitle: '取消',
          }, function (value) {
              if ( value == '确定') {
                $this.cardState = '取消禁用'
                $this.$store.dispatch('USER_GET').then(res => {     
                  const state = 'FORBID'    
                  const code =  $this.basicMessage['MEMB_CARD.MEMB_CARD_ID']
                  const membCode = $this.basicMessage['MEMB_CARD.MEMB_CODE']
                  const typeId = $this.basicMessage['MEMB_CARD.TYPE_ID']

                  const token = res["data"]["extraData"]["bubuId"]
                  const options = {
                    headers:{
                      token,
                      "Access-Control-Allow-Origin" : "*",
                      'Content-Type':'application/x-www-form-urlencoded',
                    },
                    body: {
                      'MEMB_CARD.MEMB_CARD_ID': code,
                      'MEMB_CARD.MEMB_CODE': membCode,
                      'MEMB_CARD.TYPE_ID': typeId,
                      'MEMB_CARD.STATE': state,
                    }
                  }
                  $this.$store.dispatch('BUYER_UPDATE', options).then(res => {

                  })
                })
                
              }
          })
        } else {
          modal.confirm({
          message: '确认取消禁用?',
          okTitle: '确定',
          cancelTitle: '取消',
          }, function (value) {
              if ( value == '确定') {
                $this.cardState = '禁用'
                $this.state = '1'
                $this.$store.dispatch('USER_GET').then(res => {     
                  const state = 'HAVE_OPEN' 
                  const code =  $this.basicMessage['MEMB_CARD.MEMB_CARD_ID']
                  const membCode = $this.basicMessage['MEMB_CARD.MEMB_CODE']
                  const typeId = $this.basicMessage['MEMB_CARD.TYPE_ID']

                  const token = res["data"]["extraData"]["bubuId"]
                  const options = {
                    headers:{
                      token,
                      "Access-Control-Allow-Origin" : "*",
                      'Content-Type':'application/x-www-form-urlencoded',
                    },
                    body: {
                      'MEMB_CARD.MEMB_CARD_ID': code,
                      'MEMB_CARD.MEMB_CODE': membCode,
                      'MEMB_CARD.TYPE_ID': typeId,
                      'MEMB_CARD.STATE': state,
                    }
                  }
                  $this.$store.dispatch('BUYER_UPDATE', options).then(res => {

                  })
                })
                
              }
          })
        }

        

      },
      destoryCard ( basicMessage ) {
        var self = this
        modal.confirm({
          message: '确认销卡?',
          okTitle: '确定',
          cancelTitle: '取消',
          }, function (value) {
              if ( value == '确定') {
                stream.fetch({
                  method: 'POST',
                  url: self.setApi,
                  body: {
                        'MEMB_CARD.MEMB_CARD_ID': basicMessage['MEMB_CARD.MEMB_CARD_ID'],
                        'MEMB_CARD.MEMB_CODE': basicMessage['MEMB_CARD.MEMB_CODE'],
                        'MEMB_CARD.TYPE_ID': basicMessage['MEMB_CARD.TYPE_ID'],
                        'MEMB_CARD.STATE': 'DELETE',
                      }
                }, res => {
                  modal.alert({message:'销卡成功'})
                })     
              }
          })
          
      }
    }
  }
</script>
<style scoped lang="sass">
 $rate:0.732;
  .container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .greyBtn {
    padding: 9px*$rate;
    background-color: #aeaeae;
    border-radius: 3px*$rate;
    background-image: linear-gradient(to bottom right,#EFEFEF,#F9F9F9)
  }
  .content {
    background-color: #eee;
    flex:1;
  }
  .text {
    font-size: 16px*$rate;
  }
  .redText {
    font-size: 22px*$rate;
    color: #ef494d;
  }
  .mainMessage {
     margin: 9.8px*$rate;
     background-color: #fff;
     border-radius: 5px*$rate;
     height: 135.5px*$rate;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;

  }
  .img {
    width: 45px*$rate;
    height: 35px*$rate;
  }
  .userName {
    flex:1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /*width: 193px;*/
    height: 52px*$rate;
  }
  .userRemain {
    flex:1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /*width: 326.5px;*/
    height: 52px*$rate;
    border-right-color: #d8d8d8;
    border-right-style: solid;
    border-right-width: 1px*$rate;
    border-left-color: #d8d8d8;
    border-left-style: solid;
    border-left-width: 1px*$rate;
  }
  .userCard {
    flex:1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /*width: 193px;*/
    height: 52px*$rate;
  }

  .moreMessage {
    /*height: 251px*$rate;*/
    background-color: #fff;
    margin-left: 9.8px*$rate;
    margin-right: 9.8px*$rate;
    border-radius: 5px*$rate;
    /*display: flex;*/
    flex-direction: row;
  }
  .moreLeft {
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    border-right-width: 1px*$rate;
    border-right-style: solid;
    border-right-color: #d8d8d8;
  }
  .moreRight {
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .spaceA {
    margin-top: 24.5px*$rate;
    margin-left: 54px*$rate;
  }
  .wrapText {
    height: 22px*$rate;
    margin-bottom: 20px*$rate;
  }
  .spaceB {
    margin-top: 24.5px*$rate;
    margin-left: 30px*$rate;
  }
  .spaceC {
    margin-top: 24.5px*$rate;
  }
  .foot {
    height: 78px*$rate;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 750;
    padding-left: 30*$rate;
    padding-right: 30*$rate;
    background-color: #fff;
  }
  .btn1 {
    font-size: 16px*$rate;
    color: #f8797e;
  }
  .btn2 {
    font-size: 16px*$rate;
    color: #fff;
  }
  .wrap-btn {
    width: 97.65px*$rate;
    height: 50px*$rate;
    border-radius: 99px;
    margin-right: 7px*$rate;
    align-items: center;
    justify-content: center;
    border-style: solid;
    border-width: 1px*$rate;
    border-color: #f25a5f;
  }
  .wrap-btn1 {
    width: 97.65px*$rate;
    height: 50px*$rate;
    border-radius: 99px;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(to bottom right,#EF494D,#F98085);
  }
  .flex-row{
    flex-direction: row;
  }
</style>