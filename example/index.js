import Vue from 'vue'
import templateComp from '@shared-components-vue2'

/*
import templateComp from '../dist/vue2-component-library.js'
import '../dist/vue2-component-library.css'
*/

import Index from './index.vue'

Vue.use(templateComp)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(Index),
})
