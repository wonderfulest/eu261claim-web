<template>
  <div class="claim-detail-page">
    <header class="detail-header">
      <button class="back-button" type="button" @click="goBack">Back to claims</button>
      <div class="header-main">
        <div>
          <p class="label">Claim number</p>
          <h1 class="claim-number">{{ claim.claimNumber }}</h1>
        </div>
        <span class="status-pill" :class="`status-${claim.status}`">
          {{ formatStatus(claim.status) }}
        </span>
      </div>
      <p class="header-subtitle">
        Flight {{ claim.flightNumber }} · {{ claim.flightDate }} · {{ claim.departureAirport }} → {{ claim.arrivalAirport }}
      </p>
    </header>

    <main class="detail-layout">
      <section class="detail-card">
        <h2 class="section-title">Passenger</h2>
        <dl class="info-grid">
          <div>
            <dt>Name</dt>
            <dd>{{ claim.passengerName }}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{{ claim.email }}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{{ claim.phone || '—' }}</dd>
          </div>
          <div>
            <dt>Booking reference</dt>
            <dd>{{ claim.bookingReference || '—' }}</dd>
          </div>
        </dl>
      </section>

      <section class="detail-card">
        <h2 class="section-title">Disruption</h2>
        <dl class="info-grid">
          <div>
            <dt>Incident type</dt>
            <dd>{{ formatIncidentType(claim.incidentType) }}</dd>
          </div>
          <div>
            <dt>Delay (hours)</dt>
            <dd>{{ claim.delayHours != null ? claim.delayHours : '—' }}</dd>
          </div>
          <div>
            <dt>Status last updated</dt>
            <dd>{{ claim.updatedAt }}</dd>
          </div>
        </dl>
        <div class="description-block" v-if="claim.description">
          <p class="description-label">Description</p>
          <p class="description-text">{{ claim.description }}</p>
        </div>
      </section>

      <section class="detail-card timeline-card">
        <h2 class="section-title">Status timeline (mock)</h2>
        <ol class="timeline">
          <li v-for="item in timeline" :key="item.id" class="timeline-item">
            <div class="dot" />
            <div class="timeline-content">
              <p class="timeline-status">{{ formatStatus(item.status) }}</p>
              <p class="timeline-time">{{ item.time }}</p>
              <p v-if="item.message" class="timeline-message">{{ item.message }}</p>
            </div>
          </li>
        </ol>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface SimpleClaimDetail {
  id: string
  claimNumber: string
  status: 'submitted' | 'reviewing' | 'need_additional_docs' | 'approved' | 'rejected'
  flightNumber: string
  flightDate: string
  departureAirport: string
  arrivalAirport: string
  passengerName: string
  email: string
  phone?: string
  bookingReference?: string
  incidentType: 'delay' | 'cancellation' | 'denied_boarding'
  delayHours: number | null
  description?: string
  updatedAt: string
}

interface TimelineItem {
  id: string
  status: SimpleClaimDetail['status']
  time: string
  message?: string
}

const mockClaim = computed<SimpleClaimDetail>(() => {
  const id = String(route.params.id || '1')

  // TODO: Replace with real API call based on id
  return {
    id,
    claimNumber: `EU261-2026-000${id}`,
    status: id === '2' ? 'approved' : 'reviewing',
    flightNumber: 'LH1234',
    flightDate: '2026-01-10',
    departureAirport: 'FRA',
    arrivalAirport: 'LHR',
    passengerName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+49 123 456789',
    bookingReference: 'ABC123',
    incidentType: 'delay',
    delayHours: 4,
    description: 'The flight departed with a 4-hour delay due to operational issues. No meal vouchers or hotel were provided.',
    updatedAt: '2026-01-12 10:30'
  }
})

const claim = mockClaim

const timeline = computed<TimelineItem[]>(() => {
  return [
    {
      id: '1',
      status: 'submitted',
      time: '2026-01-11 09:15',
      message: 'Your claim has been submitted.'
    },
    {
      id: '2',
      status: 'reviewing',
      time: '2026-01-11 14:30',
      message: 'Our legal team is reviewing your case.'
    },
    {
      id: '3',
      status: claim.value.status,
      time: claim.value.updatedAt,
      message: claim.value.status === 'approved' ? 'Compensation approved (mock data).' : 'Still under review (mock data).'
    }
  ]
})

const formatStatus = (status: SimpleClaimDetail['status']) => {
  switch (status) {
    case 'submitted':
      return 'Submitted'
    case 'reviewing':
      return 'Reviewing'
    case 'need_additional_docs':
      return 'Need More Documents'
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    default:
      return status
  }
}

const formatIncidentType = (type: SimpleClaimDetail['incidentType']) => {
  switch (type) {
    case 'delay':
      return 'Flight delay'
    case 'cancellation':
      return 'Flight cancellation'
    case 'denied_boarding':
      return 'Denied boarding'
    default:
      return type
  }
}

const goBack = () => {
  router.push({ name: 'ClaimList' })
}
</script>

<style scoped>
.claim-detail-page {
  max-width: 1040px;
  margin: 0 auto;
  padding: 32px 16px 56px;
}

.detail-header {
  margin-bottom: 24px;
}

.back-button {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 10px;
}

.back-button:hover {
  background: #f9fafb;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.label {
  margin: 0 0 4px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
}

.claim-number {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.header-subtitle {
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
}

.status-pill {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-submitted {
  background: #eff6ff;
  color: #1d4ed8;
}

.status-reviewing {
  background: #fef3c7;
  color: #92400e;
}

.status-need_additional_docs {
  background: #fef2f2;
  color: #b91c1c;
}

.status-approved {
  background: #ecfdf5;
  color: #15803d;
}

.status-rejected {
  background: #fee2e2;
  color: #b91c1c;
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: 16px;
}

.detail-card {
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: #fff;
  padding: 16px 18px;
}

.timeline-card {
  grid-column: 1 / -1;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
  margin: 0;
}

.info-grid dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
}

.info-grid dd {
  margin: 2px 0 0;
  font-size: 14px;
  color: #111827;
}

.description-block {
  margin-top: 12px;
}

.description-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin: 0 0 4px;
}

.description-text {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.timeline-item {
  display: flex;
  gap: 12px;
  position: relative;
  padding-bottom: 12px;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 7px;
  top: 14px;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 3px solid #2563eb;
  background: #fff;
  margin-top: 2px;
}

.timeline-content {
  flex: 1;
}

.timeline-status {
  margin: 0;
  font-weight: 600;
  font-size: 14px;
}

.timeline-time {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.timeline-message {
  margin: 4px 0 0;
  font-size: 13px;
  color: #374151;
}

@media (max-width: 768px) {
  .detail-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .timeline-card {
    grid-column: auto;
  }

  .header-main {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
