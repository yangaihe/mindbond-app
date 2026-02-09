<script setup lang="ts">
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/book'
import { checkUpdate } from "@/utils/appUpdate"

const appStore = useAppStore()
const { getUser,isLogin } = useUserStore()
const bookStore = useBookStore()
onLaunch(async () => {
	bookStore.initPlayer()
    await appStore.getConfig()
    await getUser()
})
onShow(async () => {
    checkUpdate()
})
</script>
<style lang="scss">
//
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	
	
</style>
<style>
	/*每个页面公共css */
	@import url('@/static/fonts/fontawesome/all.css');
	@import url('@/static/fonts/xgnfonts/iconfont.css');
	.xgn-iconfont {
		/* 重置字体图标的默认字体大小，继承父级 */
		font-size:inherit; 
	}
	page {
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
		background-color: #F8FAFC;
		font-size: 28rpx;
		color: #333333;
		line-height: 1.5;
		box-sizing: border-box;
	}
	
	view, text, button, input, textarea {
		box-sizing: border-box;
	}
	
	button {
		margin: 0;
		padding: 0;
		border-radius: 0;
		background-color: transparent;
	}
	
	button::after {
		border: none;
	}
	
	/* 添加动画效果 */
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translate3d(0, 30px, 0);
		}
		to {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
	}
	
	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translate3d(0, -30px, 0);
		}
		to {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
	}
	
	.fade-in {
		animation: fadeIn 0.8s ease forwards;
	}
	
	.fade-in-up {
		animation: fadeInUp 0.8s ease forwards;
	}
	
	.fade-in-down {
		animation: fadeInDown 0.8s ease forwards;
	}
	
	.delay-1 {
		animation-delay: 0.3s;
	}
	
	.delay-2 {
		animation-delay: 0.6s;
	}
	
	.delay-3 {
		animation-delay: 0.9s;
	}
</style>