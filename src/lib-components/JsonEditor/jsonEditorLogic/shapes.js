import { shapes, util } from '@OtailO-recommerce/rappid';
import { createKeyValueString, cutStringFromSymbol } from '../../../utils/strings';
import { createDialog, createInspector, } from '../../../utils/jointJS-UI-utils';
import i18n from '../../../services/i18n.vue.mixin';


export class Record extends shapes.standard.HeaderedRecord {

    constructor(allowedTools, attributes) {
        super(attributes);
        this.allowedTools = allowedTools;
    }

    getValuesFromShape(shape, keySearch = 'id', values = []) {
        shape = shape ? shape : this.attributes.items[0]
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
            itemHeight: 30,
            itemOffset: 15,
            itemMinLabelWidth: 70,
            itemAboveViewSelector: 'header',
            itemBelowViewSelector: 'footer',
            padding: { top: 35, left: 15, right: 10, bottom: 10 },
            scrollTop: 0,
            size: { height: window.screen.height / 1.8, width: 600 },
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
                    fill: '#8cc23d',
                    stroke: '#8cc23d'
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
                    fontSize: 16,
                    fontFamily: 'Sans-serif',
                    itemHighlight: {
                        fill: '#8cc23d'
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

    getItemId() {
        return `new_item_${util.uuid().substring(0, 7)}`
    }

    getDefaultChild(prevId) {
        const newItem = this.getDefaultItem()
        newItem.id = this.generateNewItemId(prevId, newItem.id, true)
        return newItem
    }

    getDefaultItem(opt = {}) {
        const id = opt.id ? opt.id : this.getItemId()
        const icon = `mapper/${opt._type ? opt._type.toLowerCase() : 'leaf'}.svg`
        const label = cutStringFromSymbol(id, '.', true)
        const newItem = {
            id,
            icon,
            key: opt.key || id,
            label,
            value: '',
            _type: opt.type || "Leaf",
            isArray: opt.isArray || false
        };

        if (['Object', 'Array'].includes(opt._type)) {
            newItem.items = []
        }
        return newItem
    }

    generateNewItemId(prevId, newId, isChild) {
        const index = prevId.lastIndexOf('.')
        if (index === -1) {

            if (isChild) return prevId + '.' + newId
            return newId

        } else {
            const result = prevId.substring(0, index + 1)
            return result + newId
        }
    }

    getItemTools(itemId) {
        let tools = this.allowedTools
        if (itemId === '$_root') {
            tools = ['edit', 'add-child', 'edit-function']
        }
        return [
            { action: 'edit', content: 'Edit Item' },
            { action: 'edit-function', content: 'Edit User Function' },
            { action: 'add-child', content: 'Add child' },
            { action: 'add-child-to-array', content: 'Add child to Array' },
            { action: 'add-child-to-object', content: 'Add child to Object' },
            { action: 'add-next-sibling', content: 'Add next sibling' },
            { action: 'add-prev-sibling', content: 'Add prev sibling' },
            { action: 'remove', content: warning('Remove Item') }
        ].filter(tool => tools.includes(tool.action));
    }

    getTools() {
        return [
            { action: 'export-to-json', content: 'Export to JSON' },
            { action: 'import-json', content: 'Import JSON' },
            // { action: 'add-item', content: 'Add Child' },
            // { action: 'remove', content: warning('Remove Record') }
        ];
    }

    recordUpdate(itemsIds, newItems) {
        let tempItem = this.getDefaultItem()
        // check if record is empty
        if (itemsIds && !itemsIds.length && newItems.length === 1) {
            this.set('items', [[newItems[0]]]);
        }

        if (itemsIds && itemsIds.length) {
            this.addPrevSibling(itemsIds[itemsIds.length - 1].id, tempItem)
            itemsIds.forEach((item) => {
                this.removeItem(item.id)
            })
        }

        newItems.length && newItems.forEach((newItem) => {
            this.addPrevSibling(tempItem.id, newItem)
        })
        this.removeItem(tempItem.id)
    }

    getItemByPath(items, path) {
        const item = items
        if (!path) return
        if (path.length <= 1) {
            return item
        }
        path.shift()
        return this.getItemByPath(items[path[0]], path)
    }

    removeItemAndInstances(itemId, targetElement) {
        this.startBatch('item-remove');
        this.removeItem(itemId);
        this.removeInvalidLinks();
        this.stopBatch('item-remove');
    }

}

export class JsonRecord extends Record {

    constructor(allowedTools, JSON) {
        const items = JsonRecord.transformJSON2Shape(JSON)
        const attributes = {
            items: [items ? items : []]
        }
        super(allowedTools, attributes);
        // this.JSON = JSON
    }

    static transformJSON2Shape(obj, path = '') {
        // if is object is observed and empty
        if (obj && typeof obj === 'object') {

            return Object.keys(obj).map((key) => {

                const collapsed = Array.isArray(obj[key])
                const isArray = Array.isArray(obj[key])

                const _key = isArray ? `[${key}]` : key

                const label = createKeyValueString(key, obj[key])

                const _type = isArray ? 'Array' : 'Object'

                const items = this.transformJSON2Shape(obj[key], path + _key + '.')

                const result = items ?
                    {
                        collapsed: false,
                        _type,
                        key,
                        isArray,
                        label,
                        value: _type,
                        items,
                        id: path + _key,
                        icon: `mapper/${isArray ? 'array' : 'object'}.svg`
                    } : {
                        collapsed: false,
                        _type: 'Leaf',
                        key,
                        isArray: false,
                        label,
                        value: obj[key],
                        id: path + _key,
                        icon: 'mapper/leaf.svg',
                    }

                return result
            })
        } else {
            return undefined
        }
    }

    getInspectorConfig() {
        return {

            key: {
                label: 'key',
                type: 'content-editable',
            },

            value: {
                label: 'value',
                type: 'text',
            },

            _type: {
                label: 'type',
                type: 'select',
                options: [
                    'Array',
                    'Object',
                    'Leaf'
                ]
            },
        };
    }

    transformShape2JSON(shape) {
        if (typeof shape._type === 'undefined') {
            const type = (
                Array.isArray(shape)
                && shape.length > 0
                && shape[0].key.match('^[0-9]*$')
            ) ? 'Array' : 'Object'

            return this.transformShape2JSON({ _type: type, items: shape });
        }

        if (shape._type === 'Leaf') return { [shape.key]: shape.value }

        if (!shape.items) return

        const response = shape.items ? shape.items.map(item => this.transformShape2JSON(item)) : shape.value;

        let value = response.reduce(
            (previousValue, currentValue) => Object.assign(previousValue, currentValue), {}
        )
        if (shape._type === 'Array') value = Object.values(value)

        if (!shape.key) return value

        if (['Object', 'Array'].includes(shape._type)) return { [shape.key]: value }

        throw new Error('shape is undefined')
    }

    getDefaultChildInArray(id, index, opt, type) {

        const newId = this.getItemId()
        const childId = id + '.' + newId
        const child = this.getDefaultItem({ ...opt, key: newId, id: childId })
        let result = {
            items: [child],
            id,
            key: `${index}`,
            label: `${index}`,
            isArray: false,
            icon: `mapper/${type ? type.toLowerCase() : 'object'}.svg`,
            value: type ? '' : "object",
            _type: type || "Object"
        }

        return result
    }

    itemTemplate(currItem, type) {
        if (!['Object', 'Array', 'Leaf'].includes(type)) return
        let newItem = { ...currItem, }

        newItem.value = type
        newItem._type = type
        newItem.icon = `mapper/${type.toLowerCase()}.svg`
        switch (type) {
            case 'Leaf':
                //TODO: Check if is ok with all  senarios
                newItem.key = cutStringFromSymbol(newItem.key, '.', true,)
                newItem.value = ''
                newItem.id = this.generateNewItemId(currItem.id, currItem.key)
                newItem.label = createKeyValueString(newItem.key, newItem.value)
                if (newItem.items && newItem.items.length) {
                    newItem.items.forEach((item) => {
                        this.removeItem(item.id)
                    })
                    delete newItem.items
                }
                break;

            case 'Array':
                newItem.isArray = true
            case 'Object':
                newItem.items = newItem.items || []
                newItem.label = currItem.key
                break;

            default:
                delete newItem.id
                const result = this.getDefaultItem(newItem)
                return result
        }

        console.log('itemTemplate ', newItem)
        return newItem
    }

    getParentId(childId) {
        const index = childId.lastIndexOf('.')
        return childId.substring(0, index)
    }

    addItemInArray(parent, opt) {
        const index = parent.items && parent.items.length || 0
        const id = `${parent.id}.[${index}]`
        const child = this.getDefaultChildInArray(id, index, opt)
        return child
    }

    updateTypeItemInArray(parent, item) {
        if (parent && parent.id) {
            if (parent._type === 'Array') {
                const index = parent.items.findIndex(i => i.id === item.id)
                const id = `${parent.id}.[${index}]`
                const child = this.getDefaultChildInArray(id, index, {}, item._type)
                return child
            } else {
                return this.itemTemplate(item, 'Leaf')
            }
        }
    }

    createSibling(itemId) {
        let item = structuredClone(this.item(itemId))
        const parent = this.item(this.getParentId(item.id))

        let newItem = {}
        if (parent && parent._type === 'Array') {
            newItem = this.addItemInArray(parent, { s_type: parent._type })
        } else {
            newItem = this.getDefaultItem({ _type: item._type })
        }
        return newItem
    }
}

export class InputRecord
    extends JsonRecord {
    constructor(allowedTools, JSON) {
        super(allowedTools, JSON);
    }

    isValid2changeType(prevItem, currItem, itemId) {
        if (prevItem._type !== 'Leaf') {
            this.item(itemId, { ...prevItem })
            let dialog = createDialog({
                // title: i18n.methods.t('issue'),
                title: 'issue',
                closeButton: true,
                content: 'You can change type only to Leaf',
                buttons: ['ok']
            })
            dialog.open()
            dialog.on({
                'action:ok': function () {
                    dialog.close();
                }
            })
            return false
        } else {
            console.log('changed type')
            return true
        }
    }

    updateTypeOfNode(prevItem, currItem, itemId) {
        switch (currItem._type) {
            case 'Leaf':
                let newItem = currItem
                const parentId = this.getParentId(currItem.id)
                const parent = this.item(parentId)
                if (parent._type === 'Array') {
                     newItem = this.updateTypeItemInArray(parent, currItem)
                }
                this.changeToLeaf(prevItem, currItem, newItem.id)
                return newItem
                break;

            case 'Array':
                this.isValid2changeType(prevItem, currItem, itemId) && this.changeToArray(prevItem, currItem, itemId)
                break;

            case 'Object':
                this.isValid2changeType(prevItem, currItem, itemId) && this.changeToObject(prevItem, currItem, itemId)
                break;
        }
    }

    updateLabel(item) {
        const newItem = { ...item }
        newItem.key = cutStringFromSymbol(item.key, '.', true)
        newItem.id = this.generateNewItemId(item.id, item.key)
        newItem.label = createKeyValueString(item.key, item.value)
        console.log('updateLabel ', newItem)
        return newItem
    }

    changeToLeaf(prevItem, currItem) {
        let newItem = this.itemTemplate(currItem, 'Leaf')
        const itemId = newItem.id

        // check if prevItem was type of array or object
        // and check if  he has nodes to delete
        if (['Array', 'Object'].includes(prevItem._type)) {

            if (prevItem.items && prevItem.items.length > 0) {
                let dialog = createDialog({
                    title: i18n.methods.t('error'),
                    closeButton: true,
                    content: i18n.methods.t('messages.deleteNodes'),
                    buttons: ['cancel', 'confirm']
                })
                dialog.open()
                dialog.on({
                    'action:cancel': function () {
                        this.item(itemId, { ...prevItem })
                        dialog.close();
                    }.bind(this),
                    'action:confirm': function () {
                        this.item(itemId, newItem)
                        dialog.close();
                    }.bind(this)
                })
            } else {
                //else items is empty && type has been changed
                this.item(itemId, newItem)
                console.log('else items is empty && type has been changed')
            }
            return
        } else {
            //else type has been changed
            this.item(itemId, newItem)
            console.log('else, type has been changed')
        }
    }

    changeToArray(prevItem, currItem, itemId) {

        const newItem = this.itemTemplate(currItem, 'Array')
        this.item(itemId, newItem)
    }

    changeToObject(prevItem, currItem, itemId) {
        const newItem = this.itemTemplate(currItem, 'Object')
        this.item(itemId, newItem)
    }
}


function warning(text) {
    return '<span style="color:#fe854f">' + text + '</span>';
}

const RecordView = shapes.standard.RecordView;

Object.assign(shapes, {
    mapping: {
        Record,
        RecordView
    }
});
