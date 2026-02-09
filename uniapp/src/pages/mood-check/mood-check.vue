<template>
	<page-root >
		<template v-slot:header>
		</template>
		<template v-slot:body>
			<view class="container">
				<!-- 内容区域 -->
				<view class="main-content">
					<!-- 日期选择器 -->
					<view class="date-selector">
						<view class="date-nav">
							<view class="date-arrow" @click="changeDate(-1)">
								<text class="date-arrow-icon">〈</text>
							</view>
							<view class="date-container" @click="showDatePicker = true">
								<text class="date-text">{{ formattedDate }}</text>
								<text class="weekday-text">{{ weekday }}</text>
							</view>
							<view class="date-arrow" :class="{'disabled': isToday}" @click="changeDate(1)">
								<text class="date-arrow-icon">〉</text>
							</view>
						</view>
					</view>
					
					<!-- 情绪选择 -->
					<view class="section">
						<text class="section-title">你今天感觉如何?</text>
						
						<view class="mood-grid">
							<!-- 开心 -->
							<view class="mood-card" :class="{'selected': selectedMood === 'happy'}" @click="selectMood('happy')">
								<text class="mood-emoji">😊</text>
								<text class="mood-text">开心</text>
							</view>
							
							<!-- 平静 -->
							<view class="mood-card" :class="{'selected': selectedMood === 'calm'}" @click="selectMood('calm')">
								<text class="mood-emoji">😌</text>
								<text class="mood-text">平静</text>
							</view>
							
							<!-- 疲惫 -->
							<view class="mood-card" :class="{'selected': selectedMood === 'tired'}" @click="selectMood('tired')">
								<text class="mood-emoji">😓</text>
								<text class="mood-text">疲惫</text>
							</view>
							
							<!-- 焦虑 -->
							<view class="mood-card" :class="{'selected': selectedMood === 'anxious'}" @click="selectMood('anxious')">
								<text class="mood-emoji">😰</text>
								<text class="mood-text">焦虑</text>
							</view>
							
							<!-- 生气 -->
							<view class="mood-card" :class="{'selected': selectedMood === 'angry'}" @click="selectMood('angry')">
								<text class="mood-emoji">😠</text>
								<text class="mood-text">生气</text>
							</view>
							
							<!-- 悲伤 -->
							<view class="mood-card" :class="{'selected': selectedMood === 'sad'}" @click="selectMood('sad')">
								<text class="mood-emoji">😢</text>
								<text class="mood-text">悲伤</text>
							</view>
						</view>
					</view>
					
					<!-- 情绪强度 -->
					<view class="section">
						<text class="section-title">情绪强度</text>
						<view class="intensity-container">
							<view class="intensity-labels">
								<text class="intensity-label">轻微</text>
								<text class="intensity-label">中等</text>
								<text class="intensity-label">强烈</text>
							</view>
							<slider :value="intensity" min="1" max="5" :block-size="24" block-color="#1e80ff" activeColor="#1e80ff" backgroundColor="#EEEEEE" @change="onIntensityChange" />
						</view>
					</view>
					
					<!-- 备注 -->
					<view class="section note-section">
						<view class="note-container">
							<textarea class="note-textarea" v-model="note" placeholder="记录一下你的想法..." />
						</view>
					</view>
					
					<!-- 情绪触发因素 -->
					<view class="section trigger-section">
						<text class="section-title">情绪触发因素</text>
						<view class="triggers-container">
							<view class="triggers-list">
								<view v-for="(trigger, index) in selectedTriggers" :key="index" class="trigger-tag">
									<text>{{ trigger }}</text>
									<text class="trigger-remove" @click="removeTrigger(index)">×</text>
								</view>
								<view class="trigger-add" @click="addNewTrigger">
									<text class="add-icon">+</text>
									<text>添加</text>
								</view>
							</view>
						</view>
					</view>
					
				</view>
				
				<!-- 日期选择弹出层 -->
				<view v-if="showDatePicker" class="date-picker-mask" @click="showDatePicker = false">
					<view class="date-picker-container" @click.stop>
						<view class="date-picker-header">
							<text class="date-picker-title">选择日期</text>
							<text class="date-picker-close" @click="showDatePicker = false">×</text>
						</view>
						<view class="date-picker-controls">
							<view class="date-picker-arrow" @click="changeMonth(-1)">
								<text>〈</text>
							</view>
							<text class="date-picker-current-month">{{ currentYearMonth }}</text>
							<view class="date-picker-arrow" :class="{'disabled': isCurrentMonth}" @click="changeMonth(1)">
								<text>〉</text>
							</view>
						</view>
						<view class="date-picker-weekdays">
							<text v-for="(day, index) in ['日', '一', '二', '三', '四', '五', '六']" :key="index" class="date-picker-weekday">{{ day }}</text>
						</view>
						<view class="date-picker-days">
							<view 
								v-for="(day, index) in daysInMonth" 
								:key="index" 
								class="date-picker-day" 
								:class="{
									'date-picker-day-current': day.isCurrentDay,
									'date-picker-day-selected': day.isSelected,
									'date-picker-day-disabled': day.isDisabled,
									'date-picker-day-empty': !day.day
								}"
								@click="selectDate(day)"
							>
								<text v-if="day.day">{{ day.day }}</text>
							</view>
						</view>
						<view class="date-picker-actions">
							<button class="date-picker-button date-picker-button-cancel" @click="showDatePicker = false">取消</button>
							<button class="date-picker-button date-picker-button-confirm" @click="confirmDateSelection">确定</button>
						</view>
					</view>
				</view>
			</view>
		</template>
		<template v-slot:footer>
			<!-- 底部按钮 -->
			<view class="footer" v-if="isToday">
				<button class="submit-button" @click="saveMoodCheck" v-show="isMoodCheck==false">
					保存打卡
				</button>
				<button class="submit-button" v-show="isMoodCheck==true" style="background-color:rgba(0, 0, 0, 0.3)">
					已打卡
				</button>
			</view>
		</template>
	</page-root>

	
</template>

<script>
	import { awarenessAdd,awarenessSelectOne } from '@/api/awareness'
	import { getToken } from '@/utils/auth'
	export default {
		data() {
			return {
				currentDate: new Date(),
				tempDate: null, // 临时日期，用于日期选择器
				selectedMood: 'happy',
				intensity: 3,
				selectedTriggers: [],
				newTrigger: '',
				showTriggerInput: false,
				note: '',
				triggerOptions: ['工作', '人际关系', '健康', '财务', '家庭', '学习'],
				showDatePicker: false,
				isMoodCheck:false
			}
		},
		computed: {
			formattedDate() {
				const year = this.currentDate.getFullYear();
				const month = this.currentDate.getMonth() + 1;
				const day = this.currentDate.getDate();
				return `${year}年${month}月${day}日`;
			},
			formattedBusdate() {
				const year = this.currentDate.getFullYear();
				var month = this.currentDate.getMonth() + 1;
				var day = this.currentDate.getDate();
				month = month<10?'0'+month:month;
				day = day<10?'0'+day:day;
				return `${year}${month}${day}`;
			},
			weekday() {
				const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
				return weekdays[this.currentDate.getDay()];
			},
			isToday() {
				const today = new Date();
				return (
					this.currentDate.getFullYear() === today.getFullYear() &&
					this.currentDate.getMonth() === today.getMonth() &&
					this.currentDate.getDate() === today.getDate()
				);
			},
			currentYearMonth() {
				const date = this.tempDate || this.currentDate;
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				return `${year}年${month}月`;
			},
			isCurrentMonth() {
				const today = new Date();
				const date = this.tempDate || this.currentDate;
				return (
					date.getFullYear() === today.getFullYear() &&
					date.getMonth() === today.getMonth()
				);
			},
			daysInMonth() {
				const date = this.tempDate || this.currentDate;
				const year = date.getFullYear();
				const month = date.getMonth();
				
				// 当月第一天是星期几
				const firstDay = new Date(year, month, 1).getDay();
				
				// 当月天数
				const daysInMonth = new Date(year, month + 1, 0).getDate();
				
				const days = [];
				
				// 填充前面的空白
				for (let i = 0; i < firstDay; i++) {
					days.push({ day: null });
				}
				
				const today = new Date();
				
				// 填充日期
				for (let i = 1; i <= daysInMonth; i++) {
					const dayDate = new Date(year, month, i);
					const isSelected = this.currentDate.getFullYear() === year && 
									 this.currentDate.getMonth() === month && 
									 this.currentDate.getDate() === i;
					
					const isCurrentDay = today.getFullYear() === year && 
									  today.getMonth() === month && 
									  today.getDate() === i;
					
					const isDisabled = dayDate > today;
					
					days.push({
						day: i,
						date: dayDate,
						isSelected,
						isCurrentDay,
						isDisabled
					});
				}
				
				// 补全到42个格子（6行7列）
				while (days.length < 42) {
					days.push({ day: null });
				}
				
				return days;
			}
		},
		onLoad() {
			this.selectMoodCheck();
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			changeDate(days) {
				// 如果是今天且尝试前进，则不执行
				if (this.isToday && days > 0) return;
				
				const newDate = new Date(this.currentDate);
				newDate.setDate(newDate.getDate() + days);
				this.currentDate = newDate;
				this.selectMoodCheck();
			},
			changeMonth(months) {
				// 如果是当前月且尝试前进，则不执行
				if (this.isCurrentMonth && months > 0) return;
				
				const date = this.tempDate || new Date(this.currentDate);
				const newDate = new Date(date);
				newDate.setMonth(newDate.getMonth() + months);
				this.tempDate = newDate;
			},
			selectDate(day) {
				if (!day.day || day.isDisabled) return;
				
				const selectedDate = new Date(day.date);
				this.tempDate = selectedDate;
			},
			confirmDateSelection() {
				if (this.tempDate) {
					this.currentDate = new Date(this.tempDate);
				}
				this.showDatePicker = false;
			},
			selectMood(mood) {
				this.selectedMood = mood;
			},
			onIntensityChange(e) {
				this.intensity = e.detail.value;
			},
			addNewTrigger() {
				uni.showActionSheet({
					itemList: this.triggerOptions.filter(item => !this.selectedTriggers.includes(item)),
					success: (res) => {
						const selectedTrigger = this.triggerOptions.filter(item => !this.selectedTriggers.includes(item))[res.tapIndex];
						if (selectedTrigger && !this.selectedTriggers.includes(selectedTrigger)) {
							this.selectedTriggers.push(selectedTrigger);
						}
					}
				});
			},
			removeTrigger(index) {
				this.selectedTriggers.splice(index, 1);
			},
			selectMoodCheck(){
				this.isMoodCheck = false;
				const moodData = {
					busdate: this.formattedBusdate,
					recordType:"check"
				};
				const getData = async () => {
				    const resdata = await awarenessSelectOne(moodData);
					if(resdata){
						this.selectedMood = resdata.mood;
						this.intensity = resdata.moodLevel?resdata.moodLevel:1;
						this.selectedTriggers = resdata.tags?resdata.tags.split(","):[];
						this.note = resdata.content;
						if(resdata.id != null){
							this.isMoodCheck = true;
						}						
					}
				}				
				getData();
			},
			saveMoodCheck() {
				// 验证表单
				if (!this.selectedMood) {
					uni.showToast({
						title: '请选择情绪状态',
						icon: 'none'
					});
					return;
				}
				
				// 构建数据对象
				const moodData = {
					name:"打卡",
					busdate: this.formattedBusdate,
					recordType:"check",
					mood: this.selectedMood,
					moodLevel: this.intensity,
					tagsList: this.selectedTriggers,
					content: this.note,
					isOpen:1
				};
				
				const token = getToken();
				if(!token){
					uni.showToast({
						title:"请先登录"
					})
				}else{
					uni.showLoading({
						title: '保存中...'
					});
				}
				
				const getData = async () => {
				    const resdata = await awarenessAdd(moodData);
					uni.hideLoading();
					console.log(resdata)
					uni.showToast({
						title: '打卡成功',
						icon: 'success'
					});
					// 跳转回首页
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}				
				getData();
				console.log('保存的情绪数据:', moodData);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
	}
	
	.placeholder {
		width: 60rpx;
	}
	
	.main-content {
	}
	
	.date-selector {
		padding: 30rpx 30rpx;
		
	}
	
	.date-nav {
		background-color: #fff;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 20rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}
	
	.date-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.date-text {
		font-size: 36rpx;
		font-weight: 600;
		color: #333333;
		line-height: 1.4;
	}
	
	.weekday-text {
		font-size: 28rpx;
		color: #666666;
		margin-top: 2rpx;
	}
	
	.date-arrow {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.date-arrow-icon {
		font-size: 36rpx;
		color: #333333;
	}
	
	.date-arrow.disabled {
		opacity: 0.3;
	}
	
	.section {
		margin: 0 30rpx 40rpx;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.section-title {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #333333;
		margin-bottom: 30rpx;
	}
	
	.mood-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, auto);
		gap: 16rpx;
	}
	
	.mood-card {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 24rpx 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
	}
	
	.mood-card.selected {
		background-color: #EBF5FF;
	}
	
	.mood-emoji {
		font-size: 48rpx;
		margin-bottom: 12rpx;
	}
	
	.mood-text {
		font-size: 28rpx;
		color: #333333;
	}
	
	.intensity-container {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 30rpx;
	}
	
	.intensity-labels {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
	}
	
	.intensity-label {
		font-size: 26rpx;
		color: #666666;
	}
	
	.triggers-container {
		padding: 0;
	}
	
	.triggers-list {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}
	
	.trigger-tag {
		background-color: #EBF5FF;
		color: #333333;
		border-radius: 999rpx;
		padding: 12rpx 24rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}
	
	.trigger-remove {
		margin-left: 12rpx;
		font-size: 24rpx;
		color: #666666;
		background-color: rgba(0, 0, 0, 0.1);
		width: 32rpx;
		height: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
	
	.trigger-add {
		color: #333333;
		border-radius: 999rpx;
		padding: 12rpx 24rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
		border: 1rpx solid #DDDDDD;
	}
	
	.add-icon {
		font-size: 28rpx;
		margin-right: 4rpx;
	}
	
	.note-container {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 20rpx;
	}
	
	.note-textarea {
		width: 100%;
		height: 180rpx;
		font-size: 28rpx;
		color: #333333;
		padding: 10rpx;
	}
	
	.date-picker-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.date-picker-container {
		width: 90%;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
	}
	
	.date-picker-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.date-picker-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #333333;
	}
	
	.date-picker-close {
		font-size: 36rpx;
		color: #999999;
	}
	
	.date-picker-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.date-picker-arrow {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666666;
	}
	
	.date-picker-arrow.disabled {
		color: #CCCCCC;
	}
	
	.date-picker-current-month {
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
	}
	
	.date-picker-weekdays {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10rpx;
	}
	
	.date-picker-weekday {
		width: 14.28%;
		text-align: center;
		font-size: 24rpx;
		color: #999999;
	}
	
	.date-picker-days {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 30rpx;
	}
	
	.date-picker-day {
		width: 14.28%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #333333;
		box-sizing: border-box;
		position: relative;
	}
	
	.date-picker-day-empty {
		color: transparent;
	}
	
	.date-picker-day-current {
		color: #1e80ff;
	}
	
	.date-picker-day-selected {
		color: #FFFFFF;
	}
	
	.date-picker-day-selected::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 56rpx;
		height: 56rpx;
		background-color: #1e80ff;
		border-radius: 50%;
		z-index: -1;
	}
	
	.date-picker-day-disabled {
		color: #CCCCCC;
	}
	
	.date-picker-actions {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
	}
	
	.date-picker-button {
		padding: 15rpx 30rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		background-color: #F5F5F5;
		color: #333333;
		border: none;
	}
	
	.date-picker-button-confirm {
		background-color: #1e80ff;
		color: #FFFFFF;
	}
	
	.footer {
		padding: 20rpx 30rpx 40rpx;
		background-color: #FFFFFF;
		border-top: 1rpx solid #EEEEEE;
		width: 100%;
		box-sizing: border-box;
	}
	
	.submit-button {
		background-color: #1e80ff;
		color: #FFFFFF;
		border-radius: 999rpx;
		font-size: 32rpx;
		font-weight: 500;
		padding: 20rpx 0;
		line-height: normal;
	}
</style> 