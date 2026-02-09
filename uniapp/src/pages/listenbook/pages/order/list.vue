<template>
  <page-root
    @scrolltolower="handleScrollBottom"
  >
    <template v-slot:header>
      
    </template>
    <template v-slot:body>
      <scroll-more-list v-model:resObject="mdListModel"
        :searchParam="searchParam" :getListFun="getListFun"
        ref="mdListRef"
      >
        <view class="order-list-container">
          <!-- 订单列表 -->
          <view class="order-item" v-for="(order, index) in mdListModel.list" :key="index">
            <!-- 订单头部 -->
            <view class="order-header flex items-center justify-between">
              <view class="order-title flex items-center">
                <view class="order-icon xgn-iconfont xgn-order"></view>
                <text class="order-name">{{ order.productName }}</text>
              </view>
              <view class="order-status">{{ statusMap[order.status] }}</view>
            </view>

            <!-- 订单详情 -->
            <view class="order-details">
              <!-- 始终显示的字段 -->
              <view class="detail-item">
                <text class="detail-label">订单金额</text>
                <text class="detail-value">{{ order.payAmount }}</text>
              </view>

              <!-- 展开/收起控制的字段 -->
              <view v-if="expandedOrders[index]">
                <view class="detail-item">
                  <text class="detail-label">权益类型</text>
                  <text class="detail-value">{{ order.courseName }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">天数</text>
                  <text class="detail-value">{{ order._days }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">交易方式</text>
                  <text class="detail-value">{{ payTypeMap[order.payType] }}</text>
                </view>
              </view>

              <view class="detail-item">
                <text class="detail-label">交易时间</text>
                <text class="detail-value">{{ order.createTime }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">订单编号</text>
                <view class="order-number-container">
                  <text class="order-number">{{ order.orderNo }}</text>
                  <text class="copy-button" @click="copyOrderNumber(order.orderNo)">复制</text>
                </view>
              </view>

            </view>

            <!-- 展开/收起按钮 -->
            <view class="expand-button" @click="toggleExpand(index)">
              <view class="expand-text flex items-center">
                {{ expandedOrders[index] ? '收起' : '展开全部' }}
                <text
                  :class="`expand-icon xgn-iconfont ${expandedOrders[index] ? 'xgn-arrow-up-bold' : 'xgn-arrow-down'}`"></text>
              </view>
            </view>
          </view>
        </view>
      </scroll-more-list>
      
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as bookService from '@/api/course'
import { setClipboardData } from '@/utils/untool';
import { formatDayDiff } from '@/utils/util';
const statusMap:any = {
  0: '待支付',
  1: '已支付',
  2: '已取消',
  3: '已过期',
  4: '已退款',
}

const payTypeMap:any = {
  0: '免费领取',
  1: '余额支付',
  2: '微信支付',
  3: '支付宝支付',
  4: '兑换券',
}

const searchParam = ref({

})

const mdListModel = ref({
  list: [
  ]
} as any);

const getListFun = async (params: any) => {
  const res = await bookService.getOrderList({
    ...params
  })
  let list = res.lists || []
  list.map((item: any) => {
    item._days = formatDayDiff(item.end_time, item.start_time)
  })
  return {
    list,
    total: res.count,
  }
}

// 展开状态，默认展开第一个
const expandedOrders = ref<boolean[]>([true]);


// 切换展开/收起状态
const toggleExpand = (index: number) => {
  expandedOrders.value[index] = !expandedOrders.value[index];
};

const handleScrollBottom = (e:any)=> {
  
}

// 复制订单号
const copyOrderNumber = (orderNumber: string) => {
  setClipboardData(orderNumber)
};
</script>

<style scoped lang="scss">
.order-list-container{
  padding: 30rpx 30rpx 0 30rpx;
}

// 订单项
.order-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

// 订单头部
.order-header {
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-title {
  flex: 1;
}

.order-icon {
  width: 52rpx;
  height: 52rpx;
  font-size: 38rpx;
  margin-right: 16rpx;
  color: $u-type-bkprimary;
}

.order-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.order-status {
  font-size: 28rpx;
  color: $u-type-bkprimary;
}

// 订单详情
.order-details {
  padding: 20rpx 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
}

.detail-label {
  font-size: 28rpx;
  color: #666;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
  text-align: right;
}

.order-number-container {
  display: flex;
  align-items: center;
}

.order-number {
  font-size: 28rpx;
  color: #333;
  margin-right: 16rpx;
  word-break: break-all;
}

.copy-button {
  font-size: 28rpx;
  color: $u-type-primary;
}

// 展开/收起按钮
.expand-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.expand-text {
  font-size: 28rpx;
  color: #666;
}

.expand-icon {
  margin-left: 8rpx;
}
</style>