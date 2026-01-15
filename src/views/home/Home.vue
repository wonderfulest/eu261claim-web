<template>
  <div class="home">
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="hero-kicker">EU261 Flight Compensation</p>
          <h1 class="hero-title">
            Delayed or cancelled flight?
            <span class="highlight">You could get up to €600</span> in compensation.
          </h1>
          <p class="hero-subtitle">
            Check if your flight is eligible in just a few steps.
          </p>
        </div>

        <form class="hero-form" @submit.prevent="handleSubmit">
          <div class="form-grid">
            <label class="field">
              <span>Flight number</span>
              <input v-model="form.flightNumber" type="text" placeholder="e.g. LH1234" required />
            </label>
            <label class="field">
              <span>Departure date</span>
              <input v-model="form.flightDate" type="date" required />
            </label>
          </div>
          <div class="form-grid">
            <label class="field">
              <span>From</span>
              <input v-model="form.origin" type="text" placeholder="e.g. FRA" required />
            </label>
            <label class="field">
              <span>To</span>
              <input v-model="form.destination" type="text" placeholder="e.g. LHR" required />
            </label>
          </div>
          <label class="field full-width">
            <span>Email</span>
            <input v-model="form.email" type="email" placeholder="you@example.com" required />
          </label>
          <button class="cta-button" type="submit" :disabled="submitting">
            {{ submitting ? 'Submitting...' : 'Check Your Claim' }}
          </button>
          <p v-if="submitted && !error" class="status-text success">We received your request. We will review your flight and contact you by email.</p>
          <p v-if="error" class="status-text error">Something went wrong. Please try again.</p>
        </form>

        <ul class="trust-strip">
          <li>
            <span class="icon">✓</span>
            <span class="text">No win, no fee</span>
          </li>
          <li>
            <span class="icon">⏱</span>
            <span class="text">Quick online process</span>
          </li>
          <li>
            <span class="icon">⚖️</span>
            <span class="text">EU261-focused team</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { submitLandingLead } from '@/api/landing'

interface LandingForm {
  flightNumber: string
  flightDate: string
  origin: string
  destination: string
  email: string
}

const form = reactive<LandingForm>({
  flightNumber: '',
  flightDate: '',
  origin: '',
  destination: '',
  email: ''
})

const submitting = ref(false)
const submitted = ref(false)
const error = ref(false)

const handleSubmit = async () => {
  if (!form.flightNumber || !form.flightDate || !form.origin || !form.destination || !form.email) {
    return
  }

  submitting.value = true
  submitted.value = false
  error.value = false

  try {
    await submitLandingLead({
      flightNumber: form.flightNumber,
      flightDate: form.flightDate,
      origin: form.origin,
      destination: form.destination,
      email: form.email
    })
    submitted.value = true
  } catch (e) {
    error.value = true
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

.hero {
  padding: 56px 0 40px;
}

.hero-inner {
  max-width: 960px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 18px;
  padding: 32px 26px 32px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 18px;
}

.hero-copy {
  padding-right: 8px;
}

.hero-kicker {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #0b7bd4;
  margin: 0 0 8px;
}

.hero-title {
  font-size: 26px;
  line-height: 1.25;
  font-weight: 700;
  margin: 0 0 10px;
  color: #0f172a;
}

.highlight {
  display: block;
  color: #16a34a;
}

.hero-subtitle {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
}

.hero-form {
  background: #f9fafb;
  border-radius: 16px;
  padding: 14px 14px 16px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.field span {
  color: #374151;
  font-weight: 500;
}

.field input {
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 7px 9px;
  font-size: 13px;
}

.field input:focus {
  border-color: #0b7bd4;
  outline: none;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18);
}

.field.full-width {
  width: 100%;
}

.cta-button {
  margin-top: 4px;
  width: 100%;
  border-radius: 999px;
  border: none;
  background: #22c55e;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 14px;
  cursor: pointer;
}

.cta-button:hover:not([disabled]) {
  background: #16a34a;
}

.cta-button[disabled] {
  opacity: 0.8;
  cursor: default;
}

.status-text {
  margin: 2px 0 0;
  font-size: 12px;
}

.status-text.success {
  color: #16a34a;
}

.status-text.error {
  color: #b91c1c;
}

.trust-strip {
  grid-column: 1 / -1;
  margin: 10px 0 0;
  padding: 10px 12px 4px;
  border-radius: 14px;
  background: #f3f4f6;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.trust-strip li {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.icon {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #0b7bd4;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.text {
  font-size: 13px;
  color: #374151;
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 8px 32px;
  }

  .hero-inner {
    padding: 18px 16px 18px;
    grid-template-columns: minmax(0, 1fr);
  }

  .hero-copy {
    padding-right: 0;
  }

  .hero-title {
    font-size: 22px;
  }

  .form-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .trust-strip {
    flex-direction: column;
  }
}
</style>