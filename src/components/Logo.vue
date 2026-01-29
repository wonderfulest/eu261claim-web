<template>
  <img :src="logo" alt="EU261 Claim" class="logo" />
</template>

<script setup lang="ts">
import logo from '@/assets/favicon/favicon.png'
// 通用 Logo 组件，无需特殊逻辑
</script>

<style scoped>
.logo {
  height: 120px;
  width: auto;
  display: block;
}
</style>