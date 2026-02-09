<template>

  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <view class="flex justify-between items-center mb-lg fade-in">
          <view>
            <view style="color: var(--text-primary);font-size: 44rpx;">我的日记</view>
            <view class="text-sm text-muted">每一次觉察，都是成长</view>
          </view>
          <view class="btn btn-primary btn-sm" @click="writeJournal">
            <view class="fas fa-plus"></view> 记录
          </view>
        </view>

        <view class="card fade-in" style="animation-delay: 0.1s;">
          <view class="text-sm text-muted mb-sm">此刻，你感觉怎么样？</view>
          <view class="emotion-grid">
            <view v-for="emotion in emotions" :key="emotion.icon" class="emotion-item"
              :class="{ active: selectedEmotion === emotion.icon }" @click="selectedEmotion = emotion.icon">
              <view class="emotion-icon">{{ emotion.icon }}</view>
              <view class="emotion-label">{{ emotion.label }}</view>
            </view>
          </view>
        </view>

        <view class="section-header fade-in mt-lg" style="animation-delay: 0.2s;">
          <view>日记类型</view>
        </view>
        <view class="journal-types fade-in" style="animation-delay: 0.2s;">
          <view v-for="type in journalTypes" :key="type.name" class="badge" :class="type.badgeClass" :style="type.style"
            @click="selectType(type.name)">
            <view :class="type.iconClass"></view>&nbsp;{{ type.name }}
          </view>
        </view>

        <view v-if="!hasJournals" class="empty-state fade-in" style="animation-delay: 0.3s;">
          <view class="empty-state-icon">
            <view class="fas fa-feather-alt"></view>
          </view>
          <view class="empty-state-title">开始你的觉察之旅</view>
          <view class="empty-state-desc">写下第一篇日记，记录此刻的心情和感受</view>
          <view class="empty-state-btn" @click="writeJournal">
            <view class="fas fa-feather"></view> 写第一篇日记
          </view>
          <view class="empty-state-tips">
            <view class="tips-title">不知道写什么？试试这些：</view>
            <view class="tips-list">
              <view class="tip-item" @click="writeWithPrompt('今天让我感到开心的一件小事是...')">
                <view class="fas fa-sun"></view>
                <view>今天让我感到开心的一件小事</view>
              </view>
              <view class="tip-item" @click="writeWithPrompt('此刻我的心情是...因为...')">
                <view class="fas fa-heart"></view>
                <view>此刻的心情和原因</view>
              </view>
              <view class="tip-item" @click="writeWithPrompt('今天我想对自己说...')">
                <view class="fas fa-comment-dots"></view>
                <view>今天想对自己说的话</view>
              </view>
            </view>
          </view>
        </view>

        <template v-else>
          <view class="section-header fade-in mt-lg" style="animation-delay: 0.3s;">
            <view>今天</view>
          </view>

          <view class="journal-entry fade-in" style="animation-delay: 0.3s;" @click="viewJournalDetail('today-1')">
            <view class="flex justify-between items-center mb-sm">
              <view class="journal-date">21:15 · 觉察日记</view>
              <view style="font-size: 40rpx;">😌</view>
            </view>
            <view class="journal-content">
              今天在书房读到"课题分离"这个概念，突然有种被点醒的感觉。我一直以来都在为别人的情绪负责，总觉得如果对方不开心，一定是我做错了什么。但其实，别人的情绪是别人的课题，我能做的只是做好自己...
            </view>
            <view class="journal-tags mb-md">
              <view class="badge badge-blue">读书觉察</view>
              <view class="badge badge-green">课题分离</view>
              <view class="badge badge-gold">成长</view>
            </view>

            <view class="ai-insight" style="margin-top: 24rpx;">
              <view class="ai-insight-header">
                <view class="ai-icon" style="width: 56rpx; height: 56rpx; font-size: 24rpx;">
                  <view class="fas fa-sparkles"></view>
                </view>
                <view style="font-size: 26rpx; color: var(--accent-gold); font-weight: 600;">AI 洞见</view>
              </view>
              <view style="font-size: 26rpx; color: var(--text-secondary); line-height: 1.6;">
                你今天的觉察很深刻！"课题分离"是阿德勒心理学的核心概念。我注意到你提到"为别人的情绪负责"——这在你过去的日记中出现过 3 次。今天的觉察是一个重要的转折点 ✨
              </view>
            </view>
          </view>

          <view class="section-header fade-in mt-lg" style="animation-delay: 0.4s;">
            <view>昨天</view>
          </view>

          <view class="journal-entry fade-in" style="animation-delay: 0.4s;" @click="viewJournalDetail('yesterday-1')">
            <view class="flex justify-between items-center mb-sm">
              <view class="journal-date">22:30 · 感恩日记</view>
              <view style="font-size: 40rpx;">🙏</view>
            </view>
            <view class="journal-content">
              今天感恩的三件事：<view></view>
              1. 感恩书房的伙伴们，每天的陪伴让我不再孤单<view></view>
              2. 感恩自己坚持了第 6 天的阅读<view></view>
              3. 感恩女儿今天主动给我倒了杯水
            </view>
            <view class="journal-tags">
              <view class="badge badge-pink">感恩</view>
              <view class="badge badge-green">家庭</view>
            </view>
          </view>

          <view class="journal-entry fade-in" style="animation-delay: 0.5s;" @click="viewJournalDetail('yesterday-2')">
            <view class="flex justify-between items-center mb-sm">
              <view class="journal-date">14:20 · 觉察日记</view>
              <view style="font-size: 40rpx;">😰</view>
            </view>
            <view class="journal-content">
              下午开会时又被领导批评了，当时感觉很委屈。但冷静下来想想，他说的也有道理，我确实在细节上不够仔细。觉察到自己的第一反应是"防御"，而不是"接受"...
            </view>
            <view class="journal-tags">
              <view class="badge badge-blue">工作</view>
              <view class="badge badge-gold">情绪觉察</view>
            </view>
          </view>

          <view class="section-header fade-in mt-lg" style="animation-delay: 0.6s;">
            <view>更早</view>
            <view href="#" @click.prevent="viewAllJournals">查看全部</view>
          </view>

          <view class="journal-entry fade-in" style="animation-delay: 0.6s;" @click="viewJournalDetail('earlier-1')">
            <view class="flex justify-between items-center mb-sm">
              <view class="journal-date">1月7日 · 复盘日记</view>
              <view style="font-size: 40rpx;">📝</view>
            </view>
            <view class="journal-content">
              本周复盘：完成了 5 天的共读，写了 4 篇觉察日记。最大的收获是开始学会"暂停"——在情绪上来的时候，先深呼吸，再回应...
            </view>
            <view class="journal-tags">
              <view class="badge badge-blue">周复盘</view>
            </view>
          </view>
        </template>

        <view style="height: 40rpx;"></view>
      </view>
    </template>
  </page-root>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const hasJournals = ref(true)

const emotions = [
  { icon: '😊', label: '开心' },
  { icon: '😌', label: '平静' },
  { icon: '😔', label: '低落' },
  { icon: '😰', label: '焦虑' },
  { icon: '😤', label: '烦躁' }
]

const selectedEmotion = ref('😌')

const journalTypes = [
  {
    name: '觉察日记',
    iconClass: 'fas fa-feather',
    badgeClass: 'badge-gold',
    style: { padding: '16rpx 32rpx', whiteSpace: 'nowrap', cursor: 'pointer' }
  },
  {
    name: '感恩日记',
    iconClass: 'fas fa-heart',
    badgeClass: 'badge-pink',
    style: { padding: '16rpx 32rpx', whiteSpace: 'nowrap', cursor: 'pointer', background: 'rgba(248, 165, 194, 0.1)' }
  },
  {
    name: '复盘日记',
    iconClass: 'fas fa-rotate',
    badgeClass: 'badge-blue',
    style: { padding: '16rpx 32rpx', whiteSpace: 'nowrap', cursor: 'pointer', background: 'rgba(93, 173, 226, 0.1)' }
  },
  {
    name: '读书笔记',
    iconClass: 'fas fa-book',
    badgeClass: 'badge-green',
    style: { padding: '16rpx 32rpx', whiteSpace: 'nowrap', cursor: 'pointer', background: 'rgba(88, 214, 141, 0.1)' }
  }
]

const handleTabChange = (tab: string) => {
  const routes: Record<string, string> = {
    home: '/home',
    bookroom: '/audiobooks',
    journal: '/journal',
    plaza: '/plaza',
    profile: '/profile'
  }
  router.push(routes[tab] || '/')
}

const writeJournal = () => {
  router.push('/write-journal')
}

const writeWithPrompt = (prompt: string) => {
  router.push(`/write-journal?prompt=${encodeURIComponent(prompt)}`)
}

const selectType = (typeName: string) => {
  router.push(`/write-journal?type=${typeName}`)
}

const viewJournalDetail = (journalId: string) => {
  router.push(`/journal-detail?id=${journalId}`)
}

const viewAllJournals = () => {
  router.push('/journal')
}
</script>

<style scoped>
.journal-types {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  padding-bottom: 16rpx;
}

.journal-types .badge {
  flex-shrink: 0;
}

.journal-entry {
  cursor: pointer;
  transition: background 0.2s;
}

.journal-entry:hover {
  background: var(--bg-card-hover);
}

.empty-state {
  text-align: center;
  padding: 80rpx 40rpx;
  margin-top: 40rpx;
}

.empty-state-icon {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, rgba(248, 165, 194, 0.2) 0%, rgba(248, 165, 194, 0.1) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40rpx;
  font-size: 64rpx;
  color: #f8a5c2;
}

.empty-state-title {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 16rpx;
}

.empty-state-desc {
  font-size: 28rpx;
  color: var(--text-muted);
  margin-bottom: 48rpx;
}

.empty-state-btn {
  padding: 28rpx 64rpx;
  background: linear-gradient(135deg, #f8a5c2 0%, #f78fb3 100%);
  border: none;
  border-radius: 48rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 64rpx;
}

.empty-state-tips {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  text-align: left;
}

.tips-title {
  font-size: 26rpx;
  color: var(--text-muted);
  margin-bottom: 24rpx;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.tip-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.tip-item view {
  width: 64rpx;
  height: 64rpx;
  background: rgba(248, 165, 194, 0.15);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f8a5c2;
  font-size: 28rpx;
}

.tip-item view {
  font-size: 28rpx;
  color: var(--text-secondary);
}
</style>
