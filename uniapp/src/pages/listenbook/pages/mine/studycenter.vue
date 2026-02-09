<template>
  <page-root>
    <template v-slot:header>
    </template>
    <template v-slot:body>
      <view class="study-center-container">
        <scroll-more-list v-model:resObject="mdListModel"
          :searchParam="searchParam" :getListFun="getListFun"
          ref="mdListRef"
        >
          <!-- 轮播图广告 -->
          <view class="banner">
            <image :src="getResourceUrl(topBanner?.[0]?.image)" @click="designLinkClick(topBanner?.[0]?.link)" mode="aspectFill"></image>
          </view>

          <!-- 标签切换 - 使用vk-uview-ui的u-tabs组件 -->
          <u-tabs 
            :list="tabList" 
            v-model="activeTabIndex" 
            barWidth="80"
            barHeight="6"
            bgColor="transparent"
            activeStyle="color: #1989fa; font-weight: 600;"
            inactiveStyle="color: #666;"
            :isScroll="false"
            :swipeable="true"
            @change="handleTabChange"
          ></u-tabs>

          <!-- 内容区域 -->
          <view class="content-wrapper">
            <!-- 最近学习标签内容 -->
            <view v-if="activeTabIndex === 0" class="recent-study-content">
              <!-- 课程类型标签 - 使用vk-uview-ui的u-tag组件 -->
              <view v-if="false" class="course-tags-wrapper">
                <u-tag 
                  :text="'专辑'" 
                  :plain="activeCourseType !== 'album'" 
                  :color="activeCourseType === 'album' ? '#1989fa' : '#999'"
                  :bgColor="activeCourseType === 'album' ? '#ecf5ff' : 'transparent'"
                  shape="circle"
                  @click="switchCourseType('album')"
                  class="course-tag"
                ></u-tag>
                <u-tag 
                  :text="'训练营'" 
                  :plain="activeCourseType !== 'camp'" 
                  :color="activeCourseType === 'camp' ? '#1989fa' : '#999'"
                  :bgColor="activeCourseType === 'camp' ? '#ecf5ff' : 'transparent'"
                  shape="circle"
                  @click="switchCourseType('camp')"
                  class="course-tag"
                ></u-tag>
              </view>

              <!-- 课程列表 -->
              <view class="course-list">
                <view v-for="item in mdListModel.list" @click="handleCourseClick(item)">
                  <!-- 今天标签 -->
                  <view v-if="item._dateLabel" class="date-label">{{ item._dateLabel }}</view>

                  <!-- 课程项2 -->
                  <view class="course-item">
                    <view class="course-cover">
                      <image :src="item.courseCoverImg" mode="aspectFill"></image>
                    </view>
                    <view class="course-info">
                      <view class="course-title">{{item.courseName}}</view>
                      <view class="course-progress">学习至：{{item.lessonName}}</view>
                      <view class="course-stats">共{{item.totalLessons}}节 | 已学{{item.learnLessons}}节</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>

            <!-- 已购课程标签内容 -->
            <view v-else-if="activeTabIndex === 1">
              <view  v-for="item in mdListModel.list" class="purchased-course">
                <!-- 课程标题区域 -->
                <view @click="goto(allRoutePathMaps.listenbook.editorInChiefIndex)" class="course-header">
                  <view class="course-header-left">
                    <!-- <span class="new-tag">最新</span> -->
                    <span class="course-name">{{item.courseName}}</span>
                  </view>
                  <view class="go-listen">去收听 &gt;</view>
                </view>
                
                <!-- 课程内容数量 -->
                <view class="content-count">共{{1}}个内容</view>
                
                <!-- 课程封面图 -->
                <view @click="handleCourseClick(item)" class="course-covers">
                  <image :src="item.courseCoverImg" mode="aspectFill" class="cover-image"></image>
                </view>
                <!-- 课程有效期 -->
                <view class="validity-period">课程有效期：
                  <template v-if="item.endTime">{{formatDate(item.endTime, 'yyyy-MM-dd')}}到期</template>
                  <template v-if="!item.endTime">长期</template>
                </view>
              </view>
            </view>
          </view>
        </scroll-more-list>
      </view>
    </template>
  </page-root>
  
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import * as bookService from '@/api/course'
import { getDecorate } from '@/api/shop'
import { getResourceUrl } from "@/utils/cdn"
import { formatDate } from '@/utils/util'
import { designLinkClick } from '@/utils/book';
import { allRoutePathMaps, goto } from '@/utils/untool';
import { onLoad } from '@dcloudio/uni-app';

const mdListRef = ref<any>(null);

// 标签列表数据
const tabList = ref([
  { name: '最近学习' },
  { name: '已购课程' }
]);

// 标签状态
const activeTabIndex = ref(0);
const activeCourseType = ref('album'); // 'album' | 'camp'

const searchParam = ref({

})

const mdListModel = ref({
  list: [
  ]
} as any);

const getListFun = async (params: any) => {
  let tabIndex = activeTabIndex.value
  let reqFun = bookService.getBookLessonStudyHistoryList
  if(tabIndex==1) {
    reqFun = bookService.getMyBuyCourseList
  }
  const res = await reqFun({
    ...params
  })
  let list = res.lists || []
  if(tabIndex==0) {
    const allDateLabelMap:any = {}
    list.map((item: any) => {
      let lb = formatDate(item.lastLearnTime, 'MM-dd', true)
      if(!allDateLabelMap[lb]){
        allDateLabelMap[lb] = lb
        item._dateLabel = lb
      }
    })
  }
  return {
    list,
    total: res.count,
  }
}

const topBanner = ref<any>([])

// 手势左右滑动切换tab处理
const handleTabChange = (index: number) => {
  activeTabIndex.value = index;
  // 这里可以根据标签加载不同的课程数据
  mdListRef.value.getDataList(true) // 重置第一页数据
};

// 切换课程类型标签
const switchCourseType = (type: string) => {
  activeCourseType.value = type;
  mdListRef.value.getDataList(true) // 重置第一页数据
};

// 处理课程点击事件
const handleCourseClick = (item: any) => {
  goto(`${allRoutePathMaps.listenbook.chapterDetail}?bookId=${item.courseId}`)
}

const initData = async() => {
  let pageRes = await getDecorate({ id: 6 })
  try {
    let pgList = JSON.parse(pageRes?.pages)
    topBanner.value = pgList.filter((t:any)=> t.name == 'study-banner')?.[0]?.content?.data || []
  } catch (error) {
    console.error('解析 pageRes?.pages 失败:==========', {error, pageRes});
  }
}

onLoad(async (opt) => {
 initData()
})

</script>

<style lang="scss" scoped>
.study-center-container{
  height: 100%;
  padding: 30rpx;
}

// 轮播图
.banner {
  width: 100%;
  height: 70rpx;
  overflow: hidden;
  position: relative;
  border-radius: 32rpx;
  margin-bottom: 10rpx;
  image {
    width: 100%;
    height: 100%;
  }
}

// 内容包装器
.content-wrapper {
  margin-top: 22rpx;
}
.recent-study-content{
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}
// 课程类型标签包装器
.course-tags-wrapper {
  margin-bottom: 30rpx;
  display: flex;
  gap: 20rpx;
}

.course-tag {
  font-size: 24rpx;
  padding: 12rpx 32rpx;
}

// 课程列表
.course-list {
  
  // 日期标签
  .date-label {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 16rpx;
    padding-left: 12rpx;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 24rpx;
      background-color: #1989fa;
      border-radius: 3rpx;
    }
  }
  
  // 课程项
  .course-item {
    display: flex;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    &:last-child {
    }
    .course-cover {
      width: 140rpx;
      height: 140rpx;
      border-radius: 8rpx;
      overflow: hidden;
      margin-right: 20rpx;
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .course-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .course-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
      line-height: 1.4;
    }
    
    .course-progress {
      font-size: 24rpx;
      color: #666;
      margin-bottom: 12rpx;
      line-height: 1.4;
    }
    
    .course-stats {
      font-size: 22rpx;
      color: #999;
    }
  }
}

// 已购课程样式
.purchased-course {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
  
  // 课程标题区域
  .course-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    
    .course-header-left {
      display: flex;
      align-items: center;
      
      .new-tag {
        background-color: #ff4d4f;
        color: #fff;
        font-size: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 10rpx;
        margin-right: 12rpx;
      }
      
      .course-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
      }
    }
    
    .go-listen {
      font-size: 24rpx;
      color: #1989fa;
    }
  }
  
  // 课程内容数量
  .content-count {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 20rpx;
  }
  
  // 课程封面图
  .course-covers {
    display: flex;
    gap: 20rpx;
    margin-bottom: 20rpx;
    
    .cover-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
    }
  }
  
  // 课程有效期
  .validity-period {
    font-size: 24rpx;
    color: #999;
  }
}
</style>