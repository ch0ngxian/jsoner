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
  height: 3px;
  pointer-events: auto;
  cursor: help;
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 2px,
    currentColor 2px,
    currentColor 4px
  );
  background-size: 6px 3px;
  background-repeat: repeat-x;
  background-position: bottom;
}

.error-type-syntax {
  color: #ef4444;
}

.error-type-incomplete {
  color: #f59e0b;
}

.error-type-invalid {
  color: #ef4444;
}

/* Wavy underline using SVG pattern */
.error-underline::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 3' enable-background='new 0 0 6 3' height='3' width='6'%3E%3Cg fill='%23ef4444'%3E%3Cpolygon points='5.5,0 2.5,3 1.1,3 4.1,0'/%3E%3Cpolygon points='4,0 6,2 6,2.6 5.4,3 0,3 2,1'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-size: 6px 3px;
}

.error-type-incomplete .error-underline::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 3' enable-background='new 0 0 6 3' height='3' width='6'%3E%3Cg fill='%23f59e0b'%3E%3Cpolygon points='5.5,0 2.5,3 1.1,3 4.1,0'/%3E%3Cpolygon points='4,0 6,2 6,2.6 5.4,3 0,3 2,1'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
