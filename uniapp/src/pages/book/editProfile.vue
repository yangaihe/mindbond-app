<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <view class="header-row fade-in">
          <view class="back-btn" @click="goBack">
            <view class="fas fa-arrow-left"></view>
          </view>
          <view class="page-title">编辑资料</view>
          <view class="save-btn" :class="{ disabled: !hasChanges }" @click="handleSave">
            <view v-if="!isSaving">保存</view>
            <view v-else class="fas fa-spinner fa-spin"></view>
          </view>
        </view>

        <view class="avatar-section fade-in" style="animation-delay: 0.1s">
          <view class="avatar-upload">
            <image :src="avatarUrl" class="avatar-preview" mode="aspectFill"></image>
            <view class="avatar-edit-btn" @click="changeAvatar">
              <view class="fas fa-camera"></view>
            </view>
          </view>
          <view class="avatar-hint">点击更换头像</view>
        </view>

        <view class="form-section fade-in" style="animation-delay: 0.2s">
          <view class="form-item" @click="editField('nickname')">
            <view class="form-item-label">昵称</view>
            <view class="form-item-content">
              <view class="form-item-value">{{ nickname }}</view>
              <view class="fas fa-chevron-right"></view>
            </view>
          </view>

          <view class="form-item" @click="editField('bio')">
            <view class="form-item-label">个性签名</view>
            <view class="form-item-content">
              <view class="form-item-value" :class="{ placeholder: !bio }">
                {{ bio || '写一句话介绍自己' }}
              </view>
              <view class="fas fa-chevron-right"></view>
            </view>
          </view>

          <view class="form-item" @click="showGenderPicker = true">
            <view class="form-item-label">性别</view>
            <view class="form-item-content">
              <view class="form-item-value">{{ genderText }}</view>
              <view class="fas fa-chevron-right"></view>
            </view>
          </view>

          <view class="form-item" @click="editField('birthday')">
            <view class="form-item-label">生日</view>
            <view class="form-item-content">
              <view class="form-item-value" :class="{ placeholder: !birthday }">
                {{ birthday || '未设置' }}
              </view>
              <view class="fas fa-chevron-right"></view>
            </view>
          </view>

          <view class="form-item" @click="editField('location')">
            <view class="form-item-label">所在地</view>
            <view class="form-item-content">
              <view class="form-item-value" :class="{ placeholder: !location }">
                {{ location || '未设置' }}
              </view>
              <view class="fas fa-chevron-right"></view>
            </view>
          </view>
        </view>

        <view class="section-header fade-in" style="animation-delay: 0.3s">
          <view>账号信息</view>
        </view>

        <view class="form-section fade-in" style="animation-delay: 0.3s">
          <view class="form-item" @click="editField('phone')">
            <view class="form-item-label">手机号</view>
            <view class="form-item-content">
              <view class="form-item-value">{{ maskedPhone }}</view>
              <view class="fas fa-chevron-right"></view>
            </view>
          </view>

          <view class="form-item" @click="goToChangePassword">
            <view class="form-item-label">修改密码</view>
            <view class="form-item-content">
              <view class="fas fa-chevron-right"></view>
            </view>
          </view>
        </view>

        <view v-if="editingField" class="edit-modal">
          <view class="edit-modal-overlay" @click="cancelEdit"></view>
          <view class="edit-modal-content">
            <view class="edit-modal-header">
              <view class="modal-cancel-btn" @click="cancelEdit">取消</view>
              <view class="modal-title">{{ editModalTitle }}</view>
              <view class="modal-confirm-btn" @click="confirmEdit">确定</view>
            </view>
            <view class="edit-modal-body">
              <textarea v-if="editingField === 'bio'" v-model="editValue" class="edit-textarea"
                :placeholder="editPlaceholder" maxlength="100"></textarea>
              <input v-else v-model="editValue" type="text" class="edit-input" :placeholder="editPlaceholder">
              <view v-if="editingField === 'bio'" class="char-count">
                {{ editValue.length }}/100
              </view>
            </view>
          </view>
        </view>

        <view v-if="showGenderPicker" class="picker-modal">
          <view class="picker-overlay" @click="showGenderPicker = false"></view>
          <view class="picker-content">
            <view class="picker-header">
              <view class="picker-cancel" @click="showGenderPicker = false">取消</view>
              <view class="picker-title">选择性别</view>
              <view class="picker-confirm" @click="confirmGender">确定</view>
            </view>
            <view class="picker-options">
              <view v-for="option in genderOptions" :key="option.value" class="picker-option"
                :class="{ active: tempGender === option.value }" @click="tempGender = option.value">
                <view :class="option.icon"></view>
                <view>{{ option.label }}</view>
                <view v-if="tempGender === option.value" class="fas fa-check"></view>
              </view>
            </view>
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

const avatarUrl = ref('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop')
const nickname = ref('探索者')
const bio = ref('在陪伴中觉察，在觉察中成长')
const gender = ref('male')
const birthday = ref('1986-05-15')
const location = ref('北京')
const phone = ref('13812345678')

const editingField = ref('')
const editValue = ref('')
const isSaving = ref(false)
const hasChanges = ref(false)

const showGenderPicker = ref(false)
const tempGender = ref(gender.value)

const genderOptions = [
  { value: 'male', label: '男', icon: 'fas fa-mars' },
  { value: 'female', label: '女', icon: 'fas fa-venus' },
  { value: 'secret', label: '保密', icon: 'fas fa-user-secret' }
]

const genderText = computed(() => {
  const option = genderOptions.find(o => o.value === gender.value)
  return option ? option.label : '未设置'
})

const maskedPhone = computed(() => {
  if (phone.value.length >= 11) {
    return phone.value.slice(0, 3) + '****' + phone.value.slice(7)
  }
  return phone.value
})

const editModalTitle = computed(() => {
  const titles: Record<string, string> = {
    nickname: '修改昵称',
    bio: '修改签名',
    birthday: '设置生日',
    location: '设置所在地'
  }
  return titles[editingField.value] || ''
})

const editPlaceholder = computed(() => {
  const placeholders: Record<string, string> = {
    nickname: '请输入昵称',
    bio: '写一句话介绍自己',
    birthday: '请输入生日 如：1990-01-01',
    location: '请输入所在地'
  }
  return placeholders[editingField.value] || ''
})

const editField = (field: string) => {
  editingField.value = field
  const values: Record<string, string> = {
    nickname: nickname.value,
    bio: bio.value,
    birthday: birthday.value,
    location: location.value
  }
  editValue.value = values[field] || ''
}

const cancelEdit = () => {
  editingField.value = ''
  editValue.value = ''
}

const confirmEdit = () => {
  if (editingField.value === 'nickname') {
    nickname.value = editValue.value
  } else if (editingField.value === 'bio') {
    bio.value = editValue.value
  } else if (editingField.value === 'birthday') {
    birthday.value = editValue.value
  } else if (editingField.value === 'location') {
    location.value = editValue.value
  }
  hasChanges.value = true
  cancelEdit()
}

const confirmGender = () => {
  gender.value = tempGender.value
  hasChanges.value = true
  showGenderPicker.value = false
}

const changeAvatar = () => {
  console.log('Change avatar')
}

const handleSave = async () => {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    hasChanges.value = false
    router.back()
  }, 1000)
}

const goBack = () => {
  router.back()
}

const goToChangePassword = () => {
  router.push('/forgot-password')
}
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.page-title {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.save-btn {
  padding: 16rpx 32rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border: none;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  min-width: 120rpx;
}

.save-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 64rpx;
}

.avatar-upload {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 24rpx;
  cursor: pointer;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 6rpx solid rgba(255, 255, 255, 0.2);
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
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-hint {
  font-size: 26rpx;
  color: var(--text-muted);
}

.form-section {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 40rpx;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: background 0.2s;
}

.form-item:last-child {
  border-bottom: none;
}

.form-item:active {
  background: rgba(255, 255, 255, 0.05);
}

.form-item-label {
  font-size: 30rpx;
  color: var(--text-primary);
}

.form-item-content {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.form-item-value {
  font-size: 30rpx;
  color: var(--text-secondary);
  max-width: 360rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-item-value.placeholder {
  color: var(--text-muted);
}

.form-item-content view {
  color: var(--text-muted);
  font-size: 24rpx;
}

.section-header {
  padding: 0 8rpx;
  margin-bottom: 24rpx;
}

.section-header view {
  font-size: 28rpx;
  color: var(--text-muted);
  font-weight: 500;
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.edit-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.edit-modal-content {
  position: relative;
  width: 100%;
  max-width: 786rpx;
  background: #1a1a2e;
  border-radius: 40rpx 40rpx 0 0;
  padding-bottom: 68rpx;
}

.edit-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
}

.modal-cancel-btn,
.modal-confirm-btn {
  padding: 16rpx 24rpx;
  background: none;
  border: none;
  font-size: 30rpx;
  cursor: pointer;
}

.modal-cancel-btn {
  color: var(--text-muted);
}

.modal-confirm-btn {
  color: var(--accent-gold);
  font-weight: 600;
}

.modal-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.edit-modal-body {
  padding: 40rpx 32rpx;
}

.edit-input {
  width: 100%;
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 24rpx;
  color: var(--text-primary);
  font-size: 32rpx;
  outline: none;
}

.edit-input:focus {
  border-color: var(--accent-gold);
}

.edit-textarea {
  width: 100%;
  height: 240rpx;
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 24rpx;
  color: var(--text-primary);
  font-size: 32rpx;
  outline: none;
  resize: none;
  font-family: inherit;
}

.edit-textarea:focus {
  border-color: var(--accent-gold);
}

.char-count {
  text-align: right;
  font-size: 24rpx;
  color: var(--text-muted);
  margin-top: 16rpx;
}

.picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.picker-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.picker-content {
  position: relative;
  width: 100%;
  max-width: 786rpx;
  background: #1a1a2e;
  border-radius: 40rpx 40rpx 0 0;
  padding-bottom: 68rpx;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
}

.picker-cancel,
.picker-confirm {
  padding: 16rpx 24rpx;
  background: none;
  border: none;
  font-size: 30rpx;
  cursor: pointer;
}

.picker-cancel {
  color: var(--text-muted);
}

.picker-confirm {
  color: var(--accent-gold);
  font-weight: 600;
}

.picker-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.picker-options {
  padding: 16rpx 0;
}

.picker-option {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx 40rpx;
  cursor: pointer;
  transition: background 0.2s;
}

.picker-option:active {
  background: rgba(255, 255, 255, 0.05);
}

.picker-option view:first-child {
  font-size: 40rpx;
  color: var(--text-secondary);
  width: 48rpx;
  text-align: center;
}

.picker-option view:nth-child(2) {
  flex: 1;
  font-size: 32rpx;
  color: var(--text-primary);
}

.picker-option.active {
  background: rgba(244, 208, 63, 0.1);
}

.picker-option.active view:first-child {
  color: var(--accent-gold);
}

.picker-option .fa-check {
  color: var(--accent-gold);
  font-size: 32rpx;
}
</style>
