<template>
  <section class="search-card" aria-label="Search flights by number">
    <div class="search-header">
      <div class="search-title">Search by flight number</div>
      <div class="search-hint">
        Enter flight number and optional date, then we will show eligible flights below.
      </div>
    </div>
    <form class="search-form" @submit.prevent="onSubmit">
      <input
        class="search-input"
        type="text"
        name="flightNo"
        autocomplete="off"
        placeholder="Flight number, e.g. FR1234"
        :value="flightNo"
        @input="onFlightNoInput"
      />
      <input
        class="search-input"
        type="text"
        name="flightDate"
        placeholder="Date (YYYY-MM-DD, optional)"
        inputmode="numeric"
        :value="flightDate"
        @input="onFlightDateInput"
      />
      <button class="search-button" type="submit" :disabled="loading">
        <span v-if="loading">Searching...</span>
        <span v-else>Search flight</span>
      </button>
    </form>
    <p v-if="errorMessage" class="search-status error">{{ errorMessage }}</p>
    <p v-else-if="hasNoResult" class="search-status">No flights found for this query.</p>
  </section>
</template>

<script setup lang="ts">
const { flightNo, flightDate, loading, errorMessage, hasNoResult } = defineProps<{
  flightNo: string
  flightDate: string
  loading: boolean
  errorMessage: string
  hasNoResult: boolean
}>()

const emit = defineEmits<{
  'update:flightNo': [value: string]
  'update:flightDate': [value: string]
  search: []
}>()

const onSubmit = () => {
  emit('search')
}

const onFlightNoInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update:flightNo', target?.value ?? '')
}

const onFlightDateInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    emit('update:flightDate', '')
    return
  }

  // 仅保留数字，并限制长度，自动格式化为 YYYY-MM-DD
  let digits = (target.value || '').replace(/[^0-9]/g, '').slice(0, 8)

  let formatted = ''
  if (digits.length <= 4) {
    formatted = digits
  } else if (digits.length <= 6) {
    formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`
  } else {
    formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`
  }

  target.value = formatted
  emit('update:flightDate', formatted)
}
</script>

<style scoped>
.search-card {
  max-width: 1120px;
  margin: 8px auto 20px;
  padding: 20px 22px;
  border-radius: 16px;
  background: radial-gradient(800px 260px at 0% 0%, rgba(59, 130, 246, 0.20) 0%, rgba(15, 23, 42, 0) 55%),
    var(--bg-table);
  border: 1px solid rgba(148, 163, 184, 0.6);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.search-title {
  font-size: var(--font-size-md);
  font-weight: 650;
}

.search-hint {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  max-width: 360px;
  text-align: right;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.search-input {
  min-width: 0;
  flex: 1 1 140px;
  padding: 8px 12px;
  border-radius: 9px;
  border: 1px solid var(--border-default);
  background: var(--bg-page);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-button {
  flex: 0 0 auto;
  padding: 9px 18px;
  border-radius: 10px;
  border: none;
  background: var(--color-cta);
  color: #0b1120;
  font-size: var(--font-size-sm);
  font-weight: 650;
  cursor: pointer;
  white-space: nowrap;
}

.search-button:disabled {
  opacity: 0.6;
  cursor: default;
}

.search-status {
  font-size:  var(--font-size-sm);
  color: var(--text-secondary);
}

.search-status.error {
  color: var(--color-alert);
}
</style>
