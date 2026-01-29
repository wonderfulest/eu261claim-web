<template>
  <div class="contact-form-container">
    <div class="contact-header">
      <h2>Still need help?</h2>
      <p>Please contact us via the following methods:</p>
    </div>
    <div class="contact-methods">
      <div class="contact-method">
        <div class="method-icon">📧</div>
        <div class="method-content">
          <span class="method-label">Email</span>
          <a href="mailto:support@eu261claim.com" class="method-link">support@eu261claim.com</a>
        </div>
      </div>
      <div class="contact-method">
        <div class="method-icon">💬</div>
        <div class="method-content">
          <span class="method-label">Message</span>
          <span class="method-desc">Leave a message below, we will reply as soon as possible.</span>
        </div>
      </div>
    </div>
    <div class="contact-form">
      <div v-if="!userEmail" class="email-input-group">
        <label class="email-label">Your Email</label>
        <input 
          type="email" 
          v-model="email"
          placeholder="Enter your email address"
          class="email-input"
          :class="{ 'email-input-error': email && !isValidEmail(email) }"
        />
        <div v-if="email && !isValidEmail(email)" class="email-error">
          Please enter a valid email address
        </div>
      </div>
      <textarea 
        placeholder="Please enter your question or feedback..." 
        v-model="message"
        class="contact-textarea"
        rows="6"
      ></textarea>
      <button class="contact-send-btn" @click="sendMessage" :disabled="loading">
        <span class="send-icon">{{ loading ? '⏳' : '📤' }}</span>
        <span>{{ loading ? 'Sending...' : 'Send Message' }}</span>
      </button>
    </div>
    <div v-if="showMessage" class="message-alert" :class="messageType">
      <span class="message-icon">{{ messageType === 'success' ? '✅' : '⚠️' }}</span>
      <span class="message-text">{{ alertMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { sendContactMessage } from '@/api/contact'

const message = ref('')
const email = ref('')
const showMessage = ref(false)
const alertMessage = ref('')
const messageType = ref<'success' | 'error'>('success')
const loading = ref(false)

const userStore = useUserStore()

const userEmail = computed(() => userStore.userInfo?.email || '')

const emit = defineEmits<{
  send: [message: string, email?: string]
}>()

// 邮箱格式校验
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showAlert(text: string, type: 'success' | 'error' = 'success') {
  alertMessage.value = text
  messageType.value = type
  showMessage.value = true
  
  // 3秒后自动隐藏
  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

async function sendMessage() {
  if (!message.value.trim()) {
    showAlert('Please enter your question or feedback', 'error')
    return
  }
  
  if (!userEmail.value && !email.value.trim()) {
    showAlert('Please enter your email address', 'error')
    return
  }
  
  const finalEmail = userEmail.value || email.value.trim()
  
  // 校验邮箱格式
  if (!userEmail.value && !isValidEmail(finalEmail)) {
    showAlert('Please enter a valid email address', 'error')
    return
  }
  
  try {
    loading.value = true
    await sendContactMessage({
      email: finalEmail,
      content: message.value
    })
    
    showAlert('Message sent successfully! We will reply as soon as possible.')
    message.value = ''
    email.value = ''
    emit('send', message.value, finalEmail)
  } catch (error) {
    showAlert('Failed to send message. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-form-container {
  background: color-mix(in srgb, var(--bg-surface) 88%, transparent);
  backdrop-filter: blur(24px);
  border-radius: 20px;
  border: 1px solid var(--border-default);
  padding: 28px 24px 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
}

.contact-header {
  text-align: center;
  margin-bottom: 32px;
}

.contact-header h2 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.contact-header p {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
  line-height: 1.4;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  background: color-mix(in srgb, var(--bg-page) 70%, transparent);
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--border-default) 80%, transparent);
  transition: all 0.2s ease;
}

.contact-method:hover {
  background: color-mix(in srgb, var(--bg-surface) 85%, transparent);
  transform: translateY(-1px);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.35);
}

.method-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-cta), var(--color-cta-hover));
  border-radius: 10px;
  color: var(--bg-page);
  font-size: var(--font-size-md);
}

.method-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.method-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.method-link {
  color: var(--color-cta);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-sm);
  transition: color 0.2s ease;
}

.method-link:hover {
  color: var(--color-cta-hover);
}

.method-desc {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.email-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.email-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.3px;
}

.email-input {
  border-radius: 12px;
  border: 1px solid var(--border-default);
  padding: 16px;
  font-size: var(--font-size-sm);
  background: color-mix(in srgb, var(--bg-page) 75%, transparent);
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.email-input:focus {
  outline: none;
  border-color: var(--color-cta);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-cta) 35%, transparent);
  background: color-mix(in srgb, var(--bg-surface) 85%, transparent);
}

.email-input::placeholder {
  color: var(--text-secondary);
}

.email-input-error {
  border-color: var(--color-alert);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-alert) 35%, transparent);
  background: color-mix(in srgb, var(--bg-surface) 85%, transparent);
}

.email-error {
  color: var(--color-alert);
  font-size: var(--font-size-xs);
  margin-top: 4px;
}

.contact-textarea {
  min-height: 100px;
  border-radius: 12px;
  border: 1px solid var(--border-default);
  padding: 16px;
  font-size: var(--font-size-sm);
  background: color-mix(in srgb, var(--bg-page) 75%, transparent);
  color: var(--text-primary);
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.contact-textarea:focus {
  outline: none;
  border-color: var(--color-cta);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-cta) 35%, transparent);
  background: color-mix(in srgb, var(--bg-surface) 85%, transparent);
}

.contact-textarea::placeholder {
  color: var(--text-secondary);
}

.contact-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-cta), var(--color-cta-hover));
  color: var(--bg-page);
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
}

.contact-send-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--color-cta) 45%, transparent);
}

.contact-send-btn:active {
  transform: translateY(0);
}

.contact-send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.contact-send-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.send-icon {
  font-size: var(--font-size-md);
}

.message-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

.message-alert.success {
  background: color-mix(in srgb, var(--color-eligible) 10%, var(--bg-surface));
  border: 1px solid color-mix(in srgb, var(--color-eligible) 20%, transparent);
  color: var(--color-eligible);
}

.message-alert.error {
  background: color-mix(in srgb, var(--color-alert) 10%, var(--bg-surface));
  border: 1px solid color-mix(in srgb, var(--color-alert) 20%, transparent);
  color: var(--color-alert);
}

.message-icon {
  font-size: var(--font-size-md);
}

.message-text {
  flex: 1;
}

/* Mobile tweaks: make card narrower and fonts slightly larger on small screens */
@media (max-width: 768px) {
  .contact-form-container {
    padding: 20px 16px 18px;
    border-radius: 16px;
  }

  .contact-header h2 {
    font-size: var(--font-size-2xl);
  }

  .contact-header p,
  .method-desc,
  .email-input,
  .contact-textarea,
  .contact-send-btn,
  .message-alert {
    font-size: var(--font-size-md);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .contact-form-container {
    padding: 24px;
    margin-top: 32px;
  }
  
  .contact-header h2 {
    font-size: 1.3rem;
  }
  
  .contact-method {
    padding: 12px;
  }
  
  .method-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
</style> 