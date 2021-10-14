<template>
  <div>
    <div class="flex">
      <template v-if="field">
        "{{ field }}"
        <p class="pr-1">:</p>
      </template>
      {
    </div>
    <div class="flex" v-for="(node, field, index) in object" :key="index">
      <v-node
        class="pl-5"
        :showEndComma="index + 1 != Object.keys(object).length"
        :field="field"
        :node="node"
      ></v-node>
    </div>
    }<span v-if="showEndComma">,</span>
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
    showEndComma: {
      type: [Boolean],
      default: true,
    },
  },
});
</script>
