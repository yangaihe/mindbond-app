<template>
	<view class="welcome-container">
		<!-- 欢迎页轮播 -->
		<swiper class="swiper" :indicator-dots="true" :autoplay="false" indicator-active-color="#6366F1" indicator-color="rgba(0,0,0,.2)">
			<!-- 第一页 -->
			<swiper-item>
				<view class="swiper-item fade-in">
					<image class="welcome-image fade-in-up delay-1" src="/static/images/welcome1.png" mode="aspectFit"></image>
					<view class="welcome-text fade-in-up delay-2">
						<text class="welcome-title">探索内心世界</text>
						<text class="welcome-desc"><text class="fa fa-compass"></text> 通过心光年，开始一段自我探索与成长的旅程</text>
					</view>
				</view>
			</swiper-item>
			<!-- 第二页 -->
			<swiper-item>
				<view class="swiper-item fade-in">
					<image class="welcome-image fade-in-up delay-1" src="/static/images/welcome2.png" mode="aspectFit"></image>
					<view class="welcome-text fade-in-up delay-2">
						<text class="welcome-title">记录情绪变化</text>
						<text class="welcome-desc"><text class="fa fa-chart-line"></text> 每日情绪打卡，帮助你更好地了解自己的情绪模式</text>
					</view>
				</view>
			</swiper-item>
			<!-- 第三页 -->
			<swiper-item>
				<view class="swiper-item fade-in">
					<image class="welcome-image fade-in-up delay-1" src="/static/images/welcome3.png" mode="aspectFit"></image>
					<view class="welcome-text fade-in-up delay-2">
						<text class="welcome-title">AI心灵伙伴</text>
						<text class="welcome-desc"><text class="fa fa-robot"></text> 随时与AI助手对话，获得情绪支持和心理洞察</text>
					</view>
					<view class="welcome-buttons fade-in-up delay-3">
						<button class="btn-login" @click="navigateToLogin">
							<text class="fa fa-sign-in-alt"></text> 登录
						</button>
						<button class="btn-register" @click="navigateToRegister">
							<text class="fa fa-user-plus"></text> 注册
						</button>
					</view>
				</view>
			</swiper-item>
		</swiper>
		
		<!-- 跳过按钮 -->
		<view class="skip-button fade-in" @click="navigateToIndex">
			<text>跳过 <text class="fa fa-angle-right"></text></text>
		</view>
		
		<!-- 品牌标志 -->
		<view class="brand-logo fade-in">
			<text class="brand-name">心光年</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			navigateToIndex() {
				uni.setStorageSync("welcomeToIndex",new Date().getTime());				
				location.href = "/"
			},
			navigateToLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			navigateToRegister() {
				uni.navigateTo({
					url: '/pages/register/register"'
				});
			}
		}
	}
</script>

<style>
	.welcome-container {
		position: relative;
		width: 100%;
		height: 100vh;
		background-color: #FFFFFF;
		overflow: hidden;
	}
	
	.swiper {
		width: 100%;
		height: 100%;
	}
	
	.swiper-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
		margin-top:85px;
	}
	
	.welcome-image {
		width: 85%;
		height: 50vh;
		margin-bottom: 60rpx;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
	}
	
	.welcome-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 80rpx;
	}
	
	.welcome-title {
		font-size: 44rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 20rpx;
		background: linear-gradient(45deg, #4F46E5, #8B5CF6);
		-webkit-background-clip: text;
		color: transparent;
	}
	
	.welcome-desc {
		font-size: 30rpx;
		color: #666666;
		text-align: center;
		line-height: 1.5;
	}
	
	.welcome-desc .fa {
		color: #6366F1;
		margin-right: 8rpx;
	}
	
	.welcome-buttons {
		display: flex;
		flex-direction: column;
		width: 80%;
	}
	
	.btn-login {
		background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
		color: #FFFFFF;
		border-radius: 50rpx;
		font-size: 32rpx;
		margin-bottom: 30rpx;
		/* padding: 25rpx 0; */
		box-shadow: 0 8rpx 20rpx rgba(99, 102, 241, 0.3);
		transition: all 0.3s ease;
	}
	
	.btn-login:active {
		transform: translateY(2rpx);
		box-shadow: 0 4rpx 10rpx rgba(99, 102, 241, 0.2);
	}
	
	.btn-register {
		background-color: #FFFFFF;
		color: #6366F1;
		border: 2rpx solid #6366F1;
		border-radius: 50rpx;
		font-size: 32rpx;
		/* padding: 25rpx 0; */
		transition: all 0.3s ease;
	}
	
	.btn-register:active {
		background-color: #F5F7FF;
	}
	
	.skip-button {
		position: absolute;
		top: 60rpx;
		right: 40rpx;
		padding: 12rpx 30rpx;
		border-radius: 30rpx;
		background-color: rgba(0, 0, 0, 0.05);
		color: #666666;
		font-size: 26rpx;
		z-index: 10;
	}
	
	.brand-logo {
		position: absolute;
		top: 60rpx;
		left: 40rpx;
		z-index: 10;
	}
	
	.brand-name {
		font-size: 36rpx;
		font-weight: bold;
		background: linear-gradient(45deg, #4F46E5, #8B5CF6);
		-webkit-background-clip: text;
		color: transparent;
	}
	
	.fa {
		font-family: 'FontAwesome';
	}
</style> 