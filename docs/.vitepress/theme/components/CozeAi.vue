<template>
  <div></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const chatContainer = ref(null);
const sdkLoaded = ref(false);

onMounted(() => {
  // 仅在生产环境加载SDK，避免本地测试污染数据
  /*  if (import.meta.env.DEV) {
      console.log('开发环境下不加载Coze SDK');
      return;
    }*/

  // 检查SDK是否已加载
  if (!window.CozeWebSDK) {
    const script = document.createElement('script');
    script.src = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js';
    script.async = true;
    script.onload = initChatClient;
    document.body.appendChild(script);
  } else {
    initChatClient();
  }
});

onUnmounted(() => {
  // 清理可能存在的SDK实例
  if (window.CozeChatInstance) {
    window.CozeChatInstance.destroy();
    delete window.CozeChatInstance;
  }
});

const initChatClient = () => {
  //if (!chatContainer.value || sdkLoaded.value) return;

  try {
    // 初始化聊天客户端
    window.CozeChatInstance = new CozeWebSDK.WebChatClient({
      config: {
        bot_id: '7528313361608933415',
      },
      componentProps: {
        title: '威威 Blog',
      },
      auth: {
        type: 'token',
        token: 'sat_psRIJbmwNnwQKBtU3Ne5VhLIYWUp5F1lfPtSkMITEQiuqYOp34IVlwLnjYHLPyr5',
        onRefreshToken: function () {
          return async () => 'token';
        }
      },
      container: chatContainer.value  // 指定容器
    });

    sdkLoaded.value = true;
    console.log('Coze SDK 初始化成功');
  } catch (error) {
    console.error('Coze SDK 初始化失败:', error);
  }
};
</script>

<style scoped>
</style>
