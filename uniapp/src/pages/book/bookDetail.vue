<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Back Button -->
        <view class="flex items-center justify-between mb-md fade-in">
          <view class="btn btn-secondary btn-sm" @click="goBack">
            <text class="fas fa-arrow-left"></text>
          </view>
          <view class="flex gap-sm">
            <view class="btn btn-secondary btn-sm">
              <text class="fas fa-heart"></text>
            </view>
            <view class="btn btn-secondary btn-sm">
              <text class="fas fa-share"></text>
            </view>
          </view>
        </view>

        <!-- Book Header -->
        <view class="book-header fade-in" style="animation-delay: 0.1s">
          <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=240&h=320&fit=crop"
            class="book-cover-large" mode="aspectFill"></image>
          <view class="book-title-large">被讨厌的勇气</view>
          <view class="book-author">岸见一郎 / 古贺史健</view>
          <view class="book-meta-row">
            <view class="book-meta-item">
              <text class="fas fa-clock"></text> 38分钟
            </view>
            <view class="book-meta-item">
              <text class="fas fa-headphones"></text> 3.2万次播放
            </view>
          </view>
        </view>

        <!-- Audio Player -->
        <view class="audio-card fade-in" style="animation-delay: 0.15s">
          <view class="audio-now-playing">
            <text class="fas fa-circle"></text> 正在播放
          </view>
          <view class="audio-title">被讨厌的勇气 · 精华解读</view>
          <view class="audio-progress">
            <view class="audio-progress-bar">
              <view class="audio-progress-fill" style="width: 45%"></view>
            </view>
            <view class="audio-time">
              <view>17:08</view>
              <view>38:00</view>
            </view>
          </view>
          <view class="audio-controls">
            <view class="audio-btn audio-btn-sm">
              <text class="fas fa-rotate-left"></text>
              <view>15</view>
            </view>
            <view class="audio-btn">
              <text class="fas fa-backward-step"></text>
            </view>
            <view class="audio-btn audio-btn-main">
              <text class="fas fa-pause"></text>
            </view>
            <view class="audio-btn">
              <text class="fas fa-forward-step"></text>
            </view>
            <view class="audio-btn audio-btn-sm">
              <text class="fas fa-rotate-right"></text>
              <view>15</view>
            </view>
          </view>
        </view>

        <!-- Content Tabs -->
        <view class="content-tabs fade-in" style="animation-delay: 0.2s">
          <view v-for="tab in contentTabs" :key="tab.id" class="content-tab" :class="{ active: activeTab === tab.id }"
            @click="scrollToSection(tab.id)">
            <text :class="tab.icon"></text>
            {{ tab.label }}
          </view>
        </view>

        <!-- Awareness Task -->
        <view id="section-awareness" class="task-card fade-in" style="animation-delay: 0.25s">
          <view class="task-header">
            <view class="task-icon">
              <text class="fas fa-feather"></text>
            </view>
            <view class="task-label">今日觉察任务</view>
            <view class="task-badge">待完成</view>
          </view>
          <view class="task-content">
            听完这本书后，回想一下：在你的生活中，有没有一件事是你一直在<view class="task-content-strong">「等待准备好」</view>才去做的？<view></view>
            <view></view>
            阿德勒说：「人生不是由过去决定的，而是由此刻决定的。」试着今天就迈出第一步。
          </view>
          <view class="task-btn">
            <text class="fas fa-feather"></text> 记录我的觉察
          </view>
        </view>

        <!-- Transcript -->
        <view id="section-transcript" class="transcript-card fade-in" style="animation-delay: 0.3s">
          <view class="transcript-header">
            <view class="transcript-title">详细文稿</view>
            <view class="transcript-action"><text class="fas fa-expand"></text> 全屏</view>
          </view>
          <view class="transcript-content transcript-fade">
            <view>
              你好，欢迎来到MindBond听书房。今天我们要解读的这本书，叫做<view class="transcript-highlight">《被讨厌的勇气》</view>。
            </view>
            <view>
              这本书以对话的形式，讲述了一位青年和一位哲学家之间的五个夜晚的对话。青年对人生感到迷茫，而哲学家用阿德勒心理学的智慧，一步步引导他找到生命的答案。
            </view>
            <view>
              阿德勒心理学有一个核心观点，叫做<view class="transcript-highlight">「目的论」</view>。和弗洛伊德的「原因论」不同，阿德勒认为...
            </view>
          </view>
          <view class="transcript-expand">
            <view class="transcript-expand-btn"><text class="fas fa-chevron-down"></text> 展开全文</view>
          </view>
        </view>

        <!-- Mind Map -->
        <view id="section-mindmap" class="mindmap-card fade-in" style="animation-delay: 0.35s">
          <view class="mindmap-header">
            <view class="mindmap-title">思维导图</view>
          </view>
          <view class="mindmap-preview">
            <view class="mindmap-placeholder">
              <text class="fas fa-sitemap"></text>
            </view>
            <view class="mindmap-hint">清晰梳理本书核心概念与框架</view>
            <view class="mindmap-btn">
              <text class="fas fa-search-plus"></text> 查看大图
            </view>
          </view>
        </view>

        <!-- Quotes -->
        <view id="section-quotes" class="quotes-card fade-in" style="animation-delay: 0.4s">
          <view class="quotes-header">
            <view class="quotes-title">中英金句</view>
            <view class="quotes-count">共 8 句</view>
          </view>
          <view v-for="quote in quotes" :key="quote.id" class="quote-item">
            <view class="quote-zh">{{ quote.zh }}</view>
            <view class="quote-en">{{ quote.en }}</view>
            <view class="quote-actions">
              <view class="quote-action"><text class="fas fa-copy"></text> 复制</view>
              <view class="quote-action"><text class="fas fa-share"></text> 分享</view>
              <view class="quote-action"><text class="fas fa-bookmark"></text> 收藏</view>
            </view>
          </view>
        </view>

        <!-- Bootcamp Banner -->
        <view class="bootcamp-banner fade-in" style="animation-delay: 0.45s">
          <view class="bootcamp-icon">
            <text class="fas fa-graduation-cap"></text>
          </view>
          <view class="bootcamp-info">
            <view class="bootcamp-title">想要深度学习这本书？</view>
            <view class="bootcamp-desc">加入共读营 · 30天共读 · 班长陪伴</view>
          </view>
          <text class="fas fa-chevron-right bootcamp-arrow"></text>
        </view>

        <!-- Bottom Spacing -->
        <view style="height: 40rpx"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
// @ts-ignore - uni API is available in uniapp environment
import { ref } from 'vue'

const activeTab = ref('awareness')

const contentTabs = [
  { id: 'awareness', icon: 'fas fa-feather', label: '觉察' },
  { id: 'transcript', icon: 'fas fa-file-alt', label: '文稿' },
  { id: 'mindmap', icon: 'fas fa-sitemap', label: '导图' },
  { id: 'quotes', icon: 'fas fa-quote-right', label: '金句' }
]

const quotes = [
  {
    id: 1,
    zh: '「决定你人生的，不是过去的经历，而是你赋予那些经历的意义。」',
    en: '"What determines your life is not your past experiences, but the meaning you give to them."'
  },
  {
    id: 2,
    zh: '「一切烦恼都来自人际关系。」',
    en: '"All problems are interpersonal relationship problems."'
  },
  {
    id: 3,
    zh: '「自由就是被别人讨厌。」',
    en: '"Freedom is being disliked by others."'
  }
]

const goBack = () => {
  // @ts-ignore
  uni.navigateBack()
}

const scrollToSection = (tabId: string) => {
  activeTab.value = tabId
  // @ts-ignore
  uni.pageScrollTo({
    selector: `#section-${tabId}`,
    duration: 300
  })
}
</script>

<style scoped>

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.mb-md {
  margin-bottom: 32rpx;
}

.gap-sm {
  gap: 16rpx;
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
  font-size: 28rpx;
}

/* Book Header */
.book-header {
  position: relative;
  padding: 48rpx 40rpx;
  background: linear-gradient(180deg, rgba(244, 208, 63, 0.15) 0%, transparent 100%);
  text-align: center;
}

.book-cover-large {
  width: 240rpx;
  height: 320rpx;
  border-radius: 24rpx;
  margin-bottom: 32rpx;
}

.book-title-large {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.book-author {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 24rpx;
}

.book-meta-row {
  display: flex;
  justify-content: center;
  gap: 32rpx;
}

.book-meta-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
}

.book-meta-item text {
  color: #f4d03f;
}

/* Audio Player Card */
.audio-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
}

.audio-now-playing {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: #f4d03f;
  margin-bottom: 24rpx;
}

.audio-now-playing text {
  font-size: 16rpx;
  animation: pulse 1.5s infinite;
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

.audio-title {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 32rpx;
}

.audio-progress {
  margin-bottom: 24rpx;
}

.audio-progress-bar {
  height: 12rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.audio-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 6rpx;
}

.audio-time {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.audio-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
}

.audio-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 40rpx;
  cursor: pointer;
  padding: 16rpx;
}

.audio-btn-main {
  flex-shrink: 0;
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 48rpx;
}

.audio-btn-sm {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.audio-btn-sm view {
  font-size: 20rpx;
  margin-left: 4rpx;
}

/* Content Tabs */
.content-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 24rpx;
  padding: 8rpx;
  margin-bottom: 32rpx;
}

.content-tab {
  flex: 1;
  padding: 20rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 20rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.content-tab.active {
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  color: #1a1a2e;
  font-weight: 600;
}

.content-tab text {
  display: block;
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

/* Awareness Task Card */
.task-card {
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.12) 0%, rgba(46, 204, 113, 0.06) 100%);
  border: 1px solid rgba(88, 214, 141, 0.2);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.task-icon {
  width: 72rpx;
  height: 72rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #58d68a;
  font-size: 32rpx;
}

.task-label {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
}

.task-badge {
  margin-left: auto;
  padding: 8rpx 20rpx;
  background: rgba(88, 214, 141, 0.15);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #58d68a;
  font-weight: 600;
}

.task-content {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin-bottom: 24rpx;
}

.task-content-strong {
  color: #58d68a;
}

.task-btn {
  width: 100%;
  padding: 24rpx;
  background: rgba(88, 214, 141, 0.15);
  border: 1px solid rgba(88, 214, 141, 0.3);
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #58d68a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  cursor: pointer;
}

/* Transcript Section */
.transcript-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.transcript-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.transcript-title {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
}

.transcript-action {
  font-size: 24rpx;
  color: #f4d03f;
  cursor: pointer;
}

.transcript-content {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.9;
}

.transcript-content view {
  margin-bottom: 24rpx;
}

.transcript-highlight {
  display: inline;
  background: rgba(244, 208, 63, 0.15);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  color: #f4d03f;
}

.transcript-fade {
  position: relative;
}

.transcript-fade::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.05));
}

.transcript-expand {
  text-align: center;
  padding-top: 16rpx;
}

.transcript-expand-btn {
  font-size: 26rpx;
  color: #f4d03f;
  cursor: pointer;
}

/* Mind Map Card */
.mindmap-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.mindmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.mindmap-title {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
}

.mindmap-preview {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 32rpx;
  text-align: center;
}

.mindmap-img {
  width: 100%;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.mindmap-placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.mindmap-hint {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
}

.mindmap-btn {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 40rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #ffffff;
  cursor: pointer;
  margin-top: 24rpx;
}

/* Quotes Section */
.quotes-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.quotes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.quotes-title {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
}

.quotes-count {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.quote-item {
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  border-left: 6rpx solid #f4d03f;
}

.quote-item:last-child {
  margin-bottom: 0;
}

.quote-zh {
  font-size: 30rpx;
  color: #ffffff;
  line-height: 1.7;
  margin-bottom: 16rpx;
}

.quote-en {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  line-height: 1.6;
}

.quote-actions {
  display: flex;
  gap: 32rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.quote-action {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.quote-action:hover {
  color: #f4d03f;
}

/* Bootcamp Banner */
.bootcamp-banner {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.12) 0%, rgba(243, 156, 18, 0.06) 100%);
  border: 1px solid rgba(244, 208, 63, 0.2);
  border-radius: 32rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  gap: 28rpx;
  margin-bottom: 32rpx;
  cursor: pointer;
}

.bootcamp-icon {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 36rpx;
  flex-shrink: 0;
}

.bootcamp-info {
  flex: 1;
}

.bootcamp-title {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.bootcamp-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.bootcamp-arrow {
  color: rgba(255, 255, 255, 0.5);
  font-size: 28rpx;
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
