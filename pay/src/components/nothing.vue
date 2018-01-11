<template>
    <div class="item" v-if="display == 0">
        <image class="img" :src="'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/icon/nothing.png'"></image>
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
        width: 90;
        height: 90;
    }
</style>
<script>
    export default {
        data () {
            return {

            }
        },
        props:['display']
    }
</script>