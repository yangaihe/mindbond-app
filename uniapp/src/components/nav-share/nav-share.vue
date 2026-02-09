<template>
  <view class="header flex items-center justify-between">
    <view class="back-button xgn-iconfont xgn-fanhui" @click="goBack()">
    </view>
    <view class="message-icon xgn-iconfont xgn-share-circle"></view>
  </view>
</template>

<script setup lang="ts">
import { goBack } from '@/utils/untool'
</script>

<style scoped lang="scss">
.header {
  padding: 30rpx;
}

.back-button {
  font-size: 40rpx;
}

.back-button text {
  font-size: 40rpx;
  color: #333333;
}

.message-icon {
  font-size: 40rpx;
}
</style>