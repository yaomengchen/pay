<template>
    <div class="item">
        <scroller>
            <div v-for="(item,index) in classList" class="product-class-area" @click="changeClass(index)">
                <div class="product-first-class">
                    <text class="product-first-class-text" :class="[item['FOCUS'] ?'product-first-class-text-active': '']">{{item["PRODUCT_CLASS.CLASS_NAME"]}}</text>
                </div>
            </div>
        </scroller>
        <div class="btn" @click="set">
            <image class="btn-img" :src="seticon"></image>
        </div>
        <div class="menu" v-if="display" @click="close">
            <div class="menu-item" @click="print">
                <text class="menu-font">链接打印机</text>
            </div>  
            <div class="menu-item" @click="web">
                <text class="menu-font">设置当前网络</text>
            </div>
        </div>
    </div>   
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .menu{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.4);
        justify-content: flex-end;
        align-items: flex-end;
    }
    .menu-item{
        width: 200*$rate;
        height: 70*$rate;
        background-color: #fff;
        border-radius: 2px;
        justify-content: center;
        align-items: center;
        margin-bottom: 20*$rate;
        margin-right: 150*$rate;
    }
    .menu-font{
        font-size: 10;
        color: #333;
    }
    .btn{
        position: absolute;
        bottom:0;
        left: 0;
        width: 140*$rate;
        height: 120*$rate;
        justify-content: center;
        align-items: center;
    }
    .btn-img{
        width: 50*$rate;
        height: 50*$rate;
    }
    .item{
        width: 140*$rate;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        padding-top: 128*$rate;
        padding-bottom: 128*$rate;
    }
    .product-classes-area {
        /*margin-bottom: 6.35rem;*/
    }
    .product-first-class {
        flex: 1;
        justify-content: center;
        align-items: center;        
    }
    .product-first-class-text {
        width: 140*$rate;
        font-size: round(26*$rate);
        color:#666666;
        text-align: center;   
        margin-top: 30px*$rate;
        margin-bottom: 30px*$rate;
        padding-left: 20px*$rate;
        padding-right: 20px*$rate;
        border-left-width: 5px*$rate;
        border-right-width: 5px*$rate;
        border-right-color: #fff;
        border-left-color: #fff;
    }
    .product-first-class-text-active {
        color: #ef484c;
        border-right-color: #ef484c;
    }
    .product-second-class {
        border-left-width:2.44rem;
        border-left-color:white;
        border-right-width:2.44rem;
        border-right-color:white;
        flex: 0;
        justify-content: center;
        align-items: flex-end;
        /*margin-top: 12.70rem;*/
        margin-bottom: 29.30rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-right: 3.91rem;

    }
    
    .product-second-class-text {
        color:#999999;
        font-size: 14rem;
        text-align: center;
        text-align: right;
    }
    .product-second-class-active {
        border-right-color:#ef494d
    }
    .product-second-class-text-active {
        color:#ef494d
    }
</style>
<script>
    const modal = weex.requireModule('modal') 
    const getEvent = weex.requireModule('event')
    export default {
        data () {
            return {
                index: 0,
                seticon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/icon/setting.png',
                display: false
            }
        },
        methods:{
            
        },
        props:['dataList'],
        computed: {
            /*

            处理商品分类接口的方法  在一级分类中加入二级分类  二级分类中加入三级分类。。。

            */
            classList: function () {
                var obj = this.dataList 
                var result = [];
                if(obj != null && obj.length != 0) {

                    //格式化map 
                    var classMap = new Map;

                    obj.forEach (function (ele) {
                        classMap.set(ele['PRODUCT_CLASS.PRODUCT_CLASS_ID'], ele);
                    })


                    obj.forEach(function(ele) {
                        var parentId = ele['PRODUCT_CLASS.PARENT_CLASS_ID'];
                        var parentObj = classMap.get(parentId);
                        if(parentObj == undefined) {
                            result.push(ele);
                        }else {
                            var childList = parentObj.childList;
                            if(childList == undefined) {
                                var temp = [];
                                temp.push(ele);
                                parentObj.childList = temp;

                            }else {                
                                childList.push(ele);
                            }
                        }
                    })

                }
                result.forEach (function (ele) {
                    if(ele.childList == undefined){
                        ele.childList = [];
                    }       
                })
                return result;
            },
        },
        methods:{
            changeClass(index){
                var self = this
                if(self.index != index){
                    self.classList[index].FOCUS = true
                    self.classList[self.index].FOCUS = false
                    self.index = index
                    self.$emit('getprd',self.classList[index]['PRODUCT_CLASS.PRODUCT_CLASS_ID'])
                }
            },
            set(){

                this.display = true
                
            },
            print(){
                if(typeof(getEvent.setPrint) == "function"){
                    getEvent.setPrint()
                    this.display = false
                }
            },
            web(){
                this.display = false
                modal.prompt({
                    'message': '请输入局域网地址',
                    'okTitle' : '确定',
                    'cancelTitle' : '取消',
                    'data': ''
                }, function (e) {
                   if(e.result == '确定'){
                      if(typeof(getEvent.setLocalDic) == "function"){
                            getEvent.setLocalDic({'IP':e.data})
                        }
                   }
                });
            },
            close(){
                 this.display = false
            }
        }
        
    }
</script>