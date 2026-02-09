<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <view class="flex items-center gap-sm mb-md fade-in">
          <view class="btn btn-secondary btn-sm" style="padding: 16rpx 24rpx;" @click="goBack">
            <view class="fas fa-arrow-left"></view>
          </view>
          <view class="text-muted text-sm">返回</view>
        </view>

        <view class="task-header fade-in" style="animation-delay: 0.1s;">
          <view class="task-date">2024年1月10日 · 周三</view>
          <view class="task-title">今日觉察任务</view>
          <view class="task-source">
            <view class="fas fa-book"></view> 来自《被讨厌的勇气》第12讲
          </view>
        </view>

        <view class="streak-card fade-in" style="animation-delay: 0.15s;">
          <view class="streak-info">
            <view class="streak-icon">
              <view class="fas fa-fire"></view>
            </view>
            <view class="streak-text">
              <view>连续觉察</view>
              <view>再坚持3天解锁新徽章</view>
            </view>
          </view>
          <view class="streak-days">7天</view>
        </view>

        <view class="task-card fade-in" style="animation-delay: 0.2s;">
          <view class="task-card-header">
            <view class="task-card-icon">
              <view class="fas fa-feather"></view>
            </view>
            <view class="task-card-label">今日觉察主题</view>
          </view>
          <view class="task-card-content">
            <strong>课题分离练习</strong><br><br>
            回想一下，今天有没有什么事情，让你感到焦虑或不安？<br><br>
            问问自己：<strong>"这是谁的课题？"</strong><br><br>
            如果这是别人的课题，你能做的是什么？如果这是你自己的课题，你打算怎么面对？
          </view>
          <view class="task-card-tips">
            <view class="task-card-tips-title">小提示</view>
            <view class="task-card-tips-list">
              • 不要评判对错，只是如实觉察<br>
              • 关注自己的感受和身体反应<br>
              • 写下你的发现，哪怕只有一句话
            </view>
          </view>
        </view>

        <view class="section-header fade-in" style="animation-delay: 0.25s;">
          <view>相关书摘</view>
        </view>

        <view class="context-card fade-in" style="animation-delay: 0.25s;">
          <view class="context-header">
            <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop"
              class="context-cover" mode="aspectFill"></image>
            <view class="context-info">
              <view>被讨厌的勇气</view>
              <view>第12讲 · 课题分离的勇气</view>
            </view>
          </view>
          <view class="context-quote">
            "一切人际关系的矛盾，都起因于对别人课题的妄加干涉，或者自己的课题被别人妄加干涉。只要能够进行课题分离，人际关系就会发生巨大改变。"
          </view>
        </view>

        <view class="section-header fade-in" style="animation-delay: 0.3s;">
          <view>引导问题</view>
        </view>

        <view class="reflection-prompts fade-in" style="animation-delay: 0.3s;">
          <view class="reflection-prompt-item">
            <view class="reflection-prompt-num">1</view>
            <view class="reflection-prompt-text">今天有什么事情让你感到不舒服或焦虑？</view>
          </view>
          <view class="reflection-prompt-item">
            <view class="reflection-prompt-num">2</view>
            <view class="reflection-prompt-text">这件事情中，哪些是你能控制的，哪些是你无法控制的？</view>
          </view>
          <view class="reflection-prompt-item">
            <view class="reflection-prompt-num">3</view>
            <view class="reflection-prompt-text">如果这是"别人的课题"，你能做的最好的事情是什么？</view>
          </view>
        </view>

        <view class="section-header fade-in" style="animation-delay: 0.35s;">
          <view>书友示例</view>
        </view>

        <view class="example-card fade-in" style="animation-delay: 0.35s;">
          <view class="example-header">
            <image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              class="example-avatar" mode="aspectFill"></image>
            <view class="example-name">小雨</view>
            <view class="example-badge">优秀觉察</view>
          </view>
          <view class="example-content">
            今天老公回来又抱怨工作压力大，以前我会很焦虑，想着怎么帮他解决。但今天我问自己：这是谁的课题？他的工作是他的课题，我能做的是倾听和陪伴，而不是替他焦虑。这个觉察让我轻松了很多...
          </view>
          <view class="example-tags">
            <view class="badge badge-gold">课题分离</view>
            <view class="badge badge-blue">家庭</view>
          </view>
        </view>

        <view class="action-btn-full fade-in" style="animation-delay: 0.4s;" @click="startWriting">
          <view class="fas fa-feather"></view> 开始写觉察日记
        </view>

        <view style="height: 40rpx;"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'


const router = useRouter()

const goBack = () => {
  router.back()
}

const startWriting = () => {
  router.push('/write-journal')
}
</script>

<style scoped>
.task-header {
  position: relative;
  margin: -32rpx -32rpx 40rpx -32rpx;
  padding: 48rpx 40rpx;
  background: linear-gradient(135deg, rgba(93, 173, 226, 0.15) 0%, transparent 100%);
}

.task-date {
  font-size: 26rpx;
  color: var(--text-muted);
  margin-bottom: 16rpx;
}

.task-title {
  font-size: 44rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 16rpx;
}

.task-source {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 24rpx;
  background: rgba(93, 173, 226, 0.2);
  border-radius: 40rpx;
  font-size: 24rpx;
  color: var(--accent-blue);
}

.streak-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.1) 0%, rgba(88, 214, 141, 0.05) 100%);
  border-radius: var(--radius-md);
  margin-bottom: 40rpx;
  border: 2rpx solid rgba(88, 214, 141, 0.2);
}

.streak-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.streak-icon {
  width: 88rpx;
  height: 88rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: var(--accent-green);
}

.streak-text view {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.streak-text view {
  font-size: 24rpx;
  color: var(--text-muted);
}

.streak-days {
  font-size: 56rpx;
  color: var(--accent-green);
  font-weight: 700;
}

.task-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  margin-bottom: 32rpx;
  border-left: 8rpx solid var(--accent-gold);
}

.task-card-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.task-card-icon {
  width: 72rpx;
  height: 72rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 32rpx;
}

.task-card-label {
  font-size: 28rpx;
  color: var(--accent-gold);
  font-weight: 600;
}

.task-card-content {
  font-size: 30rpx;
  color: var(--text-primary);
  line-height: 1.8;
  margin-bottom: 32rpx;
}

.task-card-content strong {
  color: var(--accent-gold);
}

.task-card-tips {
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
}

.task-card-tips-title {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-bottom: 16rpx;
}

.task-card-tips-list {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.8;
}

.context-card {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.08) 0%, rgba(243, 156, 18, 0.04) 100%);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.context-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.context-cover {
  width: 96rpx;
  height: 128rpx;
  border-radius: 12rpx;
  object-fit: cover;
}

.context-info view {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 8rpx;
}

.context-info view {
  font-size: 24rpx;
  color: var(--text-muted);
}

.context-quote {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.7;
  padding-left: 24rpx;
  border-left: 6rpx solid var(--accent-gold);
  font-style: italic;
}

.reflection-prompts {
  margin-bottom: 40rpx;
}

.reflection-prompt-item {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 28rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 20rpx;
}

.reflection-prompt-num {
  width: 56rpx;
  height: 56rpx;
  background: rgba(244, 208, 63, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: var(--accent-gold);
  font-weight: 600;
  flex-shrink: 0;
}

.reflection-prompt-text {
  font-size: 28rpx;
  color: var(--text-primary);
  line-height: 1.6;
}

.example-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.example-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.example-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  object-fit: cover;
}

.example-name {
  font-size: 26rpx;
  color: var(--text-primary);
}

.example-badge {
  margin-left: auto;
  padding: 8rpx 16rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 20rpx;
  font-size: 20rpx;
  color: var(--accent-green);
}

.example-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 24rpx;
}

.example-tags {
  display: flex;
  gap: 12rpx;
}

.action-btn-full {
  width: 100%;
  padding: 32rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 24rpx;
  border: none;
  font-size: 32rpx;
  color: #1a1a2e;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  cursor: pointer;
}
</style>
