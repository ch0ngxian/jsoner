<template>
  <div>
    <div class="flex">
      <template v-if="field">
        "{{ field }}"
        <p class="px-1">:</p>
      </template>
      {
    </div>
    <div v-for="(node, field, index) in object" :key="index">
      <v-node class="pl-5" :field="field" :node="node"></v-node>
    </div>
    }
  </div>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "VObject",
  props: {
    field: {
      type: [String],
      required: true,
    },
    object: {
      type: [Object],
      required: true,
    },
  },
});
</script>
