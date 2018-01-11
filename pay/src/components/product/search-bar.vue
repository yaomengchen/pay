<template>
    <div class="header">
        <div class="memberInfo" >
            <div class="row">
                <div class="pick-member-info" @click="showEnv">
                    <text class="pick-member-btn">{{member['MEMBER.PHONE']?member['MEMBER.NAME']:'点击选择会员卡'}}</text>
                </div>
                <div class="close-item" v-if="member['MEMBER.PHONE']" @click="clearUser">
                    <image class="close" :src="closeIcon"></image>
                </div>
            </div>
            <div class="row" v-if="member['MEMBER.PHONE']">
                <text class="small">余额:</text>
                <text class="big">{{member['MEMB_CARD.USABLE_MONEY'] | price}}</text>
            </div>
        </div>
        <div class="search-bar">
            <image :src="searchIcon" class="search-icon"></image>
            <input class="typeIn-enter" placeholder="输入商品名称或条形码搜索" v-model="searchKey" return-key-type="search" @return = "onreturn"/>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.3662;
    .header {
        width: 750;
        height: 128* $rate;
        background-color: white;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        padding-bottom: 8 * $rate;
        padding-left: 175 * $rate;
        padding-right: 175 * $rate;
    }
    .close-item{
        width: 70*$rate;
        height: 70*$rate;
        align-items: center;
        justify-content: center;
    }
    .close{
        width: 20*$rate;
        height: 20*$rate;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .memberInfo {
        width: 590*$rate;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .pick-member-info {
        width: 255*$rate;
        height: 70*$rate;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        justify-content: center;
        align-content: center;
        border-radius: 99px;
    }
    .pick-member-btn {
        color:white;
        font-size: round(26*$rate);
        text-align: center;
    }
    .search-bar {
        width: 1084 * $rate;
        height: 70 * $rate;
        align-items: center;
        background-color: #f6f6f6;
        border-radius: 999px;
        flex-direction: row;
    }
    .search-icon {
        width: 29 * $rate;
        height: 29 * $rate;
        margin-left:60 * $rate;
    }
    .typeIn-enter {
        flex: 1;
        background-color: rgba(0,0,0,0);
        align-items: center;
        height: 70 * $rate;
        placeholder-color:#999999;
        margin-left:20 * $rate;
        font-size: round(26*$rate);
        color:#666666;
    }
    .small{
        font-size: round(26*$rate);
        color: #333;
        margin-right: 10*$rate;
    }
    .big{

        font-size: round(40*$rate);
        color: #ef484c;
    }
</style>
<script>
    import icons from "../../assets/icon.js"
    import filters from '../../common/filters.js'
    import navigator from '../../common/navigator.js'
    const headerIcon  = icons.salePartHeaderIcons
    const closeIcon = icons.modalIcons
    const modal = weex.requireModule("modal");
    export default {
        data () {
            return {
                memberInfo:null,
                searchIcon: headerIcon.searchIcon,
                closeIcon: closeIcon.closeBtnIcon,
                memb_card_useableMoney: '',
                searchKey:''
            }
        },
        filters:{
            price:filters.price
        },
        props:['member'],
        methods: {
            onreturn(){
               this.$emit('search',encodeURI(this.searchKey))
            },
            showEnv(){
                if(this.member['MEMBER.PHONE']){
                    navigator.push({
                        'url': '/modules/member/member-detail',
                        'query':'?id='+this.member['MEMB_CARD.MEMB_CARD_ID'],
                        'animated': "false"
                    }, function(e){
                        
                    })
                }else{
                    this.$emit('member','')
                }                
            },
            clearUser(){
                var self = this

                self.$emit('clear','')

            }
        },
        computed: {
            user () {
                return this.$store.state.buyer.buyer
            }

        },
        mounted () {
      
            
        }
    }
</script>