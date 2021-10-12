<template>
  <div class="h-screen w-screen flex justify-center">
    <div class="w-full">
      <textarea class="" v-model="input"></textarea>
    </div>

    <div class="w-full">Result</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  data() {
    return {
      input: "{}",
    };
  },
  methods: {},
});
</script>
