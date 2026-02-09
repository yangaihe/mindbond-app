<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Header -->
        <view class="write-header fade-in">
          <view class="write-header-btn" @click="goBack">取消</view>
          <text class="write-title">记录此刻</text>
          <view class="write-header-btn primary" :disabled="!content.trim()" @click="publish">完成</view>
        </view>

        <!-- Journal Type Selector -->
        <view class="journal-type-selector fade-in" style="animation-delay: 0.1s;">
          <view v-for="type in journalTypes" :key="type.name" class="journal-type-item"
            :class="{ active: selectedType === type.name }" @click="selectedType = type.name">
            <view :class="type.iconClass"></view>
            <view>{{ type.name }}</view>
          </view>
        </view>

        <!-- Emotion Selector -->
        <view class="emotion-selector fade-in" style="animation-delay: 0.15s;">
          <view class="emotion-selector-label">此刻的心情</view>
          <view class="emotion-list">
            <view v-for="emotion in emotions" :key="emotion.icon" class="emotion-option"
              :class="{ active: selectedEmotion === emotion.icon }" @click="selectedEmotion = emotion.icon">
              <text class="emoji">{{ emotion.icon }}</text>
              <text class="label">{{ emotion.label }}</text>
            </view>
          </view>
        </view>

        <!-- Today's Prompt -->
        <view class="prompt-card fade-in" style="animation-delay: 0.2s;">
          <view class="prompt-card-header">
            <view class="prompt-card-icon">
              <text class="fas fa-lightbulb"></text>
            </view>
            <text class="prompt-card-title">今日觉察任务</text>
          </view>
          <view class="prompt-card-content">
            今天读到"课题分离"——请回想一下，最近有没有什么事情，你在为别人的情绪负责？那是谁的课题？
          </view>
        </view>

        <!-- Write Area -->
        <textarea v-model="content" class="write-area fade-in" style="animation-delay: 0.25s;" placeholder="今天，我觉察到..."
          @input="updateWordCount"></textarea>

        <!-- Tags -->
        <view class="tag-input-area fade-in" style="animation-delay: 0.3s;">
          <view class="tag-input-label">添加标签</view>
          <view class="tag-list">
            <view v-for="tag in availableTags" :key="tag" class="tag-item"
              :class="{ active: selectedTags.includes(tag) }" @click="toggleTag(tag)">
              {{ tag }}
            </view>
            <view class="tag-item custom" @click="addCustomTag">
              <text class="fas fa-plus"></text> 自定义
            </view>
          </view>
        </view>

        <!-- Toolbar -->
        <view class="toolbar fade-in" style="animation-delay: 0.35s;">
          <view class="toolbar-left">
            <view class="toolbar-btn" @click="addImage">
              <text class="fas fa-image"></text>
            </view>
            <view class="toolbar-btn" @click="startVoiceInput">
              <text class="fas fa-microphone"></text>
            </view>
            <view class="toolbar-btn" :class="{ active: isPrivate }" @click="togglePrivacy">
              <text class="fas fa-lock"></text>
            </view>
          </view>
          <text class="word-count">{{ wordCount }} 字</text>
        </view>

        <!-- AI Suggestion Popup -->
        <view v-if="showAISuggestion" class="ai-suggestion">
          <view class="ai-suggestion-header">
            <view class="ai-suggestion-icon">
              <text class="fas fa-sparkles"></text>
            </view>
            <text class="ai-suggestion-title">AI 写作提示</text>
            <text class="fas fa-times ai-suggestion-close" @click="showAISuggestion = false"></text>
          </view>
          <view class="ai-suggestion-content">
            试着具体描述那个场景：发生了什么？你当时的感受是什么？如果重来一次，你会怎么做？
          </view>
        </view>

        <!-- Celebration Modal -->
        <CelebrationModal :visible="showCelebration" :icon="celebrationData.icon" :title="celebrationData.title"
          :message="celebrationData.message" :stats="celebrationData.stats" :encourage="celebrationData.encourage"
          :button-text="celebrationData.buttonText" @close="handleCelebrationClose" />
      </view>
    </template>
  </page-root>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import CelebrationModal from './components/CelebrationModal.vue'

const router = useRouter()

// Celebration modal state
const showCelebration = ref(false)
const celebrationData = ref({
  icon: 'fas fa-feather-alt',
  title: '觉察已记录',
  message: '每一次书写，都是与内心的对话',
  stats: [
    { value: 8, label: '本周日记' }
  ],
  encourage: '你的觉察力正在成长',
  buttonText: '继续探索'
})

const journalTypes = [
  { name: '觉察日记', iconClass: 'fas fa-feather' },
  { name: '感恩日记', iconClass: 'fas fa-heart' },
  { name: '复盘日记', iconClass: 'fas fa-rotate' },
  { name: '读书笔记', iconClass: 'fas fa-book' }
]

const emotions = [
  { icon: '😊', label: '开心' },
  { icon: '😌', label: '平静' },
  { icon: '😔', label: '低落' },
  { icon: '😰', label: '焦虑' },
  { icon: '😤', label: '烦躁' }
]

const selectedType = ref('觉察日记')
const selectedEmotion = ref('😌')
const content = ref('')
const wordCount = ref(0)
const isPrivate = ref(false)
const showAISuggestion = ref(true)

const availableTags = ['# 课题分离', '# 情绪觉察', '# 工作', '# 家庭', '# 成长']
const selectedTags = ref<string[]>(['# 课题分离'])

const updateWordCount = () => {
  wordCount.value = content.value.length
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const addCustomTag = () => {
  console.log('Add custom tag')
}

const addImage = () => {
  console.log('Add image')
}

const startVoiceInput = () => {
  console.log('Start voice input')
}

const togglePrivacy = () => {
  isPrivate.value = !isPrivate.value
}

const goBack = () => {
  router.back()
}

const publish = () => {
  if (content.value.trim()) {
    console.log('Publishing journal:', {
      type: selectedType.value,
      emotion: selectedEmotion.value,
      content: content.value,
      tags: selectedTags.value,
      isPrivate: isPrivate.value
    })
    // Show celebration modal
    showCelebration.value = true
  }
}

const handleCelebrationClose = () => {
  showCelebration.value = false
  router.push('/journal')
}
</script>

<style scoped>
.write-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 32rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40rpx;
}

.write-header-btn {
  padding: 16rpx 32rpx;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 30rpx;
  cursor: pointer;
}

.write-header-btn.primary {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  color: #1a1a2e;
  border-radius: 40rpx;
  font-weight: 600;
}

.write-header-btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.write-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.journal-type-selector {
  display: flex;
  gap: 16rpx;
  margin-bottom: 40rpx;
  overflow-x: auto;
  padding-bottom: 16rpx;
}

.journal-type-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 32rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 40rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.journal-type-item.active {
  background: rgba(244, 208, 63, 0.15);
  color: var(--accent-gold);
  border-color: rgba(244, 208, 63, 0.3);
}

.journal-type-item text {
  font-size: 28rpx;
}

.emotion-selector {
  margin-bottom: 40rpx;
}

.emotion-selector-label {
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-bottom: 24rpx;
}

.emotion-list {
  display: flex;
  gap: 24rpx;
  justify-content: space-between;
  overflow: auto;
}

.emotion-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  border: 2px solid transparent;
}

.emotion-option.active {
  background: rgba(244, 208, 63, 0.1);
  border-color: var(--accent-gold);
}

.emotion-option .emoji {
  font-size: 56rpx;
}

.emotion-option .label {
  font-size: 22rpx;
  color: var(--text-muted);
}

.emotion-option.active .label {
  color: var(--accent-gold);
}

.prompt-card {
  background: linear-gradient(135deg, rgba(93, 173, 226, 0.1) 0%, rgba(93, 173, 226, 0.05) 100%);
  border-radius: var(--radius-md);
  padding: 32rpx;
  margin-bottom: 40rpx;
  border: 1px solid rgba(93, 173, 226, 0.2);
}

.prompt-card-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.prompt-card-icon {
  width: 48rpx;
  height: 48rpx;
  background: rgba(93, 173, 226, 0.2);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-blue);
  font-size: 24rpx;
}

.prompt-card-title {
  font-size: 26rpx;
  color: var(--accent-blue);
  font-weight: 600;
}

.prompt-card-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.6;
}

.write-area {
  min-height: 400rpx;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 32rpx;
  line-height: 1.8;
  width: 100%;
  resize: none;
  outline: none;
  margin-bottom: 32rpx;
  font-family: inherit;
}

.write-area::placeholder {
  color: var(--text-muted);
}

.tag-input-area {
  margin-bottom: 40rpx;
}

.tag-input-label {
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-bottom: 24rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-item {
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 32rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tag-item.active {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.tag-item.custom {
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.toolbar-left {
  display: flex;
  gap: 32rpx;
}

.toolbar-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 32rpx;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--text-secondary);
}

.toolbar-btn.active {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.word-count {
  font-size: 26rpx;
  color: var(--text-muted);
}

.ai-suggestion {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 144rpx);
  max-width: 321px;
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 32rpx;
  padding: 32rpx;
  border: 1px solid rgba(244, 208, 63, 0.2);
  z-index: 100;
}

.ai-suggestion-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.ai-suggestion-icon {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 28rpx;
}

.ai-suggestion-title {
  font-size: 26rpx;
  color: var(--accent-gold);
  font-weight: 600;
}

.ai-suggestion-close {
  margin-left: auto;
  color: var(--text-muted);
  cursor: pointer;
}

.ai-suggestion-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>