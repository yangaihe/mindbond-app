<template>
  <Teleport to="body">
    <Transition name="celebration">
      <view v-if="visible" class="celebration-overlay" @click="close">
        <view class="celebration-modal" @click.stop>
          <view class="confetti-container">
            <view v-for="i in 20" :key="i" class="confetti" :style="getConfettiStyle(i)"></view>
          </view>

          <view class="celebration-icon">
            <view :class="icon"></view>
          </view>

          <view class="celebration-title">{{ title }}</view>
          <view class="celebration-message">{{ message }}</view>

          <view v-if="stats" class="celebration-stats">
            <view v-for="stat in stats" :key="stat.label" class="celebration-stat">
              <view class="stat-value">{{ stat.value }}</view>
              <view class="stat-label">{{ stat.label }}</view>
            </view>
          </view>

          <view class="celebration-encourage">{{ encourage }}</view>

          <view class="celebration-btn" @click="close">
            {{ buttonText }}
          </view>
        </view>
      </view>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Stat {
  value: string | number
  label: string
}

interface Props {
  visible: boolean
  icon?: string
  title: string
  message: string
  stats?: Stat[]
  encourage?: string
  buttonText?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'fas fa-star',
  encourage: '继续保持，你做得很棒！',
  buttonText: '太棒了'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}

const getConfettiStyle = (index: number) => {
  const colors = ['#f4d03f', '#f39c12', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71']
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 2
  const color = colors[index % colors.length]

  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    backgroundColor: color
  }
}
</script>

<style scoped>
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 40rpx;
}

.celebration-modal {
  position: relative;
  width: 100%;
  max-width: 640rpx;
  background: linear-gradient(180deg, #2a2a4a 0%, #1a1a2e 100%);
  border-radius: 48rpx;
  padding: 80rpx 48rpx 64rpx;
  text-align: center;
  overflow: hidden;
  border: 2rpx solid rgba(244, 208, 63, 0.3);
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.confetti {
  position: absolute;
  top: -20rpx;
  width: 20rpx;
  height: 20rpx;
  border-radius: 4rpx;
  animation: confetti-fall linear infinite;
  opacity: 0.8;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-20rpx) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(800rpx) rotate(720deg);
    opacity: 0;
  }
}

.celebration-icon {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40rpx;
  font-size: 72rpx;
  color: #1a1a2e;
  animation: icon-bounce 0.6s ease-out;
}

@keyframes icon-bounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.celebration-title {
  font-size: 48rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 16rpx;
}

.celebration-message {
  font-size: 30rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 40rpx;
}

.celebration-stats {
  display: flex;
  justify-content: center;
  gap: 64rpx;
  margin-bottom: 40rpx;
  padding: 32rpx;
  background: rgba(255, 255,255, 0.05);
  border-radius: 24rpx;
}

.celebration-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 56rpx;
  font-weight: 700;
  color: var(--accent-gold);
}

.stat-label {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-top: 8rpx;
}

.celebration-encourage {
  font-size: 28rpx;
  color: var(--accent-gold);
  margin-bottom: 48rpx;
  font-style: italic;
}

.celebration-btn {
  width: 100%;
  padding: 32rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border: none;
  border-radius: 32rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  transition: transform 0.2s;
}

.celebration-btn:hover {
  transform: scale(1.02);
}

.celebration-enter-active,
.celebration-leave-active {
  transition: all 0.3s ease;
}

.celebration-enter-from,
.celebration-leave-to {
  opacity: 0;
}

.celebration-enter-from .celebration-modal,
.celebration-leave-to .celebration-modal {
  transform: scale(0.9);
}
</style>
