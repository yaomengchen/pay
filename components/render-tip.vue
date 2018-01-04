<template>
    <div class="item" v-if="render" @click="stopClick">
        <div class="load" ref="rotate">
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .item{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
    }
    .load{
        width: 30;
        height: 30;
        border-width: 1.5;
        border-style: solid;
        border-color: #f2f2f2;
        border-left-color: #ef484c;
        justify-content: center;
        align-items: center;
        border-radius: 99;
    }
</style>
<script>
    const animation = weex.requireModule('animation')
    export default{
        data () {
            return {
                
            }
        },
        created: function(){
          
        },
        props:['render'],
        watch:{
            render(){
                var self = this
                if(self.render){
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
            },
            stopClick(){}
        }
    }
</script>