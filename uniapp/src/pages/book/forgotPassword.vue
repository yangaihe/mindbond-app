<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <view class="back-row fade-in">
          <view class="back-btn" @click="goBack">
            <view class="fas fa-arrow-left"></view>
          </view>
        </view>

        <view class="header-section fade-in" style="animation-delay: 0.1s">
          <view class="header-icon">
            <view class="fas fa-key"></view>
          </view>
          <view class="page-title">重置密码</view>
          <view class="page-desc">请输入注册时使用的手机号，我们将发送验证码帮助你重置密码</view>
        </view>

        <view v-if="step === 1" class="form-section fade-in" style="animation-delay: 0.2s">
          <view class="input-group">
            <label class="input-label">手机号</label>
            <view class="input-wrapper">
              <view class="fas fa-mobile-alt input-icon"></view>
              <input v-model="phone" type="tel" class="form-input" placeholder="请输入手机号" maxlength="11">
            </view>
          </view>

          <view class="input-group">
            <label class="input-label">验证码</label>
            <view class="input-wrapper">
              <view class="fas fa-shield-alt input-icon"></view>
              <input v-model="verifyCode" type="text" class="form-input with-btn" placeholder="请输入验证码" maxlength="6">
              <view class="send-code-btn" :class="{ disabled: countdown > 0 || phone.length !== 11 }" @click="sendCode">
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </view>
            </view>
          </view>

          <view class="next-btn" :class="{ disabled: !canStep1 }" @click="step = 2">
            下一步
          </view>
        </view>

        <view v-if="step === 2" class="form-section fade-in">
          <view class="step-hint">
            <view class="fas fa-check-circle"></view>
            <view>验证成功，请设置新密码</view>
          </view>

          <view class="input-group">
            <label class="input-label">新密码</label>
            <view class="input-wrapper">
              <view class="fas fa-lock input-icon"></view>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input"
                placeholder="请设置6-20位新密码">
              <view class="toggle-password" @click="showPassword = !showPassword">
                <view :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></view>
              </view>
            </view>
            <view class="password-strength">
              <view class="strength-bar" :class="passwordStrength"></view>
              <view class="strength-text">{{ passwordStrengthText }}</view>
            </view>
          </view>

          <view class="input-group">
            <label class="input-label">确认新密码</label>
            <view class="input-wrapper">
              <view class="fas fa-lock input-icon"></view>
              <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="form-input"
                placeholder="请再次输入新密码">
              <view class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                <view :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></view>
              </view>
            </view>
            <view v-if="confirmPassword && password !== confirmPassword" class="error-text">
              两次密码不一致
            </view>
          </view>

          <view class="submit-btn" :class="{ disabled: !canSubmit }" @click="handleSubmit">
            <view v-if="!isLoading">确认重置</view>
            <view v-else class="fas fa-spinner fa-spin"></view>
          </view>
        </view>

        <view v-if="step === 3" class="success-section fade-in">
          <view class="success-icon">
            <view class="fas fa-check"></view>
          </view>
          <view class="success-title">密码重置成功</view>
          <view class="success-desc">你的密码已成功重置，请使用新密码登录</view>
          <view class="login-btn" @click="goToLogin">
            立即登录
          </view>
        </view>

        <view v-if="step !== 3" class="help-section fade-in" style="animation-delay: 0.3s">
          遇到问题？<text class="contact-cs">联系客服</text>
        </view>
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const step = ref(1)

const phone = ref('')
const verifyCode = ref('')
const countdown = ref(0)

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

const canStep1 = computed(() => {
  return phone.value.length === 11 && verifyCode.value.length === 6
})

const canSubmit = computed(() => {
  return password.value.length >= 6 && password.value === confirmPassword.value
})

const passwordStrength = computed(() => {
  if (password.value.length === 0) return ''
  if (password.value.length < 6) return 'weak'
  if (password.value.length < 10) return 'medium'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  if (password.value.length === 0) return ''
  if (password.value.length < 6) return '弱'
  if (password.value.length < 10) return '中'
  return '强'
})

const sendCode = () => {
  if (phone.value.length !== 11) return
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    step.value = 3
  }, 1500)
}

const goBack = () => {
  if (step.value > 1 && step.value < 3) {
    step.value--
  } else {
    router.back()
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.back-row {
  margin-bottom: 48rpx;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 24rpx;
  color: var(--text-primary);
  font-size: 32rpx;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-section {
  text-align: center;
  margin-bottom: 64rpx;
}

.header-icon {
  width: 144rpx;
  height: 144rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.2) 0%, rgba(243, 156, 18, 0.1) 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  color: var(--accent-gold);
  margin: 0 auto 40rpx;
}

.page-title {
  font-size: 56rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 24rpx;
}

.page-desc {
  font-size: 28rpx;
  color: var(--text-muted);
  line-height: 1.6;
}

.form-section {
  margin-bottom: 48rpx;
}

.step-hint {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 32rpx;
  background: rgba(88, 214, 141, 0.15);
  border-radius: 24rpx;
  margin-bottom: 48rpx;
  font-size: 28rpx;
  color: var(--accent-green);
}

.step-hint view {
  font-size: 36rpx;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-label {
  display: block;
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-bottom: 16rpx;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 32rpx;
  color: var(--text-muted);
  font-size: 32rpx;
}

.form-input {
  width: 100%;
  padding: 32rpx 32rpx 32rpx 96rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 24rpx;
  color: var(--text-primary);
  font-size: 32rpx;
  outline: none;
  transition: all 0.2s;
}

.form-input.with-btn {
  padding-right: 220rpx;
}

.form-input:focus {
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.toggle-password {
  position: absolute;
  right: 32rpx;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 32rpx;
  cursor: pointer;
}

.send-code-btn {
  position: absolute;
  right: 16rpx;
  padding: 20rpx 32rpx;
  background: rgba(244, 208, 63, 0.2);
  border: none;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: var(--accent-gold);
  font-weight: 500;
  cursor: pointer;
}

.send-code-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 16rpx;
}

.strength-bar {
  flex: 1;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
  position: relative;
  overflow: hidden;
}

.strength-bar::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 4rpx;
  transition: all 0.3s;
}

.strength-bar.weak::after {
  width: 33%;
  background: #e74c3c;
}

.strength-bar.medium::after {
  width: 66%;
  background: var(--accent-orange);
}

.strength-bar.strong::after {
  width: 100%;
  background: var(--accent-green);
}

.strength-text {
  font-size: 24rpx;
  color: var(--text-muted);
  min-width: 40rpx;
}

.error-text {
  font-size: 24rpx;
  color: #e74c3c;
  margin-top: 12rpx;
}

.next-btn,
.submit-btn {
  width: 100%;
  text-align: center;
  padding: 32rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border: none;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  transition: all 0.2s;
}

.next-btn.disabled,
.submit-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-section {
  text-align: center;
  padding: 80rpx 0;
}

.success-icon {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, var(--accent-green) 0%, #27ae60 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72rpx;
  color: #fff;
  margin: 0 auto 48rpx;
}

.success-title {
  font-size: 48rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 24rpx;
}

.success-desc {
  font-size: 28rpx;
  color: var(--text-muted);
  margin-bottom: 64rpx;
}

.login-btn {
  width: 100%;
  padding: 32rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border: none;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
}

.help-section {
  text-align: center;
  margin-top: 64rpx;
  color: var(--text-muted);
}

.help-section .contact-cs {
  font-size: 28rpx;
  color: var(--accent-gold);
  text-decoration: underline;
}

</style>
