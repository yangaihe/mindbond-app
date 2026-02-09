<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <view class="page-header fade-in">
          <view class="back-btn" @click="goBack">
            <view class="fas fa-arrow-left"></view>
          </view>
          <view class="page-title">我的觉察</view>
        </view>

        <view class="stats-card fade-in" style="animation-delay: 0.1s">
          <view class="stats-header">
            <view class="stats-icon">
              <view class="fas fa-feather"></view>
            </view>
            <view>
              <view class="stats-title">被讨厌的勇气 · 觉察记录</view>
              <view class="stats-subtitle">1月期共读营 · 第3周</view>
            </view>
          </view>
          <view class="stats-grid">
            <view class="stat-item">
              <view class="stat-value">15<text class="sv-text">篇</text>
              </view>
              <view class="stat-label">总记录</view>
            </view>
            <view class="stat-item">
              <view class="stat-value">4<text class="sv-text">篇</text>
              </view>
              <view class="stat-label">本周</view>
            </view>
            <view class="stat-item">
              <view class="stat-value">12<text class="sv-text">天</text>
              </view>
              <view class="stat-label">连续觉察</view>
            </view>
          </view>
        </view>

        <view class="filter-tabs fade-in" style="animation-delay: 0.15s">
          <view v-for="filter in filters" :key="filter.id" class="filter-tab"
            :class="{ active: activeFilter === filter.id }" @click="activeFilter = filter.id">
            {{ filter.label }}
          </view>
        </view>

        <view class="week-divider fade-in" style="animation-delay: 0.2s">
          <view class="week-divider-line"></view>
          <view class="week-divider-text">第三周 · 课题分离</view>
          <view class="week-divider-line"></view>
        </view>

        <view v-for="(entry, index) in week3Entries" :key="entry.id" class="journal-entry fade-in"
          :style="{ animationDelay: `${0.22 + index * 0.02}s` }">
          <view class="journal-header">
            <view class="journal-date-badge">
              <view class="journal-date-day">{{ entry.day }}</view>
              <view class="journal-date-month">{{ entry.month }}</view>
            </view>
            <view class="journal-meta">
              <view class="journal-chapter">
                <view class="fas fa-headphones"></view> {{ entry.chapter }}
              </view>
              <view class="journal-task-title">{{ entry.taskTitle }}</view>
            </view>
          </view>
          <view class="journal-content">{{ entry.content }}</view>
          <view class="journal-footer">
            <view class="journal-tags">
              <view class="journal-tag">{{ entry.tag }}</view>
              <view class="journal-tag emotion">{{ entry.emotion }}</view>
            </view>
            <view class="fas fa-chevron-right journal-arrow"></view>
          </view>
        </view>

        <view class="week-divider fade-in" style="animation-delay: 0.3s">
          <view class="week-divider-line"></view>
          <view class="week-divider-text">第二周 · 人际关系</view>
          <view class="week-divider-line"></view>
        </view>

        <view v-for="(entry, index) in week2Entries" :key="entry.id" class="journal-entry fade-in"
          :style="{ animationDelay: `${0.32 + index * 0.02}s` }">
          <view class="journal-header">
            <view class="journal-date-badge">
              <view class="journal-date-day">{{ entry.day }}</view>
              <view class="journal-date-month">{{ entry.month }}</view>
            </view>
            <view class="journal-meta">
              <view class="journal-chapter">
                <view class="fas fa-headphones"></view> {{ entry.chapter }}
              </view>
              <view class="journal-task-title">{{ entry.taskTitle }}</view>
            </view>
          </view>
          <view class="journal-content">{{ entry.content }}</view>
          <view class="journal-footer">
            <view class="journal-tags">
              <view class="journal-tag">{{ entry.tag }}</view>
              <view class="journal-tag emotion">{{ entry.emotion }}</view>
            </view>
            <view class="fas fa-chevron-right journal-arrow"></view>
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

const activeFilter = ref('all')

const filters = [
  { id: 'all', label: '全部' },
  { id: 'week3', label: '第三周' },
  { id: 'week2', label: '第二周' },
  { id: 'week1', label: '第一周' }
]

interface JournalEntry {
  id: number
  day: string
  month: string
  chapter: string
  taskTitle: string
  content: string
  tag: string
  emotion: string
}

const week3Entries: JournalEntry[] = [
  {
    id: 1,
    day: '16',
    month: '1月',
    chapter: '第12讲 · 课题分离的勇气',
    taskTitle: '这是谁的课题？',
    content: '今天和妈妈打电话，她又开始催婚了。以前我会很烦躁，但今天我试着用课题分离来思考：妈妈的焦虑是她的课题，我是否结婚是我的课题。这样想之后，我能更平静地听她说话了...',
    tag: '课题分离',
    emotion: '平静'
  },
  {
    id: 2,
    day: '15',
    month: '1月',
    chapter: '第11讲 · 不干涉他人的课题',
    taskTitle: '我在干涉谁的课题？',
    content: '下班回家看到孩子没做作业在看电视，我本想发火，但想起今天的觉察任务。孩子的学习是他的课题，我能做的是提醒，而不是替他焦虑。深呼吸后，我平静地问他计划什么时候开始写...',
    tag: '亲子关系',
    emotion: '觉察'
  },
  {
    id: 3,
    day: '14',
    month: '1月',
    chapter: '第10讲 · 割舍别人的课题',
    taskTitle: '我背负了谁的课题？',
    content: '同事又把她的工作推给我，说她太忙了。以前我总是默默接下，今天我意识到这是在背负别人的课题。我礼貌但坚定地说我手上也有工作，建议她和领导沟通...',
    tag: '职场边界',
    emotion: '勇气'
  },
  {
    id: 4,
    day: '13',
    month: '1月',
    chapter: '第10讲 · 割舍别人的课题',
    taskTitle: '我背负了谁的课题？',
    content: '老公心情不好，我本能地想去哄他、问他怎么了。但转念一想，他的情绪是他的课题，我不需要为他的情绪负责。我安静地陪在旁边，给他空间...',
    tag: '亲密关系',
    emotion: '释然'
  }
]

const week2Entries: JournalEntry[] = [
  {
    id: 5,
    day: '9',
    month: '1月',
    chapter: '第5讲 · 追求优越性的方向',
    taskTitle: '我的优越感来自哪里？',
    content: '开会时领导表扬了我的方案，我发现自己内心有一种暗暗的得意。仔细觉察这种感觉，发现我的优越感来自"比别人强"。这是健康的优越性吗？我需要继续思考...',
    tag: '自我认知',
    emotion: '反思'
  },
  {
    id: 6,
    day: '8',
    month: '1月',
    chapter: '第4讲 · 自卑感与优越感',
    taskTitle: '我的自卑感是什么？',
    content: '和朋友聚会，看到大家事业有成，我感到自己很平庸。这种自卑感让我不太想说话。回来后觉察：我把自己的价值和"成就"绑定了，但我的价值不应该由外在定义...',
    tag: '自卑感',
    emotion: '领悟'
  }
]

const handleTabChange = (tab: string) => {
  const routes: Record<string, string> = {
    home: '/',
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
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.back-btn {
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  border: none;
  color: var(--text-primary);
  font-size: 28rpx;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 700;
}

.stats-card {
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.12) 0%, rgba(46, 204, 113, 0.06) 100%);
  border: 2rpx solid rgba(88, 214, 141, 0.2);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 40rpx;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.stats-icon {
  width: 72rpx;
  height: 72rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-green);
  font-size: 32rpx;
}

.stats-title {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.stats-subtitle {
  font-size: 24rpx;
  color: var(--text-muted);
}

.stats-grid {
  display: flex;
  gap: 24rpx;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 16rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
}

.stat-value {
  font-size: 48rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 4rpx;
}

.stat-value .sv-text {
  font-size: 28rpx;
  font-weight: 400;
  color: var(--text-muted);
}

.stat-label {
  font-size: 22rpx;
  color: var(--text-muted);
}

.filter-tabs {
  display: flex;
  gap: 16rpx;
  margin-bottom: 32rpx;
  overflow-x: auto;
  padding-bottom: 8rpx;
}

.filter-tab {
  padding: 16rpx 28rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 32rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab.active {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  color: #1a1a2e;
  font-weight: 600;
}

.journal-entry {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 32rpx;
  margin-bottom: 24rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.journal-entry:hover {
  background: rgba(255, 255, 255, 0.08);
}

.journal-header {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  margin-bottom: 20rpx;
}

.journal-date-badge {
  width: 88rpx;
  height: 88rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.journal-date-day {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1;
}

.journal-date-month {
  font-size: 20rpx;
  color: var(--text-muted);
}

.journal-meta {
  flex: 1;
}

.journal-chapter {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 6rpx 16rpx;
  background: rgba(93, 173, 226, 0.15);
  border-radius: 12rpx;
  font-size: 22rpx;
  color: var(--accent-blue);
  margin-bottom: 12rpx;
}

.journal-task-title {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.journal-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.journal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.journal-tags {
  display: flex;
  gap: 12rpx;
}

.journal-tag {
  padding: 8rpx 16rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12rpx;
  font-size: 22rpx;
  color: var(--text-muted);
}

.journal-tag.emotion {
  background: rgba(248, 165, 194, 0.15);
  color: #f8a5c2;
}

.journal-arrow {
  color: var(--text-muted);
  font-size: 24rpx;
}

.week-divider {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin: 40rpx 0 32rpx;
}

.week-divider-line {
  flex: 1;
  height: 2rpx;
  background: rgba(255, 255, 255, 0.1);
}

.week-divider-text {
  font-size: 24rpx;
  color: var(--text-muted);
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  width: 128rpx;
  height: 128rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32rpx;
  font-size: 48rpx;
  color: var(--text-muted);
}

.empty-title {
  font-size: 32rpx;
  color: var(--text-primary);
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: var(--text-muted);
}
</style>
