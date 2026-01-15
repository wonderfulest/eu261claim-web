<template>
  <div class="claims-page">
    <header class="claims-header">
      <div>
        <h1 class="claims-title">My Claims</h1>
        <p class="claims-subtitle">View and track the status of your flight compensation claims.</p>
      </div>
      <button class="primary-button" type="button" @click="goToNewClaim">
        New Claim
      </button>
    </header>

    <section class="claims-content">
      <div v-if="loading" class="state-text">Loading claims...</div>
      <div v-else-if="claims.length === 0" class="state-text">
        You have no claims yet. Click "New Claim" to get started.
      </div>
      <div v-else class="claims-list">
        <article
          v-for="claim in claims"
          :key="claim.id"
          class="claim-card"
          @click="goToDetail(claim.id)"
        >
          <header class="claim-card-header">
            <div>
              <h2 class="claim-number">{{ claim.claimNumber }}</h2>
              <p class="claim-flight">{{ claim.flightNumber }} · {{ claim.flightDate }}</p>
            </div>
            <span class="status-pill" :class="`status-${claim.status}`">
              {{ formatStatus(claim.status) }}
            </span>
          </header>
          <dl class="claim-meta">
            <div>
              <dt>Route</dt>
              <dd>{{ claim.departureAirport }} → {{ claim.arrivalAirport }}</dd>
            </div>
            <div>
              <dt>Passenger</dt>
              <dd>{{ claim.passengerName }}</dd>
            </div>
            <div>
              <dt>Last Updated</dt>
              <dd>{{ claim.updatedAt }}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface SimpleClaim {
  id: string
  claimNumber: string
  status: 'submitted' | 'reviewing' | 'need_additional_docs' | 'approved' | 'rejected'
  flightNumber: string
  flightDate: string
  departureAirport: string
  arrivalAirport: string
  passengerName: string
  updatedAt: string
}

const router = useRouter()

const loading = ref(true)
const claims = ref<SimpleClaim[]>([])

const formatStatus = (status: SimpleClaim['status']) => {
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

const goToNewClaim = () => {
  router.push({ name: 'ClaimNew' })
}

const goToDetail = (id: string) => {
  router.push({ name: 'ClaimDetail', params: { id } })
}

onMounted(() => {
  // TODO: Replace with real API call when backend is ready
  setTimeout(() => {
    claims.value = [
      {
        id: '1',
        claimNumber: 'EU261-2025-0001',
        status: 'reviewing',
        flightNumber: 'LH1234',
        flightDate: '2025-01-10',
        departureAirport: 'FRA',
        arrivalAirport: 'LHR',
        passengerName: 'John Doe',
        updatedAt: '2025-01-12'
      },
      {
        id: '2',
        claimNumber: 'EU261-2025-0002',
        status: 'approved',
        flightNumber: 'AF5678',
        flightDate: '2025-01-05',
        departureAirport: 'CDG',
        arrivalAirport: 'JFK',
        passengerName: 'Jane Smith',
        updatedAt: '2025-01-11'
      }
    ]
    loading.value = false
  }, 400)
})
</script>

<style scoped>
.claims-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 16px 48px;
}

.claims-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.claims-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.claims-subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

.primary-button {
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.primary-button:hover {
  background: #1d4ed8;
}

.claims-content {
  margin-top: 8px;
}

.state-text {
  padding: 32px 0;
  color: #6b7280;
  font-size: 14px;
}

.claims-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.claim-card {
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 16px 18px;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.claim-card:hover {
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}

.claim-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.claim-number {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.claim-flight {
  margin: 2px 0 0;
  font-size: 13px;
  color: #6b7280;
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

.claim-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.claim-meta dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
}

.claim-meta dd {
  margin: 2px 0 0;
  font-size: 13px;
  color: #111827;
}

@media (max-width: 640px) {
  .claims-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .claims-list {
    grid-template-columns: 1fr;
  }
}
</style>
