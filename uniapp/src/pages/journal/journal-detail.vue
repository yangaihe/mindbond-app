<template>
	<page-root :headOpt="{}">
		<template v-slot:header>
		</template>
		<template v-slot:body>
			<view style="padding: 40rpx 30rpx;">
				<view class="mb-4">
					<view class="flex items-center text-sm text-gray-500">
						<text>{{ journal.busdate }}</text>
						<text class="mx-2 text-gray-300">·</text>
						<view class="flex items-center">
							<view class="w-5 h-5 rounded-full flex items-center justify-center text-xs mr-1" 
								:class="getMoodBgClass()">
								<text>{{ getMoodEmoji() }}</text>
							</view>
							<text>{{ getMoodName() }}</text>
						</view>
						<text class="mx-2 text-gray-300">·</text>
						<view class="journal-type flex items-center" :class="getTypeBgClass()">
							<text class="fa mr-1 text-xs" :class="getTypeIcon()"></text>
							<text>{{ getTypeName() }}</text>
						</view>
					</view>
				</view>
				
				<!-- 日记内容 -->
				<view class="bg-white rounded-xl px-5 py-5 shadow-sm mb-6">
					<text v-if="journal.content" class="text-gray-700 whitespace-pre-wrap leading-relaxed">{{ journal.content }}</text>
				</view>
				
				<!-- 标签 -->
				<!-- <view class="mb-6">
					<view class="flex flex-wrap gap-2">
						<text  v-if="journal.tags != null" v-for="tag in journal.tags.split(',')" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors">{{tag}}</text>
					</view> 
				</view> -->
				
				<!-- AI洞见分析 -->
				<view class="mb-6">
					<view class="flex items-center mb-4">
						<view class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
							<text class="fa fa-lightbulb text-indigo-500"></text>
						</view>
						<text class="text-lg font-semibold">小心光，想对你说：</text>
					</view>
					
					<view class="bg-white rounded-xl px-5 py-5 shadow-sm">
						<view class="insight-card bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400 mb-4 transform transition-transform hover:scale-[1.01]">
							<view class="message ai-message">
								<view v-if="!(insightData?.htmlContent)">小光正在分析中，请稍等...</view>
								<!-- <rich-text :nodes="insightData?.htmlContent"></rich-text> -->
								 <ua-markdown :source="insightData?.htmlContent" />
							</view>
						</view>
					</view>
					
				</view>
			</view>
		</template>
		<template v-slot:footer>
			<!-- 底部操作栏  -->
			<!-- <view class="bg-white p-4 border-t border-gray-200 flex justify-between">
				<view class="flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors px-3 py-1 rounded-md active:bg-gray-100" @click="editJournal">
					<text class="fa fa-edit mr-2"></text>
					<text>编辑</text>
				</view>
				<view class="flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors px-3 py-1 rounded-md active:bg-gray-100" @click="shareJournal">
					<text class="fa fa-share-alt mr-2"></text>
					<text>分享</text>
				</view>
				
				<view class="flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors px-3 py-1 rounded-md active:bg-gray-100" @click="deleteJournal">
					<text class="fa fa-trash-alt mr-2"></text>
					<text>删除</text>
				</view> 
			</view> -->
		</template>
	</page-root>
</template>

<script lang="ts">
	import { awarenessDetail,awarenessInsights } from '@/api/awareness'
	import { favoriteLogAdd,favoriteLogLists } from '@/api/favorite'
	import { getToken } from '@/utils/auth'
	import { allRoutePathMaps, goto } from '@/utils/untool';

	export default {
		data() {
			return {
				journalId: null,
				tab:null,
				journal: {
					id: '',
					name: '',
					busdate: '',
					type: '',
					mood: '',
					content: '',
					privacy: 'private'
				},
				insightData:{
					htmlContent:"",
					aiContent:"",
					aiSuggest:""
				},
				isFavorite:0
			}
		},
		onLoad(options) {
			this.journalId = options.id;
			this.tab = options.tab;
			const token = getToken();
			if(!token){
				uni.showModal({
					title: '未登录，请先登录',
					content: '查看当前页面内容需要先登录',
					confirmColor: '#FF3B30',
					showCancel:false,
					confirmText:"去登录",
					success: (res) => {
						goto(allRoutePathMaps.login)
					}
				});
				return;
			}
			// 加载日记数据
			this.loadJournalData(options.id);
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			loadJournalData(id) {
				const getData = async () => {
				    const data = await awarenessDetail({id:id})
					this.journal=data
					//AI洞见分析
					const insightDataObj = await awarenessInsights({id:id})
					this.insightData=insightDataObj
					if(insightDataObj == null){
						uni.showLoading({
							title: '小光正在分析中，请稍等...'
						});
						var _this = this;
						var timeInsightData = function(id){
							setTimeout(function(){
								const insightDataFunc = async () => {
									var insightDataTmp = await awarenessInsights({id:id});
									if(insightDataTmp == null){
										timeInsightData(id);
									}else{
										uni.hideLoading();
										_this.insightData=insightDataTmp;
										_this.insightData.htmlContent=_this.insightData.aiContent;
									}
								}
								insightDataFunc();
							},1000)
						}
						timeInsightData(id);
						setTimeout(function(){
							uni.hideLoading();
						},30000)
					}else{
						this.insightData.htmlContent=this.insightData.aiContent;
					}
					
					//收藏
					const favoritelog = await favoriteLogLists({recordType:0,recordId:this.journalId });
					if(favoritelog && favoritelog.count>0){
						this.isFavorite=1;
					}
				}
				getData();
			},
			getMoodEmoji() {
				const moodEmojis = {
					happy: '😊',
					calm: '😌',
					tired: '😓',
					anxious: '😰',
					angry: '😠',
					sad: '😢'
				};
				return moodEmojis[this.journal.mood] || '😊';
			},
			getMoodName() {
				const moodNames = {
					happy: '开心',
					calm: '平静',
					tired: '疲惫',
					anxious: '焦虑',
					angry: '愤怒',
					sad: '难过'
				};
				return moodNames[this.journal.mood] || '开心';
			},
			getMoodBgClass() {
				const moodClasses = {
					happy: 'bg-yellow-100',
					calm: 'bg-green-100',
					tired: 'bg-blue-100',
					anxious: 'bg-red-100',
					angry: 'bg-orange-100',
					sad: 'bg-blue-100'
				};
				return moodClasses[this.journal.mood] || 'bg-yellow-100';
			},
			getTypeIcon() {
				const typeIcons = {
					awareness: 'fa-sun',
					gratitude: 'fa-heart',
					reflection: 'fa-moon',
				};
				return typeIcons[this.journal.recordType] || 'fa-smile';
			},
			getTypeName() {
				const typeNames = {
					awareness: '觉察日记',
					gratitude: '感恩日记',
					reflection: '复盘日记'
				};
				return typeNames[this.journal.recordType] || '觉察日记';
			},
			getTypeBgClass() {
				const typeBgClasses = {
					awareness: 'type-awareness',
					gratitude: 'type-gratitude',
					reflection: 'type-reflection',
				};
				return typeBgClasses[this.journal.recordType] || 'type-awareness';
			},
			
			editJournal() {
				goto(`${allRoutePathMaps.journalEditor}?id=${this.journalId}`)
			},
			shareJournal() {
				uni.showToast({
					title: '分享功能开发中',
					icon: 'none'
				});
			},
			deleteJournal() {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这篇日记吗？删除后无法恢复。',
					confirmColor: '#FF3B30',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '删除中...'
							});
							
							setTimeout(() => {
								uni.hideLoading();
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							}, 1000);
						}
					}
				});
			},
			formattedBusdate() {
				const date = new Date();
				const year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				month = month<10?'0'+month:month;
				day = day<10?'0'+day:day;
				return `${year}${month}${day}`;
			},
			favoriteJournal() {
				if(this.isFavorite == 0){
					favoriteLogAdd({recordType:0,recordId:this.journalId,busdate:this.formattedBusdate() })
					uni.showToast({
						title: '已收藏',
						icon: 'success'
					});
				}
			},
			copyJournal() {
				uni.setClipboardData({
					data: this.journal.content,
					success: () => {
						uni.showToast({
							title: '已复制到剪贴板',
							icon: 'success'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.h-full {
		height: 100vh;
	}
	
	.flex {
		display: flex;
	}
	
	.flex-col {
		flex-direction: column;
	}
	
	.flex-1 {
		flex: 1;
	}
	
	.flex-wrap {
		flex-wrap: wrap;
	}
	
	.items-center {
		align-items: center;
	}
	
	.items-start {
		align-items: flex-start;
	}
	
	.justify-center {
		justify-content: center;
	}
	
	.justify-between {
		justify-content: space-between;
	}
	
	.text-center {
		text-align: center;
	}
	
	.bg-white {
		background-color: #FFFFFF;
	}
	
	.bg-gray-50 {
		background-color: #F9FAFB;
	}
	
	.bg-gray-100 {
		background-color: #F3F4F6;
	}
	
	.bg-indigo-50 {
		background-color: #EEF2FF;
	}
	
	.bg-indigo-100 {
		background-color: #E0E7FF;
	}
	
	.bg-yellow-100 {
		background-color: #FEF3C7;
	}
	
	.bg-green-100 {
		background-color: #D1FAE5;
	}
	
	.bg-red-100 {
		background-color: #FEE2E2;
	}
	
	.bg-blue-100 {
		background-color: #DBEAFE;
	}
	
	.bg-orange-100 {
		background-color: #FFEDD5;
	}
	
	.text-gray-300 {
		color: #D1D5DB;
	}
	
	.text-gray-500 {
		color: #6B7280;
	}
	
	.text-gray-700 {
		color: #374151;
	}
	
	.text-gray-800 {
		color: #1F2937;
	}
	
	.text-indigo-500 {
		color: #6366F1;
	}
	
	.text-indigo-800 {
		color: #3730A3;
	}
	
	.text-green-500 {
		color: #10B981;
	}
	
	.text-sm {
		font-size: 30rpx;
	}
	
	.text-xs {
		font-size: 24rpx;
	}
	
	.text-lg {
		font-size: 32rpx;
	}
	
	.text-2xl {
		font-size: 48rpx;
	}
	
	.font-semibold {
		font-weight: 600;
	}
	
	.font-bold {
		font-weight: 700;
	}
	
	.font-medium {
		font-weight: 500;
	}
	
	.p-4 {
		padding: 32rpx;
	}
	
	.p-5 {
		padding: 40rpx;
	}
	
	.px-3 {
		padding-left: 24rpx;
		padding-right: 24rpx;
	}
	
	.px-4 {
		padding-left: 24rpx;
		padding-right: 24rpx;
	}
	
	.px-5 {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
	
	.py-1 {
		padding-top: 8rpx;
		padding-bottom: 8rpx;
	}
	
	.py-3 {
		padding-top: 24rpx;
		padding-bottom: 24rpx;
	}
	
	.py-5 {
		padding-top: 40rpx;
		padding-bottom: 40rpx;
	}
	
	.m-1 {
		margin: 8rpx;
	}
	
	.mb-1 {
		margin-bottom: 8rpx;
	}
	
	.mb-2 {
		margin-bottom: 16rpx;
	}
	
	.mb-3 {
		margin-bottom: 24rpx;
	}
	
	.mb-4 {
		margin-bottom: 32rpx;
	}
	
	.mb-6 {
		margin-bottom: 48rpx;
	}
	
	.mr-1 {
		margin-right: 8rpx;
	}
	
	.mr-2 {
		margin-right: 16rpx;
	}
	
	.mr-3 {
		margin-right: 24rpx;
	}
	
	.mt-1 {
		margin-top: 8rpx;
	}
	
	.mx-2 {
		margin-left: 16rpx;
		margin-right: 16rpx;
	}
	
	.w-5 {
		width: 40rpx;
	}
	
	.h-5 {
		height: 40rpx;
	}
	
	.w-8 {
		width: 64rpx;
	}
	
	.h-8 {
		height: 64rpx;
	}
	
	.rounded-full {
		border-radius: 999rpx;
	}
	
	.rounded-xl {
		border-radius: 24rpx;
	}
	
	.rounded-lg {
		border-radius: 16rpx;
	}
	
	.rounded-md {
		border-radius: 8rpx;
	}
	
	.rounded-r-lg {
		border-top-right-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
	}
	
	.border {
		border-width: 1rpx;
	}
	
	.border-t {
		border-top-width: 1rpx;
	}
	
	.border-b {
		border-bottom-width: 1rpx;
	}
	
	.border-l-4 {
		border-left-width: 8rpx;
	}
	
	.border-gray-200 {
		border-color: #E5E7EB;
	}
	
	.border-indigo-100 {
		border-color: #E0E7FF;
	}
	
	.border-indigo-400 {
		border-color: #818CF8;
	}
	
	.shadow-sm {
		box-shadow: 0 1rpx 2rpx 0 rgba(0, 0, 0, 0.05);
	}
	
	.overflow-y-auto {
		overflow-y: auto;
	}
	
	.whitespace-pre-wrap {
		white-space: pre-wrap;
	}
	
	.block {
		display: block;
	}
	
	.space-y-2 > view + view {
		margin-top: 16rpx;
	}
	
	.leading-relaxed {
		line-height: 1.625;
	}
	
	.gap-2 {
		gap: 16rpx;
	}
	
	.transition-colors {
		transition-property: color, background-color, border-color;
		transition-duration: 200ms;
	}
	
	.transition-transform {
		transition-property: transform;
		transition-duration: 200ms;
	}
	
	.transform {
		transform: translateZ(0);
	}
	
	.hover\:bg-gray-200:hover {
		background-color: #E5E7EB;
	}
	
	.hover\:text-indigo-500:hover {
		color: #6366F1;
	}
	
	.hover\:scale-\[1\.01\]:hover {
		transform: scale(1.01);
	}
	
	.active\:bg-gray-100:active {
		background-color: #F3F4F6;
	}
	
	.insight-card {
		border-left: 6rpx solid #6366F1;
	}
	
	.journal-type {
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		font-weight: 500;
	}
	
	.type-awareness {
		background-color: #E0E7FF;
		color: #4F46E5;
	}
	
	.type-gratitude {
		background-color: #FEF3C7;
		color: #D97706;
	}
	
	.type-emotion {
		background-color: #DCFCE7;
		color: #15803D;
	}
	
	.type-reflection {
		background-color: #F3E8FF;
		color: #7C3AED;
	}
	
	.type-goal {
		background-color: #DBEAFE;
		color: #1D4ED8;
	}
</style> 