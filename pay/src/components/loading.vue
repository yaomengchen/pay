<template>
    <div class="item" v-if="loading">
        <div class="load" ref="rotate">
        </div>
    </div>
</template>
<style scoped lang="sass">
    .item{
        position: fixed;
        top: 15;
        right: 10;
        justify-content: center;
        align-items: center;
        background-color: #fff;
    }
    .load{
        width: 16;
        height: 16;
        border-width: 1.5;
        border-style: solid;
        border-color: #f2f2f2;
        border-left-color: #ef484c;
        justify-content: center;
        align-items: center;
        border-radius: 99;
        background-color: #fff;
    }
</style>
<script>
    const animation = weex.requireModule('animation')
    export default {
        data () {
            return {

            }
        },
        props:['loading'],
        mounted(){
            
            
        },
        watch:{
            loading(){
                var self = this
                if(self.loading){
                    setTimeout(function(){
                        var ele = self.$refs.rotate
                        self.animation(ele,360)
                    },100)                                  
                }
            }
        },
        methods:{
            animation(ele,deg){
                var self = this
                animation.transition(ele, {
                    styles: {
                      transform: 'rotate('+ deg +'deg)',
                    },
                    duration: 500, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                  }, function () {
                    self.animation(ele,deg + 180)
                })
            }
        }
    }
</script>