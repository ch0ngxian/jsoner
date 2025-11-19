<template>
  <div
    class="h-screen w-screen flex justify-center flex-col sm:flex-row"
    style="color: #d4d4d4; font-size: 0.75rem; font-weight: 300"
    @mouseup="endDragging"
  >
    <div
      class="input-panel-wrapper h-2/5 sm:h-screen relative"
      :style="{
        'background-color': '#1e1e1e',
        width: screen.width > 640 ? `${dividerPosition}%` : '100%'
      }"
    >
      <textarea
        ref="inputTextarea"
        class="h-full w-full p-7 resize-none focus:outline-none overflow-y-scroll"
        style="background-color: transparent; position: relative; z-index: 1;"
        v-model="input"
        @scroll="handleTextareaScroll"
      ></textarea>
      <error-underline
        :errors="parseResult.errors"
        :inputText="input"
        :scrollTop="textareaScrollTop"
        style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 2; pointer-events: none;"
      ></error-underline>
    </div>
    <div
      class="divider-outside flex justify-center"
      :style="{
        left: `${dividerPosition}%`
      }"
      @mousedown="startDragging"
      @mouseenter="isDividerHover = true"
      @mouseleave="isDividerHover = false"
    >
      <div
        class="divider-inside"
        :style="{
          'background-color': isDividerHover ? 'transparent' : '#444444'
        }"
      ></div>
    </div>

    <div
      class="w-full sm:h-screen p-7 overflow-y-scroll flex-grow break-words"
      :style="{
        width: screen.width > 640 ? `${100 - dividerPosition}%` : '100%'
      }"
    >
      <error-display :errors="parseResult.errors" :fixesApplied="parseResult.fixesApplied"></error-display>
      <v-node :node="parseResult.data" :showEndComma="false"></v-node>
    </div>

    <coffee class="fixed bottom-0 right-0" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Coffee from "./Coffee.vue";
import VNode from "./nodes/VNode.vue";
import ErrorDisplay from "./ErrorDisplay.vue";
import ErrorUnderline from "./ErrorUnderline.vue";
import { parsePartialJson, ParseResult } from "~/utils/partialJsonParser";

interface ComponentData {
  input: string;
  screen: {
    width: number;
    height: number;
  };
  parseResult: ParseResult;
  dividerPosition: number;
  isDividerHover: boolean;
  textareaScrollTop: number;
}

export default defineComponent({
  components: {
    VNode,
    Coffee,
    ErrorDisplay,
    ErrorUnderline
  },
  data(): ComponentData {
    return {
      input:
        '{"str":"a", "obj":{"a": "1"}, "arr":[1,2,4], "bool": true, "empty": null}',
      screen: {
        width: 0,
        height: 0
      },
      parseResult: {
        data: {},
        errors: [],
        isValid: true,
        fixesApplied: []
      },
      dividerPosition: 50,
      isDividerHover: false,
      textareaScrollTop: 0
    };
  },
  computed: {
    isValidJson(): boolean {
      return this.parseResult.isValid;
    }
  },
  watch: {
    input(data: string) {
      this.parseResult = parsePartialJson(data);
    }
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
    onResize() {
      this.screen.height = window.innerHeight;
      this.screen.width = window.innerWidth;
    },
    handleTextareaScroll(event: Event) {
      const target = event.target as HTMLTextAreaElement;
      this.textareaScrollTop = -target.scrollTop;
    }
  },
  created() {
    this.parseResult = parsePartialJson(this.input);
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
});
</script>

<style>
.input-panel-wrapper {
  position: relative;
  overflow: hidden;
}

.divider-outside {
  background-color: transparent;
  cursor: ew-resize;
  @apply w-screen sm:w-2 h-2 sm:h-screen sm:absolute transition-bg hover:bg-blue-600;
}

.divider-inside {
  @apply w-screen sm:w-0.5 h-0.5 sm:h-screen;
}
</style>
