<template>
    <div class="search-main">
        <div class="search-input">
            <image :src="search" class="img"></image>
            <input  class="input" placeholder="请输入会员姓名、手机号或卡号"  v-model="insertedData" return-key-type="defalut" @return = "onreturn"/>
        </div>
        <div class="btn" @click="createCard">
            <text class="text" >{{ msg }}</text>
        </div>
    </div>
</template>
<style scoped lang='sass'>
    $rate:0.3662;
    .search-main {
        width: 1758*$rate;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .search-input {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background-color: #f2f2f2;
        width: 1000 * $rate;
        height: 90 * $rate;
        border-radius: 99;
    }
    .img {
        width: 40 * $rate;
        height: 40 * $rate;
        margin-left: 30 * $rate;
    }
    .input {
        font-size: round(30*$rate);
        width: 800*$rate;
        height: 80 * $rate;
        margin-left: 40 * $rate;
        color: #999;
        background-color: rgba(0,0,0,0);
        placeholder-color: #999999;
    }
    .btn {
        color: #ffffff;
        width: 230*$rate;
        height: 90 * $rate;
        border-radius: 99;
        background-image: linear-gradient(to bottom right,#EF494D,#F98085);
        justify-content: center;
        align-items: center;
        /*margin-left: 15.13px;*/
    }
    .text {
        font-size: round(30*$rate);
        text-align:center;
        color: #ffffff;
    }
</style>
<script>
    const modal = weex.requireModule('modal')
    import icons from "../../assets/icon.js"
    import navigator from "../../common/navigator.js"
    const searchBarIcons = icons.searchBarIcons;
    export default {
        data: function () {
            return {
                search:searchBarIcons.searchIcon,
                msg: "开新卡",
                insertedData: ""
            }
        },
        methods: {
            createCard () {
                let $this = this
                navigator.push({
                    'url': '/modules/member/add-member',
                    'animated': "false"
                })               
            },
            onreturn () {
                this.$emit('search',this.insertedData)
            }

        }
    }
</script>