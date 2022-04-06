"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectMapper = void 0;
var lodash_1 = require("lodash");
var schemaAttributes = ['_type', '_copyAll', '_omit', '_path', '_default', '_transformerCode', '_transformer', '_pathLevelUp'];
function hasNonSchemaAttributes(object) {
    return Object.keys(object).some(function (key) { return !schemaAttributes.includes(key); });
}
var ObjectMapper = /** @class */ (function () {
    function ObjectMapper(schema) {
        this.compiled = false;
        this.schema = schema;
    }
    ObjectMapper._compile = function (schema) {
        var _this = this;
        if (typeof schema._type === 'undefined') {
            if (schema['_element'])
                schema._type = 'Array';
            else if (hasNonSchemaAttributes(schema))
                schema._type = 'Object';
            else
                schema._type = 'Leaf';
        }
        if (schema._path) {
            var biParts = ObjectMapper.dotsPartitioner.exec(schema._path);
            if ((biParts === null || biParts === void 0 ? void 0 : biParts.length) != 3)
                throw new Error("Unexpected error...");
            schema._pathLevelUp = biParts[1].length;
            schema._path = biParts[2];
        }
        if (schema._transformerCode && !schema._transformer)
            // https://github.com/Microsoft/TypeScript-wiki/blob/master/Using-the-Compiler-API.md#a-simple-transform-function
            console.log('schema._transformerCode => ', schema._transformerCode);
        switch (schema._type) {
            case "Array":
                if (!schema['_element'])
                    throw new Error("Array schema must have _element spec: ".concat(JSON.stringify(schema)));
                this._compile(schema['_element']);
                break;
            case "Object":
                Object.keys(schema).forEach(function (key) {
                    if (!schemaAttributes.includes(key))
                        _this._compile(schema[key]);
                });
                break;
            case "Leaf":
                // Nothing to do here
                break;
            default:
                throw new Error("Unknown schema _type ".concat(JSON.stringify(schema), " can be: ['Array' | 'Object' | 'Leaf']"));
        }
    };
    ObjectMapper.prototype.compile = function () {
        ObjectMapper._compile(this.schema);
        this.compiled = true;
    };
    ObjectMapper.prototype._mapObject = function (schema, context) {
        var _this = this;
        // const currentContext = context[context.length - 1]
        // let currentValue = currentContext
        var currentValue = context[context.length - 1];
        // If this is not the current object and navigation (od default) is required
        if (schema._path || schema._default) {
            var depth = schema._pathLevelUp == 0 ? 0 : context.length - schema._pathLevelUp;
            currentValue = (0, lodash_1.get)(context[depth], schema._path, schema._default);
        }
        var result;
        switch (schema._type) {
            case "Object":
                result = schema._copyAll ? __assign({}, currentValue) : {};
                var nextContext_1 = (0, lodash_1.cloneDeep)(context);
                nextContext_1.push(currentValue);
                Object.entries(schema).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (!schemaAttributes.includes(key))
                        result[key] = _this._mapObject(value, nextContext_1);
                });
                if (Array.isArray(schema._omit))
                    schema._omit.forEach(function (key) { return delete result[key]; });
                break;
            case "Array":
                result = currentValue.map(function (element) {
                    var nextContext = (0, lodash_1.cloneDeep)(context);
                    nextContext.push(element);
                    return _this._mapObject(schema["_element"], nextContext);
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
    };
    ObjectMapper.prototype.mapObject = function (object) {
        if (!this.compiled)
            this.compile();
        return this._mapObject(this.schema, [object]);
    };
    ObjectMapper.dotsPartitioner = new RegExp(/(\.*)(.*)/);
    return ObjectMapper;
}());
exports.ObjectMapper = ObjectMapper;
