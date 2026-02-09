<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Logo and Version -->
        <view class="about-header fade-in" style="animation-delay: 0.1s">
          <view class="app-logo">
            <text class="fas fa-brain"></text>
          </view>
          <view class="app-name">MindBond</view>
          <view class="app-slogan">心智共读，觉察成长</view>
          <view class="app-version">版本 1.0.0</view>
        </view>

        <!-- App Description -->
        <view class="about-card fade-in" style="animation-delay: 0.15s">
          <view class="about-desc">
            MindBond 是一款专注于心智成长的共读应用。我们相信，阅读不只是获取知识，更是一场内在的觉察之旅。
          </view>
          <view class="about-desc">
            通过小班制共读、觉察日记、成长报告等功能，帮助你在阅读中看见自己，在觉察中实现成长。
          </view>
        </view>

        <!-- Features -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.2s">
          <view>核心功能</view>
        </view>

        <view class="features-grid fade-in" style="animation-delay: 0.2s">
          <view class="feature-item">
            <view class="feature-icon feature-icon-gold">
              <text class="fas fa-users"></text>
            </view>
            <view class="feature-title">小班共读</view>
            <view class="feature-desc">10人小班制，每晚一起朗读</view>
          </view>
          <view class="feature-item">
            <view class="feature-icon feature-icon-blue">
              <text class="fas fa-feather"></text>
            </view>
            <view class="feature-title">觉察日记</view>
            <view class="feature-desc">记录觉察，看见内心</view>
          </view>
          <view class="feature-item">
            <view class="feature-icon feature-icon-green">
              <text class="fas fa-chart-line"></text>
            </view>
            <view class="feature-title">成长报告</view>
            <view class="feature-desc">AI分析，量化成长</view>
          </view>
          <view class="feature-item">
            <view class="feature-icon feature-icon-pink">
              <text class="fas fa-headphones"></text>
            </view>
            <view class="feature-title">听书房</view>
            <view class="feature-desc">200本好书随时听</view>
          </view>
        </view>

        <!-- Links -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.25s">
          <view>了解更多</view>
        </view>

        <view class="links-card fade-in" style="animation-delay: 0.25s">
          <view class="link-item" @click="openLink('official')">
            <text class="fas fa-globe"></text>
            <view>官方网站</view>
            <text class="fas fa-chevron-right"></text>
          </view>
          <view class="link-item" @click="openLink('wechat')">
            <text class="fab fa-weixin"></text>
            <view>关注公众号</view>
            <text class="fas fa-chevron-right"></text>
          </view>
          <view class="link-item" @click="openLink('community')">
            <text class="fas fa-comment-dots"></text>
            <view>加入社群</view>
            <text class="fas fa-chevron-right"></text>
          </view>
        </view>

        <!-- Legal -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.3s">
          <view>法律信息</view>
        </view>

        <view class="links-card fade-in" style="animation-delay: 0.3s">
          <view class="link-item" @click="openLink('privacy')">
            <text class="fas fa-shield-alt"></text>
            <view>隐私政策</view>
            <text class="fas fa-chevron-right"></text>
          </view>
          <view class="link-item" @click="openLink('terms')">
            <text class="fas fa-file-contract"></text>
            <view>用户协议</view>
            <text class="fas fa-chevron-right"></text>
          </view>
          <view class="link-item" @click="openLink('license')">
            <text class="fas fa-balance-scale"></text>
            <view>开源许可</view>
            <text class="fas fa-chevron-right"></text>
          </view>
        </view>

        <!-- Footer -->
        <view class="about-footer fade-in" style="animation-delay: 0.35s">
          <view class="copyright">Copyright 2024 MindBond</view>
          <view class="company">北京心智成长科技有限公司</view>
          <view class="icp">京ICP备xxxxxxxx号</view>
        </view>

        <view style="height: 40rpx"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">

</script>

<style scoped>
.fas {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}

.fab {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48rpx;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 24rpx;
  color: #ffffff;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.page-title {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 600;
}

/* About Header */
.about-header {
  text-align: center;
  padding: 60rpx 40rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(243, 156, 18, 0.08) 100%);
  border-radius: 32rpx;
  margin-bottom: 40rpx;
}

.app-logo {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32rpx;
  font-size: 72rpx;
  color: #1a1a2e;
}

.app-name {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.app-slogan {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24rpx;
}

.app-version {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
  padding: 8rpx 24rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  display: inline-block;
}

/* About Card */
.about-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 40rpx;
}

.about-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin-bottom: 24rpx;
}

.about-desc:last-child {
  margin-bottom: 0;
}

/* Section Header */
.section-header {
  margin-bottom: 24rpx;
}

.section-header view {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.feature-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  text-align: center;
}

.feature-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin: 0 auto 24rpx;
}

.feature-icon-gold {
  background: rgba(244, 208, 63, 0.2);
  color: #f4d03f;
}

.feature-icon-blue {
  background: rgba(93, 173, 226, 0.2);
  color: #5dade2;
}

.feature-icon-green {
  background: rgba(88, 214, 141, 0.2);
  color: #58d68d;
}

.feature-icon-pink {
  background: rgba(248, 165, 194, 0.2);
  color: #f8a5c2;
}

.feature-title {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.feature-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* Links Card */
.links-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  overflow: hidden;
}

.link-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.link-item:last-child {
  border-bottom: none;
}

.link-item>text:nth-child(1) {
  width: 40rpx;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 32rpx;
  margin-right: 24rpx;
}

.link-item>view:nth-child(2) {
  flex: 1;
  font-size: 30rpx;
  color: #ffffff;
}

.link-item>text:nth-child(3) {
  color: rgba(255, 255, 255, 0.3);
  font-size: 24rpx;
}

/* About Footer */
.about-footer {
  text-align: center;
  padding: 48rpx 0;
}

.about-footer view {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8rpx;
}

.copyright {
  margin-bottom: 16rpx !important;
}

/* Utilities */
.mt-lg {
  margin-top: 48rpx;
}
</style>
