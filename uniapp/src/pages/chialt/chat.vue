<template>
	<view class="chat-container">
		<ChatSSEClient
			ref="chatSSEClientRef"
			@onOpen="handleSSEOpen"
			@onMessage="handleSSEMessage"
			@onError="handleSSEError"
			@onFinish="handleSSEFinish"
		/>
		<!-- 添加每日签到弹窗组件 -->
		<daily-checkin-popup ref="checkinPopup" v-model:points="signInPoints"></daily-checkin-popup>
		<!-- 遮罩层 -->
		<view class="mask" v-if="showSidebar" @click="toggleSidebar"></view>
		<!-- 左侧历史对话面板 -->  
		
		<view class="sidebar" :class="{active: showSidebar}">
			<!-- 用户信息区域 -->
			<view class="user-profile">
				
				<!-- 标签页导航 -->
				<view class="history-tabs">
					<view class="tab" :class="{active: activeTab === 'chat'}" @click="switchTab('chat')">
						<text>对话历史</text>
					</view>
					<view class="tab-action">
						 <text  @click="createNewChat">开启新对话</text>
					</view>
				</view>
			</view>
			
			<scroll-view class="history-list"  scroll-y ="true" :enable-flex="true">
				<view v-if="chatHistory.length === 0" class="empty-history">
					<text>暂无对话历史</text>
				</view>
				<view v-for="(chat, index) in chatHistory" 
					:key="chat.id" 
					class="history-item"
					:class="{active: currentChatId === chat.id}"
					@click="switchChat(chat.id)">
					<view class="history-item-content">
						<view class="history-item-header">
							<view class="history-model">
								<uni-icons type="chat" size="14" color="#4e6ef2"></uni-icons>
								<text class="model-label">{{chat.model || '默认模型'}}</text>
							</view>
							<text class="history-time">{{formatTime(chat.time)}}</text>
						</view>
						<text class="history-title">{{chat.title || '新对话'}}</text>
					</view>
					<uni-icons type="trash" size="16" class="delete-icon" @click="deleteChat($event, chat.id)"></uni-icons>
				</view>
			</scroll-view>
		</view>
		
		<!-- 主要内容区域 -->
		<view class="main-content">
			<!-- 使用uni-nav-bar替换原有导航栏 -->
			<uni-nav-bar 
			  :shadow="false" 
			  :border="false" 
			  fixed
			  left-icon="bars"
			  @clickLeft="toggleSidebar"
			  status-bar
			  background-color="transparent"
			>
			  <template #default>
				    <view class="model-selector" @click="toggleModelSelector">
				      <text>{{currentModel}}</text>
				      <uni-icons type="down" size="15"></uni-icons>
				    </view>
				    <view class="model-dropdown" v-if="showModelSelector">
				      <view class="model-item" v-for="model in modelList" :key="model.aiid" @click="selectModel(model)">
				        <view class="model-item-content">
				          <view class="model-header">
				            <uni-icons v-if="currentModel === model.name" type="checkmarkempty" size="18" color="#2979ff" class="check-icon"></uni-icons>
				            <text :class="{'selected': currentModel === model.name}" class="model-name">{{model.name}}</text>
				          </view>
				          <text class="model-description">{{model.description}}</text>
				        </view>
				      </view>
				    </view>
			  </template>
			  <template #right>
				   <!-- <view class="right-icons">
				     <uni-icons type="gear" size="24" class="icon" @click="openSettings"></uni-icons>
				      <uni-icons type="chat" size="24" class="icon" @click="createNewChat"></uni-icons>
				    </view -->
			  </template>
			</uni-nav-bar>
			
			<!-- 聊天区域 -->
			<scroll-view 
      ref="messageList"
      class="chat-area" 
       scroll-y ="true" 
      :scroll-top="scrollTop" 

      :enhanced="true"
      :bounces="false"
      :show-scrollbar="false"
      :scroll-anchoring="true"
	  :enable-flex="true"
      :scroll-into-view="scrollIntoView"
    >
				<!-- 消息列表 -->
				<view v-for="(message, index) in messages" 
        :key="message.id || index"
        :id="'msg-' + index"
        :data-message-id="message.id"
        class="message" 
        :class="{
          'ai-message': message.type === 'ai', 
          'user-message': message.type === 'user',
          'fade-in': message.isLoaded
        }">
					
					
					<view class="message-content" :class="{'user-content': message.type === 'user', 'ai-content': message.type === 'ai'}" v-if="!(message.type === 'ai' && isLoading && message === messages[messages.length - 1])">
						<view class="welcome-bubble" v-if="index === 0 && message.type === 'ai'">
							<view class="welcome-message">
								<zero-markdown-view :markdown="message === typingMessage ? (typeof msgContent === 'string' ? msgContent : JSON.stringify(msgContent)) : (typeof (message.processedContent || message.content) === 'string' ? (message.processedContent || message.content) : JSON.stringify(message.processedContent || message.content))" themeColor="#4e6ef2" codeBgColor="#2d2d2d" />
							</view>
							<!-- 建议问题列表 -->
							<view class="suggested-questions" v-if="messages.length <= 1">
								<view class="divider"></view>
								<view class="question-list">
									<view class="question-bubble" v-for="(question, index) in suggestedQuestions" :key="index" @click="handleQuestionClick(question)">
										<text>{{question.icon}}</text>
										<text>{{question.text}}</text>
									</view>
								</view>
							</view>
						</view>
						<view 
						  v-else-if="message.type === 'ai' && Array.isArray(message.content) && message.content.length > 0"
						  class="image-grid" :class="'grid-' + message.content.length">
						  <image v-for="(item, index) in message.content" 
							 :key="index" 
							 :src="item.url" 
							 mode="aspectFill" 
							 :class="{'single-image': message.content.length === 1}" 
							 @click="previewImage(item.url, message.content.length > 1 ? message.content.map(img => img.url) : undefined)"
							 @load="handleImageLoad(message.id, index)"
							 @error="handleImageError(message.id, index)"
							 :style="{ opacity: isImageLoaded(message.id, index) ? 1 : 0 }" />
						</view>
						<view v-else class="message-wrapper">
							<view class="message-header" v-if="message.type === 'ai'">
								<view class="model-info">
								<image src="/static/AI.png" mode="aspectFit" style="width: 25px; height: 25px;"></image>
									<text class="model-name">{{currentModel}}</text>
								</view>
							</view>
							<!-- 添加推理过程展示（带折叠功能） -->
							<view v-if="message.reasoning" class="reasoning-content">
								<view class="reasoning-header" @click="toggleReasoning(message)">
									<view class="reasoning-title">
										<uni-icons type="pyq" size="16" color="#666"></uni-icons>
										<text>深度思考·R1</text>
									</view>
									<view class="toggle-icon">
										<uni-icons :type="message.reasoningCollapsed ? 'bottom' : 'top'" size="16" color="#666"></uni-icons>
									</view>
								</view>
								<view class="reasoning-body" :class="{'collapsed': message.reasoningCollapsed}">
									<text class="reasoning-text">{{message.reasoning}}</text>
								</view>
							</view>
							<zero-markdown-view :markdown="message === typingMessage ? (typeof msgContent === 'string' ? msgContent : JSON.stringify(msgContent)) : (typeof (message.processedContent || message.content) === 'string' ? (message.processedContent || message.content) : JSON.stringify(message.processedContent || message.content))" themeColor="#4e6ef2" codeBgColor="#2d2d2d" />
							<!-- 搜索结果展示 -->
							<view v-if="message.searchResults && message.searchResults.length > 0" class="search-results">
								<view class="search-results-header" @click="toggleSearchResults(message)">
									<uni-icons :type="message.showSearchResults ? 'top' : 'bottom'" size="14" color="#999"></uni-icons>
									<text>引用 {{message.searchResults.length}} 篇资料</text>
								</view>
								<view class="search-results-list" v-if="message.showSearchResults">
									<view v-for="(result, idx) in message.searchResults" 
										:key="idx" 
										class="search-result-item"
										@click="handleLinkClick(result.link)">
										<text class="result-index">{{idx + 1}}</text>
										<text class="result-title">{{result.title}}</text>
										<uni-icons type="forward" size="14" color="#999"></uni-icons>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 加载动画指示器 -->
				<view class="loading-indicator" v-if="isLoading">
					<view class="loading-dots">
						<view class="dot"></view>
						<view class="dot"></view>
						<view class="dot"></view>
					</view>
					<text class="loading-text">{{currentRequestType === 'image' ? 'AI绘图中...' : 'AI思考中...'}}</text>
				</view>
				<view id="last-msg-item" style="height: 1px;"></view>
			</scroll-view>
			
			<!-- 底部输入区域 -->
			<view class="footer" style="padding: 12px 16px 75px;">
				<view class="search-toggle">
					<!-- <view class="toggle-button" :class="{ 'active': isWebSearchEnabled }" @click="toggleWebSearch">
						<uni-icons :type="isWebSearchEnabled ? 'loop' : 'loop'" size="18" :color="isWebSearchEnabled ? '#4e6ef2' : '#999'" />
						<text :style="{ color: isWebSearchEnabled ? '#4e6ef2' : '#999' }">联网搜索</text>
					</view> -->
					
					<view class="toggle-button" :class="{ 'active': isDeepThinkingEnabled }" @click="toggleDeepThinking" v-show="false">
						<uni-icons :type="isDeepThinkingEnabled ? 'pyq' : 'pyq'" size="18" :color="isDeepThinkingEnabled ? '#4e6ef2' : '#999'" />
						<text :style="{ color: isDeepThinkingEnabled ? '#4e6ef2' : '#999' }">深度思考</text>
					</view>
				</view>
				<view class="input-area">
					<!-- 快速操作面板 -->
					<view class="quick-actions" v-if="showImageGenPanel">
						<view class="image-gen-panel">
							<view class="panel-header">
								<text class="panel-title">AI绘图</text>
								<view class="prompt-tag-wrapper">
									<prompt-tags class="prompt-tag-wrappera" @add-tags="addPromptTags"></prompt-tags>
									<image-templates @select-template="addTemplatePrompt"></image-templates>
								</view>
								<uni-icons type="close" size="20" @click="showImageGenPanel = false"></uni-icons>
							</view>
							<view class="panel-content">
								<view class="settings-grid">
									<view class="setting-item">
										<text class="setting-label">AI模型</text>
										<view class="setting-control">
											<uni-data-select
												v-model="selectedImageModel"
												:localdata="imageModels"
												:clear="false"
												placement="top"
												class="full-width-select"
											></uni-data-select>
										</view>
									</view>
									<view class="setting-item">
										<text class="setting-label">图片比例</text>
										<view class="setting-control">
											<uni-data-select
												v-model="selectedRatio"
												:localdata="ratioOptions"
												:clear="false"
												placement="top"
												class="full-width-select"
											></uni-data-select>
										</view>
									</view>
									<view class="setting-item">
										<text class="setting-label">生成数量</text>
										<view class="setting-control number-box-container">
											<uni-number-box
												:min="1"
												:max="4"
												v-model="imageCount"
												class="custom-number-box"
											></uni-number-box>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<textarea v-model="inputMessage" :cursor-spacing="15" class="textarea" :auto-height="!isWidescreen"
						placeholder="有什么问题尽管问我" :maxlength="-1" :adjust-position="true"
						:disable-default-padding="false" placeholder-class="input-placeholder"></textarea>
					<view class="input-icons">
						<!-- <uni-icons type="plus" size="30" class="icon" @click="showImageGenPanel = !showImageGenPanel"></uni-icons> -->
						<view class="circle-button" :class="{'send-active': inputMessage.trim().length > 0, 'stop-button': typingTimer}" @click="typingTimer ? stopGenerating() : sendMessage()">
							<uni-icons :type="typingTimer ? 'circle-filled' : (inputMessage.trim().length > 0 ? 'paperplane-filled' : 'paperplane')" size="20" color="#fff"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { BASE_URL } from './utils/api.js';
import { sendMessageToAPI, userSignIn, getModelList, getSuggestedQuestions, getUserInfo } from './utils/api.js';
import DailyCheckinPopup from './components/daily-checkin-popup.vue';
import PromptTags from './components/prompt-tags.vue';
import ImageTemplates from './components/image-templates.vue';
import ChatSSEClient from '../../components/gao-ChatSSEClient/gao-ChatSSEClient.vue';
import { getToken } from '@/utils/auth'
// 使用zero-markdown-view组件进行markdown解析

export default {
  components: {
    DailyCheckinPopup,
    PromptTags,
    ImageTemplates,
    ChatSSEClient,
    'lucky-draw': () => import('./components/lucky-draw.vue')
  },
	computed: {
    visibleMessages() {
      return this.messages.slice(
        this.virtualList.startIndex,
        this.virtualList.endIndex
      ).map(message => ({
        ...message,
        isLoaded: true
      }));
    },
		msgContent() {
			return this.typingMessage?.content || ''
		}
	},
	data() {
		return {
			scrollIntoView: '',
			activeTab: 'chat', // 当前激活的标签页
			chatSSEClientRef: null,
			signInPoints: 0,
			userAvatar: '/static/logo.png',  // 默认头像
			userNickname: '',
			userVipTime: '',
			vip: false,
			userPoints: 0,
			username: '',
			money: '',
			isWebSearchEnabled: false,
			isDeepThinkingEnabled: false, // 添加深度思考状态变量，默认关闭
			showSidebar: false,
			showImageGenPanel: false,
			isWidescreen: false,
			selectedImageModel: 0,
			selectedRatio: '1024x1024',
			imageCount: 1,
			imageLoaded: {},  // 跟踪图片加载状态          
			imageModels: [],
			isGenerating: false,  // 添加新的状态变量
			ratioOptions: [{text: '1:1', value: '1024x1024'}, {text: '1:2', value: '512x1024'},{text: '3:2', value: '768x512'}, {text: '3:4', value: '768x1024'}, {text: '16:9', value: '1920x1080'}, {text: '9:16', value: '576x1024'}],
			messages: [
				{
					type: 'ai',
					content: '👋你好呀，我是 心光助手，很高兴认识你！有问题欢迎随时问。',
					showSearchResults: false  // 添加控制搜索结果显示状态的属性
				}
			],
			suggestedQuestions: [],
			inputMessage: '',
			scrollTop: 0,
			isLoading: false,
			currentRequestType: '',
			currentModel: '',
			modelList: [],
			showModelSelector: false,
			currentChatId: 'default',
			chatHistory: [],
			typingMessage: null,
			typingIndex: 0,
			typingTimer: null,
			scrollTimer: null,
			isScrolling: false,
			scrollIntoView: ''
		}
	},
	created() {
		
	},

	async onLoad() {	
		
		// 加载用户信息
		try {
			const userInfo = await getUserInfo();
			// 更新用户信息到页面
			this.userNickname = userInfo.nickname;
			this.userVipTime = userInfo.viptime;
			this.userAvatar = userInfo.usertx || '/static/logo.png';
			this.userPoints = userInfo.money;
			this.username = userInfo.username;
			this.money = userInfo.money;
			this.vip = userInfo.vip;
		} catch (error) {
			console.error('加载用户信息失败:', error);
		}
		// 检查登录状态		
		// const token = uni.getStorageSync('Token');
		// const userInfo = uni.getStorageSync('User');
		// if (!token || !userInfo) {
		// 	uni.showToast({
		// 	  title: '验证失败,请登录',
		// 	  icon: 'none'
		// 	})
		// 	// 未登录，跳转到登录页面
		// 	uni.reLaunch({
		// 		url: '/pages/login/login'
		// 	});
		// 	return;
		// }
		try {
			const signInResult = await userSignIn()
			if (signInResult && signInResult.success) {
				// 确保返回的数据中包含积分信息
				const points = signInResult.points || 0;
				// 更新签到弹窗的积分值
				this.signInPoints = points;
				// 签到成功，显示弹窗并传递积分
				this.$nextTick(() => {
					this.$refs.checkinPopup.show();
				})
			}
		} catch (error) {
			console.error('签到失败:', error)
			uni.showToast({
			  title: '签到失败',
			  icon: 'none'
			});
		}
		
		// 加载推荐问题列表
		try {
			this.suggestedQuestions = await getSuggestedQuestions();
		} catch (error) {
			console.error('加载推荐问题失败:', error);
		}
		// 已登录，加载数据
		this.loadChatHistory();
		// 每次打开APP都创建新的对话
		this.createNewChat();
		// 加载AI模型列表
		this.loadModelList();
	},
	methods: {
			
		// 切换标签页
		switchTab(tab) {
			this.activeTab = tab;
		},
		
		// 跳转到用户个人资料页面
		navigateToUserProfile() {
			uni.switchTab({
				url: '/pages/profile/profile'
			});
		},
		
		// 打开抽奖页面
		openLottery() {
			this.goToLuckyDraw();
		},
		
		// 打开VIP页面
		openVipPage() {
			uni.navigateTo({
				url: '/pages/user/vip'
			});
		},
		// SSE事件处理方法
		handleSSEOpen() {
			console.log('SSE连接已打开');
			this.isGenerating = true;
			this.typingTimer = true;
			this.isLoading = true;
		},
		
		handleSSEMessage(msg) {
			try {
				// 检查是否为[DONE]消息
			
				// 提取data:后的JSON字符串
				const jsonStr = msg.startsWith('data:') ? msg.slice(5).trim() : msg;
				let data;
				try {
					data = JSON.parse(jsonStr);
				} catch (e) {
					// 如果解析失败，说明可能是普通文本
					data = { content: jsonStr };
				}
				
				// 更新最后一条AI消息的内容
				const lastMessage = this.messages[this.messages.length - 1];
				if (lastMessage && lastMessage.type === 'ai') {
					// 收到第一条消息时，隐藏加载动画
					this.isLoading = false;
					
					// 处理推理内容
					if (data.reasoning_content) {
						// 如果有推理内容，添加到消息中
						if (!lastMessage.reasoning) {
							lastMessage.reasoning = '';
						}
						lastMessage.reasoning += data.reasoning_content;
						// 在推理内容更新后也触发滚动
						this.scrollToBottom();
					}
					
					// 处理普通内容
					if (data.content) {
						// 先累加内容
						lastMessage.content = (lastMessage.content || '') + data.content;
						
						// 处理代码块
						const processCodeBlock = (content) => {
							// 检查是否包含代码块
							const codeBlocks = content.split('```');
							const codeBlockCount = codeBlocks.length - 1;
							
							if (codeBlockCount > 0) {
								// 处理代码块的语言标识符
								for (let i = 1; i < codeBlocks.length; i += 2) {
									if (i < codeBlocks.length) {
										const block = codeBlocks[i];
										const firstLine = block.split('\n')[0].trim();
										// 如果没有语言标识符，添加默认的
										if (!firstLine || firstLine === '') {
											codeBlocks[i] = 'plaintext\n' + block;
										}
									}
								}
								
								// 重新组合内容
								let processedContent = codeBlocks.join('```');
								
								// 处理未闭合的代码块
								if (codeBlockCount % 2 === 1) {
									processedContent += '\n```\n';
								} else if (processedContent[processedContent.length - 1] !== '\n') {
									processedContent += '\n';
								}
								
								return processedContent;
							}
							
							return content;
						};
						
						// 使用Vue的响应式系统设置处理后的内容
						this.$set(lastMessage, 'processedContent', processCodeBlock(lastMessage.content));
						this.scrollToBottom();
					}
				}
			} catch (error) {
				console.error('处理SSE消息失败:', error);
			}
		},
		
		handleSSEError(error) {
			console.error('SSE错误:', error);
			this.isGenerating = false;
			this.isLoading = false;
			this.typingTimer = null;
		},
		
		handleSSEFinish() {
			console.log('SSE连接已关闭');
			this.isGenerating = false;
			this.isLoading = false;
			this.typingTimer = null;
			
			// 保存聊天记录
			const currentChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
			if (currentChat) {
				currentChat.messages = [...this.messages];
				this.saveChatHistory();
			}
		},
		goToLuckyDraw() {
			uni.navigateTo({
				url: '/pages/chialt/components/lucky-draw'
			}).catch(err => {
				console.error('跳转失败:', err);
				uni.showToast({
					title: '页面跳转失败',
					icon: 'none'
				});
			})
		},
    addTemplatePrompt(description) {
      this.inputMessage = description;
    },
		openUrl(url) {
			// 判断运行环境
			if (typeof window !== 'undefined' && window.open) {
				// 在浏览器环境中使用window.open
				window.open(url, '_blank');
			} else {
				// 在小程序等环境中使用uni.navigateTo
				uni.navigateTo({
					url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
					fail: () => {
						uni.showToast({
							title: '无法打开链接',
							icon: 'none'
						});
					}
				});
			}
		},
		toggleWebSearch() {
			this.isWebSearchEnabled = !this.isWebSearchEnabled;
		},
		
		// 切换深度思考状态
		toggleDeepThinking() {
			this.isDeepThinkingEnabled = !this.isDeepThinkingEnabled;
		},
		// 预览图片
		previewImage(url, urls) {
			if (!urls || !Array.isArray(urls)) {
				urls = [url]; // 如果urls未定义，则创建只包含当前url的数组
			}
			uni.previewImage({
				current: url,
				urls: urls,
				indicator: 'number',
				loop: true,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮');
						switch (data.tapIndex) {
							case 0:
								// 发送给朋友
								break;
							case 1:
								// 保存图片
								uni.saveImageToPhotosAlbum({
									filePath: url,
									success: function() {
										uni.showToast({
											title: '保存成功'
										});
									}
								});
								break;
							case 2:
								// 收藏
								break;
						}
					}
				}
			});
		},
		handleSwiperChange(e) {
			this.currentImageIndex = e.detail.current;
			this.updateThumbnailScroll();
		},
		handleThumbnailClick(index) {
			this.currentImageIndex = index;
			this.updateThumbnailScroll();
		},
		updateThumbnailScroll() {
			this.thumbnailScrollLeft = this.currentImageIndex * 110;
		},
		// 加载聊天历史
		async loadChatHistory() {
			try {
				const history = uni.getStorageSync('chatHistory');
				this.chatHistory = history ? JSON.parse(history) : [];
			} catch (error) {
				console.error('加载聊天历史失败:', error);
				this.chatHistory = [];
			}
		},
		// 保存聊天历史
		saveChatHistory() {
			try {
				uni.setStorageSync('chatHistory', JSON.stringify(this.chatHistory));
			} catch (error) {
				console.error('保存聊天历史失败:', error);
				uni.showToast({
					title: '保存失败',
					icon: 'error',
					duration: 2000
				});
			}
		},
		// 更新对话标题
		updateChatTitle(chatId, firstMessage) {
			if (!chatId || !firstMessage) return;
			
			const chat = this.chatHistory.find(c => c.id === chatId);
			if (chat) {
				chat.title = firstMessage.length > 15 ? 
					`${firstMessage.substring(0, 15)}...` : 
					firstMessage;
				this.saveChatHistory();
			}
		},


		// 切换搜索结果的显示/隐藏状态
		toggleSearchResults(message) {
			if (!message) return;
			// 使用Vue的响应式系统来更新状态
			this.$set(message, 'showSearchResults', !message.showSearchResults);
		},

		handleLinkClick(url) {
			if (!url) {
				uni.showToast({
					title: '无效的链接',
					icon: 'none'
				});
				return;
			}

			try {
				// 判断是否为外部链接
				if (url.startsWith('http://') || url.startsWith('https://')) {
					// 在APP环境下使用plus.runtime.openWeb
					// #ifdef APP-PLUS
					plus.runtime.openWeb(url);
					// #endif

					// 在H5环境下使用window.open
					// #ifdef H5
					window.open(url, '_blank');
					// #endif

					// 在小程序环境下使用webview
					// #ifdef MP
					uni.navigateTo({
						url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
						fail: (err) => {
							console.error('跳转失败:', err);
							uni.showToast({
								title: '无法打开链接',
								icon: 'none'
							});
						}
					});
					// #endif
				} else {
					// 处理内部链接
					uni.navigateTo({
						url: url,
						fail: (err) => {
							console.error('内部跳转失败:', err);
							uni.showToast({
								title: '无法打开链接',
								icon: 'none'
							});
						}
					});
				}
			} catch (error) {
				console.error('打开链接失败:', error);
				uni.showToast({
					title: '打开链接失败',
					icon: 'none'
				});
			}
		},

	// 添加指令标签到输入框
		addPromptTags(tags) {
			// 如果输入框已有内容，添加逗号分隔
			if (this.inputMessage.trim()) {
				this.inputMessage += ',' + tags
			} else {
				this.inputMessage = tags
			}
		},
		
		async sendMessage() {
			const message = this.inputMessage.trim();
			if (!message || this.isLoading) return;
			
			// 获取当前对话
			const currentChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
			
			// 如果是用户在当前对话的第一次发送消息，更新对话时间
			if (currentChat && currentChat.messages.length === 1) {
				// 更新对话时间
				currentChat.time = new Date();
				this.saveChatHistory();
			}
			
			// 重置输入框并更新UI状态
			this.inputMessage = '';
			this.isLoading = true;
			this.currentRequestType = this.showImageGenPanel ? 'image' : 'text';
			
			// 添加用户消息
			const userMessage = {
				type: 'user',
				content: message
			};
			
			// 判断是否为新会话的第一条用户消息
			if (this.messages.length === 1 && this.messages[0].type === 'ai' && this.messages[0].content.includes('👋你好呀')) {
				// 先更新会话标题
				this.updateChatTitle(this.currentChatId, message);
				// 移除欢迎语
				this.messages = [];
			}
			
			this.messages.push(userMessage);
			
			// 更新对话标题（如果需要）
			if (this.messages.length === 2) {
				this.updateChatTitle(this.currentChatId, message);
			}
			
			try {
				// 获取token和用户信息
				const token = uni.getStorageSync('Token');
				const user = uni.getStorageSync('User');
			// 获取当前聊天记录
			const currentChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
			
			// 判断当前是否为绘图模式
			const isDrawingMode = this.showImageGenPanel;
			
			// 根据模式选择对应的模型和参数
			let currentModelInfo;
			let options = {};
			
			if (isDrawingMode) {
				// 绘图模式使用选中的图像模型
				currentModelInfo = this.imageModels.find(model => model.value === this.selectedImageModel);
				options.imageOptions = {
					ratio: this.selectedRatio,
					count: this.imageCount
				};
				// 发送绘图消息后关闭绘图面板
				this.showImageGenPanel = false;
			} else {
				// 文本模式使用选中的文本模型
				currentModelInfo = this.modelList.find(model => model.name === this.currentModel);
				// 构建对话历史
				options.messages = this.messages.map(msg => ({
					role: msg.type === 'user' ? 'user' : 'assistant',
					content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
				}));
			}
			
			// 保存当前使用的模型到聊天历史
			if (currentChat && !currentChat.model) {
				currentChat.model = isDrawingMode ? currentModelInfo?.text : this.currentModel;
			}
			
			if (isDrawingMode) {
				// 绘图模式使用原有的API
				const response = await sendMessageToAPI(
					message,
					this.selectedImageModel.toString(),
					options,
					true
				);
				
				if (Array.isArray(response)) {
					this.messages.push({
						type: 'ai',
						content: response
					});
					this.scrollToBottom();
				}
			} else {
				// 文本模式使用SSE流式响应
				// 创建新的AI消息对象
				const aiMessage = {
					type: 'ai',
					content: '',
					searchResults: []
				};
				
				// 添加AI消息对象到消息列表
				this.messages.push(aiMessage);
				this.typingTimer = true;
				// 先显示AI思考动画
				this.isLoading = true;
			}
				
				// 延迟1秒后发起SSE请求
				setTimeout(async () => {
					// 获取token和用户信息
					const token = uni.getStorageSync('Token');
					const user = uni.getStorageSync('User');
					
					// 构建对话历史
					// 过滤掉最后一条AI消息（因为它是空的，刚刚添加的）
					const messageHistory = this.messages.slice(0, -1).map(msg => ({
						role: msg.type === 'user' ? 'user' : 'assistant',
						content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
					}));

					// 启动SSE连接
					this.$refs.chatSSEClientRef.startChat({
						url: BASE_URL+'/aichat/completion',
						headers: {
							//'content-type': 'application/json',
							'Like-Token':getToken()
						},
						body: {
							username: user,
							token: token,
							prompt: message,
							searchEnabled: this.isWebSearchEnabled,
							sik: this.isDeepThinkingEnabled,
							aiid: currentModelInfo?.aiid || '0',
							messages: messageHistory,

						}
					});
				});
				
				if (currentChat) {
					currentChat.messages = [...this.messages];
					this.saveChatHistory();
				}
		} catch (error) {
			console.error('发送消息失败:', error);
			this.messages.push({
				type: 'ai',
				content: '抱歉，我遇到了一些问题，请稍后再试。'
			});
			uni.showToast({
				title: '发送失败',
				icon: 'error',
				duration: 2000
			});
		} finally {
			//this.isLoading = false;
			this.scrollToBottom();
		}
	},
		
			startTypingEffect(text, messageData = null) {
			// 清理现有的打字效果
			this.stopGenerating();
			
			// 确保text是字符串类型
			text = typeof text === 'string' ? text : JSON.stringify(text);
			
			// 初始化新的AI消息
			this.typingMessage = messageData || {
				type: 'ai',
				content: ''
			};
			
			// 确保typingMessage的content为空字符串
			this.typingMessage.content = '';
			this.messages.push(this.typingMessage);
			
			// 直接使用流式响应更新内容
			this.typingMessage.content = text;
			this.$set(this.typingMessage, 'content', this.typingMessage.content);
			this.scrollToBottom();
			
			// 更新聊天历史
			const currentChat = this.chatHistory.find(c => c.id === this.currentChatId);
			if (currentChat) {
				currentChat.messages = [...this.messages];
				this.saveChatHistory();
			}
			
			this.isLoading = false;
			this.scrollToBottom();
		},
		
		// 时间格式化方法
		formatTime(time) {
			if (!time) return '';
			const date = new Date(time);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			const seconds = String(date.getSeconds()).padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		},

		// 侧边栏相关方法
		toggleSidebar() {
			// 如果AI正在生成回复或等待响应，则不允许切换侧边栏
			if (this.isGenerating || this.isLoading) {
				uni.showToast({
					title: 'AI任务中，无法使用...',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			this.showSidebar = !this.showSidebar
		},
		
		createNewChat() {
			const lastChat = this.chatHistory[0];
			if (!lastChat || lastChat.messages.length > 1) {
				const newChat = {
					id: Date.now().toString(),
					title: '新对话',
					time: new Date(),
					messages: [{
						type: 'ai',
						content: '👋你好呀，我是 心光助手，很高兴认识你！有问题欢迎随时问。'
					}]
				};
				this.chatHistory.unshift(newChat);
				this.saveChatHistory();
				this.switchChat(newChat.id);
			} else {
				uni.showToast({
					title: '已是最新对话',
					icon: 'none',
					duration: 2000
				});
				this.switchChat(lastChat.id);
			}
		},
		switchChat(chatId) {
			if (!chatId) return;
			
			this.currentChatId = chatId;
			const chat = this.chatHistory.find(c => c.id === chatId);
			
			this.messages = chat?.messages ? 
				JSON.parse(JSON.stringify(chat.messages)) : 
				[{
					type: 'ai',
					content: '👋你好呀，我是 心光助手，很高兴认识你！有问题欢迎随时问。'
				}];
			
			this.scrollToBottom();
			this.showSidebar = false;
		},
		   async deleteChat(event, chatId) {
		            // 检查 event 是否为有效的事件对象
		            if (event && typeof event.stopPropagation === 'function') {
		                event.stopPropagation();
		            }
		            // 显示确认对话框
		            try {
		                const res = await new Promise((resolve) => {
		                    uni.showModal({
		                        title: '确认删除',
		                        content: '确定要删除这个对话吗？删除后无法恢复。',
		                        confirmText: '删除',
		                        confirmColor: '#ff0000',
		                        success: resolve
		                    });
		                });
		
		                // 用户点击取消
		                if (!res.confirm) {
		                    return;
		                }
		
		                const index = this.chatHistory.findIndex(c => c.id === chatId);
		                if (index > -1) {
		                    // 删除对话
		                    this.chatHistory.splice(index, 1);
		                    this.saveChatHistory();
		
		                    // 显示删除成功提示
		                    uni.showToast({
		                        title: '删除成功',
		                        icon: 'success',
		                        duration: 2000
		                    });
		
		                    // 如果删除的是当前对话，切换到第一个对话或创建新对话
		                    if (this.currentChatId === chatId) {
		                        if (this.chatHistory.length > 0) {
		                            this.switchChat(this.chatHistory[0].id);
		                        } else {
		                            this.createNewChat();
		                        }
		                    }
		                }
		            } catch (error) {
		                console.error('删除对话失败:', error);
		                uni.showToast({
		                    title: '删除失败',
		                    icon: 'error',
		                    duration: 2000
		                });
		            }
		        },
		openSettings() {
			// 实现设置功能
			console.log('打开设置')
		},
		
		// 加载AI模型列表
		async loadModelList() {
			try {
				const data = await getModelList();
				// 设置文本模型列表
				console.log(data.text)
				this.modelList = data.text || [];
				// 设置绘图模型列表
				this.imageModels = (data.drawing || []).map(model => ({
					text: model.name,
					value: model.aiid
				}));
				// 设置默认文本模型
				if (this.modelList.length > 0) {
					this.currentModel = this.modelList[0].name;
				}
				// 设置默认绘图模型
				if (this.imageModels.length > 0) {
					this.selectedImageModel = this.imageModels[0].value;
				}
			} catch (error) {
				console.error('加载模型列表失败:', error);
			}
		},
		
		// 切换模型选择器显示状态
		toggleModelSelector() {
			this.showModelSelector = !this.showModelSelector;
		},
		
		// 选择模型
		selectModel(model) {
			this.currentModel = model.name;
			this.showModelSelector = false
		},
		
		refreshChat() {
			// 刷新当前对话
			this.messages = [{
				type: 'ai',
				content: '👋你好呀，我是你的心光年 AI 助手，很高兴认识你！有问题欢迎随时问。'
			}]
		},
		handleQuestionClick(question) {
			//if (!question || !question.prompt || this.isLoading) return
			this.inputMessage = question.text
			this.sendMessage()
		},
			// 滚动到底部方法
		scrollToBottom() {
			this.showLastMsg();
		},

		showLastMsg() {
			// 等待DOM更新
			this.$nextTick(() => {
				// 将scrollIntoView属性设置为"last-msg-item"，以便滚动窗口到最后一条消息
				this.scrollIntoView = "last-msg-item";
				// 等待DOM更新，即：滚动完成
				this.$nextTick(() => {
					// 将scrollIntoView属性设置为空，以便下次设置滚动条位置可被监听
					this.scrollIntoView = "";
				});
			});
		},

		stopGenerating() {
			// 调用SSE客户端的停止方法
			this.$refs.chatSSEClientRef.stopChat();
			// 更新状态
			this.isGenerating = false;
			this.isLoading = false;
			this.typingTimer = null;
			console.log('已停止生成');
		},
		
		// 切换推理过程的折叠状态
		toggleReasoning(message) {
			if (!message.hasOwnProperty('reasoningCollapsed')) {
				this.$set(message, 'reasoningCollapsed', false);
			}
			this.$set(message, 'reasoningCollapsed', !message.reasoningCollapsed);
			// 添加延时，等待DOM更新后再滚动
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		},

		// 处理图片加载完成
		handleImageLoad(messageId, index) {
			if (!this.imageLoaded[messageId]) {
				this.imageLoaded[messageId] = {};
			}
			this.imageLoaded[messageId][index] = true;
		},
		// 处理图片加载错误
		handleImageError(messageId, index) {
			if (!this.imageLoaded[messageId]) {
				this.imageLoaded[messageId] = {};
			}
			this.imageLoaded[messageId][index] = false;
		},
		// 检查图片是否已加载
		isImageLoaded(messageId, index) {
			return this.imageLoaded[messageId]?.[index] || false;
		},
		openUrl(url) {
				// #ifdef APP-PLUS
				plus.runtime.openURL(url);
				// #endif
				// #ifdef H5
				window.open(url);
				// #endif
			},
	},
}
</script>

<style lang="scss">
/* 推理内容样式 */
.reasoning-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1px;
  margin-bottom: 1px;
  overflow-wrap: break-word;
  white-space: pre-wrap;

  
  .reasoning-header {
    display: flex;
    align-items: center;
   
    margin-bottom: 8px;
    color: #666;
    font-size: 14px;
    cursor: pointer;
    
    .reasoning-title {
      display: flex;
      align-items: center;
      
      .uni-icons {
        margin-right: 4px;
      }
    }
    
    .toggle-icon {
      transition: transform 0.3s ease;
    }
  }
  
  .reasoning-body {
    transition: max-height 0.3s ease, opacity 0.3s ease;
    opacity: 1;
    overflow: hidden;
    
    &.collapsed {
      max-height: 0;
      opacity: 0;
    }
    
    .reasoning-text {
      margin: 15px 0;
      font-size: 15px;
      color: #777777;
      border-left: 4px solid #dddddd;
      padding: 0 10px;
      display: block;
	  
    }
  }
}
/* 搜索结果样式 */
.search-results {
  margin-top: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1px solid #e0e0e0;
}

.search-results-header {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 28rpx;
  margin-bottom: 16rpx;
}

.search-results-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.result-index {
  color: #999;
  font-size: 24rpx;
  min-width: 28rpx;
}

.result-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.result-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.result-source {
  font-size: 24rpx;
  color: #999;
}

.result-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.chat-container {
    position: relative;
    height: 100vh;
    background-color: #ffffff;
    display: flex;
    width: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: touch; /* 优化移动端滚动 */
}
.uni-status-bar {
		height: 20px;
	}
.sidebar {
    position: fixed;
    left: -300px;
    top: 0;
    width: 300px;
    height: 100%;
    background-color: #fff;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    z-index: 100;
    transition: left 0.3s ease;
}

.user-profile {
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #eee;

  .user-header {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 8px;
    
    .avatar-container {
      position: relative;
      margin-right: 8px;
      
      .user-avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: 1px solid #f0f5ff;
      }
      
      .vip-badge {
        position: absolute;
        right: 1px;
        bottom: -15px;

        border-radius: 50%;
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .vip-text {
          font-size: 10px;
          font-weight: bold;
          color: #fff;
          text-shadow: 0 1px 1px rgba(0,0,0,0.3);
          transform: scale(0.9);
        }
      }
    }

    .user-info {
      flex: 1;
      padding-top: 2px;
      position: relative;
      display: flex;
      flex-direction: column;
      
      .nickname-container {
        display: flex;
        align-items: center;
        margin-bottom: 2px;
      }
      
      .user-nickname {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-right: 4px;
      }

      .user-uid {
        font-size: 11px;
        color: #999;
      }
      
      .user-arrow {
        margin-left: 2px;
      }
    }
    
    .lottery-icon {
      margin-left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .user-member-points-container {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
    gap: 8px;
  }

  .user-points {
    flex: 1;
    padding: 8px;
    background-color: #f8f9fa;
    border-radius: 8px;
    
    .points-info {
      display: flex;
      align-items: center;
      
      .points-value {
        font-size: 20px;
        font-weight: 700;
        color: #4e6ef2;
        margin-right: 4px;
        line-height: 1;
      }
      
      .points-label {
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }
    }
  }

  .member-info {
    flex: 1;
    padding: 8px;
    background-color: #f8f9fa;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.vip-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 18px;
    margin: 5px 0;
    background: linear-gradient(135deg, #2f8f8f, #43cbcb);
    border: 1px solid rgba(184, 134, 11, 0.3);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: 0.5s;
    }
    
    &:hover {
        transform: translateY(-2px);
        
        &::before {
            left: 100%;
        }
    }
    
    &:active {
        transform: translateY(1px);
    }
    
    .vip-text {
        flex: 1;
        font-size: 15px;
        color: #FFE5B4;
        font-weight: 600;
        margin: 0 12px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        letter-spacing: 0.5px;
    }
    
    :deep(.uni-icons) {
        color: #FFE5B4 !important;
        filter: drop-shadow(0 1px 1px rgba(255, 255, 255, 0.5));
    }
  }
  
  .feature-cards {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
    gap: 10px;
  }
  
  .feature-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
    }
    
    .feature-icon {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .feature-text {
      font-size: 12px;
      color: #333;
      font-weight: 500;
    }
  }
  
  .history-tabs {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    margin-top: 15px;
    position: relative;
    
    .tab {
      padding: 10px 0;
      margin-right: 20px;
      position: relative;
      
      text {
        font-size: 14px;
        color: #666;
      }
      
      &.active {
        text {
          color: #333;
          font-weight: 500;
        }
        
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #333;
        }
      }
    }
    
    .tab-action {
      position: absolute;
      right: 0;
      top: 10px;
      
      text {
        font-size: 14px;
        color: #4e6ef2;
      }
    }
  }
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    z-index: 99;
}

.sidebar.active {
    left: 0;
    box-shadow: 4rpx 0 16rpx rgba(0, 0, 0, 0.1);
}

.main-content {
    position: relative;
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    background-color: #ffffff;
}

.quick-actions {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 10;
}

.image-gen-panel {
    padding: 16px;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}
.prompt-tag-wrappera {
    margin: 0 5px;

}
.prompt-tag-wrapper {
    margin: 0 12px;
    flex: 1;
    display: flex;
    justify-content: flex-start;
}

.panel-title {
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
}

.settings-grid {
    display: grid;
    gap: 16px;
}

.setting-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.setting-label {
    min-width: 80px;
    font-size: 14px;
    color: #666;
}

.setting-control {
    flex: 1;
}

.full-width-select {
    width: 100%;
}

.number-box-container {
    display: flex;
    align-items: center;
}

.custom-number-box {
    width: 120px;
}
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250rpx, 1fr));
  gap: 16rpx;
  border-radius: 12rpx;
  width: 100%;
  max-width: 600rpx;
  margin: 0 auto;
  grid-auto-rows: 1fr;
}

.image-grid image {
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 8rpx;
  object-fit: cover;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-grid image:hover {
  transform: scale(1.02);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.image-grid .single-image {
  grid-column: span 2;
  grid-row: span 2;
  aspect-ratio: 1/1;
  max-height: none;
}

.image-gallery-container {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
}

.image-gallery-container:hover {
  transform: scale(1.02);
}

.gallery-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
}
.message {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    padding: 0;
    max-width: 100%;
    box-sizing: border-box;
    align-items: flex-start;
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
    transition: opacity 0.3s ease;
}

.model-info {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}

.model-name {
    font-size: 14px;
    color: #4e6ef2;
    font-weight: 500;
}



.header {
    padding: 10px 14px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
}


.model-selector text {
    font-weight: bold;
    font-size: 16px;
}

.model-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    min-width: 200px;
}

.model-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.model-item:hover {
    background-color: #f5f5f5;
}

.model-item-content {
    display: flex;
    flex-direction: column;
    padding: 2rpx 20rpx;
    gap:2rpx;
}

.model-header {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.model-name {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}


.selected {
    color: #2979ff;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.chat-area {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    scroll-behavior: smooth;
    contain: content;
}
 .feature-value {
      font-size: 12px;
      color: #4e6ef2;
      font-weight:300;
    }
.ai-message {
    align-self: flex-start;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 16px;
}

.user-message {
    align-self: flex-end;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0 16px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: #e8f0fe;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-bottom: 8px;
}

.user-avatar {
    background-color: #4e6ef2;
}

.message-content {
    padding: 5px 20px;
    background-color: #ffffff;
    border-radius: 16px;
    font-size: 15px;
    line-height: 1.4;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    max-width: 90%;
    margin: 0 12px;
    word-break: break-word;
    animation: fadeIn 0.3s ease-out;
    color: #000000;
}

.ai-content {
    background-color: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 16px 0;
    margin: 0;
    max-width: 100%;
    width: 100%;
}

.user-content {
    background-color: #4e6ef2;
    color: #fff;
}

.input-area input {
    flex: 1;
    border: none;
    background: none;
    font-size: 15px;
    padding: 8px 0;
    outline: none;
    min-height: 24px;
    max-height: 200px;
    resize: none;
    line-height: 1.4;
    transition: all 0.3s ease;
}

.input-icons {
    display: flex;
    gap: 12px;
    align-items: center;
    
    .icon {
        color: #999;
        cursor: pointer;
        
        &:hover {
            color: #4e6ef2;
        }
    }
    
    .circle-button {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e9ecec;
        transition: all 0.3s ease;
        cursor: pointer;
        margin-left: 10rpx;
        
        &.send-active {
            background-color: #4e6ef2;
            .icon {
                color: #fff;
            }
        }
        
        &.stop-button {
            background-color: #4e6ef2;
            .icon {
                color: #fff;
            }
        }
        
        &:hover {
            transform: scale(1.05);
        }
        
        &:active {
            transform: scale(0.95);
        }
    }
}

.suggested-questions {
    margin: 20px 16px;
    width: calc(100% - 32px);
}

.question-list {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
    margin-top: 16rpx;
}

.question-bubble {
    display: flex;
    align-items: center;
    gap: 8rpx;
    background-color: #ffffff;
    padding: 16rpx 24rpx;
    border-radius: 32rpx;
    width: fit-content;
    max-width: 100%;
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
}

.question-bubble:active {
    background-color: #e0e0e0;
}

.question-bubble text {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 8rpx;
    
    &.selected {
      color: #2979ff;
      font-weight: 500;
    }
}
  


.footer {
	padding: 12px 16px;
}


.toggle-button {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 6px 12px;
	border-radius: 16px;
	background-color: #ffffff;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 1px solid #e0e0e0;
}

.toggle-button.active {
	background-color: #eef3fe;
}

.toggle-button text {
	font-size: 14px;
	transition: color 0.3s ease;
}

.input-area {
	display: flex;
	align-items: center;
	background-color: #ffffff;
	border-radius: 24px;
	padding: 8px 16px;
	transition: box-shadow 0.2s;
	border: 1px solid #e0e0e0;
}

.input-area:focus-within {
	box-shadow: 0 0 0 2px rgba(78, 110, 242, 0.1);
}



.model-dropdown {
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	background-color: #fff;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	max-height: 300px;
	overflow-y: auto;
	min-width: 200px;
}

.model-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover, &:active {
        background-color: #f5f5f5;
    }
    
    .model-header {
        display: flex;
        align-items: center;
        gap: 8rpx;
    }
    
    .model-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        
        &.selected {
            color: #2979ff;
            font-weight: 600;
        }
    }
    
    .model-description {
        font-size: 24rpx;
        color: #666;
        line-height: 1.4;
    }
    
    .check-icon {
        margin-right: 4px;
    }
}

.nav-center {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
}
.sidebar-header {
    padding: 24rpx 32rpx;
    border-bottom: 1px solid #f0f0f0;
}

.new-chat {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #4e6ef2;
    color: #fff;
    padding: 10px 16px;
    border-radius: 8px;
     justify-content: center; /* 新增此行 */
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
        background-color: darken(#4e6ef2, 5%);
    }
    text {
        font-size: 14px;
    }
}

.new-chat:active {
    transform: scale(0.98);
}

.new-chat text {
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 500;
}

.new-chat uni-icons {
    color: #ffffff;
}

.history-list {
    flex: 1;
    overflow-y: auto;
    padding: 16rpx;
    max-height: calc(100vh - 80px);
    width: 100%;
    box-sizing: border-box;
}

.empty-history {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    color: #999;
    font-size: 14px;
}

.history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    cursor: pointer;
    border-radius: 12rpx;
    transition: all 0.3s ease;
    margin-bottom: 8rpx;
    background-color: #ffffff;
    border: 1px solid transparent;
}

.history-item:hover {
    background-color: #f8f9fa;
    border-color: #e0e0e0;
}

.history-item.active {
    background-color: #f0f4ff;
    border-color: #4e6ef2;
    box-shadow: 0 2rpx 12rpx rgba(78, 110, 242, 0.1);
}

.history-item-content {
    flex: 1;
    overflow: hidden;
}

.history-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8rpx;
}

.history-model {
    display: flex;
    align-items: center;
    gap: 4rpx;
}

.model-label {
    font-size: 24rpx;
    color: #4e6ef2;
}

.history-title {
    font-size: 28rpx;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}

.history-time {
    font-size: 22rpx;
    color: #999;
}

.delete-icon {
    color: #999;
    margin-left: 12rpx;
}

.delete-icon:hover {
    color: #ff4d4f;
}



.search-toggle {
	padding: 0 10px 10px;
	display: flex;
	gap: 5px; /* 添加间距 */
}



.input-area {
    position: relative;
    padding: 12px 16px;
    background: #fff;
    border-top: 1px solid #eee;
    display: flex;
    align-items: flex-start;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    z-index: 10; /* 确保输入区域在最上层 */
    @media (max-width: 768px) {
        padding: 8px 12px; /* 移动端适配 */
    }
}

.input-area textarea {
    flex: 1;
    border: none;
    background: none;
    font-size: 15px;
    padding: 8px 0;
    outline: none;
    min-height: 24px;
    max-height: 100px;
    overflow-y: auto;
    resize: none;
    line-height: 1.4;
    transition: all 0.3s ease;
    word-break: break-word;
    white-space: pre-wrap;
    color: #000000;
	
}

.input-area::-webkit-scrollbar {
    width: 4px;
}

.input-area::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
}

.input-area::-webkit-scrollbar-track {
    background-color: transparent;
}

.input-icons {
    display: flex;
    gap: 12px;
    align-items: center;
    
    .icon {
        color: #999;
        cursor: pointer;
        
        &:hover {
            color: #4e6ef2;
        }
    }
}

.suggested-questions {
    margin: 20px 16px;
    width: calc(100% - 32px);
}

.question-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.question-item {
    padding: 10px 14px;
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
    box-sizing: border-box;
}

.question-item:hover {
	background-color: #f0f0f0;
}

.divider {
    height: 1px;
    background-color: #e5e5e5;
    margin: 30rpx 0;
}

.question-title {
    font-size: 16px;
    color: #666;
    margin-bottom: 16px;
    padding-left: 4px;
    font-weight: 500;
}





.input-area {
	display: flex;
	align-items: center;
	background-color: #ffffff;
	border-radius: 24px;
	padding: 8px 16px;
	transition: box-shadow 0.2s;
	border: 1px solid #e0e0e0;
}

.input-area:focus-within {
	box-shadow: 0 0 0 2px rgba(78, 110, 242, 0.1);
}

.model-selector {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    @media (max-width: 768px) {
        font-size: 12px; /* 移动端字体大小调整 */
    }
}

.model-dropdown {
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	background-color: #fff;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	max-height: 300px;
	overflow-y: auto;
	min-width: 200px;
}

.model-item {
	padding: 12px 16px;
	cursor: pointer;
	transition: background-color 0.2s;
}

.model-item:hover {
	background-color: #f5f5f5;
}


.model-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.model-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  
  &.selected {
      color: #2979ff;
      font-weight: 600;
  }
}


.selected {
  color: #2979ff;
}

.check-icon {
	margin-right: 1px;
}

.model-item {
	cursor: pointer;
}

.model-item:hover {
	background-color: #f5f5f5;
}

.selected {
	color: #2979ff;
	font-weight: 500;
}

.nav-center {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 10px;
  background: rgba(78, 110, 242, 0.05);
  border-radius: 8px;
  gap: 10rpx;
  border: 1px solid rgba(78, 110, 242, 0.2);
}

.loading-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #4e6ef2;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.loading-text {
  font-size: 14px;
  color: #4e6ef2;
}

.stop-generate-btn {
  display: flex;
  align-items: center;
  margin-left: 15px;
  padding: 4px 12px;
  background-color: #ff4d4f;
  border-radius: 4px;
  cursor: pointer;
}

.stop-generate-btn text {
  color: #fff;
  font-size: 14px;
  margin-left: 4px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

