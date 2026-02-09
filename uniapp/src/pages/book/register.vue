<template>

  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <!-- Back Button -->
        <view class="back-row fade-in">
          <view class="back-btn" @click="goBack">
            <text class="fas fa-arrow-left"></text>
          </view>
        </view>

        <!-- Header -->
        <view class="header-section fade-in" style="animation-delay: 0.1s">
          <view class="page-title">创建账号</view>
          <view class="page-desc">加入 MindBond，开启你的成长之旅</view>
        </view>

        <!-- Progress Steps -->
        <view class="progress-steps fade-in" style="animation-delay: 0.15s">
          <view class="step" :class="{ active: step >= 1, completed: step > 1 }">
            <view class="step-dot">
              <text v-if="step > 1" class="fas fa-check"></text>
              <text v-else>1</text>
            </view>
            <text class="step-label">手机验证</text>
          </view>
          <view class="step-line" :class="{ active: step > 1 }"></view>
          <view class="step" :class="{ active: step >= 2, completed: step > 2 }">
            <view class="step-dot">
              <text v-if="step > 2" class="fas fa-check"></text>
              <text v-else>2</text>
            </view>
            <text class="step-label">设置密码</text>
          </view>
          <view class="step-line" :class="{ active: step > 2 }"></view>
          <view class="step" :class="{ active: step >= 3 }">
            <view class="step-dot">3</view>
            <text class="step-label">完善资料</text>
          </view>
        </view>

        <!-- Step 1: Phone Verification -->
        <view v-if="step === 1" class="form-section fade-in" style="animation-delay: 0.2s">
          <view class="input-group">
            <view class="input-label">手机号</view>
            <view class="input-wrapper">
              <text class="fas fa-mobile-alt input-icon"></text>
              <input v-model="phone" type="tel" class="form-input" placeholder="请输入手机号" maxlength="11">
            </view>
          </view>

          <view class="input-group">
            <view class="input-label">验证码</view>
            <view class="input-wrapper">
              <text class="fas fa-shield-alt input-icon"></text>
              <input v-model="verifyCode" type="text" class="form-input with-btn" placeholder="请输入验证码" maxlength="6">
              <view class="send-code-btn" :class="{ disabled: countdown > 0 }" @click="sendCode">
                <text>{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
              </view>
            </view>
          </view>

          <view class="next-btn" :class="{ disabled: !canStep1 }" @click="step = 2">
            <text>下一步</text>
          </view>
        </view>

        <!-- Step 2: Set Password -->
        <view v-if="step === 2" class="form-section fade-in">
          <view class="input-group">
            <view class="input-label">设置密码</view>
            <view class="input-wrapper">
              <text class="fas fa-lock input-icon"></text>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input"
                placeholder="请设置6-20位密码">
              <view class="toggle-password" @click="showPassword = !showPassword">
                <text :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></text>
              </view>
            </view>
            <view class="password-strength">
              <view class="strength-bar" :class="passwordStrength"></view>
              <text class="strength-text">{{ passwordStrengthText }}</text>
            </view>
          </view>

          <view class="input-group">
            <view class="input-label">确认密码</view>
            <view class="input-wrapper">
              <text class="fas fa-lock input-icon"></text>
              <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="form-input"
                placeholder="请再次输入密码">
              <view class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                <text :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></text>
              </view>
            </view>
            <view v-if="confirmPassword && password !== confirmPassword" class="error-text">
              <text>两次密码不一致</text>
            </view>
          </view>

          <view class="btn-group">
            <view class="back-step-btn" @click="step = 1">
              <text>上一步</text>
            </view>
            <view class="next-btn flex-1" :class="{ disabled: !canStep2 }" @click="step = 3">
              <text>下一步</text>
            </view>
          </view>
        </view>

        <!-- Step 3: Complete Profile -->
        <view v-if="step === 3" class="form-section fade-in">
          <view class="avatar-section">
            <view class="avatar-upload">
              <image v-if="avatarUrl" :src="avatarUrl" class="avatar-preview" mode="aspectFill"></image>
              <view v-else class="avatar-placeholder">
                <text class="fas fa-camera"></text>
              </view>
              <view class="avatar-edit-btn">
                <text class="fas fa-pen"></text>
              </view>
            </view>
            <view class="avatar-hint">
              <text>点击上传头像</text>
            </view>
          </view>

          <view class="input-group">
            <view class="input-label">昵称</view>
            <view class="input-wrapper">
              <text class="fas fa-user input-icon"></text>
              <input v-model="nickname" type="text" class="form-input" placeholder="给自己取个昵称吧" maxlength="20">
            </view>
          </view>

          <view class="input-group">
            <view class="input-label">性别（选填）</view>
            <view class="gender-options">
              <view class="gender-btn" :class="{ active: gender === 'male' }" @click="gender = 'male'">
                <text class="fas fa-mars"></text>
                <text> 男</text>
              </view>
              <view class="gender-btn" :class="{ active: gender === 'female' }" @click="gender = 'female'">
                <text class="fas fa-venus"></text>
                <text> 女</text>
              </view>
              <view class="gender-btn" :class="{ active: gender === 'secret' }" @click="gender = 'secret'">
                <text class="fas fa-user-secret"></text>
                <text> 保密</text>
              </view>
            </view>
          </view>

          <!-- Agreement -->
          <view class="agreement-check" @click="agreeTerms = !agreeTerms">
            <input type="checkbox" v-model="agreeTerms" style="display: none;">
            <view class="checkmark"></view>
            <text>我已阅读并同意 <text class="agreement-link">用户协议</text> 和 <text class="agreement-link">隐私政策</text></text>
          </view>

          <view class="btn-group">
            <view class="back-step-btn" @click="step = 2">
              <text>上一步</text>
            </view>
            <view class="submit-btn flex-1" :class="{ disabled: !canSubmit }" @click="handleRegister">
              <text v-if="!isLoading">完成注册</text>
              <text v-else class="fas fa-spinner fa-spin"></text>
            </view>
          </view>
        </view>

        <!-- Login Link -->
        <view class="login-link fade-in" style="animation-delay: 0.3s">
          <view class="login-link-text">
            <text>已有账号？</text>
            <text class="login-link-action" @click="goToLogin">立即登录</text>
          </view>
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

// Step 1
const phone = ref('')
const verifyCode = ref('')
const countdown = ref(0)

// Step 2
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Step 3
const avatarUrl = ref('')
const nickname = ref('')
const gender = ref('')
const agreeTerms = ref(false)
const isLoading = ref(false)

const canStep1 = computed(() => {
  return phone.value.length === 11 && verifyCode.value.length === 6
})

const canStep2 = computed(() => {
  return password.value.length >= 6 && password.value === confirmPassword.value
})

const canSubmit = computed(() => {
  return nickname.value.length > 0 && agreeTerms.value
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

const handleRegister = async () => {
  if (!canSubmit.value) return

  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    router.push('/home')
  }, 1500)
}

const goBack = () => {
  if (step.value > 1) {
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
  margin-bottom: 32rpx;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  color: var(--text-primary);
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-section {
  margin-bottom: 48rpx;
}

.page-title {
  font-size: 56rpx;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 16rpx;
}

.page-desc {
  font-size: 28rpx;
  color: var(--text-muted);
}

/* Progress Steps */
.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 64rpx;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.step-dot {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 4rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: var(--text-muted);
  transition: all 0.3s;
}

.step.active .step-dot {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-color: var(--accent-gold);
  color: #1a1a2e;
}

.step.completed .step-dot {
  background: var(--accent-green);
  border-color: var(--accent-green);
  color: #fff;
}

.step-label {
  font-size: 22rpx;
  color: var(--text-muted);
}

.step.active .step-label {
  color: var(--accent-gold);
}

.step-line {
  width: 80rpx;
  height: 4rpx;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 16rpx 48rpx;
  transition: all 0.3s;
}

.step-line.active {
  background: var(--accent-gold);
}

/* Form */
.form-section {
  margin-bottom: 48rpx;
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
  color: var(--text-muted);
  font-size: 32rpx;
}

.send-code-btn {
  position: absolute;
  right: 16rpx;
  padding: 20rpx 32rpx;
  background: rgba(244, 208, 63, 0.2);
  border-radius: 16rpx;
  font-size: 26rpx;
  color: var(--accent-gold);
  font-weight: 500;
}

.send-code-btn.disabled {
  opacity: 0.5;
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

/* Avatar */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48rpx;
}

.avatar-upload {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 24rpx;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 4rpx dashed rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  color: var(--text-muted);
}

.avatar-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 64rpx;
  height: 64rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border: 6rpx solid #1a1a2e;
  border-radius: 50%;
  color: #1a1a2e;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-hint {
  font-size: 26rpx;
  color: var(--text-muted);
}

/* Gender */
.gender-options {
  display: flex;
  gap: 24rpx;
}

.gender-btn {
  flex: 1;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 24rpx;
  color: var(--text-secondary);
  font-size: 28rpx;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.gender-btn.active {
  background: rgba(244, 208, 63, 0.15);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

/* Agreement */
.agreement-check {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  font-size: 26rpx;
  color: var(--text-muted);
  margin-bottom: 48rpx;
}

.agreement-check .checkmark {
  width: 36rpx;
  height: 36rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 8rpx;
  flex-shrink: 0;
  margin-top: 4rpx;
  position: relative;
}

.agreement-check input:checked+.checkmark {
  background: var(--accent-gold);
  border-color: var(--accent-gold);
}

.agreement-check input:checked+.checkmark::after {
  content: '';
  position: absolute;
  left: 10rpx;
  top: 4rpx;
  width: 8rpx;
  height: 16rpx;
  border: solid #1a1a2e;
  border-width: 0 4rpx 4rpx 0;
  transform: rotate(45deg);
}

.agreement-link {
  color: var(--accent-gold);
}

/* Buttons */
.btn-group {
  display: flex;
  gap: 24rpx;
}

.next-btn,
.submit-btn {
  width: 100%;
  padding: 32rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a2e;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.next-btn.disabled,
.submit-btn.disabled {
  opacity: 0.5;
}

.back-step-btn {
  padding: 32rpx 48rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  font-size: 32rpx;
  color: var(--text-primary);
}

.flex-1 {
  flex: 1;
}

/* Login Link */
.login-link {
  text-align: center;
}

.login-link-text {
  font-size: 28rpx;
  color: var(--text-muted);
}

.login-link-action {
  color: var(--accent-gold);
  font-weight: 600;
}

/* Disabled State */
.disabled {
  opacity: 0.5;
}
</style>