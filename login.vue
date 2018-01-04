<template>
    <div class="wrapper" ref='loginPage'>
        <div class="test-btn" @click="selTest">
            <text class="text" v-if="isTest">{{debugTips}}</text>
        </div>
        <div class="content">
            <image class="logo" :src="logo"></image>   
            <div class="message">
                <image class="icon" :src="usernameIcon"></image>   
                <input type="text" class="input" placeholder="账号" v-model="userId"  return-key-type="defalut" @return = "login"/>
            </div>
            <div class="message">
                <image class="icon2" :src="passwordIcon"></image>   
                <input type="password" class="input" placeholder="密码" v-model="password"  return-key-type="defalut" @return = "login"/>
            </div>
            <div class="btn-message" @click='login' ref="btn">
                <text class="whiteText" v-if="!islogin">登    录1</text>
                <text class="whiteText" v-if="islogin">登    录    中 ...</text>
            </div>
            
        </div>
    </div>
</template>
<script>
import modal from './common/modal.js'
import stream from './common/stream.js'
const animation = weex.requireModule('animation')
const storage = weex.requireModule('storage')
import navigator from './common/navigator.js'
export default {
    data () {
        return {
            userId:'',
            password:'',
            islogin: false,
            isTest : false,
            debugTips: '',
            passNum: 0,
            aftertype:'',
            testApi:'http://118.190.74.62:12019/jiaorder/bubu',
            workApi:'http://aa.eerrpp.cc/boloogo/bubu',
            apiHost: 'http://aa.eerrpp.cc/boloogo/bubu',
            usernameIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/weexApp/MS-username.png',
            passwordIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/weexApp/MS-password.png',
            logo:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/icon/redLoginlogo.jpg'
        }
    },
    components: {

    },
    created(){
        let self = this
        storage.getItem('login_info',res=>{
            if(res.result == 'success'){
                self.userId = JSON.parse(res.data).userId
                self.password = JSON.parse(res.data).password
                storage.getItem('pay_debug_info',function(debug){
                    if(debug.result === 'success' && JSON.parse(debug.data).type != 'DEBUG'&& JSON.parse(debug.data).type != 'TEST'){
                        self.apiHost = self.workApi
                        self.isTest = false;
                        self.debugTips = '';
                        self.srcHost = 'http://boloogo-sys.oss-cn-shanghai.aliyuncs.com/app/work/storePay'
                    }else{
                        self.apiHost = self.testApi
                        self.isTest = true
                        self.srcHost = 'http://jiaorder-nome.oss-cn-shanghai.aliyuncs.com/pay/1000'
                        self.debugTips = (JSON.parse(debug.data).type === 'DEBUG'?('DEBUG模式'+JSON.parse(debug.data).code) :'开发模式')
                    }
                    if(typeof window === 'object'){
                            // pc端页面展示
                            self.srcHost = 'http://192.168.31.137:8080/web'
                        }
                        
                        storage.setItem('pay_system_type',JSON.stringify({"API":self.apiHost,"SRC":self.srcHost}), 
                            function(type){

                            })
                    }) 
            }
        })
    },
    methods: {
        login () {
            let self = this
            var btn = self.$refs.btn
            animation.transition(btn, {
                styles: {
                  backgroundColor:'#ca0a1b'
              },
                    duration: 100, //ms
                    timingFunction: 'ease',
                    needLayout:false,
                    delay: 0 //ms
                }, function () {
                    animation.transition(btn, {
                        styles: {
                          backgroundColor:'#ef494d'
                      },
                        duration: 100, //ms
                        timingFunction: 'ease',
                        needLayout:false,
                        delay: 0 //ms
                    }, function () {

                    })
                });
            if(self.islogin == false){
                self.islogin = true
                stream.fetch({
                    method: 'GET',
                    url:'/bee/user/user/loginByApp?APP_TOKEN=9C4F2C2F67E34BB29BF296DBDBF26922&USER.LOGIN_ID='+ self.userId + '&USER.LOGIN_PASSWORD='+ self.password,
                    type: 'json'
                },res => {
                    if(res.code === 0){
                        var bubuid = res.extraData.bubuId
                        storage.setItem('pay_bubuid',bubuid,()=>{})
                        stream.fetch({
                            headers:{token:bubuid},
                            method: 'GET',
                            url: '/store/queryBySession',
                            type: 'json',
                        }, res2=>{
                            if(res2.code === 0){
                                self.islogin = false
                                storage.setItem('store_info',JSON.stringify(res2.data[0]))
                                storage.setItem('pay_bubuid',bubuid,()=>{
                                    storage.setItem('userInfo',JSON.stringify(res.extraData.USER_LIST[0]),function(){
                                        modal.toast({message:'登录成功',duration:1})
                                        storage.setItem('login_info',JSON.stringify({
                                            userId:self.userId,
                                            password:self.password
                                        }), res=>{
                                            storage.getItem('pay_debug_info',debug=>{
                                                if(debug.result === 'success' && JSON.parse(debug.data).type != 'DEBUG' && JSON.parse(debug.data).type != 'TEST'){
                                                    self.apiHost = self.workApi
                                                }else{
                                                    self.apiHost = self.testApi
                                                }
                                                self.islogin = false
                                                navigator.push({
                                                    'url': "/main",
                                                    'animated': "false"
                                                }, function(e){})
                                            })
                                        })
                                    })                                   
                                })
                            }
                        })
                    }else{
                        modal.alert({message:res.msg})
                        self.islogin = false
                    }
                }
                )
            }

        },
            /*
            新增
            ymc 2017年12月25日17:48:02
            在登录页面的右上角点击五次之后 开启切换到测试环境 如果输入了调试码 则进入debug模式 如果没有输入调试码 则进入到开发环境
            如果已经是处在测试环境 或者 debug模式 则点击可以切换为正常模式
            */
            selTest(){
                var self = this
                self.passNum += 1;
                if(self.passNum === 5){
                    var code = ''
                    modal.prompt({
                      'message': '验收开发中的功能请输入调试码，测试已经完成的功能不用输入任何内容直接点击确定',
                      'okTitle' : '确定',
                      'cancelTitle' : '取消'
                  }, function (e) {
                      if (e.result === '确定') {
                        var code = e.data
                        console.log(e)
                        // storage.setItem('pay_debug_info',code.indexOf('udbu') != '-1' ?(JSON.stringify({type:'DEBUG',code:code})):(JSON.stringify({type:'TEST',code:''})), function(e){
                        storage.setItem('pay_debug_info',(JSON.stringify({type:'DEBUG',code:'1901udbu2350'})), function(e){

                            self.apiHost = self.testApi
                            self.isTest = true;
                            // self.debugTips = (code.indexOf('udbu') != '-1'?('DEBUG模式'+code) :'开发模式');  
                            self.debugTips = ('DEBUG模式'+'1901udbu2350');  
                            self.srcHost   = 'http://jiaorder-nome.oss-cn-shanghai.aliyuncs.com/pay/1000';

                            storage.setItem('pay_system_type',JSON.stringify({"API":self.apiHost,"SRC":self.srcHost}), 
                                function(type){})
                        })
                    }
                });
                }else if(self.isTest === true){
                    modal.confirm({
                        'message': '切换到正常模式？',
                        'okTitle' : '确认',
                        'cancelTitle' : '取消'
                    }, function (e) {
                        if (e= '确认') {
                            storage.setItem('pay_debug_info',JSON.stringify({type:'NORMAL',code:''}), function(e){
                                self.apiHost = self.workApi
                                self.isTest = false;
                                self.passNum = 0;
                                self.srcHost = 'http://boloogo-sys.oss-cn-shanghai.aliyuncs.com/app/work/storePay'
                                storage.setItem('pay_system_type',JSON.stringify({"API":self.apiHost,"SRC":self.srcHost}), 
                                    function(type){})
                            })
                        }
                    });
                }  
            // 新增
        },

    }
}

</script>
<style scoped lang="sass">
$rate:0.3662;
.wrapper {
    position:absolute;
    left:0;
    top:0;
    bottom: 0;
    right: 0;
    background-color: #fff;
    align-items: center;
    justify-content: center;
}
.content {
    justify-content: center;
    align-items: center;
}
.message {
    width: 700 * $rate;
    height: 110* $rate;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 15px;
    border-bottom-style: solid;
    border-bottom-color: #f1f1f1;
    border-bottom-width: 0.4px;

}
.btn-message {
    width: 700 * $rate;
    height: 110* $rate;
    justify-content: center;
    align-items: center;
    background-color: #ef494d;
    border-radius: 2px;
    margin-top: 15px;
}
.text {
    font-size: 12px;
}
.whiteText {
    font-size: 12px;
    color: #f7f7f7;
}
.input {
    width: 639 * $rate;
    height: 100* $rate;
    padding-left: 30*$rate;
    font-size: 12px;
}
.test-btn{
    position: absolute;
    top: 10;
    right: 0;
    width: 200;
    height: 50;
    align-items:flex-end;
}
.icon{
    width: 60 * $rate;
    height: 60 * $rate;
}
.icon2{
    width: 60 * $rate;
    height: 60 * $rate;
}
.logo{
    margin-bottom: 200*$rate;
    width:636 * $rate;
    height: 207 * $rate;
}
</style>
