<template>
	<view class="chat-container">
		<!-- 顶部导航 -->
		<view class="header">
			<text class="header-title">心灵对话</text>
			<view class="more-button">
				<text class="fa fa-ellipsis-h"></text>
			</view>
		</view>
		
		<!-- 聊天区域 -->
		<scroll-view 
			scroll-y 
			class="chat-content" 
			:scroll-top="scrollTop"
			:scroll-with-animation="true"
			@scrolltoupper="loadMoreMessages"
			ref="chatScroll"
		>
			<!-- 消息列表 -->
			<view class="message-list">
				<!-- AI欢迎消息 -->
				<view class="message-item ai-message">
					<view class="avatar ai-avatar">
						<text class="fa fa-robot"></text>
					</view>
					<view class="message-bubble">
						<text class="message-text">你好，我是心光年的AI助手。今天你感觉怎么样？有什么想和我分享的吗？</text>
					</view>
				</view>
				
				<!-- 用户消息 -->
				<view class="message-item user-message">
					<view class="message-bubble">
						<text class="message-text">最近工作压力有点大，感觉很焦虑</text>
					</view>
					<view class="avatar user-avatar">
						<text class="user-icon"></text>
					</view>
				</view>
				
				<!-- AI回复 -->
				<view class="message-item ai-message">
					<view class="avatar ai-avatar">
						<text class="fa fa-robot"></text>
					</view>
					<view class="message-bubble">
						<text class="message-text">我理解你的感受。工作压力确实会让人感到焦虑。你能告诉我是什么让你感到特别有压力的吗？也许我们可以一起找到一些缓解方法。</text>
					</view>
				</view>
				
				<!-- 用户消息 -->
				<view class="message-item user-message">
					<view class="message-bubble">
						<text class="message-text">最近项目截止日期临近，但进度不太理想，我担心完不成</text>
					</view>
					<view class="avatar user-avatar">
						<text class="user-icon"></text>
					</view>
				</view>
				
				<!-- AI正在输入 -->
				<view class="message-item ai-message" v-if="isTyping">
					<view class="avatar ai-avatar">
						<text class="fa fa-robot"></text>
					</view>
					<view class="message-bubble typing-bubble">
						<view class="typing-indicator">
							<view class="typing-dot"></view>
							<view class="typing-dot"></view>
							<view class="typing-dot"></view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 建议问题区域 -->
		<view class="suggestion-area">
			<text class="suggestion-title">你可能想问：</text>
			<scroll-view scroll-x class="suggestion-list">
				<view class="suggestion-pill" v-for="(item, index) in suggestionQuestions" :key="index" @click="useQuestion(item)">
					<text>{{ item }}</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 输入区域 -->
		<view class="input-area">
			<view class="input-container">
				<view class="emoji-button">
					<text class="fa fa-smile"></text>
				</view>
				<input 
					type="text" 
					v-model="inputMessage" 
					placeholder="输入消息..." 
					confirm-type="send"
					@confirm="sendMessage"
					class="message-input"
				/>
				<view class="send-button" @click="sendMessage">
					<text class="fa fa-paper-plane"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputMessage: '',
				scrollTop: 0,
				isTyping: false,
				suggestionQuestions: [
					'如何缓解工作压力？',
					'我该如何提高工作效率？',
					'如何与同事更好沟通？',
					'有什么放松心情的好方法？',
					'如何平衡工作和生活？'
				]
			}
		},
		onLoad() {
			// 初始化时滚动到底部
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		},
		methods: {
			scrollToBottom() {
				// 计算滚动位置
				const query = uni.createSelectorQuery().in(this);
				query.select('.message-list').boundingClientRect(data => {
					if (data) {
						this.scrollTop = data.height;
					}
				}).exec();
			},
			sendMessage() {
				if (!this.inputMessage.trim()) return;
				
				// 添加用户消息到聊天列表
				const userMessage = {
					text: this.inputMessage,
					type: 'user'
				};
				
				// 清空输入框并滚动到底部
				this.inputMessage = '';
				this.$nextTick(() => {
					this.scrollToBottom();
				});
				
				// 显示AI正在输入
				this.isTyping = true;
				
				// 模拟AI延迟回复
				setTimeout(() => {
					this.isTyping = false;
					// 实际应用中这里可以接入AI服务
					this.$nextTick(() => {
						this.scrollToBottom();
					});
				}, 1500);
			},
			loadMoreMessages() {
				// 加载更多历史消息的逻辑
				console.log('加载更多消息');
			},
			useQuestion(question) {
				this.inputMessage = question;
			}
		}
	}
</script>

<style>
	/* 导入FontAwesome样式 */
	@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
	
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f0f2f7;
	}
	
	/* 顶部导航样式 */
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		padding: 15rpx 30rpx;
		background-color: #ffffff;
		border-bottom: 1rpx solid #e5e5ea;
	}
	
	.header-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
	}
	
	.more-button {
		width: 70rpx;
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f0f0f0;
		border-radius: 35rpx;
		position: absolute;
		right: 30rpx;
	}
	
	.more-button .fa {
		font-size: 36rpx;
		color: #888888;
	}
	
	/* 聊天内容区域 */
	.chat-content {
		flex: 1;
		overflow-y: auto;
	}
	
	.message-list {
		display: flex;
		flex-direction: column;
		padding: 20rpx 30rpx;
	}
	
	.message-item {
		display: flex;
		margin-bottom: 30rpx;
		align-items: flex-start;
	}
	
	.ai-message {
		justify-content: flex-start;
	}
	
	.user-message {
		justify-content: flex-end;
	}
	
	.avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 35rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	
	.ai-avatar {
		margin-right: 15rpx;
		background-color: #e7e9fd;
	}
	
	.user-avatar {
		margin-left: 15rpx;
		background-color: #e0e0e0;
		position: relative;
		overflow: hidden;
	}
	
	.ai-avatar .fa {
		font-size: 34rpx;
		color: #6366f1;
	}
	
	.user-icon {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #888888;
		border-radius: 50%;
	}
	
	.user-icon::after {
		content: '';
		position: absolute;
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		background-color: #e0e0e0;
		top: 10rpx;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.user-icon::before {
		content: '';
		position: absolute;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background-color: #888888;
		bottom: -30rpx;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.message-bubble {
		max-width: 70%;
		padding: 20rpx 24rpx;
		position: relative;
	}
	
	.ai-message .message-bubble {
		background-color: #e5e5ea;
		color: #333333;
		border-radius: 36rpx;
	}
	
	.ai-message .message-bubble::after {
		content: '';
		position: absolute;
		left: -10rpx;
		bottom: 15rpx;
		width: 20rpx;
		height: 20rpx;
		background-color: #e5e5ea;
		clip-path: polygon(100% 0, 0 100%, 100% 100%);
	}
	
	.user-message .message-bubble {
		background-color: #007aff;
		color: #ffffff;
		border-radius: 36rpx;
		margin-right: 5rpx;
	}
	
	.user-message .message-bubble::after {
		content: '';
		position: absolute;
		right: -10rpx;
		top: 20rpx;
		width: 16rpx;
		height: 16rpx;
		background-color: #007aff;
		clip-path: polygon(0 0, 0 100%, 100% 0);
	}
	
	.message-text {
		font-size: 30rpx;
		line-height: 1.4;
		word-break: break-word;
	}
	
	/* 正在输入指示器 */
	.typing-bubble {
		padding: 20rpx 30rpx;
	}
	
	.typing-indicator {
		display: flex;
		align-items: center;
	}
	
	.typing-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 6rpx;
		background-color: #aaaaaa;
		margin: 0 6rpx;
		animation: bounce 1.4s infinite ease-in-out;
	}
	
	.typing-dot:nth-child(1) { animation-delay: 0s; }
	.typing-dot:nth-child(2) { animation-delay: 0.2s; }
	.typing-dot:nth-child(3) { animation-delay: 0.4s; }
	
	@keyframes bounce {
		0%, 80%, 100% { transform: scale(0); }
		40% { transform: scale(1); }
	}
	
	/* 建议问题区域 */
	.suggestion-area {
		padding: 16rpx 30rpx 20rpx;
		background-color: #f8f8f8;
		border-top: 1rpx solid #e5e5ea;
	}
	
	.suggestion-title {
		font-size: 26rpx;
		color: #666666;
		margin-bottom: 15rpx;
		display: block;
	}
	
	.suggestion-list {
		white-space: nowrap;
		padding-bottom: 8rpx;
	}
	
	.suggestion-pill {
		display: inline-block;
		padding: 14rpx 24rpx;
		background-color: #ffffff;
		color: #555555;
		font-size: 26rpx;
		border-radius: 36rpx;
		margin-right: 15rpx;
		transition: all 0.2s ease;
		border: 1rpx solid #e5e5ea;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.03);
	}
	
	.suggestion-pill:active {
		transform: translateY(-2rpx);
		background-color: #f0f0f0;
	}
	
	/* 输入区域 */
	.input-area {
		padding: 20rpx 30rpx 30rpx;
		background-color: #f8f8f8;
		border-top: 1rpx solid #e5e5ea;
	}
	
	.input-container {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-radius: 40rpx;
		padding: 10rpx 15rpx;
		border: 1rpx solid #e5e5ea;
		height: 80rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	}
	
	.emoji-button {
		width: 70rpx;
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.emoji-button .fa {
		font-size: 36rpx;
		color: #888888;
	}
	
	.message-input {
		flex: 1;
		height: 70rpx;
		font-size: 30rpx;
		background-color: transparent;
		border: none;
		padding: 0 15rpx;
		color: #333333;
	}
	
	.send-button {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		background-color: #007aff;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2rpx 6rpx rgba(0, 123, 255, 0.3);
	}
	
	.send-button .fa {
		font-size: 26rpx;
		color: #ffffff;
	}
</style> 