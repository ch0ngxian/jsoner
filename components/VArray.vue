<template>
  <div>
    <div class="flex">
      <template v-if="field">
        "{{ field }}"
        <p class="px-1">:</p>
      </template>
      [
    </div>
    <div v-for="(node, field) in array" :key="field">
      <v-node class="pl-5" :node="node"></v-node>
    </div>
    ]
  </div>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "VArray",
  props: {
    field: {
      type: [String],
      required: true,
    },
    array: {
      type: [Array],
      required: true,
    },
  },
});
</script>
