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

        <!-- Live Header -->
        <view class="live-header fade-in">
          <view class="live-badge">
            <text>直播中</text>
          </view>
          <view class="live-title">觉醒者3班 · 第2周班会</view>
          <view class="live-meta">
            <text><text class="fas fa-clock"></text> 已进行 05:32</text>
            <text><text class="fas fa-users"></text> 10人在线</text>
          </view>
        </view>

        <!-- Host Card -->
        <view class="host-card fade-in" style="animation-delay: 0.1s;">
          <image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
            class="host-avatar" alt="" mode="aspectFill"></image>
          <view class="host-info">
            <view>创始人</view>
            <view>本周主题：课题分离</view>
          </view>
          <text class="host-badge">主持中</text>
        </view>

        <!-- Agenda -->
        <view class="section-header fade-in" style="animation-delay: 0.15s;">
          <view>班会流程</view>
          <text class="text-sm text-muted">2小时</text>
        </view>

        <view class="card fade-in" style="animation-delay: 0.15s; padding: 16rpx 32rpx;">
          <view v-for="agenda in agendaItems" :key="agenda.id" class="agenda-item">
            <text class="agenda-time">{{ agenda.time }}</text>
            <view class="agenda-content">
              <view class="agenda-title">{{ agenda.title }}</view>
              <view class="agenda-desc">{{ agenda.desc }}</view>
            </view>
            <text v-if="agenda.status" class="agenda-status" :class="agenda.status">{{ agenda.statusText }}</text>
          </view>
        </view>

        <!-- Participants -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.2s;">
          <view>参会书友</view>
        </view>

        <view class="participants-row fade-in" style="animation-delay: 0.2s;">
          <view class="participant-avatars">
            <image v-for="participant in participants" :key="participant.id" :src="participant.avatar" alt=""
              mode="aspectFill"></image>
          </view>
          <text class="participant-count">等 10 人在线</text>
        </view>

        <!-- Chat Area -->
        <view class="section-header fade-in" style="animation-delay: 0.25s;">
          <view>互动区</view>
        </view>

        <view class="chat-area fade-in" style="animation-delay: 0.25s;">
          <view v-for="message in chatMessages" :key="message.id" class="chat-message">
            <image :src="message.avatar" class="chat-avatar" alt="" mode="aspectFill"></image>
            <view class="chat-content">
              <view class="chat-name" :style="message.nameStyle">{{ message.name }}</view>
              <view class="chat-text">{{ message.text }}</view>
            </view>
          </view>
        </view>

        <!-- Chat Input -->
        <view class="chat-input-area fade-in" style="animation-delay: 0.3s;">
          <input type="text" class="chat-input" placeholder="说点什么..." v-model="chatInput">
          <view class="chat-send-btn" @click="sendMessage">
            <text class="fas fa-paper-plane"></text>
          </view>
        </view>

        <!-- Action Buttons -->
        <view class="action-buttons-live fade-in" style="animation-delay: 0.35s;">
          <view v-for="action in liveActions" :key="action.id" class="action-btn-live"
            :class="{ active: action.active }" @click="action.active = !action.active">
            <text :class="action.icon"></text>
            <text>{{ action.label }}</text>
          </view>
        </view>
      </view>
    </template>
  </page-root>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const chatInput = ref('')

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

const agendaItems = [
  {
    id: 1,
    time: '20:00',
    title: '开场 · 本周回顾',
    desc: '班长问候，回顾本周共读内容',
    status: 'done',
    statusText: '已完成'
  },
  {
    id: 2,
    time: '20:10',
    title: '书友分享',
    desc: '轮流分享本周觉察收获',
    status: 'current',
    statusText: '进行中'
  },
  {
    id: 3,
    time: '20:50',
    title: '答疑环节',
    desc: '创始人解答问题，深度辅导',
    status: '',
    statusText: ''
  },
  {
    id: 4,
    time: '21:20',
    title: '本周自测',
    desc: '抢答赢书籍',
    status: '',
    statusText: ''
  },
  {
    id: 5,
    time: '21:40',
    title: '下周预告',
    desc: '预告下周内容，布置觉察任务',
    status: '',
    statusText: ''
  }
]

const participants = [
  { id: 1, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 2, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 3, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' },
  { id: 4, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop' },
  { id: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }
]

const chatMessages = ref([
  {
    id: 1,
    name: '小雨',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    text: '这周读到课题分离，真的太有感触了！之前总是为老公的情绪负责',
    nameStyle: ''
  },
  {
    id: 2,
    name: '明哥',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    text: '我也是，总觉得孩子不开心是我的错',
    nameStyle: ''
  },
  {
    id: 3,
    name: '创始人',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    text: '很棒的觉察！这正是课题分离的核心——分清什么是自己的课题，什么是别人的课题 ✨',
    nameStyle: 'color: var(--accent-gold);'
  }
])

const liveActions = ref([
  { id: 1, icon: 'fas fa-microphone-slash', label: '静音', active: true },
  { id: 2, icon: 'fas fa-video', label: '视频', active: false },
  { id: 3, icon: 'fas fa-hand', label: '举手', active: false },
  { id: 4, icon: 'fas fa-gift', label: '送礼', active: false }
])

const sendMessage = () => {
  if (chatInput.value.trim()) {
    chatMessages.value.push({
      id: chatMessages.value.length + 1,
      name: '我',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      text: chatInput.value,
      nameStyle: ''
    })
    chatInput.value = ''
  }
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

.live-header {
  position: relative;
  margin: 0 -32rpx 0 -32rpx;
  padding: 40rpx;
  background: linear-gradient(180deg, rgba(231, 76, 60, 0.2) 0%, transparent 100%);
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 24rpx;
  background: #e74c3c;
  border-radius: 40rpx;
  font-size: 24rpx;
  color: #fff;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.live-badge::before {
  content: '';
  width: 16rpx;
  height: 16rpx;
  background: #fff;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
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

.live-title {
  font-size: 40rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 16rpx;
}

.live-meta {
  display: flex;
  align-items: center;
  gap: 32rpx;
  font-size: 26rpx;
  color: var(--text-muted);
}

.live-meta text {
  margin-right: 8rpx;
}

.host-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin: 40rpx 0;
}

.host-avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  border: 6rpx solid var(--accent-gold);
}

.host-info view:first-child {
  font-size: 30rpx;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.host-info view:last-child {
  font-size: 24rpx;
  color: var(--text-muted);
}

.host-badge {
  margin-left: auto;
  padding: 12rpx 24rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 40rpx;
  font-size: 22rpx;
  color: #1a1a2e;
  font-weight: 600;
}

.agenda-item {
  display: flex;
  gap: 24rpx;
  padding: 28rpx 0;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.08);
}

.agenda-item:last-child {
  border-bottom: none;
}

.agenda-time {
  width: 100rpx;
  font-size: 26rpx;
  color: var(--text-muted);
  flex-shrink: 0;
}

.agenda-content {
  flex: 1;
}

.agenda-title {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.agenda-desc {
  font-size: 24rpx;
  color: var(--text-muted);
}

.agenda-status {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.agenda-status.current {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.agenda-status.done {
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.participants-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.participant-avatars {
  display: flex;
}

.participant-avatars image {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  border: 4rpx solid var(--bg-primary);
  margin-left: -20rpx;
}

.participant-avatars image:first-child {
  margin-left: 0;
}

.participant-count {
  font-size: 26rpx;
  color: var(--text-muted);
}

.chat-area {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 32rpx;
  height: 400rpx;
  overflow-y: auto;
  margin-bottom: 32rpx;
}

.chat-message {
  display: flex;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.chat-message:last-child {
  margin-bottom: 0;
}

.chat-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.chat-content {
  flex: 1;
}

.chat-name {
  font-size: 24rpx;
  color: var(--accent-gold);
  margin-bottom: 4rpx;
}

.chat-text {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.5;
}

.chat-input-area {
  display: flex;
  gap: 24rpx;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 24rpx 32rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 48rpx;
  color: var(--text-primary);
  font-size: 28rpx;
  outline: none;
}

.chat-input::placeholder {
  color: var(--text-muted);
}

.chat-send-btn {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 32rpx;
  border: none;
  cursor: pointer;
}

.action-buttons-live {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}

.action-btn-live {
  flex: 1;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  border: none;
  cursor: pointer;
}

.action-btn-live text:first-child {
  font-size: 40rpx;
  color: var(--text-secondary);
}

.action-btn-live text:last-child {
  font-size: 22rpx;
  color: var(--text-muted);
}

.action-btn-live.active text:first-child {
  color: var(--accent-gold);
}
</style>