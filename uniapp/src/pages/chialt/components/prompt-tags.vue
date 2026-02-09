<template>
  <view class="prompt-tags-container">
    <view class="tag-list">
      <view class="tag-item" @click="toggleTagList">
        <text>指令</text>
        <uni-icons :type="showTagList ? 'top' : 'bottom'" size="14" color="#999"></uni-icons>
      </view>
    </view>
    
    <!-- 标签展开列表 -->
    <view class="tag-dropdown" v-if="showTagList">
      <view class="tag-header">
        <text class="tag-title">指令</text>
        <text class="close-icon" @click="toggleTagList">✕</text>
      </view>
      
      <view class="tag-section" v-for="category in categories" :key="category.id">
        <view class="tag-section-title">{{ category.name }}</view>
        <view class="tag-options">
          <view
            v-for="(tag, index) in category.tags"
            :key="category.id + '-' + index"
            class="tag-option"
            @click="toggleTag(tag)"
            :class="{ selected: selectedTags.includes(tag) }"
          >
            {{ tag }}
          </view>
        </view>
      </view>
      
      <view class="tag-actions">
        <button class="add-tags-btn" :class="{ active: selectedTags.length > 0 }" @click="addSelectedTags">添加指令</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getModelList } from '../utils/api.js';

export default {
  name: 'PromptTags',
  data() {
    return {
      showTagList: false,
      selectedTags: [],
      categories: []
    }
  },
  async created() {
    await this.loadTags();
  },
  methods: {
    async loadTags() {
      try {
        const modelData = await getModelList();
        if (modelData && modelData.zhiling && Array.isArray(modelData.zhiling)) {
          this.categories = modelData.zhiling.map(category => {
            const tags = this.extractTags(category);
            return {
              id: category.id,
              name: category.name || '未命名',
              tags: tags
            };
          });
        } else {
          console.error('获取标签数据失败：接口返回数据格式不正确');
          this.categories = [];
        }
      } catch (error) {
        console.error('加载标签失败:', error);
        this.categories = [];
      }
    },
    extractTags(category) {
      if (!category) return [];
      const tags = [];
      // 添加tags字段
      if (category.tags) tags.push(category.tags);
      // 添加数字索引键值
      Object.keys(category).forEach(key => {
        if (!isNaN(key)) tags.push(category[key]);
      });
      return tags;
    },
    toggleTagList() {
      this.showTagList = !this.showTagList
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index === -1) {
        this.selectedTags.push(tag)
      } else {
        this.selectedTags.splice(index, 1)
      }
    },
    addSelectedTags() {
      if (this.selectedTags.length > 0) {
        this.$emit('add-tags', this.selectedTags.join('，'))
        this.selectedTags = []
        this.showTagList = false
      }
    }
  }
}
</script>

<style scoped>
.prompt-tags-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  position: relative;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 14px;
}

.tag-dropdown {
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
  padding-top: 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 90vh;
}

.tag-section {
  margin-bottom: 16px;
  flex-shrink: 0;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 4px;
}

.tag-option {
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 14px;
  color: #333;
}

.tag-actions {
  position: sticky;
  bottom: 0;
  background-color: white;
  padding: 16px 0;
  margin-top: 16px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tag-title {
  font-size: 22px;
  font-weight: 600;
}

.close-icon {
  font-size: 24px;
  color: #333;
}

.tag-section {
  margin-bottom: 24px;
}

.tag-section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-option {
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: #333;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tag-option.selected {
  background-color: #e8efff;
  color: #7b9cff;
  border-color: #7b9cff;
}

.tag-actions {
  margin-top: auto;
  padding: 20px 0;
}

.add-tags-btn {
  width: 100%;
  background-color: #99b4ff;
  color: #f5f5f5;
 border: none;
  border-radius: 20px;
  padding: 5px 0;
  font-size: 15px;
  font-weight: normal;
}

.add-tags-btn.active {
  background-color: #0055ff;
  color: white;
}
</style>