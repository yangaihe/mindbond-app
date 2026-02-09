<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Profile Header with Stats -->
        <view class="profile-header fade-in">
          <view class="profile-top">
            <view class="avatar-container" @click="goToEditProfile">
              <image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                class="profile-avatar" mode="aspectFill"></image>
              <view class="avatar-edit-hint">
                <text class="fas fa-camera"></text>
              </view>
            </view>
            <view class="profile-info">
              <view class="profile-name">探索者</view>
              <view class="profile-days">加入 MindBond 第 23 天</view>
              <view class="profile-badges">
                <text class="badge badge-gold">
                  <text class="fas fa-fire"></text>&nbsp;7天连续
                </text>
                <text v-if="hasClass" class="badge badge-blue">
                  <text class="fas fa-book"></text>&nbsp;觉醒者3班
                </text>
              </view>
            </view>
          </view>
          <!-- Growth Insight -->
          <view class="growth-insight">
            <text class="growth-insight-text">{{ growthInsight }}</text>
          </view>
        </view>

        <!-- My Growth Section -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.1s">
          <view>我的成长</view>
        </view>

        <view class="card fade-in list-card" style="animation-delay: 0.1s">
          <!-- Class Row (for users with class) -->
          <view v-if="hasClass" class="list-item" @click="goToClassDetail">
            <view class="list-icon list-icon-gold">
              <text class="fas fa-users"></text>
            </view>
            <view class="list-content">
              <view class="list-title">觉醒者 · 3班</view>
              <view class="list-subtitle">10人小班 · 每晚 20:55 共读</view>
            </view>
            <text class="fas fa-chevron-right list-arrow"></text>
          </view>

          <!-- Join Class Prompt (for users without class) -->
          <view v-else class="list-item join-class-prompt" @click="goToMembership">
            <view class="list-icon list-icon-green">
              <text class="fas fa-seedling"></text>
            </view>
            <view class="list-content">
              <view class="list-title">开启深度共读之旅</view>
              <view class="list-subtitle">加入共读营，与10人小班一起成长</view>
            </view>
            <text class="join-btn">了解</text>
          </view>

          <view class="list-item" @click="goToReport">
            <view class="list-icon list-icon-purple">
              <text class="fas fa-chart-line"></text>
            </view>
            <view class="list-content">
              <view class="list-title">成长报告</view>
              <view class="list-subtitle">本周觉察 12 篇 · 情绪稳定度 ↑15%</view>
            </view>
            <text class="fas fa-chevron-right list-arrow"></text>
          </view>

          <view class="list-item" @click="goToCalendar">
            <view class="list-icon list-icon-blue">
              <text class="fas fa-calendar-check"></text>
            </view>
            <view class="list-content">
              <view class="list-title">成长日历</view>
              <view class="list-subtitle">连续 23 天 · 最长 45 天</view>
            </view>
            <text class="fas fa-chevron-right list-arrow"></text>
          </view>

          <view class="list-item" @click="goToFavorites">
            <view class="list-icon list-icon-pink">
              <text class="fas fa-bookmark"></text>
            </view>
            <view class="list-content">
              <view class="list-title">我的收藏</view>
              <view class="list-subtitle">8 篇日记 · 12 条金句</view>
            </view>
            <text class="fas fa-chevron-right list-arrow"></text>
          </view>
        </view>

        <!-- Membership Section -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.2s">
          <view>订阅与会员</view>
        </view>

        <view class="membership-card fade-in" style="animation-delay: 0.2s" @click="goToMembership">
          <view class="membership-info">
            <view class="membership-icon">
              <text class="fas fa-crown"></text>
            </view>
            <view class="membership-detail">
              <view class="membership-type">年度会员</view>
              <view class="membership-expire">有效期至 2026.01.09 · 剩余 365 天</view>
            </view>
          </view>
          <text class="fas fa-chevron-right membership-arrow"></text>
        </view>

        <!-- Settings Section -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.3s">
          <view>设置</view>
        </view>

        <view class="card fade-in list-card" style="animation-delay: 0.3s">
          <view class="list-item" @click="goToNotifications">
            <view class="list-icon">
              <text class="fas fa-bell"></text>
            </view>
            <view class="list-content">
              <view class="list-title">消息通知</view>
            </view>
            <view class="notification-dot"></view>
            <text class="fas fa-chevron-right list-arrow"></text>
          </view>

          <view class="list-item" @click="goToAccount">
            <view class="list-icon">
              <text class="fas fa-shield-alt"></text>
            </view>
            <view class="list-content">
              <view class="list-title">账号与安全</view>
            </view>
            <text class="fas fa-chevron-right list-arrow"></text>
          </view>

          <view class="list-item" @click="goToSettings">
            <view class="list-icon">
              <text class="fas fa-sliders"></text>
            </view>
            <view class="list-content">
              <view class="list-title">偏好设置</view>
              <view class="list-subtitle">提醒、隐私、日记可见范围</view>
            </view>
            <text class="fas fa-chevron-right list-arrow"></text>
          </view>

          <view class="list-item" @click="goToHelp">
            <view class="list-icon">
              <text class="fas fa-circle-question"></text>
            </view>
            <view class="list-content">
              <view class="list-title">帮助与反馈</view>
            </view>
            <text class="fas fa-chevron-right list-arrow"></text>
          </view>

          <view class="list-item" @click="goToAbout">
            <view class="list-icon">
              <text class="fas fa-info-circle"></text>
            </view>
            <view class="list-content">
              <view class="list-title">关于 MindBond</view>
              <view class="list-subtitle">版本 1.0.0</view>
            </view>
            <text class="fas fa-chevron-right list-arrow"></text>
          </view>
        </view>

        <!-- Bottom Spacing -->
        <view style="height: 40rpx"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

// 用户是否有班级（共读营用户有班级，纯听书房用户无班级）
const hasClass = ref(true) // 可以切换为 false 测试无班级状态

// 动态成长感言（实际应用中根据用户数据动态生成）
const growthInsight = computed(() => {
  // 这里可以根据不同条件返回不同的感言
  const insights = [
    '这周你记录了 5 次内心对话 ✨',
    '你的觉察力正在悄悄生长 🌱',
    '连续 7 天的觉察，每一天都是礼物',
    '本周情绪稳定度比上周提升了 15%'
  ]
  // 模拟返回一条感言，实际中应根据用户数据计算
  return insights[0]
})

const handleTabChange = (tab: string) => {
  const routes: Record<string, string> = {
    home: hasClass.value ? '/home' : '/home-visitor',
    bookroom: hasClass.value ? '/bookroom-hub' : '/audiobooks',
    journal: '/journal',
    plaza: '/plaza',
    profile: '/profile'
  }
  router.push(routes[tab] || '/')
}

const goToEditProfile = () => {
  router.push('/edit-profile')
}

const goToClassDetail = () => {
  router.push('/class-detail')
}

const goToReport = () => {
  router.push('/report')
}

const goToCalendar = () => {
  router.push('/growth-calendar')
}

const goToFavorites = () => {
  // TODO: 跳转到收藏页面
  router.push('/favorites')
}

const goToMembership = () => {
  router.push('/membership')
}

const goToNotifications = () => {
  // TODO: 跳转到消息通知页面
  router.push('/notifications')
}

const goToAccount = () => {
  // TODO: 跳转到账号安全页面
  router.push('/account')
}

const goToSettings = () => {
  router.push('/settings')
}

const goToHelp = () => {
  router.push('/help')
}

const goToAbout = () => {
  router.push('/about')
}
</script>

<style scoped>
/* Profile Header */
.profile-header {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.12) 0%, rgba(243, 156, 18, 0.06) 100%);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  margin-bottom: 16rpx;
}

.profile-top {
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 32rpx;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
}

.profile-avatar {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  border: 6rpx solid var(--accent-gold);
}

.avatar-edit-hint {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid var(--bg-tertiary);
}

.avatar-edit-hint text {
  font-size: 20rpx;
  color: #1a1a2e;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  color: var(--text-primary);
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 4rpx;
}

.profile-days {
  color: var(--text-muted);
  font-size: 24rpx;
  margin-bottom: 16rpx;
}

.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

/* Growth Insight */
.growth-insight {
  margin-top: 32rpx;
  padding-top: 28rpx;
  border-top: 2rpx solid rgba(255, 255, 255, 0.08);
  text-align: center;
}

.growth-insight-text {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-header view {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

/* Card */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.list-card {
  padding: 0;
}

/* List Items */
.list-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx 32rpx;
  cursor: pointer;
  transition: background 0.2s;
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.list-item:not(:last-child) {
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.05);
}

.list-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
  font-size: 32rpx;
  flex-shrink: 0;
}

.list-icon-gold {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.list-icon-blue {
  background: rgba(93, 173, 226, 0.2);
  color: var(--accent-blue);
}

.list-icon-green {
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.list-icon-purple {
  background: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
}

.list-icon-pink {
  background: rgba(248, 165, 194, 0.2);
  color: #f8a5c2;
}

.list-content {
  flex: 1;
  min-width: 0;
}

.list-title {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.list-subtitle {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-top: 4rpx;
}

.list-arrow {
  color: var(--text-muted);
  font-size: 24rpx;
  flex-shrink: 0;
}

/* Join Class Prompt */
.join-class-prompt {
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.08) 0%, rgba(46, 204, 113, 0.04) 100%);
}

.join-btn {
  padding: 12rpx 28rpx;
  background: linear-gradient(135deg, var(--accent-green) 0%, #27ae60 100%);
  border-radius: 28rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #1a1a2e;
  flex-shrink: 0;
}

/* Membership Card */
.membership-card {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(243, 156, 18, 0.08) 100%);
  border: 2rpx solid rgba(244, 208, 63, 0.25);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.membership-card:hover {
  border-color: rgba(244, 208, 63, 0.4);
}

.membership-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.membership-icon {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 36rpx;
  flex-shrink: 0;
}

.membership-detail {
  flex: 1;
}

.membership-type {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4rpx;
}

.membership-expire {
  font-size: 24rpx;
  color: var(--text-muted);
}

.membership-arrow {
  color: var(--accent-gold);
  font-size: 24rpx;
}

/* Notification Dot */
.notification-dot {
  width: 16rpx;
  height: 16rpx;
  background: #e74c3c;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.badge-gold {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.badge-blue {
  background: rgba(93, 173, 226, 0.2);
  color: var(--accent-blue);
}

/* Utilities */
.mt-lg {
  margin-top: 40rpx;
}
</style>