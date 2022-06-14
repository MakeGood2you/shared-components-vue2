<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.


export default Vue.extend({
  name: 'ServeDev',
  data: () => ({

    // schema:{
    //   "coordinates": {
    //     "lat": {
    //       "_path": ".lat"
    //     },
    //     "long": {
    //       "_path": ".long"
    //     }
    //   },
    //   "name": {
    //     "_path": ".name"
    //   },
    //   "address": {
    //     "country": {
    //       "_path": ".country"
    //     },
    //     "country_code": {
    //       "_path": ".country_code"
    //     },
    //     "street": {
    //       "_path": ".street"
    //     },
    //     "street2": {
    //       "_path": ".street2"
    //     },
    //     "city": {
    //       "_path": ".city"
    //     },
    //     "state": {
    //       "_path": ".state"
    //     },
    //     "zip_code": {
    //       "_path": ".zip_code"
    //     },
    //     "phone_number": {
    //       "_path": ".phone_number"
    //     }
    //   }
    // },

    // "schema": {
    //   "coordinates": {
    //     "lat": {
    //       "_path": ".lat",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "lat",
    //       "_absPath": "lat"
    //     },
    //     "long": {
    //       "_path": ".long",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "long",
    //       "_absPath": "long"
    //     },
    //     "_type": "Object"
    //   },
    //   "name": {
    //     "_path": ".name",
    //     "_type": "Leaf",
    //     "_pathLevelUp": 1,
    //     "_relPath": "name",
    //     "_absPath": "name"
    //   },
    //   "address": {
    //     "country": {
    //       "_path": ".country",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "country",
    //       "_absPath": "country"
    //     },
    //     "country_code": {
    //       "_path": ".country_code",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "country_code",
    //       "_absPath": "country_code"
    //     },
    //     "street": {
    //       "_path": ".street",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "street",
    //       "_absPath": "street"
    //     },
    //     "street2": {
    //       "_path": ".street2",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "street2",
    //       "_absPath": "street2"
    //     },
    //     "city": {
    //       "_path": ".city",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "city",
    //       "_absPath": "city"
    //     },
    //     "state": {
    //       "_path": ".state",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "state",
    //       "_absPath": "state"
    //     },
    //     "zip_code": {
    //       "_path": ".zip_code",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "zip_code",
    //       "_absPath": "zip_code"
    //     },
    //     "phone_number": {
    //       "_path": ".phone_number",
    //       "_type": "Leaf",
    //       "_pathLevelUp": 1,
    //       "_relPath": "phone_number",
    //       "_absPath": "phone_number"
    //     },
    //     "_type": "Object"
    //   },
    //   "_type": "Object"
    // },
    // "outputJson": {
    //   "coordinates": {
    //     "lat": "52.65465",
    //     "long": "51.54455"
    //   },
    //   "name": "test1",
    //   "address": {
    //     "country": "London",
    //     "country_code": "GB",
    //     "street": "107/109 High Street",
    //     "street2": "",
    //     "city": "london",
    //     "state": "GB",
    //     "zip_code": "AB43GI",
    //     "phone_number": "566523584"
    //   }
    // },
    // inputJson:
        // [
      // {
      //   "name": "test1",
      //   "lat": "52.65465",
      //   "long": "51.54455",
      //   "country": "London",
      //   "country_code": "GB",
      //   "street": "107/109 High Street",
      //   "street2": "",
      //   "city": "london",
      //   "state": "GB",
      //   "zip_code": "AB43GI",
      //   "phone_number": "566523584"
      // },
      // {
      //   "name": "test2",
      //   "lat": "54.7656",
      //   "long": "54.65477",
      //   "country": "Tel aviv",
      //   "country_code": "IL",
      //   "street": "190/200 High Street",
      //   "street2": "hehe",
      //   "city": "haifa",
      //   "state": "IL",
      //   "zip_code": "BB76GI",
      //   "phone_number": "562123598"
      // }
    // ]
    // inputJson: {
    //   order_no: 'ORD487',
    //   creation_date: '2022-02-27',
    //   currency: '$',
    //   product_items: [
    //     {
    //       product_id: 123123,
    //       item_id: 231231,
    //       quantity: 25,
    //       c_otailoAttribtues: {
    //         price: {
    //           sales: {
    //             value: 49.9,
    //           },
    //           list: {
    //             value: 99.9,
    //           },
    //         },
    //         variationAttributes: [
    //           {
    //             id: 'size',
    //             values: [
    //               {
    //                 selected: true,
    //                 displayValue: 'small',
    //               }, {
    //                 selected: false,
    //                 displayValue: 'medium',
    //               }, {
    //                 selected: false,
    //                 displayValue: 'large',
    //               },
    //             ],
    //           }, {
    //             id: 'color',
    //             values: [
    //               {
    //                 selected: true,
    //                 displayValue: 'red',
    //               }, {
    //                 selected: false,
    //                 displayValue: 'blue',
    //               }, {
    //                 selected: false,
    //                 displayValue: 'yellow',
    //               },
    //             ],
    //           },
    //         ],
    //         images: {
    //           small: [{ url: 'https://imageUrlSmall.png' }],
    //         },
    //       },
    //       product_name: 'Air max',
    //       c_otailoTrackingID: 'KLHKJ213L1JJ2K',
    //       c_otailoTrackingURL: 'https://www.makegood.co.il',
    //       c_otailoReturnReason: 'do now match to my legs',
    //       c_otailoReturnType: 'Object',
    //       c_otailoStatus: 'pending',
    //     }, {
    //       product_id: 123123,
    //       item_id: 231231,
    //       quantity: 25,
    //       c_otailoAttribtues: {
    //         price: {
    //           sales: {
    //             value: 49.9,
    //           },
    //           list: {
    //             value: 99.9,
    //           },
    //         },
    //         variationAttributes: [
    //           {
    //             id: 'size',
    //             values: [
    //               {
    //                 selected: true,
    //                 displayValue: 'small',
    //               }, {
    //                 selected: false,
    //                 displayValue: 'medium',
    //               }, {
    //                 selected: false,
    //                 displayValue: 'large',
    //               },
    //             ],
    //           }, {
    //             id: 'color',
    //             values: [
    //               {
    //                 selected: true,
    //                 displayValue: 'red',
    //               }, {
    //                 selected: false,
    //                 displayValue: 'blue',
    //               }, {
    //                 selected: false,
    //                 displayValue: 'yellow',
    //               },
    //             ],
    //           },
    //         ],
    //         images: {
    //           small: [{ url: 'https://imageUrlSmall.png' }],
    //         },
    //       },
    //       product_name: 'Air max',
    //       c_otailoTrackingID: 'KLHKJ213L1JJ2K',
    //       c_otailoTrackingURL: 'https://www.makegood.co.il',
    //       c_otailoReturnReason: 'do now match to my legs',
    //       c_otailoReturnType: 'Object',
    //       c_otailoStatus: 'pending',
    //     },
    //   ],
    // },
    // schema: {"coordinates":{"lat":{"_path":".lat"},"long":{"_path":".long"}},"name":{"_path":".name"},"address":{"country":{"_path":".country"},"country_code":{"_path":".country_code"},"street":{"_path":".street"},"street2":{"_path":".street2"},"city":{"_path":".city"},"state":{"_path":".state"},"zip_code":{"_path":".zip_code"},"phone_number":{"_path":".phone_number"}}}
    // schema: {
    //   '_type': 'Object',
    //   '_path': 'data',
    //   'order':
    //       {
    //         'id':
    //             {
    //               '_path': '.order_no',
    //               '_default': '',
    //             },
    //         'order_id':
    //             {
    //               '_path': '.order_no',
    //               '_default': '',
    //             },
    //         'created_at':
    //             {
    //               '_path': '.creation_date',
    //               '_default': '',
    //             },
    //         'shipped_at':
    //             {
    //               '_path': '.creation_date',
    //               '_default': '',
    //             },
    //         'return_due_at':
    //             {
    //               '_path': '.creation_date',
    //               '_default': '',
    //             },
    //         'currency':
    //             {
    //               '_path': '.currency',
    //               '_default': '',
    //             },
    //         'basestore':
    //             {
    //               '_default': 'Returnello',
    //             },
    //         'channel':
    //             {
    //               '_default': 'WEB',
    //             },
    //         'order_items':
    //             {
    //               '_type': 'Array',
    //               '_path': '.product_items',
    //               '_element':
    //                   {
    //                     '_type': 'Object',
    //                     'sku':
    //                         {
    //                           '_path': '.product_id',
    //                         },
    //                     'item_id':
    //                         {
    //                           '_path': '.item_id',
    //                         },
    //                     'id':
    //                         {
    //                           '_path': '.product_id',
    //                         },
    //                     'quantity':
    //                         {
    //                           '_path': '.quantity',
    //                         },
    //                     'full_price':
    //                         {
    //                           '_path': '.c_otailoAttribtues.price',
    //                           '_transformerCode': 'return data.list ? data.list.value : data.sales.value',
    //                         },
    //                     'sold_price':
    //                         {
    //                           '_path': '.c_otailoAttribtues.price.sales.value',
    //                         },
    //                     'image_url':
    //                         {
    //                           '_path': '.c_otailoAttribtues.images.small[0].url',
    //                           '_default': '',
    //                           '_transformerCode': 'return \'https://zyct-001.sandbox.us01.dx.commercecloud.salesforce.com\' + data',
    //                         },
    //                     'name':
    //                         {
    //                           '_path': '.product_name',
    //                         },
    //                     'description':
    //                         {
    //                           '_path': '.product_name',
    //                         },
    //                     'created_at':
    //                         {
    //                           '_path': 'data.creation_date',
    //                           '_default': '',
    //                         },
    //                     'shipped_at':
    //                         {
    //                           '_path': 'data.creation_date',
    //                           '_default': '',
    //                         },
    //                     'return_due_at':
    //                         {
    //                           '_path': 'data.creation_date',
    //                           '_default': '',
    //                           '_transformerCode': 'var date = new Date(data); return new Date(date.setMonth(date.getMonth() + 1)).toISOString();',
    //                         },
    //                     'is_returnable':
    //                         {
    //                           '_default': true,
    //                         },
    //                     'color':
    //                         {
    //                           '_path': '.c_otailoAttribtues.variationAttributes',
    //                           '_transformerCode': 'var color = \'\';if(data){for(var i=0;i<data.length;i++){var variation = data[i];if(variation.id == \'color\') {for(var j =0; j < variation.values.length; j++) {var variationValue = variation.values[j];if(variationValue.selected) color = variationValue.displayValue;}}}}return color;',
    //                         },
    //                     'size':
    //                         {
    //                           '_path': '.c_otailoAttribtues.variationAttributes',
    //                           '_transformerCode': 'var size = \'\';if(data){for(var i=0;i<data.length;i++){var variation = data[i];if(variation.id == \'size\') {for(var j =0; j < variation.values.length; j++) {var variationValue = variation.values[j];if(variationValue.selected) size = variationValue.displayValue;}}}}return size;',
    //                         },
    //                     'returns_info':
    //                         {
    //                           'c_otailoTrackingID':
    //                               {
    //                                 '_path': '.c_otailoTrackingID',
    //                               },
    //                           'c_otailoTrackingURL':
    //                               {
    //                                 '_path': '.c_otailoTrackingURL',
    //                               },
    //                           'c_otailoReturnReason':
    //                               {
    //                                 '_path': '.c_otailoReturnReason',
    //                               },
    //                           'c_otailoReturnType':
    //                               {
    //                                 '_path': '.c_otailoReturnType',
    //                               },
    //                           'c_otailoStatus':
    //                               {
    //                                 '_path': '.c_otailoStatus',
    //                               },
    //                         },
    //                   },
    //             },
    //         // '_copyAll' : true,
    //       },
    // }

  }),
  components: {
   // BaseUploadFile,
  }
});
</script>

<template>
  <div id="app">
<!--    <BaseUploadFile/>-->
<!--    <DataMapping :objectMapperSchema="schema" :inputJson="inputJson" :outputJson="outputJson"/>-->
<!--        <shared-components-vue2-sample />-->
  </div>
</template>
