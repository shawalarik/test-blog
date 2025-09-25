---
date: 2025-9-24 15:42:09
layout: page
title: 动态Markdown
permalink: /Markdown
coverImg: /home/bg01.webp
categories:
  - 功能页
sidebar: false
article: false
comment: false
---

<script setup>
import RemoteMd from '@components/RemoteMd.vue';
const url = "http://127.0.0.1:9999/95.Teek/01.%E7%AE%80%E4%BB%8B/01.%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B.md"
</script>

<RemoteMd :url="url" />

