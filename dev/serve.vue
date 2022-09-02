<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
import { JsonEditorTest } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev',
  data: () => ({}),
  components: {
    JsonEditorTest,
  },

});
</script>

<template>
  <div id="app">
    <JsonEditorTest/>
  </div>
</template>
