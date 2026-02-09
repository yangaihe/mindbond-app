/**
 * 通用节点高度获取 Hooks
 * @param {string|object} target - 节点选择器（如 '.class'、'#id'）或 ref 对象
 * @param {boolean} immediate - 是否挂载后立即执行查询（默认 true）
 * @returns {Object} { height: 节点高度(px), getHeight: 手动查询方法 }
 */
import { ref, onMounted, nextTick } from 'vue';

export default function useNodeHeight(target:string, immediate = true) {
  const height = ref(0); // 存储节点高度（响应式）

  // 核心查询方法
  const getHeight = async () => {
    try {
      await nextTick(); // 确保 DOM 已更新
      
      // 创建查询对象，绑定当前页面上下文
      // @ts-ignore
      const query = uni.createSelectorQuery().in(this);
      
      // 区分：通过 ref 对象 或 选择器 定位节点
      const selector = typeof target === 'string' ? target : `#${target._rawValue?.id}`;
      
      query
        .select(selector) // 定位目标节点
        .boundingClientRect((res) => {
          if (res) {
            height.value = res.height; // 赋值高度（px）
            console.log('节点高度查询成功：', res.height, 'px');
          } else {
            height.value = 0;
            console.warn('节点未找到，请检查选择器或节点是否已渲染');
          }
        })
        .exec();
    } catch (error) {
      console.error('获取节点高度失败：', error);
      height.value = 0;
    }
  };

  // 挂载后立即查询（默认开启）
  onMounted(() => {
    if (immediate) {
      getHeight();
    }
  });

  return {
    height, // 响应式高度（直接在模板中使用）
    getHeight // 手动触发查询（如动态渲染后重新查询）
  };
}