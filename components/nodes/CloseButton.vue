<template>
  <button
    class="
      ml-2
      flex
      rounded
      border border-gray-600
      text-gray-600
      h-3
      w-3
      items-center
      justify-center
      text-xs
    "
  >
    <span>-</span>
  </button>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "CloseButton",
});
</script>
