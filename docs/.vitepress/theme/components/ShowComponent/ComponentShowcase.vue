<template>
  <div class="component-showcase">
    <!-- 组件选择器 -->
    <div class="component-selector">
      <button
        v-for="(item, index) in components"
        :key="item.id"
        :class="['component-btn', activeIndex === index ? 'active' : '']"
        @click="activeIndex = index"
      >
        {{ item.name }}
      </button>
    </div>

    <!-- 组件展示区 -->
    <div class="component-display">
      <!-- 组件预览 -->
      <div class="component-preview">
        <component :is="currentComponent.component" v-bind="currentComponent.props || {}" />
      </div>

      <!-- 组件信息 -->
      <!--      <div class="component-info">
        <h3 class="info-title">{{ currentComponent.name }}</h3>
        <div class="info-description">
          {{ currentComponent.description }}
        </div>
        <div v-if="currentComponent.usage" class="info-usage">
          <h4>使用说明：</h4>
          <p>{{ currentComponent.usage }}</p>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// 定义组件展示数据类型
interface ComponentItem {
  id: string;
  name: string;
  description: string;
  component: any; // 组件本身
  props?: Record<string, any>; // 组件所需的props
  usage?: string; // 可选的使用说明
}

// 接收父组件传入的组件列表
const props = defineProps<{
  components: ComponentItem[];
}>();

// 当前激活的组件索引
const activeIndex = ref(0);

// 当前选中的组件
const currentComponent = computed(() => {
  return props.components[activeIndex.value] || props.components[0];
});
</script>

<style scoped>
.component-showcase {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  box-sizing: border-box;
}

/* 组件选择器样式 */
.component-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.component-btn {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.component-btn:hover {
  background-color: #e5e7eb;
}

.component-btn.active {
  background-color: #3b82f6;
  color: white;
}

/* 组件展示区样式 */
.component-display {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .component-display {
    flex-direction: row;
  }
}

/* 组件预览区 */
.component-preview {
  flex: 1;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 组件信息区 */
.component-info {
  flex: 0 0 300px;
  padding: 1rem;
}

.info-title {
  margin: 0 0 1rem 0;
  color: #111827;
  font-size: 1.25rem;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 0.5rem;
}

.info-description {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.info-usage {
  background-color: #eff6ff;
  padding: 1rem;
  border-radius: 6px;
}

.info-usage h4 {
  margin: 0 0 0.5rem 0;
  color: #1e40af;
  font-size: 0.95rem;
}

.info-usage p {
  margin: 0;
  color: #3b82f6;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .component-selector {
    border-bottom-color: #374151;
  }

  .component-btn {
    background-color: #1f2937;
    color: #e5e7eb;
  }

  .component-btn:hover {
    background-color: #374151;
  }

  .component-preview {
    background-color: #111827;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .info-title {
    color: #f3f4f6;
  }

  .info-description {
    color: #d1d5db;
  }

  .info-usage {
    background-color: #1e3a8a;
  }

  .info-usage h4 {
    color: #bfdbfe;
  }

  .info-usage p {
    color: #93c5fd;
  }
}
</style>
