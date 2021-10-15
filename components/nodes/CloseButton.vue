<template>
  <button
    class="
      ml-2
      flex
      rounded
      border border-gray-600
      text-gray-600
      h-4
      w-4
      items-center
      justify-center
      text-xs
      hover:bg-gray-700
      hover:border-gray-400
      hover:text-gray-400
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
