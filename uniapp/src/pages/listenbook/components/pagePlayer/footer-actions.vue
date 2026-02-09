<template>
  <view class="footer">
    <view class="footer-actions">
      <view class="action-item">
        <image :src="userInfo.avatar" class="userimg" mode="aspectFill"/>
      </view>
      <view class="comment-input" @click="toggleCommentPopup">
        <text>{{userInfo.nickname}}发布评论</text>
      </view>
      <view class="action-item" @click="toggleCommentPopup">
        <text class="xgn-iconfont xgn-xiaoxi"></text>
        <text class="action-msg">{{ commentCount }}</text>
      </view>
      <view class="action-item" @click="toggleBookDir">
        <text class="xgn-iconfont xgn-mulu"></text>
        <text>目录</text>
      </view>
    </view>
    
    <!-- 引入评论弹窗组件 -->
    <comment-popup
      :visible="commentPopupVisible"
      :comment-count="commentCount"
      @close="handleCommentPopupClose"
      @submit-comment="handleCommentSubmit"
    />
    
    <!-- 引入书籍目录组件 -->
    <bookdir 
      :visible="bookDirVisible" 
      @close="handleBookDirClose"
      @select-chapter="handleChapterSelect"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Bookdir from '@/pages/listenbook/components/bookdir/bookdir.vue';
import CommentPopup from '@/pages/listenbook/components/comment-popup/comment-popup.vue';
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/book'
const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore)
const bookStore = useBookStore()
const { readLessonItem } = storeToRefs(bookStore)

// 定义组件的属性
const props = defineProps<{
  commentCount: number;
}>();

// 定义组件的事件
const emit = defineEmits<{
  like: [];
  openComment: [];
  showComments: [];
  showCatalog: [];
  submitComment: [content: string];
}>();

// 书籍目录显示状态
const bookDirVisible = ref(false);

// 评论弹窗显示状态
const commentPopupVisible = ref(false);

// 切换书籍目录显示状态
const toggleBookDir = () => {
  console.log('toggleBookDir called, current bookDirVisible:', bookDirVisible.value);
  bookDirVisible.value = !bookDirVisible.value;
  console.log('toggleBookDir after change, bookDirVisible:', bookDirVisible.value);
  // 同时触发showCatalog事件，保持原有的事件接口
  emit('showCatalog');
};

// 切换评论弹窗显示状态
const toggleCommentPopup = () => {
  console.log('toggleCommentPopup called');
  commentPopupVisible.value = true;
  // 同时触发openComment事件，保持原有的事件接口
  emit('openComment');
};

// 处理评论弹窗关闭
const handleCommentPopupClose = () => {
  console.log('handleCommentPopupClose called');
  commentPopupVisible.value = false;
};

// 处理评论提交
const handleCommentSubmit = (content: string) => {
  console.log('handleCommentSubmit called, content:', content);
  emit('submitComment', content);
  // 关闭弹窗
  // commentPopupVisible.value = false;
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
</script>


<style scoped lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 20rpx 40rpx;
  border-top: 1rpx solid #f0f0f0;
  z-index: 100;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.action-item {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6rpx;
  font-size: 22rpx;
  color: #999999;
}
.userimg{
  width: 60rpx;
  height: 60rpx;
  border-radius: 100%;
}

.xgn-xiaoxi {
  font-size: 40rpx;
}

.action-msg {
  position: relative;
  height: 30rpx;
  top: -12rpx;
}
.xgn-mulu{
 font-size: 26rpx;
}

.comment-input {
  flex: 1 0 0;
  background-color: #f5f5f5;
  padding: 22rpx 30rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #999999;
}
</style>