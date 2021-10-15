<template>
  <div>
    <template v-if="!isOpen">
      <div class="flex">
        <template v-if="field">
          <field :field="field"></field>
          <p class="pr-1">:</p>
        </template>
        {
        <open-button @click.native="open" />
        }
        <span v-if="showEndComma">,</span>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center">
        <template v-if="field">
          <field :field="field"></field>
          <p class="pr-1">:</p>
        </template>
        {
        <close-button v-if="isOpen" @click.native="close" />
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
    </template>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import CloseButton from "./CloseButton.vue";
import Field from "./Field.vue";

export default defineComponent({
  components: { Field, CloseButton },
  name: "VObject",
  props: {
    field: {
      type: [String],
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
