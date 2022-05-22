import { _replaceAll, cutStringFromSymbol } from '../utils/strings'
import { Link } from './shapes';
import { records } from './example';

export function getObjectFromDeepArray(data) {
    if (!Array.isArray(data)) {
        return data
    }
    return getObjectFromDeepArray(data[0])
}

export const createKeyValueString = (key, value) => {
    if (!key) key = 'none'
    if (!value) value = ''
    if (!['Array', 'Object'].includes(value.constructor.name))
        return `${key}: ${value.toString()}`
    else if (value.constructor.name === 'Object')
        return `${key}`
    else if (value.constructor.name === 'Array')
        return `${key}`
    else {

    }
}

export function objectMapperSchema2Shape(schema, label = '$root', path = '') {
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
                icon: 'mapper/object.svg',
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
                icon: 'mapper/array.svg',
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
                icon: 'mapper/document.svg'
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
            const result = shape.items.map((_item) => objectMapperSchemaShape2Schema(_item)).reduce(
                (previousValue, currentValue) => {
                    return Object.assign(previousValue, currentValue)
                }, {})

            return {
                [shape.label]: {
                    ...result,
                    _path: shape._path,
                    _default: shape._default ? shape._default : undefined,
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
                    _default: shape._default ? shape._default : undefined,
                    _type: shape._type
                }
            }

        case'Leaf':
            return {
                [shape.label]: {
                    _path: shape._path,
                    _default: shape._default ? shape._default : undefined,
                    _type: shape._type
                }
            }
        default:
            throw 'Unknown schema type ==> objectMapperSchemaShape2JSON'
    }
    //

}

export const transformJSON2Shape = (obj, path = '') => {
    if (obj && typeof obj === 'object') {
        const isArray = Array.isArray(obj)

        return Object.keys(obj).map((key) => {

            const _key = isArray ? `[${key}]` : key

            const label = createKeyValueString(key, obj[key])

            const items = transformJSON2Shape(obj[key], path + _key + '.')

            return items ?
                {
                    key,
                    isArray,
                    label,
                    items,
                    id: path + _key,
                    icon: `mapper/${isArray ? 'array' : 'object'}.svg`
                } : {
                    icon: 'mapper/document.svg',
                    key,
                    isArray,
                    label,
                    value: obj[key],
                    id: path + _key,
                }
        })
    }
}

export function transformShape2JSON(shape) {
    if (!Array.isArray(shape)) {
        const value = shape.value ?? transformShape2JSON(shape.items)
        return shape.isArray ? value : { [shape.key]: value }
    }
    const response = shape.map(_item => transformShape2JSON(_item))

    if (shape.isArray) {
        return response
    }

    return response.reduce(
        (previousValue, currentValue) => {
            return Object.assign(previousValue, currentValue)
        }, {})
}

export function getValuesFromShape(shape, keySearch = 'id', values = []) {
    Object.keys(shape).map((key, index) => {
            if (typeof keySearch === 'string' && key === keySearch) {
                values.push(shape[key])

            } else if (Array.isArray(keySearch)) {

                const _keySearch = keySearch[0]
                const _keySearch2 = keySearch[1]

                if (shape[_keySearch2] && shape[_keySearch] && _keySearch === key) {
                    const result = {}
                    result[_keySearch] = shape[_keySearch]
                    result[_keySearch2] = shape[_keySearch2]
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

export function createObjectMapper2OutputInstance(objectMapperShape, outputShape) {

    const objectMapperIds = getValuesFromShape(objectMapperShape)
    const outputIds = getValuesFromShape(outputShape)

    const result = []
    objectMapperIds.forEach((source) => {
        const index = source.indexOf('.')
        if (index >= 0) {

            const target = source.substring(index + 1)

            if (outputIds.includes(target)) {
                const link = {
                    source,
                    target,
                }
                result.push(link)
            }
        }
    })
    return result
}

export function createInput2ObjectMapperInstance(objectMapperShape, inputShape) {
    const objectMapperIds = getValuesFromShape(objectMapperShape, ['_absPath', 'id'])
    const inputIds = getValuesFromShape(inputShape)
    const result = []
    objectMapperIds.map((link) => {
        let source = cutStringFromSymbol(link['_absPath'], '.')

        source = _replaceAll(source, '[*]', '[0]')
        if (inputIds.includes(source)) {
            result.push({
                source,
                target: link['id'],
            })
        }
    })
    return result
}

export function createLinks(sourceShape, targetShape, source2TargetInstance) {
    const links = []
    source2TargetInstance.map(link => {
        links.push(
            new Link({
                source: { id: sourceShape.id, port: link.source },
                target: { id: targetShape.id, port: link.target },
            }),
        )
    })
    return links
}

export function createHashLinks(sourceShape, targetShape, source2TargetInstance) {
    const bySource = {}
    const byTarget = {}
    source2TargetInstance.map(data => {
        const link = new Link({
            source: { id: sourceShape.id, port: data.source },
            target: { id: targetShape.id, port: data.target },
        })
        bySource[data.source] = link
        byTarget[data.target] = link
    })
    return {
        bySource,
        byTarget
    }
}

export function createNewLinks(graph) {
    const objectMapperToOutput = createObjectMapper2OutputInstance(records.ObjectMapperRecord, records.outputRecord)
    const inputToObjectMapper = createInput2ObjectMapperInstance(records.ObjectMapperRecord, records.InputRecord)
    let links = createLinks(records.InputRecord, records.ObjectMapperRecord, inputToObjectMapper, graph)
    // links = links.concat()
    debugger
    Array.prototype.push.apply(links, createLinks(records.ObjectMapperRecord, records.outputRecord, objectMapperToOutput, graph))
    debugger
    links.forEach(function (link) {
        link.addTo(graph)
    })
}

function init(schema, inputJson, outputJson) {
    // for Demo
    // const objectMapperTransformer = new ObjectMapper(schema)
    // objectMapperTransformer.compile()
    // outputJson = objectMapperTransformer.mapObject({ data: inputJson })

    const objectMapperShape = [objectMapperSchema2Shape(schema)]
    const inputShape = transformJSON2Shape(inputJson)
    const outputShape = transformJSON2Shape(outputJson)

    const objectMapperToOutput = createObjectMapper2OutputInstance(objectMapperShape, outputShape)
    const inputToObjectMapper = createInput2ObjectMapperInstance(objectMapperShape, inputShape)
    console.log('objectMapperToOutput ===> :', objectMapperToOutput)
    console.log('inputToObjectMapper ===> :', inputToObjectMapper)
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
