<template>
<div class="item">
    <searchBar @search="search" @member="startInput" @clear="clearMember" :member="member"></searchBar>
    <classBar @getprd="renderPrd" :data-list="productClass"></classBar>
    <div class="content">
        <cart :cart-list="cartList" :discount-info="discountInfo" :member="member" :remark="remark" @openremark="setRemark" @modify="setPrd" @render="cartRender" @event="cartEvent"></cart>
        <productList @addcart="addCart" @loadmore="loadMore" :product-list="productList"></productList>
    </div>
    <discount :display="openDiscount" :sumprice="sumPrice" @event="discountEvent"></discount>
    <prdDiscount :display="openPrdDiscount" :product="product" @event="updataPrd"></prdDiscount>
    <remarkConfirm :display="openRemark" :res="remark" @event="updataRemark"></remarkConfirm>
    <confirm :display="openConfirm" :data="confirmData" :type="confirmType" @event="confirmEvent"></confirm>   
</div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .item{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .content{
        position: absolute;
        top: 148*$rate;
        left: 170*$rate;
        bottom: 20*$rate;
        right: 160*$rate;
        flex-direction: row;
        justify-content: space-between;
    }
    .cart{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 604*$rate;
        background-color: #333;
        border-radius: 10*$rate;
    }
</style>
<script>
    import stream from "../../common/stream.js"
    import searchBar from './search-bar.vue'
    import classBar from './class-sidebar.vue'
    import productList from './product-list.vue'
    import discount from './discount.vue'
    import prdDiscount from './prd-discount.vue'
    import remarkConfirm from './remark.vue'
    import confirm from './confirm.vue'
    import cart from './cart.vue'
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    export default {
        data: function () {
            return {
                userPhone: '',
                productList:[],
                productClass:[],

                product:{},
                pageNumber: 1,
                query:'',
                cartList:[],
                discountInfo: {
                    rate:'',
                    discount: 0,
                    type:'ORDER_DISCOUNT'
                },
                history:{},
                sumPrice: 0,
                openDiscount: false,
                openPrdDiscount:false,
                openConfirm: false,
                confirmData:0,
                cartIndex: -1,
                memberApi:'/member/card/query',
                member:{},
                confirmType:'',
                container:{},
                classId:'-1',
                openRemark:false,
                remark:''
            }
        },
        components: {
            searchBar,
            classBar,
            productList,
            cart,
            discount,
            confirm,
            prdDiscount,
            remarkConfirm
        },
        created(){
           this.renderData() 
        },
        methods: {
            scanEvent(val){
                var self = this
                    if(self.history[val]){
                        self.productList = []
                        self.productList[0] = self.history[val]
                        self.history[val]['SKU_LIST'].forEach(ele =>{
                            if(ele['PRODUCT_SKU.BAR_CODE'] == val){
                                ele['PRODUCT_SKU.SKU_NAME'] = self.history[val]['PRODUCT_SPU.PRD_NAME']
                                self.addCart(ele)
                                return
                            }
                        }) 
                    }else{
                        self.$emit('render',true)
                        self.pageNumber = 1
                        self.getProduct(self.pageNumber + '&SEARCH_SIGN=' + val).then((res)=>{
                            if(res[0]){
                                res[0]['SKU_LIST'].forEach(ele =>{
                                    if(ele['PRODUCT_SKU.BAR_CODE'] == val){
                                        ele['PRODUCT_SKU.SKU_NAME'] = res[0]['PRODUCT_SPU.PRD_NAME']
                                        self.addCart(ele)
                                        self.history[val] = res[0]
                                        return
                                    }
                                })
                            }                                                       
                            self.$emit('render',false)                           
                        })
                    }
                
            },
            renderData () {
                var self = this
                Promise.all([self.getProduct(self.pageNumber) , self.getClass()]).then(()=>{
                    self.$emit('render',false)
                })                                           
            },
            search(res){
                var self = this  
                self.pageNumber = 1
                self.$emit('render',true)
         
                self.getProduct(self.pageNumber + '&SEARCH_SIGN=' + res).then(()=>{
                    self.$emit('render',false)
                })
            },
            getDataByUrl: function (name, url) {
              name = name.replace(/[\[\]]/g, "\\$&");
              var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url); 
              if (!results) return null;
              if (!results[2]) return '';
              return decodeURIComponent(results[2].replace(/\+/g, " "));
            },
            getProduct(query){
                var self = this
                return new Promise((resolve , reject)=>{
                    stream.fetch({
                        method: 'GET',
                        url: '/bee/product/queryAll?HAS_REPOS=true&ORDERBY=PRODUCT_SPU.SORT_NUM+DESC,PRODUCT_SPU.ADD_DATETIME+DESC&IS_DEL=-1&PAGE_SIZE=20&PN=' + query,
                        type: 'json'
                    },res =>{
                        var searchKey = self.getDataByUrl('SEARCH_SIGN',query)
                        var id = self.getDataByUrl('CLASS_ID',query) || '-1'
                        if(self.classId == id || searchKey){
                            if(self.pageNumber > 1){
                                self.productList = self.productList.concat(res.data)
                            }else{
                                self.productList = res.data
                            }
                            searchKey ? '' : (self.container[self.classId] = self.productList)
                        }
                        resolve(res.data)                        
                    })
                })                
            },
            getClass(){
                var self = this
                return new Promise((resolve , reject)=>{
                    stream.fetch({
                        method: 'GET',
                        url: '/bee/prdclass/query?PRODUCT_CLASS.IS_DEL=-1',
                        type: 'json'
                    },res =>{
                        res.data.map((ele)=>{
                            return ele.FOCUS = false
                        })
                        res.data.unshift({                            
                            'PRODUCT_CLASS.CLASS_NAME':'全部',
                            'PRODUCT_CLASS.PRODUCT_CLASS_ID':'-1',
                            'FOCUS':true
                        })
                        self.productClass = res.data
                        resolve('over')
                    })
                })
            },
            renderPrd(classId){
                var self = this
                self.classId = classId
                self.query = '&CLASS_ID=' + (classId == '-1' ? '' : classId)
                if(self.container[classId]){
                    self.productList = self.container[classId]
                    let num = self.container[classId].length % 20 
                    let count = self.container[classId].length

                    self.pageNumber = (num == 0 ? count/20 : ((count-num)/20 + 1))

                }else{
                    self.pageNumber = 1
                    self.$emit('loadmore',true)                           
                    self.getProduct(self.pageNumber + self.query).then(()=>{
                        
                        self.$emit('loadmore',false)
                    })            
                } 
            },
            addCart(res){
                var self = this
                var isHave = false
                this.cartList.forEach(function(ele,index){
                    if(ele['PRODUCT_SKU.SKU_ID'] == res['PRODUCT_SKU.SKU_ID']){
                        ele.COUNT ++
                        isHave = true
                        /*
                            在vue的视图更新中 需要获取到实例的get set函数 才能更新视图 
                            在改变数组中对象的值的时候 没有set函数 需要自己添加
                        */
                        self.$set(self.cartList,index,self.cartList[index])
                    }
                })
                if(!isHave){
                    res.COUNT = 1
                    res.REMARK = ''
                    res.PRICE = res['PRODUCT_SKU.ORDER_PRICE']
                    this.cartList.push(res)
                }
            },
            cartEvent(res){
                if(typeof res == 'object'){
                    
                    this.confirmData = res.data
                    this.cartIndex = res.index
                    this.confirmType = res.type
                    this.openConfirm = true

                }else if(res >= 0 ){
                    this.selectDiscount(res)
                }else{
                    this.cartList = []
                    this.member = {}
                    this.remark = ''
                    this.discountInfo.discount = 0;
                    this.discountInfo.rate = '';
                    this.discountInfo.type = 'ORDER_DISCOUNT';

                }
                
            },
            setPrd(obj){
                this.product = obj.data
                this.cartIndex = obj.index
                this.openPrdDiscount = true
            },
            updataPrd(res){
                if(res){
                    if(res.type == 'remark'){
                        this.cartList[this.cartIndex]['REMARK'] = res.value
                    }else{
                        this.cartList[this.cartIndex]['PRICE'] = res.value
                    }
                }             
                this.$set(this.cartList,this.cartIndex,this.cartList[this.cartIndex])
                this.openPrdDiscount = false
            },
            setRemark(res,remark){
                this.openRemark = res;
                this.remark = remark;
            },
            updataRemark(res){
                if(res){
                    this.remark = res.value
                }
                this.openRemark = false
            },
            selectDiscount(res){
                
                this.openDiscount = true
                this.sumPrice = res 
            },
            discountEvent(res){
                if(res){
                    this.discountInfo = res
                }
                this.openDiscount = false
            },
            confirmEvent(res){
                var self = this
                if(res){
                    if(self.confirmType == 'COUNT'){
                        if(res.data > 0 ){
                            self.cartList[self.cartIndex].COUNT = res.data 
                            self.$set(self.cartList,self.cartIndex,self.cartList[self.cartIndex])
                        }else{
                           self.cartList.splice(self.cartIndex,1) 
                        }
                    }else{
                        self.cartList[self.cartIndex].PRICE = res.data 
                        self.$set(self.cartList,self.cartIndex,self.cartList[self.cartIndex])
                    }
                    
                } 
                self.openConfirm = false            
            },
            loadMore(){
                var self = this
                self.pageNumber ++
                self.getProduct(self.pageNumber + self.query).then(()=>{
                })
            },
            startInput() {
                this.$emit('search','')
            },
            searchMember(res){
                var self = this
                if(res || self.member['MEMBER.PHONE']){
                    if(!res){
                        res = self.member['MEMBER.PHONE']
                    }
                    stream.fetch({
                        method:'GET',
                        url:self.memberApi+'?KEYWORD=' + encodeURI(res)
                    },response => {
                        if(response.data.length == 0){
                            modal.confirm({
                                message:'不存在此会员,是否新增为新的会员',
                                okTitle:'是',
                                cancelTitle:'否',
                            },result=>{
                                if(result == '是'){
                                    self.$emit('member',res)
                                }
                            })
                        }else{
                            self.member = response.data[0]
                        }
                        
                    },()=>{
                        
                    })
                }
                
            },
            clearMember(){
                this.member = {}
            },
            cartRender(res,price){
                this.$emit('render',res)
                if(!res){
                    this.member['MEMB_CARD.USABLE_MONEY'] = this.member['MEMB_CARD.USABLE_MONEY'] - price
                }
            }
        }
        
    }
</script>