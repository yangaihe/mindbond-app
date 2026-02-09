<template>
  <u-popup v-model="commentPopupVisible" mode="bottom" :overlay="true" :close-on-click-overlay="true" @close="handleClose"
    :safe-area-inset-bottom="true" round="16">
    <layout-view v-if="commentPopupVisible" rootStyle="max-height: 80vh; min-height: 50vh;background-color: #fff;">
      <template v-slot:header>
        <!-- 标题区域 -->
        <view class="comment-popup-header">
          <text class="comment-popup-title">用户评论 ({{ commentCount }})</text>
        </view>
      </template>
      <template v-slot:body>
        <scroll-more-list v-model:resObject="listModel" :searchParam="searchParam" :getListFun="getListFun"
          ref="cmmListRef" rootStyle="max-height: 46vh; min-height: 30vh;" class="comment-list"
        >
          <view style="padding: 20rpx 30rpx;">
            <view v-for="(comment, index) in listModel.list" :key="comment.id" class="comment-item">
              <image :src="comment.userAvatar" class="comment-avatar" mode="aspectFill" />
              <view class="comment-content">
                <view class="comment-header">
                  <view>
                    <text class="comment-author">{{ comment.userNickname }}</text>
                    <text class="comment-time">{{ comment.createTime }}</text>
                  </view>
                  <view>
                    <view class="like-btn" @click="likeComment(comment)">
                      <span>{{ comment.likeCount || 0 }}</span>
                      <text :class="`xgn-iconfont xgn-zan ${comment.isLike ? 'liked' : ''}`"></text>
                    </view>
                  </view>
                </view>
                <view class="comment-text">{{ comment.content }}</view>
                <image v-if="comment.image" :src="comment.image" class="cmt-image" mode="aspectFill"
                  @click=""
                ></image>
              </view>
            </view>  
          </view>
          
        </scroll-more-list>

      </template>

      <template v-slot:footer>
        <!-- 底部输入操作区域 - 固定在底部 -->
        <view class="comment-input-wrapper">
          <view class="flex items-center" style="gap: 20rpx;">
            <image :src="userInfo.avatar" class="avatar" mode="aspectFill" />
            <input class="comment-text-input" :placeholder="`${userInfo.nickname || ''}发布评论`" v-model="subParams.text"
              confirm-type="send" @confirm="submitComment" ref="commentInputRef" />
          </view>
          <view class="action-buttons flex items-center justify-between">
            <view v-if="!subParams.photo" class="image-btn flex items-center" @click="selectImage">
              <view class="xgn-iconfont xgn-tupian" style="font-size: 40rpx;"></view>
              <text style="">图片</text>
            </view>
            <image v-else :src="subParams.photo" class="avatar" mode="aspectFill" />
            <button class="send-btn" @click="submitComment" :disabled="!subParams.text.trim()">
              发布
            </button>
          </view>
        </view>
      </template>
    </layout-view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, nextTick, watch } from 'vue';
import * as bookService from "@/api/course"
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/book'
import { uploadImage } from '@/api/app';
import { chooseImage, hideLoading, showLoading, showToast } from '@/utils/untool';
import { LESSON_TARGET_TYPE } from '@/enums/book';

const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore)
const bookStore = useBookStore()
const { readLessonItem } = storeToRefs(bookStore)
const cmmListRef = ref<any>(null);

// 定义组件的属性
const props = defineProps<{
  visible: boolean;
  commentCount: number;
}>();

// 定义组件的事件
const emit = defineEmits<{
  close: [];
  submitComment: [content: string];
  openComment: [];
}>();

// 评论弹窗显示状态
const commentPopupVisible = ref(false);

// 评论内容
const subParams = ref({
  text: '',
  photo: '',
});

// 输入框引用
const commentInputRef = ref(null);

const getListFun = async (params: any = {}) => {
  let extParams = {
    targetId: readLessonItem.value.lessonInfo?.id,
  }
  let resData = { lists: [], count: 0 }
  if(commentPopupVisible.value && extParams.targetId) {
    resData = await await bookService.getBookLessonCommentList({
      ...params, ...extParams,
      targetType: LESSON_TARGET_TYPE,
    })
  }

  return {
    list: resData.lists || [],
    total: resData.count || 0,
  }
}

const searchParam = ref({})

const listModel = ref({
  list: [
  ]
} as any);


watch(() => props.visible, (newVal) => {
  commentPopupVisible.value = newVal;
  // 当弹窗显示时，自动聚焦到输入框
  if (newVal) {
    subParams.value = {
      text: '',
      photo: '',
    };
    // 使用nextTick确保DOM已更新
    nextTick(() => {
      // 使用setTimeout确保在弹窗动画完成后聚焦
      setTimeout(() => {
        if (commentInputRef.value) {
          // 兼容多平台的focus方法调用
          if (uni.createSelectorQuery) {
            const query = uni.createSelectorQuery().in(commentInputRef.value);
            // TODO
            query.select('.comment-text-input').context((res) => {
              if (res.context) {
                res.context.focus();
              }
            }).exec();
          } else if (commentInputRef.value.focus) {
            commentInputRef.value.focus();
          }
        }
      }, 300);
    });
  }
}, { immediate: true });

// 处理弹窗关闭
const handleClose = () => {
  emit('close');
};

// 提交评论
const submitComment = async() => {
  let obj = { ... subParams.value }
  obj.text = obj.text.trim()
  if (obj.text) {
    let params = {
      content: obj.text,
      image: obj.photo,
      targetId: readLessonItem.value.lessonInfo.id, 
      targetType: LESSON_TARGET_TYPE,
      parentId: 0,
    }
    showLoading()
    try {
      let cmtRes = await bookService.addBookLessonComment(params)
      cmmListRef.value.getDataList(true) // 重置第一页数据
      hideLoading()
      setTimeout(()=> {
        emit('submitComment', params);
      }, 500)
    } catch (err) {
      console.error("=====err====", err)
    }
  }
};

// 选择图片（模拟功能）
const selectImage = async() => {
  console.log('selectImage called');
  let chimgRes:any = await chooseImage({})
  let fileBlob = chimgRes.res?.tempFilePaths?.[0]
  showLoading()
  try {
    let upRes:any = await uploadImage(fileBlob)
    uni.hideLoading()
    subParams.value.photo = upRes.path
  } catch (err) {
    console.error("=====err====", err)
    hideLoading()
  }
};

// 点赞评论
const likeComment = async(comment: any) => {
  let params = {
    _showLoading: true,
    operateType: 1, // 点赞
    targetId: comment.id,
    targetType: LESSON_TARGET_TYPE,
  }
  let serviceHandle = bookService.lessonLiked
  if(comment.isLike) {
    serviceHandle = bookService.lessonUnLike
  }
  await serviceHandle(params)
  showToast('操作成功')
  if (comment.isLike) {
    comment.likeCount--;
  } else {
    comment.likeCount++;
  }
  comment.isLike = !comment.isLike;
};
</script>

<style scoped lang="scss">
// 评论弹窗样式
.comment-popup-container {
  
}

// 标题区域样式
.comment-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background-color: #fff;
}

.comment-popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.close-btn {
  font-size: 48rpx;
  color: #999;
  padding: 10rpx;
}

// 评论列表样式
.comment-list {
  flex: 1 0 0;
}

.comment-item {
  display: flex;
  margin-bottom: 30rpx;
}

.comment-avatar {
  width: 70rpx;
  height: 70rpx;
  border-radius: 35rpx;
  background-color: #f0f0f0;
  margin-right: 20rpx;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6rpx;
}

.comment-author {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.comment-time {
  padding-left: 6rpx;
  font-size: 24rpx;
  color: #999;
}

.comment-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10rpx;
}
.cmt-image{
  border-radius: 10rpx;
  height: 200rpx;
  width: 200rpx;
}

.like-btn {
  font-size: 30rpx;
  color: #999;
  display: flex;
  align-items: center;
  gap: 5rpx;
}
.xgn-zan{
  font-size: 34rpx;
  &.liked {
    color: $u-type-primary;
  }
}

// 底部输入区域样式
.comment-input-wrapper {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  box-sizing: border-box;
}

.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 100%;
}

.comment-text-input {
  flex: 1;
  height: auto;
  background-color: #f5f5f5;
  border-radius: 34rpx;
  padding: 22rpx 30rpx;
  font-size: 28rpx;
  color: #333;
}

.action-buttons {
  margin-top: 10rpx;
  gap: 20rpx;
}

.image-btn {
  font-size: 28rpx;
  color: #666;
  gap: 10rpx;
}

.send-btn {
  height: 68rpx;
  line-height: 68rpx;
  padding: 0 30rpx;
  margin: 0;
  background-color: #1989fa;
  color: #fff;
  border: none;
  border-radius: 34rpx;
  font-size: 28rpx;
  min-width: 120rpx;
}

.send-btn:disabled {
  background-color: #ccc;
}

</style>