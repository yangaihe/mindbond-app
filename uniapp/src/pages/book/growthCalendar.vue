<template>
  <page-root>
    <template #body>
      <view class="p-[40rpx]">
        <view class="back-header fade-in">
          <view class="btn-back" @click="goBack">
            <view class="fas fa-arrow-left"></view>
          </view>
          <view class="back-text">返回</view>
        </view>

        <view class="calendar-header fade-in">
          <view class="calendar-title">成长日历</view>
          <view class="view-toggle">
            <view class="view-toggle-btn" :class="{ active: viewMode === 'year' }" @click="viewMode = 'year'">年</view>
            <view class="view-toggle-btn" :class="{ active: viewMode === 'month' }" @click="viewMode = 'month'">月</view>
          </view>
        </view>

        <view class="streak-banner fade-in" style="animation-delay: 0.1s">
          <view class="streak-info">
            <view class="streak-fire">🔥</view>
            <view class="streak-text">
              <view class="streak-text-title">23天</view>
              <view class="streak-text-desc">连续成长中，继续加油！</view>
            </view>
          </view>
          <view class="streak-best">
            <view class="streak-best-value">45天</view>
            <view class="streak-best-label">最长连续</view>
          </view>
        </view>

        <view class="stats-summary fade-in" style="animation-delay: 0.15s">
          <view class="stat-mini">
            <view class="stat-mini-icon" style="background: rgba(244, 208, 63, 0.2)">
              <view class="fas fa-feather" style="color: var(--accent-gold)"></view>
            </view>
            <view class="stat-mini-value">23</view>
            <view class="stat-mini-label">日记</view>
          </view>
          <view class="stat-mini">
            <view class="stat-mini-icon" style="background: rgba(93, 173, 226, 0.2)">
              <view class="fas fa-book" style="color: var(--accent-blue)"></view>
            </view>
            <view class="stat-mini-value">18</view>
            <view class="stat-mini-label">共读</view>
          </view>
          <view class="stat-mini">
            <view class="stat-mini-icon" style="background: rgba(88, 214, 141, 0.2)">
              <view class="fas fa-headphones" style="color: var(--accent-green)"></view>
            </view>
            <view class="stat-mini-value">36h</view>
            <view class="stat-mini-label">听书</view>
          </view>
          <view class="stat-mini">
            <view class="stat-mini-icon" style="background: rgba(248, 165, 194, 0.2)">
              <view class="fas fa-heart" style="color: var(--accent-pink)"></view>
            </view>
            <view class="stat-mini-value">28</view>
            <view class="stat-mini-label">情绪</view>
          </view>
        </view>

        <view class="card fade-in" style="animation-delay: 0.2s">
          <view class="month-nav">
            <view class="month-nav-btn" @click="prevMonth">
              <view class="fas fa-chevron-left"></view>
            </view>
            <view class="month-nav-text">2024年1月</view>
            <view class="month-nav-btn" @click="nextMonth">
              <view class="fas fa-chevron-right"></view>
            </view>
          </view>

          <view class="calendar-weekdays">
            <view v-for="day in weekdays" :key="day" class="calendar-weekday">{{ day }}</view>
          </view>

          <view class="calendar-days">
            <view class="calendar-day empty"></view>
            <view v-for="day in calendarDays" :key="day.num" class="calendar-day" :class="{
              today: day.isToday,
              selected: day.isSelected,
              future: day.isFuture
            }" @click="selectDay(day)">
              <view class="day-num" :class="{ muted: day.isFuture }">{{ day.num }}</view>
              <view v-if="day.indicators && day.indicators.length > 0" class="day-indicators">
                <view v-for="indicator in day.indicators" :key="indicator" class="day-indicator" :class="indicator">
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="legend-card fade-in" style="animation-delay: 0.25s">
          <view class="legend-title">图例说明</view>
          <view class="legend-items">
            <view class="legend-item">
              <view class="legend-dot" style="background: var(--accent-gold)"></view>
              <view>日记</view>
            </view>
            <view class="legend-item">
              <view class="legend-dot" style="background: var(--accent-blue)"></view>
              <view>共读</view>
            </view>
            <view class="legend-item">
              <view class="legend-dot" style="background: var(--accent-green)"></view>
              <view>听书</view>
            </view>
            <view class="legend-item">
              <view class="legend-dot" style="background: var(--accent-pink)"></view>
              <view>情绪</view>
            </view>
          </view>
        </view>

        <view class="day-detail fade-in" style="animation-delay: 0.3s">
          <view class="day-detail-header">
            <view class="day-detail-date">1月10日 · 周三</view>
            <view class="day-detail-emotion">😌</view>
          </view>

          <view v-for="activity in dayActivities" :key="activity.title" class="day-detail-item">
            <view class="day-detail-icon" :style="{ background: activity.iconBg }">
              <view :class="activity.icon" :style="{ color: activity.iconColor }"></view>
            </view>
            <view class="day-detail-content">
              <view class="day-detail-title">{{ activity.title }}</view>
              <view class="day-detail-desc">{{ activity.desc }}</view>
            </view>
            <view v-if="activity.completed" class="fas fa-check-circle day-detail-check"></view>
            <view v-else class="fas fa-circle day-detail-unchecked"></view>
          </view>
        </view>

        <view class="heatmap-container fade-in" style="animation-delay: 0.35s">
          <view class="heatmap-header">
            <view class="heatmap-year">
              <view class="heatmap-year-btn">
                <view class="fas fa-chevron-left"></view>
              </view>
              <view class="heatmap-year-text">2024</view>
              <view class="heatmap-year-btn">
                <view class="fas fa-chevron-right"></view>
              </view>
            </view>
            <view class="heatmap-legend">
              <view>少</view>
              <view class="legend-block" style="background: rgba(255,255,255,0.06)"></view>
              <view class="legend-block" style="background: rgba(244, 208, 63, 0.2)"></view>
              <view class="legend-block" style="background: rgba(244, 208, 63, 0.4)"></view>
              <view class="legend-block" style="background: rgba(244, 208, 63, 0.6)"></view>
              <view class="legend-block" style="background: rgba(244, 208, 63, 0.85)"></view>
              <view>多</view>
            </view>
          </view>

          <view class="heatmap-months">
            <view v-for="month in months" :key="month" class="heatmap-month">{{ month }}</view>
          </view>

          <view class="heatmap-grid">
            <view class="heatmap-weekdays">
              <view class="heatmap-weekday">一</view>
              <view class="heatmap-weekday"></view>
              <view class="heatmap-weekday">三</view>
              <view class="heatmap-weekday"></view>
              <view class="heatmap-weekday">五</view>
              <view class="heatmap-weekday"></view>
              <view class="heatmap-weekday">日</view>
            </view>
            <view class="heatmap-weeks">
              <view v-for="(week, weekIndex) in heatmapWeeks" :key="weekIndex" class="heatmap-week">
                <view v-for="(day, dayIndex) in week" :key="dayIndex" class="heatmap-day"
                  :class="[day.level, { today: day.isToday }]"></view>
              </view>
            </view>
          </view>
        </view>

        <view style="height: 40rpx"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const viewMode = ref('month')
const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

interface CalendarDay {
  num: number
  isToday?: boolean
  isSelected?: boolean
  isFuture?: boolean
  indicators?: string[]
}

const calendarDays = ref<CalendarDay[]>([
  { num: 1, indicators: ['journal', 'reading'] },
  { num: 2, indicators: ['journal', 'reading', 'audio'] },
  { num: 3, indicators: ['journal'] },
  { num: 4, indicators: ['journal', 'reading', 'emotion'] },
  { num: 5, indicators: ['reading', 'audio'] },
  { num: 6, indicators: ['journal', 'reading'] },
  { num: 7, indicators: ['journal', 'reading', 'audio', 'emotion'] },
  { num: 8, indicators: ['journal', 'reading'] },
  { num: 9, indicators: ['journal', 'audio'] },
  { num: 10, isToday: true, isSelected: true, indicators: ['journal', 'reading', 'emotion'] },
  { num: 11, isFuture: true },
  { num: 12, isFuture: true },
  { num: 13, isFuture: true },
  { num: 14, isFuture: true },
  { num: 15, isFuture: true },
  { num: 16, isFuture: true },
  { num: 17, isFuture: true },
  { num: 18, isFuture: true },
  { num: 19, isFuture: true },
  { num: 20, isFuture: true },
  { num: 21, isFuture: true },
  { num: 22, isFuture: true },
  { num: 23, isFuture: true },
  { num: 24, isFuture: true },
  { num: 25, isFuture: true },
  { num: 26, isFuture: true },
  { num: 27, isFuture: true },
  { num: 28, isFuture: true },
  { num: 29, isFuture: true },
  { num: 30, isFuture: true },
  { num: 31, isFuture: true }
])

const dayActivities = [
  {
    title: '觉察日记',
    desc: '今天读到"课题分离"，突然被点醒...',
    icon: 'fas fa-pen',
    iconBg: 'rgba(244, 208, 63, 0.2)',
    iconColor: 'var(--accent-gold)',
    completed: true
  },
  {
    title: '书房共读',
    desc: '觉醒者3班 · 1小时',
    icon: 'fas fa-book',
    iconBg: 'rgba(93, 173, 226, 0.2)',
    iconColor: 'var(--accent-blue)',
    completed: true
  },
  {
    title: '听书学习',
    desc: '未完成',
    icon: 'fas fa-headphones',
    iconBg: 'rgba(88, 214, 141, 0.2)',
    iconColor: 'var(--accent-green)',
    completed: false
  },
  {
    title: '情绪记录',
    desc: '平静 😌',
    icon: 'fas fa-heart',
    iconBg: 'rgba(248, 165, 194, 0.2)',
    iconColor: 'var(--accent-pink)',
    completed: true
  }
]

interface HeatmapDay {
  level?: string
  isToday?: boolean
}

const heatmapWeeks = ref<HeatmapDay[][]>([
  [
    { level: 'level-2' },
    { level: 'level-3' },
    { level: 'level-1' },
    { level: 'level-4' },
    { level: 'level-2' },
    { level: 'level-3' },
    { level: 'level-4' }
  ],
  [
    { level: 'level-3' },
    { level: 'level-2' },
    { level: 'level-4', isToday: true },
    {},
    {},
    {},
    {}
  ],
  [{}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}]
])

const goBack = () => {
  router.back()
}

const prevMonth = () => {
}

const nextMonth = () => {
}

const selectDay = (day: CalendarDay) => {
  calendarDays.value.forEach(d => d.isSelected = false)
  day.isSelected = true
}
</script>

<style scoped>
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

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.calendar-title {
  font-size: 40rpx;
  color: var(--text-primary);
  font-weight: 700;
}

.view-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 40rpx;
  padding: 8rpx;
}

.view-toggle-btn {
  padding: 12rpx 24rpx;
  border-radius: 32rpx;
  font-size: 24rpx;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.view-toggle-btn.active {
  background: var(--accent-gold);
  color: #1a1a2e;
  font-weight: 600;
}

.streak-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(243, 156, 18, 0.08) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: 40rpx;
  border: 2rpx solid rgba(244, 208, 63, 0.2);
}

.streak-info {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.streak-fire {
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
}

.streak-text-title {
  font-size: 56rpx;
  color: var(--accent-gold);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8rpx;
}

.streak-text-desc {
  font-size: 26rpx;
  color: var(--text-muted);
}

.streak-best {
  text-align: right;
}

.streak-best-value {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.streak-best-label {
  font-size: 22rpx;
  color: var(--text-muted);
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-bottom: 40rpx;
}

.stat-mini {
  text-align: center;
  padding: 24rpx 16rpx;
  background: var(--bg-card);
  border-radius: 24rpx;
}

.stat-mini-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16rpx;
  font-size: 28rpx;
}

.stat-mini-value {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 700;
}

.stat-mini-label {
  font-size: 20rpx;
  color: var(--text-muted);
  margin-top: 4rpx;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 40rpx;
}

.month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.month-nav-btn {
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border: none;
  cursor: pointer;
}

.month-nav-text {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.calendar-weekday {
  text-align: center;
  font-size: 24rpx;
  color: var(--text-muted);
  padding: 16rpx 0;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 24rpx;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.08);
}

.calendar-day.empty {
  background: transparent;
  cursor: default;
}

.calendar-day.today {
  background: rgba(244, 208, 63, 0.15);
  box-shadow: inset 0 0 0 4rpx var(--accent-gold);
}

.calendar-day.selected {
  background: var(--accent-gold);
}

.calendar-day.selected .day-num {
  color: #1a1a2e;
}

.day-num {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.day-num.muted {
  color: var(--text-muted);
}

.day-indicators {
  display: flex;
  gap: 6rpx;
  margin-top: 8rpx;
}

.day-indicator {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}

.day-indicator.journal {
  background: var(--accent-gold);
}

.day-indicator.reading {
  background: var(--accent-blue);
}

.day-indicator.audio {
  background: var(--accent-green);
}

.day-indicator.emotion {
  background: var(--accent-pink);
}

.legend-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 32rpx;
  margin-bottom: 40rpx;
}

.legend-title {
  font-size: 26rpx;
  color: var(--text-muted);
  margin-bottom: 24rpx;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
}

.legend-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
}

.day-detail {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  margin-bottom: 40rpx;
  border: 2rpx solid rgba(244, 208, 63, 0.2);
}

.day-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.day-detail-date {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.day-detail-emotion {
  font-size: 56rpx;
}

.day-detail-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 0;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.08);
}

.day-detail-item:last-child {
  border-bottom: none;
}

.day-detail-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.day-detail-content {
  flex: 1;
}

.day-detail-title {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.day-detail-desc {
  font-size: 24rpx;
  color: var(--text-muted);
}

.day-detail-check {
  color: var(--accent-green);
  font-size: 32rpx;
}

.day-detail-unchecked {
  color: var(--text-muted);
  font-size: 32rpx;
}

.heatmap-container {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  margin-bottom: 40rpx;
  overflow-x: auto;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.heatmap-year {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.heatmap-year-btn {
  width: 56rpx;
  height: 56rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border: none;
  cursor: pointer;
  font-size: 24rpx;
}

.heatmap-year-text {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 22rpx;
  color: var(--text-muted);
}

.legend-block {
  width: 24rpx;
  height: 24rpx;
  border-radius: 6rpx;
}

.heatmap-months {
  display: flex;
  gap: 6rpx;
  margin-bottom: 16rpx;
  padding-left: 64rpx;
}

.heatmap-month {
  flex: 1;
  font-size: 20rpx;
  color: var(--text-muted);
  text-align: center;
}

.heatmap-grid {
  display: flex;
  gap: 6rpx;
}

.heatmap-weekdays {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  margin-right: 12rpx;
}

.heatmap-weekday {
  height: 28rpx;
  font-size: 20rpx;
  color: var(--text-muted);
  display: flex;
  align-items: center;
}

.heatmap-weeks {
  display: flex;
  gap: 6rpx;
  flex: 1;
}

.heatmap-week {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.heatmap-day {
  width: 28rpx;
  height: 28rpx;
  border-radius: 6rpx;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.2s;
}

.heatmap-day:hover {
  transform: scale(1.3);
  box-shadow: 0 0 16rpx rgba(244, 208, 63, 0.5);
}

.heatmap-day.level-1 {
  background: rgba(244, 208, 63, 0.2);
}

.heatmap-day.level-2 {
  background: rgba(244, 208, 63, 0.4);
}

.heatmap-day.level-3 {
  background: rgba(244, 208, 63, 0.6);
}

.heatmap-day.level-4 {
  background: rgba(244, 208, 63, 0.85);
}

.heatmap-day.today {
  box-shadow: 0 0 0 4rpx var(--accent-gold);
}
</style>
