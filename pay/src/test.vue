<template>
    <div class="item">
       <text class="img" @click="click">扫一扫</text>
    </div>
</template>
<style scoped lang="sass">
    .item{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
    }
    .img{
        width: 300;
        height: 90;
        background-color: #333;
        text-align:center;
        line-height: 90;
        color: #fff;
    }
</style>
<script>
    const event =  weex.requireModule('scanEvent')
    const modal =  weex.requireModule('modal')
    export default {
        data () {
            return {

            }
        },
        methods:{
            click(){
                modal.alert({message:'点击了按键'})
                if(event && typeof(event.goScan) == "function"){
                    event.goScan(function(val){
                        modal.alert({message:val})
                        modal.alert({message:JSON.stringify(val)})
                    })
                }else{
                    modal.alert({message:'不存在扫码的方法'})
                }
            }
        }
    }
</script>