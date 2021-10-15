<template>
  <div
    class="h-screen w-screen flex justify-center text-sm"
    style="color: #d4d4d4"
  >
    <textarea
      class="w-full h-screen p-7 resize-none focus:outline-none"
      style="background-color: #1e1e1e"
      v-model="input"
    ></textarea>
    <div class="border h-screen" style="border-color: #444444"></div>
    <div v-if="isValidJson" class="w-full h-screen p-7">
      <v-node :node="node" :showEndComma="false"></v-node>
    </div>
    <pre v-else class="w-full h-screen p-7">{{ input }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import VNode from "./nodes/VNode.vue";

export default defineComponent({
  components: {
    VNode,
  },
  data() {
    return {
      input: '{"str":"a", "obj":{"a": "1"}, "arr":[1,2,4]}',
      node: {},
    };
  },
  computed: {
    isValidJson() {
      try {
        JSON.parse(this.input as string);
        return true;
      } catch {}

      return false;
    },
  },
  watch: {
    input(data: string) {
      try {
        this.node = JSON.parse(data);
      } catch {}
    },
  },
  created() {
    this.node = JSON.parse(this.input);
  },
});
</script>
