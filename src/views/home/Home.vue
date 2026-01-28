<template>
  <div class="eu261-page">
    <header class="page-header">
      <h1 class="page-title">Eligible EU261 Flights</h1>
      <p class="page-subtitle">These flights qualify for EU261 compensation.</p>
    </header>

    <section class="table-section">
      <div v-if="eligibleFlights.length > 0" class="table-scroll">
        <table class="flight-table">
          <thead>
            <tr>
              <th class="col-flight">Flight</th>
              <th class="col-date">Date</th>
              <th class="col-time">STD</th>
              <th class="col-time">STA</th>
              <th class="col-actual">Actual</th>
              <th class="col-status">Status</th>
              <th class="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="flight in eligibleFlights"
              :key="flight.flightId"
              class="flight-row"
              @click="handleRowClick(flight)"
            >
              <td class="col-flight">
                <span class="flight-no">{{ flight.flightNo }}</span>
              </td>
              <td class="col-date">
                <span class="text-secondary">{{ flight.flightDate }}</span>
              </td>
              <td class="col-time">
                <span class="time-mono">{{ flight.std }}</span>
              </td>
              <td class="col-time">
                <span class="time-mono">{{ flight.sta }}</span>
              </td>
              <td class="col-actual">
                <span class="text-primary">{{ formatActual(flight) }}</span>
              </td>
              <td class="col-status">
                <div class="status-wrap">
                  <span class="status-alert">{{ flight.status }}</span>
                  <span class="status-dot">·</span>
                  <span class="status-eligible">Eligible</span>
                </div>
              </td>
              <td class="col-action" @click.stop>
                <button class="cta" type="button" @click="handleClaim(flight)">
                  Claim compensation →
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon" aria-hidden="true">✈︎</div>
        <h2 class="empty-title">No eligible flights found</h2>
        <p class="empty-desc">
          We couldn’t find any flights matching your search that qualify for EU261 compensation. Only flights qualifying for EU261 compensation are shown.
        </p>
        <div class="empty-actions">
          <button class="btn-primary" type="button" @click="handleSearchAnother">Search another flight</button>
          <button class="btn-secondary" type="button" @click="handleManualCheck">Request manual check</button>
        </div>
      </div>
    </section>

    <footer class="page-footer">
      <p class="disclaimer">
        Disclaimer: Flight delay or cancellation status, eligibility for EU261 compensation, and any related information shown on this page are based on preliminary data. Final eligibility and compensation amount are subject to final review and airline confirmation.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type FlightStatus = 'CANCELLED' | 'DELAYED'

interface EligibleFlight {
  flightId: string
  bookingRef?: string
  flightNo: string
  flightDate: string
  std: string
  sta: string
  actualTime: string
  status: FlightStatus
  eligible: boolean
}

const router = useRouter()
const route = useRoute()

const defaultFlights: EligibleFlight[] = [
  {
    flightId: 'flt_1',
    bookingRef: 'ABC123',
    flightNo: 'FR1234',
    flightDate: '2025-01-18',
    std: '08:30',
    sta: '10:40',
    actualTime: '07:55',
    status: 'CANCELLED',
    eligible: true
  },
  {
    flightId: 'flt_2',
    bookingRef: 'DEF456',
    flightNo: 'LH789',
    flightDate: '2025-01-18',
    std: '11:20',
    sta: '13:35',
    actualTime: '14:12',
    status: 'DELAYED',
    eligible: true
  },
  {
    flightId: 'flt_3',
    bookingRef: 'GHI789',
    flightNo: 'AF5678',
    flightDate: '2025-01-18',
    std: '15:10',
    sta: '17:25',
    actualTime: '17:10',
    status: 'DELAYED',
    eligible: false
  }
]

const parseFlightsFromQuery = (): EligibleFlight[] | null => {
  const raw = route.query.flights
  if (!raw) return null

  const rawText = Array.isArray(raw) ? raw[0] : raw
  if (!rawText) return null

  try {
    const parsed = JSON.parse(String(rawText))
    if (!Array.isArray(parsed)) return null
    return parsed as EligibleFlight[]
  } catch {
    return null
  }
}

const flights = computed<EligibleFlight[]>(() => {
  const fromQuery = parseFlightsFromQuery()
  if (fromQuery) return fromQuery

  const stateFlights = (window.history.state as any)?.flights
  if (Array.isArray(stateFlights)) return stateFlights as EligibleFlight[]

  if (route.query.empty === '1') return []
  return defaultFlights
})

const eligibleFlights = computed(() => flights.value.filter((f) => f.eligible))

const formatActual = (flight: EligibleFlight) => {
  if (flight.status === 'CANCELLED') {
    return `Cancelled ${flight.actualTime}`
  }
  return `Landed ${flight.actualTime}`
}

const handleClaim = (flight: EligibleFlight) => {
  router.push({
    name: 'ClaimNew',
    query: {
      flightId: flight.flightId,
      bookingRef: flight.bookingRef || ''
    }
  })
}

const handleRowClick = (flight: EligibleFlight) => {
  handleClaim(flight)
}

const handleSearchAnother = () => {
  router.replace({
    path: '/',
    query: {}
  })
}

const handleManualCheck = () => {
  router.push({ name: 'Contact' })
}
</script>

<style scoped>
.eu261-page {
  min-height: calc(100vh - 60px);
  background: radial-gradient(1100px 500px at 50% -120px, rgba(59, 130, 246, 0.25) 0%, rgba(14, 14, 17, 0) 60%),
    radial-gradient(900px 420px at 50% 10%, rgba(229, 72, 77, 0.12) 0%, rgba(14, 14, 17, 0) 65%),
    var(--bg-page);
  padding: 36px 16px 48px;
  color: var(--text-primary);
}

.page-header {
  max-width: 1120px;
  margin: 0 auto 18px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.page-subtitle {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.table-section {
  max-width: 1120px;
  margin: 0 auto;
}

.table-scroll {
  overflow-x: auto;
  border: 1px solid var(--border-default);
  border-radius: 14px;
  background: var(--bg-table);
}

.flight-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 880px;
}

.flight-table th,
.flight-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-default);
  text-align: left;
  white-space: nowrap;
  font-size: 13px;
}

.flight-table th {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.04em;
}

.flight-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.flight-row:hover {
  background: var(--bg-row-hover);
}

.col-flight {
  width: 128px;
}

.col-date {
  width: 128px;
}

.col-time {
  width: 92px;
}

.col-actual {
  width: 160px;
}

.col-status {
  width: 170px;
}

.col-action {
  width: 190px;
}

.flight-no {
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 600;
}

.time-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.text-secondary {
  color: var(--text-secondary);
}

.text-primary {
  color: var(--text-primary);
}

.status-wrap {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.status-alert {
  color: var(--color-alert);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.status-dot {
  color: var(--text-secondary);
}

.status-eligible {
  color: var(--color-eligible);
  font-size: 12px;
  font-weight: 700;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(59, 130, 246, 0.28);
  background: rgba(59, 130, 246, 0.12);
  color: var(--color-cta);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.flight-row:hover .cta {
  background: rgba(59, 130, 246, 0.18);
  border-color: rgba(96, 165, 250, 0.45);
  color: var(--color-cta-hover);
}

.cta:hover {
  background: rgba(59, 130, 246, 0.22);
  border-color: rgba(96, 165, 250, 0.6);
  color: var(--color-cta-hover);
}

.empty-state {
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background: rgba(20, 20, 26, 0.72);
  padding: 42px 18px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(38, 38, 48, 0.9);
  background: rgba(14, 14, 17, 0.6);
  color: var(--text-secondary);
  font-size: 22px;
}

.empty-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.empty-desc {
  margin: 10px auto 0;
  max-width: 640px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.empty-actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  border: 1px solid rgba(59, 130, 246, 0.45);
  background: rgba(59, 130, 246, 0.18);
  color: var(--text-primary);
}

.btn-primary:hover {
  background: rgba(59, 130, 246, 0.25);
}

.btn-secondary {
  border: 1px solid var(--border-default);
  background: rgba(20, 20, 26, 0.55);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: rgba(28, 28, 36, 0.75);
}

.page-footer {
  max-width: 1120px;
  margin: 14px auto 0;
  padding-top: 12px;
}

.disclaimer {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .eu261-page {
    padding: 26px 12px 40px;
  }

  .page-title {
    font-size: 22px;
  }

  .empty-state {
    padding: 34px 14px;
  }
}
</style>