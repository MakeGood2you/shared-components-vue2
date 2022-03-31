import { objectMapper } from './ObjectMapperLogic';
const outputTransformer = {
    "_type": "Object",
    "_path": "data",
    "order": {
        "id": {
            "_path": ".order_no",
            "_default": "",
        },
        "order_id": {
            "_path": ".order_no",
            "_default": "",
        },
        "created_at": {
            "_path": ".creation_date",
            "_default": "",
        },
        "shipped_at": {
            "_path": ".creation_date",
            "_default": "",
        },
        "return_due_at": {
            "_path": ".creation_date",
            "_default": "",
        },
        "currency": {
            "_path": ".currency",
            "_default": "",
        },
        "basestore": {
            "_default": "Returnello",
        },
        "channel": {
            "_default": "WEB",
        },
        "order_items": {
            "_type": "Array",
            "_path": ".product_items",
            "_element": {
                "_type": "Object",
                "sku": {
                    "_path": ".product_id",
                },
                "item_id": {
                    "_path": ".item_id",
                },
                "id": {
                    "_path": ".product_id",
                },
                "quantity": {
                    "_path": ".quantity",
                },
                "full_price": {
                    "_path": ".c_otailoAttribtues.price",
                    "_transformerCode": "return data.list ? data.list.value : data.sales.value",
                },
                "sold_price": {
                    "_path": ".c_otailoAttribtues.price.sales.value",
                },
                "image_url": {
                    "_path": ".c_otailoAttribtues.images.small[0].url",
                    "_default": "",
                    "_transformerCode": "return 'https://zyct-001.sandbox.us01.dx.commercecloud.salesforce.com' + data",
                },
                "name": {
                    "_path": ".product_name",
                },
                "description": {
                    "_path": ".product_name",
                },
                "created_at": {
                    "_path": "data.creation_date",
                    "_default": "",
                },
                "shipped_at": {
                    "_path": "data.creation_date",
                    "_default": "",
                },
                "return_due_at": {
                    "_path": "data.creation_date",
                    "_default": "",
                    "_transformerCode": "var date = new Date(data); return new Date(date.setMonth(date.getMonth() + 1)).toISOString();",
                },
                "is_returnable": {
                    "_default": true,
                },
                "color": {
                    "_path": ".c_otailoAttribtues.variationAttributes",
                    "_transformerCode": "var color = '';if(data){for(var i=0;i<data.length;i++){var variation = data[i];if(variation.id == 'color') {for(var j =0; j < variation.values.length; j++) {var variationValue = variation.values[j];if(variationValue.selected) color = variationValue.displayValue;}}}}return color;",
                },
                "size": {
                    "_path": ".c_otailoAttribtues.variationAttributes",
                    "_transformerCode": "var size = '';if(data){for(var i=0;i<data.length;i++){var variation = data[i];if(variation.id == 'size') {for(var j =0; j < variation.values.length; j++) {var variationValue = variation.values[j];if(variationValue.selected) size = variationValue.displayValue;}}}}return size;",
                },
                "returns_info": {
                    "c_otailoTrackingID": {
                        "_path": ".c_otailoTrackingID",
                    },
                    "c_otailoTrackingURL": {
                        "_path": ".c_otailoTrackingURL",
                    },
                    "c_otailoReturnReason": {
                        "_path": ".c_otailoReturnReason",
                    },
                    "c_otailoReturnType": {
                        "_path": ".c_otailoReturnType",
                    },
                    "c_otailoStatus": {
                        "_path": ".c_otailoStatus",
                    },
                },
            },
        },
        "_copyAll": true,
    },
};
function objectMapperSchema2Shape(label, schema, path = '') {
    let result = null;
    switch (schema._type) {
        case "Object":
            {
                const items = [];
                Object.keys(schema).forEach(key => {
                    if (key[0] !== '_') {
                        // @ts-ignore
                        items.push(objectMapperSchema2Shape(key, schema[key], path + label + '.'));
                    }
                });
                result = {
                    label: `{ } ${label}`,
                    items,
                    id: path + label,
                };
            }
            break;
        case "Array":
            const items = [];
            Object.keys(schema._element).forEach(key => {
                if (key[0] !== '_') {
                    // @ts-ignore
                    items.push(objectMapperSchema2Shape(key, schema._element[key], path + label + '[]'));
                }
            });
            result = {
                icon: './assets/images/text-box-outline.png',
                label: `[ ] ${label}`,
                items,
                id: path + label,
            };
            break;
        case "Leaf":
            result = {
                label,
                id: path + label,
                ...schema
            };
            break;
        default:
            throw "Unknown schema type";
    }
    return result;
}
function init() {
    const ObjectMapperTransformer = new objectMapper(outputTransformer);
    ObjectMapperTransformer.compile();
    console.log(ObjectMapperTransformer);
    return objectMapperSchema2Shape('outputTransformer', ObjectMapperTransformer.schema);
}
// const test = init()
// console.log(test)
console.log('File Loaded successfully');
export default init;
//# sourceMappingURL=utilsTransform.js.map