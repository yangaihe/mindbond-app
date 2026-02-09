<template>

  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <view class="welcome-header fade-in">
          <view class="welcome-logo">
            <view class="fas fa-brain"></view>
          </view>
          <view class="welcome-title">欢迎来到 MindBond</view>
          <view class="welcome-subtitle">在陪伴中觉察，在觉察中成长</view>
        </view>

        <view class="trial-banner fade-in" style="animation-delay: 0.1s">
          <view class="trial-icon">
            <view class="fas fa-gift"></view>
          </view>
          <view class="trial-content">
            <view class="trial-title">3本免费书等你来听</view>
            <view class="trial-desc">无需注册，立即体验</view>
          </view>
          <view class="trial-btn" @click="goToAudiobooks">去体验</view>
        </view>

        <view class="free-book-card fade-in" style="animation-delay: 0.15s">
          <view class="free-book-label">
            <view class="fas fa-star"></view> 今日推荐 · 免费
          </view>
          <view class="free-book-content">
            <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=160&h=214&fit=crop"
              class="free-book-cover" mode="aspectFill"></image>
            <view class="free-book-info">
              <view class="free-book-title">被讨厌的勇气</view>
              <view class="free-book-author">岸见一郎 / 古贺史健</view>
              <view class="free-book-desc">一本能让你学会「课题分离」，不再为他人的评价而活的书。</view>
              <view class="free-book-meta">
                <view class="free-book-meta-item">
                  <view class="fas fa-clock"></view> 38分钟
                </view>
                <view class="free-book-meta-item">
                  <view class="fas fa-headphones"></view> 8.2万次
                </view>
              </view>
            </view>
          </view>
          <view class="free-book-play" @click="goToBookDetail">
            <view class="fas fa-play"></view> 立即收听
          </view>
        </view>

        <view class="category-section fade-in" style="animation-delay: 0.2s">
          <view class="section-header" style="margin-bottom: 24rpx">
            <view>发现好书</view>
          </view>
          <view class="category-scroll">
            <view v-for="(cat, index) in categories" :key="cat.id" class="category-chip"
              :class="{ active: activeCategory === cat.id }" @click="activeCategory = cat.id">
              <view :class="cat.icon"></view> {{ cat.label }}
            </view>
          </view>
        </view>

        <view class="book-list fade-in" style="animation-delay: 0.25s">
          <view v-for="book in books" :key="book.id" class="book-item" @click="goToBookDetail">
            <image :src="book.cover" class="book-item-cover" mode="aspectFill"></image>
            <view class="book-item-info">
              <view class="book-item-title">{{ book.title }}</view>
              <view class="book-item-author">{{ book.author }}</view>
              <view class="book-item-tags">
                <view class="book-item-tag" :class="{ free: book.isFree }">
                  {{ book.isFree ? '免费' : '会员' }}
                </view>
                <view class="book-item-tag">{{ book.category }}</view>
                <view class="book-item-tag">{{ book.duration }}</view>
              </view>
            </view>
            <view class="book-item-play">
              <view class="fas fa-play"></view>
            </view>
          </view>
        </view>

        <view class="stats-bar fade-in" style="animation-delay: 0.3s">
          <view class="stat-item">
            <view class="stat-value">200<text>+</text></view>
            <view class="stat-label">精选好书</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">50<text>万</text></view>
            <view class="stat-label">用户在读</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">12<text>期</text></view>
            <view class="stat-label">年度训练营</view>
          </view>
        </view>

        <view class="bootcamp-preview fade-in" style="animation-delay: 0.35s">
          <view class="bootcamp-header">
            <view class="bootcamp-icon">
              <view class="fas fa-users"></view>
            </view>
            <view class="bootcamp-title">深度共读体验</view>
            <view class="bootcamp-badge">限时5折</view>
          </view>
          <view class="bootcamp-content">
            <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop"
              class="bootcamp-cover" mode="aspectFill"></image>
            <view class="bootcamp-info">
              <view class="bootcamp-book-title">1月期 · 被讨厌的勇气</view>
              <view class="bootcamp-book-author">30天深度共读训练营</view>
              <view class="bootcamp-features">
                <view class="bootcamp-feature">
                  <view class="fas fa-check"></view> 10人小班
                </view>
                <view class="bootcamp-feature">
                  <view class="fas fa-check"></view> 班长陪伴
                </view>
                <view class="bootcamp-feature">
                  <view class="fas fa-check"></view> 云书房共读
                </view>
                <view class="bootcamp-feature">
                  <view class="fas fa-check"></view> AI觉察反馈
                </view>
              </view>
            </view>
          </view>
          <view class="bootcamp-cta">
            <view class="bootcamp-price">
              <text>¥499</text><text>¥999</text>
            </view>
            <view class="bootcamp-btn" @click="goToBootcampDetail">了解详情</view>
          </view>
        </view>

        <view class="social-proof fade-in" style="animation-delay: 0.4s">
          <view class="section-header" style="margin-bottom: 24rpx">
            <view>学员感言</view>
            <view class="text-sm text-muted">真实反馈</view>
          </view>

          <view v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
            <view class="testimonial-header">
              <image :src="testimonial.avatar" class="testimonial-avatar" mode="aspectFill"></image>
              <view class="testimonial-info">
                <view class="testimonial-name">{{ testimonial.name }}</view>
                <view class="testimonial-meta">{{ testimonial.meta }}</view>
              </view>
              <view class="testimonial-rating">
                <view v-for="n in 5" :key="n" class="fas fa-star"></view>
              </view>
            </view>
            <view class="testimonial-content" v-html="testimonial.content"></view>
          </view>
        </view>

        <view class="bottom-cta fade-in" style="animation-delay: 0.45s">
          <view class="bottom-cta-title">准备好开始改变了吗？</view>
          <view class="bottom-cta-desc">每天1元，解锁200本成长好书</view>
          <view class="bottom-cta-btn" @click="goToMembership">
            <view class="fas fa-crown"></view> 查看会员权益
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

const activeCategory = ref('hot')

const categories = [
  { id: 'hot', icon: 'fas fa-fire', label: '热门' },
  { id: 'emotion', icon: 'fas fa-heart', label: '情绪管理' },
  { id: 'relationship', icon: 'fas fa-users', label: '人际关系' },
  { id: 'career', icon: 'fas fa-briefcase', label: '职场成长' },
  { id: 'love', icon: 'fas fa-home', label: '亲密关系' }
]

const books = [
  {
    id: 1,
    title: '非暴力沟通',
    author: '马歇尔·卢森堡',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=112&h=150&fit=crop',
    category: '沟通',
    duration: '32分钟',
    isFree: true
  },
  {
    id: 2,
    title: '蛤蟆先生去看心理医生',
    author: '罗伯特·戴博德',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=112&h=150&fit=crop',
    category: '心理',
    duration: '35分钟',
    isFree: true
  },
  {
    id: 3,
    title: '亲密关系',
    author: '克里斯多福·孟',
    cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=112&h=150&fit=crop',
    category: '情感',
    duration: '42分钟',
    isFree: false
  }
]

const testimonials = [
  {
    id: 1,
    name: '晓雯',
    meta: '产品经理 · 38岁 · 已参加3期',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=72&h=72&fit=crop',
    content: '以前总是为孩子的学习焦虑，学了<em>「课题分离」</em>后，我开始放手让他自己负责。没想到他反而更主动了，亲子关系也变好了。'
  },
  {
    id: 2,
    name: '志远',
    meta: '创业者 · 42岁 · 超级会员',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=72&h=72&fit=crop',
    content: '每天早上5:55的云书房，成了我最期待的时光。10个人一起朗读、分享，这种<em>被陪伴的感觉</em>，是独自看书永远体会不到的。'
  }
]

const handleTabChange = (tab: string) => {
  const routes: Record<string, string> = {
    home: '/home-visitor',
    bookroom: '/audiobooks',
    journal: '/journal',
    plaza: '/plaza',
    profile: '/profile'
  }
  router.push(routes[tab] || '/')
}

const goToMembership = () => {
  router.push('/membership')
}

const goToAudiobooks = () => {
  router.push('/audiobooks')
}

const goToBookDetail = () => {
  router.push('/book-detail')
}

const goToBootcampDetail = () => {
  router.push('/bookroom-hub')
}
</script>

<style scoped>
.welcome-header {
  text-align: center;
  padding: 40rpx 0 48rpx;
}

.welcome-logo {
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24rpx;
  font-size: 48rpx;
  color: #1a1a2e;
}

.welcome-title {
  font-size: 44rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 12rpx;
}

.welcome-subtitle {
  font-size: 28rpx;
  color: var(--text-muted);
  line-height: 1.6;
}

.trial-banner {
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.15) 0%, rgba(46, 204, 113, 0.08) 100%);
  border: 2rpx solid rgba(88, 214, 141, 0.25);
  border-radius: var(--radius-lg);
  padding: 28rpx 32rpx;
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.trial-icon {
  width: 80rpx;
  height: 80rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-green);
  font-size: 32rpx;
  flex-shrink: 0;
}

.trial-content {
  flex: 1;
}

.trial-title {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4rpx;
}

.trial-desc {
  font-size: 24rpx;
  color: var(--text-muted);
}

.trial-btn {
  padding: 16rpx 28rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 32rpx;
  font-size: 24rpx;
  color: var(--accent-green);
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.free-book-card {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.12) 0%, rgba(243, 156, 18, 0.06) 100%);
  border: 2rpx solid rgba(244, 208, 63, 0.25);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.free-book-label {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx 20rpx;
  background: rgba(244, 208, 63, 0.2);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: var(--accent-gold);
  font-weight: 600;
  margin-bottom: 24rpx;
}

.free-book-content {
  display: flex;
  gap: 28rpx;
}

.free-book-cover {
  width: 160rpx;
  height: 214rpx;
  border-radius: 16rpx;
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.free-book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.free-book-title {
  font-size: 34rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 8rpx;
}

.free-book-author {
  font-size: 26rpx;
  color: var(--text-muted);
  margin-bottom: 16rpx;
}

.free-book-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 24rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.free-book-meta {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: auto;
}

.free-book-meta-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: var(--text-muted);
}

.free-book-meta-item view {
  font-size: 22rpx;
  color: var(--accent-gold);
}

.free-book-play {
  width: 100%;
  padding: 24rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a2e;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-top: 28rpx;
}

.category-section {
  margin-bottom: 40rpx;
}

.category-scroll {
  display: flex;
  gap: 20rpx;
  overflow-x: auto;
  padding-bottom: 16rpx;
  margin: 0 -32rpx;
  padding-left: 32rpx;
  padding-right: 32rpx;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-chip {
  padding: 20rpx 32rpx;
  background: var(--bg-card);
  border-radius: 40rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.category-chip:hover {
  background: rgba(255, 255, 255, 0.1);
}

.category-chip.active {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  color: #1a1a2e;
  font-weight: 600;
}

.category-chip view {
  font-size: 24rpx;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.book-item {
  display: flex;
  gap: 24rpx;
  padding: 24rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.book-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.book-item-cover {
  width: 112rpx;
  height: 150rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.book-item-info {
  flex: 1;
  min-width: 0;
}

.book-item-title {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 8rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-item-author {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-bottom: 12rpx;
}

.book-item-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.book-item-tag {
  padding: 6rpx 16rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12rpx;
  font-size: 22rpx;
  color: var(--text-muted);
}

.book-item-tag.free {
  background: rgba(88, 214, 141, 0.15);
  color: var(--accent-green);
}

.book-item-play {
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 24rpx;
  flex-shrink: 0;
  align-self: center;
}

.book-item:hover .book-item-play {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  color: #1a1a2e;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  padding: 32rpx;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  margin-bottom: 40rpx;
}

.stats-bar .stat-item {
  text-align: center;
  padding: 0;
  background: none;
}

.stats-bar .stat-value {
  font-size: 40rpx;
  color: var(--text-primary);
  font-weight: 700;
}

.stats-bar .stat-value text {
  font-size: 24rpx;
  color: var(--accent-gold);
}

.stats-bar .stat-label {
  font-size: 22rpx;
  color: var(--text-muted);
  margin-top: 4rpx;
}

.bootcamp-preview {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.12) 0%, rgba(142, 68, 173, 0.06) 100%);
  border: 2rpx solid rgba(155, 89, 182, 0.2);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.bootcamp-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.bootcamp-icon {
  width: 72rpx;
  height: 72rpx;
  background: rgba(155, 89, 182, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9b59b6;
  font-size: 32rpx;
}

.bootcamp-title {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.bootcamp-badge {
  margin-left: auto;
  padding: 8rpx 20rpx;
  background: rgba(155, 89, 182, 0.2);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #9b59b6;
  font-weight: 600;
}

.bootcamp-content {
  display: flex;
  gap: 28rpx;
  margin-bottom: 28rpx;
}

.bootcamp-cover {
  width: 120rpx;
  height: 160rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}

.bootcamp-info {
  flex: 1;
}

.bootcamp-book-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 8rpx;
}

.bootcamp-book-author {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-bottom: 16rpx;
}

.bootcamp-features {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.bootcamp-feature {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: var(--text-secondary);
}

.bootcamp-feature view {
  color: #9b59b6;
  font-size: 20rpx;
}

.bootcamp-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: rgba(155, 89, 182, 0.1);
  border-radius: 20rpx;
}

.bootcamp-price {
  font-size: 24rpx;
  color: var(--text-muted);
}

.bootcamp-price text:first-child {
  font-size: 36rpx;
  color: #9b59b6;
  font-weight: 700;
}

.bootcamp-price text:last-child {
  color: var(--text-muted);
  margin-left: 12rpx;
  text-decoration: line-through;
}

.bootcamp-btn {
  padding: 20rpx 40rpx;
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.social-proof {
  margin-bottom: 40rpx;
}

.testimonial-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.testimonial-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.testimonial-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
}

.testimonial-info {
  flex: 1;
}

.testimonial-name {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.testimonial-meta {
  font-size: 22rpx;
  color: var(--text-muted);
}

.testimonial-rating {
  color: var(--accent-gold);
  font-size: 22rpx;
}

.testimonial-content {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.6;
}

.testimonial-content :deep(em) {
  color: var(--accent-gold);
  font-style: normal;
}

.bottom-cta {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(243, 156, 18, 0.08) 100%);
  border: 2rpx solid rgba(244, 208, 63, 0.2);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  text-align: center;
  margin-bottom: 40rpx;
}

.bottom-cta-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 12rpx;
}

.bottom-cta-desc {
  font-size: 26rpx;
  color: var(--text-muted);
  margin-bottom: 28rpx;
}

.bottom-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 56rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 48rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a2e;
  border: none;
  cursor: pointer;
}
</style>
