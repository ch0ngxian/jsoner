<template>
  <p style="color: #88deff">"{{ field }}"</p>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "Field",
  props: {
    field: {
      type: [String],
      required: true,
    },
  },
});
</script>
