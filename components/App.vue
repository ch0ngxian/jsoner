<template>
  <div class="h-screen w-screen flex justify-center text-sm">
    <textarea
      class="w-full h-screen p-7 resize-none"
      v-model="input"
    ></textarea>
    <div class="border h-screen"></div>
    <div v-if="isValidJson" class="w-full h-screen p-7">
      <v-node :node="nodes" :showEndComma="false"></v-node>
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
      nodes: {},
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
        this.nodes = JSON.parse(data);
      } catch {}
    },
  },
  created() {
    this.nodes = JSON.parse(this.input);
  },
});
</script>
