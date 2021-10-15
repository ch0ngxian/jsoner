<template>
  <div class="flex">
    <template v-if="field">
      <field :field="field"></field>
      <p class="pr-1">:</p>
    </template>
    <p style="color: #369eda">
      {{ value }}<span v-if="showEndComma" style="color: #d4d4d4">,</span>
    </p>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "VNull",
  props: {
    field: {
      type: [String],
    },
    value: {
      type: [Boolean],
      required: true,
    },
    showEndComma: {
      type: [Boolean],
      default: true,
    },
  },
});
</script>
