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