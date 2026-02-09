<template>
  <view class="buybook-container">
    <page-root :headOpt="{position: 'fixed', hideNavbar: true, backgroundColor: '' }">      
      <template v-slot:header>
        <!-- 顶部导航 -->
        <nav-share></nav-share>
      </template>
      <template v-slot:body>
        <view class="">
          <!-- 顶部banner -->
          <view class="banner-section">
            <image :src="getResourceUrl(topBanner?.[0]?.image)" mode="aspectFill" class="banner-bg"></image>
          </view>

          <!-- 课程标签 -->
          <view class="course-tabs">
            <view v-for="item in bookGroupList"  @click="handleChooseGroup(item)"
              :class="`tab-item ${item.id == curSelectGroup.id ? 'active' : ''}`" 
            >
              {{item.name}}
            </view>
          </view>

          <!-- 课程套餐 -->
          <view class="course-packages">
            <view v-for="item in curSelectGroup.bookList" :key="item.id" @click="handleChooseBook(item)"
              :class="`package-item ${item.id == curSelectBook.id ? 'primary' : ''}`" 
            >
              <image :src="item.productImg" mode="aspectFill" class="package-cover"></image>
              <view style="flex: 1 0 0;min-width: 0;">
                <view class="package-header">
                  <text class="package-title">{{ item.title }}</text>
                </view>
                <view class="package-price">
                  <text class="current-price">¥{{ item.price }}</text>
                  <text class="original-price">原价¥{{item.originalPrice}}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 权益详情 -->
          <view class="benefits-section">
            <view class="section-title">权益详情</view>
            <view class="benefits-content">
              <rich-text :nodes="curSelectBook.detail"></rich-text>
            </view>
          </view>

        </view>
      </template>
      <template v-slot:footer>
        <!-- 底部购买按钮 -->
        <view class="footer">
          <view class="buy-button" @click="goto(`${allRoutePathMaps.listenbook.sncodeEchange}`)">
            <text class="buy-text">立即兑换</text>
          </view>
          <!-- <view class="buy-button" @click="handleBuy">
            <text class="buy-text">立即以¥{{curSelectBook.price}}付费</text>
          </view> -->
        </view>
      </template>
    </page-root>
  </view>
  <u-popup v-model="showPayPopup" mode="bottom" :overlay="true" :close-on-click-overlay="true"
    :safe-area-inset-bottom="true" round="16"
  >
    <view class="pay-type-title">选择支付方式</view>
    <view class="pay-type-container">  
      <view class="pay-type-list">
        <view v-for="item in payTypeList" :key="item.id" @click="handleChoosePayType(item)"
          :class="`pay-type-item ${item.payWay == curSelectBook.orderInfo.payWay ? 'active' : ''}`" 
        >
          <image :src="item.icon" mode="aspectFill" class="pay-type-icon"></image>
          <view class="pay-type-name">{{ item.name }}</view>
          <u-checkbox v-model="item._checked" shape="circle"></u-checkbox>
        </view>
      </view>
      <view class="buy-button" @click="handleConfirmBuy">
        <text class="buy-text">确认购买</text>
      </view>
    </view>
  </u-popup>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { onLoad, onShow} from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user'
import * as bookService from "@/api/course"
import { getDecorate } from '@/api/shop'
import { getResourceUrl } from "@/utils/cdn"
import { allRoutePathMaps, goBack, goto, showToast, } from '@/utils/untool'
import { getSellGroupBookList } from '@/utils/book';

const userStore = useUserStore()
const bookGroupList = ref([] as any)
const curSelectGroup = ref({} as any)
const curSelectBook = ref({
  orderInfo: {}
} as any)
const options = ref({} as {
  
})
const showPayPopup = ref(false)
const payTypeList = ref([] as any)
const topBanner = ref([] as any)

const initData = async() => {
  let [pageRes,bookRes,categoryRes] = await Promise.all([
    await getDecorate({ id: 5 }),
    await bookService.getSellBooksList({ type: 1 }),
    await bookService.getSellBooksCategoryList()
  ])
  try {
    let pgList = JSON.parse(pageRes?.pages)
    topBanner.value = pgList.filter((t:any)=> t.name == 'prod-banner')?.[0]?.content?.data || []
  } catch (error) {
    console.error('解析 pageRes?.pages 失败:==========', {error, pageRes});
  }
  
  bookGroupList.value = getSellGroupBookList(bookRes.lists, categoryRes.lists)
  handleChooseGroup(bookGroupList.value[0])
}

onLoad(async (opt) => {
  options.value = opt
 initData()
})

const handleChooseGroup = (item:any) => {
  curSelectGroup.value = item
  curSelectBook.value = item.bookList[0]
  curSelectBook.value.orderInfo = {}
}

const handleChooseBook = (item:any) => {
  curSelectBook.value = item
  curSelectBook.value.orderInfo = {}
}

const handleShowPayType = async() => {
  const res = await bookService.getPayWayTypeList({
    from: 'order',
    orderId: curSelectBook.value.orderInfo.orderId,
  })
  showPayPopup.value = true
  payTypeList.value = res.list || []
}

const handleBuy = async() => {
  let book = curSelectBook.value
  let params = {
    _showLoading: true,
    payAmount: book.price,
    courseId: book.targetId,
    productId: book.id,
  }
  const res = await bookService.addBookOrder(params)
  curSelectBook.value.orderInfo = {}
  curSelectBook.value.orderInfo.orderId = res?.orderId
  handleShowPayType()
}

const handleChoosePayType = (item:any) => {
  payTypeList.value.forEach((val:any) => {
    val._checked = false
  })
  item._checked = true
  curSelectBook.value.orderInfo.payWay = item.payWay
}

const handleConfirmBuy = async()=> {
  let book = curSelectBook.value
  let errMsg = []
  if(!book.orderInfo.payWay) {
    errMsg.push('请选择支付方式')
  }
  if(errMsg.length > 0) {
    showToast(errMsg[0])
    return
  }
  let params = {
    _showLoading: true,
    scene: 'order',
    orderAmount: book.price,
    orderId: book.orderInfo.orderId,
    payWay: book.orderInfo.payWay,
  }
  await bookService.confirmPayOrder(params)
  showToast('购买成功')
  showPayPopup.value = false
}

</script>

<style scoped lang="scss">
.buybook-container {
  height: 100%;
}

// Banner部分
.banner-section {
  width: 100%;
  overflow: hidden;
}

.banner-bg {
  width: 100%;
  height: 500rpx;
}

// 课程标签
.course-tabs {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: auto;
}

.tab-item {
  flex-shrink: 0;
  width: 30%;
  text-align: center;
  padding: 26rpx 0;
  font-size: 30rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: $u-type-primary;
  font-weight: bold;
  background-color: #fff;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 100rpx;
  margin-left: -50rpx;
  left: 50%;
  height: 4rpx;
  background-color: $u-type-primary;
}

// 课程套餐
.course-packages {
  padding: 40rpx;
  background-color: #fff;
}

.package-item {
  display: flex;
  gap: 20rpx;
  align-items: center;
  padding: 20rpx 20rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  background-color: #fafafa;
  border: 2rpx solid #f7f5f2;
}

.package-item.primary {
  border-color: $u-type-primary;
}
.package-cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
}
.package-header {
  display: flex;
  align-items: center;
}

.package-title {
  font-size: 28rpx;
  color: #333;
  margin-right: 10rpx;
}

.package-arrow {
  font-size: 20rpx;
  color: #666;
}

.package-price {
  margin-top: 10rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.current-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
  margin-right: 10rpx;
}

.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}

// 权益详情
.benefits-section {
  padding: 40rpx;
  background-color: #fff;
  margin-top: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.benefits-image {
  width: 100%;
  height: 240rpx;
  border-radius: 12rpx;
}

// 优惠提示
.discount-tip {
  padding: 20rpx 40rpx;
  margin: 40rpx;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8rpx;
}

.discount-text {
  font-size: 24rpx;
  color: #ff4d4f;
}

// 底部购买按钮
.footer {
  padding: 30rpx;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
}

.buy-button {
  background-color: $u-type-primary;
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  text-align: center;
  padding: 22rpx;
  border-radius: 88rpx;
}

.pay-type-container{
  padding: 20rpx 30rpx;
}
.pay-type-title{
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 30rpx;
  font-weight: bold;
}
.pay-type-list{
  margin-top: 10rpx;
  margin-bottom: 30rpx;
}
.pay-type-item {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 20rpx 10rpx;
  position: relative;
  &.active {
    color: $u-type-primary;
    font-weight: bold;
  }
}
.pay-type-icon{
  width: 60rpx;
  height: 60rpx;
}
.pay-type-name{
  flex: 1 0 0;
  font-size: 28rpx;
}
</style>