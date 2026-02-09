<template>
  <view class="player-container">
    <page-root :headOpt="{position: 'fixed', hideNavbar: true, backgroundColor: '' }">
      <template v-slot:header>
        <!-- 顶部导航 -->
        <nav-share></nav-share>
      </template>
      <template v-slot:body>
        <!-- 书籍封面 -->
        <view class="cover-section">
          <view class="book-cover">
            <image :src="readLessonItem.lessonInfo?.imageUrl" mode="aspectFill"></image>
          </view>
        </view>

        <!-- 播放器控制组件 -->
        <player-controls :playList="alllesson" />

        <!-- 节目文稿 -->
        <view class="script-section">
          <view class="section-header">
            <text class="section-title">节目文稿</text>
          </view>
          <view class="script-content">
            
            <view class="script-excerpt">
              <rich-text :nodes="readLessonItem.lessonInfo?.content"></rich-text>
            </view>
            <!-- <view class="scroll-hint" @click="scrollToScript">
              上滑查看节目文稿 ↑
            </view> -->
          </view>
        </view>
      </template>
      <template v-slot:footer>
        <!-- 底部操作栏组件 -->
        <footer-actions
          :comment-count="commentCount"
          @submitComment="updateCommentList"
        />
      </template>
    </page-root>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { onLoad, onShow} from '@dcloudio/uni-app';
import PlayerControls from '@/pages/listenbook/components/pagePlayer/player-controls.vue';
import FooterActions from '@/pages/listenbook/components/pagePlayer/footer-actions.vue';
import { goBack } from '@/utils/untool'
import * as bookService from "@/api/course"
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import { LESSON_TARGET_TYPE } from '@/enums/book';
const bookStore = useBookStore()
const { readLessonItem } = storeToRefs(bookStore)
const alllesson = ref([] as any)

const pageOptions = ref({} as {
  bookId?: string,
  lessonId?: string,
})
const commentCount = ref(0)

// 滚动到完整文稿
const scrollToScript = () => {
  console.log('滚动到完整文稿');
  // 实现滚动逻辑
};


const updateCommentList = async()=> {
  let commentList = await bookService.getBookLessonCommentList({
    targetId: readLessonItem.value.lessonInfo?.id,
    targetType: LESSON_TARGET_TYPE,
   })
  commentCount.value = commentList.count || 0
}

const onLessonChange = async() => {
  updateCommentList()
}

const initData = async () => {
  let bookId = pageOptions.value.bookId || ''
  let optLessonId = pageOptions.value.lessonId
  let bkItem = await bookService.getBookDetail({id: bookId})
  let lessonList = await bookService.getBookLessonList({courseId: bookId})
  
  alllesson.value = lessonList.lists || []
  
  let lessonId = ''
  if(optLessonId) {
    lessonId = optLessonId
  } else if(bookId == readLessonItem.value.bookInfo?.id){
    lessonId = readLessonItem.value.lessonInfo.id
  }
  lessonId = lessonId || alllesson.value[0]?.id || ''
  let lessonItem = await bookService.getBookLessonDetail({id: lessonId})
  
  bookStore.updateLessonItem({
    bookInfo: bkItem
  })
  bookStore.play(lessonItem)
  onLessonChange()
};

watch(() => readLessonItem.value.lessonInfo?.id, onLessonChange)

onLoad(async (options: any) => {
  // 页面加载时的初始化逻辑
  pageOptions.value = options
  initData()
});

onShow(() => {
  // 页面显示时的逻辑
});
</script>

<style scoped lang="scss">
.player-container {
  height: 100%;
}

.cover-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
}

.book-cover {
  width: 480rpx;
  height: 600rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.book-cover image {
  width: 100%;
  height: 100%;
}

.script-section {
  flex: 1;
  padding: 0 40rpx;
}

.section-header {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  color: #333333;
  font-weight: 500;
  padding-left: 20rpx;
  border-left: 6rpx solid #ff6b00;
}

.script-content {
  padding-bottom: 200rpx;
}

.script-title {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 20rpx;
}

.script-excerpt {
  font-size: 28rpx;
  color: #666666;
  line-height: 48rpx;
}

.scroll-hint {
  margin-top: 30rpx;
  font-size: 24rpx;
  color: #999999;
  text-align: center;
  padding: 20rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
}
</style>