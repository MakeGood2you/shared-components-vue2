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
    inputJson: {

        order_no: "ORD487",
        creation_date: "2022-02-27",
        currency: { },
        product_items: [{
            "product_id": 123123,
            "item_id": 231231,
            "quantity": 25,
            "c_otailoAttribtues": {
              "price": {
                "sales": {
                  "value": 49.9
                },
                "list": {
                  "value": 99.9
                }
              },
              "variationAttributes": [
                {
                  "id": "size",
                  "values": [
                    {
                      "selected": true,
                      "displayValue": "small"
                    },
                    {
                      "selected": false,
                      "displayValue": "medium"
                    },
                    {
                      "selected": false,
                      "displayValue": "large"
                    }
                  ]
                },
                {
                  "id": "color",
                  "values": [
                    {
                      "selected": true,
                      "displayValue": "red"
                    },
                    {
                      "selected": false,
                      "displayValue": "blue"
                    },
                    {
                      "selected": false,
                      "displayValue": "yellow"
                    }
                  ]
                }
              ],
              "images": {
                "small": [
                  {
                    "url": "https://imageUrlSmall.png"
                  }
                ]
              }
            },
            "product_name": "Air max",
            "c_otailoTrackingID": "KLHKJ213L1JJ2K",
            "c_otailoTrackingURL": "https://www.makegood.co.il",
            "c_otailoReturnReason": "do now match to my legs",
            "c_otailoReturnType": "Object",
            "c_otailoStatus": "pending"
          }],
        testObject:{
          "product_id": 123123,
          "item_id": 231231,
          "quantity": 25,
          "c_otailoAttribtues": {
            "price": {
              "sales": {
                "value": 49.9
              },
              "list": {
                "value": 99.9
              }
            },
            "variationAttributes": [
              {
                "id": "size",
                "values": [
                  {
                    "selected": true,
                    "displayValue": "small"
                  },
                  {
                    "selected": false,
                    "displayValue": "medium"
                  },
                  {
                    "selected": false,
                    "displayValue": "large"
                  }
                ]
              },
              {
                "id": "color",
                "values": [
                  {
                    "selected": true,
                    "displayValue": "red"
                  },
                  {
                    "selected": false,
                    "displayValue": "blue"
                  },
                  {
                    "selected": false,
                    "displayValue": "yellow"
                  }
                ]
              }
            ],
            "images": {
              "small": [
                {
                  "url": "https://imageUrlSmall.png"
                }
              ]
            }
          },
          "product_name": "Air max",
          "c_otailoTrackingID": "KLHKJ213L1JJ2K",
          "c_otailoTrackingURL": "https://www.makegood.co.il",
          "c_otailoReturnReason": "do now match to my legs",
          "c_otailoReturnType": "Object",
          "c_otailoStatus": "pending"
        },
      },

    copy_input_json: null,
  }),
  methods: {
    isLoaded:() => true,

    setJsonData(data) {
      if (data && data.input) {
        this.copy_input_json = structuredClone(data.input)
      }
    },
  },
  created() {
    this.setJsonData({input : this.inputJson})
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
