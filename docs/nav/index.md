---
title: 网站导航
date: 2025-03-26 02:21:52
layout: doc
layoutClass: m-nav-layout
sidebar: false
themeSize: wide
themeStyle: vp-default
prev: false
next: false
categories:
  - 导航
  - nav
permalink: /pages/5dc884
article: false
outline:
  - 2
  - 3
  - 4
coverImg: /home/bg14.webp
editLink: false
---

<style src="/.vitepress/theme/style/nav.scss"></style>

<script setup>
import { NAV_DATA } from '/.vitepress/theme/utils/navSite/data'
</script>

::: info 教程
如果你也想搭建此导航 [点我查看教程](/pages/e01e54)
:::

<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>
<confetti />
