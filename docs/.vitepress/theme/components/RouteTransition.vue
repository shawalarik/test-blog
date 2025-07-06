<template>
  <transition name="route" mode="out-in">
    <component :is="Component" />
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vitepress'

const route = useRoute()
const router = useRouter()
const Component = ref(null)

// 监听路由变化，更新组件
const updateComponent = () => {
  Component.value = route.Component
}

onMounted(() => {
  updateComponent()
  router.onBeforeRouteChange(updateComponent)
})
</script>
