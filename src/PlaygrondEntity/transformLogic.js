import { a } from './json';
let isObject = function (a) {
    return (!!a) && (a.constructor === Object);
};
let isArray = function (a) {
    return (!!a) && (a.constructor === Array);
};
function json2Shape(label, json, path = '') {
    let result = null;
    let option = null;
    if (isArray(json))
        option = 'Array';
    if (isObject(json))
        option = 'Object';
    else
        option = 'Leaf';
    return result;
}
let unitTest = json2Shape('label', a, '');
debugger;
console.log(unitTest);
//# sourceMappingURL=transformLogic.js.map