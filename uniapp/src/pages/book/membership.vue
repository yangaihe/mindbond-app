<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Page Header -->
        <view class="page-header fade-in">
          <view class="back-btn" @click="goBack">
            <text class="fas fa-arrow-left"></text>
          </view>
          <text class="page-title">会员中心</text>
        </view>

        <!-- Promo Banner -->
        <view class="promo-banner fade-in" style="animation-delay: 0.1s">
          <view class="promo-icon">
            <text class="fas fa-fire"></text>
          </view>
          <view class="promo-content">
            <view class="promo-title">新年特惠 · 限时5折</view>
            <view class="promo-desc">共读营首期仅需499元</view>
          </view>
          <view class="promo-countdown">
            <view class="promo-time">{{ countdownTime }}</view>
            <view class="promo-label">后结束</view>
          </view>
        </view>

        <!-- Current Status (Free User Example) -->
        <view class="status-card fade-in" style="animation-delay: 0.12s">
          <view class="status-avatar free">
            <text class="fas fa-user"></text>
          </view>
          <view class="status-info">
            <view class="status-name">游客用户</view>
            <view class="status-level free">升级会员，开启成长之旅</view>
          </view>
          <text class="status-badge free">未开通</text>
        </view>

        <!-- Plan Cards -->
        <view class="plan-section fade-in" style="animation-delay: 0.15s">
          <view class="section-header" style="margin-bottom: 28rpx">
            <view>选择适合你的方案</view>
          </view>

          <!-- 听书房 Basic -->
          <view class="plan-card">
            <view class="plan-header">
              <view>
                <view class="plan-icon basic">
                  <text class="fas fa-headphones"></text>
                </view>
                <view class="plan-name">听书房</view>
                <view class="plan-desc">轻量级成长 · 碎片时间学习</view>
              </view>
              <view class="plan-price">
                <view class="plan-price-value"><text>¥</text>365</view>
                <view class="plan-price-unit">/年 · 约1元/天</view>
              </view>
            </view>
            <view class="plan-features">
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>200+本书精华解读音频</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>每本书配套觉察任务</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>详细文稿 + 思维导图</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>中英金句卡片</text>
              </view>
            </view>
            <view class="plan-btn secondary">开通听书房</view>
          </view>

          <!-- 共读营 Pro -->
          <view class="plan-card">
            <view class="plan-badge discount">限时5折</view>
            <view class="plan-header">
              <view>
                <view class="plan-icon pro">
                  <text class="fas fa-users"></text>
                </view>
                <view class="plan-name">共读营</view>
                <view class="plan-desc">深度共读 · 班长陪伴成长</view>
              </view>
              <view class="plan-price">
                <view class="plan-price-original">¥999</view>
                <view class="plan-price-value"><text>¥</text>499</view>
                <view class="plan-price-unit">/期 · 30天</view>
              </view>
            </view>
            <view class="plan-features">
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>10人精品小班 + 班长</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>28讲系统音频课程</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>每日觉察任务 + AI反馈</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>云书房朗读 + 分享</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>4次主题班会直播</text>
              </view>
            </view>
            <view class="plan-btn secondary">立即报名</view>
          </view>

          <!-- 超级会员 Premium -->
          <view class="plan-card highlight">
            <view class="plan-badge">超值推荐</view>
            <view class="plan-header">
              <view>
                <view class="plan-icon premium">
                  <text class="fas fa-crown"></text>
                </view>
                <view class="plan-name">超级会员</view>
                <view class="plan-desc">全年畅学 · 最具性价比</view>
              </view>
              <view class="plan-price">
                <view class="plan-price-original">¥11988</view>
                <view class="plan-price-value"><text>¥</text>1980</view>
                <view class="plan-price-unit">/年 · 约5.4元/天</view>
              </view>
            </view>
            <view class="plan-features">
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>
                  <view>全年12期共读营</view>（价值¥11988）
                </text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>听书房200本书（价值¥365）</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>AI觉察日记无限使用</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>专属VIP班级</text>
              </view>
              <view class="plan-feature">
                <text class="fas fa-check"></text>
                <text>创始人1v1辅导1次</text>
              </view>
            </view>
            <view class="plan-btn primary">立即开通</view>
          </view>
        </view>

        <!-- Comparison -->
        <view class="compare-card fade-in" style="animation-delay: 0.2s">
          <view class="compare-header">
            <text class="compare-title">权益对比</text>
            <text class="compare-expand" @click="toggleCompare">
              {{ isCompareExpanded ? '收起' : '展开全部' }}
              <text :class="isCompareExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></text>
            </text>
          </view>
          <view class="compare-labels">
            <text class="compare-label">权益</text>
            <text class="compare-label">听书房</text>
            <text class="compare-label">共读营</text>
            <text class="compare-label">超级会员</text>
          </view>
          <view class="compare-table">
            <view class="compare-row">
              <text class="compare-feature">听书内容</text>
              <text class="compare-check"><text class="fas fa-check"></text></text>
              <text class="compare-check"><text>单本</text></text>
              <text class="compare-check"><text class="fas fa-check"></text></text>
            </view>
            <view class="compare-row">
              <text class="compare-feature">云书房共读</text>
              <text class="compare-check"><text class="fas fa-times"></text></text>
              <text class="compare-check"><text class="fas fa-check"></text></text>
              <text class="compare-check"><text class="fas fa-check"></text></text>
            </view>
            <view class="compare-row">
              <text class="compare-feature">班长陪伴</text>
              <text class="compare-check"><text class="fas fa-times"></text></text>
              <text class="compare-check"><text class="fas fa-check"></text></text>
              <text class="compare-check"><text class="fas fa-check"></text></text>
            </view>
            <view class="compare-row">
              <text class="compare-feature">AI觉察反馈</text>
              <text class="compare-check"><text>基础</text></text>
              <text class="compare-check"><text class="fas fa-check"></text></text>
              <text class="compare-check"><text class="fas fa-check"></text></text>
            </view>
            <view class="compare-row">
              <text class="compare-feature">班会直播</text>
              <text class="compare-check"><text class="fas fa-times"></text></text>
              <text class="compare-check"><text>4次/期</text></text>
              <text class="compare-check"><text>48次/年</text></text>
            </view>
          </view>
        </view>

        <!-- Guarantee -->
        <view class="guarantee-banner fade-in" style="animation-delay: 0.22s">
          <text class="guarantee-item">
            <text class="fas fa-shield-alt"></text> 7天无理由退款
          </text>
          <text class="guarantee-item">
            <text class="fas fa-lock"></text> 安全支付
          </text>
          <text class="guarantee-item">
            <text class="fas fa-headset"></text> 专属客服
          </text>
        </view>

        <!-- Extra Courses -->
        <view class="courses-section fade-in" style="animation-delay: 0.25s">
          <view class="section-header" style="margin-bottom: 28rpx">
            <view>精选课程</view>
            <text class="text-sm text-muted">单独购买</text>
          </view>

          <view v-for="course in courses" :key="course.id" class="course-card">
            <image :src="course.cover" class="course-cover" alt="" mode="aspectFill"></image>
            <view class="course-info">
              <view class="course-title">{{ course.title }}</view>
              <view class="course-meta">{{ course.meta }}</view>
              <view class="course-price">¥{{ course.price }} <text>¥{{ course.originalPrice }}</text></view>
            </view>
          </view>
        </view>

        <!-- FAQ -->
        <view class="section-header fade-in" style="animation-delay: 0.3s; margin-bottom: 28rpx">
          <view>常见问题</view>
        </view>

        <view v-for="(faq, index) in faqs" :key="faq.id" class="faq-item fade-in"
          :style="{ animationDelay: `${0.3 + index * 0.02}s` }">
          <view class="faq-question" @click="toggleFaq(faq.id)">
            <view>{{ faq.question }}</view>
            <text :class="expandedFaqs.includes(faq.id) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></text>
          </view>
          <view v-if="faq.answer && expandedFaqs.includes(faq.id)" class="faq-answer">
            {{ faq.answer }}
          </view>
        </view>

        <!-- Bottom Spacing -->
        <view style="height: 40rpx"></view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

// Countdown timer
const countdownTime = ref('02:15:38')
let countdownInterval: number | null = null

const startCountdown = () => {
  let hours = 2
  let minutes = 15
  let seconds = 38

  countdownInterval = window.setInterval(() => {
    seconds--
    if (seconds < 0) {
      seconds = 59
      minutes--
      if (minutes < 0) {
        minutes = 59
        hours--
        if (hours < 0) {
          hours = 23
        }
      }
    }
    countdownTime.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

// Compare section toggle
const isCompareExpanded = ref(false)
const toggleCompare = () => {
  isCompareExpanded.value = !isCompareExpanded.value
}

// Courses data
const courses = [
  {
    id: 1,
    title: '亲密关系工作坊',
    meta: '8节视频课 · 张老师主讲',
    cover: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=120&h=120&fit=crop',
    price: 299,
    originalPrice: 499
  },
  {
    id: 2,
    title: '正念冥想21天',
    meta: '21节音频 · 每天15分钟',
    cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=120&h=120&fit=crop',
    price: 199,
    originalPrice: 299
  },
  {
    id: 3,
    title: '情绪管理训练营',
    meta: '12节课 · 直播回放',
    cover: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=120&h=120&fit=crop',
    price: 399,
    originalPrice: 699
  }
]

// FAQ data
const faqs = [
  {
    id: 1,
    question: '听书房和共读营有什么区别？',
    answer: '听书房是轻量级学习，适合碎片时间听书；共读营是30天深度共读，有班长陪伴、云书房朗读、班会直播等深度互动。如果你想快速了解一本书，选听书房；如果你想真正改变，选共读营。'
  },
  {
    id: 2,
    question: '超级会员可以参加所有训练营吗？',
    answer: '是的，超级会员全年12期训练营都可以参加，每月一期不同主题的书。如果某期时间冲突，可以选择下一期同主题的班级。'
  },
  {
    id: 3,
    question: '可以先试听再决定吗？',
    answer: '可以的。听书房有3本免费书可以体验，共读营支持7天无理由退款，让你没有后顾之忧。'
  },
  {
    id: 4,
    question: '会员到期后数据还在吗？',
    answer: null
  }
]

const expandedFaqs = ref<number[]>([1])

const toggleFaq = (id: number) => {
  const index = expandedFaqs.value.indexOf(id)
  if (index > -1) {
    expandedFaqs.value.splice(index, 1)
  } else {
    expandedFaqs.value.push(id)
  }
}

// Navigation
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

const goBack = () => {
  router.back()
}
</script>

<style scoped>
/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
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

/* Promo Banner */
.promo-banner {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border-radius: var(--radius-lg);
  padding: 28rpx 32rpx;
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.promo-icon {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 36rpx;
  flex-shrink: 0;
}

.promo-content {
  flex: 1;
}

.promo-title {
  font-size: 28rpx;
  color: #fff;
  font-weight: 700;
  margin-bottom: 4rpx;
}

.promo-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.promo-countdown {
  text-align: right;
}

.promo-time {
  font-size: 32rpx;
  color: #fff;
  font-weight: 700;
  font-family: 'SF Mono', monospace;
}

.promo-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
}

/* Current Status */
.status-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
  gap: 28rpx;
}

.status-avatar {
  width: 104rpx;
  height: 104rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 40rpx;
}

.status-avatar.free {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
}

.status-info {
  flex: 1;
}

.status-name {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4rpx;
}

.status-level {
  font-size: 26rpx;
  color: var(--accent-gold);
}

.status-level.free {
  color: var(--text-muted);
}

.status-badge {
  padding: 12rpx 24rpx;
  background: rgba(244, 208, 63, 0.15);
  border-radius: 24rpx;
  font-size: 24rpx;
  color: var(--accent-gold);
  font-weight: 600;
}

.status-badge.free {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
}

/* Plan Cards */
.plan-section {
  margin-bottom: 40rpx;
}

.plan-card {
  position: relative;
  padding: 40rpx;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  margin-bottom: 24rpx;
  border: 4rpx solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.plan-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.plan-card.highlight {
  border-color: var(--accent-gold);
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.1) 0%, rgba(243, 156, 18, 0.05) 100%);
}

.plan-badge {
  position: absolute;
  top: -20rpx;
  right: 32rpx;
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #1a1a2e;
  font-weight: 600;
}

.plan-badge.discount {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: #fff;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28rpx;
}

.plan-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-bottom: 20rpx;
}

.plan-icon.basic {
  background: rgba(93, 173, 226, 0.2);
  color: var(--accent-blue);
}

.plan-icon.pro {
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.plan-icon.premium {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.plan-name {
  font-size: 34rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 8rpx;
}

.plan-desc {
  font-size: 24rpx;
  color: var(--text-muted);
}

.plan-price {
  text-align: right;
}

.plan-price-original {
  font-size: 24rpx;
  color: var(--text-muted);
  text-decoration: line-through;
}

.plan-price-value {
  font-size: 48rpx;
  color: var(--accent-gold);
  font-weight: 700;
}

.plan-price-value text {
  font-size: 28rpx;
}

.plan-price-unit {
  font-size: 22rpx;
  color: var(--text-muted);
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-top: 28rpx;
  border-top: 2rpx solid rgba(255, 255, 255, 0.08);
}

.plan-feature {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
}

.plan-feature text:first-child {
  color: var(--accent-green);
  font-size: 22rpx;
  width: 28rpx;
}

.plan-feature.disabled {
  color: var(--text-muted);
}

.plan-feature.disabled text:first-child {
  color: var(--text-muted);
}

.plan-btn {
  text-align: center;
  width: 100%;
  padding: 24rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  cursor: pointer;
  margin-top: 28rpx;
}

.plan-btn.primary {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  color: #1a1a2e;
}

.plan-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

/* Comparison Table */
.compare-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 40rpx;
}

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}

.compare-title {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.compare-expand {
  font-size: 24rpx;
  color: var(--accent-gold);
  cursor: pointer;
}

.compare-table {
  width: 100%;
}

.compare-row {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.06);
}

.compare-row:last-child {
  border-bottom: none;
}

.compare-feature {
  flex: 2;
  font-size: 26rpx;
  color: var(--text-secondary);
}

.compare-check {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
}

.compare-check text.fa-check {
  color: var(--accent-green);
}

.compare-check text.fa-times {
  color: var(--text-muted);
}

.compare-check text {
  color: var(--text-muted);
  font-size: 22rpx;
}

.compare-labels {
  display: flex;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
}

.compare-label {
  flex: 1;
  text-align: center;
  font-size: 22rpx;
  color: var(--text-muted);
}

.compare-label:first-child {
  flex: 2;
  text-align: left;
}

/* Extra Courses */
.courses-section {
  margin-bottom: 40rpx;
}

.course-card {
  display: flex;
  gap: 24rpx;
  padding: 28rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 20rpx;
  cursor: pointer;
}

.course-cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-title {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 8rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-meta {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-bottom: 12rpx;
}

.course-price {
  font-size: 28rpx;
  color: var(--accent-gold);
  font-weight: 600;
}

.course-price text {
  font-size: 22rpx;
  color: var(--text-muted);
  text-decoration: line-through;
  margin-left: 12rpx;
}

/* FAQ */
.faq-item {
  padding: 28rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 16rpx;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-question view {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.faq-question text {
  color: var(--text-muted);
  font-size: 24rpx;
}

.faq-answer {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 2rpx solid rgba(255, 255, 255, 0.08);
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Guarantee Banner */
.guarantee-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  margin-bottom: 40rpx;
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: var(--text-muted);
}

.guarantee-item text:first-child {
  color: var(--accent-green);
  font-size: 22rpx;
}
</style>