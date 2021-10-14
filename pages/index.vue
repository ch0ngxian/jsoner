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
import Field from "../components/nodes/Field.vue";

const components = { VNode, VObject, VArray, VString, VNumber, Field };

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component);
});

export default Vue.extend({});
</script>
