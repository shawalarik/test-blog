<template>
  <ClientOnly>
    <CardContainer>
      <div
        :class="
          cn(
            'h-96 w-96 group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]'
          )
        "
        style="transform-style: preserve-3d"
      >
        <CardItem :translate-z="50" class="text-xl font-bold text-neutral-600 dark:text-white">{{ title }}</CardItem>
        <CardItem as="p" translate-z="60" class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300">
          {{ desc }}
        </CardItem>
        <CardItem :translate-z="100" class="mt-4 w-full">
          <img
            :src="
              src ||
              'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            "
            height="1000"
            width="1000"
            class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div class="mt-10 flex items-center justify-end">
          <CardItem
            :translate-z="20"
            as="button"
            class="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
          >
            查看详情
          </CardItem>
        </div>
      </div>
    </CardContainer>
  </ClientOnly>
</template>

<script setup lang="ts">
import { cn } from "../../../../utils/WwUtils";

import CardContainer from "./CardContainer.vue";
import CardItem from "./CardItem.vue";

defineProps({
  title: String,
  desc: String,
  src: String
});
</script>

<style scoped></style>
