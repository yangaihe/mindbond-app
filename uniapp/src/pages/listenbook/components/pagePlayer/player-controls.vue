<template>
  <view class="player-controls">
    <!-- 进度条 - 使用u-slider组件 -->
    <view class="progress-section">
     
      <view class="progress-bar">
        <view class="time" @click="seekBack">
          <view class="time-icon xgn-iconfont xgn-kuaitui"></view>
          <view class="time-op-text">-15</view>
        </view>
        <view style="flex: 1 0 0;">
          <u-slider
            v-model="readLessonItem.progressPercentage"
            :activeColor="'#ff6b00'"
            :inactiveColor="'#e0e0e0'"
            :blockColor="'#ff6b00'"
            :block-size="20"
            :height="6"
            :disabled="false"
            @end="onSliderChange"
          />
          <view class="time-control">
            <view class="current-time">{{ formatTime(readLessonItem.currentTime || 0) }}</view>
            <view class="duration">{{ formatTime(readLessonItem.totalDuration || 0) }}</view>
          </view>
        </view>
        <view class="time" @click="seekForward">
          <view class="time-icon xgn-iconfont xgn-kuaijin"></view>
          <view class="time-op-text">+15</view>
        </view>
      </view>
    </view>

    <!-- 播放控制 -->
    <view class="control-section">
      <view class="playback-speed" @click="showSpeedOptions">
        {{ formatOptionsLabel(speedOptions, readLessonItem.speed) || '1.0X' }}
      </view>
      <view class="controls">
        <view :class="`control-button previous xgn-iconfont xgn-fanye-left ${currentAudioIndex==0 ? 'disabled' : ''}`" @click="playPrevious">
        </view>
        <view class="control-button play" @click="togglePlayPause">
          <text v-if="readLessonItem.isPlaying" class="xgn-iconfont xgn-zanting" style="font-size: 60rpx;"></text>
          <text v-else class="xgn-iconfont xgn-bofang" style="font-size: 60rpx;"></text>
        </view>
        <view :class="`control-button next xgn-iconfont xgn-fanye-right ${!(hasNext && canPlayNext) ? 'disabled' : ''}`" @click="playNext">
        </view>
      </view>
      <view class="sleep-timer xgn-iconfont xgn-naozhong" @click="showTimerOptions">
        <view v-if="(readLessonItem.noticeTime || 0) > 0" class="sleep-timer-text">
          {{ formatTime(readLessonItem.noticeLeftTime || 0) }}
        </view>
      </view>
    </view>

    <!-- 节目信息 -->
    <view class="program-info">
      <view class="program-title">{{ readLessonItem.lessonInfo?.lessonName }}</view>
      <view class="program-author">{{ readLessonItem.bookInfo?.teacher }}</view>
    </view>
    
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import { formatTime } from '@/utils/util'
import { checkLessonCanPaly } from '@/utils/book';
const bookStore = useBookStore()
const { readLessonItem } = storeToRefs(bookStore)

// 定义组件的属性
const props = defineProps<{
  playList?: Array<{
    resourceUrl: string
    duration: number
    id: string
    isFree: number // 0 免费 1 付费
  }>
}>();

// 定义组件的事件
const emit = defineEmits<{
  // testa: [];
}>();

const speedOptions = ref([
  { text: '0.5x', value: 0.5 },
  { text: '0.75x', value: 0.75 },
  { text: '1.0x', value: 1.0 },
  { text: '1.25x', value: 1.25 },
  { text: '1.5x', value: 1.5 },
  { text: '2.0x', value: 2.0 }
]);
const timerOptions = ref([
  { text: '不开启', value: 0 },
  { text: '10分钟', value: 10 },
  { text: '20分钟', value: 20 },
  { text: '30分钟', value: 30 },
  { text: '60分钟', value: 60 }
]);

const currentAudioIndex = computed(() => {
  return props.playList?.findIndex(item => item.id == readLessonItem.value.lessonInfo?.id) || 0
})

const hasNext = computed(() => {
  return currentAudioIndex.value < (props.playList?.length || 0) - 1
})

const canPlayNext = computed(() => {
  let bl = false
  let nextItem = props.playList?.[currentAudioIndex.value + 1] || {} as any
  bl = checkLessonCanPaly(readLessonItem.value.bookInfo, nextItem)
  return bl
})


// 格式化时间
const formatOptionsLabel= (options:any[], value:any): string => {
  const option = options.find(item => item.value == value)
  return option?.text || ''
};

// 播放/暂停控制
const togglePlayPause = () => {
  bookStore.togglePlayPause()
};

// 快退15秒
const seekBack = () => {
  const currentTime = readLessonItem.value.currentTime || 0;
  bookStore.seek(Math.max(0, currentTime - 15));
};

// 快进15秒
const seekForward = () => {
  const currentTime = readLessonItem.value.currentTime || 0;
  const totalDuration = readLessonItem.value.totalDuration || 0;
  bookStore.seek(Math.min(totalDuration, currentTime + 15));
};

// 切换上一个音频
const playPrevious = () => {
  bookStore.play(props?.playList?.[currentAudioIndex.value - 1])
};

// 切换下一个音频
const playNext = () => {
  bookStore.play(props?.playList?.[currentAudioIndex.value + 1])
};


// 显示倍速设置
const showSpeedOptions = () => {
  uni.showActionSheet({
    itemList: speedOptions.value.map(option => option.text),
    success: (res) => {
      if (res.tapIndex !== undefined) {
        const val = speedOptions.value[res.tapIndex].value;
        bookStore.setPlaybackRate(val);
      }
    }
  });
};

const showTimerOptions = ()=> {
  uni.showActionSheet({
    itemList: timerOptions.value.map(option => option.text),
    success: (res) => {
      if (res.tapIndex !== undefined) {
        const val = timerOptions.value[res.tapIndex].value;
        bookStore.setKockTime(val)
      }
    }
  });
}

// u-slider滑动结束事件处理
const onSliderChange = () => {
  let value = readLessonItem.value.progressPercentage || 0
  const totalDuration = readLessonItem.value.totalDuration || 0;
  if (totalDuration > 0) {
    // 计算跳转位置并执行跳转
    const seekTime = (value / 100) * totalDuration;
    bookStore.seek(seekTime);
  }
};

// 组件挂载
onMounted(() => {
  
  
});
</script>

<style scoped lang="scss">
.player-controls {
  padding: 0 40rpx;
}

.progress-section {
  margin-bottom: 20rpx;
}

.time-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}

.time {
  position: relative;
  font-size: 24rpx;
  color: #999999;
}
.time-icon{
  font-size: 70rpx;
}
.time-op-text{
  height: 30rpx;
  line-height: 30rpx;
  width: 30rpx;
  text-align: center;
  position: absolute;
  left: 50%;
  margin-left: -15rpx;
  top: 50%;
  margin-top: -15rpx;
}
.current-time,
.duration {
  font-size: 24rpx;
  color: #666666;
}

.progress-bar {
  margin-top: 10rpx;
  display: flex;
  gap: 20rpx;
  align-items: center;
  justify-content: space-between;
}

/* u-slider组件已包含进度条样式，无需额外自定义 */

.control-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60rpx;
}

.playback-speed,.sleep-timer {
  position: relative;
  width: 150rpx;
  text-align: center;
  font-size: 32rpx;
  color: #666666;
  font-weight: 600;
}
.sleep-timer-text{
  width: 120rpx;
  font-size: 24rpx;
  position: absolute;
  left: 50%;
  margin-left: -60rpx;
  top: 100%;
  color: #ff6b00;
  white-space: nowrap;
  text-align: center;
}
.sleep-timer {
  font-size: 44rpx;
}

.controls {
  display: flex;
  align-items: center;
  gap: 60rpx;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
}
.disabled{
  pointer-events: none;
  opacity: 0.5;
}

.previous,
.next {
  color: #ff6b00;
  font-size: 52rpx;
}

.play {
  width: 120rpx;
  height: 120rpx;
  background-color: #ff6b00;
  border-radius: 60rpx;
  color: #ffffff;
  box-shadow: 0 6rpx 20rpx rgba(255, 107, 0, 0.3);
}

.program-info {
  margin-bottom: 40rpx;
}

.program-title {
  font-size: 36rpx;
  color: #333333;
  margin-bottom: 10rpx;
  text-align: center;
}

.program-author {
  font-size: 28rpx;
  color: #666666;
  text-align: center;
}
</style>