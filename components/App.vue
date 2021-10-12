<template>
  <div class="h-screen w-screen flex justify-center text-sm">
    <textarea
      class="w-full h-screen p-7 resize-none"
      v-model="input"
    ></textarea>
    <div class="border h-screen"></div>
    <pre class="w-full h-screen p-7">{{ result }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  data() {
    return {
      input: '{"a":"a"}',
    };
  },
  computed: {
    result() {
      return JSON.stringify(JSON.parse(this.input as string), null, 4);
    },
  },
});
</script>
