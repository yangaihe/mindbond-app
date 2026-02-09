<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Header -->
        <view class="header-row fade-in">
          <view class="back-btn" @click="goBack">
            <text class="fas fa-arrow-left"></text>
          </view>
          <view class="page-title">设置</view>
          <view style="width: 80rpx"></view>
        </view>

        <!-- Notification Settings -->
        <view class="section-header fade-in" style="animation-delay: 0.1s">
          <view>提醒设置</view>
        </view>

        <view class="settings-card fade-in" style="animation-delay: 0.1s">
          <view class="settings-item">
            <view class="settings-item-info">
              <view class="settings-icon settings-icon-gold">
                <text class="fas fa-bell"></text>
              </view>
              <view class="settings-content">
                <view class="settings-title">共读提醒</view>
                <view class="settings-desc">每晚 20:50 提醒进入书房</view>
              </view>
            </view>
            <label class="switch">
              <input type="checkbox" v-model="notifications.bookroom">
              <text class="slider"></text>
            </label>
          </view>

          <view class="settings-item">
            <view class="settings-item-info">
              <view class="settings-icon settings-icon-pink">
                <text class="fas fa-pen"></text>
              </view>
              <view class="settings-content">
                <view class="settings-title">日记提醒</view>
                <view class="settings-desc">每晚 22:00 提醒写觉察日记</view>
              </view>
            </view>
            <label class="switch">
              <input type="checkbox" v-model="notifications.journal">
              <text class="slider"></text>
            </label>
          </view>

          <view class="settings-item">
            <view class="settings-item-info">
              <view class="settings-icon settings-icon-blue">
                <text class="fas fa-users"></text>
              </view>
              <view class="settings-content">
                <view class="settings-title">班级消息</view>
                <view class="settings-desc">班长消息、班级公告等</view>
              </view>
            </view>
            <label class="switch">
              <input type="checkbox" v-model="notifications.classMessage">
              <text class="slider"></text>
            </label>
          </view>

          <view class="settings-item">
            <view class="settings-item-info">
              <view class="settings-icon settings-icon-green">
                <text class="fas fa-heart"></text>
              </view>
              <view class="settings-content">
                <view class="settings-title">互动通知</view>
                <view class="settings-desc">点赞、评论等互动消息</view>
              </view>
            </view>
            <label class="switch">
              <input type="checkbox" v-model="notifications.interaction">
              <text class="slider"></text>
            </label>
          </view>
        </view>

        <!-- Privacy Settings -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.2s">
          <view>隐私设置</view>
        </view>

        <view class="settings-card fade-in" style="animation-delay: 0.2s">
          <view class="settings-item" @click="showPrivacyPicker = true">
            <view class="settings-item-info">
              <view class="settings-icon">
                <text class="fas fa-eye"></text>
              </view>
              <view class="settings-content">
                <view class="settings-title">日记可见范围</view>
                <view class="settings-desc">{{ privacyText }}</view>
              </view>
            </view>
            <text class="fas fa-chevron-right settings-arrow"></text>
          </view>

          <view class="settings-item">
            <view class="settings-item-info">
              <view class="settings-icon">
                <text class="fas fa-user-shield"></text>
              </view>
              <view class="settings-content">
                <view class="settings-title">允许他人查看我的主页</view>
                <view class="settings-desc">关闭后他人无法访问你的个人主页</view>
              </view>
            </view>
            <label class="switch">
              <input type="checkbox" v-model="privacy.showProfile">
              <text class="slider"></text>
            </label>
          </view>

          <view class="settings-item">
            <view class="settings-item-info">
              <view class="settings-icon">
                <text class="fas fa-chart-line"></text>
              </view>
              <view class="settings-content">
                <view class="settings-title">展示成长数据</view>
                <view class="settings-desc">在个人主页展示成长天数、日记数等</view>
              </view>
            </view>
            <label class="switch">
              <input type="checkbox" v-model="privacy.showStats">
              <text class="slider"></text>
            </label>
          </view>
        </view>

        <!-- Other Settings -->
        <view class="section-header fade-in mt-lg" style="animation-delay: 0.3s">
          <view>其他</view>
        </view>

        <view class="settings-card fade-in" style="animation-delay: 0.3s">
          <view class="settings-item" @click="clearCache">
            <view class="settings-item-info">
              <view class="settings-icon">
                <text class="fas fa-broom"></text>
              </view>
              <view class="settings-content">
                <view class="settings-title">清除缓存</view>
                <view class="settings-desc">当前缓存 23.5 MB</view>
              </view>
            </view>
            <text class="fas fa-chevron-right settings-arrow"></text>
          </view>
        </view>

        <!-- Privacy Picker Modal -->
        <view v-if="showPrivacyPicker" class="picker-modal">
          <view class="picker-overlay" @click="showPrivacyPicker = false"></view>
          <view class="picker-content">
            <view class="picker-header">
              <view class="picker-cancel" @click="showPrivacyPicker = false">取消</view>
              <view class="picker-title">日记可见范围</view>
              <view class="picker-confirm" @click="confirmPrivacy">确定</view>
            </view>
            <view class="picker-options">
              <view v-for="option in privacyOptions" :key="option.value" class="picker-option"
                :class="{ active: tempPrivacy === option.value }" @click="tempPrivacy = option.value">
                <text :class="option.icon"></text>
                <view class="picker-option-info">
                  <text class="picker-option-label">{{ option.label }}</text>
                  <text class="picker-option-desc">{{ option.desc }}</text>
                </view>
                <text v-if="tempPrivacy === option.value" class="fas fa-check"></text>
              </view>
            </view>
          </view>
        </view>

        <view style="height: 40rpx"></view>
      </view>
    </template>
  </page-root>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

// Notification settings
const notifications = ref({
  bookroom: true,
  journal: true,
  classMessage: true,
  interaction: false
})

// Privacy settings
const privacy = ref({
  journalVisibility: 'class',
  showProfile: true,
  showStats: true
})

// Privacy picker
const showPrivacyPicker = ref(false)
const tempPrivacy = ref(privacy.value.journalVisibility)

const privacyOptions = [
  { value: 'public', label: '公开', desc: '所有人可见', icon: 'fas fa-globe' },
  { value: 'class', label: '仅班级', desc: '只有同班同学可见', icon: 'fas fa-users' },
  { value: 'private', label: '仅自己', desc: '只有自己可见', icon: 'fas fa-lock' }
]

const privacyText = computed(() => {
  const option = privacyOptions.find(o => o.value === privacy.value.journalVisibility)
  return option ? option.label : '未设置'
})

const confirmPrivacy = () => {
  privacy.value.journalVisibility = tempPrivacy.value
  showPrivacyPicker.value = false
}

const clearCache = () => {
  if (confirm('确定要清除缓存吗？')) {
    alert('缓存已清除')
  }
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

/* Section Header */
.section-header {
  margin-bottom: 24rpx;
}

.section-header view {
  font-size: 28rpx;
  color: var(--text-muted);
  font-weight: 500;
}

/* Settings Card */
.settings-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.settings-icon {
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

.settings-icon-gold {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.settings-icon-pink {
  background: rgba(248, 165, 194, 0.2);
  color: #f8a5c2;
}

.settings-icon-blue {
  background: rgba(93, 173, 226, 0.2);
  color: var(--accent-blue);
}

.settings-icon-green {
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.settings-content {
  flex: 1;
}

.settings-title {
  font-size: 30rpx;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.settings-desc {
  font-size: 24rpx;
  color: var(--text-muted);
}

.settings-arrow {
  color: var(--text-muted);
  font-size: 24rpx;
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 100rpx;
  height: 56rpx;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.3s;
  border-radius: 56rpx;
}

.slider:before {
  position: absolute;
  content: "";
  height: 44rpx;
  width: 44rpx;
  left: 6rpx;
  bottom: 6rpx;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked+.slider {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
}

input:checked+.slider:before {
  transform: translateX(44rpx);
}

/* Picker Modal */
.picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.picker-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.picker-content {
  position: relative;
  width: 100%;
  max-width: 393px;
  background: #1a1a2e;
  border-radius: 40rpx 40rpx 0 0;
  padding-bottom: 68rpx;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.picker-cancel,
.picker-confirm {
  padding: 16rpx 24rpx;
  background: none;
  border: none;
  font-size: 30rpx;
  cursor: pointer;
}

.picker-cancel {
  color: var(--text-muted);
}

.picker-confirm {
  color: var(--accent-gold);
  font-weight: 600;
}

.picker-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.picker-options {
  padding: 16rpx 0;
}

.picker-option {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx 40rpx;
  cursor: pointer;
  transition: background 0.2s;
}

.picker-option:active {
  background: rgba(255, 255, 255, 0.05);
}

.picker-option text:first-child {
  font-size: 40rpx;
  color: var(--text-secondary);
  width: 48rpx;
  text-align: center;
}

.picker-option-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.picker-option-label {
  font-size: 32rpx;
  color: var(--text-primary);
}

.picker-option-desc {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-top: 4rpx;
}

.picker-option.active {
  background: rgba(244, 208, 63, 0.1);
}

.picker-option.active text:first-child {
  color: var(--accent-gold);
}

.picker-option .fa-check {
  color: var(--accent-gold);
  font-size: 32rpx;
}

/* Utilities */
.mt-lg {
  margin-top: 48rpx;
}
</style>