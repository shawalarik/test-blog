<template>
  <div class="password-protect-container">
    <div class="password-box">
      <h2 class="title">此页面受密码保护</h2>
      <p class="description">请输入访问密码以继续</p>

      <div class="input-group">
        <label for="password">密码</label>
        <input
          type="password"
          id="password"
          v-model="password"
          @keyup.enter="verifyPassword"
          placeholder="请输入密码"
          class="password-input"
        />
      </div>

      <button @click="verifyPassword" class="submit-btn">确认访问</button>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  // 需要验证的密码
  correctPassword: {
    type: String,
    required: true
  },
  // 页面标识（用于缓存验证状态）
  pageId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["verified"]);

const password = ref("");
const error = ref("");

// 验证密码
const verifyPassword = () => {
  if (!password.value) {
    error.value = "请输入密码";
    return;
  }

  if (password.value === props.correctPassword) {
    // 验证成功，缓存状态
    const verifiedPages = JSON.parse(localStorage.getItem("vpVerifiedPages") || "{}");
    verifiedPages[props.pageId] = true;
    localStorage.setItem("vpVerifiedPages", JSON.stringify(verifiedPages));

    error.value = "";
    emit("verified", true);
  } else {
    error.value = "密码错误，请重新输入";
    password.value = "";
  }
};
</script>

<style scoped>
.password-protect-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--vp-c-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.password-box {
  width: 100%;
  max-width: 400px;
  background-color: var(--vp-c-bg-alt);
  border-radius: var(--vp-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  border: 1px solid var(--vp-c-border);
}

.title {
  margin: 0 0 15px 0;
  color: var(--vp-c-text-1);
  font-size: 1.5rem;
  text-align: center;
}

.description {
  margin: 0 0 25px 0;
  color: var(--vp-c-text-2);
  text-align: center;
  font-size: 0.9rem;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}

.password-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-border-radius-sm);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  box-sizing: border-box;
}

.password-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px rgba(55, 118, 203, 0.2);
}

.submit-btn {
  width: 100%;
  padding: 10px 0;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: var(--vp-border-radius-sm);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: var(--vp-c-brand-dark);
}

.error-message {
  margin: 15px 0 0 0;
  color: var(--vp-c-danger);
  font-size: 0.9rem;
  text-align: center;
}
</style>
