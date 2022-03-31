import { get, cloneDeep } from 'lodash'
import * as ts from 'typescript'

// const ts = require

export type Schema = {
    _type?: 'Array' | 'Object' | 'Leaf' ,
    _copyAll?: boolean,
    _omit?: string[],
    _path?: string,
    _pathLevelUp?: number,
    _default?: any | any[],
    _transformerCode?: string,
    _transformer?: any,
    _element?: Schema,
    // https://stackoverflow.com/questions/43357734/typescript-recursive-type-with-indexer
    [key: string]: Schema | any // Sorry, inherent problem with "string index signatures"
}

const schemaAttributes = ['_type', '_copyAll', '_omit', '_path', '_default', '_transformerCode', '_transformer', '_pathLevelUp']
function hasNonSchemaAttributes(object: object) {
    return Object.keys(object).some(key => !schemaAttributes.includes(key))
}

export class ObjectMapper {
    static dotsPartitioner = new RegExp(/(\.*)(.*)/)
    schema: Schema
    compiled = false
    constructor(schema: Schema) {
        this.schema = schema
    }

    private static _compile(schema: Schema) {
        if (typeof schema._type === 'undefined') {
            if (schema['_element']) schema._type = 'Array'
            else if (hasNonSchemaAttributes(schema)) schema._type = 'Object'
            else schema._type = 'Leaf'
        }
        if (schema._path) {
            const biParts = ObjectMapper.dotsPartitioner.exec(schema._path as string)
            if (biParts?.length != 3)
                throw new Error("Unexpected error...")
            schema._pathLevelUp = biParts[1].length
            schema._path = biParts[2]
        }
        if (schema._transformerCode && !schema._transformer)
            // https://github.com/Microsoft/TypeScript-wiki/blob/master/Using-the-Compiler-API.md#a-simple-transform-function
            schema._transformer = eval(ts.transpile('(data, context) => {' + schema._transformerCode + '}'))
        switch (schema._type) {
            case "Array":
                if (!schema['_element']) throw new Error(`Array schema must have _element spec: ${JSON.stringify(schema)}`)
                this._compile(schema['_element'])
                break
            case "Object":
                Object.keys(schema).forEach(key => {
                    if (!schemaAttributes.includes(key))
                        this._compile(schema[key])
                })
                break
            case "Leaf":
                // Nothing to do here
                break
            default:
                throw new Error(`Unknown schema _type ${JSON.stringify(schema)} can be: ['Array' | 'Object' | 'Leaf']`)
        }
    }

    compile() {
        ObjectMapper._compile(this.schema)
        this.compiled = true
    }

    private _mapObject(schema: Schema, context: any[]) {
        // const currentContext = context[context.length - 1]
        // let currentValue = currentContext
        let currentValue = context[context.length - 1]
        // If this is not the current object and navigation (od default) is required
        if (schema._path || schema._default) {
            const depth = schema._pathLevelUp == 0 ? 0 : context.length - (schema._pathLevelUp as number)
            currentValue = get(context[depth], schema._path as string, schema._default)
        }
        let result: any
        switch (schema._type) {
            case "Object":
                result = schema._copyAll ? { ...currentValue } : {}
                const nextContext = cloneDeep(context)
                nextContext.push(currentValue)
                Object.entries(schema).forEach(([key, value]) => {
                    if (!schemaAttributes.includes(key))
                        result[key] = this._mapObject(value, nextContext)
                })
                if (Array.isArray(schema._omit))
                    schema._omit.forEach(key => delete result[key])
                break
            case "Array":
                result = currentValue.map((element: any) => {
                    const nextContext = cloneDeep(context)
                    nextContext.push(element)
                    return this._mapObject(schema["_element"] as Schema, nextContext)
                })
                break
            case "Leaf":
                result = currentValue
                break
            default:
                throw "Unknown schema type"
        }
        if (schema._transformer)
            result = schema._transformer(result, context)
        return result
    }

    mapObject(object: any) {
        if (!this.compiled) this.compile()
        return this._mapObject(this.schema, [object])
    }
}
