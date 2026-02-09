<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Header -->
        <view class="flex justify-between items-center mb-lg fade-in">
          <view>
            <view style="color: var(--text-primary); font-size: 36rpx; font-weight: 700;">发现</view>
            <view class="text-sm text-muted">在他人的觉察里，看见自己</view>
          </view>
          <view class="btn btn-secondary btn-sm" style="padding: 16rpx 24rpx;">
            <text class="fas fa-search"></text>
          </view>
        </view>

        <!-- Tabs -->
        <view class="plaza-tabs fade-in" style="animation-delay: 0.1s;">
          <view v-for="tab in tabs" :key="tab.id" class="plaza-tab" :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id">
            {{ tab.label }}
          </view>
        </view>

        <!-- Filter Tags -->
        <view class="filter-tags fade-in" style="animation-delay: 0.15s;">
          <view v-for="filter in filters" :key="filter.id" class="filter-tag"
            :class="{ active: activeFilter === filter.id }" @click="activeFilter = filter.id">
            {{ filter.label }}
          </view>
        </view>

        <!-- Featured Journal -->
        <view v-if="activeTab === 'recommend'" class="journal-card featured-card fade-in"
          style="animation-delay: 0.2s;">
          <view class="featured-badge">
            <text class="fas fa-fire"></text> 今日精选
          </view>
          <view class="journal-card-header">
            <image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
              class="journal-avatar" mode="aspectFill"></image>
            <view class="journal-user-info">
              <view class="journal-user-name">小雨 <text style="font-size: 24rpx; color: var(--accent-gold);">·
                  觉醒者3班</text></view>
              <view class="journal-meta">今天 21:30 · 觉察日记</view>
            </view>
            <text class="journal-emotion">😌</text>
          </view>

          <view class="journal-content">
            今天读到"课题分离"这个概念，突然有种被点醒的感觉。我一直以来都在为别人的情绪负责，总觉得如果对方不开心，一定是我做错了什么。
            <text style="display: block; margin: 8rpx 0;"></text>
            但其实，别人的情绪是别人的课题，我能做的只是做好自己。当我开始这样想的时候，突然感觉肩上的担子轻了很多。
            <text style="display: block; margin: 8rpx 0;"></text>
            这周我要练习的就是：每当我想为别人的情绪负责时，先问自己"这是谁的课题？"
          </view>

          <view class="journal-tags">
            <text class="badge badge-gold">课题分离</text>
            <text class="badge badge-blue">读书觉察</text>
            <text class="badge badge-green">成长</text>
          </view>

          <view class="journal-book">
            <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=100&fit=crop"
              class="journal-book-cover" mode="aspectFill"></image>
            <view class="journal-book-info">
              <view class="journal-book-title">被讨厌的勇气</view>
              <view class="journal-book-chapter">第12讲 · 课题分离的勇气</view>
            </view>
          </view>

          <view class="journal-actions">
            <view class="journal-action liked" @click="toggleLike(-1)">
              <text class="fas fa-heart"></text>
              <text>128</text>
            </view>
            <view class="journal-action" @click="viewComments(-1)">
              <text class="far fa-comment"></text>
              <text>23</text>
            </view>
            <view class="journal-action" @click="toggleBookmark(-1)">
              <text class="far fa-bookmark"></text>
              <text>收藏</text>
            </view>
            <view class="journal-action" style="margin-left: auto;" @click="shareJournal(-1)">
              <text class="fas fa-share"></text>
            </view>
          </view>

          <!-- Comments Preview -->
          <view class="journal-comments">
            <view class="comment-item">
              <image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                class="comment-avatar" mode="aspectFill"></image>
              <view class="comment-content">
                <view class="comment-name">明哥</view>
                <view class="comment-text">太有共鸣了！我也总是为孩子的情绪负责，看完你的分享，我也要学着放下</view>
                <view class="comment-time">10分钟前</view>
              </view>
            </view>
            <view class="comment-item">
              <image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                class="comment-avatar" mode="aspectFill"></image>
              <view class="comment-content">
                <view class="comment-name" style="color: var(--accent-gold);">创始人</view>
                <view class="comment-text">很棒的觉察！课题分离是一个需要持续练习的过程，加油！✨</view>
                <view class="comment-time">30分钟前</view>
              </view>
            </view>
            <view class="view-more-comments" @click="viewComments(-1)">查看全部 23 条评论 ></view>
          </view>
        </view>

        <!-- Journal Cards -->
        <view v-for="(journal, index) in filteredJournals" :key="journal.id" class="journal-card fade-in"
          :style="{ animationDelay: `${0.25 + index * 0.05}s` }">
          <view class="journal-card-header">
            <image :src="journal.avatar" class="journal-avatar" mode="aspectFill"></image>
            <view class="journal-user-info">
              <view class="journal-user-name">
                {{ journal.name }}
                <text v-if="journal.class" style="font-size: 24rpx; color: var(--accent-blue);">· {{ journal.class
                  }}</text>
              </view>
              <view class="journal-meta">{{ journal.meta }}</view>
            </view>
            <text class="journal-emotion">{{ journal.emotion }}</text>
          </view>

          <view class="journal-content collapsed">{{ journal.content }}</view>
          <text class="journal-expand" @click="expandJournal(journal.id)">展开全文</text>

          <view class="journal-tags">
            <text v-for="tag in journal.tags" :key="tag.text" class="badge" :class="tag.class">
              {{ tag.text }}
            </text>
          </view>

          <view class="journal-actions">
            <view class="journal-action" :class="{ liked: journal.liked }" @click="toggleLike(journal.id)">
              <text :class="journal.liked ? 'fas fa-heart' : 'far fa-heart'"></text>
              <text>{{ journal.likes }}</text>
            </view>
            <view class="journal-action" @click="viewComments(journal.id)">
              <text class="far fa-comment"></text>
              <text>{{ journal.comments }}</text>
            </view>
            <view class="journal-action" @click="toggleBookmark(journal.id)">
              <text class="far fa-bookmark"></text>
              <text>收藏</text>
            </view>
            <view class="journal-action" style="margin-left: auto;" @click="shareJournal(journal.id)">
              <text class="fas fa-share"></text>
            </view>
          </view>
        </view>

        <!-- Empty State for Following -->
        <view v-if="activeTab === 'following' && followingJournals.length === 0" class="empty-state fade-in">
          <view class="empty-icon">
            <text class="fas fa-user-plus"></text>
          </view>
          <view class="empty-title">遇见更多同行者</view>
          <view class="empty-desc">关注那些触动你的觉察，一起成长</view>
          <view class="empty-btn" @click="activeTab = 'recommend'">去发现页看看</view>
        </view>

        <!-- Empty State for My Class -->
        <view v-if="activeTab === 'myClass' && classJournals.length === 0" class="empty-state fade-in">
          <view class="empty-icon">
            <text class="fas fa-users"></text>
          </view>
          <view class="empty-title">班级在等你开启</view>
          <view class="empty-desc">写下第一篇觉察，让伙伴们看见你</view>
          <view class="empty-btn" @click="goToWriteJournal">记录我的觉察</view>
        </view>

        <!-- Float Write Button -->
        <view class="write-float-btn" @click="goToWriteJournal">
          <text class="fas fa-pen"></text>
        </view>

        <view style="height: 160rpx;"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const activeTab = ref('recommend')
const activeFilter = ref('all')

const tabs = [
  { id: 'recommend', label: '推荐' },
  { id: 'following', label: '关注' },
  { id: 'myClass', label: '我的班级' }
]

const filters = [
  { id: 'all', label: '全部' },
  { id: 'awareness', label: '觉察日记' },
  { id: 'gratitude', label: '感恩日记' },
  { id: 'review', label: '复盘日记' },
  { id: 'separation', label: '课题分离' },
  { id: 'emotion', label: '情绪管理' }
]

const journals = [
  {
    id: 1,
    name: '明哥',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    meta: '今天 20:15 · 感恩日记',
    emotion: '🙏',
    content: '今天感恩的三件事：\n\n1. 感恩书房的伙伴们，每天的陪伴让我不再孤单，原来坚持也可以不那么难\n\n2. 感恩自己坚持了第14天的阅读，以前从来没有这么持续过\n\n3. 感恩老婆今天没有催我放下手机，她开始理解我在做一件有意义的事',
    tags: [
      { text: '感恩', class: 'badge-pink' },
      { text: '家庭', class: 'badge-blue' },
      { text: '坚持', class: 'badge-green' }
    ],
    likes: 56,
    comments: 8,
    liked: false
  },
  {
    id: 2,
    name: '晓晓',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    meta: '昨天 22:10 · 觉察日记',
    emotion: '😰',
    content: '下午开会被领导批评了，当时真的很委屈，感觉自己明明很努力了，为什么还是不被认可。\n\n晚上冷静下来想想，我发现自己的第一反应是"防御"——想解释、想辩驳。但如果用今天学的"目的论"来看，我防御的目的是什么？是为了保护自己的自尊心。\n\n其实领导说的也有道理，我确实在细节上可以做得更好。觉察到这一点后，我没那么委屈了。',
    tags: [
      { text: '情绪觉察', class: 'badge-gold' },
      { text: '工作', class: 'badge-blue' }
    ],
    likes: 89,
    comments: 15,
    liked: true
  },
  {
    id: 3,
    name: '阿杰',
    class: '觉醒者1班',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
    meta: '昨天 21:45 · 复盘日记',
    emotion: '📝',
    content: '【本周复盘】\n\n完成了7天的共读，写了5篇觉察日记。最大的收获是开始学会"暂停"——在情绪上来的时候，先深呼吸三次，再回应。\n\n这周有两次差点和老婆吵起来，但我都用了"暂停"，结果发现很多时候情绪只是一阵风，过去了就没事了。',
    tags: [
      { text: '周复盘', class: 'badge-blue' },
      { text: '暂停', class: 'badge-green' },
      { text: '家庭', class: 'badge-pink' }
    ],
    likes: 42,
    comments: 6,
    liked: false
  }
]

// 关注的人的日记（暂时为空）
const followingJournals = ref<typeof journals>([])

// 班级日记（暂时为空）
const classJournals = ref<typeof journals>([])

// 根据 tab 过滤日记
const filteredJournals = computed(() => {
  if (activeTab.value === 'recommend') {
    return journals
  } else if (activeTab.value === 'following') {
    return followingJournals.value
  } else if (activeTab.value === 'myClass') {
    return classJournals.value
  }
  return journals
})

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

const goToWriteJournal = () => {
  router.push('/write-journal')
}

const toggleLike = (journalId: number) => {
  if (journalId === -1) {
    // Featured journal
    console.log('Toggle like for featured')
    return
  }
  const journal = journals.find(j => j.id === journalId)
  if (journal) {
    journal.liked = !journal.liked
    journal.likes += journal.liked ? 1 : -1
  }
}

const viewComments = (journalId: number) => {
  router.push(`/journal-detail?id=${journalId}`)
}

const toggleBookmark = (journalId: number) => {
  console.log('Bookmark journal:', journalId)
}

const shareJournal = (journalId: number) => {
  console.log('Share journal:', journalId)
}

const expandJournal = (journalId: number) => {
  router.push(`/journal-detail?id=${journalId}`)
}
</script>

<style scoped>
.plaza-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 24rpx;
  padding: 8rpx;
  margin-bottom: 40rpx;
}

.plaza-tab {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: var(--text-muted);
  border-radius: 20rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.plaza-tab.active {
  background: var(--bg-card);
  color: var(--text-primary);
  font-weight: 600;
}

.filter-tags {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  padding-bottom: 16rpx;
  margin-bottom: 32rpx;
}

.filter-tag {
  padding: 12rpx 28rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 32rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tag.active {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  color: #1a1a2e;
  font-weight: 600;
}

.journal-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40rpx;
  margin-bottom: 32rpx;
}

.journal-card-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 28rpx;
}

.journal-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
}

.journal-user-info {
  flex: 1;
}

.journal-user-name {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4rpx;
}

.journal-meta {
  font-size: 24rpx;
  color: var(--text-muted);
}

.journal-emotion {
  font-size: 48rpx;
}

.journal-content {
  font-size: 30rpx;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 28rpx;
  white-space: pre-line;
}

.journal-content.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.journal-expand {
  color: var(--accent-gold);
  font-size: 26rpx;
  cursor: pointer;
}

.journal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 28rpx;
}

.journal-book {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  margin-bottom: 28rpx;
}

.journal-book-cover {
  width: 64rpx;
  height: 84rpx;
  border-radius: 8rpx;
}

.journal-book-info {
  flex: 1;
}

.journal-book-title {
  font-size: 26rpx;
  color: var(--text-primary);
}

.journal-book-chapter {
  font-size: 22rpx;
  color: var(--text-muted);
}

.journal-actions {
  display: flex;
  align-items: center;
  gap: 48rpx;
  padding-top: 28rpx;
  border-top: 2rpx solid rgba(255, 255, 255, 0.08);
}

.journal-action {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 26rpx;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.journal-action:hover {
  color: var(--text-secondary);
}

.journal-action.liked {
  color: #e74c3c;
}

.journal-action.liked text {
  color: #e74c3c;
}

.journal-action text {
  font-size: 32rpx;
}

.journal-comments {
  margin-top: 28rpx;
  padding-top: 28rpx;
  border-top: 2rpx solid rgba(255, 255, 255, 0.08);
}

.comment-item {
  display: flex;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.comment-item:last-child {
  margin-bottom: 0;
}

.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
}

.comment-name {
  font-size: 24rpx;
  color: var(--accent-gold);
  margin-bottom: 8rpx;
}

.comment-text {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.5;
}

.comment-time {
  font-size: 22rpx;
  color: var(--text-muted);
  margin-top: 8rpx;
}

.view-more-comments {
  font-size: 26rpx;
  color: var(--text-muted);
  cursor: pointer;
  margin-top: 16rpx;
}

.featured-card {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.1) 0%, rgba(243, 156, 18, 0.05) 100%);
  border: 2rpx solid rgba(244, 208, 63, 0.2);
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 24rpx;
  font-size: 22rpx;
  color: #1a1a2e;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.write-float-btn {
  position: fixed;
  bottom: 200rpx;
  right: 60rpx;
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 48rpx;
  box-shadow: 0 8rpx 40rpx rgba(244, 208, 63, 0.4);
  cursor: pointer;
  z-index: 100;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 120rpx 40rpx;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40rpx;
  font-size: 64rpx;
  color: var(--text-muted);
}

.empty-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: var(--text-muted);
  margin-bottom: 40rpx;
}

.empty-btn {
  padding: 24rpx 48rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  display: inline-block;
}
</style>