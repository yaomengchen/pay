<template>
    <div class="item" v-if="input" @click="close">
        <div @click="stop">
        <input type="number" placeholder="请输入手机号码" class="input" v-model="result" return-key-type="search" @return = "onreturn" ref="input"/>
        </div>
    </div>
</template>
<style scoped>
    .item{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-top: 30;
        align-items: center;
        background-color: rgba(0,0,0,0.3);
    }
    .input{
        width: 500;
        height: 50;
        padding-left: 25;
        padding-right: 25;
        font-size: 15;
        color: #999;
        border-radius: 99;
        background-color: #fff;
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

        methods:{
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
                this.input = false
            },
            stop(){}
        }
    }
</script>