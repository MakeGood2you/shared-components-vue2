import { ObjectMapper } from './ObjectMapperLogic'

const inputJson = {
    order_no : 'ORD487',
    creation_date : '2022-02-27',
    currency : '$',
    product_items : [
        {
            product_id : 123123,
            item_id : 231231,
            quantity : 25,
            c_otailoAttribtues : {
                price : {
                    sales : {
                        value : 49.9,
                    },
                    list : {
                        value : 99.9,
                    },
                },
                variationAttributes : [
                    {
                        id : 'size',
                        values : [
                            {
                                selected : true,
                                displayValue : 'small',
                            }, {
                                selected : false,
                                displayValue : 'medium',
                            }, {
                                selected : false,
                                displayValue : 'large',
                            },
                        ],
                    }, {
                        id : 'color',
                        values : [
                            {
                                selected : true,
                                displayValue : 'red',
                            }, {
                                selected : false,
                                displayValue : 'blue',
                            }, {
                                selected : false,
                                displayValue : 'yellow',
                            },
                        ],
                    },
                ],
                images : {
                    small : [{ url : 'https://imageUrlSmall.png' }],
                },
            },
            product_name : 'Air max',
            c_otailoTrackingID : 'KLHKJ213L1JJ2K',
            c_otailoTrackingURL : 'https://www.makegood.co.il',
            c_otailoReturnReason : 'do now match to my legs',
            c_otailoReturnType : 'Object',
            c_otailoStatus : 'pending',
        }, {
            product_id : 123123,
            item_id : 231231,
            quantity : 25,
            c_otailoAttribtues : {
                price : {
                    sales : {
                        value : 49.9,
                    },
                    list : {
                        value : 99.9,
                    },
                },
                variationAttributes : [
                    {
                        id : 'size',
                        values : [
                            {
                                selected : true,
                                displayValue : 'small',
                            }, {
                                selected : false,
                                displayValue : 'medium',
                            }, {
                                selected : false,
                                displayValue : 'large',
                            },
                        ],
                    }, {
                        id : 'color',
                        values : [
                            {
                                selected : true,
                                displayValue : 'red',
                            }, {
                                selected : false,
                                displayValue : 'blue',
                            }, {
                                selected : false,
                                displayValue : 'yellow',
                            },
                        ],
                    },
                ],
                images : {
                    small : [{ url : 'https://imageUrlSmall.png' }],
                },
            },
            product_name : 'Air max',
            c_otailoTrackingID : 'KLHKJ213L1JJ2K',
            c_otailoTrackingURL : 'https://www.makegood.co.il',
            c_otailoReturnReason : 'do now match to my legs',
            c_otailoReturnType : 'Object',
            c_otailoStatus : 'pending',
        },
    ],
}
const schema = {
    '_type' : 'Object',
    '_path' : 'data',
    'order' :
        {
            'id' :
                {
                    '_path' : '.order_no',
                    '_default' : '',
                },
            'order_id' :
                {
                    '_path' : '.order_no',
                    '_default' : '',
                },
            'created_at' :
                {
                    '_path' : '.creation_date',
                    '_default' : '',
                },
            'shipped_at' :
                {
                    '_path' : '.creation_date',
                    '_default' : '',
                },
            'return_due_at' :
                {
                    '_path' : '.creation_date',
                    '_default' : '',
                },
            'currency' :
                {
                    '_path' : '.currency',
                    '_default' : '',
                },
            'basestore' :
                {
                    '_default' : 'Returnello',
                },
            'channel' :
                {
                    '_default' : 'WEB',
                },
            'order_items' :
                {
                    '_type' : 'Array',
                    '_path' : '.product_items',
                    '_element' :
                        {
                            '_type' : 'Object',
                            'sku' :
                                {
                                    '_path' : '.product_id',
                                },
                            'item_id' :
                                {
                                    '_path' : '.item_id',
                                },
                            'id' :
                                {
                                    '_path' : '.product_id',
                                },
                            'quantity' :
                                {
                                    '_path' : '.quantity',
                                },
                            'full_price' :
                                {
                                    '_path' : '.c_otailoAttribtues.price',
                                    '_transformerCode' : 'return data.list ? data.list.value : data.sales.value',
                                },
                            'sold_price' :
                                {
                                    '_path' : '.c_otailoAttribtues.price.sales.value',
                                },
                            'image_url' :
                                {
                                    '_path' : '.c_otailoAttribtues.images.small[0].url',
                                    '_default' : '',
                                    '_transformerCode' : 'return \'https://zyct-001.sandbox.us01.dx.commercecloud.salesforce.com\' + data',
                                },
                            'name' :
                                {
                                    '_path' : '.product_name',
                                },
                            'description' :
                                {
                                    '_path' : '.product_name',
                                },
                            'created_at' :
                                {
                                    '_path' : 'data.creation_date',
                                    '_default' : '',
                                },
                            'shipped_at' :
                                {
                                    '_path' : 'data.creation_date',
                                    '_default' : '',
                                },
                            'return_due_at' :
                                {
                                    '_path' : 'data.creation_date',
                                    '_default' : '',
                                    '_transformerCode' : 'var date = new Date(data); return new Date(date.setMonth(date.getMonth() + 1)).toISOString();',
                                },
                            'is_returnable' :
                                {
                                    '_default' : true,
                                },
                            'color' :
                                {
                                    '_path' : '.c_otailoAttribtues.variationAttributes',
                                    '_transformerCode' : 'var color = \'\';if(data){for(var i=0;i<data.length;i++){var variation = data[i];if(variation.id == \'color\') {for(var j =0; j < variation.values.length; j++) {var variationValue = variation.values[j];if(variationValue.selected) color = variationValue.displayValue;}}}}return color;',
                                },
                            'size' :
                                {
                                    '_path' : '.c_otailoAttribtues.variationAttributes',
                                    '_transformerCode' : 'var size = \'\';if(data){for(var i=0;i<data.length;i++){var variation = data[i];if(variation.id == \'size\') {for(var j =0; j < variation.values.length; j++) {var variationValue = variation.values[j];if(variationValue.selected) size = variationValue.displayValue;}}}}return size;',
                                },
                            'returns_info' :
                                {
                                    'c_otailoTrackingID' :
                                        {
                                            '_path' : '.c_otailoTrackingID',
                                        },
                                    'c_otailoTrackingURL' :
                                        {
                                            '_path' : '.c_otailoTrackingURL',
                                        },
                                    'c_otailoReturnReason' :
                                        {
                                            '_path' : '.c_otailoReturnReason',
                                        },
                                    'c_otailoReturnType' :
                                        {
                                            '_path' : '.c_otailoReturnType',
                                        },
                                    'c_otailoStatus' :
                                        {
                                            '_path' : '.c_otailoStatus',
                                        },
                                },
                        },
                },
            // '_copyAll' : true,
        },
}

const createKeyValueString = (key, value) => {
    if (!['Array', 'Object'].includes(value.constructor.name))
        return `${key}: ${value.toString()}`
    else if (value.constructor.name === 'Object')
        return `${key}: Object`
    else if (value.constructor.name === 'Array')
        return `${key}: Array`
}

function objectMapperSchema2Shape(schema, label = 'data', path = '') {
    let result = null

    switch (schema._type) {
        case 'Object': {
            const items = []
            Object.keys(schema).forEach(key => {
                if (key[0] !== '_') {
                    items.push(objectMapperSchema2Shape(schema[key] , key, path + label + '.'))
                }
            })
            result = {
                label : `${label}`,
                items,
                id : path + label,
            }
        }
            break
        case 'Array':
            const items = []
            Object.keys(schema._element).forEach(key => {
                if (key[0] !== '_') {
                    items.push(objectMapperSchema2Shape(schema._element[key], key, path + label + '.[0].'))
                }
            })
            result = {
                icon : './assets/images/text-box-outline.png',
                label : `${label}`,
                items,
                id : path + label,
            }
            break
        case 'Leaf':
            result = {
                label,
                id : path + label,
                ...schema,
            }
            break
        default:
            throw 'Unknown schema type'
    }
    return result
}


const transformJSONShape = (obj, path = '') => {
    if (obj && typeof obj === 'object') {
        const isArray = Array.isArray(obj)

        return Object.keys(obj).map((key) => {

            const _key = isArray ? `[${key}]` : key

            const label = createKeyValueString(key, obj[key])

            const items = transformJSONShape(obj[key], path + _key + '.')

            return items ?
                {
                    label,
                    id : path + _key,
                    items,
                }
                : {
                    id : path + _key,
                    label,
                }
        })
    }
}


function getValuesFromShape(shape, keySearch = 'id', values = []) {
    Object.keys(shape).map((key, index) => {
        if (key === keySearch) {
            values.push(shape[key])
        }
        if (shape[key] && typeof shape[key] === 'object') {
            getValuesFromShape(shape[key], keySearch, values)
        }
    })

    return values
}

function init() {
    const objectMapperTransformer = new ObjectMapper(schema)
    objectMapperTransformer.compile()

    const outputJson = objectMapperTransformer.mapObject({ data : inputJson })
    const objectMapperShape = objectMapperSchema2Shape(objectMapperTransformer.schema)
    const inputShape = transformJSONShape(inputJson)
    const outputShape = transformJSONShape(outputJson)
    // const shapeValues = getValuesFromShape(outputShape)
    const inputValues = getValuesFromShape(inputShape)
    const objectMapperValues = getValuesFromShape(objectMapperShape)
    const outputValues = getValuesFromShape(outputShape)

    console.log(inputValues)
    console.log(objectMapperValues)
    console.log(outputValues)
    return { inputShape, objectMapperShape, outputShape, objectMapperValues }
}

// const test = init()
// console.log(test)

console.log('File Loaded successfully')
export default init
