<!-- 用于存放memberIndex.vue的临时文件 不可改动  04 13 15 28 -->
<template>
    <div class="member-container">
        <headBar :title="title" :action="'-1'"  needreturn="" ></headBar>
        <div class="content">
            <searchInput @search="search"></searchInput>
            <table urlLeft="/member/recharge" urlRight="/member/userDetail" :member-list="memberList" @load="loadmore"></table>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .member-container {
        flex-direction: column;
        background-color: #f2f2f2;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-left: 150*$rate;
    }
    .content {
        flex-direction: column;
        background-color: #fff;
        align-items: center;
        flex: 1;
        margin: 20*$rate;
        padding-top: 50*$rate;
        padding-bottom: 50*$rate;
        border-radius: 10*$rate;
    }
</style>
<script>
    const modal = weex.requireModule('modal')
    import stream from "../../common/stream.js"
    import searchInput from "./search-input.vue"
    import headBar from "../head-bar.vue"
    import table from "./table.vue"
    export default {
        data () {
            return {
                memberApi:'/member/card/query?PAGE_SIZE=50&PN=',
                memberList:[],
                pageNumber:1,
                title:['会员卡管理']
            }
        },
        components: {
            searchInput,
            headBar,
            table: table,
        },
        methods: {
            renderData(callback,query){
                var self = this
                this.pageNumber = 1
                this.getData(this.pageNumber,callback)
            },
            search(key,query){
                this.pageNumber = 1
                this.getData(this.pageNumber + '&KEYWORD=' + encodeURI(key),()=>{})
            },
            getData(query,callback){
                var self = this
                stream.fetch({
                    method:'GET',
                    url:self.memberApi+query
                },res => {
                    if(self.pageNumber == 1){
                        self.memberList = res.data
                    }else{
                        self.memberList = self.memberList.concat(res.data)
                    }
                    
                },()=>{
                    callback();
                })
            },
            loadmore(){
                this.pageNumber ++ 
                this.getData(this.pageNumber)
            }
        },
        computed: {

        },
    }
</script>