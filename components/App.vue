<template>
  <div
    class="h-screen w-screen flex justify-center text-sm"
    style="color: #d4d4d4"
  >
    <textarea
      class="
        w-full
        h-screen
        p-7
        resize-none
        focus:outline-none
        overflow-y-scroll
      "
      style="background-color: #1e1e1e; min-width: 40vw; max-width: 60vw"
      v-model="input"
    ></textarea>
    <div class="border h-screen" style="border-color: #444444"></div>
    <div class="w-full h-screen p-7 overflow-y-scroll flex-grow break-words">
      <v-node v-if="isValidJson" :node="node" :showEndComma="false"></v-node>
      <p v-else>
        {{ input }}
      </p>
    </div>

    <coffee class="fixed bottom-0 right-0" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Coffee from "./Coffee.vue";
import VNode from "./nodes/VNode.vue";

export default defineComponent({
  components: {
    VNode,
    Coffee,
  },
  data() {
    return {
      input:
        '{"str":"a", "obj":{"a": "1"}, "arr":[1,2,4], "bool": true, "empty": null}',
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
