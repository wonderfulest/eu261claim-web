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
      <div class="date-picker-wrapper">
        <el-date-picker
          v-model="internalDate"
          type="date"
          class="date-picker"
          popper-class="flight-search-date-popper"
          placeholder="Date (YYYY-MM-DD, optional)"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          clearable
        />
      </div>
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
import { ref, watch } from 'vue'

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

// 与 el-date-picker 绑定：使用 YYYY-MM-DD 字符串
const internalDate = ref<string | null>(flightDate || null)

// 日期选择变化 -> 同步给父组件
watch(internalDate, (val) => {
  emit('update:flightDate', val || '')
})

// 父组件外部修改 flightDate -> 同步回控件
watch(
  () => flightDate,
  (val) => {
    internalDate.value = val || null
  }
)

const onSubmit = () => {
  emit('search')
}

const onFlightNoInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update:flightNo', target?.value ?? '')
}
</script>

<style scoped>
.search-card {
  max-width: 1120px;
  margin: 8px auto 20px;
  padding: 20px 22px;
  border-radius: 16px;
  background: radial-gradient(800px 260px at 0% 0%, color-mix(in srgb, var(--color-cta) 35%, transparent) 0%, transparent 55%),
    var(--bg-table);
  border: 1px solid color-mix(in srgb, var(--border-default) 65%, transparent);
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--color-cta) 70%, transparent),
    0 0 0 4px color-mix(in srgb, var(--color-cta) 30%, transparent);
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
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(0, 1.6fr) auto;
  gap: 12px;
  align-items: stretch;
}

.search-input {
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--border-default) 55%, transparent);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.date-picker-wrapper {
  width: 100%;
  --el-date-editor-width: 100%;
  height: 42px;
}

.date-picker {
  width: 100%;
  display: block;
  --el-date-editor-width: 100%;
  height: 42px;
}

:deep(.date-picker.el-date-editor) {
  width: 100%;
}

/* 覆盖 Element Plus 日期选择器样式，使其与 .search-input 完全一致 */
:deep(.date-picker .el-input__wrapper) {
  width: 100%;
  padding: 0 14px;
  height: 42px; /* 与 search-input 视觉高度一致 */
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--border-default) 55%, transparent);
  background: var(--bg-surface);
  box-shadow: none;
}

:deep(.date-picker .el-input__inner) {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  height: 40px;
  line-height: 40px;
  padding: 0;
}

:deep(.date-picker .el-input__inner::placeholder) {
  color: var(--text-secondary);
}

:deep(.date-picker .el-input__wrapper.is-focus),
:deep(.date-picker .el-input__wrapper:hover) {
  border-color: var(--color-cta);
  box-shadow: 0 0 0 1px var(--color-cta), 0 0 0 4px rgba(37, 99, 235, 0.35);
}

:deep(.date-picker .el-icon) {
  color: var(--text-secondary);
}

/* 日期弹窗：由于 popper 挂载在 body，需要用 :global 覆盖，并用 popper-class 限定作用域 */
:global(.flight-search-date-popper) {
  --el-bg-color-overlay: var(--bg-surface);
  --el-bg-color: var(--bg-surface);
  --el-text-color-regular: var(--text-primary);
  --el-text-color-secondary: var(--text-secondary);
  --el-border-color: var(--border-default);
  --el-fill-color-light: var(--bg-row-hover);
}

:global(.flight-search-date-popper.el-popper),
:global(.flight-search-date-popper .el-picker-panel) {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  box-shadow: 0 12px 40px color-mix(in srgb, var(--bg-page) 70%, transparent);
}

:global(.flight-search-date-popper .el-picker-panel__header) {
  color: var(--text-primary);
}

:global(.flight-search-date-popper .el-picker-panel__icon-btn) {
  color: var(--text-secondary);
}

:global(.flight-search-date-popper .el-date-picker__header-label) {
  color: var(--text-primary);
}

:global(.flight-search-date-popper .el-date-table th) {
  color: var(--text-secondary);
}

:global(.flight-search-date-popper .el-date-table td .el-date-table-cell__text) {
  color: var(--text-primary);
}

:global(.flight-search-date-popper .el-date-table td.current:not(.disabled) .el-date-table-cell__text),
:global(.flight-search-date-popper .el-date-table td.today:not(.disabled) .el-date-table-cell__text) {
  color: var(--color-cta);
}

:global(.flight-search-date-popper .el-date-table td.available:hover .el-date-table-cell) {
  background-color: color-mix(in srgb, var(--bg-row-hover) 85%, transparent);
}

:global(.flight-search-date-popper .el-date-table td.current:not(.disabled) .el-date-table-cell) {
  background-color: color-mix(in srgb, var(--color-cta) 25%, transparent);
}

:global(.flight-search-date-popper .el-picker-panel__footer) {
  border-top: 1px solid var(--border-default);
  background: var(--bg-surface);
}

:global(.flight-search-date-popper .el-button) {
  border-color: var(--border-default);
}

.search-button {
  flex: 0 0 auto;
  padding: 9px 18px;
  border-radius: 10px;
  border: none;
  background: var(--color-cta);
  color: var(--bg-page);
  font-size: var(--font-size-sm);
  font-weight: 650;
  cursor: pointer;
  white-space: nowrap;
  height: 42px;
  display: inline-flex;
  align-items: center;
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
