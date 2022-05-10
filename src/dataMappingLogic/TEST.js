// import { cutStringFromSymbol } from '../utils/strings';
function cutStringFromSymbol(string = '', symbol, end) {
    end = end ? end : string.length
    const index = string.indexOf(symbol)
    return string.substring(index + 1, end)
}

const outputShape = [
    {
        "key": "coordinates",
        "isArray": false,
        "label": "coordinates: Object",
        "items": [
            {
                "key": "lat",
                "isArray": false,
                "label": "lat: 52.65465",
                "value": "52.65465",
                "id": "coordinates.lat"
            },
            {
                "key": "long",
                "isArray": false,
                "label": "long: 51.54455",
                "value": "51.54455",
                "id": "coordinates.long"
            }
        ],
        "id": "coordinates"
    },
    {
        "key": "name",
        "isArray": false,
        "label": "name: test1",
        "value": "test1",
        "id": "name"
    },
    {
        "key": "address",
        "isArray": false,
        "label": "address: Object",
        "items": [
            {
                "key": "country",
                "isArray": false,
                "label": "country: London",
                "value": "London",
                "id": "address.country"
            },
            {
                "key": "country_code",
                "isArray": false,
                "label": "country_code: GB",
                "value": "GB",
                "id": "address.country_code"
            },
            {
                "key": "street",
                "isArray": false,
                "label": "street: 107/109 High Street",
                "value": "107/109 High Street",
                "id": "address.street"
            },
            {
                "key": "street2",
                "isArray": false,
                "label": "street2: ",
                "value": "",
                "id": "address.street2"
            },
            {
                "key": "city",
                "isArray": false,
                "label": "city: london",
                "value": "london",
                "id": "address.city"
            },
            {
                "key": "state",
                "isArray": false,
                "label": "state: GB",
                "value": "GB",
                "id": "address.state"
            },
            {
                "key": "zip_code",
                "isArray": false,
                "label": "zip_code: AB43GI",
                "value": "AB43GI",
                "id": "address.zip_code"
            },
            {
                "key": "phone_number",
                "isArray": false,
                "label": "phone_number: 566523584",
                "value": "566523584",
                "id": "address.phone_number"
            }
        ],
        "id": "address"
    }
]
const test = transformShape2JSON(outputShape)
console.log('outputShape ===> JSON ===>', test)


// function transformShape2JSON(shape) {
//     if (!Array.isArray(shape)) {
//         const value = shape.value ?? transformShape2JSON(shape.items)
//         return shape.isArray ? value : { [shape.key]: value }
//     }
//     const response = shape.map(_item => transformShape2JSON(_item))
//
//     if (shape.isArray) {
//         return response
//     }
//
//     return response.reduce(
//         (previousValue, currentValue) => {
//             return Object.assign(previousValue, currentValue)
//         }, {})
// }


//
//
// let key = item.label.split(': ')[0]
// if (item.items) {
//     
//     const result = item.items.map((_item) => transformShape2JSON(_item)).reduce(
//         (previousValue, currentValue) => {
//             return Object.assign(previousValue, currentValue)
//         }, {})
//     console.log(result)
//     return {
//         [key]: {
//             ...result,
//         }
//     }
// }