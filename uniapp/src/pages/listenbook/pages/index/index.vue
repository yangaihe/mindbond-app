<template>
  <view class="topbg" :style="`background-image: url('${getResourceUrl(topLogo.image)}')`"></view>
  <page-root :headOpt="{hideNavbar: true, backgroundColor: '' }">
    <template v-slot:header>
      <!-- 固定顶部栏 -->
      <view class="header-top">
        <!-- <image :src="getResourceUrl(topLogo.image)" style="width: 120rpx; height: 80rpx;" mode="aspectFill"></image> -->
        <view></view>
        <view @click="goto(allRoutePathMaps.listenbook.historylist)" class="flex items-center flex-col">
          <span class="xgn-iconfont xgn-time text-4xl"></span>
          <text class="history-text">历史记录</text>
        </view>

      </view>
    </template>

    <template v-slot:body>
      <view>
        <!-- 用户信息区域 -->
        <view @click="goto(allRoutePathMaps.userInfo)" class="user-profile block-space">
          <image :src="userInfo.avatar" class="avatar" mode="aspectFill"></image>
          <view class="user-info">
            <view v-if="isLogin">
              <text class="greeting">{{welcomeText}}</text>
              <text v-if="userInfo.nickname" class="username">，{{ userInfo.nickname }}</text>
            </view>
            <!-- <view v-if="isLogin" class="vip-badge">
              <text class="iconrenz xgn-iconfont xgn-renzheng"></text>
              <text class="vip-text"></text>
            </view> -->
            <view v-if="!isLogin">
              立即登录
            </view>
          </view>
        </view>

        <!-- 广告横幅轮播图 -->
        <view class="banner block-space">
          <swiper class="swiper-box" indicator-dots autoplay interval="3000" duration="500" circular
            indicator-active-color="#fff" indicator-color="#f3f4f6"
          >
            <swiper-item v-for="(item, index) in bannerList" :key="index"
              @click="designLinkClick(item.link)"
            >
              <image :src="getResourceUrl(item.image)" class="banner-image" mode="aspectFill"></image>
            </swiper-item>
          </swiper>
        </view>

        <!-- 功能入口 -->
        <view class="function-entries block-space">
          <view v-for="(item, index) in quickEntryList" :key="index"
            @click="designLinkClick(item.link)" class="entry-item"
          >
            <view class="entry-icon">
              <!-- <text class="xgn-iconfont xgn-liwu"></text> -->
              <image :src="getResourceUrl(item.image)" class="entry-image" mode="aspectFill"></image>
            </view>
            <text class="entry-text">{{item.name}}</text>
          </view>
        </view>

        <!-- 推荐内容 -->
        <view  v-for="item in recommendedContent" class="recommended-section block-space">
          <view class="section-header flex justify-between items-center">
            <text class="section-title">{{item.name}}</text>
            <!-- <view @click="goto(allRoutePathMaps.listenbook.editorInChiefIndex)" class="flex items-center section-more">
              <text>查看全部</text>
              <text class="xgn-jinru xgn-iconfont"></text>
            </view> -->
          </view>
          <view class="section-desc">
            {{item.description}}
          </view>

          <view class="content-list">
            <book-cover-item  v-for="bk in item.bookList" :key="bk.id" :data="bk"></book-cover-item>
          </view>
        </view>

      </view>
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
import { ref, onMounted } from 'vue';
import MinPlayer from '@/pages/listenbook/components/min-player/min-player.vue'
import BookCoverItem from '@/pages/listenbook/components/book-cover-item/book-cover-item.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import * as bookService from "@/api/course"
import { allRoutePathMaps, goto } from '@/utils/untool';
import { designLinkClick, getGroupBookList } from '@/utils/book';
import { getResourceUrl } from "@/utils/cdn"

const getCurrentDateWelcome = () => {
  const date = new Date();
  const day = date.getHours();
  console.log(day);
  if (day <= 10) return "早上好";
  if (day > 10 && day <= 13) return "中午好";
  if (day > 13 && day <= 17) return "下午好";
  if (day > 17) return "晚上好";
}

const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore)

// 页面状态
const status = ref('LOADING');
const bannerList = ref([] as any[]);
const quickEntryList = ref([] as any[]);
const topLogo = ref({} as any);
const popBanner = ref({} as any);

const recommendedContent = ref([
] as any);

const welcomeText = ref(getCurrentDateWelcome())

const initData = async()=>{
  
  let pageRes = await bookService.getIndexPageData()
  try {
    let pgList = JSON.parse(pageRes?.pages)
    bannerList.value = pgList.filter((t:any)=> t.name == 'banner')?.[0]?.content?.data || []
    quickEntryList.value = pgList.filter((t:any)=> t.name == 'nav')?.[0]?.content?.data || []
    topLogo.value = pgList.filter((t:any)=> t.name == 'top-backimg')?.[0]?.content || {}
    popBanner.value = pgList.filter((t:any)=> t.name == 'pop-banner')?.[0]?.content.data || []

    
  } catch (error) {
    console.error('解析banner列表失败:==========', {error, pageRes});
  }
  let bkRes = await bookService.getBookList()
  let bkGroupRes = await bookService.getBookGroups()
  recommendedContent.value = getGroupBookList(bkRes.lists, bkGroupRes.lists, 0)
}

onMounted(async() => {
  await initData()
  status.value = 'SUCCESS';
});

</script>

<style scoped lang="scss">
.topbg{
  position: absolute;
  top: 0;
  left: 0;
  // background: linear-gradient(to bottom, #F6F3EC, #F5F2EB, #f3f4f6);
  height: 200rpx;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.block-space {
  margin-left: 30rpx;
  margin-right: 30rpx;
  margin-bottom: 35rpx;
  border-radius: 20rpx;

  &:last-child {
    margin-bottom: 0;
    /* 可以根据需要设置最后一个元素的样式 */
  }

  background-color: #fff;
  box-shadow: 0 0 10rpx rgba(196, 196, 196, 0.1);
}

/* 固定顶部栏样式 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 30rpx 10rpx 30rpx;
  color: #4c4439;
}

.page-title {
  font-size: 66rpx;
  // height: 60rpx;
}

.history-text {
  font-size: 28rpx;
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
}

.user-info {
  margin-left: 20rpx;
}

.username,
.greeting {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.vip-badge {
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: #fbf3e8;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  gap: 8rpx;
}

.vip-text {
  font-size: 24rpx;
  color: #9b8d54;
  font-weight: bold;
}

.iconrenz {
  color: #9b8d54;
  font-size: 26rpx;
  font-weight: 600;
}

/* 广告横幅样式 */
.banner {
  border-radius: 20rpx;
  overflow: hidden;
}
.swiper-box,
.banner-image {
  width: 100%;
  height: 300rpx;
}

/* 功能入口样式 */
.function-entries {
  min-height: 130rpx;
  display: flex;
  justify-content: flex-start;
  gap: 50rpx;
  flex-wrap: wrap;
  padding: 30rpx;
  background-color: #fff;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.entry-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  margin-bottom: 16rpx;

  .xgn-iconfont {
    font-size: 60rpx;
    color: $u-type-warning-light;
  }
  .entry-image{
    width: 90rpx;
    height: 90rpx;
  }
}

.entry-text {
  font-size: 24rpx;
  color: #666;
}

/* 推荐内容样式 */
.recommended-section {
  background-color: #fff;
  padding: 30rpx;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 24rpx;
  color: #999;
}

.section-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.playercont {}</style>