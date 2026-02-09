<template>
  <view v-if="isLogin && readLessonItem.lessonInfo?.lessonName">
    <view :class="{ fixed, player: true }">
      <view class="player-left">
        <view class="player-img">
          <image :src="readLessonItem.lessonInfo?.imageUrl" mode="aspectFill"></image>
        </view>
        <view class="player-info">
          <view class="player-title">{{readLessonItem.lessonInfo?.lessonName}}</view>
          <view class="player-subtitle">{{readLessonItem.bookInfo?.teacher}}</view>
        </view>
      </view>
      <view class="player-controls">
        <view class="player-cover " @click="togglePlay">
          <view class="play-progress">
            <u-circle-progress
              :percent="readLessonItem.progressPercentage"
              border-width="2"
              active-color="#4173ff"
              bg-color="transparent"
              width="60"
            />
          </view>
          <view class="flex items-center justify-center" style="height: 100%;width: 100%;font-size: 32rpx;">
            <text v-if="readLessonItem.isPlaying" :class="`xgn-iconfont xgn-zanting`" 
            />
            <text v-else :class="`xgn-iconfont xgn-bofang`"></text>
          </view>
        </view>
        <view style="font-size: 32rpx;" @click="toggleBookDir">
          <text class="xgn-iconfont xgn-mulu"></text>
        </view>
      </view>
    </view>
    
    <!-- 引入书籍目录组件 -->
    <bookdir 
      :visible="bookDirVisible" 
      @close="handleBookDirClose"
      @select-chapter="handleChapterSelect"
    />
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
const bookStore = useBookStore()
const { readLessonItem } = storeToRefs(bookStore)
import Bookdir from '../bookdir/bookdir.vue';
import { useUserStore } from '@/stores/user';

const { getUser,isLogin } = useUserStore()

const props = defineProps({
  fixed: {
    type: Boolean,
    default: false
  }
})

// 书籍目录显示状态
const bookDirVisible = ref(false);


// 切换播放/暂停状态
const togglePlay = () => {
  bookStore.togglePlayPause()
};

// 切换书籍目录显示状态
const toggleBookDir = () => {
  console.log('toggleBookDir called, current bookDirVisible:', bookDirVisible.value);
  bookDirVisible.value = !bookDirVisible.value;
};

// 处理书籍目录关闭
const handleBookDirClose = () => {
  console.log('handleBookDirClose called');
  bookDirVisible.value = false;
};

// 处理章节选择
const handleChapterSelect = (data: any) => {
  console.log('handleChapterSelect called, data:', data);
  // 这里可以添加切换到选中章节的逻辑
  bookDirVisible.value = false;
};

// 监听bookDirVisible状态变化进行调试
watch(bookDirVisible, (newVal) => {
  console.log('min-player bookDirVisible changed to:', newVal);
});

// 组件挂载时初始化
onMounted(() => {
  
});

// 组件卸载时清理
onBeforeUnmount(() => {
 
});
</script>

<style lang="scss" scoped>
.fixed {
  position: fixed;
  bottom: 0rpx;
  left: 0;
  right: 0;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}

/* 底部迷你播放器 */
.player {
  height: 120rpx;
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  z-index: 999;
}

.player-left {
  display: flex;
  align-items: center;
  min-width: 0;
}
.player-img{
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
}
.player-img image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 2;
}

.player-cover {  
  position: relative;
  width: 60rpx;  
  height: 60rpx; 
  overflow: hidden;
  position: relative;
}
.play-progress{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}


.player-info {
  min-width: 0;
  margin-left: 20rpx;
  flex: 1 0 0;
}

.player-title {
  font-size: 28rpx;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4rpx;
}

.player-subtitle {
  font-size: 24rpx;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 26rpx;
}

</style>
