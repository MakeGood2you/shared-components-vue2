<template>
  <div
      @load="isLoaded"
      class="dataMapper"
  >
    <JsonEditor
        v-if="isLoaded"
        @updateJsonInput="setJsonData"
        :inputJson="copy_input_json"
    />
  </div>
</template>

<script>
// Uncomment import and local "components" registration if library is not registered globally.
import JsonEditor from '../../src/lib-components/JsonEditor/JsonEditor';


export default {
  name: "JsonEditor.test",
  components: { JsonEditor },

  data: () => ({
    inputJson:[ {
      order_no: "ORD487",
      // creation_date: "2022-02-27",
      // currency: '$',
      product_items: [{
        // "product_id": 123123,
        // "item_id": 231231,
        "quantity": 25,
        "c_otailoAttribtues": {
          a: 'sasasas',
        }
      }],
    }],
    inputJson2: {

      order_no: "ORD487",
      creation_date: "2022-02-27",
      currency: '$',
      product_items:'',
      testObject:''
    },
   

    copy_input_json: null,
  }),
  methods: {
    isLoaded: () => true,

    setJsonData(data) {
      if (data && data.input) {
        this.copy_input_json = structuredClone(data.input)
      }
    },
  },
  created() {
    this.setJsonData({ input: this.inputJson })
  }
}

</script>

<style lang="scss">
@import "~@OtailO-recommerce/rappid/rappid.css";

.canvas {
  width: 100vw !important;
  height: 100vh !important;

  .joint-paper {
    border: none !important;
  }
}

.dataMapper {

  .actions {
    position: fixed;
    top: 5%;
    right: 2.5%;
  }

  .q-icon {
    cursor: pointer;
    transition: all .1s;
    border-radius: 50%;
    padding: 10px;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      transform: scale(1.1);
    }
  }

  .arrows {
    position: fixed;
    bottom: 5%;
    left: 2.5%;

    .layer {
      padding: 10px;
    }
  }

  .errorTitle {
    color: red;
  }
}
</style>
