<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="header">
			<view class="back-button" @click="goBack">
				<text class="fa fa-arrow-left text-gray-500"></text>
			</view>
			<text class="header-title">成长报告</text>
			<view class="share-button" @click="shareReport">
				<text class="iconfont icon-share"></text>
			</view>
		</view>
		
		<!-- 报告周期选择 -->
		<view class="report-period">
			<view class="period-button" :class="{ active: period === 'week' }" @click="changePeriod('week')">
				<text>周报告</text>
			</view>
			<view class="period-button" :class="{ active: period === 'month' }" @click="changePeriod('month')">
				<text>月报告</text>
			</view>
		</view>
		
		<!-- 报告日期 -->
		<view class="report-date">
			<view class="date-arrow" @click="prevDate">
				<text class="iconfont icon-arrow-left"></text>
			</view>
			<text class="date-text">{{ getDateRangeText() }}</text>
			<view class="date-arrow" @click="nextDate">
				<text class="iconfont icon-arrow-right"></text>
			</view>
		</view>
		
		<!-- 总览卡片 -->
		<view class="overview-card">
			<view class="overview-header">
				<text class="overview-title">总览</text>
			</view>
			
			<view class="overview-stats">
				<view class="stat-item">
					<text class="stat-value">{{ stats.journalCount }}</text>
					<text class="stat-label">日记数量</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-value">{{ stats.moodCheckCount }}</text>
					<text class="stat-label">情绪打卡</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-value">{{ stats.meditationMinutes }}</text>
					<text class="stat-label">冥想分钟</text>
				</view>
			</view>
			
			<view class="overview-progress">
				<view class="progress-item">
					<view class="progress-header">
						<text class="progress-label">情绪稳定性</text>
						<text class="progress-value">{{ stats.emotionalStability }}%</text>
					</view>
					<view class="progress-bar-bg">
						<view class="progress-bar" :style="{ width: stats.emotionalStability + '%' }"></view>
					</view>
				</view>
				
				<view class="progress-item">
					<view class="progress-header">
						<text class="progress-label">自我觉察</text>
						<text class="progress-value">{{ stats.selfAwareness }}%</text>
					</view>
					<view class="progress-bar-bg">
						<view class="progress-bar" :style="{ width: stats.selfAwareness + '%' }"></view>
					</view>
				</view>
				
				<view class="progress-item">
					<view class="progress-header">
						<text class="progress-label">情绪调节</text>
						<text class="progress-value">{{ stats.emotionRegulation }}%</text>
					</view>
					<view class="progress-bar-bg">
						<view class="progress-bar" :style="{ width: stats.emotionRegulation + '%' }"></view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 情绪趋势 -->
		<view class="mood-trend-card">
			<view class="card-header">
				<text class="card-title">情绪趋势</text>
				<view class="card-action" @click="navigateTo('/pages/mood-trends/mood-trends')">
					<text>查看详情</text>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
			
			<view class="mood-chart">
				<!-- 这里可以放置情绪图表，这里用简单的折线图代替 -->
				<view class="chart-container">
					<view class="chart-y-axis">
						<text v-for="(label, index) in yAxisLabels" :key="index" class="y-label">{{ label }}</text>
					</view>
					<view class="chart-content">
						<view class="chart-lines">
							<view v-for="(line, index) in chartLines" :key="index" class="chart-line"></view>
						</view>
						<view class="chart-data">
							<view 
								v-for="(point, index) in moodData" 
								:key="index" 
								class="data-point"
								:style="{ left: (index / (moodData.length - 1) * 100) + '%', bottom: point.value + '%' }"
							>
								<view class="point-dot" :style="{ backgroundColor: getMoodColor(point.mood) }"></view>
							</view>
							<view 
								v-for="(point, index) in moodData" 
								:key="'line-' + index" 
								class="data-line"
								v-if="index < moodData.length - 1"
								:style="{ 
									left: (index / (moodData.length - 1) * 100) + '%', 
									width: (1 / (moodData.length - 1) * 100) + '%',
									bottom: point.value + '%',
									height: (moodData[index + 1].value - point.value) + '%',
									transform: `skewX(${(moodData[index + 1].value - point.value) > 0 ? '45deg' : '-45deg'}`
								}"
							></view>
						</view>
					</view>
					<view class="chart-x-axis">
						<text v-for="(day, index) in xAxisLabels" :key="index" class="x-label">{{ day }}</text>
					</view>
				</view>
			</view>
			
			<view class="mood-summary">
				<text class="summary-text">本{{ period === 'week' ? '周' : '月' }}情绪整体平稳，积极情绪占比{{ stats.positiveEmotionPercentage }}%，比上{{ period === 'week' ? '周' : '月' }}{{ stats.emotionChangeDirection === 'up' ? '上升' : '下降' }}{{ stats.emotionChangeValue }}%。</text>
			</view>
		</view>
		
		<!-- 日记洞察 -->
		<view class="journal-insights-card">
			<view class="card-header">
				<text class="card-title">日记洞察</text>
			</view>
			
			<view class="insights-content">
				<view class="insight-item" v-for="(insight, index) in journalInsights" :key="index">
					<view class="insight-icon" :style="{ backgroundColor: insight.bgColor }">
						<text class="iconfont" :class="insight.icon"></text>
					</view>
					<view class="insight-text">
						<text class="insight-title">{{ insight.title }}</text>
						<text class="insight-description">{{ insight.description }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 成长建议 -->
		<view class="growth-suggestions-card">
			<view class="card-header">
				<text class="card-title">成长建议</text>
			</view>
			
			<view class="suggestions-content">
				<view class="suggestion-item" v-for="(suggestion, index) in growthSuggestions" :key="index">
					<view class="suggestion-number">{{ index + 1 }}</view>
					<view class="suggestion-text">
						<text class="suggestion-title">{{ suggestion.title }}</text>
						<text class="suggestion-description">{{ suggestion.description }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 习惯养成 -->
		<view class="habits-card">
			<view class="card-header">
				<text class="card-title">习惯养成</text>
			</view>
			
			<view class="habits-content">
				<view class="habit-item" v-for="(habit, index) in habits" :key="index">
					<view class="habit-info">
						<view class="habit-icon" :style="{ backgroundColor: habit.bgColor }">
							<text class="iconfont" :class="habit.icon"></text>
						</view>
						<view class="habit-text">
							<text class="habit-name">{{ habit.name }}</text>
							<text class="habit-streak">已坚持 {{ habit.streak }} 天</text>
						</view>
					</view>
					<view class="habit-progress-bg">
						<view class="habit-progress" :style="{ width: habit.progress + '%' }"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				period: 'week',
				currentDate: new Date(),
				yAxisLabels: ['低', '中', '高'],
				chartLines: [1, 2, 3],
				xAxisLabels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
				moodData: [
					{ value: 30, mood: 'calm' },
					{ value: 45, mood: 'happy' },
					{ value: 40, mood: 'calm' },
					{ value: 25, mood: 'tired' },
					{ value: 35, mood: 'anxious' },
					{ value: 50, mood: 'happy' },
					{ value: 60, mood: 'happy' }
				],
				stats: {
					journalCount: 5,
					moodCheckCount: 7,
					meditationMinutes: 45,
					emotionalStability: 75,
					selfAwareness: 85,
					emotionRegulation: 65,
					positiveEmotionPercentage: 68,
					emotionChangeDirection: 'up',
					emotionChangeValue: 12
				},
				journalInsights: [
					{
						title: '情绪觉察能力提升',
						description: '你在日记中更加细致地描述了自己的情绪体验，表明情绪觉察能力有所提升。',
						icon: 'icon-chart-line',
						bgColor: '#EEF2FF'
					},
					{
						title: '积极思考模式增加',
						description: '你的日记中积极思考的内容增加了25%，这有助于培养乐观的心态。',
						icon: 'icon-smile',
						bgColor: '#DCFCE7'
					},
					{
						title: '自我反思深度增强',
						description: '你的日记展现出更深入的自我反思，这对个人成长非常有益。',
						icon: 'icon-lightbulb',
						bgColor: '#FEF3C7'
					}
				],
				growthSuggestions: [
					{
						title: '增加冥想练习',
						description: '建议每天增加5分钟的冥想练习，有助于提高情绪稳定性和专注力。'
					},
					{
						title: '培养感恩习惯',
						description: '每天记录3件感恩的事情，有助于培养积极心态和幸福感。'
					},
					{
						title: '设定小目标',
						description: '尝试设定一些小而具体的目标，完成后给予自己适当奖励，增强成就感。'
					}
				],
				habits: [
					{
						name: '情绪打卡',
						streak: 15,
						progress: 85,
						icon: 'icon-emotion',
						bgColor: '#FEF3C7'
					},
					{
						name: '冥想练习',
						streak: 8,
						progress: 60,
						icon: 'icon-meditation',
						bgColor: '#F3E8FF'
					},
					{
						name: '日记书写',
						streak: 12,
						progress: 75,
						icon: 'icon-journal',
						bgColor: '#E0E7FF'
					}
				]
			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			shareReport() {
				uni.showToast({
					title: '分享功能开发中',
					icon: 'none'
				});
			},
			changePeriod(period) {
				this.period = period;
				
				// 更新数据
				this.updateReportData();
			},
			prevDate() {
				const date = new Date(this.currentDate);
				if (this.period === 'week') {
					date.setDate(date.getDate() - 7);
				} else {
					date.setMonth(date.getMonth() - 1);
				}
				this.currentDate = date;
				
				// 更新数据
				this.updateReportData();
			},
			nextDate() {
				const date = new Date(this.currentDate);
				if (this.period === 'week') {
					date.setDate(date.getDate() + 7);
				} else {
					date.setMonth(date.getMonth() + 1);
				}
				
				// 不允许查看未来的报告
				const now = new Date();
				if (date > now) {
					uni.showToast({
						title: '无法查看未来的报告',
						icon: 'none'
					});
					return;
				}
				
				this.currentDate = date;
				
				// 更新数据
				this.updateReportData();
			},
			getDateRangeText() {
				const date = this.currentDate;
				let startDate, endDate;
				
				if (this.period === 'week') {
					// 获取所在周的周一和周日
					const day = date.getDay() || 7; // 将周日的0转为7
					startDate = new Date(date);
					startDate.setDate(date.getDate() - day + 1);
					endDate = new Date(startDate);
					endDate.setDate(startDate.getDate() + 6);
				} else {
					// 获取所在月的第一天和最后一天
					startDate = new Date(date.getFullYear(), date.getMonth(), 1);
					endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
				}
				
				// 格式化日期
				const formatDate = (date) => {
					return `${date.getMonth() + 1}月${date.getDate()}日`;
				};
				
				return `${formatDate(startDate)} - ${formatDate(endDate)}`;
			},
			updateReportData() {
				// 根据周期和日期更新报告数据
				// 这里使用模拟数据
				
				if (this.period === 'week') {
					this.xAxisLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
					this.moodData = [
						{ value: 30, mood: 'calm' },
						{ value: 45, mood: 'happy' },
						{ value: 40, mood: 'calm' },
						{ value: 25, mood: 'tired' },
						{ value: 35, mood: 'anxious' },
						{ value: 50, mood: 'happy' },
						{ value: 60, mood: 'happy' }
					];
					this.stats = {
						journalCount: 5,
						moodCheckCount: 7,
						meditationMinutes: 45,
						emotionalStability: 75,
						selfAwareness: 85,
						emotionRegulation: 65,
						positiveEmotionPercentage: 68,
						emotionChangeDirection: 'up',
						emotionChangeValue: 12
					};
				} else {
					this.xAxisLabels = ['第1周', '第2周', '第3周', '第4周'];
					this.moodData = [
						{ value: 35, mood: 'calm' },
						{ value: 50, mood: 'happy' },
						{ value: 45, mood: 'calm' },
						{ value: 55, mood: 'happy' }
					];
					this.stats = {
						journalCount: 18,
						moodCheckCount: 25,
						meditationMinutes: 180,
						emotionalStability: 80,
						selfAwareness: 90,
						emotionRegulation: 70,
						positiveEmotionPercentage: 72,
						emotionChangeDirection: 'up',
						emotionChangeValue: 8
					};
				}
			},
			getMoodColor(mood) {
				const moodColors = {
					happy: '#FEF9C3',
					calm: '#F3E8FF',
					tired: '#E0E7FF',
					anxious: '#FEE2E2',
					angry: '#FFEDD5',
					sad: '#DBEAFE'
				};
				return moodColors[mood] || '#EEEEEE';
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #F8FAFC;
		padding-bottom: 30rpx;
	}
	
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		height: 90rpx;
		background-color: #FFFFFF;
		border-bottom: 1rpx solid #EEEEEE;
	}
	
	.back-button, .share-button {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		color: #666666;
	}
	
	.header-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #333333;
	}
	
	.report-period {
		display: flex;
		background-color: #FFFFFF;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid #EEEEEE;
	}
	
	.period-button {
		flex: 1;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666666;
		border-radius: 30rpx;
		margin: 0 10rpx;
		transition: all 0.2s;
	}
	
	.period-button.active {
		background-color: #6366F1;
		color: #FFFFFF;
	}
	
	.report-date {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
		background-color: #FFFFFF;
		border-bottom: 1rpx solid #EEEEEE;
	}
	
	.date-arrow {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		color: #666666;
	}
	
	.date-text {
		font-size: 28rpx;
		color: #333333;
		margin: 0 20rpx;
	}
	
	.overview-card, .mood-trend-card, .journal-insights-card, .growth-suggestions-card, .habits-card {
		margin: 20rpx 30rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	
	.overview-header, .card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.overview-title, .card-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333333;
	}
	
	.card-action {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #6366F1;
	}
	
	.card-action .iconfont {
		margin-left: 8rpx;
		font-size: 24rpx;
	}
	
	.overview-stats {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 30rpx;
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.stat-value {
		font-size: 36rpx;
		font-weight: 600;
		color: #333333;
		margin-bottom: 8rpx;
	}
	
	.stat-label {
		font-size: 24rpx;
		color: #999999;
	}
	
	.stat-divider {
		width: 1rpx;
		height: 50rpx;
		background-color: #EEEEEE;
	}
	
	.overview-progress {
		margin-top: 20rpx;
	}
	
	.progress-item {
		margin-bottom: 20rpx;
	}
	
	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.progress-label {
		font-size: 26rpx;
		color: #666666;
	}
	
	.progress-value {
		font-size: 26rpx;
		color: #333333;
		font-weight: 500;
	}
	
	.progress-bar-bg {
		height: 16rpx;
		background-color: #F3F4F6;
		border-radius: 8rpx;
		overflow: hidden;
	}
	
	.progress-bar {
		height: 100%;
		background-color: #6366F1;
		border-radius: 8rpx;
		transition: width 0.3s;
	}
	
	.mood-chart {
		height: 300rpx;
		margin: 30rpx 0;
	}
	
	.chart-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		position: relative;
	}
	
	.chart-y-axis {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 10rpx 0;
	}
	
	.y-label {
		font-size: 22rpx;
		color: #999999;
	}
	
	.chart-content {
		flex: 1;
		margin-left: 40rpx;
		position: relative;
	}
	
	.chart-lines {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.chart-line {
		height: 1rpx;
		background-color: #EEEEEE;
		width: 100%;
	}
	
	.chart-data {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	
	.data-point {
		position: absolute;
		transform: translate(-50%, 50%);
	}
	
	.point-dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		border: 2rpx solid #FFFFFF;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}
	
	.data-line {
		position: absolute;
		background-color: #EEEEEE;
		transform-origin: bottom left;
	}
	
	.chart-x-axis {
		display: flex;
		justify-content: space-between;
		margin-left: 40rpx;
		margin-top: 10rpx;
	}
	
	.x-label {
		font-size: 22rpx;
		color: #999999;
		text-align: center;
		flex: 1;
	}
	
	.mood-summary {
		margin-top: 20rpx;
	}
	
	.summary-text {
		font-size: 26rpx;
		color: #666666;
		line-height: 1.5;
	}
	
	.insights-content, .suggestions-content, .habits-content {
		margin-top: 20rpx;
	}
	
	.insight-item {
		display: flex;
		align-items: flex-start;
		padding: 20rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}
	
	.insight-icon {
		width: 60rpx;
		height: 60rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		color: #6366F1;
		margin-right: 20rpx;
	}
	
	.insight-text {
		flex: 1;
	}
	
	.insight-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		margin-bottom: 8rpx;
		display: block;
	}
	
	.insight-description {
		font-size: 26rpx;
		color: #666666;
		line-height: 1.5;
	}
	
	.suggestion-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}
	
	.suggestion-number {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background-color: #6366F1;
		color: #FFFFFF;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		margin-top: 4rpx;
	}
	
	.suggestion-text {
		flex: 1;
	}
	
	.suggestion-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		margin-bottom: 8rpx;
		display: block;
	}
	
	.suggestion-description {
		font-size: 26rpx;
		color: #666666;
		line-height: 1.5;
	}
	
	.habit-item {
		margin-bottom: 20rpx;
	}
	
	.habit-info {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.habit-icon {
		width: 50rpx;
		height: 50rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #6366F1;
		margin-right: 16rpx;
	}
	
	.habit-text {
		flex: 1;
	}
	
	.habit-name {
		font-size: 26rpx;
		color: #333333;
		margin-bottom: 4rpx;
		display: block;
	}
	
	.habit-streak {
		font-size: 22rpx;
		color: #999999;
	}
	
	.habit-progress-bg {
		height: 12rpx;
		background-color: #F3F4F6;
		border-radius: 6rpx;
		overflow: hidden;
	}
	
	.habit-progress {
		height: 100%;
		background-color: #6366F1;
		border-radius: 6rpx;
		transition: width 0.3s;
	}
</style> 