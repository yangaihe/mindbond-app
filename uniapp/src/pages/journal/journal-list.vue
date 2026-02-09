<template>
	<page-root :headOpt="{hideNavbar: true, backgroundColor: '#fff' }">
		<template v-slot:header>
			<view class="tabs">
				<view class="tab-item" :class="{'active': activeTab === 'my'}" @click="switchTab('my')">
					<text class="tab-text">我的日记</text>
				</view>
				<view class="tab-item" :class="{'active': activeTab === 'public'}" @click="switchTab('public')">
					<text class="tab-text">心智广场</text>
				</view>
			</view>
		</template>
		<template v-slot:body>
			<view class="container">
				<scroll-view scroll-y class="content-area" @scrolltolower="handleScrollBottom">
					<view class="month-selector">
						<view class="arrow-button" @click="changeMonth(-1)">
							<text class="fa fa-chevron-left"></text>
						</view>
						<text class="month-title">{{ currentYear }}年{{ currentMonth }}月</text>
						<view class="arrow-button" 
							:class="isCurrentMonth ? 'disabled' : ''" 
							@click="changeMonth(1)">
							<text class="fa fa-chevron-right"></text>
						</view>
					</view>
					
					<!-- 日记列表 -->
					<view class="journal-list">
						
						<view v-for="(item, i) in recordList" :key="i" :name="item.name" class="journal-card" @click="navigateToDetail(item.id)">
							<view class="card-content">
								<view class="card-meta" style="justify-content: space-between;">
									<view class="journal-meta-left" style="display: flex;align-items: center;gap: 8rpx;">
									<text class="date-text">{{item.busdate}}</text>
									<text class="separator">·</text>
									<view class="journal-type" :class="item.recordType">
										<text class="fa fa-smile type-icon"></text>
										<text class="type-text">{{journalTypes[item.recordType]?journalTypes[item.recordType].name:""}}</text>
									</view>
									</view>
									
								</view>
								<view class="journal-name" style="display: flex; align-items: flex-start; gap: 16rpx;" 
								>								
									<image v-if="activeTab=='public'" style="width: 80rpx; height: 80rpx; border-radius: 50%;" mode="aspectFit" :src="item.avatar"/>                 
									<view style="flex: 1 0 0;min-width: 0;">
										<view v-if="activeTab=='public'" class="type-text">{{item.nickname||"匿名"}}</view>
										<view class="card-text text-clamp-3"  @click.stop="viewInsights(item.id)">
											{{item.content}}
										</view>
									</view>
								</view>
								
							</view>
							<view class="card-actions" v-show="this.activeTab=='my'">
								<view class="action-button insights" @click.stop="viewInsights(item.id)">
									<text class="fa fa-lightbulb action-icon"></text>
									<text class="action-text">心光回应</text>
								</view>
								<view class="action-divider"></view>
								<view class="action-button edit" @click.stop="editJournal(item.id)">
									<text class="fa fa-edit action-icon"></text>
									<text class="action-text">编辑日记</text>
								</view>
							</view>
							<!-- <view class="card-actions" v-show="this.activeTab=='public'">
								<view class="action-button insights" @click.stop="viewInsights(item.id)">
									<text class="fa fa-lightbulb action-icon"></text>
									<text class="action-text">日记详情</text>
								</view>
							</view> -->
						</view>
						
						
					</view>
					
					<!-- 加载中 / 无更多数据 -->
					<view class="loading-tips">
					<template v-if="loading">
						加载中...
					</template>
					<template v-else-if="!hasMore">
						没有更多数据了
					</template>
					<!-- 可选：显示“上拉加载更多” -->
					<template v-else>
						上拉加载更多
					</template>
					</view>
				</scroll-view>
				
				<!-- 底部悬浮按钮 -->
				<view class="floating-button" @click="showJournalTypes">
					<text class="fa fa-plus add-icon"></text>
				</view>
				
				<!-- 浮动菜单 - 日记类型选项 -->
				<view class="type-menu" :class="{'active': showTypes}">
					<view class="menu-header">
						<text class="menu-title">心光练习</text>
					</view>
					<view class="menu-options">
						<view class="menu-option" @click="createJournal('awareness')">
							<view class="option-icon awareness">
								<text class="fa fa-sun"></text>
							</view>
							<view class="option-text">
								<text class="option-title">觉察日记</text>
								<text class="option-desc">觉察是改变的第一步</text>
							</view>
						</view>
						<view class="menu-option" @click="createJournal('gratitude')">
							<view class="option-icon gratitude">
								<text class="fa fa-heart"></text>
							</view>
							<view class="option-text">
								<text class="option-title">感恩日记</text>
								<text class="option-desc">感恩是丰盛的源泉</text>
							</view>
						</view>
						<view class="menu-option" @click="createJournal('reflection')">
							<view class="option-icon reflection">
								<text class="fa fa-moon"></text>
							</view>
							<view class="option-text">
								<text class="option-title">复盘日记</text>
								<text class="option-desc">复盘是成长的钥匙</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</template>
	</page-root>
	
</template>

<script lang="ts">
	import { awarenessLists } from '@/api/awareness'
	import { goto, allRoutePathMaps } from '@/utils/untool';
	export default {
		name:"journal-list",
		data() {
			return {
				activeTab: 'my',
				currentYear: new Date().getFullYear(),
				currentMonth: new Date().getMonth() + 1,
				showTypes: false,
				pageNo:1,
				pageSize:20,
				hasMore: true,      // 是否还有更多数据
				loading: false,      // 防止重复加载
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
				journalTypes: {
					awareness: {
						name: '觉察日记',
						icon: 'fa-sun'
					},
					reflection: {
						name: '复盘日记',
						icon: 'fa-moon'
					},
					gratitude: {
						name: '感恩日记',
						icon: 'fa-heart'
					},
				},
				recordList: [],
			}
		},
		computed: {
			isCurrentMonth() {
				const now = new Date();
				return this.currentYear === now.getFullYear() && this.currentMonth === now.getMonth() + 1;
			}
		},
		watch: {
		  '$route' (to, from) {
			if(to.path==''){
				
			}		    
		  }
		},
		mounted(){
		},
		onLoad() {
			this.switchTab('my');
		},
		
		methods: {
			
			switchTab(tab) {
				this.activeTab = tab;
				this.pageNo = 1;
				this.hasMore = true;
				this.recordList = [];
				this.loadDataTab()
			},
			handleScrollBottom() {
				// 滚动到底部，加载下一页
				if (this.hasMore && !this.loading) {
				
				this.loadDataTab(this.pageNo + 1)
				}
			},		
			async loadDataTab(pageNo = 1) {
			    if (!this.hasMore || this.loading) return
			
			    this.loading = true
			    try {
					const data = await awarenessLists({pageNo:pageNo,pageSize:this.pageSize,"unRecordType":"check","month":this.formattedBusdate(),"dataType":this.activeTab})
					this.pageNo = pageNo
					const newData = data.lists || []
					this.recordList = this.recordList.concat(newData)
					// 判断是否还有更多数据
					if (newData.length < this.pageSize) {
					  this.hasMore = false
					}					
			      } catch (err) {
			        console.error('加载失败', err)
			        this.pageNo-- // 加载失败，页码回退
			      } finally {
			        this.loading = false
			      }
			},
			
			formattedBusdate() {
				const year = this.currentYear;
				var month = this.currentMonth;
				month = month<10?'0'+month:month;
				return `${year}${month}`;
			},
			changeMonth(delta) {
				
				if (this.isCurrentMonth && delta > 0) return;
				
				let newMonth = this.currentMonth + delta;
				let newYear = this.currentYear;
				
				if (newMonth > 12) {
					newMonth = 1;
					newYear += 1;
				} else if (newMonth < 1) {
					newMonth = 12;
					newYear -= 1;
				}
				
				this.currentMonth = newMonth;
				this.currentYear = newYear;
				this.switchTab(this.activeTab)
			},
			navigateToDetail(id) {
				if(this.activeTab == 'my'){
					goto(`${allRoutePathMaps.journalDetail}?id=${id}`)
				}
			},
			viewInsights(id) {
				goto(`${allRoutePathMaps.journalDetail}?id=${id}&tab=insights`)
			},
			editJournal(id) {
				goto(`${allRoutePathMaps.journalEditor}?id=${id}`)
			},
			showJournalTypes() {
				this.showTypes = true;
			},
			hideJournalTypes() {
				this.showTypes = false;
			},
			createJournal(type) {
				this.hideJournalTypes();
				goto(`${allRoutePathMaps.journalEditor}?type=${type}`)
			},
			showSearch() {
				// 搜索功能实现
				uni.showToast({
					title: '搜索功能即将推出',
					icon: 'none'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	/* 容器样式 */
	.container {
		height: 100%;
	}
	
	/* 顶部导航样式 */
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		padding: 26rpx 0;
		background-color: #FFFFFF;
	}
	
	.page-title {
		font-size: 38rpx;
		font-weight: bold;
		color: #333333;
		text-align: center;
	}
	
	.search-button {
		position: absolute;
		right: 40rpx;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.search-button .fa {
		font-size: 40rpx;
		color: #666666;
	}
	
	/* 标签页样式 */
	.tabs {
		display: flex;
		background-color: #FFFFFF;
		border-bottom: 1px solid #EEEEEE;
	}
	
	.tab-item {
		flex: 1;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.tab-text {
		font-size: 30rpx;
		color: #666666;
	}
	
	.tab-item.active .tab-text {
		color: #5e50ff;
		font-weight: bold;
	}
	
	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 10rpx;
		left: 0;
		right: 0;
		height: 8rpx;
		background-color: #5e50ff;
		width: 100rpx;
		margin: 0 auto;
		border-radius: 4rpx 4rpx 0 0;
	}
	
	/* 内容区域样式 */
	.content-area {
		height: 100%;
	}
	
	/* 月份选择器样式 */
	.month-selector {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 40rpx;
		max-width: 750rpx;
		margin: 0 auto;
	}
	
	.month-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #000000;
	}
	
	.arrow-button {
		width: 70rpx;
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666666;
	}
	
	.arrow-button.disabled {
		opacity: 0.5;
		color: #CCCCCC;
	}
	
	/* 日记列表样式 */
	.journal-list {
		padding: 0 30rpx 40rpx;
		max-width: 750rpx;
		margin: 0 auto;
	}
	
	.journal-card {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
		transition: transform 0.2s;
	}
	
	.journal-card:active {
		transform: translateY(-4rpx);
	}
	
	.card-content {
		padding: 30rpx;
	}
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}
	
	.card-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #000000;
	}
	
	/* 心情图标样式 */
	.mood-circle {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
	}
	
	/* 不同心情的背景颜色 */
	.mood-circle.happy {
		background-color: #FEF3C7; /* 黄色背景 */
	}
	
	.mood-circle.grateful {
		background-color: #D1FAE5; /* 浅绿色背景 */
	}
	
	.mood-circle.sad {
		background-color: #DBEAFE; /* 浅蓝色背景 */
	}
	
	.mood-circle.calm {
		background-color: #E0E7FF; /* 浅紫色背景 */
	}
	
	.mood-circle.relaxed {
		background-color: #D1FAE5; /* 浅绿色背景 */
	}
	
	.mood-emoji {
		font-size: 40rpx;
		line-height: 1;
	}
	
	.card-meta {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}
	
	.date-text {
		font-size: 28rpx;
		color: #666666;
	}
	
	.separator {
		margin: 0 12rpx;
		color: #999999;
	}
	
	.journal-type {
		display: flex;
		align-items: center;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
	}
	
	.journal-type.awareness {
		background-color: #E0E7FF;
	}
	
	.journal-type.gratitude {
		background-color: #FEF3C7;
	}
	
	.journal-type.emotion {
		background-color: #D1FAE5;
	}
	
	.journal-type.goal {
		background-color: #DBEAFE;
	}
	.journal-type.reflection {
		background-color: #F3E8FF;
	}
	
	.type-icon {
		font-size: 20rpx;
		margin-right: 6rpx;
	}
	
	.journal-type.awareness .type-icon, .journal-type.awareness .type-text {
		color: #4F46E5;
	}
	
	.journal-type.gratitude .type-icon, .journal-type.gratitude .type-text {
		color: #D97706;
	}
	
	.journal-type.gratitude .type-icon, .journal-type.gratitude .type-text {
		color: #D97706;
	}
	
	.journal-type.reflection .type-icon, .journal-type.reflection .type-text {
		color:  #7C3AED;
	}
	
	.type-text {
		font-size: 26rpx;
	}
	
	.card-text {
		font-size: 28rpx;
		line-height: 1.5;
		color: #333333;
	}
	
	.card-actions {
		display: flex;
		border-top: 1px solid #F3F4F6;
	}
	
	.action-button {
		flex: 1;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.action-icon {
		font-size: 24rpx;
		margin-right: 8rpx;
	}
	
	.action-text {
		font-size: 28rpx;
	}
	
	.action-button.insights {
		color: #4F46E5;
	}
	
	.action-button.edit {
		color: #666666;
	}
	
	.action-divider {
		width: 1px;
		background-color: #F3F4F6;
	}
	
	/* 悬浮按钮样式 */
	.floating-button {
		position: fixed;
		bottom: 140rpx;
		right: 40rpx;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
		background-color: #4F46E5;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 6rpx 16rpx rgba(79, 70, 229, 0.3);
		z-index: 100;
	}
	
	.add-icon {
		font-size: 40rpx;
		color: #FFFFFF;
	}
	
	/* 日记类型菜单样式 */
	.type-menu {
		position: fixed;
		bottom: 180rpx;
		right: 40rpx;
		width: 460rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
		transform: translateY(100rpx);
		opacity: 0;
		pointer-events: none;
		transition: all 0.3s;
		z-index: 99;
	}
	
	.type-menu.active {
		transform: translateY(0);
		opacity: 1;
		pointer-events: auto;
	}
	
	.menu-header {
		padding: 20rpx;
		border-bottom: 1px solid #F3F4F6;
	}
	
	.menu-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
	}
	
	.menu-options {
		padding: 10rpx;
	}
	
	.menu-option {
		display: flex;
		align-items: center;
		padding: 16rpx;
		border-radius: 16rpx;
		transition: background-color 0.2s;
	}
	
	.menu-option:active {
		background-color: #F9FAFB;
	}
	
	.option-icon {
		width: 64rpx;
		height: 64rpx;
		border-radius: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 16rpx;
	}
	
	.option-icon.awareness {
		background-color: #E0E7FF;
		color: #4F46E5;
	}
	
	.option-icon.gratitude {
		background-color: #FEF3C7;
		color: #D97706;
	}
	
	.option-icon.emotion {
		background-color: #D1FAE5;
		color: #059669;
	}
	
	.option-icon.goal {
		background-color: #DBEAFE;
		color: #2563EB;
	}
	
	.option-icon.reflection {
		background-color: #F3E8FF;
		color: #7C3AED;
	}
	
	.option-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		display: block;
	}
	
	.option-desc {
		font-size: 24rpx;
		color: #666666;
		display: block;
	}
	
	.list-item {
	  padding: 20rpx;
	  border-bottom: 1px solid #eee;
	  font-size: 28rpx;
	}
	
	.loading-tips {
	  text-align: center;
	  padding: 20rpx;
	  color: #999;
	  font-size: 24rpx;
	}
	
</style> 