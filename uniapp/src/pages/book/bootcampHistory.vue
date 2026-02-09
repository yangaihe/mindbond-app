<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Page Header -->
        <view class="page-header fade-in">
          <view class="back-btn" @click="goBack">
            <view class="fas fa-arrow-left"></view>
          </view>
          <view class="page-title">共读历史</view>
        </view>

        <!-- Stats Card -->
        <view class="stats-card fade-in" style="animation-delay: 0.1s">
          <view class="stats-title">我的共读足迹</view>
          <view class="stats-grid">
            <view class="stat-item">
              <view class="stat-value">3<view>期</view>
              </view>
              <view class="stat-label">参与共读</view>
            </view>
            <view class="stat-item">
              <view class="stat-value">3<view>本</view>
              </view>
              <view class="stat-label">完成书籍</view>
            </view>
            <view class="stat-item">
              <view class="stat-value">68<view>天</view>
              </view>
              <view class="stat-label">累计共读</view>
            </view>
            <view class="stat-item">
              <view class="stat-value">24<view>篇</view>
              </view>
              <view class="stat-label">觉察记录</view>
            </view>
          </view>
        </view>

        <!-- Current Bootcamp -->
        <view class="section-header fade-in" style="animation-delay: 0.15s">
          <view>进行中</view>
        </view>

        <view class="bootcamp-card current fade-in" style="animation-delay: 0.15s"
          @click="goToBootcamp(currentBootcamp)">
          <view class="bootcamp-status-badge active">
            <view class="status-dot"></view>
            进行中
          </view>
          <view class="bootcamp-content">
            <image :src="currentBootcamp.cover" class="bootcamp-cover" mode="aspectFill"/>
            <view class="bootcamp-info">
              <view class="bootcamp-period">{{ currentBootcamp.period }}</view>
              <view class="bootcamp-title">{{ currentBootcamp.title }}</view>
              <view class="bootcamp-class">{{ currentBootcamp.className }} · 第{{ currentBootcamp.week }}周</view>
              <view class="bootcamp-progress">
                <view class="progress-bar-container">
                  <view class="progress-bar-fill" :style="{ width: currentBootcamp.progress + '%' }"></view>
                </view>
                <view class="progress-text">{{ currentBootcamp.progress }}%</view>
              </view>
            </view>
          </view>
          <view class="bootcamp-stats-row">
            <view class="bootcamp-stat">
              <view class="fas fa-calendar-check"></view> {{ currentBootcamp.days }}天
            </view>
            <view class="bootcamp-stat">
              <view class="fas fa-feather"></view> {{ currentBootcamp.journals }}篇觉察
            </view>
            <view class="bootcamp-stat">
              <view class="fas fa-users"></view> {{ currentBootcamp.attendance }}%出勤
            </view>
          </view>
        </view>

        <!-- History List -->
        <view class="section-header fade-in" style="animation-delay: 0.2s">
          <view>往期回顾</view>
          <view class="section-count">共 {{ historyBootcamps.length }} 期</view>
        </view>

        <view v-for="(bootcamp, index) in historyBootcamps" :key="bootcamp.id" class="bootcamp-card fade-in"
          :style="{ animationDelay: `${0.2 + index * 0.05}s` }" @click="goToBootcampDetail(bootcamp)">
          <view class="bootcamp-content">
            <image :src="bootcamp.cover" class="bootcamp-cover" mode="aspectFill"/>
            <view class="bootcamp-info">
              <view class="bootcamp-period">{{ bootcamp.period }}</view>
              <view class="bootcamp-title">{{ bootcamp.title }}</view>
              <view class="bootcamp-class">{{ bootcamp.className }}</view>
              <view class="bootcamp-meta">
                <view class="meta-item">
                  <view class="fas fa-calendar-check"></view> {{ bootcamp.days }}天
                </view>
                <view class="meta-item">
                  <view class="fas fa-feather"></view> {{ bootcamp.journals }}篇
                </view>
              </view>
            </view>
            <view class="bootcamp-right">
              <view class="completion-badge">
                <view class="fas fa-check-circle"></view> 已完成
              </view>
              <view v-if="bootcamp.badges.length > 0" class="achievement-badges">
                <view v-for="badge in bootcamp.badges" :key="badge.name" class="achievement-badge" :class="badge.type">
                  {{ badge.icon }} {{ badge.name }}
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- Empty State (if no history) -->
        <view v-if="historyBootcamps.length === 0" class="empty-state fade-in" style="animation-delay: 0.25s">
          <view class="empty-icon">
            <view class="fas fa-book-open"></view>
          </view>
          <view class="empty-title">暂无历史记录</view>
          <view class="empty-desc">完成当前共读营后，记录将显示在这里</view>
        </view>

        <!-- Achievements Section -->
        <view class="section-header fade-in" style="animation-delay: 0.35s">
          <view>获得成就</view>
          <view class="section-count">{{ achievements.length }} 个</view>
        </view>

        <view class="achievements-grid fade-in" style="animation-delay: 0.35s">
          <view v-for="achievement in achievements" :key="achievement.id" class="achievement-item"
            :class="{ locked: !achievement.unlocked }">
            <view class="achievement-icon">{{ achievement.icon }}</view>
            <view class="achievement-name">{{ achievement.name }}</view>
            <view class="achievement-desc">{{ achievement.desc }}</view>
          </view>
        </view>

        <!-- Bottom Spacing -->
        <view style="height: 40rpx;"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const currentBootcamp = reactive({
  id: 1,
  period: '2026年1月期',
  title: '被讨厌的勇气',
  className: '觉醒者3班',
  week: 3,
  progress: 65,
  days: 18,
  journals: 8,
  attendance: 90,
  cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop'
})

const historyBootcamps = reactive([
  {
    id: 2,
    period: '2025年12月期',
    title: '非暴力沟通',
    className: '觉醒者3班',
    days: 28,
    journals: 10,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&h=160&fit=crop',
    badges: [
      { name: '优秀学员', icon: '🏅', type: 'gold' }
    ]
  },
  {
    id: 3,
    period: '2025年11月期',
    title: '心流',
    className: '觉醒者3班',
    days: 25,
    journals: 6,
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=120&h=160&fit=crop',
    badges: []
  },
  {
    id: 4,
    period: '2025年10月期',
    title: '少有人走的路',
    className: '觉醒者2班',
    days: 30,
    journals: 12,
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=120&h=160&fit=crop',
    badges: [
      { name: '全勤奖', icon: '🎯', type: 'blue' },
      { name: '觉察达人', icon: '✨', type: 'purple' }
    ]
  }
])

const achievements = reactive([
  { id: 1, icon: '🎯', name: '全勤达人', desc: '完成一期全勤', unlocked: true },
  { id: 2, icon: '🏅', name: '优秀学员', desc: '获评优秀学员', unlocked: true },
  { id: 3, icon: '✨', name: '觉察达人', desc: '单期10篇以上', unlocked: true },
  { id: 4, icon: '📚', name: '三期老兵', desc: '完成3期共读', unlocked: true },
  { id: 5, icon: '🌟', name: '年度学员', desc: '完成12期共读', unlocked: false },
  { id: 6, icon: '💎', name: '钻石会员', desc: '累计100篇觉察', unlocked: false }
])

const handleTabChange = (tab: string) => {
  const routes: Record<string, string> = {
    home: '/home',
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

const goToBootcamp = (bootcamp: typeof currentBootcamp) => {
  router.push('/bookroom-hub')
}

const goToBootcampDetail = (bootcamp: (typeof historyBootcamps)[0]) => {
  // TODO: 跳转到往期详情页
  router.push(`/bootcamp-detail?id=${bootcamp.id}`)
}
</script>

<style scoped>
/* Page Header */
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

/* Stats Card */
.stats-card {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(243, 156, 18, 0.08) 100%);
  border: 1px solid rgba(244, 208, 63, 0.25);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.stats-title {
  font-size: 28rpx;
  color: var(--accent-gold);
  font-weight: 600;
  margin-bottom: 32rpx;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
}

.stat-item {
  padding: 20rpx 10rpx;
  background: var(--bg-card);
  border-radius: 10rpx;
  text-align: center;
}

.stat-value {
  font-size: 48rpx;
  color: var(--text-primary);
  font-weight: 700;
}

.stat-value view {
  font-size: 24rpx;
  color: var(--text-muted);
  font-weight: 400;
  margin-left: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: var(--text-muted);
  margin-top: 8rpx;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-header view:first-child {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.section-count {
  font-size: 24rpx;
  color: var(--text-muted);
}

/* Bootcamp Card */
.bootcamp-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 24rpx;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.bootcamp-card:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.bootcamp-card.current {
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.1) 0%, rgba(46, 204, 113, 0.05) 100%);
  border: 1px solid rgba(88, 214, 141, 0.25);
}

.bootcamp-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  font-size: 22rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.bootcamp-status-badge.active {
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  background: var(--accent-green);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.bootcamp-content {
  display: flex;
  gap: 28rpx;
}

.bootcamp-cover {
  width: 120rpx;
  height: 160rpx;
  border-radius: 16rpx;
  object-fit: cover;
  flex-shrink: 0;
}

.bootcamp-info {
  flex: 1;
  min-width: 0;
}

.bootcamp-period {
  font-size: 22rpx;
  color: var(--accent-gold);
  font-weight: 600;
  margin-bottom: 8rpx;
}

.bootcamp-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 8rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bootcamp-class {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-bottom: 16rpx;
}

.bootcamp-progress {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.progress-bar-container {
  flex: 1;
  height: 12rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-green) 0%, #2ecc71 100%);
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 24rpx;
  color: var(--accent-green);
  font-weight: 600;
  min-width: 72rpx;
}

.bootcamp-meta {
  display: flex;
  gap: 24rpx;
}

.meta-item {
  font-size: 24rpx;
  color: var(--text-muted);
}

.meta-item view {
  margin-right: 8rpx;
  color: var(--text-muted);
}

.bootcamp-stats-row {
  display: flex;
  gap: 32rpx;
  margin-top: 28rpx;
  padding-top: 28rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.bootcamp-stat {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.bootcamp-stat view {
  margin-right: 8rpx;
  color: var(--text-muted);
}

.bootcamp-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16rpx;
  flex-shrink: 0;
}

.completion-badge {
  font-size: 22rpx;
  color: var(--accent-green);
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.achievement-badges {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  align-items: flex-end;
}

.achievement-badge {
  font-size: 20rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  white-space: nowrap;
}

.achievement-badge.gold {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.achievement-badge.blue {
  background: rgba(93, 173, 226, 0.2);
  color: var(--accent-blue);
}

.achievement-badge.purple {
  background: rgba(155, 89, 182, 0.2);
  color: #b39ddb;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  width: 128rpx;
  height: 128rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32rpx;
  font-size: 48rpx;
  color: var(--text-muted);
}

.empty-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: var(--text-muted);
}

/* Achievements Grid */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.achievement-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 32rpx 24rpx;
  text-align: center;
  transition: all 0.2s;
}

.achievement-item.locked {
  opacity: 0.4;
}

.achievement-icon {
  font-size: 56rpx;
  display: block;
  margin-bottom: 16rpx;
}

.achievement-item.locked .achievement-icon {
  filter: grayscale(1);
}

.achievement-name {
  font-size: 24rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 8rpx;
}

.achievement-desc {
  font-size: 20rpx;
  color: var(--text-muted);
}
</style>