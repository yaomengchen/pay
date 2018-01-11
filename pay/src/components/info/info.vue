<template>
    <div class="order-index">
        <div class="header">
            <div class="toggle-order-mode-bar">
                <div class="toggle-order-mode-bar-item">
                    <text class="toggle-order-mode-bar-item-text" >账号</text>
                </div>
            </div>
        </div>
        <div class="item">
            <infoList class="order-list body-item" :info="infoname" @select="select"></infoList>
            <infoDetail class="order-detail body-item" :info="user" ref="detail" v-if="!showIndex"></infoDetail>
            <storeDetail :info="user" :store="store" v-if="showIndex"></storeDetail>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .order-index {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        padding-left: 150*$rate;
    }
    .header {
        background-color: #fff;
        height: 132*$rate;
        justify-content: flex-end;
        padding-left: 41*$rate;
    }
    .toggle-order-mode-bar {
        height: 92*$rate;
        flex-direction: row;
        align-items: stretch;
        justify-content: flex-start;
    }
    .toggle-order-mode-bar-item {
        width: 157*$rate;
        height: 91*$rate;
        border-top-color: white;
        border-top-width: 5*$rate;
        border-bottom-color: white;
        border-bottom-width: 5*$rate;
        justify-content: center;
        align-items: center;
        margin-right: 36*$rate;
    }
    .toggle-order-mode-bar-item-text {
        font-size: round(33*$rate);
        color:#333333;
    }
    .item {
        background-color: #f3f3f3;
        position: absolute;
        top: 132*$rate;
        left: 150*$rate;
        bottom: 0;
        width: 750-150*$rate;
        padding: 24*$rate;
        flex-direction: row;
        justify-content: space-between;
    }
    .body-item {
        border-radius: 20*$rate;
    }
    .order-list {
        width: 765*$rate;
        background-color: #fff;
    }
    .order-detail {
        width: (1040*$rate);
        background-color: #fff;
    }
</style>
<script>
    import infoList from './info-list.vue'
    import infoDetail from './info-detail.vue'
    import storeDetail from './store-detail.vue'
    import nothing from '../nothing.vue'
    import stream from '../../common/stream.js'
    import modal from '../../common/modal.js'
    const storage = weex.requireModule('storage')
    export default {
        data () {
            return {
                store:{},
                user:{},
                pendingOrder:{},
                infoname:'',
                focusOrder: 0,
                focusPendingOrder:0,
                render: false,
                displayPri:false,
                pageNumber:1,
                printlist:[],
                showIndex:true,

            }
        },
        created(){
            
            storage.getItem('userInfo',res =>{
                this.user = JSON.parse(res.data)
                this.infoname = this.user['USER.NAME'];
                console.log(this.infoname)
                storage.getItem('store_info',res =>{
                    this.store = JSON.parse(res.data)

                })
            })
        },

        components: {
            infoList,
            infoDetail,
            storeDetail,
        },
        methods: {
            select(state){
                if(state){
                    this.showIndex = true
                }else{
                    this.showIndex = false
                }
            },
        }
    }
</script> 