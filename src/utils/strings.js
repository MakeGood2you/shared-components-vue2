export function _replaceAll(string, target, replaceTo) {
    if (string.indexOf(target) !== -1) {
        string = string.replaceAll(target, replaceTo)
    }
    return string
}

export function cutStringFromSymbol(string = '', symbol, isReverse = false, end) {
    end = end ? end : string.length

    const index = isReverse ? string.lastIndexOf(symbol) : string.indexOf(symbol)

    return string.substring(index + 1, end)
}


export function deleteStringFromSymbol(string = '', symbol, start) {
    start = start ? start : 0
    const index = string.indexOf(symbol)
    if (index !== -1) return string.substring(start, index)
}

export function createKeyValueString(key, value) {
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