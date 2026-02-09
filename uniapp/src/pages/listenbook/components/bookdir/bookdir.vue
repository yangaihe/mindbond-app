<template>
  <!-- 使用更简洁的方式实现u-popup底部弹出 -->
  <u-popup v-model="showPopup" mode="bottom" :overlay="true" :close-on-click-overlay="true" @close="handleClose"
    :safe-area-inset-bottom="true" round="16"
  >
    <layout-view 
      v-if="showPopup"
      rootStyle="background-color: #fff;"
      :notParBody="true"
    >
      <template v-slot:header>
        <!-- 顶部课程信息 -->
        <view class="bookdir-header">
          <view class="course-info">
            <view class="course-title">{{ readLessonItem.bookInfo?.courseName }}</view>
          </view>
        </view>
      </template>
      <template v-slot:body>
        <scroll-more-list v-model:resObject="listModel" :searchParam="searchParam" :getListFun="getListFun"
          rootStyle="max-height: 46vh;min-height: 30vh;"
        >
          <view v-for="(item, index) in listModel.list" :key="index"
            :class="['chapter-item', { 'active': item.id === readLessonItem.lessonInfo?.id }]" @click="handleChapterClick(item, index)">
            <view v-if="item._canPlay" class="chapter-number">
              <text v-if="item.id === readLessonItem.lessonInfo?.id" 
                class="xgn-iconfont xgn-playing" style="font-size: 32rpx;"
              ></text>
              <text v-else>{{ index + 1 }}</text>
            </view>
            <view v-else class="chapter-lock">
              <text 
                class="xgn-iconfont xgn-lock" style="font-size: 32rpx;"
              ></text>
            </view>
            
            <view class="chapter-content">
              <view class="chapter-title">{{ item.lessonName }}</view>
              <view class="chapter-meta">
                <span class="chapter-type">{{ item.type }}</span>
                <span class="chapter-duration">
                  {{ formatTime(item.duration || 0) }}
                  <!-- {{ item.duration }}秒 -->
                </span>
                <span>|</span>
                <span class="chapter-date">{{ item.updateTime }}</span>
              </view>
            </view>
            <view class="chapter-status" v-if="item.status">
              <text v-if="item.status === 'completed'" class="status-completed">已学完</text>
              <text v-else-if="item.status.includes('%')" class="status-progress">已学{{ item.status }}</text>
            </view>
          </view>
        </scroll-more-list>

      </template>
      <template v-slot:footer>
        <!-- 底部取消按钮 -->
        <view class="bookdir-footer">
          <view class="cancel-btn" @click="handleCancel">取消</view>
        </view>
      </template>
    </layout-view>
  </u-popup>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch, onMounted, computed } from 'vue';
import * as bookService from "@/api/course"
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/stores/book'
import { getCurPage, goto,allRoutePathMaps } from '@/utils/untool';
import { checkLessonCanPaly } from '@/utils/book';
import { formatTime } from '@/utils/util'
const bookStore = useBookStore()
const { readLessonItem } = storeToRefs(bookStore)

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
});

// 内部状态控制弹窗显示
const showPopup = ref(false);

// 监听外部visible属性变化
watch(() => props.visible, (newVal) => {
  console.log('bookdir visible prop changed to:', newVal);
  showPopup.value = newVal;
}, { immediate: true });

// 直接监听showPopup状态变化进行调试
watch(showPopup, (newVal) => {
  console.log('bookdir internal showPopup changed to:', newVal);
});

// 定义事件
const emit = defineEmits(['close', 'select-chapter']);

const getListFun = async (params: any = {}) => {
  let extParams = {
    courseId: readLessonItem.value.bookInfo?.id,
  }
  let resData = { lists: [], count: 0 }
  if(showPopup.value && extParams.courseId) {
    resData = await bookService.getBookLessonList({ ...params, ...extParams })
  }
  let bkList = resData.lists || []
  bkList.map((t:any)=> {
    t._canPlay = checkLessonCanPaly(readLessonItem.value.bookInfo, t)
  })
  return {
    list: bkList,
    total: resData.count || 0,
  }
}

const searchParam = ref({})

const listModel = ref({
  list: [
  ]
} as any);

// 处理u-popup关闭事件
const handleClose = () => {
  emit('close');
};

// 处理章节点击
const handleChapterClick = (item: any, index: number) => {
  emit('select-chapter', { item, index });
  let playPagePath = allRoutePathMaps.listenbook.playerIndex
  let curPage = getCurPage()
  if(curPage.$page.path == playPagePath){
    bookStore.play(item)
  } else {
    goto(`${playPagePath}?bookId=${item.courseId}&lessonId=${item.id}`)
  }
};

// 处理取消按钮点击
const handleCancel = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>

// 头部样式
.bookdir-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  .course-info {
    .course-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 10rpx;
    }
    
  }
}

// 列表样式
.chapter-item {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  transition: background-color 0.2s;

  &.active {
    background-color: $u-type-primary-light;
    .chapter-number {
      color: $u-type-primary;
    }

    .chapter-title {
      color: #333;
      font-weight: 600;
    }
  }
  .chapter-number,.chapter-lock{
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
  }

  .chapter-number {
    font-size: 26rpx;
    color: #999;
  }
  
  .chapter-lock {
    background-color: #f5f5f5;
    font-size: 32rpx;
    color: $u-type-primary;
  }

  .chapter-content {
    flex: 1;

    .chapter-title {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 8rpx;
      line-height: 1.4;
    }

    .chapter-meta {
      font-size: 22rpx;
      color: #999;
      display: flex;
      gap: 16rpx;
    }
  }

  .chapter-status {
    margin-left: 16rpx;

    .status-completed {
      font-size: 22rpx;
      color: #52c41a;
    }

    .status-progress {
      font-size: 22rpx;
      color: #fa8c16;
    }
  }
}


// 底部样式
.bookdir-footer {
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  
  .cancel-btn {
    width: 100%;
    text-align: center;
    font-size: 32rpx;
    color: #666;
    border: none;
  }
}
</style>