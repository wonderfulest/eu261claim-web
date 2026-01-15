<template>
  <div class="claim-new-page">
    <header class="page-header">
      <h1 class="page-title">New Flight Compensation Claim</h1>
      <p class="page-subtitle">
        Tell us what happened with your flight. This information helps us estimate your compensation under EU261 and similar regulations.
      </p>
    </header>

    <form class="claim-form" @submit.prevent="handleSubmit">
      <section class="form-section">
        <h2 class="section-title">Flight Details</h2>
        <div class="field-grid">
          <label class="field">
            <span>Flight number</span>
            <input v-model="form.flightNumber" type="text" placeholder="e.g. LH1234" required />
          </label>
          <label class="field">
            <span>Flight date</span>
            <input v-model="form.flightDate" type="date" required />
          </label>
          <label class="field">
            <span>Departure airport (IATA code)</span>
            <input v-model="form.departureAirport" type="text" placeholder="e.g. FRA" required />
          </label>
          <label class="field">
            <span>Arrival airport (IATA code)</span>
            <input v-model="form.arrivalAirport" type="text" placeholder="e.g. LHR" required />
          </label>
        </div>
      </section>

      <section class="form-section">
        <h2 class="section-title">Passenger Information</h2>
        <div class="field-grid">
          <label class="field">
            <span>Full name</span>
            <input v-model="form.passengerName" type="text" placeholder="As shown on your ticket" required />
          </label>
          <label class="field">
            <span>Email</span>
            <input v-model="form.email" type="email" placeholder="you@example.com" required />
          </label>
          <label class="field">
            <span>Phone (optional)</span>
            <input v-model="form.phone" type="tel" placeholder="Include country code" />
          </label>
          <label class="field">
            <span>Booking reference (optional)</span>
            <input v-model="form.bookingReference" type="text" placeholder="e.g. ABC123" />
          </label>
        </div>
      </section>

      <section class="form-section">
        <h2 class="section-title">Disruption Details</h2>
        <div class="field-grid">
          <label class="field">
            <span>Incident type</span>
            <select v-model="form.incidentType" required>
              <option disabled value="">Select incident type</option>
              <option value="delay">Flight delay</option>
              <option value="cancellation">Flight cancellation</option>
              <option value="denied_boarding">Denied boarding</option>
            </select>
          </label>
          <label class="field">
            <span>Delay duration (in hours, approximate)</span>
            <input v-model.number="form.delayHours" type="number" min="0" step="0.5" />
          </label>
        </div>
        <label class="field">
          <span>What happened?</span>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Briefly describe what happened, including any information given by the airline."
          />
        </label>
      </section>

      <section class="form-section">
        <h2 class="section-title">Documents (optional for now)</h2>
        <p class="section-help">
          You can upload your boarding pass and itinerary later. For now, just make sure your contact details are correct so we can reach you.
        </p>
        <label class="file-field">
          <span>Attach files</span>
          <input type="file" multiple @change="handleFiles" />
          <p v-if="files.length" class="file-list">
            {{ files.length }} file(s) selected.
          </p>
        </label>
      </section>

      <footer class="form-footer">
        <button class="secondary-button" type="button" @click="goBack">Cancel</button>
        <button class="primary-button" type="submit" :disabled="submitting">
          {{ submitting ? 'Submitting...' : 'Submit claim' }}
        </button>
      </footer>

      <p v-if="submitted" class="success-text">
        Your claim has been created (mock). In a real system, you would now see a reference number and status.
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface NewClaimForm {
  flightNumber: string
  flightDate: string
  departureAirport: string
  arrivalAirport: string
  passengerName: string
  email: string
  phone: string
  bookingReference: string
  incidentType: '' | 'delay' | 'cancellation' | 'denied_boarding'
  delayHours: number | null
  description: string
}

const form = reactive<NewClaimForm>({
  flightNumber: '',
  flightDate: '',
  departureAirport: '',
  arrivalAirport: '',
  passengerName: '',
  email: '',
  phone: '',
  bookingReference: '',
  incidentType: '',
  delayHours: null,
  description: ''
})

const files = ref<File[]>([])
const submitting = ref(false)
const submitted = ref(false)

const handleFiles = (event: Event) => {
  const target = event.target as HTMLInputElement
  files.value = Array.from(target.files || [])
}

const goBack = () => {
  router.push({ name: 'ClaimList' })
}

const handleSubmit = async () => {
  if (!form.flightNumber || !form.flightDate || !form.departureAirport || !form.arrivalAirport || !form.passengerName || !form.email || !form.incidentType) {
    alert('Please fill in all required fields.')
    return
  }

  submitting.value = true
  submitted.value = false

  // TODO: Replace with real API call when backend is ready
  await new Promise((resolve) => setTimeout(resolve, 800))

  submitting.value = false
  submitted.value = true

  // Navigate to mock claim list after short delay
  setTimeout(() => {
    router.push({ name: 'ClaimList' })
  }, 800)
}
</script>

<style scoped>
.claim-new-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 16px 56px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
}

.page-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.claim-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: #ffffff;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
}

.section-help {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 13px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.field span {
  font-weight: 500;
  color: #374151;
}

input,
select,
textarea {
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 14px;
  outline: none;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2);
}

textarea {
  resize: vertical;
}

.file-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.file-list {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
}

.primary-button,
.secondary-button {
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  border: none;
  background: #2563eb;
  color: #fff;
}

.primary-button[disabled] {
  opacity: 0.7;
  cursor: default;
}

.primary-button:hover:not([disabled]) {
  background: #1d4ed8;
}

.secondary-button {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
}

.secondary-button:hover {
  background: #f9fafb;
}

.success-text {
  margin-top: 4px;
  font-size: 13px;
  color: #16a34a;
}

@media (max-width: 640px) {
  .form-section {
    padding: 14px 12px;
  }
}
</style>
