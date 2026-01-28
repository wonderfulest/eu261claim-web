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
      © 2025 CHEERY LTD |
      <a href="/terms-and-conditions">Terms of Use</a> |
      <a href="/privacy-policy">Privacy Policy</a> |
      <a href="/contact">Contact</a>
      <!-- <a href="/faq">FAQ</a> -->
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
            <div class="action-icon">✉️</div>
            <span>Support</span>
          </a>
          
          <button @click="scrollToTop" class="footer-action">
            <div class="action-icon">⬆️</div>
            <span>Top</span>
          </button>
        </div>
        
        <div class="footer-copyright">
          © 2025 CHEERY LTD
        </div>
      </div>
    </div>
    <transition name="footer-expand">
      <div v-if="isExpanded" class="footer-detail">
        <div class="footer-detail-title">© 2025 CHEERY LTD. All Rights Reserved</div>
        <div class="footer-detail-block">
          <strong>Address:</strong><br>
          Harju maakond, Tallinn, Kesklinna linnaosa, Ahtri tn 12, 15551, Estonia
        </div>
        <div class="footer-detail-block">
          <strong>Email:</strong>
          <a href="mailto:support@eu261claim.com">support@eu261claim.com</a>
        </div>
        <div class="footer-detail-block">
          <strong>Privacy Policy:</strong>
          <a href="/privacy-policy" target="_blank">View Details</a>
        </div>
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

// 
function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

// 
function handleScroll() {
  if (!ticking && isMobile.value) {
    requestAnimationFrame(updateFooterVisibility)
    ticking = true
  }
}

// 
function updateFooterVisibility() {
  const currentScrollY = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // 
  const distanceFromBottom = documentHeight - (currentScrollY + windowHeight)
  
  // 
  if (distanceFromBottom <= 100) {
    isVisible.value = true
  } else {
    isVisible.value = false
    // 
    if (isExpanded.value) {
      isExpanded.value = false
    }
  }
  
  ticking = false
}

// 
function handleResize() {
  checkMobile()
  if (!isMobile.value) {
    isVisible.value = true // 
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
    // 
    isVisible.value = false
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    // 
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
  color: var(--text-secondary, #9aa0a6);
  font-size: 0.9rem;
  background: rgba(20, 20, 26, 0.72);
  border-top: 1px solid var(--border-default, #262630);
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
    background: linear-gradient(135deg, rgba(20, 20, 26, 0.94), rgba(14, 14, 17, 0.94));
    border-top: 1px solid var(--border-default, #262630);
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
    background: linear-gradient(135deg, rgba(28, 28, 36, 0.96), rgba(20, 20, 26, 0.96));
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
    border-bottom: 1px solid var(--border-default, #262630);
  }
  
  .footer-action:hover,
  .footer-action:active {
    background: rgba(59, 130, 246, 0.14);
    border-color: rgba(96, 165, 250, 0.35);
    transform: translateY(-1px);
  }
  
  .action-icon {
    font-size: 1.5rem;
    margin-bottom: 4px;
    filter: grayscale(0.2);
  }
  
  .footer-action span {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary, #9aa0a6);
  }
  
  .footer-action:hover span {
    color: var(--color-cta-hover, #60a5fa);
  }
  
  .footer-copyright {
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-secondary, #9aa0a6);
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
  color: var(--text-secondary, #9aa0a6);
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.footer a {
  color: var(--color-cta, #3b82f6);
  text-decoration: none;
  margin: 0 4px;
  transition: color 0.2s;
}

.footer a:hover {
  color: var(--color-cta-hover, #60a5fa);
}

.footer-detail {
  margin-top: 0;
  color: var(--text-secondary, #9aa0a6);
  font-size: 0.9rem;
  line-height: 1.7;
  animation: fadeIn 0.3s;
  padding: 16px 0 4px;
  background: rgba(20, 20, 26, 0.82);
  width: 100%;
}

.footer-detail-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-primary, #e6e6e6);
}
.footer-detail-links {
  margin-top: 18px;
  color: var(--color-cta, #3b82f6);
  font-size: 0.9rem;
}
.footer-detail-links a {
  color: var(--color-cta, #3b82f6);
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