<template>
  <page-root :headOpt="{hideNavbar: true, backgroundColor: '#fff' }">
    <template v-slot:header>
    </template>
    <template v-slot:body>
      <view class="container">
        <view class="top-header animate__animated animate__fadeIn">
          <view class="relative z-10 p-5">
            
            <view class="flex justify-between items-center mb-6">
              <view>
                <text class="welcome-text animate__animated animate__fadeInDown">{{userInfo.welTitle}}</text>
                <view class="flex items-center date-text mt-1 animate__animated animate__fadeInDown animate__delay-1s">
                  <text class="fa fa-calendar-alt mr-1"></text>
                  <text>{{ currentDate }}</text>
                </view>
              </view>
              <!-- <view class="notification-icon rounded-full bg-blue-100 flex items-center justify-center" @click="goto(allRoutePathMaps.userInfo)">
                <text class="fa fa-bell notification-bell-icon"></text>
              </view> -->
            </view>
            
            <view class="mindstate-card animate__animated animate__fadeInUp animate__delay-1s">
              <view class="flex">
                <view class="mindstate-icon-container">
                  <view class="mindstate-icon">
                    <text class="emoji">{{moods?.[checkdata.mood]?.emoji||""}}</text>
                  </view>
                </view> 
                <view class="ml-4 flex-1">
                  <view class="flex justify-between items-center">
                    <text class="mental-state-title">今日心灵状态</text>
                    <text class="mental-state-value">{{moods?.[checkdata.mood]?.name||""}}</text>
                  </view>
                  <view class="progress-bar-container">
                    <view class="progress-bar" :style="{'width': (checkdata?.moodLevel||0)*20+'%'}"></view>
                  </view>
                </view>
              </view>
              
              <view class="mood-stats">
                <view class="stats-container">
                  <view class="stat-item">
                    <text class="stat-label">连续记录</text>
                    <text class="stat-value">{{checkdata.checkInDays=null?'0':checkdata.checkInDays}}天</text>
                  </view>
                  <view class="stat-item">
                    <text class="stat-label">本周情绪</text>
                    <text class="stat-value">{{checkdata.weekMood<=2?'稳定':'不稳定'}}</text>
                  </view>
                </view>
                <button class="check-in-btn" @click="goto(allRoutePathMaps.moodCheck)">
                  记录
                </button>
              </view>
            </view>
            
            
            <view class="daily-quote animate__animated animate__fadeIn animate__delay-2s">
              <text claas='text-lg'>觉察 · 感恩 · 复盘 —— 每日三宝，点亮心光</text>
            </view>
            
          </view>
        </view>
        
        
        <view class="p-5">
          
          <view class="grid grid-cols-2 gap-4 animate__animated animate__fadeInUp animate__delay-1s">
            <view class="feature-card bg-green-50 p-4" @click="goto(`${allRoutePathMaps.journalEditor}?type=awareness`)">
              <view class="feature-icon bg-green-100">
                <text class="fa fa-sun text-green-500"></text>
              </view>
              <text class="font-medium text-gray-800">觉察日记</text>
              <view class="feature-description">
                <text class="text-xs text-gray-500">觉察是改变的第一步，从写下开始。</text>
              </view>
            </view>
            
            <view class="feature-card bg-blue-50 p-4" @click="goto(`${allRoutePathMaps.journalEditor}?type=gratitude`)">
              <view class="feature-icon bg-blue-100">
                <text class="fa fa-book text-blue-500"></text>
              </view>
              <text class="font-medium text-gray-800">感恩日记</text>
              <view class="feature-description">
                <text class="text-xs text-gray-500">感恩是丰盛的源泉，从记录开始</text>
              </view>
            </view>
            
            <view class="feature-card bg-purple-50 p-4" @click="goto(`${allRoutePathMaps.journalEditor}?type=reflection`)">
              <view class="feature-icon bg-purple-100">
                <text class="fa fa-moon text-purple-500"></text>
              </view>
              <text class="font-medium text-gray-800">复盘日记</text>
              <view class="feature-description">
                <text class="text-xs text-gray-500">复盘是成长的钥匙，从总结开始</text>
              </view>
            </view>
            

            <view class="feature-card bg-amber-50 p-4" @click="goto(allRoutePathMaps.moodTrends)">
              <view class="feature-icon bg-amber-100">
                <text class="fa fa-chart-bar text-amber-500"></text>
              </view>
              <text class="font-medium text-gray-800">情绪追踪</text>
              <view class="feature-description">
                <text class="text-xs text-gray-500">帮你回顾你最近的心情和状态</text>
              </view>
            </view>
          </view>
          
        </view>
        
        
      </view>
    </template>
  </page-root>
  
</template>

<script lang="ts">
  import { ref, reactive, computed } from 'vue'
  import { awarenessLists,awarenessHomeInfo } from '@/api/awareness'
  import { useUserStore } from '@/stores/user'
  import { goto, allRoutePathMaps } from '@/utils/untool'
  import { storeToRefs } from 'pinia'
    
  export default {
    data() {
      return {
		allRoutePathMaps,
        userInfo:{
          welTitle:"小光"
        },
        currentDate: '',
        moods: {
          happy: {
            name: '开心',
            emoji: '😊'
          },
          calm: {
            name: '平静',
            emoji: '😌'
          },
          tired: {
            name: '疲惫',
            emoji: '😓'
          },
          anxious: {
            name: '焦虑',
            emoji: '😰'
          },
          angry: {
            name: '生气',
            emoji: '😠'
          }
        },
        recordList: [],
        checkdata:{moodLevel:0,mood:"happy",checkInDays:0,weekMood:1,growthScore:0}
      }
    },
    onLoad() {
      this.getCurrentDate();
      this.setupAnimations();
      this.loadData();
    },
    onShow(){
      this.getCurrentDate();
      this.setupAnimations();
      this.loadData();
    },
    methods: {
	  goto,
      async loadData(){
        const userStore = useUserStore();
        this.userInfo.welTitle = this.getCurrentDateWelcome()+ (userStore&&userStore.userInfo&&userStore.userInfo.nickname?"，"+userStore.userInfo.nickname:"");
        console.log(this.userInfo.welTitle)
        if(userStore.isLogin){ 
          const rescheckdata = await awarenessHomeInfo({})
          if(rescheckdata){
            this.checkdata=rescheckdata;
          }
          const data = await awarenessLists({pageSize:5,"unRecordType":"check"})
          this.recordList=data.lists
        }
      },
      getCurrentDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
        this.currentDate = `${year}年${month}月${day}日 ${weekday}`;
      },
      getCurrentDateWelcome() {
        const date = new Date();
        const day = date.getHours();
        console.log(day);
        if(day<=10)return "早上好";
        if(day>10 && day<=13) return "中午好";
        if(day>13 && day<=17) return "下午好";
          if(day>17)return "晚上好";
      },
      
      setupAnimations() {
        // #ifdef H5
        setTimeout(() => {
          const cards = document.querySelectorAll('.feature-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate__animated', 'animate__fadeInUp');
            }, 150 * index);
          });
        }, 500);
        // #endif
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    background-color: #f8fafc;
	min-height: 100%;
  }
  
  /* 顶部区域新设计样式 */
  .top-header {
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .notification-icon {
    width: 48px;
    height: 48px;
    background-color: #EEEAFF;
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.15);
    position: relative;
  }
  
  .notification-bell-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #6366F1;
  }
  
  .mindstate-card {
    background-color: #f5f7ff;
    border-radius: 20rpx;
    padding: 20rpx 20rpx;
    margin-top: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  }
  
  .mindstate-icon-container {
    position: relative;
  }
  
  .mindstate-icon {
    width: 120rpx;
    height: 120rpx;
    background-color: #FEF3C7;
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .emoji {
    font-size: 66rpx;
    padding: 0;
    margin: 0;
    line-height: 1;
    display: block;
  }
  
  .progress-bar-container {
    width: 100%;
    height: 8px;
    background-color: #e5e7fa;
    border-radius: 6px;
    margin-top: 8px;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    background-color: #5e50ff;
    border-radius: 6px;
  }
  
  .mood-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30rpx;
    padding: 0;
  }
  
  .stats-container {
    display: flex;
    justify-content: space-between;
    width: 65%;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 65px;
  }
  
  .stat-label {
    font-size: 12px;
    color: #888888;
    margin-bottom: 8px;
  }
  
  .stat-value {
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
  }
  
  .check-in-btn {
    background-color: #5e50ff;
    color: white;
    font-size: 28rpx;
    font-weight: 500;
	text-align: center;
    line-height: normal;
    text-align: center;
    padding: 16rpx 30rpx;
    border-radius: 80rpx;
    box-shadow: 0 4px 20prx rgba(99, 102, 241, 0.3);
  }
  
  .daily-quote {
    margin-top: 40rpx;
    padding: 28rpx 30rpx;
    background-color: rgba(99, 102, 241, 0.05);
    border-left: 3px solid #6366F1;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #5e50ff;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  /* 功能卡片样式 */
  .feature-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.03);
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.03);
    border-radius: 26rpx;
    display: flex;
    flex-direction: column;
    padding: 32rpx 30rpx !important;
  }
  
  .feature-card:active {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
  
  .feature-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.05);
	font-size: 30rpx;
  }
  
  .feature-card .font-medium {
    font-size: 28rpx;
    margin-bottom: 6rpx;
  }
  
  .feature-description {
    margin-top: 4rpx;
    display: flex;
    flex-direction: column;
  }
  
  .feature-description .text-xs {
    line-height: 1.4;
    color: #777777;
  }
  
  /* 心灵对话卡片图标 */
  .feature-card:nth-child(1) .feature-icon {
    background-color: #DBEAFE;
  }
  
  /* 情绪追踪卡片图标 */
  .feature-card:nth-child(2) .feature-icon {
    background-color: #E0E7FF;
  }
  
  /* 觉察日记卡片图标 */
  .feature-card:nth-child(3) .feature-icon {
    background-color: #D1FAE5;
  }
  
  /* 成长报告卡片图标 */
  .feature-card:nth-child(4) .feature-icon {
    background-color: #FFFFFF;
  }
  
  /* 日记卡片表情背景颜色 */
  .w-8.h-8.rounded-full.bg-yellow-100 {
    background-color: #FEF3C7;
  }
  
  .w-8.h-8.rounded-full.bg-blue-100 {
    background-color: #DBEAFE;
  }
  
  /* 灵感卡片样式 - 放在这里避免冲突 */
  .inspiration-card {
    background-color: white;
    border-left: 3px solid #6366F1;
    border-radius: 0 16px 16px 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
  }
  
  .inspiration-card:active {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
  
  /* 日记卡片样式 - 放在这里避免冲突 */
  .journal-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.03);
    border-radius: 16px;
  }
  
  .journal-card:active {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }
  
  /* 文本截断 */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* 动画类 */
  .animate__animated {
    animation-duration: 0.8s;
  }
  
  .animate__fadeIn {
    animation-name: fadeIn;
  }
  
  .animate__fadeInDown {
    animation-name: fadeInDown;
  }
  
  .animate__fadeInUp {
    animation-name: fadeInUp;
  }
  
  .animate__delay-1s {
    animation-delay: 0.3s;
  }
  
  .animate__delay-2s {
    animation-delay: 0.5s;
  }
  
  .animate__delay-3s {
    animation-delay: 0.7s;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInDown {
    from { opacity: 0; transform: translate3d(0, -10px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translate3d(0, 10px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  
  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .section-title::before {
    content: "";
    display: block;
    width: 4px;
    height: 20px;
    background: linear-gradient(to bottom, #4F46E5, #6366F1);
    border-radius: 2px;
    margin-right: 8px;
  }
  
  /* Utility classes */
  .text-2xl { font-size: 24px; }
  .font-bold { font-weight: bold; }
  .text-gray-800 { color: #333333; }
  .text-gray-500 { color: #999999; }
  .text-sm { font-size: 14px; }
  .mt-1 { margin-top: 4px; }
  .flex { display: flex; }
  .justify-between { justify-content: space-between; }
  .items-start { align-items: flex-start; }
  .items-center { align-items: center; }
  .mb-4 { margin-bottom: 16px; }
  .w-10 { width: 40px; }
  .h-10 { height: 40px; }
  .w-8 { width: 32px; }
  .h-8 { height: 32px; }
  .rounded-full { border-radius: 50%; }
  .bg-indigo-100 { background-color: #EEF2FF; }
  .bg-yellow-100 { background-color: #FEF3C7; }
  .bg-blue-100 { background-color: #DBEAFE; }
  .bg-blue-50 { background-color: #EFF6FF; }
  .bg-purple-50 { background-color: #F5F3FF; }
  .bg-purple-100 { background-color: #EDE9FE; }
  .bg-green-50 { background-color: #ECFDF5; }
  .bg-green-100 { background-color: #D1FAE5; }
  .bg-amber-50 { background-color: #FFFBEB; }
  .bg-amber-100 { background-color: #FEF3C7; }
  .text-indigo-500 { color: #6366F1; }
  .text-blue-500 { color: #3B82F6; }
  .text-purple-500 { color: #8B5CF6; }
  .text-green-500 { color: #22C55E; }
  .text-amber-500 { color: #F59E0B; }
  .p-5 { padding: 40rpx; }
  .p-4 { padding: 16px; }
  .ml-4 { margin-left: 20px; }
  .ml-1 { margin-left: 4px; }
  .mr-1 { margin-right: 4px; }
  .mr-2 { margin-right: 8px; }
  .flex-1 { flex: 1; }
  .mb-1 { margin-bottom: 4px; }
  .mb-3 { margin-bottom: 12px; }
  .font-medium { font-weight: 500; }
  .text-gray-700 { color: #666666; }
  .text-xs { font-size: 12px; }
  .text-indigo-600 { color: #4F46E5; }
  .text-blue-600 { color: #2563EB; }
  .w-full { width: 100%; }
  .bg-gray-200 { background-color: #EEEEEE; }
  .h-1\.5 { height: 6px; }
  .mt-4 { margin-top: 16px; }
  .mt-2 { margin-top: 8px; }
  .mt-3 { margin-top: 12px; }
  .mt-6 { margin-top: 24px; }
  .text-center { text-align: center; }
  .font-semibold { font-weight: 600; }
  .text-lg { font-size: 21px; }
  .grid { display: grid; }
  .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .gap-4 { gap: 16px; }
  .shadow-sm { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); }
  .bg-indigo-50 { background-color: #EEF2FF; }
  .bg-blue-50 { background-color: #EFF6FF; }
  .px-2 { padding-left: 8px; padding-right: 8px; }
  .py-0\.5 { padding-top: 2px; padding-bottom: 2px; }
  .rounded-full { border-radius: 9999px; }
  .text-gray-600 { color: #666666; }
  .h-10 { height: 40px; }
  .relative { position: relative; }
  .z-10 { z-index: 10; }
  
  /* 欢迎文本样式 */
  .welcome-text {
    font-size: 38rpx;
    font-weight: 700;
    color: #333333;
    line-height: 1.2;
  }
  
  .date-text {
    font-size: 30rpx;
    color: #888888;
  }
  
  .mental-state-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
  }
  
  .mental-state-value {
    font-size: 30rpx;
    font-weight: 500;
    color: #5e50ff;
  }
  
  /* 日记标题和日期样式 */
  .journal-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333333;
    line-height: 1.3;
  }
  
  .journal-date {
    font-size: 26rpx;
    color: #888888;
    margin-top: 8rpx;
  }
  
  /* 日记卡片中的心情圆圈 */
  .mood-circle {
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .mood-circle.happy {
    background-color: #FEF3C7; /* 黄色背景 */
  }
  
  .mood-circle.sad {
    background-color: #DBEAFE; /* 蓝色背景 */
  }
  
  .mood-emoji {
    font-size: 36rpx;
    line-height: 1;
  }
  
  /* 日记标签样式 */
  .tag {
    font-size: 24rpx;
    color: #4F46E5;
    background-color: #EEF2FF;
    padding: 4rpx 16rpx;
    border-radius: 999px;
    margin-right: 12rpx;
    display: inline-flex;
    align-items: center;
  }
  
  .tag.blue {
    color: #2563EB;
    background-color: #EFF6FF;
  }
</style>

