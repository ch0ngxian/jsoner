<template>
  <div v-if="errors.length > 0" class="error-container">
    <div class="error-header">
      <span class="error-icon">⚠</span>
      <span class="error-title">JSON Validation Issues ({{ errors.length }})</span>
      <span v-if="fixesApplied.length > 0" class="fixes-applied">
        Auto-fixed: {{ fixesApplied.join(', ') }}
      </span>
    </div>
    <div class="error-list">
      <div
        v-for="(error, index) in errors"
        :key="index"
        class="error-item"
        :class="`error-type-${error.type}`"
      >
        <div class="error-location">
          Line {{ error.line }}, Column {{ error.column }}
        </div>
        <div class="error-message">
          {{ error.message }}
        </div>
        <div class="error-type-badge">{{ error.type }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@nuxtjs/composition-api";
import { JsonError } from "~/utils/partialJsonParser";

export default defineComponent({
  props: {
    errors: {
      type: Array as PropType<JsonError[]>,
      required: true,
      default: () => []
    },
    fixesApplied: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => []
    }
  }
});
</script>

<style scoped>
.error-container {
  margin-bottom: 1rem;
  border-left: 3px solid #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.error-header {
  padding: 0.75rem 1rem;
  background-color: rgba(245, 158, 11, 0.15);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.error-icon {
  font-size: 1.25rem;
  color: #f59e0b;
}

.error-title {
  color: #f59e0b;
  font-size: 0.875rem;
}

.fixes-applied {
  margin-left: auto;
  font-size: 0.75rem;
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
}

.error-list {
  padding: 0.5rem;
}

.error-item {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: rgba(31, 31, 31, 0.5);
  border-radius: 4px;
  position: relative;
  border-left: 2px solid transparent;
}

.error-type-syntax {
  border-left-color: #ef4444;
}

.error-type-incomplete {
  border-left-color: #f59e0b;
}

.error-type-invalid {
  border-left-color: #ef4444;
}

.error-location {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: 'Courier New', monospace;
  margin-bottom: 0.25rem;
}

.error-message {
  font-size: 0.875rem;
  color: #d4d4d4;
  margin-bottom: 0.25rem;
}

.error-type-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 0.625rem;
  text-transform: uppercase;
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-weight: 600;
}

.error-type-syntax .error-type-badge {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.error-type-incomplete .error-type-badge {
  background-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.error-type-invalid .error-type-badge {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}
</style>
