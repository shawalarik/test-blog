<script setup>
import { $store } from "./store";
import { data } from "./data";
import popout from "./popout.vue";


//点击开通会员
function buy() {
/*  if (!$store.isLogin) {
    $store.loginVisible = true;
    return;
  }*/
  data.visible = true;
}
</script>

<template>
  <!--
    $store.user.type 是否VIP用户与
    $store.theme.vipVisible 直接显示VIP内容，用于文档编辑预览时使用
    -->
  <template v-if="$store.user.type === 'vip' || $store.theme.vipVisible">
    <slot></slot>
  </template>

  <div v-if="$store.user.type !== 'vip'">
    <div class="vip-block">
      <div class="content">
        <p>
          💞开通VIP，可阅读全部会员文档。
          <template v-if="!$store.isLogin">
            如果你已经开通，请
            <a @click="$store.loginVisible = true">登录</a>
          </template>
        </p>
        <button class="btn" @click="buy">🔒去开通</button>
      </div>
    </div>
  </div>

	<popout/>
</template>

<style scoped>
.vip-block {
  border: solid 1px #cccccccc;
  background-color: #fdf1d9;
  color: #666666;
  border-radius: 10px;
  padding: 15px;
  margin-top: 15px;
}

.content {
  text-align: center;
}

.btn {
  background-color: #9b8aff;
  color: #ffffff;
  padding: 3px 10px;
  border-radius: 10px;
}
</style>
