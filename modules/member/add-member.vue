<template>
    <div class="wrapper">
        <headerBar :title="'开新卡'"></headerBar>
        <div class="wrap-scroller">
            <scroller class="content" show-scrollbar="false">
            <div class="wrap-content">
                <div class="userMessage">
                    <div class="wrapText">
                        <text class="text">手</text>
                        <text class="text">机</text>
                        <text class="text">号</text>
                    </div>
                    <div class="passKey">
                        <input id="input" ref="input2" class="specialInput" placeholder="请输入手机号" v-model="userPhone"/>
                        <div class="grapSpecialText" @click="getPassKeyWithCoolDown">
                            <text class="specialText" :class="[identifyingCodeGetCoolDown > 0 ? 'cantGetSpecialText' : '']">{{identifyingCodeGetState}}</text>
                        </div>
                    </div>
                </div>
                <div class="userMessage">
                    <div class="wrapText">
                        <text class="text">验</text>
                        <text class="text">证</text>
                        <text class="text">码</text>
                    </div>
                    <input id="input"  class="input" placeholder="请输入验证码" v-model="smsCode" />
                </div>
                <div class="rest" >
                    <div class="userMessage">
                        <div class="wrapText">
                            <text class="text">卡</text>
                            <text class="text">类</text>
                            <text class="text">型</text>
                        </div>
                        <div class="cardType">
                            <div class="card" v-for="(level, index) in type" @click="toggleClass(level, index)" :style="{'background-image':index==nowIndex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#FFF,#FFF)'}">
                                <text class="cardText" :style="{'color':index==nowIndex?'#fff':'#ef494d'}">{{ level['MEMB_CARD_TYPE.NAME'] }}</text>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="userMessage">
                    <div class="wrapText">
                        <text class="text">卡</text>
                        <text class="text">号</text>
                    </div>
                    <input id="input1" class="input" placeholder="请输入卡号" v-model="userCard"/>
                </div>
                <div class="userMessage">
                    <div class="wrapText">
                        <text class="text">姓</text>
                        <text class="text">名</text>
                    </div>
                    <input id="input"  class="input" ref="input" placeholder="请输入姓名" @focus='effectNameTypeIn' v-model="userName"/>
                </div>
                <div class="sexList">
                    <div class="wrapText">
                        <text class="text">性</text>
                        <text class="text">别</text>
                    </div>
                    <div class="sexDropList">
                        <div class="man" @click="chooseSex(0)" :style="{'background-image':'MAN'==nowSex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#FFF,#FFF)'}">
                            <text class="cardText" :style="{'color':'MAN'==nowSex?'#fff':'#ef494d'}">男</text>
                        </div>
                        <div class="woman" @click="chooseSex(1)" :style="{'background-image':'WOMAN'==nowSex?'linear-gradient(to bottom right,#EF494D,#F98085)':'linear-gradient(to bottom right,#FFF,#FFF)'}">
                            <text class="cardText" :style="{'color':'WOMAN'==nowSex?'#fff':'#ef494d'}">女</text>
                        </div>
                    </div>
                    <!-- <div class="more" @click="showMore" v-if="show">
                        <text class="moreText">添加更多</text>
                        <image :src="imgIcon" class="img"></image>
                    </div> -->
                </div>
                <div class="userMessage">
                    <div class="wrapText">
                        <text class="text">生</text>
                        <text class="text">日</text>
                    </div>
                    <input id="input"  class="input" type="number" ref="input" placeholder="年月日 如:19980101" v-model="birth"/>
                </div>
                <!-- 以下是用户点击显示更多之后才会显示的部分 -->
                
                <div class="foot"></div>
            </div>
        </scroller>
        <div class="footer">
            <div class="cAnds"  @click="cancel">
                <text class="cardText" >取消</text>
            </div>
            <div class="cAnds" @click="save">
                <text class="cardText" >保存</text>
            </div>
            <div class="saveAndMore" @click="save">
                <text class="whiteText">保存并去充值</text>
            </div>
        </div>
        </div>
        <address :show="showAddress" @event="addressEvent"></address>
        <renderTip :render="render"></renderTip>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.732;
    $set:0.3662;
    .wrapper{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .foot {
        height: 195px*$rate;
    }
    .container {
        flex-direction: column;
        justify-content: center;
        align-items: center;

    }
    .wrap-content {
        flex:1;
        margin-top: 41px*$rate;
        flex-direction: column;
        justify-content: flex-start;

    }
    .userMessage {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 20px*$rate;
        border-radius: 3px*$rate;
    }
    .wrapText {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 60px*$rate;
    }
    .text {
        font-size: round(16px*$rate);
        /*font-size: round(15.62px*$rate;*)/*/
    }
    .input {
        color: #999999;
        width: 340px*$rate;
        height: 40px*$rate;
        font-size: round(15px*$rate);
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        padding-left: 18px*$rate;
        margin-left: 18px*$rate;
        border-radius: 3px*$rate;
    }
    .specialInput {
        color: #999999;
        width: 239px*$rate;
        height: 40px*$rate;
        font-size: round(15px*$rate);
        padding-left: 18px*$rate;
        border-radius: 3px*$rate;
        
    }
    .passKey {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        width: 340px*$rate;
        border-radius: 3px*$rate;
        margin-left: 18px*$rate;
    }
    .grapSpecialText {
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        width: 101px*$rate;
        height: 40px*$rate;
        padding-left: 4.88;
        padding-right: 4.88;
        /*background-color: lightblue;*/
    }
    .specialText {
        font-size: round(15px*$rate);
        color: #f25a5f;
    }
    .cantGetSpecialText {
        color:#999999;
    }
    .sexList {
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
        margin-bottom: 20px*$rate;
    }
    .sexDropList {
        width: 340px*$rate;
        height: 40px*$rate;
        border-radius: 3px*$rate;
        margin-left: 18px*$rate;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .man {
        width: 165px*$rate;
        height: 40px*$rate;
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        border-radius: 3px*$rate;
        align-items: center;
        justify-content: center;
    }
    .woman {
        width: 165px*$rate;
        height: 40px*$rate;
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        border-radius: 3px*$rate;
        align-items: center;
        justify-content: center;
    }
    .more {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-left: 10px*$rate;
        height: 40px*$rate;
    }
    .img {
        width: 11px*$rate;
        height: 6px*$rate;
    }
    .moreText {
        font-size: round(16*$rate);
        color: #f25a5f;
    }
    .greyText {
        font-size: round(16*$rate);
        color: #999999;
    }
    .mainLocation {
        margin-left: 18px*$rate;
        width: 165px*$rate;
        height: 40px*$rate;
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        padding-left: 18px*$rate;
        margin-left: 18px*$rate;
        border-radius: 3px*$rate;
        justify-content: center;
    }
    .detailLocation {
        width: 165px*$rate;
        height: 40px*$rate;
        font-size: round(15px*$rate);
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        padding-left: 18px*$rate;
        margin-left: 10px*$rate;
        border-radius: 3px*$rate;
        color: #aeaeae;
    }
    .cardType {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-left: 18px*$rate;
    }

    .card {
        width: 98px*$rate;
        height: 35px*$rate;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-right: 9px*$rate;
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        border-radius: 3px*$rate;
    }
    .cardText {
        font-size: round(16px*$rate);
        color: #ef494d;
    }
    .clicked {
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
    }

    .userDiscount {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-left: 18px*$rate;
    }
    .specialDiscount {
        width: 118px*$rate;
        height: 35px*$rate;
        font-size: round(13px*$rate);
        border-style: solid;
        border-color: #B1B1B1;
        border-width: 1px*$rate;
        border-radius: 3px*$rate;
        margin-right: 7px*$rate;
        padding-left: 18px*$rate;
    }
    .discount {
        width: 48px*$rate;
        height: 39px*$rate;
        border-color: #ef494d;
        border-width: 1px*$rate;
        border-radius: 3px*$rate;
        justify-content: center;
        align-items: center;
        margin-right: 7.3px*$rate;
    }
    /*以上是basicmessage部分的样式*/
    .wrap-scroller {
        background-color: #fff;
        flex-direction: column;
        justify-content: flex-end;
        position: absolute;
        top: 148*$set;
        left: 20*$set;
        right: 20*$set;
        bottom: 20*$set;
    }
    .wrapper {
        /*flex-direction: column;*/
        background-color: #f7f7f7;
    }
    .content {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 87px*$rate;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
    }
    .tt {
        margin-bottom: 12px*$rate;
    }
    .footer {
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        background-color: #fff;
        border-top-color: #aeaeae;
        border-top-width: 1px*$rate;
        border-top-style: solid;
        height: 87px*$rate;
        margin-left: 9;
        margin-right: 9;
        margin-bottom: 9;
    }
    .cAnds {
        width: 98px*$rate;
        height: 59px*$rate;
        border-color: #ef494d;
        border-width: 1px*$rate;
        border-radius: 99px;
        margin-right: 7px*$rate;
        justify-content: center;
        align-items: center;
    }
    .saveAndMore {
        justify-content: center;
        align-items: center;
        width: 146px*$rate;
        height: 59px*$rate;
        background-image: linear-gradient(left, #e71b2d, #f36670);
        border-radius: 99px;
    }
    .cardText {
        font-size: round(16px*$rate);
        color: #ef494d;
    }
    .whiteText {
        font-size: round(16px*$rate);
        color: #fff;
    }
</style>
<script>
    const modal = weex.requireModule('modal')
    const picker = weex.requireModule('picker')
    const storage = weex.requireModule('storage')
    import headerBar from "../../components/header-back.vue"
    import address from "../../components/address.vue"
    import stream from "../../common/stream.js"
    import renderTip from "../../components/render-tip.vue"
    import navigator from "../../common/navigator.js"
    export default {
        data () {
            return {
                nowCount: 95,
                nowCardType: '',
                nowIndex: 0,
                nowSex: 'MAN',
                userPhone: '',
                smsCode: '',
                userCard: '',
                userName: '',
                // userLocation: '省 市 县',
                locationDetail: '',
                shopAddress: '',
                manager:'',
                birth: '',
                identifyingCodeGetCoolDown:0,
                identifyingCodeGetState:'获取验证码',
                hasRegister:false,
                locate:{},
                type:[],
                getTypeApi:'/member/card/type/queryAll',
                addApi:'/member/card/add',

                getMember:'/member/card/getDetail',
                showAddress: false,
                render:false
            }
        },
        components: {
            headerBar,
            address,
            renderTip
        },
        mounted () {
            let self = this
            stream.fetch({
                method: 'GET',
                url: self.getTypeApi
            }, res=>{
                self.type = res.data
                this.nowCardType = self.type[this.nowIndex]['MEMB_CARD_TYPE.TYPE_ID']
            })
            storage.getItem('userInfo',function(res){
                if(res.result == 'success' && res.data){
                    self.manager = JSON.parse(res.data)['USER.NAME']
                }
            })
        },
        computed: {
            // type () {
            //     return this.$store.state.buyerCard.cardType
            // },
            // detail () {
            //     return this.$store.state.buyer.buyer
            // },
            // locate () {
            //     return this.$store.state.buyer.buyerAddr
            // }
        },
        methods: {
            effectNameTypeIn (event) {
                if(this.hasRegister){
                    modal.alert({
                        message:'该手机号已注册过会员，会员姓名不可更改'
                    })
                    this.$refs.input.blur()
                }
                
            },
            detailAddrModifiedCheck (event) {
                if(this.hasRegister){
                    modal.alert({
                        message:'该手机号已注册过会员，会员地址不可更改'
                    })
                    this.$refs.detailAddr.blur()
                }
            },
            waitGetCodeColdown () {
                let $this = this
                let cooldown = 0
                if(this.identifyingCodeGetCoolDown == 0) {
                    this.identifyingCodeGetCoolDown = 60
                }
                this.identifyingCodeGetCoolDown-- 
                cooldown = this.identifyingCodeGetCoolDown 
                this.identifyingCodeGetState = `重新获取(${cooldown}s)`
                cooldown > 0 ? setTimeout(this.waitGetCodeColdown.bind($this), 1000) : this.identifyingCodeGetState = '获取验证码'
            },
            getPassKey () {
                // 获取验证码操作,同时进行查询号码是否已经存在，如果存在
                // 弹出提示，用户点击确定之后，显示带出的信息在当前页面
                let $this = this

                $this.$refs.input2.blur();
                stream.fetch({
                    method:'GET',
                    url:'/member/sendSMS?PHONE=' + $this.userPhone,
                },res=>{

                })                
            },
            getPassKeyWithCoolDown (event) {
                if(this.identifyingCodeGetCoolDown === 0) {
                    this.getPassKey()
                    this.waitGetCodeColdown()
                }
            },
            clearAllData () {
                let $this = this
                $this.userPhone = ''
                $this.smsCode = ''
                $this.userCard = ''
                $this.nowCardType = ''
                $this.locationDetail = ''
                $this.nowSex = ''
                $this.userName = ''
                $this.birth = ''
                $this.hasRegister = false
            },
            showMore () {
                // this.$el('input1').blur();
                //这句话是给自动focus的input 弹出焦点
                this.$refs.input.blur();
                this.show = false;
                this.showRest = true;
            },
            toggleClass (level, index) {
                this.nowIndex = index;
                this.nowCardType = level['MEMB_CARD_TYPE.TYPE_ID']
            },
            
            addressEvent (res) {
                if(res) {
                   this.locate = res
                }
                this.showAddress = false
            },
            save () {
                this.render = true
                let $this = this;
                const userPhone = $this.userPhone
                const smsCode = $this.smsCode
                const userCard = $this.userCard
                const typeId = $this.nowCardType
                const storeId = 0
                const locationDetail = $this.locationDetail
                const gender = $this.nowSex
                const name = $this.userName
                const birth = $this.birth

                stream.fetch({
                    method:"POST",
                    url:$this.addApi,
                    body:{
                        'MEMBER.PHONE': userPhone,
                        'SMS_CODE': smsCode,
                        'MEMB_CARD.MEMB_CODE': userCard,
                        'MEMB_CARD.TYPE_ID': typeId,
                        'MEMBER.NAME': name,
                        'MEMBER.GENDER': gender,
                        'MEMBER.BIRTHDAY': birth
                    }
                },res=>{
                    modal.alert({message:'保存成功'},()=>{
                        storage.setItem('page_refersh','true', res=>{
                            navigator.pop({
                                'animated': "false"
                            })
                        })                      
                    })
                },res=>{
                    $this.render = false
                })

            },
            cancel () {
                 navigator.pop({
                    'animated': "false"
                 })
            },
            addLocation () {
                if(!this.hasRegister) {
                    this.showAddress = true
                }else {
                    modal.alert({
                        message:'该手机号已注册过会员，会员地址不可更改'
                    })
                }
                
            },
            chooseBirth () {
                if(!this.hasRegister) {
                    picker.pickDate({
                        value: this.value,
                        max:dateformat(new Date(),'yyyy-mm-dd')
                    }, event => {
                        if ( event.result == 'success') {
                            this.birth = event.data
                        }
                    })
                }else {
                    modal.alert({
                        message:'该手机号已注册过会员，会员生日不可更改'
                    })
                }
                

            },
            chooseSex(res){
                if(res == 0){
                    this.nowSex = 'MAN'
                }else{
                    this.nowSex = 'WOMAN'
                }
            }
        }
    }
</script>