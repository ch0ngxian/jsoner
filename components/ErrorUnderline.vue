<template>
  <div class="error-overlay-container">
    <div
      ref="overlay"
      class="error-overlay"
      :style="{
        top: scrollTop + 'px'
      }"
    >
      <div
        v-for="(error, index) in errors"
        :key="index"
        class="error-underline"
        :class="`error-type-${error.type}`"
        :style="getUnderlineStyle(error)"
        :title="`Line ${error.line}, Col ${error.column}: ${error.message}`"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@nuxtjs/composition-api";
import { JsonError } from "~/utils/partialJsonParser";

interface UnderlineStyle {
  top: string;
  left: string;
  width: string;
}

export default defineComponent({
  props: {
    errors: {
      type: Array as PropType<JsonError[]>,
      required: true,
      default: () => []
    },
    inputText: {
      type: String,
      required: true,
      default: ""
    },
    scrollTop: {
      type: Number,
      required: false,
      default: 0
    }
  },
  methods: {
    getUnderlineStyle(error: JsonError): UnderlineStyle {
      // Calculate position based on line and column
      const lineHeight = 18; // Approximate line height in pixels
      const charWidth = 7.2; // Approximate character width for monospace font
      const paddingTop = 28; // Textarea padding-top
      const paddingLeft = 28; // Textarea padding-left

      // Calculate top position (line number - 1 because line numbers start at 1)
      const top = paddingTop + (error.line - 1) * lineHeight + lineHeight - 2;

      // Calculate left position
      const left = paddingLeft + (error.column - 1) * charWidth;

      // Calculate underline width (span about 10 characters or to end of line)
      const lines = this.inputText.split('\n');
      const currentLine = lines[error.line - 1] || '';
      const remainingChars = currentLine.length - error.column + 1;
      const underlineLength = Math.min(remainingChars, 20);
      const width = Math.max(underlineLength * charWidth, 10);

      return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`
      };
    }
  }
});
</script>

<style scoped>
.error-overlay-container {
  position: relative;
  pointer-events: none;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.error-underline {
  position: absolute;
  height: 6px;
  pointer-events: auto;
  cursor: help;
  background-repeat: repeat-x;
  background-position: left bottom;
  background-size: 6px 4px;
}

.error-type-syntax {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 4' width='6' height='4'%3E%3Cpath d='M 0,2 Q 1.5,0 3,2 T 6,2' stroke='%23ef4444' stroke-width='1.2' fill='none'/%3E%3C/svg%3E");
}

.error-type-incomplete {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 4' width='6' height='4'%3E%3Cpath d='M 0,2 Q 1.5,0 3,2 T 6,2' stroke='%23f59e0b' stroke-width='1.2' fill='none'/%3E%3C/svg%3E");
}

.error-type-invalid {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 4' width='6' height='4'%3E%3Cpath d='M 0,2 Q 1.5,0 3,2 T 6,2' stroke='%23ef4444' stroke-width='1.2' fill='none'/%3E%3C/svg%3E");
}
</style>
