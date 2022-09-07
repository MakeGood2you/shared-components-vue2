export function setLabel(item) {
    return item.key + (!['Array', 'Object'].includes(item.value) ? ': ' + item.value || 'Empty' : '')
}

export function _replaceAll(string, target, replaceTo) {
    if (string.indexOf(target) !== -1) {
        string = string.replaceAll(target, replaceTo)
    }
    return string
}

export function cutStringFromSymbol(string = '', symbol, isReverse = false, end) {
    if (typeof string !== 'string') string = JSON.stringify(string)
    const index = isReverse ? string.lastIndexOf(symbol) : string.indexOf(symbol)

    if (index === -1) return string

    end = end ? end : string.length

    const symbolLength = symbol.length > 1 ? symbol.length : 1

    return string.substring(index + symbolLength, end)
}


export function deleteStringFromSymbol(string = '', symbol, start) {
    start = start ? start : 0
    const index = string.indexOf(symbol)
    if (index !== -1) return string.substring(start, index)
}

export function createKeyValueString(key, value) {
    const validation = ['Array', 'Object']

    if (!key) key = 'none'
    if (!value) value = ''

    if (!validation.includes(value.constructor.name)
        && !validation.includes(value)) return `${key}: ${value.toString()}`

    else if (validation.includes(value)) return `${key}`
    else if (validation.includes(value.constructor.name)) return `${key}`
}