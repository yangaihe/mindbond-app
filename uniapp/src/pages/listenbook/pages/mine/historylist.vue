<template>
  <page-root>
    <template v-slot:header>
    </template>
    <template v-slot:body>
      <!-- 历史记录列表 -->
      <view class="history-list">
        <scroll-more-list v-model:resObject="historyListModel"
          :searchParam="searchParam" :getListFun="getListFun"
        >
          <view 
            class="history-item" 
            v-for="(item, index) in historyListModel.list" 
            :key="item.id"
            @click="toItemDetail(item)"
          >
            <!-- 左侧图片 -->
            <view class="book-cover">
              <image :src="item.lessonImage" mode="aspectFill"></image>
            </view>
            
            <!-- 中间信息 -->
            <view class="book-info">
              <view class="book-title">{{ item.courseName }}</view>
              <view class="book-subtitle">{{ item.lessonName }}</view>
              <view class="book-meta">
                <view class="play-time">{{ formatTime(item.lessonDuration) }}</view>
                <view class="progress-text">已学{{ item._learnPercent }}%</view>
              </view>
            </view>
          
          </view>
        </scroll-more-list>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as bookService from '@/api/course'
import { formatTime } from '@/utils/util'
import { allRoutePathMaps, goto } from '@/utils/untool';

const searchParam = ref({

})

// 模拟历史记录数据
const historyListModel = ref({
  list: [
  ]
} as any);

const getListFun = async (params: any) => {
  const res = await bookService.getBookLessonStudyHistoryList({
    ...params
  })
  let list = (res.lists || []).map((item:any) => ({
    ...item,
    _learnPercent: Math.round((item.progress/item.lessonDuration)*100),
  }))
  return {
    list,
    total: res.count,
  }
}




// 播放点击的项目
const toItemDetail = (item: any) => {
  goto(`${allRoutePathMaps.listenbook.playerIndex}?bookId=${item.courseId}&lessonId=${item.lessonId}`)
};

onMounted(() => {
  // 组件挂载后可以添加加载数据的逻辑
});
</script>

<style scoped lang="scss">


/* 历史列表样式 */
.history-list {
  height: 100%;
  padding: 30rpx;
}

.history-item {
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #ffffff;
  transition: background-color 0.2s;
  &:last-child{
    margin-bottom: 0;
  }
}

.history-item:active {
  background-color: #f8f8f8;
}

.book-cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #f0f0f0;
  flex-shrink: 0;
}

.book-cover image {
  width: 100%;
  height: 100%;
}

.book-info {
  flex: 1;
  min-width: 0;
  margin-left: 24rpx;
  margin-right: 24rpx;
}

.book-title {
  font-size: 32rpx;
  color: #333333;
  margin-bottom: 8rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-subtitle {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 8rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-meta {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.play-time {
  font-size: 24rpx;
  color: #999999;
}

.progress-text {
  font-size: 24rpx;
  color: #ff8c00;
}



.play-icon text {
  font-size: 32rpx;
  color: #333333;
  transform: translateX(2rpx);
}
</style>