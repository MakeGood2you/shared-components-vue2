import { shapes, util } from '@OtailO-recommerce/rappid';
import { _replaceAll, cutStringFromSymbol, createKeyValueString } from '../utils/strings';

export class Link extends shapes.standard.Link {
    defaults() {
        return util.defaultsDeep({
            type: 'mapping.Link',
            z: -1,
            attrs: {
                line: {
                    targetMarker: {
                        'type': 'path',
                        'd': 'M 10 -5 0 0 10 5 z'
                    },
                    sourceMarker: {
                        'type': 'path',
                        'd': 'M 0 -5 10 0 0 5 z'
                    },
                    stroke: '#7C90A6',
                    strokeWidth: 1
                }
            }
        }, super.defaults);
    }

}

export class Record extends shapes.standard.HeaderedRecord {

    constructor(allowedTools, attributes) {
        super(attributes);
        this.allowedTools = allowedTools;
    }

    getValuesFromShape(shape, keySearch = 'id', values = []) {
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
                    this.getValuesFromShape(shape[key], keySearch, values)
                }
            }
        )
        return values
    }

    defaults() {
        return util.defaultsDeep({
            type: 'mapping.Record',
            itemHeight: 20,
            itemOffset: 15,
            itemMinLabelWidth: 70,
            itemAboveViewSelector: 'header',
            itemBelowViewSelector: 'footer',
            padding: { top: 35, left: 15, right: 10, bottom: 10 },
            scrollTop: 0,
            size: { height: 400, width: 250 },
            itemOverflow: true,
            attrs: {
                root: {
                    magnet: false
                },
                body: {
                    stroke: '#EBEEF0'
                },
                header: {
                    height: 35,
                    fill: '#F8FAFC',
                    stroke: '#EBEEF0'
                },
                tabColor: {
                    height: 5,
                    x: 0,
                    y: 0,
                    width: 'calc(w)',
                    fill: '#4566E5',
                    stroke: '#4566E5'
                },
                headerLabel: {
                    y: 5,
                    fontFamily: 'Sans-serif',
                    fontWeight: 300,
                    textWrap: {
                        ellipsis: true,
                        height: 30
                    }
                },
                footer: {
                    height: 10,
                    x: 0,
                    y: 'calc(h - 10)',
                    width: 'calc(w)',
                    fill: '#F8FAFC',
                    stroke: '#EBEEF0'
                },
                buttonsGroups: {
                    stroke: '#7C90A6'
                },
                forksGroups: {
                    stroke: 'lightgray'
                },
                itemBodies: {
                    itemHighlight: {
                        fill: 'none'
                    }
                },
                itemLabels: {
                    magnet: 'true',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontFamily: 'Sans-serif',
                    itemHighlight: {
                        fill: '#4566E5'
                    }
                },
                itemLabels_disabled: {
                    magnet: null,
                    fill: '#AAAAAA',
                    cursor: 'not-allowed'
                },
            }
        }, super.defaults);
    }

    preinitialize() {
        this.markup = [{
            tagName: 'rect',
            selector: 'body'
        }, {
            tagName: 'rect',
            selector: 'header'
        }, {
            tagName: 'rect',
            selector: 'tabColor'
        }, {
            tagName: 'text',
            selector: 'headerLabel'
        }, {
            tagName: 'rect',
            selector: 'footer'
        }];
    }

    setName(name, opt) {
        return this.attr(['headerLabel', 'textWrap', 'text'], name, opt);
    }

    getDefaultItem(itemId, element) {
        const item = itemId && element ? element.item(itemId) : '';
        return {
            id: itemId ? this.getNewItemId(itemId) : util.uuid(),
            label: 'new_item',
            icon: item.icon || "mapper/document.svg",
            _type: item._type || "Leaf"
        };
    }

    getNewItemId(id, newId = 'new_item') {
        id = id.split('.')
        id.pop()
        return id.join('.') + '.' + newId;
    }

    getItemTools(itemId) {
        return [
            { action: 'edit', content: 'Edit Item' },
            { action: 'edit-function', content: 'Edit User Function' },
            { action: 'add-child', content: 'Add Child' },
            { action: 'add-next-sibling', content: 'Add Next Sibling' },
            { action: 'add-prev-sibling', content: 'Add Prev Sibling' },
            { action: 'remove', content: warning('Remove Item') }
        ].filter(tool => this.allowedTools.includes(tool.action));
    }

    getTools() {
        return [
            { action: 'add-item', content: 'Add Child' },
            { action: 'remove', content: warning('Remove Record') }
        ];
    }

    recordUpdate(itemsIds, newItems) {
        let tempItem = this.getDefaultItem()
        this.addPrevSibling(itemsIds[0].id, tempItem)

        itemsIds.forEach((item) => {
            this.removeItem(item.id)
        })

        newItems.forEach((newItem) => {
            this.addPrevSibling(tempItem.id, newItem)
        })
        this.removeItem(tempItem.id)

        const isItemVisible = this.isItemVisible(itemsIds[0].id)
    }
}

export class ObjectMapperRecord extends Record {
    // mappingSchema = {}

    constructor(allowedTools, schema) {
        const attributes = {
            items: [
                [ObjectMapperRecord.objectMapperSchema2Shape(schema)]
            ]
        }
        super(allowedTools, attributes);
        // this.mappingSchema = schema
    }

    objectMapperSchemaShape2Schema(shape) {
        switch (shape._type) {
            case 'Object':
                const result = shape.items.map((_item) => this.objectMapperSchemaShape2Schema(_item)).reduce(
                    (previousValue, currentValue) => {
                        return Object.assign(previousValue, currentValue)
                    }, {})

                return {
                    [shape.label]: {
                        ...result,
                        _path: shape._path,
                        _default: shape._default ? shape._default : undefined,
                        _type: shape._type,
                        // _transformerCode: shape._transformerCode ? shape._transformerCode : undefined,
                    }
                }
            case'Array':
                return {
                    [shape.label]: {
                        _element: shape.items.map((item) => this.objectMapperSchemaShape2Schema(item)).reduce(
                            (previousValue, currentValue) => {
                                return Object.assign(previousValue, currentValue)
                            }, { ...shape.elementAttributes }),

                        _path: shape._path,
                        _default: shape._default ? shape._default : undefined,
                        _type: shape._type,
                        // _transformerCode: shape._transformerCode ? shape._transformerCode : undefined,
                    }
                }

            case'Leaf':
                return {
                    [shape.label]: {
                        _path: shape._path,
                        _default: shape._default ? shape._default : undefined,
                        _type: shape._type,
                        _transformerCode: shape._transformerCode ? shape._transformerCode : undefined,
                    }
                }
            default:
                throw 'Unknown schema type ==> objectMapperSchemaShape2JSON'
        }
        //

    }

    static objectMapperSchema2Shape(schema, label = '$root', path = '') {
        let result = null

        switch (schema._type) {
            case 'Object': {
                const items = []
                Object.keys(schema).forEach(key => {
                    if (key[0] !== '_') {
                        items.push(this.objectMapperSchema2Shape(schema[key], key, path + label + '.'))
                    }
                })
                result = {
                    items,
                    icon: 'mapper/object.svg',
                    _path: schema._path,
                    _type: 'Object',
                    label: `${label}`,
                    id: path + label,
                    _transformerCode: schema._transformerCode ? schema._transformerCode : undefined,
                }
            }
                break
            case 'Array':
                const items = []
                const elementAttributes = {}
                Object.keys(schema._element).forEach(key => {
                    if (key[0] !== '_') {
                        items.push(this.objectMapperSchema2Shape(schema._element[key], key, path + label + '.[0].'))
                    } else {
                        elementAttributes[key] = schema._element[key]
                    }
                })
                result = {
                    items,
                    elementAttributes,
                    _transformerCode: schema._transformerCode ? schema._transformerCode : undefined,
                    _path: schema._path,
                    _type: 'Array',
                    icon: 'mapper/array.svg',
                    label: `${label}`,
                    id: path + label,
                }
                break
            case 'Leaf':
                result = {
                    ...schema,
                    label,
                    id: path + label,
                    icon: 'mapper/document.svg',
                    _transformerCode: schema._transformerCode ? schema._transformerCode : undefined,
                }
                break
            default:
                throw 'Unknown schema type ==> objectMapperSchema2Shape'
        }
        return result
    }

    //create instance links
    createObjectMapper2OutputInstance(objectMapperShape, outputShape) {

        const objectMapperIds = this.getValuesFromShape(objectMapperShape)
        const outputIds = this.getValuesFromShape(outputShape)

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

    //create instance links
    createInput2ObjectMapperInstance(objectMapperShape, inputShape) {
        const objectMapperIds = this.getValuesFromShape(objectMapperShape, ['_absPath', 'id'])
        const inputIds = this.getValuesFromShape(inputShape)
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

    getInspectorConfig() {
        return {
            label: {
                label: 'Label',
                type: 'content-editable'
            },
            _path: {
                label: 'path',
                type: 'content-editable'
            },
            hasDefault: {
                label: 'Has Default',
                type: 'toggle',
                defaultValue: true
            },
            _default: {
                label: 'default',
                type: 'content-editable',
                // defaultValue: ''
            },
            _type: {
                label: 'type',
                type: 'content-editable'
            },
            _pathLevelUp: {
                label: 'Path Level Up',
                type: 'content-editable'
            },
            icon: {
                label: 'Icon',
                type: 'select-button-group',
                options: [{
                    value: 'mapper/array.svg',
                    content: '<img height="42px" src="mapper/array.svg"/>'
                }, {
                    value: 'mapper/document.svg',
                    content: '<img height="42px" src="mapper/document.svg"/>'
                }, {
                    value: 'mapper/object.svg',
                    content: '<img height="42px" src="mapper/object.svg"/>'
                }]
            }

        }
    }
}

export class JsonRecord extends Record {
    // JSON = {}

    constructor(allowedTools, JSON) {
        const attributes = {
            items: [
                JsonRecord.transformJSON2Shape(JSON)
            ]
        }
        super(allowedTools, attributes);
        // this.JSON = JSON
    }

    static transformJSON2Shape(obj, path = '') {
        if (obj && typeof obj === 'object') {
            const isArray = Array.isArray(obj)

            return Object.keys(obj).map((key) => {

                const _key = isArray ? `[${key}]` : key

                const label = createKeyValueString(key, obj[key])

                const items = this.transformJSON2Shape(obj[key], path + _key + '.')

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

    getInspectorConfig() {
        return {
            label: {
                label: 'Label',
                type: 'content-editable'
            },
            icon: {
                label: 'Icon',
                type: 'select-button-group',
                options: [{
                    value: 'document',
                    content: '<img height="42px" src="../assets/images/document.svg"/>'
                }, {
                    value: 'clipboard',
                    content: '<img height="42px" src="../assets/images/clipboard.svg"/>'
                }, {
                    value: 'file',
                    content: '<img height="42px" src="../assets/images/file.svg"/>'
                }]
            },
            highlighted: {
                label: 'Highlight',
                type: 'toggle'
            }
        };
    }

    transformShape2JSON(shape) {
        if (!Array.isArray(shape)) {
            const value = shape.value === null || shape.value === undefined ? this.transformShape2JSON(shape.items) : shape.value
            return shape.isArray ? value : { [shape.key]: value }
        }
        const response = shape.map(_item => this.transformShape2JSON(_item))

        if (shape.isArray) {
            return response
        }

        return response.reduce(
            (previousValue, currentValue) => {
                return Object.assign(previousValue, currentValue)
            }, {})
    }

}

export class InputRecord extends JsonRecord {
    constructor(allowedTools, JSON) {
        super(allowedTools, JSON);
    }
}

export class OutputRecord extends JsonRecord {
    constructor(allowedTools, JSON) {
        super(allowedTools, JSON);
    }
}

function warning(text) {
    return '<span style="color:#fe854f">' + text + '</span>';
}

const ConstantView = shapes.standard.RecordView;
const ConcatView = shapes.standard.RecordView;
const GetDateView = shapes.standard.RecordView;
const RecordView = shapes.standard.RecordView;

Object.assign(shapes, {
    mapping: {
        Link,
        ConstantView,
        ConcatView,
        GetDateView,
        Record,
        RecordView
    }
});
