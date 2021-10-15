<template>
  <div>
    <template v-if="!isOpen">
      <div class="flex">
        <template v-if="field">
          <field :field="field"></field>
          <p class="pr-1">:</p>
        </template>
        [
        <button class="mx-1 px-1 hover:bg-gray-700 rounded" @click="open">
          ...
        </button>
        ]
        <span v-if="showEndComma">,</span>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center">
        <template v-if="field">
          <field :field="field"></field>
          <p class="pr-1">:</p>
        </template>
        [
        <button
          v-if="isOpen"
          class="
            ml-2
            flex
            rounded
            border border-gray-500
            text-gray-500
            h-3
            w-3
            items-center
            justify-center
            text-xs
          "
          @click="close"
        >
          <span>-</span>
        </button>
      </div>
      <div class="flex" v-for="(node, index) in array" :key="index">
        <v-node
          class="pl-5"
          :showEndComma="index + 1 != array.length"
          :node="node"
        ></v-node>
      </div>
      ]<span v-if="showEndComma">,</span>
    </template>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "VArray",
  props: {
    field: {
      type: [String],
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
  data() {
    return {
      isOpen: true,
    };
  },
  methods: {
    open() {
      this.isOpen = true;
      console.log("open");
    },
    close() {
      this.isOpen = false;
      console.log("close");
    },
  },
});
</script>
