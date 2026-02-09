<template>
  <view class="content-item" @click="handleClick">
    <image  :src="data.coverImg" class="content-image" mode="aspectFill"></image>
    <view class="content-info">
      <view class="content-title">{{data.courseName}}</view>
      <view class="content-desc text-clamp-2">
		    <!-- <rich-text :nodes="data.courseDesc"></rich-text> -->
        {{data.teacherDesc}}
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { goto, allRoutePathMaps } from '@/utils/untool'
const props = defineProps({
  data: {
    type: Object,
    default: {

    }
  },
  // 点击事件
  noClick: {
    type: Boolean,
    default: false
  }
})
const handleClick = () => {
  if(!props.noClick) {
    goto(`${allRoutePathMaps.listenbook.playerIndex}?bookId=${props.data.id}`)
  }
}
</script>

<style lang="scss" scoped>
.content-item {
  display: flex;
  align-items: flex-start;
}

.content-image {
  width: 120rpx;
  height: 160rpx;
  border-radius: 10rpx;
}

.content-info {
  margin-left: 30rpx;
  flex: 1;
}

.content-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.content-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 36rpx;
  
}
</style>
