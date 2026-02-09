<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Room Type Tabs -->
        <view class="room-tabs fade-in">
          <view v-for="tab in roomTabs" :key="tab.id" class="room-tab" :class="{ active: activeRoomTab === tab.id }"
            @click="handleRoomTabClick(tab.id)">
            <text :class="tab.icon"></text>
            <view>{{ tab.label }}</view>
          </view>
        </view>

        <!-- Header -->
        <view class="header-section fade-in">
          <view>
            <view class="header-title">听书房</view>
            <view class="header-subtitle">边听边觉察，让好书住进心里</view>
          </view>
          <view class="search-btn" @click="openSearch">
            <text class="fas fa-search"></text>
          </view>
        </view>

        <!-- Stats -->
        <view class="stats-grid fade-in" style="animation-delay: 0.1s">
          <view class="stat-item">
            <view class="stat-value">12</view>
            <view class="stat-label">已听完</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">36h</view>
            <view class="stat-label">觉察时长</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">28</view>
            <view class="stat-label">听后笔记</view>
          </view>
        </view>

        <!-- Featured Book -->
        <view class="featured-book fade-in" style="animation-delay: 0.15s">
          <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop"
            class="featured-book-cover" mode="aspectFill"></image>
          <view class="featured-book-info">
            <view>
              <view class="featured-badge">
                <text class="fas fa-fire"></text> 本月最热
              </view>
              <view class="featured-book-title">被讨厌的勇气</view>
              <view class="featured-book-author">岸见一郎 / 古贺史健</view>
            </view>
            <view class="featured-book-actions">
              <view class="btn-primary-sm" @click="goToBookDetail(1)">
                <text class="fas fa-play"></text> 继续听
              </view>
              <view class="progress-text">已听 65%</view>
            </view>
          </view>
        </view>

        <!-- Category Tabs -->
        <view class="category-tabs fade-in" style="animation-delay: 0.2s">
          <view v-for="cat in categories" :key="cat.id" class="category-tab"
            :class="{ active: activeCategory === cat.id }" @click="activeCategory = cat.id">
            {{ cat.label }}
          </view>
        </view>

        <!-- Section: Recently Played -->
        <view class="section-header fade-in" style="animation-delay: 0.25s">
          <view>最近在听</view>
          <view @click="viewMore('recent')">更多</view>
        </view>

        <view class="book-grid fade-in" style="animation-delay: 0.25s; margin-bottom: 48rpx">
          <view v-for="book in recentlyPlayed" :key="book.id" class="book-item" @click="goToBookDetail(book.id)">
            <image :src="book.cover" class="book-cover" mode="aspectFill"></image>
            <view class="book-title">{{ book.title }}</view>
            <view class="book-meta">{{ book.meta }}</view>
          </view>
        </view>

        <!-- Section: Recommended -->
        <view class="section-header fade-in" style="animation-delay: 0.3s">
          <view>为你推荐</view>
          <view @click="viewMore('recommended')">更多</view>
        </view>

        <view class="book-grid fade-in" style="animation-delay: 0.3s; margin-bottom: 48rpx">
          <view v-for="book in recommended" :key="book.id" class="book-item" @click="goToBookDetail(book.id)">
            <image :src="book.cover" class="book-cover" mode="aspectFill"></image>
            <view class="book-title">{{ book.title }}</view>
            <view class="book-meta">{{ book.meta }}</view>
          </view>
        </view>

        <!-- Section: Psychology Growth -->
        <view class="section-header fade-in" style="animation-delay: 0.35s">
          <view>心理成长</view>
          <view @click="viewMore('psychology')">更多</view>
        </view>

        <view class="book-grid fade-in" style="animation-delay: 0.35s; margin-bottom: 48rpx">
          <view v-for="book in psychologyGrowth" :key="book.id" class="book-item" @click="goToBookDetail(book.id)">
            <image :src="book.cover" class="book-cover" mode="aspectFill"></image>
            <view class="book-title">{{ book.title }}</view>
            <view class="book-meta">{{ book.meta }}</view>
          </view>
        </view>

        <!-- Section: Emotion Management -->
        <view class="section-header fade-in" style="animation-delay: 0.4s">
          <view>情绪管理</view>
          <view @click="viewMore('emotion')">更多</view>
        </view>

        <view class="book-grid fade-in" style="animation-delay: 0.4s; ">
          <view v-for="book in emotionManagement" :key="book.id" class="book-item" @click="goToBookDetail(book.id)">
            <image :src="book.cover" class="book-cover" mode="aspectFill"></image>
            <view class="book-title">{{ book.title }}</view>
            <view class="book-meta">{{ book.meta }}</view>
          </view>
        </view>

        
      </view>
    </template>
    <template #footer>
      <view class="audio-player">
        <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop"
          class="audio-player-cover" mode="aspectFill"></image>
        <view class="audio-player-info">
          <view class="audio-player-title">第12讲：课题分离的勇气</view>
          <view class="audio-player-author">被讨厌的勇气</view>
        </view>
        <view class="audio-player-controls">
          <view class="audio-player-btn" @click="togglePlay">
            <text :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></text>
          </view>
        </view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
// @ts-ignore - uni API is available in uniapp environment
import { ref } from 'vue'

const activeRoomTab = ref('audiobooks')
const activeCategory = ref('all')
const isPlaying = ref(true)

const roomTabs = [
  { id: 'audiobooks', icon: 'fas fa-headphones', label: '听书房' },
  { id: 'bootcamp', icon: 'fas fa-calendar-alt', label: '共读营' }
]

const categories = [
  { id: 'all', label: '全部' },
  { id: 'psychology', label: '心理成长' },
  { id: 'relationship', label: '亲密关系' },
  { id: 'emotion', label: '情绪管理' },
  { id: 'self', label: '自我认知' },
  { id: 'career', label: '职场发展' }
]

const recentlyPlayed = [
  {
    id: 1,
    title: '被讨厌的勇气',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop',
    meta: '65% · 2h15m'
  },
  {
    id: 2,
    title: '非暴力沟通',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop',
    meta: '30% · 1h20m'
  },
  {
    id: 3,
    title: '心流',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=280&fit=crop',
    meta: '15% · 45m'
  }
]

const recommended = [
  {
    id: 1,
    title: '亲密关系',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=280&fit=crop',
    meta: '28讲 · 6h'
  },
  {
    id: 2,
    title: '活出生命的意义',
    cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=200&h=280&fit=crop',
    meta: '22讲 · 5h'
  },
  {
    id: 3,
    title: '自卑与超越',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=280&fit=crop',
    meta: '25讲 · 5.5h'
  }
]

const psychologyGrowth = [
  {
    id: 1,
    title: '少有人走的路',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=280&fit=crop',
    meta: '30讲 · 7h'
  },
  {
    id: 2,
    title: '原则',
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=280&fit=crop',
    meta: '35讲 · 8h'
  },
  {
    id: 3,
    title: '刻意练习',
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=280&fit=crop',
    meta: '24讲 · 5h'
  }
]

const emotionManagement = [
  {
    id: 1,
    title: '情绪急救',
    cover: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=200&h=280&fit=crop',
    meta: '20讲 · 4.5h'
  },
  {
    id: 2,
    title: '幸福的方法',
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&h=280&fit=crop',
    meta: '26讲 · 6h'
  },
  {
    id: 3,
    title: '当下的力量',
    cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=280&fit=crop',
    meta: '18讲 · 4h'
  }
]

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

const handleRoomTabClick = (tabId: string) => {
  if (tabId === 'bootcamp') {
    // @ts-ignore
    uni.navigateTo({
      url: '/bookroom-hub'
    })
  } else {
    activeRoomTab.value = tabId
  }
}

const goToBookDetail = (bookId: number) => {
  // @ts-ignore
  uni.navigateTo({
    url: `/book-detail?id=${bookId}`
  })
}

const viewMore = (category: string) => {
  console.log('View more:', category)
}

const openSearch = () => {
  // @ts-ignore
  uni.showToast({
    title: '搜索功能即将上线，敬请期待',
    icon: 'none',
    duration: 2000
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
  margin-right: 12rpx;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.header-title {
  color: #ffffff;
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.header-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
}

.search-btn {
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 16rpx;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.stat-item {
  text-align: center;
  padding: 32rpx 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
}

.stat-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* Featured Book */
.featured-book {
  display: flex;
  gap: 32rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.1) 0%, rgba(243, 156, 18, 0.05) 100%);
  border-radius: 32rpx;
  margin-bottom: 40rpx;
}

.featured-book-cover {
  width: 160rpx;
  height: 214rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}

.featured-book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.featured-badge {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  background: rgba(244, 208, 63, 0.2);
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #f4d03f;
  margin-bottom: 16rpx;
  width: fit-content;
}

.featured-badge text {
  margin-right: 8rpx;
}

.featured-book-title {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.featured-book-author {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
}

.featured-book-actions {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.btn-primary-sm {
  padding: 16rpx 28rpx;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  border: none;
  border-radius: 32rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.btn-primary-sm text {
  margin-right: 12rpx;
}

.progress-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  padding-bottom: 16rpx;
  margin-bottom: 32rpx;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 40rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab:hover {
  background: rgba(255, 255, 255, 0.12);
}

.category-tab.active {
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  color: #1a1a2e;
  font-weight: 600;
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

.section-header>view:nth-child(2) {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* Book Grid */
.book-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32rpx;
}

.book-item {
  text-align: center;
  cursor: pointer;
}

.book-cover {
  width: 100%;
  height: initial;
  aspect-ratio: 3/4;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
}

.book-title {
  font-size: 24rpx;
  color: #ffffff;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-meta {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8rpx;
}

/* Audio Player */
.audio-player {
  margin: 0 20rpx;
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(40rpx);
  border-radius: 32rpx;
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
}

.audio-player-cover {
  width: 96rpx;
  height: 96rpx;
  border-radius: 16rpx;
}

.audio-player-info {
  flex: 1;
  min-width: 0;
}

.audio-player-title {
  font-size: 28rpx;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
}

.audio-player-author {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.audio-player-controls {
  display: flex;
  align-items: center;
}

.audio-player-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 32rpx;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.audio-player-btn:hover {
  transform: scale(1.05);
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
