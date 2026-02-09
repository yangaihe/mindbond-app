<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Welcome Animation -->
        <view v-if="showWelcome" class="welcome-overlay">
          <view class="welcome-content">
            <view class="welcome-icon">
              <text class="fas fa-book-open"></text>
            </view>
            <view class="welcome-title">欢迎回来</view>
            <view class="welcome-message">今晚的伙伴们都在等你</view>
            <view class="welcome-members">
              <image v-for="(avatar, index) in welcomeAvatars" :key="index" :src="avatar" class="welcome-avatar"
                mode="aspectFill"></image>
              <view class="welcome-count">+6</view>
            </view>
          </view>
        </view>

        <!-- My Turn Notification -->
        <view v-if="readingState === 'my_turn'" class="my-turn-overlay">
          <view class="my-turn-card">
            <view class="my-turn-pulse"></view>
            <view class="my-turn-icon">
              <text class="fas fa-microphone"></text>
            </view>
            <view class="my-turn-title">轮到你朗读了</view>
            <view class="my-turn-desc">请准备好，点击下方按钮开始朗读</view>
            <view class="my-turn-text-preview">
              <view class="preview-label">待朗读内容</view>
              <view class="preview-content">"只要能够进行课题分离，人际关系就会发生巨大改变..."</view>
            </view>
            <view class="my-turn-btn" @click="requestMicPermission">
              <text class="fas fa-microphone"></text> 开始朗读
            </view>
            <view class="my-turn-skip" @click="skipMyTurn">
              这次跳过
            </view>
          </view>
        </view>

        <!-- Reading Controls (when I'm reading) -->
        <view v-if="readingState === 'reading'" class="reading-controls-bar">
          <view class="reading-controls-info">
            <view class="reading-wave-mini">
              <view class="wave-bar"></view>
              <view class="wave-bar"></view>
              <view class="wave-bar"></view>
            </view>
            <view class="reading-controls-text">你正在朗读中...</view>
          </view>
          <view class="reading-end-btn" @click="endReading">
            <text class="fas fa-stop"></text> 结束朗读
          </view>
        </view>

        <!-- Mic Permission Modal (placed here to ensure proper stacking) -->
        <view v-if="showMicPermission" class="permission-overlay">
          <view class="permission-modal">
            <view class="permission-icon">
              <text class="fas fa-microphone-alt"></text>
            </view>
            <view class="permission-title">需要麦克风权限</view>
            <view class="permission-desc">为了让书友们听到你的朗读，请允许访问麦克风</view>
            <view class="permission-actions">
              <view class="permission-btn-deny" @click="denyMicPermission">拒绝</view>
              <view class="permission-btn-allow" @click="allowMicPermission">允许</view>
            </view>
          </view>
        </view>

        <!-- Reading Room Header -->
        <view class="reading-room-header fade-in">
          <view class="btn-back-room" @click="goBack">
            <text class="fas fa-chevron-left"></text>
          </view>
          <view class="reading-room-info">
            <view class="reading-room-status">
              <view class="status-dot-live"></view>
              <view>共读中</view>
            </view>
            <view class="reading-room-title">被讨厌的勇气 · 第三章</view>
            <view class="reading-room-meta">觉醒者 · 3班（晚读）</view>
          </view>
          <view class="reading-room-online">
            <view class="online-count">10/10</view>
            <view class="online-label">在线</view>
          </view>
        </view>

        <!-- Phase Indicator -->
        <view class="phase-indicator fade-in" style="animation-delay: 0.1s;">
          <view class="phase-item active">
            <text class="fas fa-microphone"></text> 朗读阶段
          </view>
          <view class="phase-item" @click="goToSharing">
            <text class="fas fa-comments"></text> 分享阶段
          </view>
        </view>

        <!-- Timer Bar -->
        <view class="timer-bar fade-in" style="animation-delay: 0.15s;">
          <view class="timer-icon">
            <text class="fas fa-clock"></text>
          </view>
          <view class="timer-info">
            <view class="timer-label">朗读阶段剩余</view>
            <view class="timer-value">{{ phaseTimerDisplay }}</view>
          </view>
          <view class="timer-phase">进行中</view>
        </view>

        <!-- AI Recording Indicator -->
        <view class="ai-recording fade-in" style="animation-delay: 0.2s;">
          <view class="ai-recording-dot"></view>
          <view class="ai-recording-text">AI 正在记录，稍后生成成长报告</view>
          <text class="fas fa-robot ai-recording-icon"></text>
        </view>

        <!-- Current Reader -->
        <view class="current-reader fade-in" style="animation-delay: 0.25s;"
          :class="{ 'is-me': readingState === 'reading' }">
          <view class="reader-label">{{ readingState === 'reading' ? '你正在朗读' : '正在朗读' }}</view>
          <image :src="currentReaderAvatar" class="reader-avatar" mode="aspectFill"></image>
          <view class="reader-name">{{ currentReaderName }}</view>
          <view class="reader-status">{{ currentReaderStatus }}</view>
          <view class="voice-wave">
            <view class="voice-bar"></view>
            <view class="voice-bar"></view>
            <view class="voice-bar"></view>
            <view class="voice-bar"></view>
            <view class="voice-bar"></view>
          </view>
        </view>

        <!-- Reading Text -->
        <view class="reading-text fade-in" style="animation-delay: 0.3s;">
          <view class="reading-text-header">
            <view class="reading-text-chapter">第三章 · 课题分离</view>
            <view class="reading-text-page">P.52</view>
          </view>
          <view class="reading-text-content">
            <view class="highlight">一切人际关系的矛盾，都起因于对别人的课题妄加干涉，或者自己的课题被别人妄加干涉。</view>只要能够进行课题分离，人际关系就会发生巨大改变。
          </view>
        </view>

        <!-- Reading Queue -->
        <view class="queue-section fade-in" style="animation-delay: 0.35s;">
          <view class="queue-header">
            <view class="queue-title">朗读顺序</view>
            <view class="text-sm text-muted">我是第 5 位</view>
          </view>
          <view class="queue-list">
            <view v-for="member in queueMembers" :key="member.id" class="queue-item" :class="member.status">
              <image :src="member.avatar" class="queue-avatar" :style="member.avatarStyle" mode="aspectFill"></image>
              <view class="queue-name" :style="member.nameStyle">{{ member.name }}</view>
              <view v-if="member.badge" class="queue-badge">{{ member.badge }}</view>
              <view v-if="member.isCurrent" class="current-indicator">
                <text class="fas fa-microphone"></text>
              </view>
            </view>
          </view>
        </view>

        <!-- Action Buttons -->
        <view class="action-row fade-in" style="animation-delay: 0.4s;">
          <view v-if="readingState === 'waiting'" class="action-btn-large action-btn-secondary" @click="raiseHand"
            :class="{ 'hand-raised': hasRaisedHand }">
            <text class="fas fa-hand"></text> {{ hasRaisedHand ? '已举手' : '举手发言' }}
          </view>
          <view v-if="readingState === 'waiting'" class="action-btn-large action-btn-secondary" @click="recordThought">
            <text class="fas fa-lightbulb"></text> 此刻想法
          </view>
        </view>

        <!-- Demo Button (for testing flow) -->
        <view v-if="readingState === 'waiting'" class="demo-section fade-in" style="animation-delay: 0.42s;">
          <view class="demo-btn" @click="simulateMyTurn">
            <text class="fas fa-play-circle"></text> 演示：模拟轮到我
          </view>
        </view>

        <!-- Today's Awareness Task -->
        <view class="section-header fade-in" style="animation-delay: 0.45s;">
          <view>本期觉察任务</view>
          <view @click="goToDailyTask">全部</view>
        </view>
        <view class="card awareness-task fade-in" style="animation-delay: 0.45s;">
          <view class="flex items-center gap-md mb-sm">
            <view class="task-icon">
              <text class="fas fa-feather"></text>
            </view>
            <view class="flex-1">
              <view class="task-title">课题分离练习</view>
              <view class="text-sm text-muted">第三周任务 · 已完成 2/7 天</view>
            </view>
            <view class="badge badge-green" style="font-size: 22rpx;">进行中</view>
          </view>
          <view class="task-desc">
            今天遇到一件让你不舒服的事时，先问自己：<view class="task-desc-strong">「这是谁的课题？」</view>
          </view>
        </view>

        <!-- Exit Button -->
        <view class="fade-in mt-lg" style="animation-delay: 0.5s;">
          <view class="action-btn-large action-btn-exit" style="width: 100%;" @click="leaveBookroom">
            <text class="fas fa-moon"></text> 今晚先到这里
          </view>
        </view>

        <view style="height: 40rpx;"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
// @ts-ignore - uni API is available in uniapp environment
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Welcome animation
const showWelcome = ref(true)
const welcomeAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop'
]

// Reading state machine: 'waiting' | 'my_turn' | 'reading' | 'finished'
const readingState = ref<'waiting' | 'my_turn' | 'reading' | 'finished'>('waiting')
const showMicPermission = ref(false)
const hasRaisedHand = ref(false)

// Current reader info (dynamic based on state)
const currentReaderAvatar = computed(() => {
  if (readingState.value === 'reading') {
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' // 我的头像
  }
  return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' // 王明
})

const currentReaderName = computed(() => {
  if (readingState.value === 'reading') {
    return '我'
  }
  return '王明'
})

const currentReaderStatus = computed(() => {
  if (readingState.value === 'reading') {
    return '第 5 位 · 正在朗读第 3 段'
  }
  return '第 3 位 · 正在朗读第 2 段'
})

// Phase timer
const phaseTimeRemaining = ref(18 * 60 + 42) // 18:42 in seconds
const phaseTimerDisplay = ref('18:42')
let timerInterval: number | null = null

const updateTimer = () => {
  if (phaseTimeRemaining.value > 0) {
    phaseTimeRemaining.value--
    const minutes = Math.floor(phaseTimeRemaining.value / 60)
    const seconds = phaseTimeRemaining.value % 60
    phaseTimerDisplay.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

onMounted(() => {
  // Hide welcome after 2 seconds
  setTimeout(() => {
    showWelcome.value = false
  }, 2000)

  // Start phase timer
  timerInterval = setInterval(updateTimer, 1000) as unknown as number
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

// Reading flow functions
const simulateMyTurn = () => {
  readingState.value = 'my_turn'
}

const requestMicPermission = () => {
  // 先关闭"轮到我"弹窗，再显示权限请求
  readingState.value = 'waiting'
  setTimeout(() => {
    showMicPermission.value = true
  }, 100)
}

const allowMicPermission = () => {
  showMicPermission.value = false
  readingState.value = 'reading'
}

const denyMicPermission = () => {
  showMicPermission.value = false
  readingState.value = 'waiting'
}

const skipMyTurn = () => {
  readingState.value = 'waiting'
}

const endReading = () => {
  readingState.value = 'waiting'
}

const queueMembers = [
  {
    id: 1,
    name: '李静',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    status: 'done'
  },
  {
    id: 2,
    name: '张婷',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    status: 'done'
  },
  {
    id: 3,
    name: '王明',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    status: '',
    isCurrent: true,
    avatarStyle: 'border-color: #f4d03f;',
    nameStyle: 'color: #f4d03f;'
  },
  {
    id: 4,
    name: '陈伟',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    status: 'next'
  },
  {
    id: 5,
    name: '我',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    status: 'me',
    badge: '第5位'
  },
  {
    id: 6,
    name: '刘芳',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    status: ''
  },
  {
    id: 7,
    name: '赵强',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    status: ''
  }
]

const goBack = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/bookroom-hub'
  })
}

const goToSharing = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/bookroom-sharing'
  })
}

const raiseHand = () => {
  hasRaisedHand.value = !hasRaisedHand.value
  if (hasRaisedHand.value) {
    // 已举手状态
  }
}

const recordThought = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/write-journal?type=读书笔记'
  })
}

const goToDailyTask = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/daily-task'
  })
}

const leaveBookroom = () => {
  // @ts-ignore
  uni.showModal({
    title: '提示',
    content: '今晚辛苦了，明天同一时间再见？',
    success: (res) => {
      if (res.confirm) {
        // @ts-ignore
        uni.navigateTo({
          url: '/home'
        })
      }
    }
  })
}
</script>

<style scoped>
/* Reading Room Header */
.reading-room-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.12) 0%, rgba(243, 156, 18, 0.06) 100%);
  border-radius: 32rpx;
  margin-bottom: 32rpx;
  border: 1px solid rgba(244, 208, 63, 0.2);
}

.btn-back-room {
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 20rpx;
  color: #ffffff;
  font-size: 28rpx;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reading-room-info {
  flex: 1;
  min-width: 0;
}

.reading-room-status {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx 20rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #58d68a;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.status-dot-live {
  width: 16rpx;
  height: 16rpx;
  background: #58d68a;
  border-radius: 50%;
  animation: pulse-live 1.5s ease-in-out infinite;
}

@keyframes pulse-live {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}

.reading-room-title {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 4rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reading-room-meta {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.reading-room-online {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 24rpx;
  background: rgba(88, 214, 141, 0.15);
  border-radius: 20rpx;
  flex-shrink: 0;
}

.online-count {
  font-size: 32rpx;
  color: #58d68a;
  font-weight: 700;
}

.online-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* Phase Indicator */
.phase-indicator {
  display: flex;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 24rpx;
  padding: 8rpx;
  margin-bottom: 32rpx;
}

.phase-item {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 20rpx;
  transition: all 0.2s;
  cursor: pointer;
}

.phase-item.active {
  background: rgba(88, 214, 141, 0.2);
  color: #58d68a;
  font-weight: 600;
}

.phase-item.completed {
  color: rgba(255, 255, 255, 0.7);
}

.phase-item.completed text {
  color: #58d68a;
}

/* Current Reader */
.current-reader {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(243, 156, 18, 0.08) 100%);
  border: 1px solid rgba(244, 208, 63, 0.3);
  border-radius: 32rpx;
  padding: 40rpx;
  text-align: center;
  margin-bottom: 32rpx;
}

.reader-label {
  font-size: 24rpx;
  color: #f4d03f;
  text-transform: uppercase;
  letter-spacing: 2rpx;
  margin-bottom: 24rpx;
}

.reader-avatar {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  border: 6rpx solid #f4d03f;
  margin-bottom: 24rpx;
}

.reader-name {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.reader-status {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
}

.voice-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  margin-top: 24rpx;
}

.voice-bar {
  width: 8rpx;
  height: 40rpx;
  background: #f4d03f;
  border-radius: 4rpx;
  animation: wave 0.5s ease-in-out infinite;
}

.voice-bar:nth-child(2) {
  animation-delay: 0.1s;
  height: 56rpx;
}

.voice-bar:nth-child(3) {
  animation-delay: 0.2s;
  height: 32rpx;
}

.voice-bar:nth-child(4) {
  animation-delay: 0.3s;
  height: 48rpx;
}

.voice-bar:nth-child(5) {
  animation-delay: 0.4s;
  height: 40rpx;
}

@keyframes wave {

  0%,
  100% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(0.5);
  }
}

/* Reading Text */
.reading-text {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
}

.reading-text-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.reading-text-chapter {
  font-size: 26rpx;
  color: #f4d03f;
  font-weight: 600;
}

.reading-text-page {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.reading-text-content {
  font-size: 32rpx;
  color: #ffffff;
  line-height: 1.5;
}

.reading-text-content .highlight {
  background: rgba(244, 208, 63, 0.3);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  display: inline;
}

/* Queue */
.queue-section {
  margin-bottom: 32rpx;
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.queue-title {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.queue-list {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  padding-bottom: 16rpx;
}

.queue-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
  position: relative;
}

.queue-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  border: 4rpx solid transparent;
}

.queue-item.next .queue-avatar {
  border-color: #f4d03f;
}

.queue-item.me .queue-avatar {
  border-color: #58d68a;
}

.queue-item.done .queue-avatar {
  opacity: 0.5;
}

.queue-name {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  max-width: 100rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.queue-item.next .queue-name {
  color: #f4d03f;
}

.queue-item.me .queue-name {
  color: #58d68a;
}

.queue-badge {
  font-size: 18rpx;
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
  background: rgba(88, 214, 141, 0.2);
  color: #58d68a;
}

.current-indicator {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 24rpx;
  height: 24rpx;
  background: #f4d03f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-indicator text {
  font-size: 14rpx;
  color: #1a1a2e;
}

/* AI Recording */
.ai-recording {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  background: rgba(155, 89, 182, 0.15);
  border-radius: 24rpx;
  margin-bottom: 32rpx;
}

.ai-recording-dot {
  width: 20rpx;
  height: 20rpx;
  background: #e74c3c;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

.ai-recording-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  flex: 1;
}

.ai-recording-icon {
  color: #9b59b6;
  font-size: 32rpx;
}

/* Timer */
.timer-bar {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx 32rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  margin-bottom: 32rpx;
}

.timer-icon {
  width: 72rpx;
  height: 72rpx;
  background: rgba(244, 208, 63, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f4d03f;
}

.timer-info {
  flex: 1;
}

.timer-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.timer-value {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: 700;
}

.timer-phase {
  font-size: 24rpx;
  color: #58d68a;
  background: rgba(88, 214, 141, 0.15);
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
}

/* Action Buttons */
.action-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 32rpx;
}

.action-btn-large {
  flex: 1;
  padding: 32rpx;
  border-radius: 24rpx;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  border: none;
  cursor: pointer;
}

.action-btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.action-btn-danger {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.action-btn-exit {
  background: rgba(155, 89, 182, 0.15);
  color: #b39ddb;
  border: 1px solid rgba(155, 89, 182, 0.3);
}

/* Awareness Task */
.awareness-task {
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.1) 0%, rgba(46, 204, 113, 0.05) 100%);
  border: 1px solid rgba(88, 214, 141, 0.2);
}

.task-icon {
  width: 80rpx;
  height: 80rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-icon text {
  color: #58d68a;
  font-size: 32rpx;
}

.task-title {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
}

.task-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
}

.task-desc-strong {
  color: #58d68a;
}

/* Utility Classes */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-md {
  gap: 24rpx;
}

.mb-sm {
  margin-bottom: 16rpx;
}

.flex-1 {
  flex: 1;
}

.text-sm {
  font-size: 24rpx;
}

.text-muted {
  color: rgba(255, 255, 255, 0.5);
}

.mt-lg {
  margin-top: 32rpx;
}

.card {
  border-radius: 32rpx;
  padding: 32rpx;
}

.badge {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.badge-green {
  background: rgba(88, 214, 141, 0.2);
  color: #58d68a;
}

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
}

/* Welcome Animation */
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.welcome-content {
  text-align: center;
  animation: welcome-pop 0.5s ease-out;
}

@keyframes welcome-pop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.welcome-icon {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40rpx;
  font-size: 64rpx;
  color: #1a1a2e;
  animation: icon-glow 1.5s ease-in-out infinite;
}

@keyframes icon-glow {

  0%,
  100% {
    box-shadow: 0 0 40rpx rgba(244, 208, 63, 0.4);
  }

  50% {
    box-shadow: 0 0 80rpx rgba(244, 208, 63, 0.6);
  }
}

.welcome-title {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 16rpx;
}

.welcome-message {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40rpx;
}

.welcome-members {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.welcome-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  border: 4rpx solid #1a1a2e;
  margin-left: -20rpx;
}

.welcome-avatar:first-child {
  margin-left: 0;
}

.welcome-count {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 4rpx solid #1a1a2e;
  margin-left: -20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* My Turn Overlay */
.my-turn-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
}

.my-turn-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 64rpx 48rpx;
  text-align: center;
  max-width: 640rpx;
  width: 100%;
  position: relative;
  border: 1px solid rgba(244, 208, 63, 0.3);
}

.my-turn-pulse {
  position: absolute;
  top: -4rpx;
  left: -4rpx;
  right: -4rpx;
  bottom: -4rpx;
  border: 4rpx solid #f4d03f;
  border-radius: 32rpx;
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.my-turn-icon {
  width: 144rpx;
  height: 144rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40rpx;
  font-size: 56rpx;
  color: #1a1a2e;
  animation: icon-bounce 1s ease-in-out infinite;
}

@keyframes icon-bounce {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.my-turn-title {
  font-size: 44rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 16rpx;
}

.my-turn-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 40rpx;
}

.my-turn-text-preview {
  background: rgba(244, 208, 63, 0.1);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 48rpx;
  text-align: left;
}

.preview-label {
  font-size: 22rpx;
  color: #f4d03f;
  text-transform: uppercase;
  letter-spacing: 2rpx;
  margin-bottom: 16rpx;
}

.preview-content {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-style: italic;
}

.my-turn-btn {
  width: 100%;
  padding: 32rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border: none;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.my-turn-skip {
  background: none;
  border: none;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 16rpx;
}

.my-turn-skip:hover {
  color: rgba(255, 255, 255, 0.7);
}

/* Permission Modal */
.permission-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 40rpx;
}

.permission-modal {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 56rpx 48rpx;
  text-align: center;
  max-width: 600rpx;
  width: 100%;
}

.permission-icon {
  width: 112rpx;
  height: 112rpx;
  background: rgba(93, 173, 226, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32rpx;
  font-size: 48rpx;
  color: #5dade2;
}

.permission-title {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.permission-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 48rpx;
  line-height: 1.5;
}

.permission-actions {
  display: flex;
  gap: 24rpx;
}

.permission-btn-deny,
.permission-btn-allow {
  flex: 1;
  padding: 24rpx;
  border-radius: 20rpx;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.permission-btn-deny {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

.permission-btn-allow {
  background: #5dade2;
  color: #fff;
}

/* Reading Controls Bar */
.reading-controls-bar {
  position: fixed;
  bottom: 160rpx;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.95) 0%, rgba(46, 204, 113, 0.95) 100%);
  border-radius: 48rpx;
  padding: 24rpx 40rpx;
  display: flex;
  align-items: center;
  gap: 32rpx;
  z-index: 100;
  box-shadow: 0 8rpx 40rpx rgba(88, 214, 141, 0.4);
}

.reading-controls-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.reading-wave-mini {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.reading-wave-mini .wave-bar {
  width: 6rpx;
  height: 24rpx;
  background: #1a1a2e;
  border-radius: 4rpx;
  animation: wave-mini 0.5s ease-in-out infinite;
}

.reading-wave-mini .wave-bar:nth-child(2) {
  animation-delay: 0.1s;
  height: 32rpx;
}

.reading-wave-mini .wave-bar:nth-child(3) {
  animation-delay: 0.2s;
  height: 20rpx;
}

@keyframes wave-mini {

  0%,
  100% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(0.5);
  }
}

.reading-controls-text {
  font-size: 28rpx;
  color: #1a1a2e;
  font-weight: 600;
}

.reading-end-btn {
  padding: 20rpx 32rpx;
  background: rgba(26, 26, 46, 0.2);
  border: none;
  border-radius: 24rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

/* Current Reader - Is Me Style */
.current-reader.is-me {
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.2) 0%, rgba(46, 204, 113, 0.1) 100%);
  border-color: rgba(88, 214, 141, 0.4);
}

.current-reader.is-me .reader-label {
  color: #58d68a;
}

.current-reader.is-me .reader-avatar {
  border-color: #58d68a;
}

.current-reader.is-me .voice-bar {
  background: #58d68a;
}

/* Hand Raised Button State */
.action-btn-large.hand-raised {
  background: rgba(244, 208, 63, 0.2);
  color: #f4d03f;
  border: 1px solid rgba(244, 208, 63, 0.3);
}

/* Demo Button */
.demo-section {
  margin-bottom: 32rpx;
}

.demo-btn {
  width: 100%;
  padding: 28rpx;
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(142, 68, 173, 0.1) 100%);
  border: 1px dashed rgba(155, 89, 182, 0.4);
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #b39ddb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.demo-btn:hover {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.3) 0%, rgba(142, 68, 173, 0.2) 100%);
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
