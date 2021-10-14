<template>
  <div>
    <div class="flex">
      <template v-if="field">
        "{{ field }}"
        <p class="pr-1">:</p>
      </template>
      [
    </div>
    <div class="flex" v-for="(node, index) in array" :key="index">
      <v-node
        class="pl-5"
        :showEndComma="index + 1 != array.length"
        :node="node"
      ></v-node>
    </div>
    ]<span v-if="showEndComma">,</span>
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
    showEndComma: {
      type: [Boolean],
      default: true,
    },
  },
});
</script>
