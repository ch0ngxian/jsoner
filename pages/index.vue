<template>
  <App />
</template>

<script lang="ts">
import Vue from "vue";

/** gallery */
import VNode from "../components/nodes/VNode.vue";
import VObject from "../components/nodes/VObject.vue";
import VArray from "../components/nodes/VArray.vue";
import VString from "../components/nodes/VString.vue";
import VNumber from "../components/nodes/VNumber.vue";
import VNull from "../components/nodes/VNull.vue";
import VBoolean from "../components/nodes/VBoolean.vue";
import Field from "../components/nodes/Field.vue";
import OpenButton from "../components/nodes/OpenButton.vue";
import CloseButton from "../components/nodes/CloseButton.vue";

const components = {
  VNode,
  VObject,
  VArray,
  VString,
  VNumber,
  VNull,
  VBoolean,
  Field,
  OpenButton,
  CloseButton,
};

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component);
});

export default Vue.extend({});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #1e1e1e;
  @apply font-mono;
}
</style>
