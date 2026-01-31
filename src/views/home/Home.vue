<template>
  <div class="eu261-page">
    <header class="page-header">
      <h1 class="page-title">Eligible EU261 Flights</h1>
      <p class="page-subtitle">These flights qualify for EU261 compensation.</p>
    </header>

    <section class="page-content" aria-label="Search and results">
      <aside class="page-aside" aria-label="Search form">
        <FlightSearchCard
          v-model:flightNo="searchFlightNo"
          v-model:flightDate="searchDate"
          :loading="isLoading"
          :errorMessage="errorMessage"
          :hasNoResult="!!(apiFlights && apiFlights.length === 0)"
          @search="searchFlights"
        />
      </aside>

      <main class="page-main" aria-label="Eligible flights">
        <FlightResultsTable
          :flights="flights"
          @claim="handleClaim"
          @searchAnother="handleSearchAnother"
          @manualCheck="handleManualCheck"
        />
      </main>
    </section>

    <footer class="page-footer">
      <p class="disclaimer">
        Disclaimer: Flight delay or cancellation status, eligibility for EU261 compensation, and any related information shown on this page are based on preliminary data. Final eligibility and compensation amount are subject to final review and airline confirmation.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FlightSearchCard from './components/FlightSearchCard.vue'
import FlightResultsTable from './components/FlightResultsTable.vue'

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
  delayMinutes?: number
  eligible: boolean
}

const router = useRouter()
const route = useRoute()

const searchFlightNo = ref('')
const searchDate = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const apiFlights = ref<EligibleFlight[] | null>(null)

const historyPage = ref(1)
const historyTotalPages = ref<number | null>(null)
const isHistoryMode = ref(true)
let historyTimer: number | null = null

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
  if (apiFlights.value) return apiFlights.value

  const fromQuery = parseFlightsFromQuery()
  if (fromQuery) return fromQuery

  const stateFlights = (window.history.state as any)?.flights
  if (Array.isArray(stateFlights)) return stateFlights as EligibleFlight[]

  if (route.query.empty === '1') return []
  return []
})

const formatTimeFromBackend = (value: string | null | undefined): string => {
  if (!value) return ''
  const str = String(value)
  const parts = str.includes('T') ? str.split('T') : str.split(' ')
  const timePart = parts[1] || parts[0]
  return timePart.slice(0, 5)
}

const mapBackendFlight = (raw: any, index: number): EligibleFlight => {
  const flightNumber = raw.flightNumber || raw.flight_no || raw.flightIata || 'UNKNOWN'
  const flightDate = raw.flightDate || raw.flight_date || ''
  const std = formatTimeFromBackend(raw.std)
  const sta = formatTimeFromBackend(raw.sta)
  const actual = formatTimeFromBackend(raw.actualTime)

  const rawStatus = String(raw.status || '').toUpperCase()
  const status: FlightStatus = rawStatus === 'CANCELLED' ? 'CANCELLED' : 'DELAYED'

  return {
    flightId: raw.id || `${flightNumber}-${flightDate}-${index}`,
    bookingRef: '',
    flightNo: flightNumber,
    flightDate,
    std,
    sta,
    actualTime: actual,
    status,
    delayMinutes: typeof raw.arrivalDelayMinutes === 'number' ? raw.arrivalDelayMinutes : undefined,
    // 由后端控制结果集是否为 EU261 eligible，这里全部标记为 true，让前端只负责展示
    eligible: true
  }
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

const handleSearchAnother = () => {
  router.replace({
    path: '/',
    query: {}
  })
}

const handleManualCheck = () => {
  window.open('https://airhelp.tpo.li/I23Fh9CN', '_blank')
  // router.push({ name: 'Contact' })
}

const searchFlights = async () => {
  // 用户主动搜索后，停止历史轮播模式
  isHistoryMode.value = false
  errorMessage.value = ''
  apiFlights.value = null

  const trimmedNo = searchFlightNo.value.trim()
  if (!trimmedNo) {
    errorMessage.value = 'Please enter a flight number (e.g. FR1234)'
    return
  }

  const params = new URLSearchParams()
  params.set('flight_iata', trimmedNo)
  const trimmedDate = searchDate.value.trim()
  if (trimmedDate) {
    // 简单日期合法性校验：YYYY-MM-DD 且为真实日期
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(trimmedDate)) {
      errorMessage.value = 'Please enter a valid date in YYYY-MM-DD format.'
      return
    }
    const [y, m, d] = trimmedDate.split('-').map((v) => Number(v))
    const jsDate = new Date(y, m - 1, d)
    if (
      Number.isNaN(jsDate.getTime()) ||
      jsDate.getFullYear() !== y ||
      jsDate.getMonth() !== m - 1 ||
      jsDate.getDate() !== d
    ) {
      errorMessage.value = 'Please enter a real calendar date.'
      return
    }
    params.set('flight_date', trimmedDate)
  }

  isLoading.value = true
  try {
    const resp = await fetch(`/api/public/flights/query/by-number?${params.toString()}`)
    if (!resp.ok) {
      throw new Error(`Request failed with status ${resp.status}`)
    }
    const respJson: any = await resp.json()
    const payload = respJson?.data ?? respJson
    const list: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.list)
        ? payload.list
        : []
    apiFlights.value = list.map((item: any, idx: number) => mapBackendFlight(item, idx))
  } catch (e: any) {
    console.error('searchFlights error', e)
    errorMessage.value = e?.message || 'Failed to search flights. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const loadHistoryPage = async (pageNum: number) => {
  try {
    const params = new URLSearchParams()
    params.set('pageNum', String(pageNum))
    params.set('pageSize', '10')

    const resp = await fetch(`/api/public/flights/history?${params.toString()}`)
    if (!resp.ok) {
      throw new Error(`History request failed with status ${resp.status}`)
    }
    const respJson: any = await resp.json()
    const payload = respJson?.data ?? respJson
    const list = Array.isArray(payload?.list) ? payload.list : []

    historyPage.value = payload?.pageNum || pageNum
    historyTotalPages.value = payload?.pages || null
    apiFlights.value = list.map((item: any, idx: number) => mapBackendFlight(item, idx))
  } catch (e) {
    console.error('loadHistoryPage error', e)
  }
}

// 当用户清空搜索条件时，恢复到历史模式并重新加载默认历史列表
watch([searchFlightNo, searchDate], async ([flightNo, flightDate]) => {
  if (!flightNo.trim() && !flightDate.trim()) {
    isHistoryMode.value = true
    errorMessage.value = ''
    apiFlights.value = null
    await loadHistoryPage(1)
  }
})

onMounted(async () => {
  // 初始加载历史记录第 1 页
  await loadHistoryPage(1)

  // 每 5 秒轮播一页，仅在历史模式下生效
  historyTimer = window.setInterval(async () => {
    if (!isHistoryMode.value) return

    const total = historyTotalPages.value
    if (!total || total <= 1) return

    const current = historyPage.value || 1
    const next = current >= total ? 1 : current + 1
    await loadHistoryPage(next)
  }, 3000)
})

onBeforeUnmount(() => {
  if (historyTimer !== null) {
    clearInterval(historyTimer)
    historyTimer = null
  }
})
</script>

<style scoped>
.eu261-page {
  background:
    radial-gradient(
      1100px 500px at 50% -120px,
      color-mix(in srgb, var(--color-cta) 25%, transparent) 0%,
      transparent 60%
    ),
    radial-gradient(
      900px 420px at 50% 10%,
      color-mix(in srgb, var(--color-alert) 12%, transparent) 0%,
      transparent 65%
    ),
    var(--bg-page);
  padding: 36px 16px 48px;
  color: var(--text-primary);
}

.page-content {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-aside {
  min-width: 0;
}

.page-main {
  min-width: 0;
}

.page-header {
  max-width: 1120px;
  margin: 0 auto 18px;
}

.page-title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: 0.2px;
}

.page-subtitle {
  margin: 6px 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.page-footer {
  max-width: 1120px;
  margin: 14px auto 0;
  padding-top: 12px;
}

.disclaimer {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .eu261-page {
    padding: 26px 12px 40px;
  }

  .page-title {
    font-size: var(--font-size-xl);
  }

  .empty-state {
    padding: 34px 14px;
  }
}
</style>