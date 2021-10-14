<template>
  <div class="flex">
    <template v-if="field">
      "{{ field }}"
      <p class="pr-1">:</p>
    </template>
    <p>"{{ value }}"<span v-if="showEndComma">,</span></p>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "VString",
  props: {
    field: {
      type: [String],
      required: false,
    },
    value: {
      type: [String],
      required: true,
    },
    showEndComma: {
      type: [Boolean],
      default: true,
    },
  },
});
</script>
