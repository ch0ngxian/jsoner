<template>
  <button class="mx-1 px-1 hover:bg-gray-700 rounded">
    <div v-if="count != null" class="px-1 rounded" style="color: #d98e73">
      {{ count }}
    </div>
    <p v-else>...</p>
  </button>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "OpenButton",
  props: {
    count: {
      type: [Number],
    },
  },
});
</script>
