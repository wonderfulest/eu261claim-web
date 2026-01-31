<template>
  <footer
    class="footer"
    :class="{ expanded: isExpanded, visible: isVisible }"
    tabindex="0"
    @click="toggle"
    @blur="collapse"
  >
    <!-- 桌面端布局 -->
    <div v-if="!isExpanded && !isMobile" class="footer-main desktop-layout">
      <div class="footer-brand">
        <img class="footer-logo" src="/logo-horizontal.svg" alt="EU261Claim" />
        <!-- <span class="footer-brand-text">EU261Claim 2026</span> -->
      </div>
      <div class="footer-links">
        <a href="/terms-and-conditions">Terms of Use</a> |
        <a href="/privacy-policy">Privacy Policy</a> |
        <a href="/contact">Contact</a>
        <!-- <a href="/faq">FAQ</a> -->
      </div>
    </div>
    
    <!-- 移动端布局 -->
    <div v-if="!isExpanded && isMobile" class="footer-main mobile-layout">
      <div class="mobile-footer-header">
        <div class="drag-indicator"></div>
        <span class="footer-title">Quick Links</span>
      </div>
      
      <div class="mobile-footer-content">
        <div class="footer-actions">
          <a href="/faq" class="footer-action">
            <div class="action-icon">❓</div>
            <span>Help</span>
          </a>
          
          <a href="/terms-and-conditions" class="footer-action">
            <div class="action-icon">📋</div>
            <span>Terms</span>
          </a>
          
          <a href="mailto:support@eu261claim.com" class="footer-action">
            <!-- <div class="action-icon">✉️</div> -->
            <span>Support</span>
          </a>
          
          <button @click="scrollToTop" class="footer-action">
            <div class="action-icon">⬆️</div>
            <span>Top</span>
          </button>
        </div>
        
        <!-- <div class="footer-copyright">
          © 2026 EU261Claim
        </div> -->
      </div>
    </div>
    <transition name="footer-expand">
      <div v-if="isExpanded" class="footer-detail">
        <div class="footer-detail-title">© 2026 EU261Claim. All Rights Reserved</div>
        <div class="footer-detail-block">
          <strong>Address:</strong><br>
          71-75, Shelton Street, Covent Garden, London, WC2H 9JQ, UNITED KINGDOM
        </div>
        <div class="footer-detail-block">
          <strong>Email:</strong>
          <a href="mailto:support@eu261claim.com">support@eu261claim.com</a>
        </div>
        <!-- <div class="footer-detail-block">
          <strong>Privacy Policy:</strong>
          <a href="/privacy-policy" target="_blank">View Details</a>
        </div> -->
        <!-- <div class="footer-detail-block">
          <strong>Contact us on SLACK:</strong>
          <a href="https://join.slack.com/t/eu261claim/shared_invite/zt-37oujfc82-w6vpl_hzGNYYmsmN5vNOzg" target="_blank">Join Slack Channel</a>
        </div> -->
        <div class="footer-detail-links">
          <a href="/terms-and-conditions">Terms of Use</a> |
          <a href="/privacy-policy">Privacy Policy</a> |
          <a href="/contact">Contact</a>
          <!-- <a href="/faq">FAQ</a> -->
        </div>
      </div>
    </transition>
    <slot />
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isExpanded = ref(false)
const isVisible = ref(true)
const isMobile = ref(false)
let ticking = false

// 滚动到顶部功能
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  // 滚动后隐藏footer
  setTimeout(() => {
    isVisible.value = false
  }, 500)
}

// 检测是否为移动端
function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

// 处理滚动事件（移动端悬浮 footer 显隐）
function handleScroll() {
  if (!ticking && isMobile.value) {
    requestAnimationFrame(updateFooterVisibility)
    ticking = true
  }
}

// 根据页面高度和滚动位置更新 footer 可见性
function updateFooterVisibility() {
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  // 如果页面整体高度不超过一屏，Footer 永远可见
  if (documentHeight <= windowHeight + 4) {
    isVisible.value = true
    ticking = false
    return
  }

  const currentScrollY = window.scrollY

  // 在页面顶部时，始终显示 Footer
  if (currentScrollY === 0) {
    isVisible.value = true
    ticking = false
    return
  }

  const distanceFromBottom = documentHeight - (currentScrollY + windowHeight)

  if (distanceFromBottom <= 100) {
    isVisible.value = true
  } else {
    isVisible.value = false
    if (isExpanded.value) {
      isExpanded.value = false
    }
  }

  ticking = false
}

// 处理窗口尺寸变化
function handleResize() {
  checkMobile()
  if (!isMobile.value) {
    isVisible.value = true
  }
}

function toggle() {
  isExpanded.value = !isExpanded.value
}

function collapse() {
  isExpanded.value = false
}

onMounted(() => {
  checkMobile()
  if (isMobile.value) {
    // 移动端初始状态由可见性计算逻辑决定
    isVisible.value = false
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    updateFooterVisibility()
  }
})

onUnmounted(() => {
  if (isMobile.value) {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.footer {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  background: var(--bg-surface);
  border-top: 1px solid var(--border-default);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 18px 0;
  text-align: center;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  position: relative;
  min-height: 24px; /* 最小高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-right: 10px;
}

.footer-logo {
  height: 30px;
  width: auto;
  display: block;
  opacity: 0.9;
}

.footer-brand-text {
  font-size: var(--font-size-md);
  font-weight: 700;
  line-height: 1;
  color: var(--text-primary);
}

.footer-links {
  display: inline-block;
}

.footer-main.desktop-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

/* */
@media (max-width: 768px) {
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    backdrop-filter: blur(20px);
    background: color-mix(in srgb, var(--bg-page) 94%, transparent);
    border-top: 1px solid var(--border-default);
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.35);
    padding: 0;
    min-height: auto;
  }
  
  .footer.visible {
    transform: translateY(0);
  }
  
  .footer.expanded {
    transform: translateY(0);
    background: color-mix(in srgb, var(--bg-surface) 96%, transparent);
    backdrop-filter: blur(25px);
  }
  
  /* */
  .mobile-layout {
    width: 100%;
    padding: 0;
  }
  
  .mobile-footer-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0 8px 0;
    border-bottom: 1px solid var(--border-default);
  }
  
  .footer-action:hover,
  .footer-action:active {
    background: color-mix(in srgb, var(--color-cta) 14%, var(--bg-surface));
    border-color: var(--color-cta-hover);
    transform: translateY(-1px);
  }
  
  .action-icon {
    font-size: 1.5rem;
    margin-bottom: 4px;
    filter: grayscale(0.2);
  }
  
  .footer-action span {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }

  .footer-action:hover span {
    color: var(--color-cta-hover);
  }
  
  .footer-copyright {
    text-align: center;
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    padding-top: 12px;
    border-top: 1px solid var(--border-default, #262630);
  }
  
  /* */
  .desktop-layout {
    display: block;
  }
  
  .mobile-layout {
    display: none;
  }
}

/* */
@media (min-width: 769px) {
  .desktop-layout {
    display: block;
  }
  
  .mobile-layout {
    display: none;
  }
}

.footer-main {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  letter-spacing: 0.5px;
}

.footer a {
  color: var(--color-cta);
  text-decoration: none;
  margin: 0 4px;
  transition: color 0.2s;
}

.footer a:hover {
  color: var(--color-cta-hover);
}

.footer-detail {
  margin-top: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.7;
  animation: fadeIn 0.3s;
  padding: 16px 0 4px;
  background: var(--bg-surface);
  width: 100%;
}

.footer-detail-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-primary);
}
.footer-detail-links {
  margin-top: 18px;
  color: var(--color-cta);
  font-size: var(--font-size-sm);
}
.footer-detail-links a {
  color: var(--color-cta);
  margin: 0 4px;
}
.footer-expand-enter-active,
.footer-expand-leave-active {
  transition: max-height 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s;
}
.footer-expand-enter-from,
.footer-expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.footer-expand-enter-to,
.footer-expand-leave-from {
  max-height: 300px;
  opacity: 1;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 