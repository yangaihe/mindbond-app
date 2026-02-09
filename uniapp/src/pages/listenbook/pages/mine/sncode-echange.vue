<template>
  <page-root>
    <template v-slot:header>
    </template>
    <template v-slot:body>
      <!-- 主要内容区域 -->
      <view class="content">
        <!-- 输入框 -->
        <view class="input-wrapper">
          <input
            type="text"
            class="code-input"
            v-model="codeValue"
            placeholder="请输入码值"
            placeholder-class="placeholder"
          />
        </view>

        <!-- 兑换按钮 -->
        <button class="exchange-btn" @click="handleExchange">兑换</button>

        <!-- 兑换规则说明 -->
        <view class="rules-section">
          <view class="rules-title">兑换规则说明</view>
          <view class="rules-content">
            <view class="rule-item">1.请输入您收到的数字及字母组合的兑换码，并确认兑换账号是否为本人常用账号。兑换账号为您目前正在登录使用的微信账号。</view>
            <view class="rule-item">2.输入兑换码时，请注意兑换码前后是否有空格，如有空格将会导致兑换码无法兑换。</view>
            <view class="rule-item">3.兑换码一经兑换成功，不支持撤回和更换账号兑换。</view>
            <view class="rule-item">4.每个兑换码均有有效时限，请您在有效期内兑换使用；如您未能在有效期内兑换使用的，兑换码将会失效，届时相应损失需由您自行承担。</view>
            <view class="rule-item">5.如遇兑换问题，可进入[心光年APP-我的-联系客服]页面，联系客服反馈问题。</view>
          </view>
        </view>
      </view>
    </template>
  </page-root>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showToast } from '@/utils/untool';
import * as bookService from '@/api/course'

const codeValue = ref('');

// 处理兑换
const handleExchange = async () => {
  if (!codeValue.value.trim()) {
    showToast('请输入兑换码')
    return;
  }
  // 这里可以添加兑换的API调用逻辑
  await bookService.redeemCourseVoucher({
    _showLoading: true,
    code: codeValue.value,
  })
  codeValue.value = ''
  showToast('兑换成功')
};
</script>

<style lang="scss" scoped>

.content {
  padding: 50rpx 30rpx;

  .input-wrapper {
    margin-bottom: 50rpx;

    .code-input {
      width: 100%;
      height: 90rpx;
      padding: 0 30rpx;
      border: 1rpx solid #e0e0e0;
      border-radius: 12rpx;
      font-size: 32rpx;
      color: #333;
      background-color: #fafafa;
      box-sizing: border-box;

      &::placeholder {
        color: #999;
      }
    }
  }

  .exchange-btn {
    width: 100%;
    height: 86rpx;
    line-height: 86rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
    background-color: $u-type-bkprimary;
    border-radius: 50rpx;
    margin-bottom: 60rpx;
  }

  .rules-section {
    .rules-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 24rpx;
    }

    .rules-content {
      .rule-item {
        font-size: 28rpx;
        line-height: 1.8;
        color: #666;
        margin-bottom: 20rpx;
        padding-left: 10rpx;
      }
    }
  }
}
</style>