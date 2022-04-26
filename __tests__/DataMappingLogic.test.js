import { objectMapperSchema2Shape, objectMapperSchemaShape2Schema } from '../src/dataMappingLogic/init'
import { ObjectMapper } from '../src/dataMappingLogic/ObjectMapperLogic'


test('shape to schema', () => {
    // const schemaShape = [[
    //     {
    //         "_type": "Object",
    //         "label": "data",
    //         "items": [
    //             {
    //                 "_type": "Object",
    //                 "label": "order",
    //                 "items": [
    //                     {
    //                         "label": "id",
    //                         "id": "data.order.id",
    //                         "_path": ".order_no",
    //                         "_default": "",
    //                         "_type": "Leaf",
    //
    //
    //                     },
    //                     {
    //                         "label": "order_id",
    //                         "id": "data.order.order_id",
    //                         "_path": ".order_no",
    //                         "_default": "",
    //                         "_type": "Leaf",
    //
    //
    //                     },
    //                     {
    //                         "label": "created_at",
    //                         "id": "data.order.created_at",
    //                         "_path": ".creation_date",
    //                         "_default": "",
    //                         "_type": "Leaf",
    //
    //
    //                     },
    //                     {
    //                         "label": "shipped_at",
    //                         "id": "data.order.shipped_at",
    //                         "_path": ".creation_date",
    //                         "_default": "",
    //                         "_type": "Leaf",
    //
    //
    //                     },
    //                     {
    //                         "label": "return_due_at",
    //                         "id": "data.order.return_due_at",
    //                         "_path": ".creation_date",
    //                         "_default": "",
    //                         "_type": "Leaf",
    //
    //
    //                     },
    //                     {
    //                         "label": "currency",
    //                         "id": "data.order.currency",
    //                         "_path": ".currency",
    //                         "_default": "",
    //                         "_type": "Leaf",
    //
    //
    //                     },
    //                     {
    //                         "label": "basestore",
    //                         "id": "data.order.basestore",
    //                         "_default": "Returnello",
    //                         "_type": "Leaf"
    //                     },
    //                     {
    //                         "label": "channel",
    //                         "id": "data.order.channel",
    //                         "_default": "WEB",
    //                         "_type": "Leaf"
    //                     },
    //                     {
    //                         "_type": "Array",
    //                         "icon": "./assets/images/text-box-outline.png",
    //                         "label": "order_items",
    //                         "items": [
    //                             {
    //                                 "label": "sku",
    //                                 "id": "data.order.order_items.[0].sku",
    //                                 "_path": ".product_id",
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "item_id",
    //                                 "id": "data.order.order_items.[0].item_id",
    //                                 "_path": ".item_id",
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "id",
    //                                 "id": "data.order.order_items.[0].id",
    //                                 "_path": ".product_id",
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "quantity",
    //                                 "id": "data.order.order_items.[0].quantity",
    //                                 "_path": ".quantity",
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "full_price",
    //                                 "id": "data.order.order_items.[0].full_price",
    //                                 "_path": ".c_otailoAttribtues.price",
    //
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "sold_price",
    //                                 "id": "data.order.order_items.[0].sold_price",
    //                                 "_path": ".c_otailoAttribtues.price.sales.value",
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "image_url",
    //                                 "id": "data.order.order_items.[0].image_url",
    //                                 "_path": ".c_otailoAttribtues.images.small[0].url",
    //                                 "_default": "",
    //
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "name",
    //                                 "id": "data.order.order_items.[0].name",
    //                                 "_path": ".product_name",
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "description",
    //                                 "id": "data.order.order_items.[0].description",
    //                                 "_path": ".product_name",
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "created_at",
    //                                 "id": "data.order.order_items.[0].created_at",
    //                                 "_path": "data.creation_date",
    //                                 "_default": "",
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "shipped_at",
    //                                 "id": "data.order.order_items.[0].shipped_at",
    //                                 "_path": "data.creation_date",
    //                                 "_default": "",
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "return_due_at",
    //                                 "id": "data.order.order_items.[0].return_due_at",
    //                                 "_path": "data.creation_date",
    //                                 "_default": "",
    //
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "is_returnable",
    //                                 "id": "data.order.order_items.[0].is_returnable",
    //                                 "_default": true,
    //                                 "_type": "Leaf"
    //                             },
    //                             {
    //                                 "label": "color",
    //                                 "id": "data.order.order_items.[0].color",
    //                                 "_path": ".c_otailoAttribtues.variationAttributes",
    //
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "label": "size",
    //                                 "id": "data.order.order_items.[0].size",
    //                                 "_path": ".c_otailoAttribtues.variationAttributes",
    //
    //                                 "_type": "Leaf",
    //
    //
    //                             },
    //                             {
    //                                 "_type": "Object",
    //                                 "label": "returns_info",
    //                                 "items": [
    //                                     {
    //                                         "label": "c_otailoTrackingID",
    //                                         "id": "data.order.order_items.[0].returns_info.c_otailoTrackingID",
    //                                         "_path": ".c_otailoTrackingID",
    //                                         "_type": "Leaf",
    //
    //
    //                                     },
    //                                     {
    //                                         "label": "c_otailoTrackingURL",
    //                                         "id": "data.order.order_items.[0].returns_info.c_otailoTrackingURL",
    //                                         "_path": ".c_otailoTrackingURL",
    //                                         "_type": "Leaf",
    //
    //
    //                                     },
    //                                     {
    //                                         "label": "c_otailoReturnReason",
    //                                         "id": "data.order.order_items.[0].returns_info.c_otailoReturnReason",
    //                                         "_path": ".c_otailoReturnReason",
    //                                         "_type": "Leaf",
    //
    //
    //                                     },
    //                                     {
    //                                         "label": "c_otailoReturnType",
    //                                         "id": "data.order.order_items.[0].returns_info.c_otailoReturnType",
    //                                         "_path": ".c_otailoReturnType",
    //                                         "_type": "Leaf",
    //
    //
    //                                     },
    //                                     {
    //                                         "label": "c_otailoStatus",
    //                                         "id": "data.order.order_items.[0].returns_info.c_otailoStatus",
    //                                         "_path": ".c_otailoStatus",
    //                                         "_type": "Leaf",
    //
    //
    //                                     }
    //                                 ],
    //                                 "id": "data.order.order_items.[0].returns_info"
    //                             }
    //                         ],
    //                         "id": "data.order.order_items"
    //                     }
    //                 ],
    //                 "id": "data.order"
    //             }
    //         ],
    //         "id": "data"
    //     }
    // ]]
    const schema = {
        "_type": "Object",
        "_path": "data",
        "order": {
            "id": {
                "_path": ".order_no",
                "_default": "",
                "_type": "Leaf",


            },
            "order_id": {
                "_path": ".order_no",
                "_default": "",
                "_type": "Leaf",


            },
            "created_at": {
                "_path": ".creation_date",
                "_default": "",
                "_type": "Leaf",


            },
            "shipped_at": {
                "_path": ".creation_date",
                "_default": "",
                "_type": "Leaf",


            },
            "return_due_at": {
                "_path": ".creation_date",
                "_default": "",
                "_type": "Leaf",


            },
            "currency": {
                "_path": ".currency",
                "_default": "",
                "_type": "Leaf",


            },
            "basestore": {
                "_default": "Returnello",
                "_type": "Leaf"
            },
            "channel": {
                "_default": "WEB",
                "_type": "Leaf"
            },
            "order_items": {
                "_type": "Array",
                "_path": ".product_items",
                "_element": {
                    "_type": "Object",
                    "sku": {
                        "_path": ".product_id",
                        "_type": "Leaf",


                    },
                    "item_id": {
                        "_path": ".item_id",
                        "_type": "Leaf",


                    },
                    "id": {
                        "_path": ".product_id",
                        "_type": "Leaf",


                    },
                    "quantity": {
                        "_path": ".quantity",
                        "_type": "Leaf",


                    },
                    "full_price": {
                        "_path": ".c_otailoAttribtues.price",
                        "_type": "Leaf",


                    },
                    "sold_price": {
                        "_path": ".c_otailoAttribtues.price.sales.value",
                        "_type": "Leaf",


                    },
                    "image_url": {
                        "_path": ".c_otailoAttribtues.images.small[0].url",
                        "_default": "",
                        "_type": "Leaf",


                    },
                    "name": {
                        "_path": ".product_name",
                        "_type": "Leaf",


                    },
                    "description": {
                        "_path": ".product_name",
                        "_type": "Leaf",


                    },
                    "created_at": {
                        "_path": "data.creation_date",
                        "_default": "",
                        "_type": "Leaf",


                    },
                    "shipped_at": {
                        "_path": "data.creation_date",
                        "_default": "",
                        "_type": "Leaf",


                    },
                    "return_due_at": {
                        "_path": "data.creation_date",
                        "_default": "",
                        "_type": "Leaf",


                    },
                    "is_returnable": {
                        "_default": true,
                        "_type": "Leaf"
                    },
                    "color": {
                        "_path": ".c_otailoAttribtues.variationAttributes",
                        "_type": "Leaf",


                    },
                    "size": {
                        "_path": ".c_otailoAttribtues.variationAttributes",
                        "_type": "Leaf",


                    },
                    "returns_info": {
                        "c_otailoTrackingID": {
                            "_path": ".c_otailoTrackingID",
                            "_type": "Leaf",


                        },
                        "c_otailoTrackingURL": {
                            "_path": ".c_otailoTrackingURL",
                            "_type": "Leaf",


                        },
                        "c_otailoReturnReason": {
                            "_path": ".c_otailoReturnReason",
                            "_type": "Leaf",


                        },
                        "c_otailoReturnType": {
                            "_path": ".c_otailoReturnType",
                            "_type": "Leaf",


                        },
                        "c_otailoStatus": {
                            "_path": ".c_otailoStatus",
                            "_type": "Leaf",


                        },
                        "_type": "Object"
                    }
                },


            },
            "_type": "Object"
        },


    }
    const schema2 = {
        "_type": "Object",
        "_path": "data",
        "order": {
            "id": {
                "_path": ".order_no",
                "_default": "",
                "_type": "Leaf",


            },
            "order_id": {
                "_path": ".order_no",
                "_default": "",
                "_type": "Leaf",
            },
            "created_at": {
                "_path": ".creation_date",
                "_default": "",
                "_type": "Leaf",
            },
            "shipped_at": {
                "_path": ".creation_date",
                "_default": "",
                "_type": "Leaf",


            },
            "return_due_at": {
                "_path": ".creation_date",
                "_default": "",
                "_type": "Leaf",


            },
            "currency": {
                "_path": ".currency",
                "_default": "",
                "_type": "Leaf",


            },
            "basestore": {
                "_default": "Returnello",
                "_type": "Leaf"
            },
            "channel": {
                "_default": "WEB",
                "_type": "Leaf"
            },
            "order_items": {
                "_type": "Array",
                "_path": ".product_items",
                "_element": {
                    "_type": "Object",
                    "sku": {
                        "_path": ".product_id",
                        "_type": "Leaf",


                    },
                    "item_id": {
                        "_path": ".item_id",
                        "_type": "Leaf",


                    },
                    "id": {
                        "_path": ".product_id",
                        "_type": "Leaf",


                    },
                    "quantity": {
                        "_path": ".quantity",
                        "_type": "Leaf",


                    },
                    "full_price": {
                        "_path": ".c_otailoAttribtues.price",
                        "_type": "Leaf",


                    },
                    "sold_price": {
                        "_path": ".c_otailoAttribtues.price.sales.value",
                        "_type": "Leaf",


                    },
                    "image_url": {
                        "_path": ".c_otailoAttribtues.images.small[0].url",
                        "_default": "",
                        "_type": "Leaf",


                    },
                    "name": {
                        "_path": ".product_name",
                        "_type": "Leaf",


                    },
                    "description": {
                        "_path": ".product_name",
                        "_type": "Leaf",


                    },
                    "created_at": {
                        "_path": "data.creation_date",
                        "_default": "",
                        "_type": "Leaf",


                    },
                    "shipped_at": {
                        "_path": "data.creation_date",
                        "_default": "",
                        "_type": "Leaf",


                    },
                    "return_due_at": {
                        "_path": "data.creation_date",
                        "_default": "",
                        "_type": "Leaf",


                    },
                    "is_returnable": {
                        "_default": true,
                        "_type": "Leaf"
                    },
                    "color": {
                        "_path": ".c_otailoAttribtues.variationAttributes",
                        "_type": "Leaf",


                    },
                    "size": {
                        "_path": ".c_otailoAttribtues.variationAttributes",
                        "_type": "Leaf",


                    },
                    "returns_info": {
                        "c_otailoTrackingID": {
                            "_path": ".c_otailoTrackingID",
                            "_type": "Leaf",


                        },
                        "c_otailoTrackingURL": {
                            "_path": ".c_otailoTrackingURL",
                            "_type": "Leaf",


                        },
                        "c_otailoReturnReason": {
                            "_path": ".c_otailoReturnReason",
                            "_type": "Leaf",


                        },
                        "c_otailoReturnType": {
                            "_path": ".c_otailoReturnType",
                            "_type": "Leaf",


                        },
                        "c_otailoStatus": {
                            "_path": ".c_otailoStatus",
                            "_type": "Leaf",


                        },
                        "_type": "Object"
                    }
                },


            },
            "_type": "Object"
        },


    }
    const inputJson = {
        order_no: 'ORD487',
        creation_date: '2022-02-27',
        currency: '$',
        product_items: [
            {
                product_id: 123123,
                item_id: 231231,
                quantity: 25,
                c_otailoAttribtues: {
                    price: {
                        sales: {
                            value: 49.9,
                        },
                        list: {
                            value: 99.9,
                        },
                    },
                    variationAttributes: [
                        {
                            id: 'size',
                            values: [
                                {
                                    selected: true,
                                    displayValue: 'small',
                                }, {
                                    selected: false,
                                    displayValue: 'medium',
                                }, {
                                    selected: false,
                                    displayValue: 'large',
                                },
                            ],
                        }, {
                            id: 'color',
                            values: [
                                {
                                    selected: true,
                                    displayValue: 'red',
                                }, {
                                    selected: false,
                                    displayValue: 'blue',
                                }, {
                                    selected: false,
                                    displayValue: 'yellow',
                                },
                            ],
                        },
                    ],
                    images: {
                        small: [{ url: 'https://imageUrlSmall.png' }],
                    },
                },
                product_name: 'Air max',
                c_otailoTrackingID: 'KLHKJ213L1JJ2K',
                c_otailoTrackingURL: 'https://www.makegood.co.il',
                c_otailoReturnReason: 'do now match to my legs',
                c_otailoReturnType: 'Object',
                c_otailoStatus: 'pending',
            }, {
                product_id: 123123,
                item_id: 231231,
                quantity: 25,
                c_otailoAttribtues: {
                    price: {
                        sales: {
                            value: 49.9,
                        },
                        list: {
                            value: 99.9,
                        },
                    },
                    variationAttributes: [
                        {
                            id: 'size',
                            values: [
                                {
                                    selected: true,
                                    displayValue: 'small',
                                }, {
                                    selected: false,
                                    displayValue: 'medium',
                                }, {
                                    selected: false,
                                    displayValue: 'large',
                                },
                            ],
                        }, {
                            id: 'color',
                            values: [
                                {
                                    selected: true,
                                    displayValue: 'red',
                                }, {
                                    selected: false,
                                    displayValue: 'blue',
                                }, {
                                    selected: false,
                                    displayValue: 'yellow',
                                },
                            ],
                        },
                    ],
                    images: {
                        small: [{ url: 'https://imageUrlSmall.png' }],
                    },
                },
                product_name: 'Air max',
                c_otailoTrackingID: 'KLHKJ213L1JJ2K',
                c_otailoTrackingURL: 'https://www.makegood.co.il',
                c_otailoReturnReason: 'do now match to my legs',
                c_otailoReturnType: 'Object',
                c_otailoStatus: 'pending',
            },
        ],
    }

    const objectMapperTransformer = new ObjectMapper(schema)
    objectMapperTransformer.compile()

    const objectMapperShape = objectMapperSchema2Shape(objectMapperTransformer.schema)
    const result = objectMapperSchemaShape2Schema(objectMapperShape)

    console.log(result)
    expect(schema2).toEqual(result.data);
})