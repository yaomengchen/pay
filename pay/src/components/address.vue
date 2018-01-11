<template>
    <div class="content" v-if="show">
        <div class="address">
            <!-- 顶部条 -->
            <div class="title">
                <div class="mainTitle">
                    <div class="wrapText" @click="provinceSelect(0)" :style="{'background-image':0==nowIndex?'linear-gradient(to right, #e71b2d, #f36670)':'white'}">
                        <text class="text" :style="{'color':0==nowIndex?'#fff':'#ef494d'}">{{ province?province:'省份'}}</text>
                    </div>
                    <div class="wrapText" @click="citySelect(1)" :style="{'background-image':1==nowIndex?'linear-gradient(to right, #e71b2d, #f36670)':'white'}">
                        <text class="text" :style="{'color':1==nowIndex?'#fff':'#ef494d'}">{{ city?city:'城市' }}</text>
                    </div>
                    <div class="wrapText" @click="districtSelect(2)" :style="{'background-image':2==nowIndex?'linear-gradient(to right, #e71b2d, #f36670)':'white'}">
                        <text class="text" :style="{'color':2==nowIndex?'#fff':'#ef494d'}">{{ district?district:'区县' }}</text>
                    </div>
                </div>
                <!-- 关闭icon -->
                <div class="wrapImg" @click="close">
                    <image :src="closeIcon" class="img" ></image>
                </div>
                <!-- 关闭icon 结束-->
            </div>
            <!-- 顶部条 结束-->
            <div class="addressList">
              <div class="addressListItem">
                <scroller v-if="showProvince" show-scrollbar="false" >
                  <div class="commonCity" v-for="(city, index) in citys" @click="chooseProvince(city.id, city.name, city.city, index)">
                      <text class="text" :style="{'color':index==nowProvince?'#ef494d':'#000'}">{{ city.name }}</text>
                  </div>
                </scroller>
              </div>
              <div class="addressListItem">
                <scroller v-if="showCity" show-scrollbar="false">
                  <div class="commonCity" v-for="(city, index) in cityList" @click="chooseCity(city.id, city.name, city.district, index)">
                      <text class="text" :style="{'color':index==nowCity?'#ef494d':'#000'}">{{ city.name }}</text>
                  </div>
                </scroller>
              </div>
              <div class="addressListItem">
                <scroller v-if="showDistrict" show-scrollbar="false">
                  <div class="commonCity" v-for="(city, index) in districtList" @click="chooseDistrict(city.id, city.name, index)">
                      <text class="text" :style="{'color':index==nowDistrict?'#ef494d':'#000'}">{{ city.name }}</text>
                  </div>
                </scroller>
              </div>
            </div>
            <!-- scroller end -->
            <div class="save">
               <div class="saveContent" @click="saveLocation">
                 <text class="whiteText" >保存</text>
               </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="sass">
    $rate:0.732;
    /*脚部样式*/
    .save {
      width: 392px*$rate;
      height: 56.5px*$rate;
      border-top-width: 0.366;
      border-top-color: #d0d0d0;
      border-top-style: solid;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .saveContent {
      width: 78.35px*$rate;
      height: 39.29px*$rate;
      background-image: linear-gradient(left, #e71b2d, #f36670);
      border-radius: 99;
      align-items: center;
      justify-content: center;
      margin-right: 23px*$rate;
    }
    .whiteText {
      color: #fff;
      font-size: round(15px*$rate);
    }
    /*脚部样式*/

    /*临时样式*/
    .addressList {
      padding-top:20px*$rate;
      padding-bottom:20px*$rate;
      flex-direction:row;
      align-items: center;
      width: 392px*$rate;
      height: 196px*$rate;
      overflow: hidden;
    }
    .addressListItem{
      flex-direction:column;
      width: 110px*$rate;
      height: 196px*$rate;
    }
    .bb {
      border-bottom-color: red;
      border-bottom-style: solid;
      border-bottom-width: 0.366;
    }
    /*临时样式*/
    .container {

    }
    .content {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.3);
        justify-content: center;
        align-items: center;
    }
    .address {
        width: 412px*$rate;
        height: 320px*$rate;
        padding: 10px*$rate;
        background-color: #fff;
    }
    .text {
        font-size: round(15px*$rate);
        text-align: center;
    }
    .title {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-style: solid;
        border-bottom-width: 0.366;
        border-bottom-color: #d0d0d0;
        height: 44.5px*$rate;
        width: 392px*$rate;
    }
    .mainTitle {
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .wrapText {
        width: 110px*$rate;
        height: 44.5px*$rate;
        justify-content: center;
        align-items: center;
    }
    .wrapImg {
        width: 44.5px*$rate;
        height: 44.5px*$rate;
        align-items: center;
        justify-content: center;
    }
    .img {
        width: 10px*$rate;
        height: 10px*$rate;
    }
    .commonCity {
        height: 39.2px*$rate;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>
<script>
    const modal = weex.requireModule('modal')

    import icons from "../assets/icon.js"
    import area from "../assets/area.js"
    const searchBarIcons = icons.searchBarIcons
    const city = area.citys
    export default {
        data () {
            return {
                citys: city,
                closeIcon: searchBarIcons.closeIcon,
                showDistrict: false,
                showCity: false,
                showProvince: true,
                province: false,
                city: false,
                district: false,
                cityList: false,
                districtList: false,
                nowIndex: 0,
                nowProvince: 0,
                nowCity: 0,
                nowDistrict: 0,
            }
        },
        props:['show'],
        methods: {
            provinceSelect ( index ) {
                this.showProvince = true;
                this.showCity = false;
                this.showDistrict = false;
                this.nowIndex = index;
            },
            citySelect ( index ) {
                //this.showProvince = false;
                this.showCity = true;
                this.showDistrict = false;
                this.nowIndex = index;
            },
            districtSelect ( index ) {
                //this.showProvince = false;
                //this.showCity = false;
                this.showDistrict = true;
                this.nowIndex = index;
            },
            chooseProvince ( id, name, city, index ) {
                this.province = name;
                this.cityList = city;
                this.districtList = false;
                this.nowIndex = 1;
                this.city = city[0].name;
                this.showCity = true;
                this.nowProvince = index;
                this.nowCity = 0;
            },
            chooseCity ( id, name, district, index ) {
                this.city = name;
                this.districtList = district;
                this.nowIndex = 2;
                this.district = district[0].name;
                this.showDistrict = true;
                this.nowCity = index;
                this.nowDistrict = 0;
            },
            chooseDistrict (id, name, index) {
                this.district = name;
                //this.districtList = district;
                this.nowDistrict = index;
            },
            close () {
                this.$emit('event',false)
            },
            saveLocation () {
                let $this = this
                // modal.alert({
                //     message:this.province + this.city + this.district,
                // })
                const province = $this.province
                const city = $this.city
                const district = $this.district

                const options = {
                    'province': province, 
                    'city': city,
                    'district': district,
                }
                this.$emit('event',options)
            }

        },
    }
</script>