import { ObjectMapper } from './ObjectMapperLogic'
import { _replaceAll } from '../utils/strings'

function getObjectFromArray(data) {
    if (!Array.isArray(data)) {
        return data
    }
    return getObjectFromArray(data[0])
}

const createKeyValueString = (key, value) => {
    if (!['Array', 'Object'].includes(value.constructor.name))
        return `${key}: ${value.toString()}`
    else if (value.constructor.name === 'Object')
        return `${key}: Object`
    else if (value.constructor.name === 'Array')
        return `${key}: Array`
}

export function objectMapperSchema2Shape(schema, label = 'data', path = '') {
    let result = null

    switch (schema._type) {
        case 'Object': {
            const items = []
            Object.keys(schema).forEach(key => {
                if (key[0] !== '_') {
                    items.push(objectMapperSchema2Shape(schema[key], key, path + label + '.'))
                }
            })
            result = {
                _path: schema._path,
                _type: 'Object',
                label: `${label}`,
                items,
                id: path + label,
            }
        }
            break
        case 'Array':
            const items = []
            const elementAttributes = {}
            Object.keys(schema._element).forEach(key => {
                if (key[0] !== '_') {
                    items.push(objectMapperSchema2Shape(schema._element[key], key, path + label + '.[0].'))
                } else {
                    elementAttributes[key] = schema._element[key]
                }
            })
            result = {
                _path: schema._path,
                _type: 'Array',
                icon: './assets/images/text-box-outline.png',
                label: `${label}`,
                items,
                id: path + label,
                elementAttributes
            }
            break
        case 'Leaf':
            result = {
                ...schema,
                label,
                id: path + label,
            }
            break
        default:
            throw 'Unknown schema type ==> objectMapperSchema2Shape'
    }
    return result
}

export function objectMapperSchemaShape2Schema(shape) {
    switch (shape._type) {
        case 'Object':
            const result = shape.items.map((_item) => objectMapperSchemaShape2Schema(_item, false)).reduce(
                (previousValue, currentValue) => {
                    return Object.assign(previousValue, currentValue)
                }, {})

            return {
                [shape.label]: {
                    ...result,
                    _path: shape._path,
                    _default: shape._default,
                    _type: shape._type
                }
            }
        case'Array':
            return {
                [shape.label]: {
                    _element: shape.items.map((item) => objectMapperSchemaShape2Schema(item)).reduce(
                        (previousValue, currentValue) => {
                            return Object.assign(previousValue, currentValue)
                        }, { ...shape.elementAttributes }),
                    
                    _path: shape._path,
                    _default: shape._default,
                    _type: shape._type
                }
            }

        case'Leaf':
            return {
                [shape.label]: {
                    _path: shape._path,
                    _default: shape._default,
                    _type: shape._type
                }
            }
        default:
            throw 'Unknown schema type ==> objectMapperSchemaShape2JSON'
    }
    //

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
                    id: path + _key,
                    items,
                }
                : {
                    id: path + _key,
                    label,
                }
        })
    }
}

function getValuesFromShape(shape, keySearch = 'id', values = []) {
    Object.keys(shape).map((key, index) => {
            if (typeof keySearch === 'string' && key === keySearch) {
                values.push(shape[key])

            } else if (Array.isArray(keySearch)) {

                const _keySearch = keySearch[0]

                if (shape['id'] && shape[_keySearch] && _keySearch === key) {
                    const result = {}
                    result[_keySearch] = shape[_keySearch]
                    result['id'] = shape['id']
                    values.push(result)
                }
            }

            if (shape[key] && typeof shape[key] === 'object') {
                getValuesFromShape(shape[key], keySearch, values)
            }
        }
    )
    return values
}

function createObjectMapper2OutputInstance(objectMapperShape) {
    const objectMapperIds = getValuesFromShape(objectMapperShape)

    const result = []
    objectMapperIds.forEach((source) => {
        const target = source.replace('data.', '')
        const link = {
            source,
            target,
        }
        result.push(link)
    })
    return result
}

function createInput2ObjectMapperInstance(objectMapperShape) {
    const objectMapperIds = getValuesFromShape(objectMapperShape, ['_absPath'])
    const result = []
    objectMapperIds.map((link) => {
        let source = link['_absPath'].replace('data.', '')

        source = _replaceAll(source, '[*]', '[0]')

        result.push({
            source,
            target: link['id'],
        })
    })
    return result
}

function init(schema, inputJson) {
    const objectMapperTransformer = new ObjectMapper(schema)

    objectMapperTransformer.compile()
    const outputJson = objectMapperTransformer.mapObject({ data: inputJson })

    const objectMapperShape = [objectMapperSchema2Shape(objectMapperTransformer.schema)]
    
    const inputShape = transformJSONShape(inputJson)
    const outputShape = transformJSONShape(outputJson)


    const objectMapperToOutput = createObjectMapper2OutputInstance(objectMapperShape)
    const inputToObjectMapper = createInput2ObjectMapperInstance(objectMapperShape)

    // console.log(objectMapperTransformer)
    // const shapeValues = getValuesFromShape(outputShape)
    // const inputValues = getValuesFromShape(inputShape)
    // const outputValues = getValuesFromShape(outputShape)
    // console.log(inputValues)
    // console.log(objectMapperValues)
    // console.log(outputValues)
    return { inputShape, objectMapperShape, outputShape, objectMapperToOutput, inputToObjectMapper }
}


export default init
