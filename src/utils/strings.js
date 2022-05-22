export function _replaceAll(string, target, replaceTo){
    if (string.indexOf(target) !== -1) {
        string = string.replaceAll(target, replaceTo)
    }
    return string
}

export function cutStringFromSymbol(string='', symbol, end){
    end = end ? end : string.length
    const index =  string.indexOf(symbol)
    return string.substring(index + 1, end)
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