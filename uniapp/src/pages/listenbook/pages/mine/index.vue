<template>
  <page-root :headOpt="{hideNavbar: true, backgroundColor: '' }">
    <template v-slot:header>
      <!-- 用户信息区域 -->
      <view @click="goto(allRoutePathMaps.userInfo)" class="user-info-section block-space nobg">
        <view class="user-avatar">
          <image :src="userInfo.avatar" mode="aspectFill"></image>
        </view>
        <view class="user-details">
          <view class="flex items-center">
            <text class="user-name">{{ userInfo.nickname }}</text>
            <text v-if="!isLogin">立即登录</text>
            <text class="xgn-jinru xgn-iconfont"></text>
          </view>
          <view class="user-phone">{{ userInfo.mobile }}</view>
        </view>
      </view>
    </template>
    <template v-slot:body>
      <!-- 统计信息 -->
      <view class="stats-section block-space">
        <view class="stat-item">
          <view class="stat-number">0</view>
          <view class="stat-label">已享权益</view>
        </view>
        <!-- <view class="stat-item">
          <view class="stat-number">0</view>
          <view class="stat-label">训练营</view>
        </view> -->
        <view class="stat-item">
          <view class="stat-number">0
            <!-- <text class="dot">●</text> -->
          </view>
          <view class="stat-label">优惠券</view>
        </view>
        <view class="stat-item">
          <view class="stat-number">0</view>
          <view class="stat-label">礼品卡</view>
        </view>
      </view>

      <!-- 我的历史 -->
      <view class="history-section block-space">
        <view class="section-header">
          <view class="section-title">我的历史</view>
          <view class="section-more" @click="goto(allRoutePathMaps.listenbook.historylist)">
            查看更多
            <text class="xgn-jinru xgn-iconfont"></text>
          </view>
        </view>
        <view class="history-books">
          <view class="book-item" v-for="book in historyLearnList" :key="book.id"
            @click="goto(`${allRoutePathMaps.listenbook.playerIndex}?bookId=${book.courseId}&lessonId=${book.lessonId}`)">
            <view class="book-cover"> 
              <image :src="book.lessonImage" mode="aspectFill"></image>
              <view class="progress-bar">
                <view class="progress" :style="{ width: book._learnPercent + '%' }"></view>
              </view>
              <view class="progress-text">已学{{ book._learnPercent }}%</view>
            </view>
            <view class="book-title">{{ book.lessonName }}</view>
          </view>
        </view>
        <u-empty v-if="historyLearnList.length == 0" ></u-empty>
      </view>

      <!-- 我的服务 -->
      <view class="services-section block-space">
        <view class="section-header">
          <view class="section-title">我的服务</view>
        </view>
        <view class="services-grid">
          <view class="service-item" v-for="service in services" :key="service.id" @click="goto(service.url)">
            <view :class="`service-icon ${service.icon}`"></view>
            <view class="service-name">{{ service.name }}</view>
          </view>
        </view>
      </view>
      <view v-if="appInfo._appVersion" class="version-info">版本号 {{ appInfo._appVersion }}</view>
      <view style="height: 10rpx;"></view>
    </template>
    <template v-slot:footer>
      <!-- 播放器 -->
      <view class="playercont">
        <min-player></min-player>
      </view>

    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShow} from '@dcloudio/uni-app';
import MinPlayer from '@/pages/listenbook/components/min-player/min-player.vue'
import { goto, allRoutePathMaps } from '@/utils/untool'
import { getCurrentAppInfo } from '@/utils/appUpdate'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import * as bookService from "@/api/course"

const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore)

// 模拟历史书籍数据
const historyLearnList = ref([
  
] as any);

const appInfo = ref({} as any)


// 模拟服务数据
const services = ref([
  {
    id: 1,
    icon: 'xgn-iconfont xgn-order',
    name: '订单记录',
    url: allRoutePathMaps.listenbook.orderList,
  },
  {
    id: 2,
    icon: 'xgn-iconfont xgn-bindphone',
    name: '绑定手机号',
    url: allRoutePathMaps.bindMobile,
  },
  {
    id: 3,
    icon: 'xgn-iconfont xgn-duihuan-circle',
    name: '兑换中心',
    url: allRoutePathMaps.listenbook.sncodeEchange,
  },
  {
    id: 4,
    icon: 'xgn-iconfont xgn-kefu',
    name: '联系客服',
    url: allRoutePathMaps.contactUs,
  },
  {
    id: 5,
    icon: 'xgn-iconfont xgn-yinsi',
    name: '隐私相关',
    url: allRoutePathMaps.listenbook.sysSetting,
  }
]);

const initData = async () => {
  const stRes = await bookService.getBookLessonStudyHistoryList({
    pageNum: 1,
    pageSize: 3,
  })
  historyLearnList.value = (stRes.lists || []).map((item:any) => ({
    ...item,
    _learnPercent: Math.round((item.progress/item.lessonDuration)*100),
  }))
  appInfo.value = await getCurrentAppInfo()
}

onLoad(() => {
  initData()
})

onShow(() => {
  initData()
})

</script>

<style scoped lang="scss">

.block-space {
  margin-left: 30rpx;
  margin-right: 30rpx;
  margin-bottom: 35rpx;
  border-radius: 20rpx;
  &:last-child {
    margin-bottom: 0; /* 可以根据需要设置最后一个元素的样式 */
  }
  background-color: #fff;
  box-shadow: 0 0 10rpx rgba(196, 196, 196, 0.1);
  &.nobg{
    background-color: transparent;
    box-shadow: none;
  }
}

.user-info-section {
  display: flex;
  align-items: center;
  gap: 30rpx;
  padding: 40rpx 0 20rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
}

.user-avatar image {
  width: 100%;
  height: 100%;
}

.user-details {
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.user-phone {
  font-size: 28rpx;
  color: #999;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 30rpx 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  position: relative;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.dot {
  color: #ff4d4f;
  font-size: 26rpx;
  position: absolute;
  top: 0;
  right: -26rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.history-section {
  padding: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 28rpx;
  color: #999;
  display: flex;
  align-items: center;
}

.iconfont {
  font-size: 24rpx;
  margin-left: 8rpx;
}

.history-books {
  display: flex;
  gap: 30rpx;
  overflow-x: auto;
}

.history-books::-webkit-scrollbar {
  display: none;
}

.book-item {
  flex-shrink: 0;
  width: 180rpx;
}

.book-cover {
  position: relative;
  width: 180rpx;
  height: 240rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #f0f0f0;
  margin-bottom: 16rpx;
}

.book-cover image {
  width: 100%;
  height: 100%;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6rpx;
  background-color: rgba(0, 0, 0, 0.2);
}

.progress {
  height: 100%;
  background-color: #1677ff;
}

.progress-text {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
}

.book-title {
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.services-section {
  padding: 30rpx;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.service-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 16rpx;
  // color: $u-type-primary;
  font-weight: 600;
}
.xgn-bindphone,.xgn-duihuan-circle{
  font-size: 56rpx;
}

.service-name {
  font-size: 24rpx;
  color: #666;
}
.version-info{
  text-align: center;
  color: #999;
  padding: 30rpx;
}
</style>