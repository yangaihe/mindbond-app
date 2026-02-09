<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <view class="flex items-center justify-between mb-md fade-in">
          <view class="btn btn-secondary btn-sm" style="padding: 16rpx 24rpx;" @click="goBack">
            <view class="fas fa-arrow-left"></view>
          </view>
          <view class="btn btn-secondary btn-sm" style="padding: 16rpx 24rpx;">
            <view class="fas fa-ellipsis-h"></view>
          </view>
        </view>

        <view class="class-header fade-in" style="animation-delay: 0.1s;">
          <view class="class-icon">
            <view class="fas fa-users"></view>
          </view>
          <view class="class-name">觉醒者 · 3班</view>
          <view class="class-desc">每晚 20:00 一起读书，一起成长</view>
          <view class="class-tags">
            <view class="badge badge-gold">被讨厌的勇气</view>
            <view class="badge badge-blue">第2周</view>
          </view>
        </view>

        <view class="class-stats fade-in" style="animation-delay: 0.15s;">
          <view class="class-stat-item">
            <view class="class-stat-value">10</view>
            <view class="class-stat-label">成员</view>
          </view>
          <view class="class-stat-item">
            <view class="class-stat-value">14</view>
            <view class="class-stat-label">共读天数</view>
          </view>
          <view class="class-stat-item">
            <view class="class-stat-value">42h</view>
            <view class="class-stat-label">累计时长</view>
          </view>
          <view class="class-stat-item">
            <view class="class-stat-value">92%</view>
            <view class="class-stat-label">出勤率</view>
          </view>
        </view>

        <view class="section-header fade-in" style="animation-delay: 0.2s;">
          <view>共读进度</view>
        </view>

        <view class="reading-progress-card fade-in" style="animation-delay: 0.2s; margin-bottom: 40rpx;">
          <view class="book-progress-header">
            <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop"
              class="book-progress-cover" mode="aspectFill"></image>
            <view class="book-progress-info">
              <view>被讨厌的勇气</view>
              <view>第2周 · 课题分离</view>
            </view>
            <view class="book-progress-percent">45%</view>
          </view>
          <view class="progress">
            <view class="progress-bar" style="width: 45%;"></view>
          </view>
        </view>

        <view class="section-header fade-in" style="animation-delay: 0.25s;">
          <view>班委</view>
        </view>

        <view class="leader-card fade-in" style="animation-delay: 0.25s;">
          <image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
            class="leader-avatar" mode="aspectFill"></image>
          <view class="leader-info">
            <view>小雨</view>
            <view>已带班 3 期 · 好评率 98%</view>
            <view class="leader-role">
              <text class="fas fa-crown"></text> 班长
            </view>
          </view>
        </view>

        <view class="card fade-in" style="animation-delay: 0.25s; padding: 32rpx;">
          <view class="flex items-center gap-md">
            <image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              class="avatar" style="width: 96rpx; height: 96rpx;" mode="aspectFill"></image>
            <view>
              <view style="font-size: 28rpx; color: var(--text-primary);">明哥</view>
              <view class="text-sm text-muted">副班长 · 负责签到</view>
            </view>
          </view>
        </view>

        <view class="section-header fade-in mt-lg" style="animation-delay: 0.3s;">
          <view>本周安排</view>
          <view class="text-sm text-muted">10人</view>
        </view>

        <view v-for="(schedule, index) in schedules" :key="schedule.id" class="schedule-card fade-in"
          :style="{ animationDelay: `${0.3 + index * 0.05}s` }">
          <view class="schedule-header">
            <view class="schedule-icon" :style="{ background: schedule.iconBg }">
              <view :class="schedule.icon" :style="{ color: schedule.iconColor }"></view>
            </view>
            <view class="schedule-title">{{ schedule.title }}</view>
            <view class="schedule-time">{{ schedule.time }}</view>
          </view>
          <view class="schedule-desc">{{ schedule.desc }}</view>
        </view>

        <view class="section-header fade-in mt-lg" style="animation-delay: 0.4s;">
          <view>班级成员</view>
          <view class="text-sm text-muted">10人</view>
        </view>

        <view class="card fade-in flex flex-col gap-[20rpx]" style="animation-delay: 0.4s; padding: 30rpx ;">
          <view v-for="member in members" :key="member.id" class="member-item">
            <image :src="member.avatar" class="member-avatar" mode="aspectFill"></image>
            <view class="member-info">
              <view class="member-name">
                {{ member.name }}
                <view v-if="member.role" :style="{ color: member.roleColor, fontSize: '24rpx' }">{{ member.role }}
                </view>
              </view>
              <view class="member-stats">{{ member.stats }}</view>
            </view>
            <view class="member-badge" :class="member.badgeClass">{{ member.badgeText }}</view>
          </view>
        </view>

        <view style="height: 40rpx;"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'


const router = useRouter()

const schedules = [
  {
    id: 1,
    title: '每日共读',
    time: '20:00 - 21:00',
    icon: 'fas fa-book',
    iconBg: 'rgba(244, 208, 63, 0.2)',
    iconColor: 'var(--accent-gold)',
    desc: '第8-14讲：深入理解课题分离'
  },
  {
    id: 2,
    title: '周六班会',
    time: '20:00 - 22:00',
    icon: 'fas fa-video',
    iconBg: 'rgba(231, 76, 60, 0.2)',
    iconColor: '#e74c3c',
    desc: '本周复盘 + 自测答题 + 下周预告'
  }
]

const members = [
  {
    id: 1,
    name: '小雨',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: '班长',
    roleColor: 'var(--accent-gold)',
    stats: '出勤 14/14 天 · 日记 12 篇',
    badgeClass: 'active',
    badgeText: '活跃'
  },
  {
    id: 2,
    name: '明哥',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: '副班长',
    roleColor: 'var(--accent-blue)',
    stats: '出勤 14/14 天 · 日记 10 篇',
    badgeClass: 'active',
    badgeText: '活跃'
  },
  {
    id: 3,
    name: '探索者',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    role: '',
    roleColor: '',
    stats: '出勤 13/14 天 · 日记 8 篇',
    badgeClass: 'active',
    badgeText: '活跃'
  },
  {
    id: 4,
    name: '阿杰',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    role: '',
    roleColor: '',
    stats: '出勤 12/14 天 · 日记 6 篇',
    badgeClass: 'normal',
    badgeText: '普通'
  },
  {
    id: 5,
    name: '晓晓',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: '',
    roleColor: '',
    stats: '出勤 11/14 天 · 日记 5 篇',
    badgeClass: 'normal',
    badgeText: '普通'
  }
]

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.class-header {
  text-align: center;
  padding: 48rpx 0;
  margin-bottom: 40rpx;
}

.class-icon {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72rpx;
  color: #1a1a2e;
  margin: 0 auto 32rpx;
}

.class-name {
  font-size: 48rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 16rpx;
}

.class-desc {
  font-size: 28rpx;
  color: var(--text-muted);
  margin-bottom: 32rpx;
}

.class-tags {
  display: flex;
  justify-content: center;
  gap: 16rpx;
}

.class-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-bottom: 48rpx;
}

.class-stat-item {
  text-align: center;
  padding: 32rpx 16rpx;
  background: var(--bg-card);
  border-radius: 24rpx;
}

.class-stat-value {
  font-size: 40rpx;
  color: var(--accent-gold);
  font-weight: 700;
}

.class-stat-label {
  font-size: 22rpx;
  color: var(--text-muted);
  margin-top: 8rpx;
}

.leader-card {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 40rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.1) 0%, rgba(243, 156, 18, 0.05) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: 24rpx;
  border: 2rpx solid rgba(244, 208, 63, 0.2);
}

.leader-avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  object-fit: cover;
  border: 6rpx solid var(--accent-gold);
}

.leader-info view {
  font-size: 32rpx;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.leader-info view {
  font-size: 26rpx;
  color: var(--text-muted);
  margin-bottom: 16rpx;
}

.leader-role {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 24rpx;
  font-size: 22rpx;
  color: #1a1a2e;
  font-weight: 600;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.08);
}

.member-item:last-child {
  border-bottom: none;
}

.member-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  object-fit: cover;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.member-stats {
  font-size: 24rpx;
  color: var(--text-muted);
}

.member-badge {
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  font-size: 22rpx;
}

.member-badge.active {
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.member-badge.normal {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
}

.reading-progress-card {
  padding: 40rpx;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
}

.book-progress-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.book-progress-cover {
  width: 96rpx;
  height: 128rpx;
  border-radius: 12rpx;
  object-fit: cover;
}

.book-progress-info view {
  font-size: 30rpx;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.book-progress-info view {
  font-size: 24rpx;
  color: var(--text-muted);
}

.book-progress-percent {
  margin-left: auto;
  font-size: 48rpx;
  color: var(--accent-gold);
  font-weight: 700;
}

.schedule-card {
  padding: 32rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 24rpx;
}

.schedule-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.schedule-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.schedule-title {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.schedule-time {
  margin-left: auto;
  font-size: 24rpx;
  color: var(--text-muted);
}

.schedule-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.5;
  padding-left: 92rpx;
}

.progress {
  height: 12rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 6rpx;
}
</style>
