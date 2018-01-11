<template>
    <div class="item" v-if="show">
        <div class="input"  v-on:swipe="onSwipe($event)" @click="onclick">
	        <text class="font-gray33 font15" v-model="result">您有</text>
	        <text class="font-red font15" v-model="result">1</text>
	        <text class="font-gray33 font15" v-model="result">笔退单申请，请点击处理</text>
        </div>
    </div>
</template>
<style scoped>
    .item{ 
        position: fixed;
        top: 0;
        left: 10;
        padding-top: 10;
        align-items: center;
    }
    .input{
        width: 720;
        height: 50;
        padding-left: 25;
        padding-right: 25;
        border-radius: 10;
        background-color: #fff;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .font15{
    	font-size:15;
    }
    .font-gray33{
    	color: #333;
    }
    .font-red{
    	color:#ef484c;
    }
</style>
<script>
    const modal = weex.requireModule('modal')
    export default {
        data () {
            return {
                result:'',
                input:false
            }
        },
        props:['show','num'],
        methods:{
            onSwipe(event) {
                if(event.direction == 'up'){
                    this.$emit('cancel',false)
                }
            },
            onclick(){
                this.$emit('click','')
                this.$emit('cancel',false)
                
            },
            onreturn(){
                var string = this.result
                if(/^1\d{10}$/.test(string)){ 
                    
                    this.$emit('event',this.result)
                    this.result = ''
                    this.input = false

                }else{
                    modal.alert({message:'请输入有效的手机号码！'});
                }                
            },
            startInput(){
                var self = this
                this.input = true
                setTimeout(()=>{
                    self.$refs.input.focus()
                },200)                
            },
            close(){
                this.$emit('cancel',false)
            },
            stop(){}
        }
    }
</script>