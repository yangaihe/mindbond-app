<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Back Button -->
        <view class="back-header fade-in">
          <view class="btn-back" @click="goBack">
            <text class="fas fa-arrow-left"></text>
          </view>
          <view class="back-text">返回</view>
        </view>

        <!-- Page Title -->
        <view class="page-title fade-in">我的订阅</view>

        <!-- Subscription Status Card -->
        <view class="subscription-card fade-in" style="animation-delay: 0.1s">
          <view class="subscription-header">
            <view>
              <view class="subscription-status">
                <text class="fas fa-circle"></text> 订阅中
              </view>
              <view class="subscription-name">MindBond 年度会员</view>
              <view class="subscription-period">
                <text class="fas fa-calendar"></text> 有效期至 2026年1月9日 · 剩余 365 天
              </view>
            </view>
            <view class="btn-receipt">
              <text class="fas fa-receipt"></text>
            </view>
          </view>
          <view class="divider"></view>
          <view class="subscription-footer">
            <view class="subscription-promo">
              <text class="fas fa-gift"></text> 续费立减 ¥100
            </view>
            <view class="btn-renew">续费</view>
          </view>
        </view>

        <!-- Current Month Book -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.2s">
          <view>本月共读</view>
          <view @click="goToBookroom">进入书房</view>
        </view>

        <view class="current-book fade-in" style="animation-delay: 0.2s" @click="goToBookroom">
          <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop"
            class="current-book-cover" mode="aspectFill"></image>
          <view class="current-book-info">
            <view>
              <view class="current-book-month">
                <text class="fas fa-calendar-day"></text> 1月
              </view>
              <view class="current-book-title">被讨厌的勇气</view>
              <view class="current-book-author">岸见一郎 / 古贺史健</view>
            </view>
            <view>
              <view class="progress">
                <view class="progress-bar" style="width: 45%"></view>
              </view>
              <view class="current-book-progress">已完成 45% · 第三章</view>
            </view>
          </view>
        </view>

        <!-- Class Info -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.25s">
          <view>我的班级</view>
        </view>

        <view class="class-info-list fade-in" style="animation-delay: 0.25s">
          <view class="schedule-info">
            <view class="schedule-icon" style="background: rgba(244, 208, 63, 0.2)">
              <text class="fas fa-users" style="color: #f4d03f;"></text>
            </view>
            <view class="schedule-detail">
              <view>觉醒者 · 3班（晚读）</view>
              <view>10人小班 · 班长：李静</view>
            </view>
          </view>
          <view class="schedule-info">
            <view class="schedule-icon" style="background: rgba(93, 173, 226, 0.2)">
              <text class="fas fa-clock" style="color: #5dade2;"></text>
            </view>
            <view class="schedule-detail">
              <view>每晚 20:55 - 22:00</view>
              <view>共读时间 · 已坚持 18 天</view>
            </view>
          </view>
          <view class="schedule-info">
            <view class="schedule-icon" style="background: rgba(88, 214, 141, 0.2)">
              <text class="fas fa-video" style="color: #58d68a;"></text>
            </view>
            <view class="schedule-detail">
              <view>下次班会：1月12日 周日</view>
              <view>20:00 开始人答疑直播</view>
            </view>
          </view>
        </view>

        <!-- Reading History -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.3s">
          <view>往期书单</view>
          <view class="section-count">共 3 本</view>
        </view>

        <view class="history-list fade-in" style="animation-delay: 0.3s">
          <view v-for="book in historyBooks" :key="book.title" class="history-item">
            <image :src="book.cover" class="history-cover" mode="aspectFill"></image>
            <view class="history-info">
              <view>{{ book.title }}</view>
              <view>{{ book.month }} · {{ book.class }}</view>
            </view>
            <view class="history-badge">已完成</view>
          </view>
        </view>

        <!-- Upcoming -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.35s">
          <view>即将共读</view>
        </view>

        <view class="upcoming-item fade-in" style="animation-delay: 0.35s">
          <image src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=120&h=160&fit=crop"
            class="upcoming-cover" mode="aspectFill"></image>
          <view class="upcoming-info">
            <view>活出生命的意义</view>
            <view>2月 · 维克多尔</view>
          </view>
          <view class="upcoming-badge">即将开始</view>
        </view>

        <!-- Bottom Spacing -->
        <view style="height: 40rpx;"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
// @ts-ignore - uni API is available in uniapp environment

const historyBooks = [
  {
    title: '非暴力沟通',
    month: '12月',
    class: '觉醒者3班',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&h=160&fit=crop'
  },
  {
    title: '曾国藩传',
    month: '11月',
    class: '觉醒者3班',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=120&h=160&fit=crop'
  },
  {
    title: '少有人走的路',
    month: '10月',
    class: '觉醒者3班',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=120&h=160&fit=crop'
  }
]

const goBack = () => {
  // @ts-ignore
  uni.navigateBack()
}

const goToBookroom = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/bookroom'
  })
}
</script>

<style scoped>
.fas {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}

/* Back Header */
.back-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.btn-back {
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 20rpx;
  color: #ffffff;
  cursor: pointer;
}

.back-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* Page Title */
.page-title {
  color: #ffffff;
  font-size: 48rpx;
  font-weight: 700;
  margin-bottom: 40rpx;
}

/* Subscription Card */
.subscription-card {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(243, 156, 18, 0.08) 100%);
  border-radius: 32rpx;
  padding: 40rpx;
  border: 1px solid rgba(244, 208, 63, 0.2);
  margin-bottom: 40rpx;
}

.subscription-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.subscription-status {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 24rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #58d68a;
  font-weight: 600;
}

.subscription-status text {
  font-size: 20rpx;
}

.subscription-name {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: 700;
  margin-top: 12rpx;
}

.subscription-period {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8rpx;
}

.subscription-period text {
  margin-right: 8rpx;
}

.btn-receipt {
  padding: 20rpx 24rpx;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 20rpx;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.divider {
  height: 2rpx;
  background: rgba(255, 255, 255, 0.1);
  margin: 32rpx 0;
}

.subscription-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subscription-promo {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
}

.subscription-promo text {
  margin-right: 8rpx;
  color: #f4d03f;
}

.btn-renew {
  padding: 20rpx 40rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border: none;
  border-radius: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-header>view:nth-child(1) {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
}

.section-header>view:nth-child(2) {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
}

.section-count {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* Current Book */
.current-book {
  display: flex;
  gap: 32rpx;
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  margin-bottom: 40rpx;
  cursor: pointer;
}

.current-book-cover {
  width: 160rpx;
  height: 214rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
}

.current-book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.current-book-month {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 12rpx;
  font-size: 20rpx;
  color: #1a1a2e;
  font-weight: 600;
}

.current-book-title {
  font-size: 34rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 16rpx;
}

.current-book-author {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
}

.progress {
  height: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 4rpx;
}

.current-book-progress {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 6rpx;
}

/* Schedule Info */
.class-info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.schedule-info {
  display: flex;
  gap: 24rpx;
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
}

.schedule-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}

.schedule-detail {
  flex: 1;
}

.schedule-detail view {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.schedule-detail>view:last-child {
  margin-bottom: 0;
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  cursor: pointer;
}

.history-cover {
  width: 96rpx;
  height: 128rpx;
  border-radius: 12rpx;
}

.history-info {
  flex: 1;
}

.history-info>view {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.history-info>view:last-child {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.history-badge {
  padding: 8rpx 20rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #58d68a;
}

/* Upcoming */
.upcoming-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.upcoming-cover {
  width: 96rpx;
  height: 128rpx;
  border-radius: 12rpx;
  opacity: 0.7;
}

.upcoming-info {
  flex: 1;
}

.upcoming-info>view {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  margin-bottom: 4rpx;
}

.upcoming-badge {
  padding: 8rpx 20rpx;
  background: rgba(93, 173, 226, 0.2);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #5dade2;
}

/* Utilities */
.mt-lg {
  margin-top: 48rpx;
}

/* Animations */
.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
