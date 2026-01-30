<template>
  <header class="header-bar">
    <div class="header-inner">
      <router-link to="/" class="brand">
        <img class="brand-logo" src="/logo-horizontal.svg" alt="EU261 Claim" />
      </router-link>

      <button class="mobile-menu-btn" type="button" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="nav desktop-nav">
        <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">Home</router-link>
        <!-- <router-link to="/how-it-works" class="nav-link" :class="{ active: isActive('/how-it-works') }">How It Works</router-link> -->
        <!-- <router-link to="/faq" class="nav-link" :class="{ active: isActive('/faq') }">FAQ</router-link> -->
        <!-- <button class="nav-cta" type="button" @click="goToNewClaim">Start a claim</button> -->
        <button class="theme-toggle" type="button" @click="toggleTheme">
          {{ themeLabel }}
        </button>
      </nav>
    </div>

    <div class="mobile-nav" :class="{ open: isMobileOpen }">
      <nav class="mobile-nav-inner">
        <router-link to="/" class="mobile-link" @click="closeMobile">Home</router-link>
        <router-link to="/how-it-works" class="mobile-link" @click="closeMobile">How It Works</router-link>
        <router-link to="/faq" class="mobile-link" @click="closeMobile">FAQ</router-link>
        <button class="mobile-theme-toggle" type="button" @click="toggleTheme">
          {{ themeLabel }}
        </button>
        <button class="mobile-cta" type="button" @click="handleMobileStart">Start a claim</button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isMobileOpen = ref(false)

const theme = ref<'dark' | 'light'>((document.documentElement.dataset.theme as 'dark' | 'light') || 'dark')

const themeLabel = computed(() => (theme.value === 'dark' ? 'Light' : 'Dark'))

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.value
  localStorage.setItem('theme', theme.value)
}

const goToNewClaim = () => {
  router.push({ name: 'ClaimNew' })
}

const isActive = (path: string) => {
  return route.path === path
}

const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value
}

const closeMobile = () => {
  isMobileOpen.value = false
}

const handleMobileStart = () => {
  closeMobile()
  goToNewClaim()
}
</script>

<style scoped>
.header-bar {
  width: 100%;
  background: var(--bg-surface);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border-default);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  position: sticky;
  top: 0;
  z-index: 30;
}

.header-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.brand-logo {
  height: 42px;
  width: auto;
  display: block;
}

.brand-mark {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--color-cta, #3b82f6);
  color: #ffffff;
  font-weight: 700;
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  font-weight: 700;
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

.nav {
  display: flex;
  align-items: center;
  gap: 18px;
}

.theme-toggle {
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-page) 70%, transparent);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.theme-toggle:hover {
  background: color-mix(in srgb, var(--color-cta) 18%, var(--bg-page));
  border-color: var(--color-cta-hover);
  color: var(--color-cta-hover);
}

.nav-link {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-decoration: none;
  padding: 4px 0;
}

.nav-link:hover {
  color: var(--color-cta-hover);
}

.nav-link.active {
  color: var(--color-cta);
  font-weight: 600;
  border-bottom: 2px solid var(--color-cta);
}

.nav-cta {
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: #10b981;
  color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(48, 209, 88, 0.3);
  transition: all 0.2s ease;
}

.subscription-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(48, 209, 88, 0.4);
}

.badge-text {
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 600;
  line-height: 1;
  margin-bottom: 2px;
}

.badge-days {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--font-size-xs);
  font-weight: 500;
  line-height: 1;
}
.user-avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-default);
  transition: all 0.2s ease;
}
.user-avatar-container:hover .user-avatar {
  border-color: var(--color-cta-hover);
  transform: scale(1.05);
}
.premium-badge {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ffd700, #ffb700);
  color: #000;
  font-size: var(--font-size-xs);
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.auth-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-left: 16px;
}

.auth-btn {
  position: relative;
  padding: 0 22px;
  height: 36px;
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  border: 1px solid transparent;
  background: none;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  -webkit-font-smoothing: antialiased;
}

.auth-btn span {
  position: relative;
  z-index: 1;
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.auth-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  border-radius: 20px;
}

.auth-btn:hover::before {
  opacity: 0.1;
}

.auth-btn:active {
  transform: scale(0.97);
}

.auth-btn:active span {
  transform: scale(0.98);
}

/* Login button */
.login-btn {
  color: var(--color-cta);
  border-color: var(--border-default);
  background: color-mix(in srgb, var(--bg-surface) 20%, #ffffff);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.login-btn:hover {
  background: color-mix(in srgb, var(--bg-surface) 35%, #ffffff);
  border-color: var(--border-default);
}

/* Signup button */
.signup-btn {
  background: var(--color-cta);
  color: var(--bg-page);
  border-color: var(--color-cta);
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.signup-btn:hover {
  background: var(--color-cta-hover);
  border-color: var(--color-cta-hover);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

.signup-btn:active {
  background: var(--color-cta);
  border-color: var(--color-cta);
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 31;
}

.mobile-menu-btn span {
  width: 20px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 1px;
  transition: all 0.3s ease;
  margin: 2px 0;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile navigation */
.mobile-nav {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(14, 14, 17, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 30;
  overflow-y: auto;
}

.mobile-nav.open {
  transform: translateX(0);
}

.mobile-theme-toggle {
  width: 100%;
  margin-top: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border-default, #262630);
  background: rgba(20, 20, 26, 0.6);
  color: var(--text-primary, #e6e6e6);
  font-size: var(--font-size-sm);
  font-weight: 700;
}

.mobile-theme-toggle:hover {
  background: rgba(59, 130, 246, 0.14);
  border-color: rgba(96, 165, 250, 0.45);
  color: var(--color-cta-hover, #60a5fa);
}

.mobile-nav-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-nav-links {
  flex: 1;
}

.mobile-nav-link {
  display: block;
  padding: 16px 0;
  color: #333;
  font-size: var(--font-size-xl);
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.2s;
}

.mobile-nav-link:hover {
  color: #347cff;
}

.mobile-nav-link.router-link-active {
  color: #347cff;
  font-weight: 600;
}

/* Mobile dropdown */
.mobile-dropdown {
  border-bottom: 1px solid #f0f0f0;
}

.mobile-dropdown-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  background: none;
  border: none;
  color: #333;
  font-size: var(--font-size-xl);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}

.mobile-dropdown-trigger.centered {
  justify-content: center;
  position: relative;
}

.mobile-dropdown-trigger.centered .dropdown-text {
  flex: 1;
  text-align: center;
}

.mobile-dropdown-trigger.centered .el-icon {
  position: absolute;
  right: 0;
}

.mobile-dropdown-trigger .el-icon {
  transition: transform 0.3s ease;
}

.mobile-dropdown-trigger .el-icon.rotated {
  transform: rotate(180deg);
}

.mobile-dropdown-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 0 -12px 12px;
}

.mobile-dropdown-content.open {
  max-height: 300px;
}

.mobile-dropdown-link {
  display: block;
  padding: 12px 24px;
  color: #666;
  font-size: var(--font-size-md);
  text-decoration: none;
  transition: all 0.2s;
}

.mobile-dropdown-link:hover {
  color: #347cff;
  background: rgba(52, 124, 255, 0.1);
}

/* Mobile user area */
.mobile-user-area {
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
  margin-top: 24px;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.mobile-avatar-container {
  position: relative;
  display: flex;
  align-items: center;
}

.mobile-user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.mobile-premium-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ffd700, #ffb700);
  color: #000;
  font-size: var(--font-size-xs);
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-user-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border: none;
  border-radius: 12px;
  color: #333;
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.mobile-action-btn:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.mobile-action-btn.logout {
  color: #dc3545;
}

.mobile-action-btn.logout:hover {
  background: rgba(220, 53, 69, 0.1);
}

/* Mobile auth buttons at top */
.mobile-auth-buttons-top {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  padding: 0 8px;
}

/* Mobile auth buttons */
.mobile-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-auth-btn {
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  flex: 1;
}

.mobile-auth-btn.login {
  background: rgba(255, 255, 255, 0.9);
  color: #0066CC;
  border: 1px solid #D0D0D0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.mobile-auth-btn.login:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #A0A0A0;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2);
}

.mobile-auth-btn.signup {
  background: #0071E3;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);
}

.mobile-auth-btn.signup:hover {
  background: #0077ED;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
}

.mobile-auth-btn:active {
  transform: translateY(0);
}

/* Mobile overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 25;
}

.mobile-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Responsive styles */
@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
  }
  
  .logo-area .logo-text {
    font-size: 1.5rem;
    letter-spacing: 3px;
  }
  
  .desktop-nav,
  .desktop-user,
  .current-device-display {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
}

@media (max-width: 480px) {
  .header-inner {
    padding: 0 12px;
  }
  
  .logo-area .logo-text {
    font-size: 1.3rem;
    letter-spacing: 2px;
  }
  
  .mobile-nav-content {
    padding: 0px 16px;
  }
  
  .mobile-nav-link {
    font-size: 16px;
  }
  
  .mobile-dropdown-trigger {
    font-size: 16px;
  }
  
  .mobile-auth-buttons-top {
    flex-direction: column;
    gap: 8px;
  }
  
  .mobile-auth-btn {
    padding: 14px;
    font-size: 15px;
  }
}

@media (min-width: 769px) {
  .mobile-menu-btn,
  .mobile-nav,
  .mobile-overlay {
    display: none !important;
  }
}
</style>
