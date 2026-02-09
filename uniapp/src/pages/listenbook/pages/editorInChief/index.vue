<template>
  <page-root :headOpt="{ hideNavbar: true, backgroundColor: '#fff', position: '' }">
    <template v-slot:header>
      <!-- 顶部导航 -->
      <nav-share></nav-share>
    </template>
    <template v-slot:body>
      <view class="editor-in-chief-page">
        <!-- 主内容区域 -->
        <view class="content">
          <!-- 顶部背景 -->
          <view class="topbg"></view>

          <!-- Banner区域 -->
          <view class="banner-section">
            <image src="/static/images/user/my_topbg.png" mode="aspectFill" class="banner-bg"></image>
          </view>

          <!-- Tab切换 -->
          <view class="tab-container">
            <view class="tab-bar">
              <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: activeTab === index }"
                @click="switchTab(index)">
                <text class="tab-text">{{ tab.name }}</text>
                <view v-if="activeTab === index" class="tab-active-line"></view>
              </view>
            </view>

            <!-- Tab内容区域 -->
            <view class="tab-content">
              <!-- 主编推荐 -->
              <view v-if="activeTab === 0" class="tab-panel">
                <!-- 推荐内容 -->
                <view  v-for="item in recommendedContent" class="recommended-section block-space">
                  <view class="section-header flex justify-between items-center">
                    <text class="section-title">{{item.name}}</text>
                  </view>
                  <view class="section-desc">{{item.description}}</view>

                  <view class="content-list">
                    <book-cover-item  v-for="bk in item.bookList" :key="bk.id" :data="bk"></book-cover-item>
                  </view>
                </view>
              </view>

              <!-- 近期新书 -->
              <view v-if="activeTab === 1" class="tab-panel">
                <view class="new-books">
                  <view class="book-card" v-for="(item, index) in newBooks" :key="index" >
                    <book-cover-item  :data="item" @click="viewBookDetail(item)" :noClick="true"></book-cover-item>
                  </view>
                </view>
              </view>

              <!-- 节目简介 -->
              <view v-if="activeTab === 2" class="tab-panel">
                <view class="program-intro">
                  
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import * as bookService from "@/api/course"
import { useRouter } from 'vue-router'
import { getGroupBookList } from '@/utils/book';
import BookCoverItem from '@/pages/listenbook/components/book-cover-item/book-cover-item.vue'
import { allRoutePathMaps, goto } from '@/utils/untool';

const router = useRouter()

// Tab配置
const tabs = [
  { name: '主编推荐' },
  { name: '近期新书' },
  { name: '节目简介' }
]

// 当前激活的Tab
const activeTab = ref(0)

// 切换Tab
const switchTab = (index: number) => {
  activeTab.value = index
}


// 查看书籍详情
const viewBookDetail = (book: any) => {
  console.log('查看书籍详情:', book)
  goto(allRoutePathMaps.listenbook.chapterDetail)
}

// 近期新书数据
const newBooks = reactive([
  {
    id: '101',
    title: '《杨振宁传》',
    subtitle: '规范与对称之美。',
    cover: '@/static/c4.png'
  },
  {
    id: '102',
    title: '《贪婪的大脑》',
    subtitle: '你的大脑，正在欺骗你。',
    cover: '@/static/c5.png'
  }
])


const recommendedContent = ref([
] as any);


const initData = async()=>{
  let bkRes = await bookService.getBookList()
  let bkGroupRes = await bookService.getBookGroups()
  recommendedContent.value = getGroupBookList(bkRes.lists, bkGroupRes.lists, 0)
}

onMounted(async() => {
  await initData()
});

</script>

<style scoped lang="scss">


// 内容区域
.content {
  position: relative;
  padding: 30rpx;
}


.topbg{
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom, #DBEBFA, #E5EFFB, #F7F8FA);
  height: 700rpx;
  width: 100%;
}

.block-space {
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  &:last-child {
    margin-bottom: 0;
    /* 可以根据需要设置最后一个元素的样式 */
  }
  background-color: #fff;
  box-shadow: 0 0 10rpx rgba(196, 196, 196, 0.1);
}

// Banner部分
.banner-section {
  width: 100%;
}

.banner-bg {
  width: 100%;
  height: 710rpx;
  overflow: hidden;
  border-radius: 10rpx;
}

// Tab容器
.tab-container {
}

// Tab栏
.tab-bar {
  display: flex;
  height: 90rpx;
  border-bottom: 2rpx solid #f0f0f0;
  position: relative;

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .tab-text {
      font-size: 32rpx;
      color: #666666;
      transition: color 0.3s;
    }

    .tab-active-line {
      position: absolute;
      bottom: 10rpx;
      width: 60rpx;
      height: 4rpx;
      background-color: $u-type-primary;
      border-radius: 2rpx;
    }

    &.active {
      .tab-text {
        color: $u-type-primary;
        font-weight: 600;
      }
    }
  }
}

// Tab内容
.tab-content {
  padding-bottom: 30rpx;
}

.tab-panel {
  padding: 30rpx 0;
}

// 主编推荐样式

/* 推荐内容样式 */
.recommended-section {
  background-color: #fff;
  padding: 30rpx;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 24rpx;
  color: #999;
}

.section-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
// 近期新书样式
.new-books {
  
  .book-card {
    border-radius: 10rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
  }
}

// 节目简介样式
.program-intro {
 
}
</style>