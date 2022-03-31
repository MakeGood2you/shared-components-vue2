const createKeyValueString = (key, value) => {
    if (!['Array', 'Object'].includes(value.constructor.name))
        return `${key}: ${value.toString()}`
    else if (value.constructor.name === 'Object') return `${key}: Object`
    else if (value.constructor.name === 'Array') return `${key}: Array`
}


const transformObject = (obj = {}, path) => {
    debugger
    if (obj && typeof obj === 'object') {
        return Object.keys(obj).map((key) => {
            let label = createKeyValueString(key, obj[key])
            let items = transformObject(obj[key], path + key + '.');
            return items ? {
                label,
                id: path + key,
                items,
            } : {
                id: path + key,
                label
            };
        });
    } else {
        let label = ''
        Object.map(obj).forEach(e =>{
            debugger

        })
        // return {
        //     id: path + key,
        //     label
        // };
    }
};

let a = {
    'items' :
        {
            name:'arak',
            category:'anis',
            'item' :
                [
                    {
                        'id' : '0001',
                        'type' : 'donut',
                        'name' : 'Cake',
                        'ppu' : 0.55,
                        'batters' :
                            {
                                'batter' :
                                    [
                                        { 'id' : '1001', 'type' : 'Regular' },
                                        { 'id' : '1002', 'type' : 'Chocolate' },
                                        { 'id' : '1003', 'type' : 'Blueberry' },
                                        { 'id' : '1004', 'type' : 'Devil\'s Food' },
                                    ],
                            },
                        'topping' :
                            [
                                { 'id' : '5001', 'type' : 'None' },
                                { 'id' : '5002', 'type' : 'Glazed' },
                                { 'id' : '5005', 'type' : 'Sugar' },
                                { 'id' : '5007', 'type' : 'Powdered Sugar' },
                                { 'id' : '5006', 'type' : 'Chocolate with Sprinkles' },
                                { 'id' : '5003', 'type' : 'Chocolate' },
                                { 'id' : '5004', 'type' : 'Maple' },
                            ],
                    },
                ],
            'details' :
                [
                    {
                        'id' : '0001',
                        'type' : 'donut',
                        'name' : 'Cake',
                        'ppu' : 0.55,
                        'batters' :
                            {
                                'batter' :
                                    [
                                        { 'id' : '1001', 'type' : 'Regular' },
                                        { 'id' : '1002', 'type' : 'Chocolate' },
                                        { 'id' : '1003', 'type' : 'Blueberry' },
                                        { 'id' : '1004', 'type' : 'Devil\'s Food' },
                                    ],
                            },
                        'topping' :
                            [
                                { 'id' : '5001', 'type' : 'None' },
                                { 'id' : '5002', 'type' : 'Glazed' },
                                { 'id' : '5005', 'type' : 'Sugar' },
                                { 'id' : '5007', 'type' : 'Powdered Sugar' },
                                { 'id' : '5006', 'type' : 'Chocolate with Sprinkles' },
                                { 'id' : '5003', 'type' : 'Chocolate' },
                                { 'id' : '5004', 'type' : 'Maple' },
                            ],
                    },
                ],
        },
}
const unitTest = transformObject(a, '')
console.log(unitTest)