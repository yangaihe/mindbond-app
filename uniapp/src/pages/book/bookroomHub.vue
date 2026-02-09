<template>
  <page-root #body>
    <view class="p-[30rpx]">
      <!-- Room Type Tabs -->
      <view class="room-tabs fade-in">
        <view class="room-tab" @click="goToAudiobooks">
          <text class="fas fa-headphones"></text>
          <view>听书房</view>
        </view>
        <view class="room-tab active">
          <text class="fas fa-calendar-alt"></text>
          <view>共读营</view>
        </view>
      </view>

      <!-- Page Title -->
      <view class="flex justify-between items-center mb-md fade-in" style="animation-delay: 0.05s">
        <view>
          <view class="page-title">共读营</view>
          <view class="page-subtitle">一群人走得更远，一本书读得更深</view>
        </view>
        <view class="btn btn-secondary btn-sm" @click="goToHistory">
          <text class="fas fa-history"></text> 历史
        </view>
      </view>

      <!-- Current Training -->
      <view class="training-header fade-in" style="animation-delay: 0.1s">
        <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop"
          class="training-cover" mode="aspectFill"></image>
        <view class="training-info">
          <view class="training-label">1月期共读营</view>
          <view class="training-title">被讨厌的勇气</view>
          <view class="training-meta">第3周 · 还剩9天 · 觉醒者3班</view>
        </view>
        <view class="training-progress-ring">
          <svg width="48" height="48">
            <circle class="bg" cx="24" cy="24" r="20"></circle>
            <circle class="progress" cx="24" cy="24" r="20" stroke-dasharray="251.2" stroke-dashoffset="44"></circle>
          </svg>
          <view class="training-progress-text">65%</view>
        </view>
      </view>

      <!-- Quick Access -->
      <view class="quick-access fade-in" style="animation-delay: 0.12s">
        <view class="quick-access-btn" @click="goToAudio">
          <view class="quick-access-icon audio">
            <text class="fas fa-headphones"></text>
          </view>
          <view class="quick-access-info">
            <view class="quick-access-title">音频课程</view>
            <view class="quick-access-meta">12/28讲 已完成</view>
          </view>
          <text class="fas fa-chevron-right quick-access-arrow"></text>
        </view>
        <view class="quick-access-btn" @click="goToJournals">
          <view class="quick-access-icon journal">
            <text class="fas fa-feather"></text>
          </view>
          <view class="quick-access-info">
            <view class="quick-access-title">我的觉察</view>
            <view class="quick-access-meta">15篇记录</view>
          </view>
          <text class="fas fa-chevron-right quick-access-arrow"></text>
        </view>
      </view>

      <!-- My Class Section -->
      <view class="my-class-section fade-in" style="animation-delay: 0.15s">
        <view class="my-class-header">
          <view class="my-class-label">
            <text class="fas fa-star"></text> 我的班级
          </view>
          <view class="my-class-book">第三章 · 课题分离</view>
        </view>

        <view class="my-class-card"
          :class="{ completed: myClass.status === 'completed', active: myClass.status === 'active', upcoming: myClass.status === 'upcoming' }"
          @click="myClass.status !== 'completed' && goToBookroom(myClass.type)">
          <view class="my-class-icon">
            <text :class="myClass.icon"></text>
          </view>
          <view class="my-class-content">
            <view class="my-class-info">
              <view class="my-class-name">{{ myClass.name }}</view>
              <view class="my-class-time">{{ myClass.timeRange }}</view>
            </view>
            <view class="my-class-status">
              <view v-if="myClass.status === 'completed'" class="status-badge completed">
                <text class="fas fa-check"></text> 已完成
              </view>
              <view v-else-if="myClass.status === 'active'" class="status-badge active">
                <view class="live-dot"></view> 进行中
              </view>
              <view v-else class="status-badge upcoming">
                {{ myClass.countdown }}
              </view>
            </view>
          </view>
          <view v-if="myClass.status !== 'completed'" class="my-class-action">
            <view class="my-class-avatars">
              <image v-for="avatar in sessionAvatars" :key="avatar.id" :src="avatar.src" class="my-class-avatar"
                mode="aspectFill"></image>
              <view class="my-class-avatar-more">+{{ myClass.onlineCount }}</view>
            </view>
            <view v-if="myClass.status === 'active'" class="btn-enter-class">
              <text class="fas fa-door-open"></text> 进入
            </view>
          </view>
          <view v-else class="my-class-completed-info">
            <view><text class="fas fa-clock"></text> 参与 {{ myClass.duration }} 分钟</view>
            <view><text class="fas fa-feather"></text> 已写觉察</view>
          </view>
        </view>

        <!-- Audit Other Classes -->
        <view class="audit-section">
          <view class="audit-header" @click="showAuditClasses = !showAuditClasses">
            <view class="audit-label">
              <text class="fas fa-book-reader"></text> 旁听其他班级
            </view>
            <text class="fas" :class="showAuditClasses ? 'fa-chevron-down' : 'fa-chevron-right'"></text>
          </view>
          <view v-if="showAuditClasses" class="audit-list">
            <view v-for="cls in auditClasses" :key="cls.id" class="audit-item"
              :class="{ completed: cls.status === 'completed', active: cls.status === 'active' }"
              @click="cls.status !== 'completed' && goToBookroom(cls.type, true)">
              <text :class="cls.icon" class="audit-item-icon"></text>
              <view class="audit-item-name">{{ cls.name }}</view>
              <view class="audit-item-time">{{ cls.timeRange }}</view>
              <view v-if="cls.status === 'completed'" class="audit-item-status completed">已结束</view>
              <view v-else-if="cls.status === 'active'" class="audit-item-status active">旁听</view>
              <view v-else class="audit-item-status upcoming">{{ cls.countdown }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- Calendar -->
      <view class="calendar-section fade-in" style="animation-delay: 0.2s">
        <view class="calendar-header">
          <view class="calendar-month">2026年1月 · 第3周</view>
          <view class="calendar-nav">
            <view class="calendar-nav-btn"><text class="fas fa-chevron-left"></text></view>
            <view class="calendar-nav-btn"><text class="fas fa-chevron-right"></text></view>
          </view>
        </view>
        <view class="calendar-weekdays">
          <view class="calendar-weekday">一</view>
          <view class="calendar-weekday">二</view>
          <view class="calendar-weekday">三</view>
          <view class="calendar-weekday">四</view>
          <view class="calendar-weekday">五</view>
          <view class="calendar-weekday">六</view>
          <view class="calendar-weekday">日</view>
        </view>
        <view class="calendar-days">
          <!-- Week 1 (partial) -->
          <view class="calendar-day other-month">
            <view class="day-num">29</view>
          </view>
          <view class="calendar-day other-month">
            <view class="day-num">30</view>
          </view>
          <view class="calendar-day other-month">
            <view class="day-num">31</view>
          </view>
          <view class="calendar-day">
            <view class="day-num">1</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">2</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day rest-day">
            <view class="day-num">3</view>
            <view class="day-indicator">
              <view class="day-dot rest"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">4</view>
            <view class="day-indicator">
              <view class="day-dot meeting completed"></view>
            </view>
          </view>
          <!-- Week 2 -->
          <view class="calendar-day">
            <view class="day-num">5</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">6</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">7</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">8</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">9</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day rest-day">
            <view class="day-num">10</view>
            <view class="day-indicator">
              <view class="day-dot rest"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">11</view>
            <view class="day-indicator">
              <view class="day-dot meeting completed"></view>
            </view>
          </view>
          <!-- Week 3 (current) -->
          <view class="calendar-day">
            <view class="day-num">12</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">13</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">14</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">15</view>
            <view class="day-indicator">
              <view class="day-dot lesson completed"></view>
              <view class="day-dot task completed"></view>
            </view>
          </view>
          <view class="calendar-day today">
            <view class="day-num">16</view>
            <view class="day-indicator">
              <view class="day-dot lesson"></view>
              <view class="day-dot task"></view>
            </view>
          </view>
          <view class="calendar-day rest-day">
            <view class="day-num">17</view>
            <view class="day-indicator">
              <view class="day-dot rest"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">18</view>
            <view class="day-indicator">
              <view class="day-dot meeting"></view>
            </view>
          </view>
          <!-- Week 4 -->
          <view class="calendar-day">
            <view class="day-num">19</view>
            <view class="day-indicator">
              <view class="day-dot lesson"></view>
              <view class="day-dot task"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">20</view>
            <view class="day-indicator">
              <view class="day-dot lesson"></view>
              <view class="day-dot task"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">21</view>
            <view class="day-indicator">
              <view class="day-dot lesson"></view>
              <view class="day-dot task"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">22</view>
            <view class="day-indicator">
              <view class="day-dot lesson"></view>
              <view class="day-dot task"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">23</view>
            <view class="day-indicator">
              <view class="day-dot lesson"></view>
              <view class="day-dot task"></view>
            </view>
          </view>
          <view class="calendar-day rest-day">
            <view class="day-num">24</view>
            <view class="day-indicator">
              <view class="day-dot rest"></view>
            </view>
          </view>
          <view class="calendar-day">
            <view class="day-num">25</view>
            <view class="day-indicator">
              <view class="day-dot meeting"></view>
            </view>
          </view>
        </view>
        <view class="calendar-legend">
          <view class="legend-item">
            <view class="legend-dot lesson"></view> 听书
          </view>
          <view class="legend-item">
            <view class="legend-dot task"></view> 觉察
          </view>
          <view class="legend-item">
            <view class="legend-dot meeting"></view> 班会
          </view>
          <view class="legend-item">
            <view class="legend-dot rest"></view> 休息
          </view>
        </view>
      </view>

      <!-- Today's Schedule -->
      <view class="schedule-section fade-in" style="animation-delay: 0.25s">
        <view class="schedule-header">
          <view class="schedule-date">
            1月16日 
            <text class="today">今天</text>
          </view>
          <view class="schedule-status">1/3 已完成</view>
        </view>

        <!-- Lesson Item -->
        <view class="schedule-item">
          <view class="schedule-icon lesson">
            <text class="fas fa-headphones"></text>
          </view>
          <view class="schedule-content">
            <view class="schedule-title">第12讲 · 课题分离的勇气</view>
            <view class="schedule-subtitle">14:45 · 第三章</view>
          </view>
          <view class="schedule-action">
            <view class="schedule-check"><text class="fas fa-check"></text></view>
          </view>
        </view>

        <!-- Task Item -->
        <view class="schedule-item">
          <view class="schedule-icon task">
            <text class="fas fa-feather"></text>
          </view>
          <view class="schedule-content">
            <view class="schedule-title">觉察任务：这是谁的课题？</view>
            <view class="schedule-subtitle">记录一次课题分离的实践</view>
          </view>
          <view class="schedule-action">
            <view class="schedule-btn secondary">去完成</view>
          </view>
        </view>

        <!-- Reading Item -->
        <view class="schedule-item active">
          <view class="schedule-icon reading">
            <text class="fas fa-microphone"></text>
          </view>
          <view class="schedule-content">
            <view class="schedule-title">晚间共读</view>
            <view class="schedule-subtitle">20:55 · 朗读+分享 · 65分钟</view>
          </view>
          <view class="schedule-action">
            <view class="schedule-btn primary">进入</view>
          </view>
        </view>
      </view>

      <!-- This Week's Meeting -->
      <view class="section-header fade-in" style="animation-delay: 0.3s">
        <view>本周班会</view>
        <view class="text-sm text-muted">周日 20:00</view>
      </view>
      <view class="meeting-card fade-in" style="animation-delay: 0.3s" @click="goToLiveMeeting">
        <view class="meeting-icon">
          <text class="fas fa-video"></text>
        </view>
        <view class="meeting-info">
          <view class="meeting-title">亲密关系中的课题分离</view>
          <view class="meeting-time">1月18日 周日 · 张老师主持</view>
        </view>
        <view class="meeting-btn" @click.stop>
          <text class="fas fa-bell"></text> 提醒
        </view>
        <text class="fas fa-chevron-right meeting-arrow"></text>
      </view>

      <!-- Bottom Spacing -->
      <view style="height: 40rpx"></view>
    </view>
  </page-root>
</template>

<script setup lang="ts">
// @ts-ignore - uni API is available in uniapp environment
import { ref, computed } from 'vue'

// Session avatars
const sessionAvatars = [
  { id: 1, src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 2, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 3, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' }
]

// 旁听班级展开状态
const showAuditClasses = ref(false)

// 根据当前时间计算session状态
const getSessionStatus = (startHour: number, startMinute: number, endHour: number, endMinute: number) => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute
  const startTime = startHour * 60 + startMinute
  const endTime = endHour * 60 + endMinute

  if (currentTime >= endTime) return 'completed'
  if (currentTime >= startTime && currentTime < endTime) return 'active'
  return 'upcoming'
}

// 计算倒计时
const getCountdown = (startHour: number, startMinute: number) => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute
  const startTime = startHour * 60 + startMinute

  if (currentTime >= startTime) return ''

  const diff = startTime - currentTime
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60

  if (hours > 0) {
    return `${hours}小时${minutes}分后`
  }
  return `${minutes}分钟后`
}

// 我的班级 - 假设用户属于"晚读1班"
const myClass = computed(() => ({
  id: 'evening-1',
  name: '晚读1班',
  type: 'evening-1',
  icon: 'fas fa-moon',
  timeRange: '20:55 - 22:00',
  status: getSessionStatus(20, 55, 22, 0),
  countdown: getCountdown(20, 55),
  onlineCount: 8,
  duration: 62
}))

// 可旁听的其他班级
const auditClasses = computed(() => [
  {
    id: 'morning-1',
    name: '晨读1班',
    type: 'morning-1',
    icon: 'fas fa-sun',
    timeRange: '5:55 - 7:00',
    status: getSessionStatus(5, 55, 7, 0),
    countdown: getCountdown(5, 55)
  },
  {
    id: 'morning-2',
    name: '晨读2班',
    type: 'morning-2',
    icon: 'fas fa-sun',
    timeRange: '5:55 - 7:00',
    status: getSessionStatus(5, 55, 7, 0),
    countdown: getCountdown(5, 55)
  },
  {
    id: 'evening-2',
    name: '晚读2班',
    type: 'evening-2',
    icon: 'fas fa-moon',
    timeRange: '20:55 - 22:00',
    status: getSessionStatus(20, 55, 22, 0),
    countdown: getCountdown(20, 55)
  }
])

const goToAudio = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/bootcamp-audio'
  })
}

const goToJournals = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/bootcamp-journals'
  })
}

const goToAudiobooks = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/audiobooks'
  })
}

const goToBookroom = (classType?: string, isAudit?: boolean) => {
  let url = '/bookroom'
  const params: string[] = []
  if (classType) params.push(`class=${classType}`)
  if (isAudit) params.push('audit=true')
  if (params.length > 0) url += `?${params.join('&')}`

  // @ts-ignore
  uni.navigateTo({
    url
  })
}

const goToLiveMeeting = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/live-meeting'
  })
}

const goToHistory = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/bootcamp-history'
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

/* Page Title */
.page-title {
  color: #ffffff;
  font-size: 40rpx;
  font-weight: 700;
}

.page-subtitle {
  font-size: 26rpx;
  color: #f4d03f;
  margin-top: 8rpx;
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: 16rpx;
  font-weight: 500;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.btn-sm {
  padding: 16rpx 24rpx;
  font-size: 24rpx;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.mb-md {
  margin-bottom: 32rpx;
}

/* Room Tabs */
.room-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 24rpx;
  padding: 8rpx;
  margin-bottom: 40rpx;
}

.room-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  text-align: center;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 20rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.room-tab.active {
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  color: #1a1a2e;
  font-weight: 600;
}

.room-tab text {
  font-size: 28rpx;
}

/* Training Header */
.training-header {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.12) 0%, rgba(243, 156, 18, 0.06) 100%);
  border-radius: 32rpx;
  margin-bottom: 32rpx;
  border: 1px solid rgba(244, 208, 63, 0.2);
}

.training-cover {
  width: 104rpx;
  height: 140rpx;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
}

.training-info {
  flex: 1;
}

.training-label {
  font-size: 22rpx;
  color: #f4d03f;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.training-title {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 4rpx;
}

.training-meta {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.training-progress-ring {
  width: 96rpx;
  height: 96rpx;
  position: relative;
}

.training-progress-ring svg {
  transform: rotate(-90deg);
}

.training-progress-ring circle {
  fill: none;
  stroke-width: 8rpx;
}

.training-progress-ring .bg {
  stroke: rgba(255, 255, 255, 0.1);
}

.training-progress-ring .progress {
  stroke: #f4d03f;
  stroke-linecap: round;
}

.training-progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 22rpx;
  color: #f4d03f;
  font-weight: 700;
}

/* Quick Access Buttons */
.quick-access {
  display: flex;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.quick-access-btn {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.2s;
}

.quick-access-btn:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.quick-access-icon {
  flex-shrink: 0;
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.quick-access-icon.audio {
  background: rgba(93, 173, 226, 0.2);
  color: #5dade2;
}

.quick-access-icon.journal {
  background: rgba(88, 214, 141, 0.2);
  color: #58d68a;
}

.quick-access-info {
  flex: 1;
}

.quick-access-title {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.quick-access-meta {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.quick-access-arrow {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24rpx;
}

/* My Class Section */
.my-class-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.my-class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}

.my-class-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 28rpx;
  color: #f4d03f;
  font-weight: 600;
}

.my-class-label text {
  font-size: 24rpx;
}

.my-class-book {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* My Class Card */
.my-class-card {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.12) 0%, rgba(243, 156, 18, 0.06) 100%);
  border: 1px solid rgba(244, 208, 63, 0.25);
  border-radius: 28rpx;
  padding: 32rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.my-class-card:hover {
  border-color: rgba(244, 208, 63, 0.4);
  transform: translateY(-2rpx);
}

.my-class-card.completed {
  opacity: 0.8;
  cursor: default;
}

.my-class-card.completed:hover {
  transform: none;
}

.my-class-card.active {
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.15) 0%, rgba(46, 204, 113, 0.08) 100%);
  border-color: rgba(88, 214, 141, 0.4);
}

.my-class-icon {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 36rpx;
  margin-bottom: 24rpx;
}

.my-class-card.active .my-class-icon {
  background: linear-gradient(135deg, #58d68a 0%, #2ecc71 100%);
}

.my-class-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.my-class-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.my-class-name {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 700;
}

.my-class-time {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
}

.my-class-status .status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 28rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.status-badge.completed {
  background: rgba(88, 214, 141, 0.15);
  color: #58d68a;
}

.status-badge.active {
  background: rgba(88, 214, 141, 0.2);
  color: #58d68a;
}

.status-badge.upcoming {
  background: rgba(244, 208, 63, 0.15);
  color: #f4d03f;
}

.live-dot {
  width: 12rpx;
  height: 12rpx;
  background: #58d68a;
  border-radius: 50%;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.my-class-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.my-class-avatars {
  display: flex;
  align-items: center;
}

.my-class-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(26, 26, 46, 0.5);
  margin-left: -16rpx;
}

.my-class-avatar:first-child {
  margin-left: 0;
}

.my-class-avatar-more {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 4rpx solid rgba(26, 26, 46, 0.5);
  margin-left: -16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.btn-enter-class {
  padding: 20rpx 36rpx;
  background: linear-gradient(135deg, #58d68a 0%, #2ecc71 100%);
  border: none;
  border-radius: 36rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 12rpx;
  cursor: pointer;
}

.my-class-completed-info {
  display: flex;
  gap: 40rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
}

.my-class-completed-info view {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.my-class-completed-info text {
  font-size: 24rpx;
  color: #58d68a;
}

/* Audit Section */
.audit-section {
  margin-top: 28rpx;
  padding-top: 28rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 16rpx 0;
}

.audit-label {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
}

.audit-label text {
  color: rgba(255, 255, 255, 0.5);
}

.audit-header>text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.audit-list {
  margin-top: 20rpx;
}

.audit-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20rpx;
  margin-bottom: 16rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.audit-item:last-child {
  margin-bottom: 0;
}

.audit-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.audit-item.completed {
  opacity: 0.6;
  cursor: default;
}

.audit-item.completed:hover {
  background: rgba(255, 255, 255, 0.03);
}

.audit-item-icon {
  font-size: 28rpx;
  color: #f4d03f;
  width: 40rpx;
  text-align: center;
}

.audit-item-name {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 500;
}

.audit-item-time {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  flex: 1;
}

.audit-item-status {
  font-size: 22rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-weight: 500;
}

.audit-item-status.completed {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
}

.audit-item-status.active {
  background: rgba(93, 173, 226, 0.2);
  color: #5dade2;
}

.audit-item-status.upcoming {
  background: rgba(244, 208, 63, 0.15);
  color: #f4d03f;
}

/* Calendar Section */
.calendar-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.calendar-month {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
}

.calendar-nav {
  display: flex;
  gap: 16rpx;
}

.calendar-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16rpx;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24rpx;
  cursor: pointer;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 16rpx;
}

.calendar-weekday {
  text-align: center;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
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
  border-radius: 20rpx;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.08);
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.today {
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
}

.calendar-day.today .day-num {
  color: #1a1a2e;
}

.calendar-day.selected {
  background: rgba(244, 208, 63, 0.2);
  border: 1px solid rgba(244, 208, 63, 0.4);
}

.day-num {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.day-indicator {
  display: flex;
  gap: 4rpx;
  height: 12rpx;
}

.day-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}

.day-dot.lesson {
  background: #5dade2;
}

.day-dot.task {
  background: #58d68a;
}

.day-dot.meeting {
  background: #9b59b6;
}

.day-dot.rest {
  background: rgba(255, 255, 255, 0.5);
}

.day-dot.completed {
  opacity: 0.5;
}

.calendar-day.rest-day .day-num {
  color: rgba(255, 255, 255, 0.5);
}

.calendar-day.today .day-dot {
  border: 1px solid #1a1a2e;
}

/* Legend */
.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 32rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.legend-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.legend-dot.lesson {
  background: #5dade2;
}

.legend-dot.task {
  background: #58d68a;
}

.legend-dot.meeting {
  background: #9b59b6;
}

.legend-dot.rest {
  background: rgba(255, 255, 255, 0.5);
}

/* Today's Schedule */
.schedule-section {
  margin-bottom: 32rpx;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.schedule-date {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
}

.schedule-date .today {
  color: #f4d03f;
}

.schedule-status {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* Schedule Item */
.schedule-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.schedule-item.active {
  border: 1px solid rgba(244, 208, 63, 0.3);
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.08) 0%, transparent 100%);
}

.schedule-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
}

.schedule-icon.lesson {
  background: rgba(93, 173, 226, 0.2);
  color: #5dade2;
}

.schedule-icon.task {
  background: rgba(88, 214, 141, 0.2);
  color: #58d68a;
}

.schedule-icon.reading {
  background: rgba(244, 208, 63, 0.2);
  color: #f4d03f;
}

.schedule-icon.meeting {
  background: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
}

.schedule-icon.rest {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

.schedule-content {
  flex: 1;
  min-width: 0;
}

.schedule-title {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.schedule-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.schedule-action {
  flex-shrink: 0;
}

.schedule-btn {
  padding: 16rpx 28rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.schedule-btn.primary {
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  color: #1a1a2e;
}

.schedule-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.schedule-btn.completed {
  background: rgba(88, 214, 141, 0.15);
  color: #58d68a;
}

.schedule-check {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(88, 214, 141, 0.2);
  color: #58d68a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
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

.text-sm {
  font-size: 24rpx;
}

.text-muted {
  color: rgba(255, 255, 255, 0.5);
}

/* Week Meeting Card */
.meeting-card {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.12) 0%, rgba(142, 68, 173, 0.06) 100%);
  border: 1px solid rgba(155, 89, 182, 0.2);
  border-radius: 24rpx;
  padding: 28rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.meeting-card:hover {
  border-color: rgba(155, 89, 182, 0.4);
  transform: translateY(-2rpx);
}

.meeting-card:active {
  transform: translateY(0);
}

.meeting-icon {
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

.meeting-info {
  flex: 1;
}

.meeting-title {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.meeting-time {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.meeting-btn {
  padding: 16rpx 24rpx;
  background: rgba(155, 89, 182, 0.2);
  border-radius: 16rpx;
  font-size: 24rpx;
  color: #9b59b6;
  border: none;
  cursor: pointer;
}

.meeting-arrow {
  color: #9b59b6;
  font-size: 28rpx;
  flex-shrink: 0;
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
