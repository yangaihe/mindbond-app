<template>
  <page-root :headOpt="{ hideNavbar: true, backgroundColor: '', position: 'fixed' }">
    <template v-slot:header>
      <!-- 顶部导航 -->
      <nav-share></nav-share>
    </template>
    <template v-slot:body>
      <!-- 顶部背景 -->
      <view class="topbg"></view>
      <!-- 主内容区域 -->
      <view class="content">
        <!-- 书籍信息卡片 -->
        <view class="book-info-card">
          <view class="book-cover">
            <image :src="bookItem.coverImg" mode="aspectFill"></image>
          </view>
          <view class="book-details">
            <view class="book-title">{{ bookItem.courseName }}</view>
            <view class="book-meta">
              <!-- <view class="book-status">已完结</view> -->
              <view class="book-count">共{{ bookItem.totalLessons }}节</view>
            </view>
            <rich-text class="book-description" :nodes="bookItem.courseDesc"></rich-text>
          </view>
        </view>

        <!-- 章节列表 -->
        <view class="chapter-list-section">
          <view class="section-title flex items-center">
            <view class="sectit-text active">目录</view>
            <!-- <view class="sectit-text">详情</view> -->
          </view>

          <!-- 章节分组列表 -->
          <view class="chapter-groups">
            <view v-for="(group, index) in allGroupLesson" :key="index" class="chapter-group">
              <!-- 分组标题 -->
              <view class="group-header" @click="toggleGroup(group)">
                <view class="group-title">{{ group.chapterName }}</view>
                <view class="group-info">({{ group.dataList.length }}节)</view>
                <text class="xgn-iconfont" :class="group.expanded ? 'xgn-arrow-up-bold' : 'xgn-arrow-down'"></text>
              </view>

              <!-- 展开的章节列表 -->
              <view v-if="group.expanded" class="episodes-list">
                <view v-for="(episode, episodeIndex) in group.dataList" :key="episodeIndex" class="episode-item"
                  :class="{ 'playing': isCurrentEpisode(episode.id) }" @click="playEpisode(episode)">
                  <view class="episode-title">{{ episode.lessonName }}</view>
                  <view class="episode-duration">{{ formatTime(episode.duration || 0) }}</view>
                </view>
              </view>
            </view>
          </view>

        </view>
      </view>

    </template>
    <template v-slot:footer>

      <!-- 解锁提示 -->
      <!-- <view class="unlock-tip">
        <text>解锁专辑全部精彩内容 >></text>
      </view> -->
      <min-player></min-player>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useRouter } from 'vue-router'
import { useBookStore } from '@/stores/book'
import MinPlayer from '@/pages/listenbook/components/min-player/min-player.vue'
import * as bookService from "@/api/course"
import { getBookChapterGroupList } from '@/utils/book'
import { formatTime } from '@/utils/util'
import { storeToRefs } from 'pinia'

const bookStore = useBookStore()
const { readLessonItem } = storeToRefs(bookStore)

const pageOptions = ref({} as {
  bookId?: string,
})
const bookItem = ref({} as any)
const allGroupLesson = ref([] as any)


// 切换分组展开状态
const toggleGroup = (item: any) => {
  item.expanded = !item.expanded
}

// 判断是否是当前播放的章节
const isCurrentEpisode = (id: string) => {
  return readLessonItem.value.lessonInfo?.id == id
}

// 播放课时
const playEpisode = (item:any) => {
  
}

const initData = async () => {
  let bookId = pageOptions.value.bookId || ''
  let bkItem = await bookService.getBookDetail({id: bookId})
  let lessonList = await bookService.getBookLessonList({courseId: bookId})
  let chapterList = await bookService.getBookChapterList({courseId: bookId})
  bookItem.value = bkItem || {}
  allGroupLesson.value = getBookChapterGroupList(lessonList.lists || [], chapterList.lists || [])
  if(allGroupLesson.value[0]) {
    allGroupLesson.value[0].expanded = true
  }
}

onLoad(async (options: any) => {
  // 页面加载时的初始化逻辑
  pageOptions.value = options
  initData()
});

</script>

<style scoped lang="scss">
page{
  
}

// 内容区域
.content {
  position: relative;
  padding-bottom: 20rpx;
  padding-top: 140rpx;
  margin: 0 30rpx;
}
.topbg{
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom, #DBEBFA, #E5EFFB, #f3f4f6);
  height: 600rpx;
  width: 100%;
}
// 书籍信息卡片
.book-info-card {
  display: flex;
  padding: 30rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
  border-radius: 16rpx;

  .book-cover {
    width: 200rpx;
    height: 280rpx;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

    image {
      width: 100%;
      height: 100%;
    }
  }

  .book-details {
    flex: 1;
    margin-left: 24rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .book-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333333;
      line-height: 50rpx;
      margin-bottom: 12rpx;
    }

    .book-meta {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-bottom: 16rpx;

      .book-status,
      .book-count {
        font-size: 28rpx;
        color: #999999;
      }
    }

    .book-description {
      font-size: 28rpx;
      color: #999999;
      line-height: 40rpx;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

// 章节列表部分
.chapter-list-section {

  .section-title {
    gap: 30rpx;
    font-size: 32rpx;
    color: #333333;
    padding: 30rpx;

    .sectit-text {
      &.active {
        font-weight: 600;
      }
    }
  }

  // 章节分组
  .chapter-groups {
    margin-bottom: 30rpx;
  }

  .chapter-group {
    margin-bottom: 20rpx;
    background-color: #fff;
    padding: 0 30rpx;
    border-radius: 12rpx;

    .group-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28rpx 0;
      border-bottom: 2rpx solid #f0f0f0;

      .group-title {
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
      }

      .group-info {
        font-size: 26rpx;
        color: #999999;
        margin-right: 10rpx;
      }

      .xgn-iconfont {
        font-size: 32rpx;
        color: #999999;
      }
    }

    // 章节列表
    .episodes-list {
      margin-top: 10rpx;
      overflow: hidden;

      .episode-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx 20rpx;
        border-bottom: 2rpx solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        &.playing {
          
          .episode-title {
            color: $u-type-primary;
          }
        }

        .episode-title {
          font-size: 28rpx;
          color: #333333;
          flex: 1;
          margin-right: 20rpx;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .episode-duration {
          font-size: 24rpx;
          color: #999999;
          min-width: 100rpx;
          text-align: right;
        }
      }
    }
  }


}

// 解锁提示
.unlock-tip {
  padding: 20rpx 20rpx;
  background-color: #fff8f0;

  text {
    font-size: 28rpx;
    color: #ff6b00;
    font-weight: 500;
  }
}
</style>