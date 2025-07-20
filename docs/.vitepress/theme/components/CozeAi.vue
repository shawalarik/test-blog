<template>
  <div></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

let cozeWebSDK  = undefined;
const sdkLoaded = ref(false);

onMounted(() => {
  // 仅在生产环境加载SDK，避免本地测试污染数据
  /*  if (import.meta.env.DEV) {
      console.log('开发环境下不加载Coze SDK');
      return;
    }*/

  // 检查SDK是否已加载
  if (!cozeWebSDK) {
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
  if (cozeWebSDK) {
    cozeWebSDK.destroy();
  }
});

const initChatClient = () => {

  try {
    // 初始化聊天客户端
    cozeWebSDK = new CozeWebSDK.WebChatClient({
      config: {
        bot_id: '7528313361608933415',
        isIframe: true,
      },
      componentProps: {
        title: '威威 Blog',
      },
      auth: {
        type: 'token',
        token: 'sat_psRIJbmwNnwQKBtU3Ne5VhLIYWUp5F1lfPtSkMITEQiuqYOp34IVlwLnjYHLPyr5',
        session_name: '11123',

        onRefreshToken: function () {
          return async () => 'token';
        }
      },
      userInfo: {
        id: 'user',
        url: 'https://lf-coze-web-cdn.coze.cn/obj/eden-cn/lm-lgvj/ljhwZthlaukjlkulzlp/coze/coze-logo.png',
        nickname: 'User',
      },
      ui: {
        asstBtn: {
          isNeed: true // 是否在页面右下角展示悬浮球。
        },
        base: {
          //icon: 'https://lf-coze-web-cdn.coze.cn/obj/eden-cn/lm-lgvj/ljhwZthlaukjlkulzlp/coze/chatsdk-logo.png',
          //layout: '', // 未设置此参数时，系统会自动识别设备，设置相应的布局风格
          lang: 'zh-CN',
          zIndex: 1000
        },
/*        footer: {
          isShow: true,
          expressionText: 'Powered by {{name}}&{{name1}}',
          linkvars: {
            name: {
              text: 'A',
              link: 'https://www.test1.com'
            },
            name1: {
              text: 'B',
              link: 'https://www.test2.com'
            }
          }
        }*/
        feedback: {
          isNeedFeedback: true,
          feedbackPanel: {
            title:
                '您对这个回答有什么看法？请告诉我们',
            placeholder: '请详细描述您的问题...',
            tags: [
              {
                label: '信息不正确',
              },
              {
                label: '涉及敏感信息',
                isNeedDetail: true,
              },
            ],
          },
        }

      },
    });
    console.log('Coze SDK 初始化成功');
  } catch (error) {
    console.error('Coze SDK 初始化失败:', error);
  }
};
</script>

<style scoped>
</style>
