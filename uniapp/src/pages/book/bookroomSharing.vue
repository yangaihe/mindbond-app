<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Reading Room Header -->
        <view class="reading-room-header fade-in">
          <view class="btn-back-room" @click="goBack">
            <text class="fas fa-chevron-left"></text>
          </view>
          <view class="reading-room-info">
            <view class="reading-room-status">
              <view class="status-dot-live"></view>
              <view>分享中</view>
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
          <view class="phase-item completed" @click="goToReading">
            <text class="fas fa-check"></text> 朗读阶段
          </view>
          <view class="phase-item active">
            <text class="fas fa-comments"></text> 分享阶段
          </view>
        </view>

        <!-- Timer Bar -->
        <view class="timer-bar fade-in" style="animation-delay: 0.15s;">
          <view class="timer-icon">
            <text class="fas fa-clock"></text>
          </view>
          <view class="timer-info">
            <view class="timer-label">分享阶段剩余</view>
            <view class="timer-value">{{ phaseTimerDisplay }}</view>
          </view>
          <view class="timer-phase">进行中</view>
        </view>

        <!-- AI Recording Indicator -->
        <view class="ai-recording fade-in" style="animation-delay: 0.2s;">
          <view class="ai-recording-dot"></view>
          <view class="ai-recording-text">AI 正在记录分享内容</view>
          <text class="fas fa-robot ai-recording-icon"></text>
        </view>

        <!-- Facilitator Card -->
        <view class="facilitator-card fade-in" style="animation-delay: 0.22s;">
          <image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            class="facilitator-avatar" mode="aspectFill"></image>
          <view class="facilitator-info">
            <view class="facilitator-name">李静</view>
            <view class="facilitator-role">正在主持分享环节</view>
          </view>
          <view class="facilitator-badge">班长</view>
        </view>

        <!-- Discussion Topic -->
        <view class="discussion-topic fade-in" style="animation-delay: 0.25s;">
          <view class="discussion-header">
            <view class="discussion-icon">
              <text class="fas fa-lightbulb"></text>
            </view>
            <view class="discussion-label">今日讨论话题</view>
          </view>
          <view class="discussion-content">
            阿德勒说「一切烦恼都来自人际关系」，你同意吗？<view></view>
            结合今天读的「课题分离」，分享一个你的亲身经历。
          </view>
        </view>

        <!-- Current Sharer -->
        <view class="current-sharer fade-in" style="animation-delay: 0.3s;">
          <view class="sharer-label">正在分享</view>
          <image src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop"
            class="sharer-avatar" mode="aspectFill"></image>
          <view class="sharer-name">陈伟</view>
          <view class="sharer-status">第 4 位分享者</view>
          <view class="voice-wave">
            <view class="voice-bar"></view>
            <view class="voice-bar"></view>
            <view class="voice-bar"></view>
            <view class="voice-bar"></view>
          </view>
        </view>

        <!-- Hand Raised -->
        <view class="hand-raised fade-in" style="animation-delay: 0.32s;">
          <text class="fas fa-hand" style="color: #f4d03f;"></text>
          <view class="hand-raised-avatars">
            <image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop"
              class="hand-raised-avatar" mode="aspectFill"></image>
            <image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop"
              class="hand-raised-avatar" mode="aspectFill"></image>
          </view>
          <view class="hand-raised-text">2人举手想要回应</view>
        </view>

        <!-- Reaction Bar -->
        <view class="reaction-bar fade-in" style="animation-delay: 0.35s;">
          <view v-for="reaction in reactions" :key="reaction.id" class="reaction-btn"
            :class="{ active: reaction.active }" @click="reaction.active = !reaction.active">
            <view style="font-size: 48rpx;">{{ reaction.emoji }}</view>
            <view>{{ reaction.label }} {{ reaction.count || '' }}</view>
          </view>
        </view>

        <!-- Sharing List -->
        <view class="section-header fade-in" style="animation-delay: 0.38s;">
          <view>分享顺序</view>
          <view class="text-sm text-muted">4/10 已分享</view>
        </view>

        <view class="sharing-list fade-in" style="animation-delay: 0.38s;">
          <view v-for="sharer in sharers" :key="sharer.id" class="sharing-item" :class="sharer.status">
            <image :src="sharer.avatar" class="sharing-avatar" mode="aspectFill"></image>
            <view class="sharing-info">
              <view class="sharing-name">{{ sharer.name }}</view>
              <view class="sharing-preview">{{ sharer.preview }}</view>
            </view>
            <view class="sharing-status" :class="sharer.statusClass">{{ sharer.statusText }}</view>
          </view>
        </view>

        <!-- Action Buttons -->
        <view class="action-row fade-in" style="animation-delay: 0.4s;">
          <view class="action-btn-large action-btn-primary">
            <text class="fas fa-hand"></text> 举手回应
          </view>
          <view class="action-btn-large action-btn-secondary">
            <text class="fas fa-pen"></text> 准备发言
          </view>
        </view>

        <!-- Exit Button -->
        <view class="fade-in" style="animation-delay: 0.45s;">
          <view class="action-btn-large action-btn-danger" style="width: 100%;">
            <text class="fas fa-door-open"></text> 离开书房
          </view>
        </view>

        <view style="height: 40rpx;"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
// @ts-ignore - uni API is available in uniapp environment
import { ref, onMounted, onUnmounted } from 'vue'

// Phase timer
const phaseTimeRemaining = ref(22 * 60 + 18) // 22:18 in seconds
const phaseTimerDisplay = ref('22:18')
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
  timerInterval = setInterval(updateTimer, 1000) as unknown as number
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

const reactions = ref([
  { id: 1, emoji: '👏', label: '鼓掌', count: 12, active: true },
  { id: 2, emoji: '💡', label: '有启发', count: null, active: false },
  { id: 3, emoji: '🤝', label: '有共鸣', count: null, active: false },
  { id: 4, emoji: '❤️', label: '感谢', count: null, active: false }
])

const sharers = [
  {
    id: 1,
    name: '王明',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    preview: '我和父亲的关系一直很紧张...',
    status: 'done',
    statusClass: 'done',
    statusText: '已分享'
  },
  {
    id: 2,
    name: '张婷',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    preview: '今天读到课题分离我才明白...',
    status: 'done',
    statusClass: 'done',
    statusText: '已分享'
  },
  {
    id: 3,
    name: '陈伟',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    preview: '正在分享中...',
    status: 'current',
    statusClass: 'speaking',
    statusText: '分享中'
  },
  {
    id: 4,
    name: '我',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    preview: '',
    status: '',
    statusClass: 'waiting',
    statusText: '等待中'
  }
]

const goBack = () => {
  // @ts-ignore
  uni.navigateTo({
    url: '/bookroom-hub'
  })
}

const goToReading = () => {
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

/* Reading Room Header */
.reading-room-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, rgba(93, 173, 226, 0.12) 0%, rgba(52, 152, 219, 0.06) 100%);
  border-radius: 32rpx;
  margin-bottom: 32rpx;
  border: 1px solid rgba(93, 173, 226, 0.2);
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
  background: rgba(93, 173, 226, 0.2);
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #5dade2;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.status-dot-live {
  width: 16rpx;
  height: 16rpx;
  background: #5dade2;
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
  background: rgba(93, 173, 226, 0.15);
  border-radius: 20rpx;
  flex-shrink: 0;
}

.online-count {
  font-size: 32rpx;
  color: #5dade2;
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
  background: rgba(93, 173, 226, 0.2);
  color: #5dade2;
  font-weight: 600;
}

.phase-item.completed {
  color: #58d68a;
}

.phase-item.completed text {
  color: #58d68a;
}

/* Current Sharer */
.current-sharer {
  background: linear-gradient(135deg, rgba(93, 173, 226, 0.15) 0%, rgba(52, 152, 219, 0.08) 100%);
  border: 1px solid rgba(93, 173, 226, 0.3);
  border-radius: 32rpx;
  padding: 40rpx;
  text-align: center;
  margin-bottom: 32rpx;
}

.sharer-label {
  font-size: 24rpx;
  color: #5dade2;
  text-transform: uppercase;
  letter-spacing: 2rpx;
  margin-bottom: 24rpx;
}

.sharer-avatar {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  border: 6rpx solid #5dade2;
  margin-bottom: 24rpx;
}

.sharer-name {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.sharer-status {
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
  background: #5dade2;
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

/* Discussion Topic */
.discussion-topic {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
}

.discussion-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.discussion-icon {
  width: 64rpx;
  height: 64rpx;
  background: rgba(93, 173, 226, 0.2);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5dade2;
  font-size: 28rpx;
}

.discussion-label {
  font-size: 26rpx;
  color: #5dade2;
  font-weight: 600;
}

.discussion-content {
  font-size: 30rpx;
  color: #ffffff;
  line-height: 1.8;
}

/* Facilitator Card */
.facilitator-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.1) 0%, rgba(243, 156, 18, 0.05) 100%);
  border-radius: 24rpx;
  margin-bottom: 32rpx;
  border: 1px solid rgba(244, 208, 63, 0.2);
}

.facilitator-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  border: 4rpx solid #f4d03f;
}

.facilitator-info {
  flex: 1;
}

.facilitator-name {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
}

.facilitator-role {
  font-size: 24rpx;
  color: #f4d03f;
}

.facilitator-badge {
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 24rpx;
  font-size: 22rpx;
  color: #1a1a2e;
  font-weight: 600;
}

/* Sharing Queue */
.sharing-list {
  margin-bottom: 32rpx;
}

.sharing-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  margin-bottom: 16rpx;
}

.sharing-item.current {
  background: rgba(93, 173, 226, 0.1);
  border: 1px solid rgba(93, 173, 226, 0.3);
}

.sharing-item.done {
  opacity: 0.6;
}

.sharing-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.sharing-item.current .sharing-avatar {
  border: 4rpx solid #5dade2;
}

.sharing-info {
  flex: 1;
}

.sharing-name {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.sharing-preview {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 360rpx;
}

.sharing-status {
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.sharing-status.speaking {
  background: rgba(93, 173, 226, 0.2);
  color: #5dade2;
}

.sharing-status.done {
  background: rgba(88, 214, 141, 0.2);
  color: #58d68a;
}

.sharing-status.waiting {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

/* Reaction Buttons */
.reaction-bar {
  display: flex;
  justify-content: center;
  gap: 32rpx;
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  margin-bottom: 32rpx;
}

.reaction-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 32rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.reaction-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.reaction-btn.active {
  background: rgba(244, 208, 63, 0.2);
}

.reaction-btn view:last-child {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.reaction-btn.active view:last-child {
  color: #f4d03f;
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
  background: rgba(93, 173, 226, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5dade2;
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
  color: #5dade2;
  background: rgba(93, 173, 226, 0.15);
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

.action-btn-primary {
  background: linear-gradient(135deg, #5dade2 0%, #2980b9 100%);
  color: #fff;
}

.action-btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.action-btn-danger {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

/* Hand Raised Indicator */
.hand-raised {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 28rpx;
  background: rgba(244, 208, 63, 0.15);
  border-radius: 24rpx;
  margin-bottom: 32rpx;
}

.hand-raised-avatars {
  display: flex;
}

.hand-raised-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
  margin-left: -16rpx;
}

.hand-raised-avatar:first-child {
  margin-left: 0;
}

.hand-raised-text {
  font-size: 26rpx;
  color: #f4d03f;
  flex: 1;
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
