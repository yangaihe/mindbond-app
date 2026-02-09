<template>
  <view class="image-templates-container">
    <view class="template-list">
      <view class="template-item" @click="toggleTemplateList">
        <text>模板</text>
        <uni-icons :type="showTemplateList ? 'top' : 'bottom'" size="14" color="#999"></uni-icons>
      </view>
    </view>
    
    <!-- 模板展开列表 -->
    <view class="template-dropdown" v-if="showTemplateList">
      <view class="template-header">
        <text class="template-title">模板列表</text>
        <text class="close-icon" @click="toggleTemplateList">✕</text>
      </view>
      
      <view class="template-content">
        <view class="waterfall-wrapper">
          <view
            v-for="(template, index) in templates"
            :key="index"
            class="template-card"
            @click="selectTemplate(template)"
          >
            <image
              webp="true"
              class="template-image"
              :src="template.image"
              mode="aspectFill"
              @error="handleImageError(index)"
              fade-show="true"
            />
            <view class="template-make-btn" @click.stop="selectTemplate(template)">模板描述</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getModelList } from '../utils/api.js'

export default {
  name: 'ImageTemplates',
  data() {
    return {
      showTemplateList: false,
      templates: [],
     // fallbackImage: '/static/uni.png' // 设置默认的降级图片
    }
  },
  async created() {
    try {
      const modelData = await getModelList()
      if (modelData && modelData.mobana) {
        this.templates = modelData.mobana
      }
    } catch (error) {
      console.error('获取模板列表失败:', error)
      uni.showToast({
        title: '获取模板列表失败',
        icon: 'none'
      })
    }
  },
  methods: {
    toggleTemplateList() {
      this.showTemplateList = !this.showTemplateList
    },
    selectTemplate(template) {
      this.$emit('select-template', template.prompt)
      this.showTemplateList = false
    },
    handleImageError(index) {
      // 当图片加载失败时，将图片地址替换为降级图片
      if (this.templates[index]) {
        this.templates[index].image = this.fallbackImage
      }
    }
  }
}
</script>

<style scoped>
.image-templates-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  position: relative;
}

.template-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-item {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 14px;
}

.template-dropdown {
  position: fixed;
  top: calc(var(--window-top) + 100px);
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 90vh;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.template-title {
  font-size: 22px;
  font-weight: 600;
}

.close-icon {
  font-size: 24px;
  color: #333;
}

.template-content {
  flex: 1;
  overflow-y: auto;
}

.waterfall-wrapper {
  column-count: 2;
  column-gap: 10px;
  padding: 10px;
}

.template-card {
  break-inside: avoid;
  margin-bottom: 10px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.template-card:hover {
  transform: translateY(-2px);
}

.template-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.template-make-btn {
  padding: 8px;
  font-size: 14px;
  color: #fff;
  background-color: #007AFF;
  text-align: center;
  margin: 10px;
  border-radius: 6px;
}
</style>
