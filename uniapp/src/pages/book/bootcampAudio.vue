<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Page Header -->
        <view class="page-header fade-in">
          <view class="back-btn" @click="goBack">
            <view class="fas fa-arrow-left"></view>
          </view>
          <view class="page-title">音频课程</view>
        </view>

        <!-- Book Info Header -->
        <view class="book-info-header fade-in" style="animation-delay: 0.1s">
          <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop"
            class="book-cover-sm" mode="aspectFill"/>
          <view class="book-info-content">
            <view class="book-info-label">1月期共读营</view>
            <view class="book-info-title">被讨厌的勇气</view>
            <view class="book-info-author">岸见一郎 / 古贺史健</view>
            <view class="book-info-meta">
              <view class="book-info-meta-item">
                <view class="fas fa-headphones"></view> 28讲
              </view>
              <view class="book-info-meta-item">
                <view class="fas fa-clock"></view> 6小时
              </view>
            </view>
          </view>
        </view>

        <!-- Progress Card -->
        <view class="progress-card fade-in" style="animation-delay: 0.15s">
          <view class="progress-header">
            <view class="progress-title">学习进度</view>
            <view class="progress-value">12/28 讲 · 43%</view>
          </view>
          <view class="progress">
            <view class="progress-bar" style="width: 43%"></view>
          </view>
          <view class="progress-stats">
            <view class="progress-stat completed">
              <view class="fas fa-check-circle"></view> 已完成 12讲
            </view>
            <view class="progress-stat remaining">
              <view class="fas fa-clock"></view> 剩余 16讲
            </view>
          </view>
        </view>

        <!-- Week 1 -->
        <view class="week-section fade-in" style="animation-delay: 0.2s">
          <view class="week-header">
            <view class="week-title">第一周 · 认识自我</view>
            <view class="week-badge">已完成</view>
          </view>
          <view v-for="chapter in week1Chapters" :key="chapter.id" class="chapter-item"
            :class="{ playing: chapter.status === 'playing' }">
            <view class="chapter-num" :class="chapter.status">
              <view v-if="chapter.status === 'completed'" class="fas fa-check"></view>
              <view v-else-if="chapter.status === 'playing'" class="fas fa-play"></view>
              <view v-else>{{ chapter.num }}</view>
            </view>
            <view class="chapter-info">
              <view class="chapter-title">{{ chapter.title }}</view>
              <view class="chapter-meta">
                <view>{{ chapter.duration }}</view>
                <view v-if="chapter.task" class="chapter-task">
                  <view class="fas fa-feather"></view> {{ chapter.task }}
                </view>
              </view>
            </view>
            <view v-if="chapter.statusLabel" class="chapter-status" :class="chapter.status">
              {{ chapter.statusLabel }}
            </view>
          </view>
        </view>

        <!-- Week 2 -->
        <view class="week-section fade-in" style="animation-delay: 0.25s">
          <view class="week-header">
            <view class="week-title">第二周 · 人际关系</view>
            <view class="week-badge">已完成</view>
          </view>
          <view v-for="chapter in week2Chapters" :key="chapter.id" class="chapter-item">
            <view class="chapter-num" :class="chapter.status">
              <view v-if="chapter.status === 'completed'" class="fas fa-check"></view>
              <view v-else>{{ chapter.num }}</view>
            </view>
            <view class="chapter-info">
              <view class="chapter-title">{{ chapter.title }}</view>
              <view class="chapter-meta">
                <view>{{ chapter.duration }}</view>
                <view v-if="chapter.task" class="chapter-task">
                  <view class="fas fa-feather"></view> {{ chapter.task }}
                </view>
              </view>
            </view>
            <view v-if="chapter.statusLabel" class="chapter-status" :class="chapter.status">
              {{ chapter.statusLabel }}
            </view>
          </view>
        </view>

        <!-- Week 3 (Current) -->
        <view class="week-section fade-in" style="animation-delay: 0.3s">
          <view class="week-header">
            <view class="week-title">第三周 · 课题分离</view>
            <view class="week-badge current">本周</view>
          </view>
          <view v-for="chapter in week3Chapters" :key="chapter.id" class="chapter-item"
            :class="{ playing: chapter.status === 'playing' }">
            <view class="chapter-num" :class="chapter.status">
              <view v-if="chapter.status === 'completed'" class="fas fa-check"></view>
              <view v-else-if="chapter.status === 'playing'" class="fas fa-play"></view>
              <view v-else>{{ chapter.num }}</view>
            </view>
            <view class="chapter-info">
              <view class="chapter-title">{{ chapter.title }}</view>
              <view class="chapter-meta">
                <view>{{ chapter.duration }}</view>
                <view v-if="chapter.task" class="chapter-task">
                  <view class="fas fa-feather"></view> {{ chapter.task }}
                </view>
              </view>
            </view>
            <view v-if="chapter.statusLabel" class="chapter-status" :class="chapter.status">
              {{ chapter.statusLabel }}
            </view>
          </view>
        </view>

        <!-- Week 4 (Upcoming) -->
        <view class="week-section fade-in" style="animation-delay: 0.35s">
          <view class="week-header">
            <view class="week-title">第四周 · 共同体感觉</view>
            <view class="week-badge locked">未解锁</view>
          </view>
          <view v-for="chapter in week4Chapters" :key="chapter.id" class="chapter-item locked">
            <view class="chapter-num locked">
              <view class="fas fa-lock"></view>
            </view>
            <view class="chapter-info">
              <view class="chapter-title">{{ chapter.title }}</view>
              <view class="chapter-meta">
                <view>{{ chapter.duration }}</view>
              </view>
            </view>
          </view>
        </view>

        <!-- Bottom spacing for mini player -->
        <view style="height: 160rpx;"></view>

        <!-- Mini Player -->
        <view class="mini-player">
          <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop"
            class="mini-player-cover" mode="aspectFill"/>
          <view class="mini-player-info">
            <view class="mini-player-title">第12讲：课题分离的勇气</view>
            <view class="mini-player-progress">
              <view class="mini-player-bar">
                <view class="mini-player-bar-fill" style="width: 58%"></view>
              </view>
              <view class="mini-player-time">8:32/14:45</view>
            </view>
          </view>
          <view class="mini-player-btn">
            <view class="fas fa-pause"></view>
          </view>
        </view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'


const router = useRouter()

interface Chapter {
  id: number
  num?: number
  title: string
  duration: string
  status?: string
  statusLabel?: string
  task?: string
}

const week1Chapters: Chapter[] = [
  { id: 1, num: 1, title: '第1讲：你的人生由你决定', duration: '12:30', status: 'completed', statusLabel: '已完成', task: '觉察已完成' },
  { id: 2, num: 2, title: '第2讲：目的论 vs 原因论', duration: '15:20', status: 'completed', statusLabel: '已完成', task: '觉察已完成' },
  { id: 3, num: 3, title: '第3讲：一切烦恼来自人际关系', duration: '14:10', status: 'completed', statusLabel: '已完成', task: '觉察已完成' }
]

const week2Chapters: Chapter[] = [
  { id: 4, num: 4, title: '第4讲：自卑感与优越感', duration: '13:45', status: 'completed', statusLabel: '已完成', task: '觉察已完成' },
  { id: 5, num: 5, title: '第5讲：追求优越性的方向', duration: '14:20', status: 'completed', statusLabel: '已完成', task: '觉察已完成' }
]

const week3Chapters: Chapter[] = [
  { id: 10, num: 10, title: '第10讲：割舍别人的课题', duration: '15:00', status: 'completed', statusLabel: '已完成', task: '觉察已完成' },
  { id: 11, num: 11, title: '第11讲：不干涉他人的课题', duration: '13:30', status: 'completed', statusLabel: '已完成', task: '觉察已完成' },
  { id: 12, num: 12, title: '第12讲：课题分离的勇气', duration: '14:45', status: 'playing', statusLabel: '播放中', task: '今日觉察' },
  { id: 13, num: 13, title: '第13讲：这是谁的课题？', duration: '13:10' },
  { id: 14, num: 14, title: '第14讲：不要活在别人的期待里', duration: '15:00' }
]

const week4Chapters: Chapter[] = [
  { id: 15, num: 15, title: '第15讲：自由就是被别人讨厌', duration: '14:20' },
  { id: 16, num: 16, title: '第16讲：人际关系的终极目标', duration: '15:10' }
]

const handleTabChange = (tab: string) => {
  const routes: Record<string, string> = {
    home: '/',
    bookroom: '/bookroom-hub',
    journal: '/journal',
    plaza: '/plaza',
    profile: '/profile'
  }
  router.push(routes[tab] || '/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.back-btn {
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  border: none;
  color: var(--text-primary);
  font-size: 28rpx;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 700;
}

/* Book Info Header */
.book-info-header {
  display: flex;
  gap: 28rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.12) 0%, rgba(243, 156, 18, 0.06) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: 32rpx;
  border: 1px solid rgba(244, 208, 63, 0.2);
}

.book-cover-sm {
  width: 120rpx;
  height: 160rpx;
  border-radius: 16rpx;
  object-fit: cover;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
}

.book-info-content {
  flex: 1;
}

.book-info-label {
  font-size: 22rpx;
  color: var(--accent-gold);
  font-weight: 600;
  margin-bottom: 8rpx;
}

.book-info-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 4rpx;
}

.book-info-author {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-bottom: 16rpx;
}

.book-info-meta {
  display: flex;
  gap: 24rpx;
}

.book-info-meta-item {
  font-size: 22rpx;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.book-info-meta-item view {
  color: var(--accent-gold);
  font-size: 20rpx;
}

/* Progress Card */
.progress-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.progress-title {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.progress-value {
  font-size: 28rpx;
  color: var(--accent-gold);
  font-weight: 600;
}

.progress {
  height: 12rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 6rpx;
}

.progress-stats {
  display: flex;
  gap: 32rpx;
  margin-top: 24rpx;
}

.progress-stat {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: var(--text-muted);
}

.progress-stat view {
  font-size: 20rpx;
}

.progress-stat.completed view {
  color: var(--accent-green);
}

.progress-stat.remaining view {
  color: var(--text-muted);
}

/* Week Section */
.week-section {
  margin-bottom: 40rpx;
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.week-title {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.week-badge {
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  background: rgba(88, 214, 141, 0.15);
  color: var(--accent-green);
}

.week-badge.current {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.week-badge.locked {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
}

/* Chapter Item */
.chapter-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 16rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.chapter-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.chapter-item.playing {
  border: 1px solid rgba(244, 208, 63, 0.3);
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.08) 0%, transparent 100%);
}

.chapter-num {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: var(--text-muted);
  flex-shrink: 0;
}

.chapter-num.completed {
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.chapter-num.playing {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  color: #1a1a2e;
}

.chapter-num.locked {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  opacity: 0.5;
}

.chapter-info {
  flex: 1;
  min-width: 0;
}

.chapter-title {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 4rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-item.locked .chapter-title {
  color: var(--text-muted);
}

.chapter-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 24rpx;
  color: var(--text-muted);
}

.chapter-task {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: var(--accent-green);
}

.chapter-status {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 16rpx;
}

.chapter-status.completed {
  background: rgba(88, 214, 141, 0.15);
  color: var(--accent-green);
}

.chapter-status.playing {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

/* Mini Player */
.mini-player {
  position: fixed;
  bottom: 160rpx;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 64rpx);
  max-width: 361px;
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 32rpx;
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
}

.mini-player-cover {
  width: 88rpx;
  height: 88rpx;
  border-radius: 16rpx;
  object-fit: cover;
}

.mini-player-info {
  flex: 1;
  min-width: 0;
}

.mini-player-title {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4rpx;
}

.mini-player-progress {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.mini-player-bar {
  flex: 1;
  height: 6rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
}

.mini-player-bar-fill {
  height: 100%;
  background: var(--accent-gold);
  border-radius: 4rpx;
}

.mini-player-time {
  font-size: 20rpx;
  color: var(--text-muted);
}

.mini-player-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 32rpx;
  border: none;
  cursor: pointer;
}
</style>