<template>
  <view class="container">
    <!-- 顶部导航 -->
    <uni-nav-bar
      :fixed="true"
      :status-bar="true"
      :border="false"
      title="幸运抽奖"
      :color="'#fff'"
      :background-color="'transparent'"
      left-icon="back"
      right-icon="help"
      @clickLeft="goBack"
      @clickRight="showRule"
    />

    <!-- 奖品展示区 -->
    <view class="prize-grid">
      <view v-for="(item, index) in prizes" :key="index" 
            :class="['prize-item', {'active': currentIndex === index}]">
        <image class="prize-img" :src="item.image" mode="aspectFit"/>
        <text class="prize-name">{{item.name}}</text>
      </view>
      <view class="draw-btn" @click="startDraw">
        <text>开始抽奖</text>
      </view>
    </view>

    <!-- 规则说明 -->
    <view class="rule-section">
      <view class="rule-item">
        <uni-icons type="calendar" size="20" color="#4A90E2"/>
        <text class="rule-text">活动时间：不限</text>
      </view>
      <view class="rule-item">
        <uni-icons type="info" size="20" color="#4A90E2"/>
        <text class="rule-text">每天有3次抽奖机会</text>
      </view>
      <view class="rule-item">
        <uni-icons type="star" size="20" color="#4A90E2"/>
        <text class="rule-text">中奖后奖品立即到账生效</text>
      </view>
    </view>

    <!-- 中奖弹窗 -->
    <uni-popup ref="popup" type="center">
      <view class="popup-content">
        <uni-icons class="close-icon" type="close" size="24" color="#999" @click="closePopup"/>
        <text class="congrats">恭喜您中奖啦！</text>
        <image class="win-prize-img" :src="winPrize.image" mode="aspectFit"/>
        <text class="win-prize-name">{{winPrize.name}}</text>
        <view class="confirm-btn" @click="closePopup">
          <text>确认领取</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { userLuckyDraw, getModelList } from '../utils/api.js';

const popup = ref();
const currentIndex = ref(-1);
const timer = ref<NodeJS.Timeout | null>(null);
const winPrize = ref({ name: '', image: '' });
const remainingChances = ref(2);
const prizes = ref([]);

// 获取奖品数据
const fetchPrizeData = async () => {
  try {
    const modelData = await getModelList();
    if (modelData && Array.isArray(modelData.choujiang) && modelData.choujiang.length > 0) {
      prizes.value = modelData.choujiang;
    } else {
      console.warn('未获取到有效的奖品数据');
      prizes.value = [];
    }
  } catch (error) {
    console.error('获取奖品数据失败:', error);
    prizes.value = [];
  }
};

const goBack = () => {
  uni.navigateBack();
};

const showRule = () => {
  uni.showToast({
    title: '查看规则',
    icon: 'none'
  });
};

const startDraw = async () => {
  if (timer.value !== null || remainingChances.value <= 0) return;
  
  let count = 0;
  timer.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % prizes.value.length;
    count++;
  }, 100);

  try {
    // 调用抽奖接口
    const result = await userLuckyDraw();
    
    if (result.success) {
      const msg = result.msg;
      
      // 等待动画完成后显示结果
      setTimeout(() => {
        clearInterval(timer.value as unknown as number);
        timer.value = null;
        
        // 在prizes数组中查找与msg匹配的奖品
        const matchedPrize = prizes.value.find(prize => prize.name === msg) || 
          (msg === '0' || msg.includes('未中奖') ? 
            prizes.value.find(prize => prize.name === '谢谢参与') : null);
        
        winPrize.value = matchedPrize ? 
          { name: matchedPrize.name, image: matchedPrize.image } : 
          { name: msg, image: prizes.value[0].image }; // 如果没找到匹配的奖品，使用默认图片
        
        popup.value.open();
        remainingChances.value--;
      }, 2000);
    } else {
      clearInterval(timer.value as unknown as number);
      timer.value = null;
      uni.showToast({
        title: result.msg,
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('抽奖过程出错:', error);
    clearInterval(timer.value as unknown as number);
    timer.value = null;
    uni.showToast({
      title: '抽奖失败，请稍后再试',
      icon: 'none'
    });
  }
};

const closePopup = () => {
  popup.value.close();
};

// 组件创建时获取奖品数据
onMounted(() => {
  fetchPrizeData();
});
</script>

<style>
page {
  height: 100%;
}

.container {
  height: 100%;
  background: linear-gradient(135deg, #55aaff 0%, #00d9d9 100%);
  padding: 0 30rpx;
}



.prize-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 40rpx;
}

.prize-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;
}

.prize-item.active {
  transform: scale(0.95);
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
}

.prize-img {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 10rpx;
}

.prize-name {
  font-size: 14px;
  color: #333;
}

.draw-btn {
  background: #FF4B4B;
  border-radius: 16rpx;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 2;
  grid-row: 2;
}

.draw-btn text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.rule-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 30rpx;
}

.rule-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-text {
  margin-left: 10rpx;
  font-size: 14px;
  color: #666;
}

.popup-content {
  background: #fff;
  border-radius: 20rpx;
  width: 560rpx;
  padding: 40rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-icon {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
}

.congrats {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  margin-bottom: 30rpx;
}

.win-prize-img {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.win-prize-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 30rpx;
}

.confirm-btn {
  background: #4A90E2;
  border-radius: 100rpx;
  width: 400rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn text {
  color: #fff;
  font-size: 16px;
}
</style>


