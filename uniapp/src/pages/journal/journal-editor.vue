<template>
	<page-root :headOpt="{ title: journalId ? '修改日记' : '心光练习' }">
		<template v-slot:header>
		</template>
		<template v-slot:body>
			<view class="pl-4 pr-4">
				<view class="pt-6 pb-6 text-center">
					<text class="text-gray-500 text-lg">{{ getCurrentDate() }}</text>
				</view>
				
				<view class="bg-white rounded-xl p-5 mb-4">
					<view class="flex space-x-2 overflow-x-auto" style="scroll-behavior: smooth;">
						
						<view 
							v-for="(type, key) in journalTypes" 
							:key="key"
							class="journal-type-option flex items-center px-4 py-2.5 rounded-full"
							:class="journal.recordType === key ? 'bg-indigo-100 active' : 'bg-gray-100'"
							@click="journal.recordType = key"
						>
							<text 
								class="fa mr-2"
								:class="type.icon"
								:style="{ color: journal.recordType === key ? '#6366F1' : '#6B7280' }"
							></text>
							<text 
								:style="{ color: journal.recordType === key ? '#6366F1' : '#6B7280' }" style="white-space: nowrap;"
							>{{ type.name }}</text>
						</view>
						
					</view>
				</view>
				
				<view class="bg-white rounded-b-xl p-5 mb-4">
					<textarea 
						class="note-textarea w-full min-h-[300rpx]" 
						v-model="journal.content" 
						maxlength="2000"
						placeholder= "记录今天的点滴，看见自己、心怀感恩、持续成长！" 
					/>
				</view>
				
				<view  class="bg-white rounded-xl p-5 mb-0">
					<view>
						<radio-group >
							<label class="radio" style="margin-right:15px;"><radio value="1" :checked="journal.isOpen ==1" @click="journal.isOpen =1"/>公开记录</label>
							<label class="radio"><radio value="0" :checked="journal.isOpen ==0" @click="journal.isOpen =0"/>仅自己可见</label>&nbsp;
						</radio-group>
					</view>
				</view>
			</view>
		</template>
		<template v-slot:footer>
			<view class="footer">
				<button class="bg-indigo-600 text-white px-5 py-1.5 text-base" style="padding: 0 20px;" @click="saveJournal">发布</button>
			</view>
		</template>
	</page-root>
</template>

<script lang="ts">
import { awarenessAdd, awarenessSelectOne,awarenessEdit} from '@/api/awareness'
import { getToken } from '@/utils/auth'
import { allRoutePathMaps, goto } from '@/utils/untool';
export default {
	data() {
		return {
			scrollPosition:0,
			scrollLeft:200,
			selectedTriggers: [],
			newTrigger: '',
			showTriggerInput: true,
			note: '',
			triggerOptions: ['工作', '人际关系', '健康', '财务', '家庭', '学习'],
			journalId:null,
			journal: {
				id: '',
				name: '',
				recordType: 'morning',
				mood: 'happy',
				content: '',
				date: '',
				isOpen: 1
			},
			journalTypes: {
				awareness: {
					name: '觉察日记',
					icon: 'fa-sun'
				},
				gratitude: {
					name: '感恩日记',
					icon: 'fa-heart'
				},
				reflection: {
					name: '复盘日记',
					icon: 'fa-moon'
				}
	
			},
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
			}
		}
	},
	onLoad(options) {
		this.journalId = options.id;
		if(options && options.type){
			this.journal.recordType = options.type;
			
		}		
		
		if (options && options.id) {
			this.loadJournalData(options.id);
		}
		
		const now = new Date();
		this.journal.date = this.formatDate(now);
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		getCurrentDate() {
			const now = new Date();
			const year = now.getFullYear();
			const month = now.getMonth() + 1;
			const day = now.getDate();
			const weekDay = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
			
			return `${year}年${month}月${day}日 星期${weekDay}`;
		},
		formatDate(date) {
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const day = date.getDate();
			
			return `${year}年${month}月${day}日`;
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
		loadJournalData(id) {
			const getData = async () => {
			    const data = await awarenessSelectOne({id:id})
				this.journal=data
				this.selectedTriggers = data.tags?data.tags.split(","):[];				
				console.log(this.journal)
			}
			getData();
		},
		saveJournal() {
			// 构建数据对象
			const moodData = {
				id:this.journalId,
				name:'',
				busdate: this.formattedBusdate(),
				recordType:this.journal.recordType,
				mood: this.journal.mood,
				content: this.journal.content,
				isOpen:this.journal.isOpen,
				tagsList: this.selectedTriggers,
			};
			if(this.journal.content == null || this.journal.content == ''){
				uni.showToast({
				  title: '请输入觉察内容', 
				  icon: 'none', // 图标，默认为success，设置为'none'则不显示图标
				  duration: 2000, // 提示的持续时间，单位为毫秒，默认1500
				  mask: false // 是否显示透明蒙层，防止触摸穿透，默认：false
				});
				return;
			}
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
			
			const saveData = async () => {
				if(this.journalId != null){
					moodData.id = this.journalId;
					const resdata = await awarenessEdit(moodData);
				}else{
					const resdata = await awarenessAdd(moodData);
				}			    
				uni.hideLoading();
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
				goto(allRoutePathMaps.journalList);
			}				
			saveData();
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

.justify-around {
	justify-content: space-around;
}

.space-x-2 > * + * {
	margin-left: 16rpx;
}

.space-x-4 > * + * {
	margin-left: 32rpx;
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

.bg-indigo-100 {
	background-color: #E0E7FF;
}

.bg-indigo-600 {
	background-color: #4F46E5;
}

.bg-yellow-100 {
	background-color: #FEF3C7;
}

.bg-gray-300 {
	background-color: #D1D5DB;
}

.text-white {
	color: #FFFFFF;
}

.text-gray-400 {
	color: #9CA3AF;
}

.text-gray-500 {
	color: #6B7280;
}

.text-gray-600 {
	color: #4B5563;
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

.text-sm {
	font-size: 28rpx;
}

.text-base {
	font-size: 32rpx;
}

.text-lg {
	font-size: 36rpx;
}

.text-xl {
	font-size: 40rpx;
}

.text-2xl {
	font-size: 48rpx;
}

.text-xs {
	font-size: 24rpx;
}

.font-medium {
	font-weight: 500;
}

.p-1 {
	padding: 8rpx;
}

.p-3 {
	padding: 24rpx;
}

.p-5 {
	padding: 40rpx;
}

.px-3 {
	padding-left: 24rpx;
	padding-right: 24rpx;
}

.px-4 {
	padding-left: 20rpx;
	padding-right: 20rpx;
}

.px-5 {
	padding-left: 28rpx;
	padding-right: 28rpx;
}

.py-1 {
	padding-top: 8rpx;
	padding-bottom: 8rpx;
}

.py-1\.5 {
	padding-top: 12rpx;
	padding-bottom: 12rpx;
}

.py-2\.5 {
	padding-top: 10rpx;
	padding-bottom: 10rpx;
}

.py-3 {
	padding-top: 24rpx;
	padding-bottom: 24rpx;
}

.pt-2 {
	padding-top: 16rpx;
}

.pt-5 {
	padding-top: 40rpx;
}

.pb-1 {
	padding-bottom: 8rpx;
}

.mb-2 {
	margin-bottom: 16rpx;
}

.mb-4 {
	margin-bottom: 32rpx;
}

.mb-6 {
	margin-bottom:18rpx;
}

.mr-1\.5 {
	margin-right: 12rpx;
}

.mr-2 {
	margin-right: rpx;
}

.mx-1 {
	margin-left: 8rpx;
	margin-right: 8rpx;
}

.w-full {
	width: 100%;
}

.w-14 {
	width: 112rpx;
}

.h-5 {
	height: 40rpx;
}

.h-8 {
	height: 64rpx;
}

.h-14 {
	height: 112rpx;
}

.w-px {
	width: 1px;
}

.min-h-\[300rpx\] {
	min-height: 300rpx;
}

.rounded-full {
	border-radius: 999rpx;
}

.rounded-xl {
	border-radius: 24rpx;
}

.rounded-t-xl {
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
}

.rounded-b-xl {
	border-bottom-left-radius: 24rpx;
	border-bottom-right-radius: 24rpx;
}

.border {
	border-width: 1rpx;
}

.border-2 {
	border-width: 2rpx;
}

.border-t {
	border-top-width: 1rpx;
}

.border-b {
	border-bottom-width: 1rpx;
}

.border-gray-200 {
	border-color: #E5E7EB;
}

.border-yellow-300 {
	border-color: #FCD34D;
}

.overflow-y-auto {
	overflow-y: auto;
}

.overflow-x-auto {
	overflow-x: auto;
}

.journal-type-option {
	white-space: nowrap;
}

.mood-option {
	flex: 1;
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
	
	
	.note-textarea {
		width: 100%;
		height: 180rpx;
		font-size: 28rpx;
		color: #333333;
		padding: 10rpx;
	}

/* 确保输入框没有默认样式 */
input, textarea {
	outline: none;
	border: none;
}

textarea{
	border: 1px solid #f0f0f0;
	    border-radius: 8px;
}
</style> 