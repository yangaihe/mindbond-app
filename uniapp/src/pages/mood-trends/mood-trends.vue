<template>
	<page-root :headOpt="{  }">
		<template v-slot:header>
		</template>
		<template v-slot:body>
			<!-- 时间范围选择 -->
			<view class="time-range">
				<view class="range-option" :class="{ active: timeRange === '7days' }" @click="changeTimeRange('7days')">
					<text>7天</text>
					<view v-if="timeRange === '7days'" class="active-indicator"></view>
				</view>
				<view class="range-option" :class="{ active: timeRange === '30days' }" @click="changeTimeRange('30days')">
					<text>30天</text>
					<view v-if="timeRange === '30days'" class="active-indicator"></view>
				</view>
				<view class="range-option" :class="{ active: timeRange === '90days' }" @click="changeTimeRange('90days')">
					<text>90天</text>
					<view v-if="timeRange === '90days'" class="active-indicator"></view>
				</view>
			</view>
			
			<!-- 情绪变化趋势 -->
			<view class="mood-chart-section" v-show="false">
				<text class="section-title">情绪变化趋势</text>
				<view class="trend-chart">
					<view class="y-axis">
						<text class="y-axis-label">很好</text>
						<text class="y-axis-label">良好</text>
						<text class="y-axis-label">一般</text>
						<text class="y-axis-label">较差</text>
						<text class="y-axis-label">很差</text>
					</view>
					<view class="chart-area">
						<view class="grid-lines">
							<view class="grid-line" v-for="i in 5" :key="i"></view>
						</view>
						<view class="trend-line">
							<!-- 折线图路径 -->
							<svg class="line-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
								<polyline
									:points="trendLinePoints"
									fill="none"
									stroke="#5e50ff"
									stroke-width="3"
								/>
								<circle v-for="(point, index) in dataPoints" :key="index"
									:cx="point.x" :cy="point.y" r="6"
									fill="#5e50ff" stroke="#fff" stroke-width="2"
								/>
							</svg>
						</view>
						<view class="x-axis">
							<text class="x-axis-label" v-for="(date, index) in dateLabels" :key="index">{{ date }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 情绪分布 -->
			<view class="mood-distribution-section">
				<text class="section-title">情绪分布<text class=""> (总打卡天数{{totalCount||0}}天)</text></text>
				<view class="distribution-list">
					<view class="distribution-item" v-for="(item, index) in moodDistribution" :key="index">
						<view class="mood-icon" :class="'mood-' + item.type">
							<text class="emoji">{{ item.emoji }}</text>
						</view>
						<view class="distribution-details">
							<view class="mood-name">{{ item.name }}({{item.count||0}}天)</view>
							<view class="progress-bar">
								<view class="progress-fill" :style="{ width: item.percentage + '%', backgroundColor: item.color }"></view>
							</view>
						</view>
						<view class="percentage">{{ item.percentage }}%</view>
					</view>
				</view>
			</view>
			
			<!-- 情绪洞察 -->
			<view class="mood-insight-section" v-show="false">
				<view class="insight-header">
					<view class="insight-icon">
						<text class="insight-icon-img">💡</text>
					</view>
					<text class="insight-title">情绪洞察</text>
				</view>
				<text class="insight-text">在过去的{{ timeRange === '7days' ? '7' : timeRange === '30days' ? '30' : '90' }}天里，你的情绪总体呈现{{ moodInsight.trend }}。{{ moodInsight.mainMoods }}是你最主要的情绪状态，占比达到{{ moodInsight.percentage }}。</text>
				<text class="suggestion-text">建议：{{ moodInsight.suggestion }}</text>
			</view>
		</template>
	</page-root>
</template>

<script lang="ts">
	import { awarenessMoodTrends } from '@/api/awareness'
	export default {
		data() {
			return {
				totalCount:0,
				timeRange: '7days',
				dateLabels: ['6/10', '6/11', '6/12', '6/13', '6/14', '6/15', '6/16'],
				dataPoints: [
					{ x: 0, y: 120, value: 3 },    // 一般
					{ x: 100, y: 80, value: 4 },    // 良好
					{ x: 200, y: 160, value: 2 },   // 较差
					{ x: 300, y: 120, value: 3 },   // 一般
					{ x: 400, y: 40, value: 5 },    // 很好
					{ x: 500, y: 80, value: 4 },    // 良好
					{ x: 600, y: 40, value: 5 }     // 很好
				],
				moodDistribution: [
					{ type: 'happy', emoji: '😊', name: '开心', percentage: 0, color: '#FFC107' },
					{ type: 'calm', emoji: '😌', name: '平静', percentage: 0, color: '#4FC3F7' },
					{ type: 'tired', emoji: '😓', name: '疲惫', percentage: 0, color: '#FF5252' },
					{ type: 'anxious', emoji: '😰', name: '焦虑', percentage: 0, color: '#9575CD' },
					{ type: 'angry', emoji: '😠', name: '生气', percentage: 0, color: '#18bc37' }
				],
				moodInsight: {
					trend: '上升趋势',
					mainMoods: '开心和平静',
					percentage: '70%',
					suggestion: '继续保持积极的生活态度，同时关注疲惫和焦虑情绪的触发因素，适当调整工作节奏和休息时间。'
				}
			}
		},
		computed: {
			trendLinePoints() {
				return this.dataPoints.map(point => `${point.x},${point.y}`).join(' ');
			}
		},
		onLoad(options) {
			// 加载日记数据
			this.changeTimeRange('7days');
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			openCalendar() {
				uni.showToast({
					title: '日历功能开发中',
					icon: 'none'
				});
			},
			changeTimeRange(range) {
				this.timeRange = range;
				const getData = async () => {
				    const resdata = await awarenessMoodTrends({"dataType":range});
					console.log(resdata)
					for(var i in this.moodDistribution){
						this.moodDistribution[i].percentage = resdata[this.moodDistribution[i].type]
						this.moodDistribution[i].count = resdata[this.moodDistribution[i].type+"Count"];
						this.totalCount += this.moodDistribution[i].count;
					}
				}				
				getData();
				// 更新数据
				if (range === '7days') {
					this.dateLabels = ['6/10', '6/11', '6/12', '6/13', '6/14', '6/15', '6/16'];
					this.dataPoints = [
						{ x: 0, y: 120, value: 3 },    // 一般
						{ x: 100, y: 80, value: 4 },    // 良好
						{ x: 200, y: 160, value: 2 },   // 较差
						{ x: 300, y: 120, value: 3 },   // 一般
						{ x: 400, y: 40, value: 5 },    // 很好
						{ x: 500, y: 80, value: 4 },    // 良好
						{ x: 600, y: 40, value: 5 }     // 很好
					];
					this.moodInsight = {
						trend: '上升趋势',
						mainMoods: '开心和平静',
						percentage: '70%',
						suggestion: '继续保持积极的生活态度，同时关注疲惫和焦虑情绪的触发因素，适当调整工作节奏和休息时间。'
					};
					
					//
					
					
				} else if (range === '30days') {
					// 30天的数据
					this.dateLabels = ['5/18', '5/23', '5/28', '6/2', '6/7', '6/12', '6/16'];
					this.dataPoints = [
						{ x: 0, y: 80, value: 4 },     // 良好
						{ x: 100, y: 120, value: 3 },   // 一般
						{ x: 200, y: 40, value: 5 },    // 很好
						{ x: 300, y: 160, value: 2 },   // 较差
						{ x: 400, y: 120, value: 3 },   // 一般
						{ x: 500, y: 80, value: 4 },    // 良好
						{ x: 600, y: 40, value: 5 }     // 很好
					];
					this.moodInsight = {
						trend: '波动趋势',
						mainMoods: '平静和开心',
						percentage: '65%',
						suggestion: '情绪起伏较大，建议多关注情绪变化的原因，保持规律作息，增加户外活动和社交，减少压力源。'
					};
				} else if (range === '90days') {
					// 90天的数据
					this.dateLabels = ['3/20', '4/10', '4/30', '5/20', '6/1', '6/10', '6/16'];
					this.dataPoints = [
						{ x: 0, y: 160, value: 2 },    // 较差
						{ x: 100, y: 120, value: 3 },   // 一般
						{ x: 200, y: 80, value: 4 },    // 良好
						{ x: 300, y: 40, value: 5 },    // 很好
						{ x: 400, y: 80, value: 4 },    // 良好
						{ x: 500, y: 120, value: 3 },   // 一般
						{ x: 600, y: 40, value: 5 }     // 很好
					];
					this.moodInsight = {
						trend: '稳步改善趋势',
						mainMoods: '平静和开心',
						percentage: '60%',
						suggestion: '长期来看情绪正在改善，继续保持良好的生活习惯，定期反思情绪变化，培养积极应对压力的能力。'
					};
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.calendar-icon {
		font-size: 36rpx;
	}
	
	.header-title {
		font-size: 36rpx;
		font-weight: 500;
		color: #333333;
	}
	
	.time-range {
		display: flex;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin: 30rpx;
		overflow: hidden;
	}
	
	.range-option {
		flex: 1;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666666;
		position: relative;
	}
	
	.range-option.active {
		color: #5e50ff;
		font-weight: 500;
	}
	
	.active-indicator {
		position: absolute;
		bottom: 16rpx;
		width: 100rpx;
		height: 4rpx;
		background-color: #5e50ff;
		border-radius: 2rpx;
	}
	
	.section-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.mood-chart-section, .mood-distribution-section, .mood-insight-section {
		margin: 20rpx 30rpx;
		padding: 30rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}
	
	.mood-insight-section {
		margin-bottom: 30rpx;
	}
	
	.trend-chart {
		display: flex;
		height: 400rpx;
		margin-top: 20rpx;
	}
	
	.y-axis {
		width: 80rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 10rpx 0;
	}
	
	.y-axis-label {
		font-size: 22rpx;
		color: #999;
		text-align: left;
	}
	
	.chart-area {
		flex: 1;
		position: relative;
		margin-left: 10rpx;
	}
	
	.grid-lines {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.grid-line {
		width: 100%;
		height: 1rpx;
		background-color: #EEEEEE;
	}
	
	.trend-line {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 30rpx;
	}
	
	.line-svg {
		width: 100%;
		height: 100%;
	}
	
	.x-axis {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 30rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.x-axis-label {
		font-size: 22rpx;
		color: #999;
		text-align: center;
	}
	
	.distribution-list {
		margin-top: 20rpx;
	}
	
	.distribution-item {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.mood-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}
	
	.mood-happy {
		background-color: #FEF3C7;
	}
	
	.mood-calm {
		background-color: #E0E7FF;
	}
	
	.mood-tired {
		background-color: #DBEAFE;
	}
	
	.mood-anxious {
		background-color: #E0E7FF;
	}
	
	.emoji {
		font-size: 40rpx;
	}
	
	.distribution-details {
		flex: 1;
		margin-right: 20rpx;
	}
	
	.mood-name {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.progress-bar {
		height: 16rpx;
		background-color: #F3F4F6;
		border-radius: 8rpx;
		overflow: hidden;
	}
	
	.progress-fill {
		height: 100%;
		border-radius: 8rpx;
	}
	
	.percentage {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		width: 80rpx;
		text-align: right;
	}
	
	.insight-header {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}
	
	.insight-icon {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		background-color: #E0ECFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 16rpx;
	}
	
	.insight-icon-img {
		font-size: 40rpx;
		color: #1e80ff;
	}
	
	.insight-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
	}
	
	.insight-text {
		font-size: 32rpx;
		color: #666666;
		line-height: 1.5;
		margin-bottom: 20rpx;
		display: block;
		padding: 0 4rpx;
	}
	
	.suggestion-text {
		font-size: 32rpx;
		color: #333333;
		line-height: 1.5;
		display: block;
		padding: 0 4rpx;
	}
</style> 