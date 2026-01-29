<template>
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
              <button class="cta" type="button" @click="goAffiliate()">
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
        <button class="btn-primary" type="button" @click="$emit('searchAnother')">Search another flight</button>
        <button class="btn-secondary" type="button" @click="$emit('manualCheck')">Request manual check</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type FlightStatus = 'CANCELLED' | 'DELAYED'

interface FlightRow {
  flightId: string
  bookingRef?: string
  flightNo: string
  flightDate: string
  std: string
  sta: string
  actualTime: string
  status: FlightStatus
  delayMinutes?: number
  eligible: boolean
}

const props = defineProps<{
  flights: FlightRow[]
}>()

// const emit = defineEmits<{
//   claim: [flight: FlightRow]
//   searchAnother: []
//   manualCheck: []
// }>()

const eligibleFlights = computed(() => props.flights.filter((f) => f.eligible))

const formatActual = (flight: FlightRow) => {
  const delay = typeof flight.delayMinutes === 'number' ? flight.delayMinutes : null
  const delayText = delay !== null ? ` (+${delay} min)` : ''
  if (flight.status === 'CANCELLED') {
    return `Cancelled ${delayText}`
  }
  return `Landed ${delayText}`
}

const handleRowClick = (flight: FlightRow) => {
  // emit('claim', flight)
  console.warn(flight)
  goAffiliate()
}

const goAffiliate = () => {
  window.open('https://airhelp.tpo.li/I23Fh9CN', '_blank')
}
</script>

<style scoped>
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
  font-size: var(--font-size-sm);
}

.flight-table th {
  font-size: var(--font-size-sm);
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
  font-size: var(--font-size-sm);
  font-weight: 700;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--color-cta) 28%, transparent);
  background: color-mix(in srgb, var(--color-cta) 12%, var(--bg-surface));
  color: var(--color-cta);
  font-weight: 700;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.flight-row:hover .cta {
  background: color-mix(in srgb, var(--color-cta) 18%, var(--bg-surface));
  border-color: color-mix(in srgb, var(--color-cta-hover) 45%, transparent);
  color: var(--color-cta-hover);
}

.cta:hover {
  background: color-mix(in srgb, var(--color-cta) 22%, var(--bg-surface));
  border-color: color-mix(in srgb, var(--color-cta-hover) 60%, transparent);
  color: var(--color-cta-hover);
}

.empty-state {
  border: 1px solid var(--border-default);
  border-radius: 18px;
  background: color-mix(in srgb, var(--bg-page) 72%, transparent);
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
  border: 1px solid color-mix(in srgb, var(--border-default) 90%, transparent);
  background: color-mix(in srgb, var(--bg-page) 60%, transparent);
  color: var(--text-secondary);
  font-size: var(--font-size-xl);
}

.empty-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.empty-desc {
  margin: 10px auto 0;
  max-width: 640px;
  font-size: var(--font-size-sm);
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
  font-size: var(--font-size-sm);
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  border: 1px solid color-mix(in srgb, var(--color-cta) 45%, transparent);
  background: color-mix(in srgb, var(--color-cta) 18%, var(--bg-surface));
  color: var(--text-primary);
}

.btn-primary:hover {
  background: color-mix(in srgb, var(--color-cta) 25%, var(--bg-surface));
}

.btn-secondary {
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-page) 55%, transparent);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: color-mix(in srgb, var(--bg-page) 75%, transparent);
}
</style>
