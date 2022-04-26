import { get } from 'lodash';
const schemaAttributes = ['_type', '_copyAll', '_omit', '_path', '_default', '_transformerCode', '_transformer', '_pathLevelUp', '_relPath', '_absPath'];
function hasNonSchemaAttributes(object) {
    return Object.keys(object).some(key => !schemaAttributes.includes(key));
}
export class ObjectMapper {
    constructor(schema) {
        this.compiled = false;
        this.schema = schema;
    }
    static _compile(schema, absPath = []) {
        let _absPath;
        if (typeof schema._type === 'undefined') {
            if (schema['_element'])
                schema._type = 'Array';
            else if (hasNonSchemaAttributes(schema))
                schema._type = 'Object';
            else
                schema._type = 'Leaf';
        }
        if (schema._path) {
            const biParts = ObjectMapper.dotsPartitioner.exec(schema._path);
            if ((biParts === null || biParts === void 0 ? void 0 : biParts.length) != 3)
                throw new Error("Unexpected error...");
            schema._pathLevelUp = biParts[1].length;
            // schema._path = biParts[2]
            schema._relPath = biParts[2];
            if (schema._pathLevelUp === 0) {
                _absPath = [schema._path];
            }
            else {
                _absPath = absPath.slice(0, absPath.length - schema._pathLevelUp + 1);
                _absPath.push(...schema._relPath.split('.'));
            }
            schema._absPath = _absPath.join('.');
        }
        else
            _absPath = [...absPath];
        switch (schema._type) {
            case "Array":
                if (!schema['_element'])
                    throw new Error(`Array schema must have _element spec: ${JSON.stringify(schema)}`);
                if (_absPath.length > 0)
                    _absPath.push('[*]');
                this._compile(schema['_element'], _absPath);
                break;
            case "Object":
                Object.keys(schema).forEach(key => {
                    if (!schemaAttributes.includes(key))
                        this._compile(schema[key], _absPath);
                });
                break;
            case "Leaf":
                // Nothing to do here
                break;
            default:
                throw new Error(`Unknown schema _type ${JSON.stringify(schema)} can be: ['Array' | 'Object' | 'Leaf']`);
        }
    }
    compile() {
        ObjectMapper._compile(this.schema);
        this.compiled = true;
    }
    _mapObject(schema, context) {
        // const currentContext = context[context.length - 1]
        // let currentValue = currentContext
        let currentValue = context[context.length - 1];
        // If this is not the current object and navigation (od default) is required
        if (schema._relPath || schema._default) {
            const depth = schema._pathLevelUp == 0 ? 0 : context.length - schema._pathLevelUp;
            currentValue = get(context[depth], schema._relPath, schema._default);
        }
        let result;
        switch (schema._type) {
            case "Object":
                result = schema._copyAll ? Object.assign({}, currentValue) : {};
                // const nextContext = cloneDeep(context)
                // nextContext.push(currentValue)
                context.push(currentValue);
                Object.entries(schema).forEach(([key, value]) => {
                    if (!schemaAttributes.includes(key))
                        result[key] = this._mapObject(value, context);
                    // result[key] = this._mapObject(value, nextContext)
                });
                if (Array.isArray(schema._omit))
                    schema._omit.forEach(key => delete result[key]);
                context.pop(); // nextContext
                break;
            case "Array":
                if (!Array.isArray(currentValue)) {
                    throw new Error(`Expected Array but got ${currentValue} at ${JSON.stringify(schema)}`);
                }
                result = currentValue.map((element) => {
                    // const nextContext = cloneDeep(context)
                    // nextContext.push(element)
                    // return this._mapObject(schema["_element"] as Schema, nextContext)
                    context.push(element);
                    const response = this._mapObject(schema["_element"], context);
                    context.pop();
                    return response;
                });
                break;
            case "Leaf":
                result = currentValue;
                break;
            default:
                throw "Unknown schema type";
        }
        if (schema._transformer)
            result = schema._transformer(result, context);
        return result;
    }
    mapObject(object) {
        if (!this.compiled)
            this.compile();
        return this._mapObject(this.schema, [object]);
    }
}
ObjectMapper.dotsPartitioner = new RegExp(/(\.*)(.*)/);