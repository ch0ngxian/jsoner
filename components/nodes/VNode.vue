<template>
  <div class="flex">
    <div v-if="node.constructor === Object">
      <v-object
        :field="field"
        :object="node"
        :showEndComma="showEndComma"
      ></v-object>
    </div>
    <div v-else-if="node.constructor === Array">
      <v-array
        :field="field"
        :array="node"
        :showEndComma="showEndComma"
      ></v-array>
    </div>
    <div v-else-if="node.constructor === String">
      <v-string
        :field="field"
        :value="node"
        :showEndComma="showEndComma"
      ></v-string>
    </div>
    <div v-else-if="node.constructor === Number">
      <v-number
        :field="field"
        :value="node"
        :showEndComma="showEndComma"
      ></v-number>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "VNode",
  props: {
    field: {
      type: [String, Number],
      required: false,
    },
    node: {
      type: [Object, Array, Number, String],
      required: true,
    },
    showEndComma: {
      type: [Boolean],
      default: true,
    },
  },
});
</script>
