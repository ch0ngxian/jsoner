<template>
  <div class="flex">
    <template v-if="field">
      "{{ field }}"
      <p class="px-1">:</p>
    </template>
    <p>{{ value }}</p>
    ,
  </div>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "VNumber",
  props: {
    field: {
      type: [String],
      required: false,
    },
    value: {
      type: [Number],
      required: true,
    },
  },
});
</script>
