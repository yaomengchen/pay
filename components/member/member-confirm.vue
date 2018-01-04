<template>
    <div class="wrapper" v-if="display" @click="close">
        <div class="container" @click="stop">
            <div class="header">
                <text class="header-title">会员开卡</text>    
            </div>
            <div class="wrap-content">
            <div class="userMessage">
                <div class="wrapText">
                    <text class="text">手</text>
                    <text class="text">机</text>
                    <text class="text">号</text>
                </div>
                <div class="passKey">
                    <input id="input" ref="input2" type="number" class="input" placeholder="请输入手机号" v-model="userPhone"/>
                    <div class="grapSpecialText" @click="getPassKeyWithCoolDown">
                        <text class="specialText" :class="[identifyingCodeGetCoolDown > 0 ? 'cantGetSpecialText' : '']">{{identifyingCodeGetState}}</text>
                    </div>
                </div>
                <input id="input" type="number" class="small-input" placeholder="输入验证码" v-model="smsCode" />
            </div>
             <div class="userMessage">
                <div class="wrapText">
                    <text class="text">卡</text>
                    <text class="text">种</text>
                </div>
                <div class="cardType">
                    <div class="card" v-for="(level, index) in type" @click="toggleClass(level, index)" :style="{'background-color':index==nowIndex?'#ef494d':'white','border-width':index==nowIndex?'0':'0.366'}">
                        <text class="cardText" :style="{'color':index==nowIndex?'#fff':'#ef494d'}">{{ level['MEMB_CARD_TYPE.NAME'] }}</text>
                    </div>
                </div>
            </div>
            <div class="userMessage">
                <div class="wrapText">
                    <text class="text">卡</text>
                    <text class="text">号</text>
                </div>
                <input id="input1" class="big-input" type="number" placeholder="请输入卡号" v-model="userCard"/>
            </div>
            <div class="userMessage">
                <div class="wrapText">
                    <text class="text">姓</text>
                    <text class="text">名</text>
                </div>
                <input id="input" class="middle-input" ref="input" placeholder="请输入姓名" v-model="userName"/>
                <div class="sex" @click= "chooseSex(0)">
                    <image class="manIcon" :src="nowSex == 'MAN' ?manIconAction : manIcon"></image>   
                    <text :class="[nowSex == 'MAN' ? 'specialText' : 'text']">男</text>
                </div>
                <div class="sex" @click= "chooseSex(1)">
                    <image class="womanIcon" :src="nowSex == 'MAN' ?womanIcon : womanIconAction"></image> 
                    <text :class="[nowSex == 'WOMAN' ? 'specialText' : 'text']">女</text> 
                </div>   
                  
            </div>
            <div class="userMessage">
                <div class="wrapText">
                    <text class="text">生</text>
                    <text class="text">日</text>
                </div>
                <input id="input1" class="big-input" type="number" placeholder="年月日 如:19980101" v-model="birthday"/>
            </div>
        </div>
        <div class="footer">
            <div class="cAnds" @click="save('0')">
                <text class="cardText" >保存</text>
            </div>
            <div class="saveAndMore" @click="save('1')">
                <text class="whiteText">保存去充值</text>
            </div>
        </div>
        </div>  
    </div>
</template>
<style scoped lang="sass">
    $rate:0.732;
    $set:0.3662;
    .wrapper{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.4);
        justify-content: center;
        align-items: center;
    }
    .container{
        width: 1012*$set;
        height: 828*$set;
        background-color: #fff;
        border-radius: 15*$set;
        overflow: hidden;
        justify-content: space-between;
    }
    .wrap-content {
        padding-left: 60*$set;
        padding-right: 60*$set;
    }
    .header{
        background-color: #f7f7f7;
        justify-content: center;
        align-items: center;
        height: 69*$set;
    }
    .header-title{
        font-size: round(32*$set);
        color: #333;
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
        font-size: round(15px*$rate);
    }
    .big-input {
        color: #333;
        width: 719*$set;
        height: 80*$set;
        font-size: round(15px*$rate);
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        padding-left: 18px*$rate;
        margin-left: 18px*$rate;
        border-radius: 3px*$rate;
    }
    .input {
        color: #333;
        width: 513*$set;
        height: 80*$set;
        font-size: round(15px*$rate);
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        padding-left: 18px*$rate;
        margin-left: 18px*$rate;
        border-radius: 3px*$rate;
    }
    .middle-input {
        color: #333;
        width: 470*$set;
        height: 80*$set;
        font-size: round(15px*$rate);
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        padding-left: 18px*$rate;
        margin-left: 18px*$rate;
        border-radius: 3px*$rate;
    }
    .small-input {
        color: #333;
        width: 184*$set;
        height: 80*$set;
        font-size: round(15px*$rate);
        border-style: solid;
        border-color: #aeaeae;
        border-width: .7px*$rate;
        padding-left: 9px*$rate;
        margin-left: 18px*$rate;
        border-radius: 3px*$rate;
    }
    .specialInput {
        color: #333;
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
        border-radius: 3px*$rate;
    }
    .grapSpecialText {
        position: absolute;
        right: 20*$set;
        height: 80*$set;
        justify-content: center;
        align-items: center;
    }
    .specialText {
        font-size: round(15px*$rate);
        color: #f25a5f;
    }
    .cantGetSpecialText {
        color:#333;
    }
    .greyText {
        font-size: round(15*$rate);
        color: #333;
    }
    .cardType {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-left: 18px*$rate;
    }
    .sex{
        width: 75*$set;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-left: 50*$set;
    }
    .manIcon{
        width: 28*$set;
        height: 29*$set;
    }
    .womanIcon{
        width: 27*$set;
        height: 27*$set;
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
        font-size: round(15px*$rate);
        color: #ef494d;
    }
    .clicked {
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
    }
    .footer {
        flex-direction: row;
        align-items: center;
        background-color: #fff;
        border-top-color: #ef494d;
        border-top-width: 1px*$set;
        border-top-style: solid;
        height: 87px*$set;
        width: 1012*$set;
    }
    .cAnds {
        width: 506*$set;
        height: 87px*$set;
        justify-content: center;
        align-items: center;
    }
    .saveAndMore {
        justify-content: center;
        align-items: center;
        width: 506*$set;
        height: 87px*$set;
        background-color: #ef494d;
    }
    .cardText {
        font-size: round(15px*$rate);
        color: #ef494d;
    }
    .whiteText {
        font-size: round(15px*$rate);
        color: #fff;
    }
</style>
<script>
    const modal = weex.requireModule('modal')
    const picker = weex.requireModule('picker')
    const storage = weex.requireModule('storage')
    import stream from "../../common/stream.js"
    import navigator from "../../common/navigator.js"
    export default {
        data () {
            return {
                identifyingCodeGetState:'获取验证码',
                identifyingCodeGetCoolDown:0,
                manIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/icon/manIcon.png',
                womanIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/icon/womanIcon.png',
                manIconAction:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/icon/manIconAction.png',
                womanIconAction:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/icon/womanIconAction.png',
                userPhone:'',
                getTypeApi:'/member/card/type/queryAll',
                addApi:'/member/card/add',
                query:'/member/card/query',
                type:[],
                nowCardType: '',
                nowIndex: 0,
                nowSex:'MAN',
                display : false,
                smsCode:'',
                userCard:'',
                userName:'',
                birthday:''
            }
        },
        components: {
            
        },
        mounted () {
            let self = this
            stream.fetch({
                method: 'GET',
                url: self.getTypeApi
            }, res=>{
                self.type = res.data
                self.nowCardType = self.type[0]['MEMB_CARD_TYPE.TYPE_ID']
            })
        },
        computed: {
           
        },
        methods: {
            render(res){
                var self = this
                this.display = true
                this.userPhone = res;
                this.getPassKeyWithCoolDown()               
            },
            getPassKeyWithCoolDown (event) {

                if(this.identifyingCodeGetCoolDown === 0) {
                    var string = this.userPhone
                    if(/^1\d{10}$/.test(string)){ 
                    
                        this.getPassKey()
                        this.waitGetCodeColdown()

                    }else{

                        modal.alert({message:'请输入有效的手机号码！'});

                    }
                   
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
                stream.fetch({
                    method:'GET',
                    url:'/member/sendSMS?PHONE=' + $this.userPhone,
                },res=>{

                })               
            },
            toggleClass (level, index) {
                this.nowIndex = index;
                this.nowCardType = level['MEMB_CARD_TYPE.TYPE_ID']
            },
            save (val) {
                let $this = this;
                this.$emit('render',true)
                const userPhone = $this.userPhone
                const smsCode = $this.smsCode
                const userCard = $this.userCard
                const typeId = $this.nowCardType

                const gender = $this.nowSex
                const name = $this.userName
                const birth = $this.birthday

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
                    $this.$emit('data',userPhone)
                    $this.close()
                    modal.alert({message:'保存成功'},()=>{
                        storage.setItem('page_refersh','true', r=>{
                            if(val == '1'){
                                navigator.push({
                                    'url': '/modules/member/member-recharge',
                                    'query':'?id='+res.extraData.id,
                                    'animated': "false"
                                }, function(e){
                                    
                                })
                            }
                        })                      
                    })
                },res=>{
                    this.$emit('render',false)
                })
            },
            chooseSex(res){
                if(res == 0){
                    this.nowSex = 'MAN'
                }else{
                    this.nowSex = 'WOMAN'
                }
            },
            close(){
                this.display = false
            },
            stop(){}
        }
    }
</script>