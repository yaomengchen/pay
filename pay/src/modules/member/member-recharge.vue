 <!-- 用户充值页面 -->
<template>
  <div class="container">
    <headerBar :title="'会员卡充值'"></headerBar>
    <div class="content">
            <text class="text">普通充值</text>
            <div class="allNum">
                <input class="input" placeholder="￥100.00" @click="clear" v-model="money" type="number" />
                <div class="wrap">
                    <div class="wrapText" @click="change(4, 100)" :style="{'background-image':4==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#fff,#fff)'}">
                        <text class="text" :style="{'color':4==nowIndex?'#fff':'#000'}">100元</text>
                    </div>
                    <div class="wrapTextS" @click="change(5, 500)" :style="{'background-image':5==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#fff,#fff)'}">
                        <text class="text" :style="{'color':5==nowIndex?'#fff':'#000'}">500元</text>
                    </div>
                </div>
                <div class="wrap">
                    <div class="wrapText" @click="change(6, 200)" :style="{'background-image':6==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#fff,#fff)'}">
                        <text class="text" :style="{'color':6==nowIndex?'#fff':'#000'}">200元</text>
                    </div>
                    <div class="wrapTextS" @click="change(7, 1000)" :style="{'background-image':7==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#fff,#fff)'}">
                        <text class="text" :style="{'color':7==nowIndex?'#fff':'#000'}">1000元</text>
                    </div>
                </div>
                <div class="wrap">
                    <div class="wrapText" @click="change(8, 300)" :style="{'background-image':8==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#fff,#fff)'}">
                        <text class="text" :style="{'color':8==nowIndex?'#fff':'#000'}">300元</text>
                    </div>
                    <div class="wrapTextS" @click="change(9, 1500)" :style="{'background-image':9==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#fff,#fff)'}">
                        <text class="text" :style="{'color':9==nowIndex?'#fff':'#000'}">1500元</text>
                    </div>
                </div>
            </div>

         <!--    <div>
                <text class="text" style="margin-bottom:9px;margin-top: 11px;">优惠充值</text>
                <div style="flex-direction:row;">
                    <div v-for="(nums, index) in count" class="discountWrapText" style="margin-right:10px;" @click="toggleClass(nums.discount, nums.money, index)" :style="{'background-image':index==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#fff,#fff)'}">
                          <text class="text" :style="{'color':index==nowIndex?'#fff':'#ef494d'}">{{ nums.num }}</text>
                    </div>
                </div>
            </div> -->

            <div>
                <text class="text" style="margin-bottom:9px;margin-top: 11px;">支付方式</text>
                <div style="flex-direction:row;">
                    <div v-for="(payWay, index) in payWays" class="wrapText" style="margin-right:10px;" @click="togglePayWay(payWay.way, index)" :style="{'background-image':index==nowPayWay?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#fff,#fff)'}">
                          <text class="text" :style="{'color':index==nowPayWay?'#fff':'#ef494d'}">{{ payWay.way }}</text>
                    </div>
                </div>
            </div>
            <!--新的支付方式模块-->
    </div>
    <div class="foot" >
      <div class="wrapFoot" >
        <text class="stext">会员: {{member['MEMBER.NAME']}} ({{ member['MEMBER.PHONE'] }})</text>  
      </div>
      <div class="wrapFoot" >
        <div style="flex-direction:row;">
          <div style="align-items: flex-end">
            <text class="stext">充值前 ：</text>
            <text class="stext">本次充值 ：</text>
            <text class="stext">赠送 ：</text>
            <text class="stext">充值后 ：</text>
          </div>
          <div>
            <text class="stext">￥{{ beforeMoney }}</text>
            <text class="stext">￥{{ money || '0.00'}}</text>
            <text class="stext">￥{{ discount }}</text>
            <text class="red-text">￥{{ total }}</text>
          </div>
        </div>
        <div class="btn-bottom" @click="getToAccounts">
          <text class="text" style="color:#fff;" >确定</text>
        </div>
      </div>
    </div>
    <renderTip :render="loading"></renderTip>
  </div>
</template>
<script>
  const modal = weex.requireModule('modal')
  const storage = weex.requireModule('storage')
  import navigator from "../../common/navigator.js"
  import icons from "../../assets/icon.js"
  import stream from "../../common/stream.js"
  const payIcons = icons.payIcons
  import headerBar from "../../components/header-back.vue"
  import renderTip from "../../components/render-tip.vue"
  export default {
    data () {
      return {
          bankIcon: payIcons.banckIcon,
          cashIcon: payIcons.cashIcon,
          aliIcon: payIcons.aliPayIcon,
          weixinIcon: payIcons.weixinIcon,
          count: [
            // { money: 100, discount: 20, num: "充100送20" },
            // { money: 300, discount: 50, num: "充300送50" },
            // { money: 500, discount: 100, num: "充500送100" },
            // { money: 1000, discount: 300, num: "充1000送300" },
          ],
          payWays: [
            { way: '现金'},
            { way: '支付宝'},
            { way: '微信支付'},
            { way: '银行卡'}
          ],
          nowIndex: -1,
          nowNum: 0,
          money: '',
          nowPayWay: 0,
          
          //这里设置的是支付方式 payWay 
          payWay: 'CASH_PAY',
          discount: '0.00',
          rechargeApi:'/member/card/recharge',
          beforeMoney:'0.00',
          user:{},
          member:{},
          loading: false,
          storeId:''
      }
    },
    computed: {
      total () {
        return  (Number(this.money) + Number(this.discount) + Number(this.beforeMoney)).toFixed(2);
      },
      recharge () {
        return (Number(this.money) + Number(this.discount)).toFixed(2)
      }
    },

    mounted () {

      var self = this
      var bundleUrl = self.$getConfig().bundleUrl
      self.loading = true
      stream.fetch({
        method:'GET',
        url:'/member/card/getDetail?MEMB_CARD.MEMB_CARD_ID=' + self.getDataByUrl('id',bundleUrl)
      }, res=>{
        self.user = res.extraData['INFO']['MEMB_CARD']
        self.member = res.extraData['INFO']['MEMBER']
        self.beforeMoney = Number(res.extraData['INFO']['MEMB_CARD']['MEMB_CARD.USABLE_MONEY']).toFixed(2)     
          
      },()=>{
        self.loading = false
      })
      storage.getItem('store_info',res=>{
        self.storeId = JSON.parse(res.data)['STORE.STORE_ID']
      })
    },
    components: {
      headerBar,
      renderTip
    },
    methods: {
        toggleClass ( discount, money, index ) {
            this.money = money.toFixed(2);
            this.nowIndex = index;
            this.discount = discount.toFixed(2);
        },
        getDataByUrl: function (name, url) {
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url); 
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        togglePayWay ( way, index ) {
            this.nowPayWay = index;
            switch ( way )
            {
              case '银行卡':
                this.payWay = 'BANK_CARD_PAY'
                break;
              case '现金':
                this.payWay = 'CASH_PAY' 
                break;
              case '支付宝':
                this.payWay = 'ALI_PAY' 
                break;
              case '微信支付':
                this.payWay = 'WX_PAY'
                break;
              default:
                break;
            }
            // modal.alert({
            //   message: this.payWay

            // })
            
        },
        change ( index, money ) {
            this.nowIndex = index;
            this.discount = '0.00';
            this.money = money.toFixed(2);
        },
        clear () {
            this.nowIndex = 10000;
            this.discount = '0.00';
        },
        getToAccounts () {
          
            let $this = this           
            modal.confirm({
              message: '本次充值' + $this.recharge + '元',
              okTitle: '确定',
              cancelTitle: '取消'
            }, function ( value ) {
              if ( value == '确定') {
                $this.loading = true 
                const money = parseFloat($this.money)
                const cardId = parseInt($this.user['MEMB_CARD.MEMB_CARD_ID'])
                const moneyWay = $this.payWay
                stream.fetch({
                  method:'POST',
                  url:$this.rechargeApi,
                  body: {
                      'MONEY': money,
                      'TARGET_ID': cardId,
                      'PAY_WAY': moneyWay,
                    }
                },res=>{
                  var obj = {}
                  storage.setItem('page_refersh','true', res=>{
                    storage.getItem($this.storeId+'account_data',ret =>{
                      if(ret.result == 'success'){
                        obj = JSON.parse(ret.data)
                      }
                      if(obj[moneyWay]){
                        obj[moneyWay].recharge += money/1
                      }else{
                        obj[moneyWay] = {
                          pay:0,
                          recharge: money/1,
                          return: 0
                        }
                      }
                      storage.setItem($this.storeId+'account_data',JSON.stringify(obj),res=>{
                        modal.alert({message:'充值成功'},res=>{
                          navigator.pop({
                            'animated': "false"
                          })
                        }) 
                      })
                    })                                       
                  })
                },()=>{
                  $this.loading = false
                })               
              }
            })           
        }
    }
  }
</script>
<style scoped lang="sass">
  $rate:0.732;
  .btn-bottom {
    
    height: 50px*$rate;
    width: 122px*$rate;
    background-image: linear-gradient(left, #e71b2d, #f36670);
    border-radius: 99;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .wrapFoot {
    margin-right: 63px*$rate;
    margin-left: 30px*$rate;
    margin-top: 23px*$rate;
    align-items: center;
  }
  .foot {
    height: 244px*$rate;
    margin-left: 9*$rate;
    margin-right: 9*$rate;
    margin-bottom: 9*$rate;
    background-color: #fff;
    border-top-width: 1px*$rate;
    border-top-color: #aeaeae;
    border-top-style: solid;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  .container {
    background-color: #eee;
  }
  .content {
    margin-top: 9*$rate;
    margin-left: 9*$rate;
    margin-right: 9*$rate;
    flex:1;
    background-color: #fff;
    border-top-left-radius: 5px*$rate;
    border-top-right-radius: 5px*$rate;
    padding: 19px*$rate;

  }
  .stext {
    font-size: round(15px*$rate);
    margin-bottom: 17px*$rate;
  }
  .text {
    font-size: round(16px*$rate);
  }
  .red-text {
    font-size: round(15px*$rate);
    color: #ef494d;
  }
  .allNum {
    margin-top: 14px*$rate;
    flex-direction: row;
    margin-bottom: 14px*$rate;
  }
  .input {
    border-style: solid;
    border-width: .5px*$rate;
    /*border-color: #ef494d;*/
    border-color: #aeaeae;
    /*width: 356px*$rate;
    height: 117px*$rate;*/
    height: 95*$rate;
        width: 410*$rate;
    border-radius: 5px*$rate;
    padding-left: 135px*$rate;
  }
  .wrap {
    flex-direction: column;
    margin-left: 14px*$rate;
  }
  .discountWrapText {
    padding-top: 10px*$rate;
    padding-bottom: 10px*$rate;
    padding-left: 20px*$rate;
    padding-right: 20px*$rate;
    justify-content: center;
    align-items: center;
    border-width: .5*$rate;
        border-style: solid;
        border-color: #aeaeae;
    border-radius: 5px*$rate;
    margin-bottom: 14px*$rate;
  }
  .wrapText {
    width: 122px*$rate;
    height: 39px*$rate;
    justify-content: center;
    align-items: center;
    /*border-style: solid;
    border-width: 1px*$rate;
    border-color: #ef494d;*/
    border-width: .5*$rate;
    border-style: solid;
    border-color: #aeaeae;

    border-radius: 5px*$rate;
    margin-bottom: 14px*$rate;
  }
  .wrapTextS {
    width: 122px*$rate;
    height: 39px*$rate;
    justify-content: center;
    align-items: center;
    /*border-style: solid;
    border-width: 1px*$rate;
    border-color: #ef494d;*/
    border-width: .5*$rate;
        border-style: solid;
        border-color: #aeaeae;
    
    border-radius: 5px*$rate;
  }
  .img {
    width: 40px*$rate;
    height: 40px*$rate;
  }
  .pay-way {
    width: 80px*$rate;
    height: 80px*$rate;
    justify-content: center;
    align-items: center;
    background-color: #e7e7e7;
    margin-right: 12px*$rate;
  }
</style>