<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <view class="header-row fade-in">
          <view class="back-btn" @click="goBack">
            <view class="fas fa-arrow-left"></view>
          </view>
          <view class="page-title">帮助与反馈</view>
          <view style="width: 80rpx"></view>
        </view>

        <view class="search-box fade-in" style="animation-delay: 0.1s">
          <view class="fas fa-search"></view>
          <input type="text" placeholder="搜索常见问题" v-model="searchQuery">
        </view>

        <view class="quick-actions fade-in" style="animation-delay: 0.15s">
          <view class="quick-action" @click="contactService">
            <view class="quick-action-icon quick-action-gold">
              <view class="fas fa-headset"></view>
            </view>
            <view>在线客服</view>
          </view>
          <view class="quick-action" @click="submitFeedback">
            <view class="quick-action-icon quick-action-blue">
              <view class="fas fa-comment-dots"></view>
            </view>
            <view>意见反馈</view>
          </view>
          <view class="quick-action" @click="reportProblem">
            <view class="quick-action-icon quick-action-pink">
              <view class="fas fa-bug"></view>
            </view>
            <view>问题报告</view>
          </view>
        </view>

        <view class="section-header fade-in" style="animation-delay: 0.2s">
          <view>常见问题</view>
        </view>

        <view class="faq-list fade-in" style="animation-delay: 0.2s">
          <view v-for="(faq, index) in faqs" :key="index" class="faq-item" :class="{ expanded: expandedFaq === index }"
            @click="toggleFaq(index)">
            <view class="faq-question">
              <view>{{ faq.question }}</view>
              <view :class="expandedFaq === index ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></view>
            </view>
            <view v-if="expandedFaq === index" class="faq-answer">
              {{ faq.answer }}
            </view>
          </view>
        </view>

        <view class="section-header fade-in mt-lg" style="animation-delay: 0.25s">
          <view>帮助分类</view>
        </view>

        <view class="help-categories fade-in" style="animation-delay: 0.25s">
          <view class="help-category" @click="viewCategory('account')">
            <view class="help-category-icon">
              <view class="fas fa-user"></view>
            </view>
            <view class="help-category-info">
              <view class="help-category-title">账号相关</view>
              <view class="help-category-count">8 篇文章</view>
            </view>
            <view class="fas fa-chevron-right"></view>
          </view>

          <view class="help-category" @click="viewCategory('subscription')">
            <view class="help-category-icon">
              <view class="fas fa-crown"></view>
            </view>
            <view class="help-category-info">
              <view class="help-category-title">订阅与会员</view>
              <view class="help-category-count">12 篇文章</view>
            </view>
            <view class="fas fa-chevron-right"></view>
          </view>

          <view class="help-category" @click="viewCategory('bookroom')">
            <view class="help-category-icon">
              <view class="fas fa-book-reader"></view>
            </view>
            <view class="help-category-info">
              <view class="help-category-title">云书房使用</view>
              <view class="help-category-count">15 篇文章</view>
            </view>
            <view class="fas fa-chevron-right"></view>
          </view>

          <view class="help-category" @click="viewCategory('journal')">
            <view class="help-category-icon">
              <view class="fas fa-pen"></view>
            </view>
            <view class="help-category-info">
              <view class="help-category-title">日记与觉察</view>
              <view class="help-category-count">10 篇文章</view>
            </view>
            <view class="fas fa-chevron-right"></view>
          </view>
        </view>

        <view class="section-header fade-in mt-lg" style="animation-delay: 0.3s">
          <view>联系我们</view>
        </view>

        <view class="contact-card fade-in" style="animation-delay: 0.3s">
          <view class="contact-item">
            <view class="fas fa-envelope"></view>
            <view>support@mindbond.com</view>
          </view>
          <view class="contact-item">
            <view class="fab fa-weixin"></view>
            <view>微信公众号：MindBond心智共读</view>
          </view>
          <view class="contact-item">
            <view class="fas fa-clock"></view>
            <view>客服时间：9:00 - 21:00</view>
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

const searchQuery = ref('')
const expandedFaq = ref<number | null>(null)

const faqs = [
  {
    question: '如何加入读书班级？',
    answer: '购买年度会员后，系统会根据你选择的阅读时间段自动分配班级。你也可以在"我的班级"中申请调班。'
  },
  {
    question: '错过了共读时间怎么办？',
    answer: '每次共读都有录音回放，你可以在"听书房"中找到回放内容。不过建议尽量参与实时共读，效果更好哦！'
  },
  {
    question: '日记可以设置为仅自己可见吗？',
    answer: '可以的！在"设置 - 隐私设置"中，你可以选择日记的可见范围：公开、仅班级或仅自己。'
  },
  {
    question: '如何取消订阅？',
    answer: '在"会员中心"页面底部可以找到"管理订阅"选项，点击后可以选择取消自动续费。已付费的会员权益会保留至到期日。'
  },
  {
    question: '成长报告多久更新一次？',
    answer: '成长报告每周日晚上 22:00 自动更新，包含你本周的共读时长、日记数量、情绪变化等数据分析。'
  }
]

const toggleFaq = (index: number) => {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

const contactService = () => {
  alert('正在连接在线客服...')
}

const submitFeedback = () => {
  alert('感谢你的反馈！我们会认真阅读每一条建议。')
}

const reportProblem = () => {
  alert('问题报告功能即将上线')
}

const viewCategory = (category: string) => {
  console.log('View category:', category)
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48rpx;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 24rpx;
  color: var(--text-primary);
  font-size: 32rpx;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 32rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 40rpx;
}

.search-box .fas {
  color: var(--text-muted);
  font-size: 28rpx;
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 28rpx;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  margin-bottom: 48rpx;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  cursor: pointer;
  font-size: 26rpx;
  color: var(--text-secondary);
}

.quick-action-icon {
  width: 112rpx;
  height: 112rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
}

.quick-action-gold {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.quick-action-blue {
  background: rgba(93, 173, 226, 0.2);
  color: var(--accent-blue);
}

.quick-action-pink {
  background: rgba(248, 165, 194, 0.2);
  color: #f8a5c2;
}

.section-header {
  margin-bottom: 24rpx;
}

.section-header view {
  font-size: 28rpx;
  color: var(--text-muted);
  font-weight: 500;
}

.faq-list {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.faq-item {
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  font-size: 28rpx;
  color: var(--text-primary);
}

.faq-question .fas {
  color: var(--text-muted);
  font-size: 24rpx;
}

.faq-answer {
  padding: 0 32rpx 32rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.6;
}

.faq-item.expanded {
  background: rgba(255, 255, 255, 0.03);
}

.help-categories {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.help-category {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.help-category:last-child {
  border-bottom: none;
}

.help-category-icon {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 32rpx;
}

.help-category-info {
  flex: 1;
}

.help-category-title {
  font-size: 30rpx;
  color: var(--text-primary);
}

.help-category-count {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-top: 4rpx;
}

.help-category>.fas {
  color: var(--text-muted);
  font-size: 24rpx;
}

.contact-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: var(--text-secondary);
}

.contact-item:not(:last-child) {
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.08);
}

.contact-item .fas,
.contact-item .fab {
  width: 40rpx;
  color: var(--text-muted);
  text-align: center;
}

.mt-lg {
  margin-top: 48rpx;
}
</style>
