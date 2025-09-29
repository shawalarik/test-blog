<template>
  <div class="password-protect-container">
    <div class="password-card">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="handleBack" aria-label="返回上一页">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path
            d="M12 19L5 12L12 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- 标题区域 -->
      <div class="card-header">
        <div class="lock-icon">🔒</div>
        <h2>需要密码访问</h2>
        <p class="subtitle">该内容受保护，请输入正确密码</p>
      </div>

      <!-- 输入区域 -->
      <div class="input-group">
        <input
          v-model="input"
          type="password"
          @keyup.enter="submit"
          @input="handleInput"
          placeholder="请输入密码"
          :class="{ invalid: error }"
          aria-label="密码输入框"
        />
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>

      <!-- 按钮区域 -->
      <div class="button-group">
        <button class="submit-btn" @click="submit" :disabled="!input.trim()">确认访问</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vitepress";

const router = useRouter();
const props = defineProps<{
  correctPassword: string;
  pageId: string;
}>();

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: "verified", success: boolean): void;
}>();

const input = ref("");
const error = ref("");

// 处理输入 - 过滤空格
const handleInput = () => {
  input.value = input.value.replace(/\s+/g, ""); // 移除所有空格
  if (error.value && input.value) {
    error.value = ""; // 输入内容时清除错误提示
  }
};

// 提交验证
const submit = () => {
  const trimmedInput = input.value.trim();

  if (!trimmedInput) {
    error.value = "请输入密码";
    return;
  }

  if (trimmedInput === props.correctPassword) {
    emit("verified", true);
  } else {
    error.value = "密码错误，请重新输入";
    input.value = "";
  }
};

// 返回上一页
const handleBack = () => {
  // 方案1：优先使用浏览器原生历史记录（最稳定，推荐）
  if (window.history.length > 1) {
    window.history.back(); // 退回上一页，不刷新
  } else {
    // 方案2：若没有历史记录，跳转到首页（避免卡在当前页）
    router.go("/");
  }

  // 备用方案：若需严格使用VitePress路由，可替换为以下代码
  // try {
  //   // 部分版本支持 router.go(-1)（历史记录后退1步）
  //   router.go(-1);
  // } catch (e) {
  //   router.go("/"); // 失败时兜底跳首页
  // }
};
</script>

<style scoped>
.password-protect-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
  background-color: var(--vp-c-bg);
  --error-color: orangered;
}

/* 卡片容器 */
.password-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2.5rem 2rem;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.3s ease;
}

/*.password-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}*/

/* 返回按钮 */
.back-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg);
}

/* 标题区域 */
.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.lock-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.card-header h2 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
  font-size: 1.5rem;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 输入区域 */
.input-group {
  margin-bottom: 1.5rem;
}

.input-group input {
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.input-group input::placeholder {
  color: var(--vp-c-text-3);
}

.input-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px rgba(55, 118, 203, 0.1);
}

.input-group input.invalid {
  border-color: var(--error-color);
}

.error-message {
  margin: 0.5rem 0 0 0;
  color: var(--error-color);
  font-size: 0.85rem;
  text-align: left;
  padding-left: 0.25rem;
  animation: shake 0.5s ease;
}

/* 按钮区域 */
.button-group {
  margin-top: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.submit-btn:hover:not(:disabled) {
  background: dodgerblue;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: dodgerblue;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 错误动画 */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .password-card {
    padding: 2rem 1.5rem;
  }

  .card-header h2 {
    font-size: 1.3rem;
  }

  .lock-icon {
    font-size: 2.5rem;
  }
}
</style>
