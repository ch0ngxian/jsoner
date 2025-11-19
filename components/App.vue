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
      <!-- Format Support Indicator -->
      <div
        class="format-indicator"
        @mouseenter="showFormatTooltip = true"
        @mouseleave="showFormatTooltip = false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="info-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="format-text">Formats</span>

        <!-- Tooltip -->
        <div v-if="showFormatTooltip" class="format-tooltip">
          <div class="tooltip-title">Supported Formats:</div>
          <div class="tooltip-item">
            <span class="tooltip-bullet">•</span>
            <span>JSON</span>
          </div>
          <div class="tooltip-item">
            <span class="tooltip-bullet">•</span>
            <span>Ruby Hash (=>, :key)</span>
          </div>
        </div>
      </div>

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
      <v-node :node="parseResult.data" :showEndComma="false"></v-node>
    </div>

    <coffee class="fixed bottom-0 right-0" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Coffee from "./Coffee.vue";
import VNode from "./nodes/VNode.vue";
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
  showFormatTooltip: boolean;
}

export default defineComponent({
  components: {
    VNode,
    Coffee,
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
      textareaScrollTop: 0,
      showFormatTooltip: false
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

/* Format Indicator Styles */
.format-indicator {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: rgba(68, 68, 68, 0.8);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  pointer-events: auto;
}

.format-indicator:hover {
  background-color: rgba(68, 68, 68, 1);
  transform: translateY(-1px);
}

.info-icon {
  width: 14px;
  height: 14px;
  color: #81a1c1;
}

.format-text {
  font-size: 11px;
  color: #d4d4d4;
  font-weight: 400;
  letter-spacing: 0.3px;
}

/* Tooltip Styles */
.format-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  padding: 10px 12px;
  background-color: #2e3440;
  border: 1px solid #4c566a;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  z-index: 20;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-title {
  font-size: 11px;
  font-weight: 600;
  color: #88c0d0;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.tooltip-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #d8dee9;
  margin: 4px 0;
  line-height: 1.4;
}

.tooltip-bullet {
  color: #81a1c1;
  font-weight: bold;
}
</style>
