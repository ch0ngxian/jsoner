<template>
  <button
    @mouseover="isShow = true"
    @mouseleave="isShow = false"
    @click="buyMeCoffee"
  >
    <div
      class="
        rounded-lg
        border border-gray-600
        p-1.5
        m-3
        flex
        justify-end
        items-center
        transition-width transition-slowest
        ease
      "
      :class="{ 'w-52': isShow }"
    >
      <p v-if="isShow" class="mr-5">Buy me a coffee?</p>
      <img v-if="isShow" class="h-7 w-7" src="../assets/coffee_hover.png" />
      <img v-else class="h-7 w-7" src="../assets/coffee.png" />
    </div>
  </button>
</template>


<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "Coffee",
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    buyMeCoffee() {
      window.open("https://www.buymeacoffee.com/chongxian", "_blank");
    },
  },
});
</script>
