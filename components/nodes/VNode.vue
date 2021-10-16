<template>
  <div class="flex py-0.5">
    <!-- <div v-if="node != null">{{ node.constructor }}</div> -->
    <div v-if="node == null">
      <v-null
        :field="field"
        :value="node"
        :showEndComma="showEndComma"
      ></v-null>
    </div>
    <div v-else-if="node.constructor === Object">
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
    <div v-else-if="node.constructor === Boolean">
      <v-boolean
        :field="field"
        :value="node"
        :showEndComma="showEndComma"
      ></v-boolean>
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
      type: [Object, Array, Number, String, Boolean],
    },
    showEndComma: {
      type: [Boolean],
      default: true,
    },
  },
});
</script>
