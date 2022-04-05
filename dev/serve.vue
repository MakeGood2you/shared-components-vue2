<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
import { SharedComponentsVue2Sample } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev',
  // components: {
  //  SharedComponentsVue2Sample,
  // }
});
</script>

<template>
  <div id="app">
    <shared-components-vue2-sample />
  </div>
</template>
