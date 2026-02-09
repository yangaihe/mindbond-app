<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Back Button -->
        <view class="flex items-center justify-between mb-md fade-in">
          <view class="flex items-center gap-sm">
            <view class="btn btn-secondary btn-sm" style="padding: 16rpx 24rpx;" @click="goBack">
              <text class="fas fa-arrow-left"></text>
            </view>
            <text class="text-muted text-sm">日记详情</text>
          </view>
          <view class="btn btn-secondary btn-sm" style="padding: 16rpx 24rpx;" @click="showMenu = !showMenu">
            <text class="fas fa-ellipsis-v"></text>
          </view>
        </view>

        <!-- Journal Header -->
        <view class="journal-header fade-in" style="animation-delay: 0.1s;">
          <view>
            <view class="journal-date-text">2026年1月10日 21:15</view>
          </view>
          <text class="journal-emotion">😌</text>
        </view>

        <!-- Journal Type -->
        <view class="fade-in" style="animation-delay: 0.1s;">
          <text class="journal-type-badge">
            <text class="fas fa-feather"></text> 觉察日记
          </text>
        </view>

        <!-- Journal Content -->
        <view class="journal-content-text fade-in" style="animation-delay: 0.15s;">
          今天在书房读到"课题分离"这个概念，突然有种被点醒的感觉。我一直以来都在为别人的情绪负责，总觉得如果对方不开心，一定是我做错了什么。
          <br><br>
          但其实，别人的情绪是别人的课题，我能做的只是做好自己。当我开始这样想的时候，突然感觉肩上的担子轻了很多。
          <br><br>
          这周我要练习的就是：每当我想为别人的情绪负责时，先问自己"这是谁的课题？"
        </view>

        <!-- Tags -->
        <view class="journal-tags fade-in" style="animation-delay: 0.2s;">
          <text class="badge badge-gold">课题分离</text>
          <text class="badge badge-blue">读书觉察</text>
          <text class="badge badge-green">成长</text>
        </view>

        <!-- Related Book -->
        <view class="related-book fade-in" style="animation-delay: 0.25s;">
          <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop"
            class="related-book-cover" alt="" mode="aspectFill"></image>
          <view class="related-book-info">
            <view class="related-book-title">被讨厌的勇气</view>
            <view class="related-book-chapter">第12讲 · 课题分离的勇气</view>
          </view>
          <text class="related-book-link" @click="viewBook">查看 ></text>
        </view>

        <!-- AI Insight -->
        <view class="ai-insight-card fade-in" style="animation-delay: 0.3s;">
          <view class="ai-insight-header">
            <view class="ai-icon">
              <text class="fas fa-sparkles"></text>
            </view>
            <text class="ai-insight-title">AI 洞见</text>
          </view>
          <view class="ai-insight-content">
            你今天的觉察很深刻！"课题分离"是阿德勒心理学的核心概念之一。
          </view>
          <view class="ai-insight-highlight">
            <view>
              <view class="strong">模式发现：</view>我注意到"为别人的情绪负责"这个主题在你过去的日记中出现过 <view class="strong">3 次</view>
              （1月3日、1月6日、今天）。今天的觉察是一个重要的转折点——你开始从"自动化反应"转向"有意识的选择"。
            </view>
          </view>

          <view class="insight-history">
            <view class="insight-history-header">
              <view>相关历史洞见</view>
              <view @click.prevent="viewAllInsights">查看全部</view>
            </view>
            <view class="insight-item">
              <view class="insight-item-date">1月6日的日记</view>
              <view class="insight-item-content">"你提到担心女儿考试成绩会影响你的心情，这也是一种'为他人情绪负责'的表现..."</view>
            </view>
            <view class="insight-item">
              <view class="insight-item-date">1月3日的日记</view>
              <view class="insight-item-content">"当领导皱眉时你会紧张，这可能源于童年时期对父母情绪的过度关注..."</view>
            </view>
          </view>
        </view>

        <!-- Visibility Toggle -->
        <view class="visibility-toggle fade-in" style="animation-delay: 0.35s;">
          <view class="visibility-info">
            <view class="visibility-icon">
              <text class="fas fa-globe"></text>
            </view>
            <view class="visibility-text">
              <view>公开到广场</view>
              <view>其他用户可以看到这篇日记</view>
            </view>
          </view>
          <view class="toggle-switch" :class="{ active: isPublic }" @click="isPublic = !isPublic"></view>
        </view>

        <!-- Social Stats (shown when public) -->
        <view v-if="isPublic" class="social-stats fade-in" style="animation-delay: 0.4s;">
          <view class="social-stat liked">
            <text class="fas fa-heart"></text>
            <text>128 赞</text>
          </view>
          <view class="social-stat">
            <text class="far fa-comment"></text>
            <text>23 评论</text>
          </view>
          <view class="social-stat">
            <text class="far fa-bookmark"></text>
            <text>15 收藏</text>
          </view>
        </view>

        <!-- Action Buttons -->
        <view class="action-buttons fade-in" style="animation-delay: 0.45s;">
          <view class="action-btn primary" @click="editJournal">
            <text class="fas fa-edit"></text> 编辑
          </view>
          <view class="action-btn" @click="shareJournal">
            <text class="fas fa-share"></text> 分享
          </view>
          <view class="action-btn danger" @click="deleteJournal">
            <text class="fas fa-trash"></text> 删除
          </view>
        </view>

        <!-- Created Info -->
        <view class="fade-in" style="animation-delay: 0.5s; text-align: center; padding: 32rpx 0;">
          <view class="text-sm text-muted">
            <text class="fas fa-clock"></text> 创建于 2026年1月10日 21:15
          </view>
          <view class="text-sm text-muted" style="margin-top: 8rpx;">
            <text class="fas fa-edit"></text> 最后编辑于 2026年1月10日 21:30
          </view>
        </view>

        <!-- Bottom Spacing -->
        <view style="height: 40rpx;"></view>
      </view>
    </template>
  </page-root>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const showMenu = ref(false)
const isPublic = ref(true)

const goBack = () => {
  router.back()
}

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

const viewBook = () => {
  router.push('/book/1')
}

const viewAllInsights = () => {
  router.push('/insights')
}

const editJournal = () => {
  router.push('/write-journal?edit=1')
}

const shareJournal = () => {
  console.log('Share journal')
}

const deleteJournal = () => {
  if (confirm('确定要删除这篇日记吗？')) {
    router.push('/journal')
  }
}
</script>

<style scoped>
.journal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.journal-date-text {
  font-size: 28rpx;
  color: var(--text-muted);
}

.journal-emotion {
  font-size: 64rpx;
}

.journal-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 24rpx;
  background: rgba(244, 208, 63, 0.15);
  border-radius: 40rpx;
  font-size: 26rpx;
  color: var(--accent-gold);
  margin-bottom: 32rpx;
}

.journal-content-text {
  font-size: 32rpx;
  color: var(--text-primary);
  line-height: 2;
  margin-bottom: 40rpx;
}

.journal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 40rpx;
}

.related-book {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  margin-bottom: 40rpx;
}

.related-book-cover {
  width: 88rpx;
  height: 116rpx;
  border-radius: 12rpx;
}

.related-book-info {
  flex: 1;
}

.related-book-title {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.related-book-chapter {
  font-size: 24rpx;
  color: var(--text-muted);
}

.related-book-link {
  font-size: 24rpx;
  color: var(--accent-gold);
  cursor: pointer;
}

.ai-insight-card {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.1) 0%, rgba(243, 156, 18, 0.05) 100%);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  margin-bottom: 40rpx;
  border: 2rpx solid rgba(244, 208, 63, 0.15);
}

.ai-insight-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.ai-icon {
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

.ai-insight-title {
  font-size: 30rpx;
  color: var(--accent-gold);
  font-weight: 600;
}

.ai-insight-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 32rpx;
}

.ai-insight-highlight {
  background: rgba(244, 208, 63, 0.1);
  padding: 24rpx 28rpx;
  border-radius: 20rpx;
  border-left: 6rpx solid var(--accent-gold);
}

.ai-insight-highlight view {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.7;
}

.ai-insight-highlight .strong {
  color: var(--accent-gold);
}

.insight-history {
  margin-top: 40rpx;
}

.insight-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.insight-history-header view:first-child {
  font-size: 28rpx;
  color: var(--text-muted);
}

.insight-history-header view:last-child {
  font-size: 24rpx;
  color: var(--accent-gold);
  text-decoration: none;
}

.insight-item {
  padding: 28rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 20rpx;
}

.insight-item-date {
  font-size: 22rpx;
  color: var(--text-muted);
  margin-bottom: 12rpx;
}

.insight-item-content {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.6;
}

.visibility-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 32rpx;
}

.visibility-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.visibility-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.visibility-text view:first-child {
  font-size: 28rpx;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.visibility-text view:last-child {
  font-size: 24rpx;
  color: var(--text-muted);
}

.toggle-switch {
  width: 100rpx;
  height: 56rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 28rpx;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-switch.active {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 44rpx;
  height: 44rpx;
  background: #fff;
  border-radius: 50%;
  top: 6rpx;
  left: 6rpx;
  transition: all 0.3s;
}

.toggle-switch.active::after {
  left: 50rpx;
}

.social-stats {
  display: flex;
  align-items: center;
  gap: 48rpx;
  padding: 32rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 40rpx;
}

.social-stat {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 28rpx;
  color: var(--text-secondary);
}

.social-stat text:first-child {
  font-size: 36rpx;
}

.social-stat.liked text:first-child {
  color: #e74c3c;
}

.action-buttons {
  display: flex;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 28rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  font-size: 28rpx;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn.danger {
  color: #e74c3c;
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  color: #1a1a2e;
  font-weight: 600;
}
</style>