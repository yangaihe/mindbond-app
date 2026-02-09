<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Back Button -->
        <view class="back-header fade-in">
          <view class="btn-back" @click="goBack">
            <text class="fas fa-arrow-left"></text>
          </view>
          <text class="back-text">返回</text>
        </view>

        <!-- Header -->
        <view class="page-header fade-in">
          <view>
            <view class="page-label">成长报告</view>
            <view class="page-title">2024年1月 · 第2周</view>
          </view>
          <view class="period-toggle">
            <view class="toggle-btn" :class="{ active: period === 'week' }" @click="period = 'week'">周</view>
            <view class="toggle-btn" :class="{ active: period === 'month' }" @click="period = 'month'">月</view>
          </view>
        </view>

        <!-- Summary Stats -->
        <view class="stats-grid fade-in" style="animation-delay: 0.1s">
          <view class="stat-item">
            <view class="stat-value">12</view>
            <view class="stat-label">日记篇数</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">7h</view>
            <view class="stat-label">共读时长</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">7</view>
            <view class="stat-label">连续天数</view>
          </view>
        </view>

        <!-- Emotion Distribution -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.2s">
          <view>情绪分布</view>
          <text class="section-meta">本周</text>
        </view>
        <view class="chart-emotion fade-in" style="animation-delay: 0.2s">
          <view v-for="emotion in emotions" :key="emotion.emoji" class="chart-emotion-bar">
            <view class="bar" :style="{ height: emotion.height, opacity: emotion.opacity }"></view>
            <text class="label">{{ emotion.emoji }}</text>
            <text class="value">{{ emotion.percent }}</text>
          </view>
        </view>

        <!-- AI Weekly Insight -->
        <view class="ai-insight fade-in mt-lg" style="animation-delay: 0.3s">
          <view class="ai-insight-header">
            <view class="ai-icon">
              <text class="fas fa-sparkles"></text>
            </view>
            <view>
              <view class="ai-title">本周 AI 洞见</view>
              <view class="ai-subtitle">基于 12 篇日记分析</view>
            </view>
          </view>
          <view class="ai-content">
            这周你的情绪整体比上周更加平稳，"平静"的比例从 30% 提升到了 45%。
          </view>
          <view class="ai-content">
            我注意到你在日记中 <text class="highlight">3 次提到"课题分离"</text>，这个概念似乎对你很有启发。你开始学会区分"自己的课题"和"别人的课题"，这是很大的进步！
          </view>
          <view class="ai-content">
            建议：下周可以尝试在遇到人际冲突时，先问自己"这是谁的课题？"
          </view>
        </view>

        <!-- Growth Trends -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.4s">
          <view>成长趋势</view>
        </view>

        <view v-for="(trend, index) in trends" :key="trend.label" class="trend-item fade-in"
          :style="{ animationDelay: `${0.4 + index * 0.05}s` }">
          <view class="trend-icon" :style="{ background: trend.iconBg }">
            <text :class="trend.icon" :style="{ color: trend.iconColor }"></text>
          </view>
          <view class="trend-content">
            <view class="trend-title">{{ trend.label }}</view>
            <view class="trend-desc">{{ trend.desc }}</view>
          </view>
          <text :class="['trend-value', trend.trendClass]">{{ trend.value }}</text>
        </view>

        <!-- Keywords -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.6s">
          <view>本周关键词</view>
        </view>
        <view class="keywords fade-in" style="animation-delay: 0.6s">
          <text v-for="keyword in keywords" :key="keyword.text" class="keyword" :class="keyword.class">
            {{ keyword.text }}
          </text>
        </view>

        <!-- Reading Progress -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.7s">
          <view>阅读进度</view>
        </view>
        <view class="card fade-in" style="animation-delay: 0.7s">
          <view class="reading-progress">
            <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop"
              class="book-cover" mode="aspectFill">
            </image>
            <view class="book-info">
              <view class="book-title">被讨厌的勇气</view>
              <view class="book-meta">本周阅读 3 章</view>
              <view class="progress">
                <view class="progress-bar" style="width: 65%"></view>
              </view>
              <view class="book-progress">总进度 65%</view>
            </view>
          </view>
        </view>

        <!-- Share Button -->
        <view class="btn-share fade-in" style="animation-delay: 0.8s">
          <text class="fas fa-share"></text> 分享我的成长报告
        </view>

        <!-- Bottom Spacing -->
        <view style="height: 40rpx"></view>
      </view>
    </template>
  </page-root>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const period = ref('month')

const emotions = [
  { emoji: '😊', height: '120rpx', opacity: 1, percent: '35%' },
  { emoji: '😌', height: '160rpx', opacity: 1, percent: '45%' },
  { emoji: '😔', height: '40rpx', opacity: 0.6, percent: '8%' },
  { emoji: '😰', height: '30rpx', opacity: 0.6, percent: '7%' },
  { emoji: '😤', height: '20rpx', opacity: 0.6, percent: '5%' }
]

const trends = [
  {
    label: '情绪稳定性',
    desc: '比上周提升 15%',
    value: '+15%',
    icon: 'fas fa-arrow-up',
    iconBg: 'rgba(88, 214, 141, 0.2)',
    iconColor: 'var(--accent-green)',
    trendClass: 'trend-up'
  },
  {
    label: '觉察深度',
    desc: '日记平均字数增加',
    value: '+23%',
    icon: 'fas fa-arrow-up',
    iconBg: 'rgba(88, 214, 141, 0.2)',
    iconColor: 'var(--accent-green)',
    trendClass: 'trend-up'
  },
  {
    label: '共读参与',
    desc: '与上周持平',
    value: '0%',
    icon: 'fas fa-minus',
    iconBg: 'rgba(244, 208, 63, 0.2)',
    iconColor: 'var(--accent-gold)',
    trendClass: 'trend-neutral'
  }
]

const keywords = [
  { text: '课题分离', class: 'keyword-gold' },
  { text: '接纳', class: 'keyword-blue' },
  { text: '成长', class: 'keyword-green' },
  { text: '感恩', class: 'keyword-pink' },
  { text: '工作', class: 'keyword-default' },
  { text: '家庭', class: 'keyword-default' }
]

const goBack = () => {
  router.back()
}
</script>

<style scoped>
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
  color: var(--text-primary);
  cursor: pointer;
}

.back-text {
  font-size: 26rpx;
  color: var(--text-muted);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.page-label {
  font-size: 26rpx;
  color: var(--text-muted);
  margin-bottom: 8rpx;
}

.page-title {
  font-size: 40rpx;
  color: var(--text-primary);
  font-weight: 700;
}

.period-toggle {
  display: flex;
  gap: 8rpx;
}

.toggle-btn {
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  color: #1a1a2e;
  font-weight: 600;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
}

.stat-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 32rpx;
  text-align: center;
}

.stat-value {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: var(--text-muted);
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

.section-meta {
  font-size: 26rpx;
  color: var(--text-muted);
}

/* Emotion Chart */
.chart-emotion {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 240rpx;
  padding: 32rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
}

.chart-emotion-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.chart-emotion-bar .bar {
  width: 64rpx;
  background: linear-gradient(180deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 8rpx 8rpx 0 0;
  transition: height 0.3s;
}

.chart-emotion-bar .label {
  font-size: 36rpx;
}

.chart-emotion-bar .value {
  font-size: 20rpx;
  color: var(--text-muted);
}

/* AI Insight */
.ai-insight {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.12) 0%, rgba(142, 68, 173, 0.06) 100%);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  border: 1px solid rgba(155, 89, 182, 0.2);
}

.ai-insight-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.ai-icon {
  width: 80rpx;
  height: 80rpx;
  background: rgba(155, 89, 182, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9b59b6;
  font-size: 32rpx;
}

.ai-title {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.ai-subtitle {
  font-size: 24rpx;
  color: var(--text-muted);
}

.ai-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 24rpx;
}

.ai-content:last-child {
  margin-bottom: 0;
}

.ai-content .highlight {
  color: var(--accent-gold);
}

/* Trend Items */
.trend-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 16rpx;
}

.trend-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.trend-content {
  flex: 1;
}

.trend-title {
  font-size: 28rpx;
  color: var(--text-primary);
}

.trend-desc {
  font-size: 24rpx;
  color: var(--text-muted);
}

.trend-value {
  font-weight: 600;
}

.trend-up {
  color: var(--accent-green);
}

.trend-down {
  color: #e74c3c;
}

.trend-neutral {
  color: var(--accent-gold);
}

/* Keywords */
.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.keyword {
  padding: 16rpx 28rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
}

.keyword-gold {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.keyword-blue {
  background: rgba(93, 173, 226, 0.2);
  color: var(--accent-blue);
}

.keyword-green {
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.keyword-pink {
  background: rgba(248, 165, 194, 0.2);
  color: var(--accent-pink);
}

.keyword-default {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

/* Card */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32rpx;
}

/* Reading Progress */
.reading-progress {
  display: flex;
  gap: 32rpx;
  align-items: center;
}

.book-cover {
  width: 120rpx;
  height: 160rpx;
  border-radius: 16rpx;
  object-fit: cover;
}

.book-info {
  flex: 1;
}

.book-title {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.book-meta {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-bottom: 16rpx;
}

.progress {
  height: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 4rpx;
}

.book-progress {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-top: 8rpx;
}

/* Share Button */
.btn-share {
  width: 100%;
  padding: 28rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border: none;
  border-radius: 24rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-top: 40rpx;
}

/* Utilities */
.mt-lg {
  margin-top: 48rpx;
}
</style>