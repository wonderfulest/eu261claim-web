<template>
  <div class="layout-root">
    <Header />
    <main class="layout-main">
      <div class="layout-main-inner">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
  
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Footer from './Footer.vue'

</script>

<style scoped>
.layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(1100px 500px at 50% -120px, rgba(59, 130, 246, 0.22) 0%, rgba(14, 14, 17, 0) 60%),
    radial-gradient(900px 420px at 50% 10%, rgba(229, 72, 77, 0.1) 0%, rgba(14, 14, 17, 0) 65%),
    var(--bg-page);
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.layout-main-inner {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 16px 40px;
  box-sizing: border-box;
}
.layout-main {
  flex: 1;
  width: 100%;
  min-height: 0;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  margin: 0;
  padding: 24px 0 0;
}

/* 移动端宽度修复 */
@media (max-width: 768px) {
  .layout-root {
    width: 100vw;
    max-width: 100vw;
    min-width: 100vw;
    overflow-x: hidden;
    position: relative;
  }
  
  .layout-main {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    contain: layout style;
  }
}

/* 全局重置，防止子元素溢出 */
.layout-root * {
  box-sizing: border-box;
}

/* 确保所有子元素不超出容器宽度 */
.layout-root *:not(svg):not(path) {
  min-width: 0;
}
</style> 