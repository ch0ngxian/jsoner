<template>
  <div
    class="h-screen w-screen flex justify-center"
    style="color: #d4d4d4; font-size: 0.75rem; font-weight: 300"
    @mouseup="endDragging"
  >
    <textarea
      class="h-screen p-7 resize-none focus:outline-none overflow-y-scroll"
      :style="{
        'background-color': '#1e1e1e',
        width: `${dividerPosition}%`,
      }"
      v-model="input"
    ></textarea>
    <div
      class="divider-outside flex justify-center"
      :style="{
        left: `${dividerPosition}%`,
      }"
      @mousedown="startDragging"
      @mouseenter="isDividerHover = true"
      @mouseleave="isDividerHover = false"
    >
      <div
        class="divider-inside"
        :style="{
          'background-color': isDividerHover ? 'transparent' : '#444444',
        }"
      ></div>
    </div>

    <div
      class="w-full h-screen p-7 overflow-y-scroll flex-grow break-words"
      :style="{
        width: `${100 - dividerPosition}%`,
      }"
    >
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
      dividerPosition: 50,
      isDividerHover: false,
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
  methods: {
    handleDragging(event: Event) {
      const clientX = (<DragEvent>event).clientX;
      const percentage = (clientX / window.outerWidth) * 100;

      if (percentage >= 30 && percentage <= 70) {
        this.dividerPosition = percentage;
      }
    },
    startDragging() {
      document.addEventListener("mousemove", this.handleDragging);
    },
    endDragging() {
      document.removeEventListener("mousemove", this.handleDragging);
    },
  },
  created() {
    this.node = JSON.parse(this.input);
  },
});
</script>

<style>
.divider-outside {
  background-color: transparent;
  cursor: ew-resize;
  @apply w-2 h-screen absolute transition-bg hover:bg-blue-600;
}

.divider-inside {
  @apply w-0.5 h-screen;
}
</style>
