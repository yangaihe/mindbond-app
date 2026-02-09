<template>
  <uni-popup ref="popup" type="center" :mask-click="false">
    <view class="daily-checkin-container">
      <view class="checkin-card" :class="{ 'card-rotate': showRotateAnimation }">
        <view class="card-front">
          <view class="card-header">
          
          </view>
          <view class="card-content">
            <view class="points-circle">
              <text class="points-value">+{{points}}</text>
              <text class="points-label">积分</text>
            </view>
            <view class="checkin-message">
              <text class="message-title">签到成功</text>
              <text class="message-subtitle">继续保持每日签到，赢取更多积分！</text>
            </view>
            <button class="confirm-btn" @click="handleCheckin">领取奖励</button>
          </view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'DailyCheckinPopup',
  props: {
    points: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showRotateAnimation: false
    }
  },
  methods: {
    show() {
      this.$refs.popup.open('center')
      // 重置动画状态
      this.showRotateAnimation = false
      // 延迟执行动画，确保弹窗完全打开
      setTimeout(() => {
        this.showRotateAnimation = true
      }, 100)
    },
    closePopup() {
      this.showRotateAnimation = false
      setTimeout(() => {
        this.$refs.popup.close('center')
      }, 300)
    },
    handleCheckin() {
      this.$emit('update:points', this.points)
      this.closePopup()
    }
  }
}
</script>

<style lang="scss">
.daily-checkin-container {
  width: 80vw;
  max-width: 320px;
  padding: 20px;
  perspective: 1000px;
  
  .checkin-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8));
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    overflow: hidden;
    transform-style: preserve-3d;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotateY(360deg) scale(0.8);
    opacity: 0;
    width: 100%;
    aspect-ratio: 1/1; /* 确保卡片是正方形 */
    
    &.card-rotate {
      transform: rotateY(0) scale(1);
      opacity: 1;
    }
  }
  
  .card-front {
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
  
  .points-circle {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background: linear-gradient(135deg, #4e6ef2, #6c8cff);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(78,110,242,0.3);
    
    .points-value {
      font-size: 32px;
      font-weight: bold;
      color: #fff;
    }
    
    .points-label {
      font-size: 14px;
      color: rgba(255,255,255,0.9);
      margin-top: 4px;
    }
  }
  
  .checkin-message {
    text-align: center;
    margin-bottom: 20px;
    
    .message-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      display: block;
    }
    
    .message-subtitle {
      font-size: 14px;
      color: #666;
      display: block;
    }
  }
  
  .confirm-btn {
    background: linear-gradient(135deg, #4e6ef2, #6c8cff);
    color: #fff;
    border: none;
    border-radius: 25px;
    padding: 12px 36px;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 4px 16px rgba(78,110,242,0.3);
    transition: all 0.3s ease;
    
    &:active {
      transform: translateY(2px);
      box-shadow: 0 2px 8px rgba(78,110,242,0.3);
    }
  }
}
</style>